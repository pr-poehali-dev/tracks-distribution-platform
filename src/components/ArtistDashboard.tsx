import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

interface ArtistDashboardProps {
  mockTracks: Track[];
}

const ArtistDashboard = ({ mockTracks }: ArtistDashboardProps) => {
  return (
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
  );
};

export default ArtistDashboard;
