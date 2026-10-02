import React, { useState } from 'react';
import { Code, ExternalLink, Sparkles } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { usePortfolioStore, type PortfolioProject } from '../../stores/portfolioStore';

export const ProjectsPage: React.FC = () => {
  const { projects } = usePortfolioStore();
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null);

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto w-full min-h-screen animate-fade-in">
      <div className="mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-bold mb-3 border border-blue-500/20">
          <Sparkles size={13} />
          <span>Engineering Showcase</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Featured Projects</h1>
        <p className="text-gray-400 mt-2 max-w-2xl text-sm sm:text-base">
          Production systems, distributed architectures, and end-to-end applications engineered with high scalability and clean principles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            hover 
            className="flex flex-col h-full cursor-pointer border-white/10 hover:border-blue-500/40 transition-all overflow-hidden" 
            onClick={() => setSelectedProject(project)}
          >
            {project.imageUrl ? (
              <div 
                className="h-48 bg-cover bg-center border-b border-white/10 relative"
                style={{ backgroundImage: `url(${project.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {project.featured && (
                  <span className="absolute top-3 right-3 text-[10px] font-mono font-bold text-amber-400 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/30">
                    ★ Featured
                  </span>
                )}
              </div>
            ) : (
              <div className="h-44 bg-gradient-to-br from-blue-900/40 via-purple-900/30 to-black border-b border-white/10" />
            )}

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="info">{tech}</Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 pt-3 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <Code size={15} /> Source
                    </a>
                  )}
                  {project.liveUrl && project.liveUrl !== '#' && (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-mono font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink size={15} /> Live Demo
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="ml-auto text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    Details ↗
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject?.title || ''}>
        {selectedProject && (
          <div className="flex flex-col gap-5 pt-2 max-h-[75vh] overflow-y-auto pr-1">
            {selectedProject.imageUrl && (
              <img 
                src={selectedProject.imageUrl} 
                alt={selectedProject.title} 
                className="w-full h-48 object-cover rounded-xl border border-white/10" 
              />
            )}

            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-blue-400 mb-1">Overview</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {selectedProject.longDescription || selectedProject.description}
              </p>
            </div>
            
            {selectedProject.architectureNotes && (
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-xs font-mono font-bold uppercase text-purple-400 mb-1">Architecture & Engineering Decisions</h4>
                <p className="text-xs text-gray-300 leading-relaxed font-mono">
                  {selectedProject.architectureNotes}
                </p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-mono font-bold uppercase text-gray-400 mb-2">Technologies Used</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedProject.techStack.map((tech) => (
                  <span key={tech} className="text-xs font-mono bg-blue-500/10 text-blue-300 px-2.5 py-1 rounded-lg border border-blue-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 pt-3 border-t border-white/10">
              {selectedProject.githubUrl && selectedProject.githubUrl !== '#' && (
                <a 
                  href={selectedProject.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10 text-xs font-bold text-white hover:bg-white/20 transition-all"
                >
                  <Code size={15} /> View Source Code
                </a>
              )}
              {selectedProject.liveUrl && selectedProject.liveUrl !== '#' && (
                <a 
                  href={selectedProject.liveUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-md"
                >
                  <ExternalLink size={15} /> Open Live Project
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
