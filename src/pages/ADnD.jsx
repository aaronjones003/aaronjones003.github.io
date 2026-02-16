import { Link } from 'preact-router';
import { Sword, Scroll, Users, Wand2, ExternalLink } from 'lucide-preact';

export default function ADnD() {
  const characterSheets = [
    {
      title: 'Cleric',
      description: 'Complete character sheet with spell management and automatic calculations',
      href: '/cleric/sheet.html',
      icon: Wand2,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="section-padding bg-gradient-to-br from-red-50 via-white to-neutral-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-red-100 rounded-full">
                <Sword size={48} className="text-red-600" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900">
              AD&D 2E Tools
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              Character sheets and tools for Advanced Dungeons & Dragons 2nd Edition.
            </p>
          </div>
        </div>
      </section>

      {/* Character Sheets */}
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold text-neutral-900">
                Character Sheets
              </h2>
              <p className="text-lg text-neutral-600">
                Interactive character sheets with automatic calculations and spell management.
              </p>
            </div>
            
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                {characterSheets.map((sheet) => {
                  const Icon = sheet.icon;
                  return (
                    <Link
                      key={sheet.title}
                      href={sheet.href}
                      className="card p-8 group cursor-pointer hover:shadow-xl transition-all duration-300 block"
                    >
                      <div className="text-center space-y-6">
                        <div className="inline-flex items-center justify-center p-4 bg-red-50 rounded-full group-hover:bg-red-100 transition-colors">
                          <Icon size={32} className="text-red-600" />
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-2xl font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                            {sheet.title}
                          </h3>
                          <p className="text-neutral-600 leading-relaxed">
                            {sheet.description}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-center space-x-2 text-red-600">
                          <span className="font-medium">Open Character Sheet</span>
                          <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
