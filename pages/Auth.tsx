import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { signInWithEmail } from '../services/authService';
import { Button, Input } from '../components/ui';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as { from?: string } | null)?.from;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('이메일을 입력해 주세요.');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email.trim());
      navigate('/profile', { replace: true, state: { from } });
    } catch {
      setError('로그인에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card max-w-md mx-auto py-12 animate-fade-in bg-white/20 border border-white/30 rounded-2xl p-8 backdrop-blur-xl shadow-glass">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-serif font-semibold text-sky-50 mb-3">기록을 시작할까요?</h1>
        <p className="text-sky-100/80">이메일로 간단히 접속할 수 있습니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-sky-100">이메일</label>
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="name@example.com"
            leftIcon={<Mail className="w-5 h-5" />}
            size="lg"
            error={!!error}
          />
          {error && <p className="text-xs text-rose-300">{error}</p>}
        </div>

        <Button type="submit" fullWidth loading={loading}>
          계속하기
        </Button>
      </form>
    </div>
  );
};

export default Auth;
