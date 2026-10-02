import React from 'react';
import { Badge } from '../../components/ui/Badge';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { Briefcase, Calendar } from 'lucide-react';

export const ExperiencePage: React.FC = () => {
  const { experiences } = usePortfolioStore();

  return (
    <div className="py-20 px-4 max-w-4xl mx-auto w-full min-h-screen animate-fade-in">
      <div className="mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-bold mb-3 border border-blue-500/20">
          <Briefcase size={13} />
          <span>Professional Background</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Work Experience</h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Engineering roles, key responsibilities, production contributions, and tech stacks.
        </p>
      </div>
      
      <div className="relative border-l-2 border-white/10 ml-3 md:ml-4 space-y-12">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative pl-8 md:pl-10">
            <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1.5 border-4 border-[var(--bg-primary)] shadow-sm"></div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2 gap-1">
              <h3 className="text-xl font-black text-white">{exp.role}</h3>
              <span className="text-xs font-mono text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 self-start sm:self-auto">
                {exp.period}
              </span>
            </div>
            
            <h4 className="text-sm font-bold text-gray-300 font-mono mb-3">{exp.company}</h4>
            <p className="text-sm text-gray-300 leading-relaxed mb-5">{exp.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {exp.technologies.map((t) => (
                <span key={t} className="text-xs font-mono bg-white/5 text-gray-300 px-2.5 py-1 rounded-lg border border-white/10">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
