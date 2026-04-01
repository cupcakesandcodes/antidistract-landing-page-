import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateRequest } from '@/app/api/auth/me/route';

export async function GET(request: Request) {
    try {
        const auth = await authenticateRequest(request);
        if (auth.error || !auth.user) {
            return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: auth.status || 401 });
        }

        const userId = auth.user.id;

        // Fetch session history
        const { data: sessions, error: sessionsError } = await supabase
            .from('focus_sessions')
            .select('*')
            .eq('user_id', userId)
            .order('start_time', { ascending: false })
            .limit(100);

        if (sessionsError) {
             console.error('Sessions DB Error:', sessionsError);
        }

        // Fetch site activity (distractions)
        const { data: activity } = await supabase
            .from('site_activity')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(200);

        // Calculate totals dynamically from sessions
        let totalSessions = 0;
        let totalDuration = 0;
        let totalInterruptions = 0;

        if (sessions && Array.isArray(sessions)) {
            sessions.forEach(s => {
                totalSessions++;
                totalDuration += (s.duration_seconds || 0);
                totalInterruptions += (s.interruptions || 0);
            });
        }

        // Calculate top distractions using site activity
        const siteCounts: Record<string, number> = {};
        if (activity && Array.isArray(activity)) {
            activity.forEach(a => {
                siteCounts[a.hostname] = (siteCounts[a.hostname] || 0) + a.visit_count;
            });
        }
        
        const topSites = Object.entries(siteCounts)
            .map(([domain, count]) => ({ domain, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        return NextResponse.json({
            summary: {
                totalSessions,
                totalDuration,
                totalInterruptions,
            },
            sessions: sessions || [],
            topSites
        });

    } catch (error) {
        console.error('Stats fetch error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
