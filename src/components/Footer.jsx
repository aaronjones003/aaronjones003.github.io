import { h } from 'preact';
import { Github, Mail, Heart } from 'lucide-preact';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: 'GitHub',
      href: 'https://github.com/aaronjones003',
      icon: Github,
    },
    {
      name: 'Email',
      href: 'mailto:aaron@example.com',
      icon: Mail,
    },
  ];

  return (
    <footer className="bg-neutral-50 border-t border-neutral-200">
      <div className="container section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AJ</span>
              </div>
              <span className="font-semibold text-lg">Aaron Jones</span>
            </div>
            <p className="text-sm text-neutral-600 max-w-xs">
              Building tools and projects at the intersection of creativity and technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/projects" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="/adnd" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  D&D Tools
                </a>
              </li>
              <li>
                <a href="https://github.com/aaronjones003" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="font-semibold text-neutral-900">Connect</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-neutral-600 bg-white rounded-lg border border-neutral-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-200"
                    title={link.name}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-neutral-600">
              © {currentYear} Aaron Jones. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
