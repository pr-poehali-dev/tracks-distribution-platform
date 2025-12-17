import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

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
      <header className="fixed top-0 w-full z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold gradient-text">Mixsønαr</h1>
          <nav className="hidden md:flex gap-6">
            {['home', 'catalog', 'service', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeSection === section ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {section === 'home' ? 'Главная' : section === 'catalog' ? 'Каталог' : section === 'service' ? 'Сервис' : 'Контакты'}
              </button>
            ))}
          </nav>
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button onClick={handleLogout} variant="outline" size="sm">Выйти</Button>
            </div>
          ) : (
            <Button onClick={() => setShowLogin(true)} className="gradient-bg">
              Войти
            </Button>
          )}
        </div>
      </header>

      {showLogin && !isAuthenticated && (
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
      )}

      {isAuthenticated ? (
        <main className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-2 gradient-text">Личный кабинет артиста</h2>
              <p className="text-muted-foreground">Управление треками и дистрибуцией</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6 gradient-border">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/20">
                    <Icon name="Music" className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">24</p>
                    <p className="text-sm text-muted-foreground">Треков загружено</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 gradient-border">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-secondary/20">
                    <Icon name="TrendingUp" className="text-secondary" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">3.2M</p>
                    <p className="text-sm text-muted-foreground">Прослушиваний</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 gradient-border">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-accent/20">
                    <Icon name="DollarSign" className="text-accent" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">70%</p>
                    <p className="text-sm text-muted-foreground">Ваших роялти</p>
                  </div>
                </div>
              </Card>
            </div>

            <Tabs defaultValue="tracks" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="tracks">Мои треки</TabsTrigger>
                <TabsTrigger value="upload">Загрузить новый</TabsTrigger>
              </TabsList>

              <TabsContent value="tracks" className="space-y-4">
                {mockTracks.map((track) => (
                  <Card key={track.id} className="p-4 gradient-border hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{track.cover}</div>
                        <div>
                          <h3 className="font-semibold">{track.title}</h3>
                          <p className="text-sm text-muted-foreground">{track.genre}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{track.plays}</p>
                          <p className="text-xs text-muted-foreground">прослушиваний</p>
                        </div>
                        <Badge className="bg-primary/20 text-primary">Активен</Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="upload">
                <Card className="p-6 gradient-border">
                  <h3 className="text-xl font-semibold mb-6">Загрузить новый трек</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Название трека</label>
                      <Input placeholder="Введите название" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Жанр</label>
                      <Input placeholder="Electronic, House, Techno..." />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Аудиофайл</label>
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                        <Icon name="Upload" className="mx-auto mb-2 text-muted-foreground" size={32} />
                        <p className="text-sm text-muted-foreground">Нажмите или перетащите файл</p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Платформы для дистрибуции</label>
                      <div className="flex flex-wrap gap-2">
                        {['Spotify', 'Apple Music', 'YouTube Music', 'Deezer', 'Yandex Music'].map((platform) => (
                          <Badge key={platform} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        💰 Роялти: <span className="font-bold text-primary">70%</span> вам, <span className="font-bold text-muted-foreground">30%</span> лейблу
                      </p>
                    </div>
                    <Button className="w-full gradient-bg">Загрузить и отправить на площадки</Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      ) : (
        <>
          <section className="pt-32 pb-20 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 blur-3xl opacity-50" />
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-6xl md:text-7xl font-bold mb-6 gradient-text">
                  Твоя музыка на всех площадках
                </h2>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Дистрибуция треков на Spotify, Apple Music, YouTube и другие платформы за минуты
                </p>
                <div className="flex gap-4 justify-center">
                  <Button size="lg" className="gradient-bg text-lg px-8" onClick={() => setShowLogin(true)}>
                    Начать сейчас <Icon name="ArrowRight" className="ml-2" size={20} />
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => setActiveSection('catalog')}>
                    Каталог треков
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-16">
                <Card className="p-6 gradient-border hover:scale-105 transition-transform">
                  <div className="text-4xl mb-4">🚀</div>
                  <h3 className="text-xl font-semibold mb-2">Быстрая отгрузка</h3>
                  <p className="text-muted-foreground">Загрузите трек один раз - он появится на всех площадках</p>
                </Card>

                <Card className="p-6 gradient-border hover:scale-105 transition-transform">
                  <div className="text-4xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold mb-2">Аналитика</h3>
                  <p className="text-muted-foreground">Отслеживайте прослушивания и доход в реальном времени</p>
                </Card>

                <Card className="p-6 gradient-border hover:scale-105 transition-transform">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold mb-2">70% роялти</h3>
                  <p className="text-muted-foreground">Вы получаете большую часть отчислений от своей музыки</p>
                </Card>
              </div>
            </div>
          </section>

          {activeSection === 'catalog' && (
            <section className="py-20 px-4 bg-card/50">
              <div className="container mx-auto max-w-6xl">
                <h2 className="text-4xl font-bold mb-12 text-center gradient-text">Каталог треков и артистов</h2>

                <Tabs defaultValue="tracks" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="tracks">Треки</TabsTrigger>
                    <TabsTrigger value="artists">Артисты</TabsTrigger>
                  </TabsList>

                  <TabsContent value="tracks" className="grid md:grid-cols-2 gap-6">
                    {mockTracks.map((track) => (
                      <Card key={track.id} className="p-6 gradient-border hover:shadow-xl transition-all hover:-translate-y-1">
                        <div className="flex items-start gap-4">
                          <div className="text-5xl">{track.cover}</div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-1">{track.title}</h3>
                            <p className="text-muted-foreground mb-2">{track.artist}</p>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge variant="outline">{track.genre}</Badge>
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Icon name="Play" size={14} /> {track.plays}
                              </span>
                            </div>
                            <Button size="sm" className="w-full">
                              <Icon name="Play" size={16} className="mr-2" /> Слушать
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="artists" className="grid md:grid-cols-3 gap-6">
                    {mockArtists.map((artist) => (
                      <Card key={artist.id} className="p-6 gradient-border text-center hover:shadow-xl transition-all hover:-translate-y-1">
                        <div className="text-6xl mb-4">{artist.avatar}</div>
                        <h3 className="text-xl font-semibold mb-2">{artist.name}</h3>
                        <div className="flex justify-center gap-4 text-sm text-muted-foreground mb-4">
                          <span>{artist.tracks} треков</span>
                          <span>•</span>
                          <span>{artist.followers} подписчиков</span>
                        </div>
                        <Button variant="outline" className="w-full">
                          Профиль артиста
                        </Button>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </div>
            </section>
          )}

          {activeSection === 'contact' && (
            <section className="py-20 px-4">
              <div className="container mx-auto max-w-2xl">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold mb-4 gradient-text">Свяжитесь с нами</h2>
                  <p className="text-muted-foreground">Ответим на все вопросы о дистрибуции</p>
                </div>

                <Card className="p-8 gradient-border">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Имя</label>
                      <Input placeholder="Ваше имя" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Email</label>
                      <Input type="email" placeholder="your@email.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Сообщение</label>
                      <Textarea placeholder="Расскажите о вашем проекте..." rows={5} />
                    </div>
                    <Button className="w-full gradient-bg">
                      Отправить <Icon name="Send" className="ml-2" size={18} />
                    </Button>
                  </div>
                </Card>

                <div className="grid md:grid-cols-3 gap-6 mt-8">
                  <Card className="p-6 text-center gradient-border">
                    <Icon name="Mail" className="mx-auto mb-2 text-primary" size={24} />
                    <p className="text-sm text-muted-foreground">info@mixsonar.com</p>
                  </Card>
                  <Card className="p-6 text-center gradient-border">
                    <Icon name="Phone" className="mx-auto mb-2 text-secondary" size={24} />
                    <p className="text-sm text-muted-foreground">+7 (999) 123-45-67</p>
                  </Card>
                  <Card className="p-6 text-center gradient-border">
                    <Icon name="MessageCircle" className="mx-auto mb-2 text-accent" size={24} />
                    <p className="text-sm text-muted-foreground">Telegram: @mixsonar</p>
                  </Card>
                </div>
              </div>
            </section>
          )}

          <footer className="py-12 px-4 border-t border-border mt-20">
            <div className="container mx-auto max-w-6xl">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-xl mb-4 gradient-text">Mixsønαr</h3>
                  <p className="text-sm text-muted-foreground">Дистрибуция музыки на все площадки</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Сервис</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Дистрибуция</li>
                    <li>Аналитика</li>
                    <li>Роялти 70/30</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Артистам</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>Личный кабинет</li>
                    <li>Загрузка треков</li>
                    <li>Профиль</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Социальные сети</h4>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors cursor-pointer">
                      <Icon name="Instagram" size={18} />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors cursor-pointer">
                      <Icon name="Youtube" size={18} />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors cursor-pointer">
                      <Icon name="Send" size={18} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border">
                © 2024 Mixsønαr. Все права защищены.
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
};

export default Index;
