import { Link } from 'preact-router';
import { ExternalLink, Github, Code, Palette, BookOpen, Sword } from 'lucide-preact';

export default function Projects() {
  const projects = [
    {
      title: 'Thirsty',
      description: 'Next.js application with Notion integration and Chakra UI styling. A modern web application that connects with Notion for content management.',
      tech: ['Next.js', 'React', 'TypeScript', 'Chakra UI', 'Notion API'],
      href: 'https://thirsty.onigiri.zone',
      github: 'https://github.com/aaronjones003/thirsty',
      icon: Code,
      image: '/screenshots/thirsty.png',
      featured: true,
    },
    {
      title: 'Py-Ron',
      description: 'Python app that generates Ron Swanson quotes on random photos from Unsplash. Combines API data to create motivational/meme images.',
      tech: ['Python', 'PIL', 'Requests', 'Unsplash API'],
      href: 'https://onigiri.zone/py-ron/',
      github: 'https://github.com/aaronjones003/py-ron',
      icon: Palette,
      image: '/screenshots/py-ron.png',
      featured: true,
    },
    {
      title: 'A Box of Mac and Cheese',
      description: 'Web app that generates "A (Blank) of (Blank) and (Blank)" book covers. A fun random title generator with visual book cover creation.',
      tech: ['HTML5', 'Bootstrap', 'JavaScript', 'Canvas API'],
      href: 'https://onigiri.zone/a-box-of-mac-and-cheese/',
      github: 'https://github.com/aaronjones003/a-box-of-mac-and-cheese',
      icon: BookOpen,
      image: '/screenshots/a-box-of-mac-and-cheese.png',
      featured: true,
    },
    {
      title: 'AD&D 2E Tools',
      description: 'Character sheets and tools for Advanced Dungeons & Dragons 2nd Edition. Interactive character sheets with automatic calculations and spell management.',
      tech: ['HTML', 'CSS', 'JavaScript'],
      href: '/adnd',
      icon: Sword,
      image: '/screenshots/adnd.png',
      featured: false,
    },
  ];

  const getIcon = (iconName) => {
    const icons = {
      Code,
      Palette,
      BookOpen,
      Sword,
    };
    return icons[iconName] || Code;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-neutral-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900">
              My Projects
            </h1>
            <p className="text-xl text-neutral-600 leading-relaxed">
              A collection of my work spanning web applications and creative experiments.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding">
        <div className="container">
          <div className="space-y-12">
            {projects.map((project, index) => {
              const Icon = getIcon(project.icon);
              return (
                <div key={project.title} className="card overflow-hidden">
                  {/* Screenshot - Full width on mobile, side by side on desktop */}
                  <div className="relative group">
                    <div className="aspect-video bg-neutral-100 overflow-hidden border-b border-neutral-200 lg:border-none">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={`${project.title} screenshot`}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                          <Icon size={64} className="text-primary-600 opacity-50" />
                        </div>
                      )}
                    </div>
                    {project.featured && (
                      <div className="absolute top-4 right-4 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">★</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-primary-50 rounded-lg">
                        <Icon size={24} className="text-primary-600" />
                      </div>
                      {project.featured && (
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                          Featured
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-neutral-900">
                        {project.title}
                      </h3>

                      <p className="text-neutral-600 leading-relaxed">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm font-medium rounded-md"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        {project.href.startsWith('/') ? (
                          <Link
                            href={project.href}
                            className="btn btn-primary"
                          >
                            <ExternalLink size={18} className="mr-2" />
                            View Project
                          </Link>
                        ) : (
                          <a
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                          >
                            <ExternalLink size={18} className="mr-2" />
                            Live Demo
                          </a>
                        )}
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                          >
                            <Github size={18} className="mr-2" />
                            Source
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
