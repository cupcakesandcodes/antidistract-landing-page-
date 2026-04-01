import { NextResponse } from 'next/server';
import { supabase, getServiceSupabase } from '@/lib/supabase';

// Helper to check authentication from request headers
export async function authenticateRequest(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { error: 'Missing or invalid authorization header', status: 401 };
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
        return { error: 'Invalid token', status: 401 };
    }

    return { user, token };
}

export async function GET(request: Request) {
    try {
        const auth = await authenticateRequest(request);
        if (auth.error || !auth.user) {
            return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: auth.status || 401 });
        }

        const { user } = auth;
        const serviceSupabase = getServiceSupabase();

        // Fetch profile
        const { data: profile } = await serviceSupabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                subscriptionTier: profile?.subscription_tier || 'free',
                usage: {
                    aiChecksToday: profile?.ai_checks_today || 0,
                    limit: profile?.subscription_tier === 'premium' ? Number(process.env.PREMIUM_TIER_DAILY_LIMIT || 150) : 10
                }
            }
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
