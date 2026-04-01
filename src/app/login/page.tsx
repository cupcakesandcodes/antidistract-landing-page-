'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            
            if (error) {
                setError(error.message || 'Login failed. Please check your credentials.');
            } else if (data.session) {
                localStorage.setItem('fg_token', data.session.access_token);
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setError('Connection error. Is the backend running?');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`
                }
            });
            if (error) {
                setError(error.message);
            }
        } catch (err) {
            setError('Could not initiate Google login');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link href="/" className="nav-logo" style={{justifyContent: 'center', marginBottom: '32px'}}>
                    <div className="logo-icon">⚡</div>
                    <span>FocusGuard</span>
                </Link>
                <h1>Welcome Back</h1>
                <p className="subtitle">Log in to view your productivity analysis.</p>

                <form onSubmit={handleLogin}>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        className="auth-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="auth-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    <button type="submit" className="btn-primary" disabled={isLoading} style={{width: '100%', justifyContent: 'center'}}>
                        {isLoading ? 'Logging in...' : 'Log In'}
                    </button>
                </form>

                <div className="divider">
                    <hr /> <span>or</span> <hr />
                </div>

                <button onClick={handleGoogleLogin} className="btn-ghost" style={{width: '100%', justifyContent: 'center', gap: '12px', background: '#fff', color: '#000'}}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="Google" />
                    Sign in with Google
                </button>

                {error && <p className="error-msg">{error}</p>}

                <div className="footer-links">
                    Don't have an account? <br />
                    <Link href="/#pricing">Install the extension to get started</Link>
                </div>
            </div>

            <style jsx>{`
                .auth-page {
                    min-height: 100vh; background: #0a0a0a;
                    display: grid; place-items: center; padding: 20px;
                }
                .auth-card {
                    background: var(--bg-card); border: 1px solid var(--border);
                    padding: 48px; border-radius: 32px; width: 100%; max-width: 440px;
                    text-align: center; box-shadow: 0 40px 100px rgba(0,0,0,0.6);
                }
                h1 { font-size: 1.8rem; font-weight: 800; margin-bottom: 8px; }
                .subtitle { color: var(--text-dim); font-size: 0.95rem; margin-bottom: 32px; }
                .auth-input {
                    width: 100%; background: rgba(0,0,0,0.3); border: 1px solid var(--border);
                    padding: 14px 18px; border-radius: 12px; margin-bottom: 16px; color: #fff;
                    font-size: 1rem; outline: none; transition: border-color 0.2s;
                }
                .auth-input:focus { border-color: var(--accent); }
                .divider { display: flex; align-items: center; gap: 16px; margin: 24px 0; color: #333; }
                .divider hr { flex: 1; border: 0; border-top: 1px solid #222; }
                .divider span { font-size: 0.75rem; text-transform: uppercase; font-weight: 800; }
                .error-msg { color: #f87171; font-size: 0.9rem; margin-top: 24px; font-weight: 500; }
                .footer-links { margin-top: 32px; font-size: 0.9rem; color: #555; }
                .footer-links a { color: var(--accent); font-weight: 600; text-decoration: none; }
                .nav-logo { display: flex; align-items: center; gap: 12px; font-weight: 800; font-size: 1.2rem; }
                .logo-icon { 
                    width: 32px; height: 32px; background: var(--accent); 
                    border-radius: 8px; display: grid; place-items: center; 
                }
            `}</style>
        </div>
    );
}
