import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  isAuthenticated: boolean;
  user: any;
  handleLogout: () => void;
  setShowLogin: (show: boolean) => void;
}

const Header = ({
  activeSection,
  setActiveSection,
  isAuthenticated,
  user,
  handleLogout,
  setShowLogin
}: HeaderProps) => {
  return (
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
  );
};

export default Header;
