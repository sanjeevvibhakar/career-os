import React from 'react';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';

export const SkillsPage: React.FC = () => {
  const categories = [
    {
      name: 'Backend',
      skills: [
        { name: 'Java / Spring Boot', progress: 90 },
        { name: 'Node.js / Express', progress: 85 },
      ]
    },
    {
      name: 'Frontend',
      skills: [
        { name: 'React', progress: 85 },
        { name: 'TypeScript', progress: 80 },
        { name: 'Tailwind CSS', progress: 90 },
      ]
    },
  ];

  return (
    <div className="py-20 px-4 max-w-7xl mx-auto w-full min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-12">Skills</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {categories.map(category => (
          <div key={category.name}>
            <h2 className="text-2xl font-bold text-white mb-6 border-b border-[var(--border)] pb-2">{category.name}</h2>
            <Card className="p-6 flex flex-col gap-6">
              {category.skills.map(skill => (
                <div key={skill.name}>
                  <ProgressBar value={skill.progress} label={skill.name} showPercentage />
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
