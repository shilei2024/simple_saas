import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { creem } from '@/lib/creem';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, productType, credits, replyTier } = body;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const origin = request.headers.get('origin') || process.env.BASE_URL || 'https://mindfulpenpal.com';
    const successUrl = process.env.CREEM_SUCCESS_URL || `${origin}/dashboard`;

    const checkout = await creem.checkouts.create({
      productId,
      customer: {
        email: user.email || '',
      },
      successUrl,
      metadata: {
        user_id: user.id,
        product_type: productType,
        credits: credits || 0,
        reply_tier: replyTier || (productType === 'credits' ? 'paid_credits' : 'monthly_subscription'),
      }
    });

    return NextResponse.json({ checkoutUrl: checkout.checkoutUrl });

  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
