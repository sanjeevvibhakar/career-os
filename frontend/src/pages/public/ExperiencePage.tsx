import React from 'react';
import { Badge } from '../../components/ui/Badge';

export const ExperiencePage: React.FC = () => {
  const experiences = [
    {
      company: 'Tech Corp',
      role: 'Software Engineer',
      period: '2025 - Present',
      description: 'Developing scalable backend microservices using Spring Boot and React frontends.',
      tech: ['Java', 'Spring Boot', 'React', 'Docker']
    }
  ];

  return (
    <div className="py-20 px-4 max-w-3xl mx-auto w-full min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-12">Experience</h1>
      
      <div className="relative border-l-2 border-[var(--border)] ml-3 md:ml-0 md:pl-0 space-y-12">
        {experiences.map((exp, i) => (
          <div key={i} className="relative pl-8 md:pl-12">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1.5 border-4 border-[var(--bg-primary)]"></div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
              <h3 className="text-xl font-bold text-white">{exp.role}</h3>
              <span className="text-sm font-medium text-[var(--text-secondary)]">{exp.period}</span>
            </div>
            <h4 className="text-lg font-medium text-blue-400 mb-4">{exp.company}</h4>
            <p className="text-[var(--text-secondary)] mb-6">{exp.description}</p>
            <div className="flex flex-wrap gap-2">
              {exp.tech.map(t => <Badge key={t}>{t}</Badge>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
