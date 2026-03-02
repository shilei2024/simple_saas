import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createServiceRoleClient } from "@/utils/supabase/service-role";

// GET - 获取用户积分（使用统一的customers表）
export async function GET() {
  try {
    const supabase = await createClient();
    
    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // 查询用户的customer记录
    const { data: customer, error } = await supabase
      .from('customers')
      .select(`
        *,
        credits_history (
          amount,
          type,
          created_at,
          description
        )
      `)
      .eq('user_id', user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          credits: {
            total_credits: 0,
            remaining_credits: 0,
            free_credits: 0,
            paid_credits: 0,
          }
        });
      }
      console.error('Error fetching customer data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch customer data' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      credits: {
        id: customer.id,
        user_id: customer.user_id,
        total_credits: customer.credits,
        remaining_credits: customer.credits,
        free_credits: customer.free_credits || 0,
        paid_credits: customer.paid_credits || 0,
        created_at: customer.created_at,
        updated_at: customer.updated_at
      }
    });
  } catch (error) {
    console.error('Credits API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - 消费积分（使用统一的customers表）
export async function POST(request: NextRequest) {
  try {
    const { amount, operation } = await request.json();
    
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid credit amount' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    
    // 获取当前用户
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: customer, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      console.error('Error fetching customer:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch customer data' },
        { status: 500 }
      );
    }

    const totalAvailable = (customer.free_credits || 0) + (customer.paid_credits || 0);
    if (totalAvailable < amount) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 400 }
      );
    }

    const freeToDeduct = Math.min(customer.free_credits || 0, amount);
    const paidToDeduct = amount - freeToDeduct;
    const creditType = freeToDeduct > 0 ? 'free' : 'paid';

    const newFreeCredits = (customer.free_credits || 0) - freeToDeduct;
    const newPaidCredits = (customer.paid_credits || 0) - paidToDeduct;
    const newCredits = newFreeCredits + newPaidCredits;

    // Use service role for ledger updates (paid lots) + balance update
    const service = createServiceRoleClient();
    const now = new Date().toISOString();

    // Consume paid credits from lots FIFO (Strategy C). Free credits remain direct.
    const consumedLotIds: string[] = [];
    if (paidToDeduct > 0) {
      for (let i = 0; i < paidToDeduct; i++) {
        const { data: lot } = await service
          .from("credit_lots")
          .select("id, remaining_credits")
          .eq("customer_id", customer.id)
          .is("refunded_at", null)
          .gt("remaining_credits", 0)
          .order("created_at", { ascending: true })
          .limit(1)
          .single();

        if (!lot) {
          return NextResponse.json(
            { error: "No paid credit lots available" },
            { status: 409 }
          );
        }

        const { data: updatedLot } = await service
          .from("credit_lots")
          .update({
            remaining_credits: lot.remaining_credits - 1,
            updated_at: now,
          })
          .eq("id", lot.id)
          .gt("remaining_credits", 0)
          .select("id")
          .single();

        if (!updatedLot?.id) {
          return NextResponse.json(
            { error: "Failed to reserve paid credits (race)" },
            { status: 409 }
          );
        }
        consumedLotIds.push(updatedLot.id);
      }
    }

    const { data: updatedCustomer, error: updateError } = await service
      .from("customers")
      .update({
        credits: newCredits,
        free_credits: newFreeCredits,
        paid_credits: newPaidCredits,
        updated_at: now,
      })
      .eq("id", customer.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return NextResponse.json(
        { error: 'Failed to update credits' },
        { status: 500 }
      );
    }

    const { error: historyError } = await service
      .from('credits_history')
      .insert({
        customer_id: customer.id,
        amount: amount,
        type: 'subtract',
        description: operation || 'letter_reply',
        metadata: {
          operation: operation,
          credit_type: creditType,
          free_deducted: freeToDeduct,
          paid_deducted: paidToDeduct,
          paid_lot_ids: consumedLotIds,
          credits_before: customer.credits,
          credits_after: newCredits
        }
      });

    if (historyError) {
      console.error('Error recording credit transaction:', historyError);
    }

    return NextResponse.json({ 
      credits: {
        id: updatedCustomer.id,
        user_id: updatedCustomer.user_id,
        total_credits: updatedCustomer.credits,
        remaining_credits: updatedCustomer.credits,
        free_credits: updatedCustomer.free_credits || 0,
        paid_credits: updatedCustomer.paid_credits || 0,
        created_at: updatedCustomer.created_at,
        updated_at: updatedCustomer.updated_at
      },
      success: true 
    });
  } catch (error) {
    console.error('Credits spend API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}