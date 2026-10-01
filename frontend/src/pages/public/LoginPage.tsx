import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const LoginPage: React.FC = () => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(pin)) {
      navigate('/dashboard');
    } else {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4">
      <Card className="w-full max-w-md p-8 shadow-2xl border-[var(--border)]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome back, Sanjeev</h1>
          <p className="text-[var(--text-secondary)] mt-2">Enter your PIN to access Career OS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="password"
              placeholder="••••"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="text-center text-2xl tracking-widest"
              maxLength={4}
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          </div>

          <Button type="submit" className="w-full h-12 text-lg">
            Unlock OS
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--text-secondary)]">Default PIN is 1234</p>
        </div>
      </Card>
    </div>
  );
};
