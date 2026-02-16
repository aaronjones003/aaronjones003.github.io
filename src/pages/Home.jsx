import { Link } from 'preact-router';
import { ArrowRight, Code, Palette, Gamepad2, ExternalLink, Github, BookOpen } from 'lucide-preact';

export default function Home() {
  const featuredProjects = [
    {
      title: 'Thirsty',
      description: 'Next.js application with Notion integration and modern UI',
      tech: ['Next.js', 'React', 'TypeScript', 'Notion API'],
      href: 'https://thirsty.onigiri.zone',
      github: 'https://github.com/aaronjones003/thirsty',
      icon: Code,
    },
    {
      title: 'Py-Ron',
      description: 'Python app that generates Ron Swanson quotes on random photos',
      tech: ['Python', 'PIL', 'Unsplash API'],
      href: 'https://onigiri.zone/py-ron/',
      github: 'https://github.com/aaronjones003/py-ron',
      icon: Palette,
    },
    {
      title: 'A Box of Mac and Cheese',
      description: 'Web app that generates random book covers',
      tech: ['HTML5', 'Bootstrap', 'JavaScript'],
      href: 'https://onigiri.zone/a-box-of-mac-and-cheese/',
      github: 'https://github.com/aaronjones003/a-box-of-mac-and-cheese',
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-neutral-50">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-balance">
              <span className="gradient-text">Creative Developer</span>
              <br />
              <span className="text-neutral-900">Building Tools That Matter</span>
            </h1>
            
            <p className="text-xl text-neutral-600 text-pretty max-w-2xl mx-auto leading-relaxed">
              I build applications, tools, and experiments at the intersection of creativity and technology. 
              From web apps to D&D utilities, I love creating things that solve real problems.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/projects" 
                className="btn btn-primary text-base px-6 py-3"
              >
                View Projects
                <ArrowRight size={20} className="ml-2" />
              </Link>
              <Link 
                href="/adnd" 
                className="btn btn-secondary text-base px-6 py-3"
              >
                D&D Tools
                <Gamepad2 size={20} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900">
              Featured Projects
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              A selection of my recent work.
            </p>
          </div>
          
          <div className="grid-auto">
            {featuredProjects.map((project) => {
              const Icon = project.icon;
              return (
                <div key={project.title} className="card p-6 space-y-4 group cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-primary-50 rounded-lg group-hover:bg-primary-100 transition-colors">
                      <Icon size={24} className="text-primary-600" />
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-neutral-500 hover:text-primary-600 transition-colors"
                      >
                        <Github size={18} />
                      </a>
                      <a
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-neutral-500 hover:text-primary-600 transition-colors"
                      >
                        <ExternalLink size={18} />
                      </a>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-neutral-600 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs font-medium rounded-md"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/projects" className="btn btn-primary">
              View All Projects
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
