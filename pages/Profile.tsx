import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import { getCurrentUser, updateNickname } from '../services/authService';
import { Button, Input } from '../components/ui';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = (location.state as { from?: string } | null)?.from;

  useEffect(() => {
    const current = getCurrentUser();
    if (!current) {
      navigate('/auth', { replace: true });
      return;
    }
    if (current.nickname) {
      navigate(from || '/', { replace: true });
      return;
    }
  }, [from, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (nickname.trim().length < 2) {
      setError('닉네임은 최소 2자 이상 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      await updateNickname(nickname.trim());
      navigate(from || '/', { replace: true });
    } catch {
      setError('닉네임 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card max-w-md mx-auto py-12 animate-fade-in bg-white/20 border border-white/30 rounded-2xl p-8 backdrop-blur-xl shadow-glass">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mx-auto mb-4 shadow-glass">
          <User className="w-7 h-7 text-sky-100" />
        </div>
        <h1 className="text-3xl font-serif font-semibold text-sky-50 mb-3">닉네임을 정해주세요</h1>
        <p className="text-sky-100/80">기록에 표시될 이름입니다.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-sky-100">닉네임</label>
          <Input
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="2~12자"
            size="lg"
            error={!!error}
          />
          {error && <p className="text-xs text-rose-300">{error}</p>}
        </div>

        <Button type="submit" fullWidth loading={loading}>
          시작하기
        </Button>
      </form>
    </div>
  );
};

export default Profile;
