import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usePortfolioStore } from '../../stores/portfolioStore';
import { useDsaStore } from '../../stores/dsaStore';
import { 
  Printer, ArrowLeft, Download, ExternalLink, Mail, 
  MapPin, CheckCircle, Copy, Share2, Sparkles, FileText, Globe
} from 'lucide-react';

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 12, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon: React.FC<{ size?: number; className?: string }> = ({ size = 12, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const ResumePage: React.FC = () => {
  const navigate = useNavigate();
  const { profile, projects, experiences } = usePortfolioStore();
  const dsaStore = useDsaStore();
  const [copiedLink, setCopiedLink] = useState(false);

  const dsaSolvedCount = dsaStore.attempts.length > 0 
    ? new Set(dsaStore.attempts.map(a => a.problemId)).size 
    : 80;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white py-6 sm:py-10 px-2 sm:px-4 print:bg-white print:text-black print:p-0 print:m-0">
      
      {/* 1. Floating Action Toolbar (Hidden in Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 px-2 print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Portfolio</span>
          </button>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono border border-emerald-500/20">
            <CheckCircle size={12} />
            <span>ATS 1-Page Optimized</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-semibold border border-white/10 flex items-center gap-1.5 transition-colors"
            title="Copy Resume Link"
          >
            <Share2 size={14} />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-transform active:scale-95"
          >
            <Printer size={15} />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Physical ATS Resume Sheet */}
      <div className="resume-sheet max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-12 print:p-0 print:m-0 print:shadow-none print:rounded-none print:max-w-none text-left font-sans">
        
        {/* Header Section */}
        <header className="border-b-2 border-slate-900 pb-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 uppercase">
              {profile.name}
            </h1>
            <p className="text-sm sm:text-base font-bold text-blue-700">
              {profile.title}
            </p>
          </div>

          {/* Contact Bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-2 font-medium">
            <span className="flex items-center gap-1">
              <MapPin size={11} className="text-slate-500" />
              <span>{profile.location || 'India'}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Mail size={11} className="text-slate-500" />
              <a href={`mailto:${profile.email}`} className="hover:text-blue-600 underline">
                {profile.email}
              </a>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <GithubIcon size={11} className="text-slate-500" />
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="hover:text-blue-600 underline">
                github.com/sanjeevvibhakar
              </a>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <LinkedinIcon size={11} className="text-slate-500" />
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-blue-600 underline">
                linkedin.com/in/sanjeev-vibhakar
              </a>
            </span>
          </div>
        </header>

        {/* Executive Summary */}
        <section className="mb-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Software Engineer specializing in high-throughput backend services, concurrency, and distributed data systems. Hands-on expertise building production microservices with <strong>Java 21 LTS, Spring Boot 3, Apache Kafka, Redis, and PostgreSQL</strong>. Proven track record in API performance optimization, cache stampede mitigation, and systematic algorithmic problem-solving.
          </p>
        </section>

        {/* Technical Skills Matrix */}
        <section className="mb-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
            Technical Skills
          </h2>
          <div className="text-xs text-slate-700 space-y-1">
            <div>
              <strong className="text-slate-900">Languages:</strong> Java 21 (Virtual Threads, JMM, Streams, Records), SQL, TypeScript, JavaScript
            </div>
            <div>
              <strong className="text-slate-900">Frameworks & Backend:</strong> Spring Boot 3, Spring Data JPA, Spring Security, Hibernate ORM, JUnit 5, Mockito, RESTful APIs
            </div>
            <div>
              <strong className="text-slate-900">Distributed Systems & Storage:</strong> PostgreSQL (Indexing, EXPLAIN ANALYZE), Redis (Cache-Aside, Mutex Locks), Apache Kafka (Partitions, Consumer Groups), Docker
            </div>
            <div>
              <strong className="text-slate-900">Core Engineering:</strong> Multithreading & Concurrency, Low-Level & High-Level System Design (LLD/HLD), Microservices, Git, CI/CD, Problem Solving (DSA)
            </div>
          </div>
        </section>

        {/* Professional Experience */}
        <section className="mb-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {experiences.map(exp => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-bold text-slate-950">{exp.role} — <span className="text-blue-800">{exp.company}</span></span>
                  <span className="font-mono text-slate-500 font-medium">{exp.period}</span>
                </div>
                <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                  {exp.description}
                </p>
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="text-[11px] text-slate-500 mt-1">
                    <em>Technologies: {exp.technologies.join(', ')}</em>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Key Engineering Projects */}
        <section className="mb-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-2">
            Selected Projects & System Architectures
          </h2>
          <div className="space-y-3">
            {projects.slice(0, 3).map(proj => (
              <div key={proj.id}>
                <div className="flex items-baseline justify-between text-xs">
                  <div className="font-bold text-slate-950 flex items-center gap-1.5">
                    <span>{proj.title}</span>
                    <span className="font-normal text-slate-500">|</span>
                    <span className="text-[11px] font-medium text-slate-600">{proj.techStack.join(', ')}</span>
                  </div>
                  {proj.githubUrl && (
                    <a
                      href={proj.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] font-mono text-blue-700 hover:underline shrink-0"
                    >
                      Source Code ↗
                    </a>
                  )}
                </div>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                  {proj.description}
                </p>
                {proj.architectureNotes && (
                  <div className="text-[11px] text-slate-600 mt-0.5 italic">
                    Architecture: {proj.architectureNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Education & Algorithmic Foundations */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Education
              </h2>
              <div className="text-xs text-slate-700">
                <div className="font-bold text-slate-950">Bachelor of Technology in Computer Science & Engineering</div>
                <div className="text-slate-500">Relevant Coursework: Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks</div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                Algorithmic & Problem Solving
              </h2>
              <div className="text-xs text-slate-700 space-y-0.5">
                <div>• Solved <strong>{dsaSolvedCount}+</strong> LeetCode & Striver A2Z problems across Two Pointers, Sliding Window, DP, and Graphs.</div>
                <div>• Engineered Leitner Spaced Repetition engine (+1, +3, +7, +21, +60 days) ensuring high recall retention.</div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Print Instructions Callout (Screen only) */}
      <div className="max-w-4xl mx-auto mt-6 text-center text-xs text-gray-500 print:hidden">
        💡 <strong>Pro Tip for PDF Export:</strong> In the print preview window, ensure destination is set to <em>"Save as PDF"</em>, margins to <em>"Default"</em> or <em>"Minimum"</em>, and background graphics are checked.
      </div>
    </div>
  );
};
