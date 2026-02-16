import { Link } from 'preact-router';
import { useState, useEffect } from 'preact/hooks';
import { Menu, X, Github, ExternalLink } from 'lucide-preact';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
  ];

  const externalLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/aaronjones003',
      icon: Github,
    },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm' 
        : 'bg-white border-b border-neutral-200'
    }`}>
      <div className="container">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AJ</span>
            </div>
            <span className="font-semibold text-lg text-neutral-900">
              Aaron Jones
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-neutral-600 hover:text-primary-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {externalLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors text-neutral-600 hover:bg-neutral-100 hover:text-primary-600"
                  title={link.name}
                >
                  <Icon size={18} />
                </a>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors text-neutral-600 hover:bg-neutral-100"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200 bg-white">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded-lg"
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-2 mt-2 border-t border-neutral-100">
                {externalLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-neutral-600 hover:text-primary-600 hover:bg-neutral-50 rounded-lg"
                    >
                      <Icon size={18} />
                      <span>{link.name}</span>
                      <ExternalLink size={14} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
