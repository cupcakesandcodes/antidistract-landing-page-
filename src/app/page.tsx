'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        
        // Client-side execution only
        setToken(localStorage.getItem('fg_token'));
        
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="landing-wrap">
            {/* NAVBAR */}
            <nav className={`nav ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nav-inner">
                    <Link href="/" className="nav-logo">
                        <div className="logo-icon">⚡</div>
                        <span>FocusGuard</span>
                    </Link>
                    <ul className="nav-links">
                        <li><a href="#features">Features</a></li>
                        <li><a href="#how-it-works" onClick={(e) => { e.preventDefault(); document.getElementById('dashboard-preview')?.scrollIntoView({ behavior: 'smooth' })}}>Dashboard Preview</a></li>
                        <li><a href="#pricing">Pricing</a></li>
                        {token && <li><Link href="/dashboard" style={{color: 'var(--accent)'}}>Your Profile</Link></li>}
                    </ul>
                    {token ? (
                        <Link href="/dashboard" className="nav-cta">Go to Dashboard</Link>
                    ) : (
                        <Link href="/login" className="nav-cta">Get Started</Link>
                    )}
                </div>
            </nav>

            {/* HERO */}
            <section className="hero" id="hero">
                <div className="hero-bg-glow"></div>
                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-dot"></span>
                        AI-Powered Focus Tool
                    </div>
                    <h1 className="hero-title">
                        Stop scrolling.<br/>
                        <span className="gradient-text">Start doing.</span>
                    </h1>
                    <p className="hero-subtitle">
                        FocusGuard is the Chrome extension that blocks distractions intelligently, 
                        runs focus sessions, and uses AI to make sure you're actually 
                        watching what matters — not what the algorithm wants.
                    </p>
                    <div className="hero-actions">
                        <a href="#pricing" className="btn-primary">
                            Get FocusGuard Free
                            <span className="btn-arrow">→</span>
                        </a>
                        <a href="#how-it-works" className="btn-ghost">See how it works</a>
                    </div>
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-num">11</span>
                            <span className="stat-label">Platforms Supported</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-num">4</span>
                            <span className="stat-label">Focus Modes</span>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat">
                            <span className="stat-num">AI</span>
                            <span className="stat-label">Content Scanning</span>
                        </div>
                    </div>
                </div>
                <div className="hero-visual">
                    <div className="ext-mockup">
                        <div className="ext-header">
                            <div className="ext-dots">
                                <span></span><span></span><span></span>
                            </div>
                            <span className="ext-title">FocusGuard</span>
                        </div>
                        <div className="ext-body">
                            <div className="ext-input-mockup">
                                <span className="ext-input-label">I want to learn React today</span>
                            </div>
                            <div className="ext-session-row">
                                <div className="ext-session-chip active">25 min · Pomodoro</div>
                                <div className="ext-session-chip">60 min</div>
                                <div className="ext-session-chip">90 min</div>
                            </div>
                            <button className="ext-session-btn">▶ Start Focus Session</button>
                            <div className="ext-toggles">
                                <div className="ext-toggle-row">
                                    <span>Tunnel Vision</span>
                                    <div className="ext-toggle on"><div className="ext-thumb"></div></div>
                                </div>
                                <div className="ext-toggle-row">
                                    <span>The Silencer</span>
                                    <div className="ext-toggle on"><div className="ext-thumb"></div></div>
                                </div>
                                <div className="ext-toggle-row">
                                    <span>AI Monitor</span>
                                    <div className="ext-toggle on"><div className="ext-thumb"></div></div>
                                </div>
                            </div>
                        </div>
                        <div className="ai-scan-overlay">
                            <div className="ai-scan-ring"></div>
                            <span className="ai-scan-label">✓ On-topic</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* PLATFORMS */}
            <section className="platforms-section">
                <p className="platforms-label">Works on every platform that distracts you</p>
                <div className="platforms-strip">
                    {["▶ YouTube", "📘 Facebook", "📸 Instagram", "𝕏 Twitter / X", "🤿 Reddit", "💼 LinkedIn", "🎵 TikTok", "🎮 Twitch", "🎬 Netflix", "💬 Discord", "📌 Pinterest"].map((p, i) => (
                        <div key={i} className="platform-pill">{p}</div>
                    ))}
                </div>
            </section>

            {/* FEATURES */}
            <section className="features" id="features">
                <div className="section-header">
                    <span className="section-tag">Features</span>
                    <h2>Built for people who <em>actually</em> want to focus</h2>
                    <p>Not another tab blocker. FocusGuard is an intelligent system that adapts to your goal.</p>
                </div>
                <div className="features-grid">
                    <FeatureCard 
                        icon="🌀" 
                        title="Tunnel Vision Mode" 
                        desc="Strips away sidebars, recommendations, comments, and all UI distractions — leaving only the content that matters." 
                        tag="Free" 
                        large
                    />
                    <FeatureCard 
                        icon="🔇" 
                        title="The Silencer" 
                        desc="Kills autoplay, auto-notifications, and sound from distraction sites the moment you start a session." 
                        tag="Free" 
                    />
                    <FeatureCard 
                        icon="🩶" 
                        title="Grayscale Mode" 
                        desc="Turns addictive feeds into flat grey. Proven to reduce mindless scroll time." 
                        tag="Free" 
                    />
                    <FeatureCard 
                        icon="🤖" 
                        title="AI Content Monitor" 
                        desc="Tell FocusGuard your goal, and it reads the content. If it doesn't match — it flags it." 
                        tag="✦ Premium" 
                        highlight
                    />
                    <FeatureCard 
                        icon="⏱️" 
                        title="Focus Sessions" 
                        desc="Built-in Pomodoro and deep work blocks. Set it and go." 
                        tag="Free" 
                    />
                </div>
            </section>

            {/* DASHBOARD PREVIEW */}
            <section className="dashboard-preview" id="dashboard-preview">
                <div className="section-header">
                    <span className="section-tag">New</span>
                    <h2>Visualize your progress</h2>
                    <p>The built-in dashboard tracks your wins, so you don't have to.</p>
                </div>
                <div className="dashboard-container">
                    <div className="dashboard-mock">
                        <div className="db-header">
                            <div className="db-tabs">
                                <span className="db-tab">Focus</span>
                                <span className="db-tab active">Dashboard</span>
                            </div>
                        </div>
                        <div className="db-body">
                            <div className="db-stats">
                                <div className="db-stat">
                                    <span className="db-val">12</span>
                                    <span className="db-lbl">Goals Hit</span>
                                </div>
                                <div className="db-stat">
                                    <span className="db-val">3</span>
                                    <span className="db-lbl">Interrupted</span>
                                </div>
                            </div>
                            <div style={{marginTop: '20px'}}>
                                <div className="db-chart-title">Today's Distractions</div>
                                <div className="db-site-item"><span className="db-site-name">reddit.com</span><div className="db-bar"><div className="db-bar-fill" style={{width: '85%'}}></div></div></div>
                                <div className="db-site-item"><span className="db-site-name">youtube.com</span><div className="db-bar"><div className="db-bar-fill" style={{width: '40%'}}></div></div></div>
                                <div className="db-site-item"><span className="db-site-name">twitter.com</span><div className="db-bar"><div className="db-bar-fill" style={{width: '25%'}}></div></div></div>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-text">
                        <div className="text-block">
                            <h4>Daily Trends</h4>
                            <p>See exactly where your time goes and how many goals you've crushed this week.</p>
                        </div>
                        <div className="text-block">
                            <h4>Interruption Tracking</h4>
                            <p>Learn your triggers. FocusGuard tells you when and where you get distracted most.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRICING */}
            <section className="pricing" id="pricing">
                <div className="section-header">
                    <span className="section-tag">Pricing</span>
                    <h2>Start free. Go premium when you're ready.</h2>
                </div>
                <div className="pricing-cards">
                    <div className="pricing-card">
                        <div className="plan-name">Free</div>
                        <div className="plan-price">
                            <span className="price-num">$0</span>
                            <span className="price-period">forever</span>
                        </div>
                        <ul className="plan-features">
                            <li>✓ Focus sessions</li>
                            <li>✓ Tunnel Vision Mode</li>
                            <li>✓ The Silencer</li>
                            <li>✓ Grayscale Mode</li>
                        </ul>
                        <Link href="/login" className="btn-ghost" style={{width: '100%', justifyContent: 'center'}}>Install Free →</Link>
                    </div>
                    <div className="pricing-card pricing-card-premium">
                        <div className="plan-badge">Most Popular</div>
                        <div className="plan-name">Premium</div>
                        <div className="plan-price">
                            <span className="price-num">$4.99</span>
                            <span className="price-period">/ month</span>
                        </div>
                        <ul className="plan-features">
                            <li>✓ Everything in Free</li>
                            <li>✓ AI Content Monitor</li>
                            <li>✓ 1,000 AI scans / day</li>
                        </ul>
                        <button className="btn-primary" style={{width: '100%', justifyContent: 'center'}}>Get Premium →</button>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="faq" id="faq">
                <div className="section-header">
                    <h2>Common questions</h2>
                </div>
                <div className="faq-list">
                    <FAQItem q="Do I need an account?" a="No account needed for free features. An account is only required for AI features." />
                    <FAQItem q="How does the AI work?" a="It analyzes the content you're viewing in real-time to ensure it matches your goal." />
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-brand">
                        <div className="nav-logo">
                            <div className="logo-icon">⚡</div>
                            <span>FocusGuard</span>
                        </div>
                        <p>© 2025 FocusGuard. Built to help you focus.</p>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .nav {
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    height: 80px;
                    display: flex;
                    align-items: center;
                    padding: 0 40px;
                    z-index: 1000;
                    transition: all 0.3s;
                }
                .nav.scrolled {
                    background: rgba(8, 11, 18, 0.8);
                    backdrop-filter: blur(12px);
                    border-bottom: 1px solid var(--border);
                }
                .nav-inner {
                    max-width: 1200px;
                    margin: 0 auto;
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .nav-logo { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 1.2rem; }
                .logo-icon { 
                    width: 32px; height: 32px; background: var(--accent); 
                    border-radius: 8px; display: grid; place-items: center; 
                }
                .nav-links { display: flex; list-style: none; gap: 32px; }
                .nav-links a { color: var(--text-dim); font-weight: 500; font-size: 0.95rem; }
                .nav-links a:hover { color: #fff; }
                .nav-cta { background: var(--accent); padding: 10px 20px; border-radius: 8px; font-weight: 600; }

                .landing-wrap { padding-top: 80px; }
                .hero { 
                    min-height: 80vh; display: flex; align-items: center; gap: 60px; 
                    max-width: 1200px; margin: 0 auto; padding: 100px 40px;
                }
                .hero-content { flex: 1; }
                .hero-badge { 
                    display: inline-flex; align-items: center; gap: 8px; 
                    background: rgba(99, 102, 241, 0.1); border: 1px solid rgba(99, 102, 241, 0.2);
                    padding: 6px 12px; border-radius: 99px; font-size: 0.8rem; font-weight: 700; color: #a5b4fc;
                    margin-bottom: 32px;
                }
                .hero-title { font-size: 4rem; line-height: 1.1; margin-bottom: 24px; font-weight: 900; }
                .hero-subtitle { font-size: 1.2rem; color: var(--text-dim); margin-bottom: 40px; }
                .hero-actions { display: flex; gap: 16px; align-items: center; margin-bottom: 60px; }
                .hero-stats { display: flex; gap: 40px; align-items: center; }
                .stat-num { font-size: 2rem; font-weight: 900; color: var(--accent); display: block; }
                .stat-label { font-size: 0.8rem; color: var(--text-muted); }
                .stat-divider { width: 1px; height: 40px; background: var(--border); }

                .hero-visual { flex: 0 0 320px; }
                .ext-mockup { 
                    background: var(--bg-card); border: 1px solid var(--border-glow); 
                    border-radius: 20px; box-shadow: 0 30px 60px rgba(0,0,0,0.5); overflow: hidden;
                    position: relative;
                }
                .ext-header { padding: 14px; background: rgba(255,255,255,0.03); border-bottom: 1px solid var(--border); display: flex; gap: 12px; align-items: center; }
                .ext-dots { display: flex; gap: 6px; }
                .ext-dots span { width: 8px; height: 8px; border-radius: 50%; background: #444; }
                .ext-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
                .ext-input-mockup { background: rgba(0,0,0,0.3); padding: 12px; border-radius: 8px; border: 1px solid var(--border); color: #888; font-size: 0.85rem; }
                .ext-session-row { display: flex; gap: 8px; }
                .ext-session-chip { padding: 6px 12px; border-radius: 6px; background: #222; font-size: 0.75rem; color: #666; }
                .ext-session-chip.active { background: var(--accent); color: #fff; }
                .ext-session-btn { background: #fff; color: #000; border: none; padding: 10px; border-radius: 8px; font-weight: 700; width: 100%; }
                .ext-toggle-row { display: flex; justify-content: space-between; font-size: 0.85rem; color: #888; }
                .ext-toggle { width: 34px; height: 18px; border-radius: 99px; background: #333; position: relative; }
                .ext-toggle.on { background: var(--accent); }
                .ext-thumb { width: 14px; height: 14px; background: #fff; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: all 0.2s; }
                .ext-toggle.on .ext-thumb { left: 18px; }
                .ai-scan-overlay {
                    position: absolute; bottom: -10px; right: -10px; background: #111; border: 1px solid #333;
                    padding: 8px 12px; border-radius: 12px; display: flex; align-items: center; gap: 8px;
                }
                .ai-scan-ring { width: 16px; height: 16px; border: 2px solid var(--accent); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                .ai-scan-label { font-size: 0.75rem; color: var(--accent); font-weight: 700; }

                .platforms-section { text-align: center; padding: 60px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin: 80px 0; }
                .platforms-label { font-size: 0.85rem; color: #555; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; }
                .platforms-strip { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
                .platform-pill { padding: 8px 16px; border-radius: 99px; border: 1px solid var(--border); font-size: 0.85rem; color: #888; }

                .features { max-width: 1200px; margin: 0 auto; padding: 100px 40px; }
                .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
                
                .dashboard-preview { max-width: 1200px; margin: 0 auto; padding: 100px 40px; }
                .dashboard-container { display: flex; gap: 60px; align-items: center; margin-top: 60px; }
                .dashboard-mock { flex: 1; background: #0b0e17; border: 1px solid var(--border); border-radius: 20px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.6); }
                .db-header { border-bottom: 1px solid var(--border); padding: 0 20px; display: flex; align-items: flex-end; height: 60px; background: rgba(0,0,0,0.2); }
                .db-tabs { display: flex; gap: 24px; }
                .db-tab { padding: 16px 0; font-size: 0.9rem; color: #666; font-weight: 500; cursor: pointer; border-bottom: 2px solid transparent; }
                .db-tab.active { color: var(--accent); border-bottom-color: var(--accent); }
                .db-body { padding: 30px; }
                .db-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .db-stat { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; }
                .db-val { font-size: 2rem; font-weight: 800; color: #fff; }
                .db-lbl { font-size: 0.85rem; color: #888; text-transform: uppercase; font-weight: 600; margin-top: 4px; }
                .db-chart-title { font-size: 1rem; font-weight: 700; margin-bottom: 16px; color: #fff; }
                .db-site-item { display: flex; align-items: center; gap: 16px; margin-bottom: 12px; }
                .db-site-name { width: 100px; font-size: 0.85rem; color: #aaa; text-align: right; }
                .db-bar { flex: 1; height: 10px; background: rgba(255,255,255,0.05); border-radius: 99px; overflow: hidden; }
                .db-bar-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #818cf8); border-radius: 99px; }
                .dashboard-text { flex: 0 0 400px; display: flex; flex-direction: column; gap: 40px; }
                .text-block h4 { font-size: 1.2rem; font-weight: 700; color: #fff; margin-bottom: 12px; }
                .text-block p { color: var(--text-dim); line-height: 1.6; }

                .pricing { max-width: 1000px; margin: 0 auto; padding: 100px 40px; }
                .pricing-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 60px; }
                .pricing-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 24px; padding: 40px; position: relative; }
                .pricing-card-premium { border-color: var(--accent); background: linear-gradient(135deg, #0d1120, #1a1a3a); }
                .plan-badge { background: var(--accent); color: #fff; padding: 4px 12px; border-radius: 99px; font-size: 0.75rem; font-weight: 700; position: absolute; top: -12px; left: 40px; }
                .plan-name { font-size: 1.2rem; font-weight: 700; color: #888; margin-bottom: 12px; }
                .plan-price { font-size: 3rem; font-weight: 900; margin-bottom: 32px; display: flex; align-items: baseline; gap: 8px; }
                .price-period { font-size: 1rem; color: #555; }
                .plan-features { list-style: none; margin-bottom: 40px; }
                .plan-features li { display: flex; gap: 12px; color: #aaa; margin-bottom: 12px; }

                .faq { max-width: 800px; margin: 0 auto; padding: 100px 40px; }
                .faq-list { margin-top: 60px; }
                
                .footer { border-top: 1px solid var(--border); padding: 80px 40px; }
                .footer-inner { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; }
                .footer-brand p { color: #555; font-size: 0.9rem; margin-top: 12px; }
            `}</style>
        </div>
    );
}

