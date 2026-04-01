'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const API_BASE = '/api';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // ── OAuth Token Capture ──
        const hash = window.location.hash;
        if (hash) {
            const params = new URLSearchParams(hash.replace('#', '?'));
            const token = params.get('access_token') || params.get('token');
            if (token) {
                localStorage.setItem('fg_token', token);
                window.history.replaceState(null, '', window.location.pathname);
            }
        }

        const token = localStorage.getItem('fg_token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        fetchData(token);
    }, []);

    const fetchData = async (token: string) => {
        try {
            const [userRes, statsRes] = await Promise.all([
                fetch(`${API_BASE}/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_BASE}/stats/historical`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);

            if (userRes.status === 401) {
                localStorage.removeItem('fg_token');
                window.location.href = '/login';
                return;
            }

            const userData = await userRes.json();
            const statsData = await statsRes.json();

            setUser(userData.user);
            setStats(statsData);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('fg_token');
        window.location.href = '/';
    };

    if (isLoading) return <div className="loading">Initializing Secure Session...</div>;

    return (
        <div className="dashboard-page">
            {/* NAVBAR */}
            <nav className="dashboard-nav">
                <div className="nav-container">
                    <Link href="/" className="logo">
                        <span className="logo-icon">⚡</span>
                        <span className="logo-text">FocusGuard</span>
                    </Link>
                    <div className="user-profile">
                        <span className="user-email">{user?.email}</span>
                        <button onClick={handleLogout} className="logout-btn">Logout</button>
                    </div>
                </div>
            </nav>

            <div className="dashboard-container">
                {/* SIDEBAR */}
                <aside className="sidebar">
                    <nav className="sidebar-nav">
                        <button className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
                            <span className="sidebar-icon">📊</span> Overview
                        </button>
                        <button className={`sidebar-link ${activeTab === 'activity' ? 'active' : ''}`} onClick={() => setActiveTab('activity')}>
                            <span className="sidebar-icon">📅</span> History
                        </button>
                        <button className={`sidebar-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
                            <span className="sidebar-icon">⚙️</span> Settings
                        </button>
                    </nav>
                </aside>

                {/* MAIN CONTENT */}
                <main className="main-content">
                    {activeTab === 'overview' && (
                        <OverviewTab stats={stats} />
                    )}
                    {activeTab === 'activity' && (
                        <HistoryTab sessions={stats?.sessions || []} />
                    )}
                    {activeTab === 'settings' && (
                        <SettingsTab user={user} />
                    )}
                </main>
            </div>

            <style jsx>{`
                .dashboard-page { min-height: 100vh; background: #080b12; color: #f1f5f9; }
                .loading { display: grid; place-items: center; min-height: 100vh; color: var(--accent); font-weight: 700; }
                
                .dashboard-nav { height: 64px; border-bottom: 1px solid rgba(255,255,255,0.05); padding: 0 40px; display: flex; align-items: center; }
                .nav-container { max-width: 1400px; margin: 0 auto; width: 100%; display: flex; justify-content: space-between; align-items: center; }
                .logo { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 1.1rem; text-decoration: none; color: #fff; }
                .logo-icon { width: 30px; height: 30px; background: var(--accent); border-radius: 8px; display: grid; place-items: center; font-size: 14px; }
                .user-profile { display: flex; align-items: center; gap: 20px; }
                .user-email { font-size: 0.85rem; color: #888; }
                .logout-btn { background: none; border: 1px solid #333; color: #888; padding: 6px 14px; border-radius: 6px; cursor: pointer; font-size: 0.8rem; }
                .logout-btn:hover { color: #fff; border-color: #555; }

                .dashboard-container { display: flex; max-width: 1400px; margin: 0 auto; min-height: calc(100vh - 64px); }
                .sidebar { width: 240px; border-right: 1px solid rgba(255,255,255,0.05); padding: 32px 16px; }
                .sidebar-nav { display: flex; flex-direction: column; gap: 8px; }
                .sidebar-link { 
                    display: flex; align-items: center; gap: 12px; padding: 12px 16px; 
                    background: none; border: none; color: #888; border-radius: 10px;
                    cursor: pointer; font-size: 0.95rem; font-weight: 500; text-align: left;
                    transition: all 0.2s;
                }
                .sidebar-link:hover { background: rgba(255,255,255,0.03); color: #fff; }
                .sidebar-link.active { background: rgba(99, 102, 241, 0.1); color: var(--accent); font-weight: 700; }
                .sidebar-icon { font-size: 1.1rem; }

                .main-content { flex: 1; padding: 48px; }
            `}</style>
        </div>
    );
}

function OverviewTab({ stats }: any) {
    const totalGoals = stats?.summary?.totalSessions || 0;
    const totalSeconds = stats?.summary?.totalDuration || 0;
    const totalInterruptions = stats?.summary?.totalInterruptions || 0;
    const focusScore = totalGoals > 0 ? Math.round((totalGoals / (totalGoals + totalInterruptions / 5)) * 100) : 0;

    return (
        <section>
            <div className="header">
                <h1>Productivity Overview</h1>
                <p>Analytics from your last {stats?.sessions?.length || 0} sessions.</p>
            </div>

            <div className="stats-grid">
                <StatCard label="Total Focus Sessions" value={totalGoals} trend="+4 this week" />
                <StatCard label="Hours Focused" value={(totalSeconds / 3600).toFixed(1)} trend="Deep work peak" />
                <StatCard label="Focus Score" value={`${focusScore}%`} progress={focusScore} />
                <StatCard label="Interruptions" value={totalInterruptions} trend="-12% vs last week" />
            </div>

            <div className="charts-row">
                <div className="card wide">
                    <h3>Recent Activity</h3>
                    <div className="sessions-list">
                        {(stats?.sessions || []).slice(0, 5).map((s: any, i: number) => (
                            <div key={i} className="session-item">
                                <div className="session-info">
                                    <span className="session-goal">{s.goal_text}</span>
                                    <span className="session-date">{new Date(s.start_time).toLocaleDateString()}</span>
                                </div>
                                <div className="session-meta">
                                    <span className={`status-pill ${s.status === 'completed' ? 'v' : 'x'}`}>
                                        {s.status}
                                    </span>
                                    <span>{Math.round(s.duration_seconds / 60)}m</span>
                                </div>
                            </div>
                        ))}
                        {(!stats?.sessions || stats.sessions.length === 0) && (
                            <div className="empty">No recent focus sessions.</div>
                        )}
                    </div>
                </div>
                <div className="card">
                    <h3>Top Distractions</h3>
                    <div className="distractions">
                        {stats?.topSites?.length > 0 ? (
                            stats.topSites.map((s: any, i: number) => (
                                <div key={i} className="distraction-item">
                                    <span className="site-domain">{s.domain}</span>
                                    <div className="bar-bg"><div className="bar-fill" style={{width: `${(s.count / stats.topSites[0].count) * 100}%`}}></div></div>
                                </div>
                            ))
                        ) : (
                            <div className="empty">No distraction data yet.</div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                h1 { font-size: 2rem; font-weight: 800; margin-bottom: 8px; }
                p { color: #555; margin-bottom: 40px; }
                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
                .charts-row { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
                .card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 24px; }
                h3 { font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: #555; margin-bottom: 24px; }
                
                .session-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: rgba(0,0,0,0.2); border-radius: 12px; margin-bottom: 12px; }
                .session-goal { display: block; font-weight: 600; font-size: 0.95rem; }
                .session-date { font-size: 0.75rem; color: #555; }
                .session-meta { display: flex; align-items: center; gap: 16px; font-size: 0.85rem; }
                .status-pill { padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }
                .status-pill.v { background: rgba(34, 197, 94, 0.1); color: #22c55e; }

                .distraction-item { margin-bottom: 16px; }
                .site-domain { font-size: 0.85rem; color: #aaa; display: block; margin-bottom: 4px; }
                .bar-bg { height: 6px; background: #222; border-radius: 99px; overflow: hidden; }
                .bar-fill { height: 100%; background: var(--accent); border-radius: 99px; }
                .empty { color: #444; font-size: 0.9rem; text-align: center; padding: 40px 0; }
            `}</style>
        </section>
    );
}

function StatCard({ label, value, trend, progress }: any) {
    return (
        <div className="stat-card">
            <span className="label">{label}</span>
            <div className="value">{value}</div>
            {progress !== undefined ? (
                <div className="progress-bar"><div className="fill" style={{width: `${progress}%`}}></div></div>
            ) : (
                <div className="trend">{trend}</div>
            )}
            <style jsx>{`
                .stat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 24px; border-radius: 20px; }
                .label { font-size: 0.8rem; color: #555; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
                .value { font-size: 2.2rem; font-weight: 900; margin: 8px 0; letter-spacing: -1px; }
                .trend { font-size: 0.75rem; color: var(--accent); font-weight: 600; }
                .progress-bar { height: 4px; background: #222; border-radius: 99px; margin-top: 12px; }
                .fill { height: 100%; background: var(--accent); border-radius: 99px; }
            `}</style>
        </div>
    );
}

function HistoryTab({ sessions }: any) {
    return (
        <section>
            <h1>Goal History</h1>
            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Goal</th>
                            <th>Duration</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((s: any, i: number) => (
                            <tr key={i}>
                                <td>{new Date(s.start_time).toLocaleDateString()}</td>
                                <td className="goal-cell">{s.goal_text}</td>
                                <td>{Math.round(s.duration_seconds / 60)} mins</td>
                                <td>
                                    <span className={`status-tag ${s.status}`}>
                                        {s.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <style jsx>{`
                .table-wrap { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; overflow: hidden; margin-top: 32px; }
                table { width: 100%; border-collapse: collapse; }
                th { text-align: left; padding: 16px 24px; background: rgba(0,0,0,0.2); font-size: 0.8rem; color: #555; text-transform: uppercase; }
                td { padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.95rem; }
                .goal-cell { font-weight: 600; }
                .status-tag { padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
                .status-tag.completed { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
            `}</style>
        </section>
    );
}

function SettingsTab({ user }: any) {
    return (
        <section>
            <h1>Settings</h1>
            <div className="settings-grid">
                <div className="card">
                    <h3>Account Info</h3>
                    <div className="info-row">
                        <span>Email:</span>
                        <strong>{user?.email}</strong>
                    </div>
                    <div className="info-row">
                        <span>Plan:</span>
                        <strong className="premium-text">{user?.subscriptionTier}</strong>
                    </div>
                    <div className="usage">
                        <div className="usage-label">AI Checks Today</div>
                        <div className="usage-bar"><div className="fill" style={{width: `${(user?.usage?.aiChecksToday / user?.usage?.limit) * 100}%`}}></div></div>
                        <div className="usage-vals">{user?.usage?.aiChecksToday} / {user?.usage?.limit}</div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                .card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 32px; max-width: 500px; }
                h3 { font-size: 0.9rem; text-transform: uppercase; color: #555; margin-bottom: 24px; }
                .info-row { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 1rem; }
                .premium-text { color: var(--gold); text-transform: uppercase; }
                .usage { margin-top: 32px; }
                .usage-label { font-size: 0.8rem; color: #555; margin-bottom: 8px; }
                .usage-bar { height: 6px; background: #222; border-radius: 99px; overflow: hidden; }
                .usage-bar .fill { height: 100%; background: var(--accent); }
                .usage-vals { font-size: 0.8rem; text-align: right; margin-top: 8px; color: #888; }
            `}</style>
        </section>
    );
}
