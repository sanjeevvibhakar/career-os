import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Database, Server, Terminal, Settings } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';

export const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)]">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
          Sanjeev <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">Vibhakar</span>
        </h1>
        <h2 className="text-2xl md:text-3xl font-medium text-[var(--text-secondary)] mb-8">
          Software Engineer
        </h2>
        <div className="flex flex-col gap-2 text-lg text-[var(--text-secondary)] mb-12 bg-[var(--bg-card)] p-6 rounded-xl border border-[var(--border)] max-w-2xl w-full">
          <p>Building: <span className="text-blue-400">Career OS</span></p>
          <p>Learning: <span className="text-green-400">Distributed Systems</span></p>
          <p>Exploring: <span className="text-purple-400">AI Engineering</span></p>
        </div>
        <div className="flex gap-4">
          <Link to="/projects" className="px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center gap-2">
            View Projects <ArrowRight size={18} />
          </Link>
          <Link to="/contact" className="px-6 py-3 rounded-md bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] text-white font-medium transition-colors border border-[var(--border)]">
            Contact Me
          </Link>
        </div>
      </section>

      {/* Skills Overview */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <h3 className="text-3xl font-bold text-white mb-12 text-center">Core Competencies</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Backend (Spring Boot, Node.js)', progress: 90, icon: <Server /> },
            { name: 'Frontend (React, TypeScript)', progress: 85, icon: <Code /> },
            { name: 'Database (PostgreSQL, MongoDB)', progress: 80, icon: <Database /> },
            { name: 'DevOps (Docker, AWS)', progress: 70, icon: <Settings /> },
            { name: 'Tools (Git, Linux)', progress: 85, icon: <Terminal /> },
          ].map((skill) => (
            <Card key={skill.name} className="p-6">
              <div className="flex items-center gap-3 mb-4 text-[var(--text-secondary)]">
                {skill.icon}
                <span className="font-medium text-white">{skill.name}</span>
              </div>
              <ProgressBar value={skill.progress} showPercentage color="bg-blue-500" />
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};
