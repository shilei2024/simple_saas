import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

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

    const { data: updatedCustomer, error: updateError } = await supabase
      .from('customers')
      .update({
        credits: newCredits,
        free_credits: newFreeCredits,
        paid_credits: newPaidCredits,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating credits:', updateError);
      return NextResponse.json(
        { error: 'Failed to update credits' },
        { status: 500 }
      );
    }

    const { error: historyError } = await supabase
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