function FeatureCard({ icon, title, desc, tag, large, highlight }: any) {
    return (
        <div className={`feature-card ${large ? 'card-large' : ''} ${highlight ? 'card-highlight' : ''}`}>
            <span className="icon">{icon}</span>
            <h3>{title}</h3>
            <p>{desc}</p>
            <span className="tag">{tag}</span>
            <style jsx>{`
                .feature-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: 20px; padding: 32px; transition: all 0.3s; }
                .feature-card:hover { border-color: var(--accent); transform: translateY(-4px); }
                .card-large { grid-column: span 2; }
                .card-highlight { background: rgba(99, 102, 241, 0.05); border-color: rgba(99, 102, 241, 0.2); }
                .icon { font-size: 2.5rem; display: block; margin-bottom: 16px; }
                h3 { font-size: 1.3rem; margin-bottom: 12px; }
                p { color: var(--text-dim); font-size: 0.95rem; }
                .tag { display: inline-block; margin-top: 20px; color: var(--accent); font-weight: 700; font-size: 0.75rem; text-transform: uppercase; }
            `}</style>
        </div>
    );
}

function FAQItem({ q, a }: any) {
    const [open, setOpen] = useState(false);
    return (
        <div className="faq-item">
            <button className="faq-q" onClick={() => setOpen(!open)}>{q}</button>
            {open && <div className="faq-a">{a}</div>}
            <style jsx>{`
                .faq-item { border-bottom: 1px solid var(--border); }
                .faq-q { width: 100%; padding: 24px 0; text-align: left; background: none; border: none; color: #fff; font-size: 1.1rem; font-weight: 600; cursor: pointer; }
                .faq-a { padding-bottom: 24px; color: var(--text-dim); }
            `}</style>
        </div>
    );
}
