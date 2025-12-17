import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import LoginModal from '@/components/LoginModal';
import ArtistDashboard from '@/components/ArtistDashboard';
import PublicContent from '@/components/PublicContent';

const mockTracks = [
  { id: 1, title: 'Neon Dreams', artist: 'DJ Nova', genre: 'Electronic', plays: '1.2M', cover: '🎵' },
  { id: 2, title: 'Midnight Vibes', artist: 'Luna Sound', genre: 'House', plays: '890K', cover: '🌙' },
  { id: 3, title: 'Summer Breeze', artist: 'Wave Riders', genre: 'Chill', plays: '2.3M', cover: '🌊' },
  { id: 4, title: 'Electric Soul', artist: 'DJ Nova', genre: 'Techno', plays: '1.5M', cover: '⚡' },
];

const mockArtists = [
  { id: 1, name: 'DJ Nova', tracks: 12, followers: '45K', avatar: '🎧' },
  { id: 2, name: 'Luna Sound', tracks: 8, followers: '32K', avatar: '🎹' },
  { id: 3, name: 'Wave Riders', tracks: 15, followers: '67K', avatar: '🌊' },
];

const API_URL = 'https://functions.poehali.dev/c0f502e5-5910-4cc9-92f1-31b3656174b3';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  const handleRequestCode = async () => {
    if (!email || !email.includes('@')) {
      toast({ title: 'Ошибка', description: 'Введите корректный email', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'request_code', email: email.toLowerCase().trim() })
      });

      const data = await response.json();

      if (response.ok) {
        setCodeSent(true);
        toast({ title: 'Код отправлен!', description: 'Проверьте почту' });
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Не удалось отправить код', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Проблема с подключением', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      toast({ title: 'Ошибка', description: 'Введите 6-значный код', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify_code', email: email.toLowerCase().trim(), code: code.trim() })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUser(data.user);
        setIsAuthenticated(true);
        setShowLogin(false);
        localStorage.setItem('user', JSON.stringify(data.user));
        toast({ title: 'Успешно!', description: 'Вы вошли в систему' });
      } else {
        toast({ title: 'Ошибка', description: data.error || 'Неверный код', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Проблема с подключением', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setEmail('');
    setCode('');
    setCodeSent(false);
    localStorage.removeItem('user');
    toast({ title: 'Вы вышли из системы' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isAuthenticated={isAuthenticated}
        user={user}
        handleLogout={handleLogout}
        setShowLogin={setShowLogin}
      />

      <LoginModal
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        email={email}
        setEmail={setEmail}
        code={code}
        setCode={setCode}
        codeSent={codeSent}
        setCodeSent={setCodeSent}
        loading={loading}
        handleRequestCode={handleRequestCode}
        handleVerifyCode={handleVerifyCode}
        isAuthenticated={isAuthenticated}
      />

      {isAuthenticated ? (
        <ArtistDashboard mockTracks={mockTracks} />
      ) : (
        <PublicContent
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          setShowLogin={setShowLogin}
          mockTracks={mockTracks}
          mockArtists={mockArtists}
        />
      )}
    </div>
  );
};

export default Index;
