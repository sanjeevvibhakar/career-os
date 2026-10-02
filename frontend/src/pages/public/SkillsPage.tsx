import React from 'react';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { Sparkles, Terminal } from 'lucide-react';

export const SkillsPage: React.FC = () => {
  const { skills } = usePortfolioStore();

  // Group skills by category dynamically
  const categoriesMap: Record<string, typeof skills> = {};
  skills.forEach((skill) => {
    if (!categoriesMap[skill.category]) {
      categoriesMap[skill.category] = [];
    }
    categoriesMap[skill.category].push(skill);
  });

  const categories = Object.keys(categoriesMap);

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto w-full min-h-screen animate-fade-in">
      <div className="mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-mono font-bold mb-3 border border-blue-500/20">
          <Terminal size={13} />
          <span>Core Competencies</span>
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight">Technical Skills</h1>
        <p className="text-gray-400 mt-2 max-w-2xl text-sm sm:text-base">
          Proven proficiencies across backend architecture, distributed streaming, relational databases, and modern web applications.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {categories.map((categoryName) => (
          <div key={categoryName} className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-400" />
              <span>{categoryName}</span>
            </h2>
            <Card className="p-6 flex flex-col gap-5 border-white/10 hover:border-white/20 transition-all">
              {categoriesMap[categoryName].map((skill) => (
                <div key={skill.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="text-[var(--text-primary)]">{skill.name}</span>
                    <span className="text-emerald-400">{skill.proficiency}%</span>
                  </div>
                  <ProgressBar value={skill.proficiency} color="#3b82f6" />
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
