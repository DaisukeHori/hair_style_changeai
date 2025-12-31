import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Eye, EyeOff } from 'lucide-react';
import { Card, Button, Input } from '@/components/common';
import { useAuth } from '@/hooks';
import { toast } from '@/stores/uiStore';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('入力エラー', 'メールアドレスとパスワードを入力してください');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/stylist');
    } catch (error) {
      toast.error(
        'ログイン失敗',
        error instanceof Error ? error.message : 'ログインに失敗しました'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-16 w-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-4">
            <Scissors className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Hair Style Change AI
          </h1>
          <p className="text-secondary-500 mt-1">美容師向け管理システム</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
          />

          <Input
            label="パスワード"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            }
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            ログイン
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-sm text-primary-600 hover:text-primary-700"
            onClick={() => toast.info('パスワードリセット', '管理者にお問い合わせください')}
          >
            パスワードをお忘れですか？
          </button>
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
          <p className="text-xs text-secondary-500 text-center">
            デモ用アカウント: demo@example.com / demo1234
          </p>
        </div>
      </Card>
    </div>
  );
};
