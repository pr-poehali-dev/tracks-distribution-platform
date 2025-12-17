import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

interface Track {
  id: number;
  title: string;
  artist: string;
  genre: string;
  plays: string;
  cover: string;
}

interface Artist {
  id: number;
  name: string;
  tracks: number;
  followers: string;
  avatar: string;
}

interface PublicContentProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  setShowLogin: (show: boolean) => void;
  mockTracks: Track[];
  mockArtists: Artist[];
}

const PublicContent = ({
  activeSection,
  setActiveSection,
  setShowLogin,
  mockTracks,
  mockArtists
}: PublicContentProps) => {
  return (
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
  );
};

export default PublicContent;
