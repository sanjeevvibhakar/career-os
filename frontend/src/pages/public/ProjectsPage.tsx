import React, { useState } from 'react';
import { Code, ExternalLink } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import type { Project } from '../../types';

// Mock data
const mockProjects: Project[] = [
  {
    id: 1, title: 'Career OS', slug: 'career-os', description: 'Full-stack platform combining a public portfolio with a private career dashboard.',
    longDescription: 'A comprehensive career management tool with DSA tracking, Tech sprints, Journal, and a customizable portfolio.',
    architectureNotes: 'React frontend, Spring Boot backend, PostgreSQL database. JWT auth.',
    techStack: ['React', 'TypeScript', 'Spring Boot', 'Tailwind', 'PostgreSQL'],
    githubUrl: '#', liveUrl: '#', imageUrl: '', challenges: 'Managing complex state with Zustand', results: 'Increased productivity by 20%', featured: true
  }
];

export const ProjectsPage: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto w-full min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-12">Projects</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockProjects.map(project => (
          <Card key={project.id} hover className="flex flex-col h-full" onClick={() => setSelectedProject(project)}>
            <div className="h-48 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-b border-[var(--border)]" />
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
              <p className="text-[var(--text-secondary)] mb-4 flex-1">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.techStack.map(tech => (
                  <Badge key={tech} variant="info">{tech}</Badge>
                ))}
              </div>
              <div className="flex gap-4" onClick={e => e.stopPropagation()}>
                <a href={project.githubUrl} className="text-[var(--text-secondary)] hover:text-white transition-colors"><Code size={20} /></a>
                <a href={project.liveUrl} className="text-[var(--text-secondary)] hover:text-white transition-colors"><ExternalLink size={20} /></a>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject?.title || ''}>
        {selectedProject && (
          <div className="flex flex-col gap-6">
            <p className="text-[var(--text-secondary)]">{selectedProject.longDescription}</p>
            
            <div>
              <h4 className="text-white font-medium mb-2">Architecture</h4>
              <p className="text-sm text-[var(--text-secondary)]">{selectedProject.architectureNotes}</p>
            </div>
            
            <div className="flex gap-4 mt-4">
              <a href={selectedProject.githubUrl} className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] rounded-md border border-[var(--border)] text-white hover:bg-[var(--bg-card)]">
                <Code size={16} /> Source Code
              </a>
              <a href={selectedProject.liveUrl} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700">
                <ExternalLink size={16} /> Live Demo
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
