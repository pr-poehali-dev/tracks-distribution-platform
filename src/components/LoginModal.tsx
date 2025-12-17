import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface LoginModalProps {
  showLogin: boolean;
  setShowLogin: (show: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  code: string;
  setCode: (code: string) => void;
  codeSent: boolean;
  setCodeSent: (sent: boolean) => void;
  loading: boolean;
  handleRequestCode: () => void;
  handleVerifyCode: () => void;
  isAuthenticated: boolean;
}

const LoginModal = ({
  showLogin,
  setShowLogin,
  email,
  setEmail,
  code,
  setCode,
  codeSent,
  setCodeSent,
  loading,
  handleRequestCode,
  handleVerifyCode,
  isAuthenticated
}: LoginModalProps) => {
  if (!showLogin || isAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 gradient-border">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold gradient-text">Вход</h2>
          <button onClick={() => setShowLogin(false)} className="text-muted-foreground hover:text-foreground">
            <Icon name="X" size={24} />
          </button>
        </div>

        {!codeSent ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleRequestCode()}
              />
            </div>
            <Button 
              onClick={handleRequestCode} 
              disabled={loading}
              className="w-full gradient-bg"
            >
              {loading ? 'Отправка...' : 'Получить код'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Код из письма</label>
              <Input
                type="text"
                placeholder="123456"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                onKeyPress={(e) => e.key === 'Enter' && handleVerifyCode()}
                className="text-center text-2xl tracking-widest"
              />
            </div>
            <Button 
              onClick={handleVerifyCode} 
              disabled={loading}
              className="w-full gradient-bg"
            >
              {loading ? 'Проверка...' : 'Войти'}
            </Button>
            <Button 
              onClick={() => { setCodeSent(false); setCode(''); }} 
              variant="ghost"
              className="w-full"
            >
              Назад
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default LoginModal;
