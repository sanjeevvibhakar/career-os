import React, { useState } from 'react';
import { 
  User, Briefcase, Wrench, Layers, ExternalLink, 
  Plus, Trash2, Edit2, Check, Sparkles, RefreshCw, Save 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { 
  usePortfolioStore, 
  type PortfolioProject, 
  type PortfolioSkill, 
  type PortfolioExperience 
} from '../../stores/portfolioStore';

export const ProfileEditPage: React.FC = () => {
  const portfolioStore = usePortfolioStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'skills' | 'experience'>('profile');

  // Profile Form state
  const [profileForm, setProfileForm] = useState(portfolioStore.profile);
  const [profileSaved, setProfileSaved] = useState(false);

  // Project Modal state
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<Omit<PortfolioProject, 'id'>>({
    title: '',
    slug: '',
    description: '',
    longDescription: '',
    architectureNotes: '',
    techStack: [],
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    featured: false,
  });
  const [techStackInput, setTechStackInput] = useState('');

  // Skill Modal state
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [skillForm, setSkillForm] = useState<Omit<PortfolioSkill, 'id'>>({
    name: '',
    category: 'Backend',
    proficiency: 85,
  });

  // Experience Modal state
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [expForm, setExpForm] = useState<Omit<PortfolioExperience, 'id'>>({
    company: '',
    role: '',
    period: '',
    startDate: '',
    endDate: null,
    description: '',
    technologies: [],
  });
  const [expTechInput, setExpTechInput] = useState('');

  // Handle Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    portfolioStore.updateProfile(profileForm);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  // Open Project Modal
  const openNewProjectModal = () => {
    setEditingProjectId(null);
    setProjectForm({
      title: '',
      slug: '',
      description: '',
      longDescription: '',
      architectureNotes: '',
      techStack: ['Java 21', 'Spring Boot', 'PostgreSQL'],
      githubUrl: '',
      liveUrl: '',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
      featured: false,
    });
    setTechStackInput('Java 21, Spring Boot, PostgreSQL');
    setProjectModalOpen(true);
  };

  const openEditProjectModal = (project: PortfolioProject) => {
    setEditingProjectId(project.id);
    setProjectForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      longDescription: project.longDescription,
      architectureNotes: project.architectureNotes,
      techStack: project.techStack,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      imageUrl: project.imageUrl,
      featured: project.featured,
    });
    setTechStackInput(project.techStack.join(', '));
    setProjectModalOpen(true);
  };

  const handleSaveProject = () => {
    if (!projectForm.title) return;
    const stack = techStackInput.split(',').map((s) => s.trim()).filter(Boolean);
    const slug = projectForm.slug || projectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const payload = { ...projectForm, slug, techStack: stack };

    if (editingProjectId) {
      portfolioStore.updateProject(editingProjectId, payload);
    } else {
      portfolioStore.addProject(payload);
    }
    setProjectModalOpen(false);
  };

  // Skill Handlers
  const openNewSkillModal = () => {
    setEditingSkillId(null);
    setSkillForm({ name: '', category: 'Backend', proficiency: 85 });
    setSkillModalOpen(true);
  };

  const openEditSkillModal = (skill: PortfolioSkill) => {
    setEditingSkillId(skill.id);
    setSkillForm({ name: skill.name, category: skill.category, proficiency: skill.proficiency });
    setSkillModalOpen(true);
  };

  const handleSaveSkill = () => {
    if (!skillForm.name) return;
    if (editingSkillId) {
      portfolioStore.updateSkill(editingSkillId, skillForm);
    } else {
      portfolioStore.addSkill(skillForm);
    }
    setSkillModalOpen(false);
  };

  // Experience Handlers
  const openNewExpModal = () => {
    setEditingExpId(null);
    setExpForm({
      company: '',
      role: '',
      period: '2024 – Present',
      startDate: '2024-01-01',
      endDate: null,
      description: '',
      technologies: ['Java 21', 'Spring Boot 3', 'PostgreSQL'],
    });
    setExpTechInput('Java 21, Spring Boot 3, PostgreSQL');
    setExpModalOpen(true);
  };

  const openEditExpModal = (exp: PortfolioExperience) => {
    setEditingExpId(exp.id);
    setExpForm({
      company: exp.company,
      role: exp.role,
      period: exp.period,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
      technologies: exp.technologies,
    });
    setExpTechInput(exp.technologies.join(', '));
    setExpModalOpen(true);
  };

  const handleSaveExp = () => {
    if (!expForm.company || !expForm.role) return;
    const stack = expTechInput.split(',').map((s) => s.trim()).filter(Boolean);
    const payload = { ...expForm, technologies: stack };
    if (editingExpId) {
      portfolioStore.updateExperience(editingExpId, payload);
    } else {
      portfolioStore.addExperience(payload);
    }
    setExpModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fade-in">
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl glass-panel border border-white/10 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-400">
              Public Showcase Management
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5 tracking-tight">
            Portfolio & Resume Editor
          </h1>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            Whatever you edit here instantly updates your public recruiter website.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl text-xs font-mono font-bold text-blue-400 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>Live Site</span>
            <ExternalLink size={13} />
          </a>
          <button
            onClick={() => {
              if (confirm('Reset portfolio to standard defaults?')) {
                portfolioStore.resetToDefaults();
                setProfileForm(portfolioStore.profile);
              }
            }}
            className="px-3 py-2 rounded-xl text-xs font-mono font-semibold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-1.5 transition-all"
            title="Reset to default bio & sample projects"
          >
            <RefreshCw size={13} />
            Reset Defaults
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
            activeTab === 'profile'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <User size={15} />
          <span>Profile & Bio</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
            activeTab === 'projects'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Briefcase size={15} />
          <span>Projects ({portfolioStore.projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
            activeTab === 'skills'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Wrench size={15} />
          <span>Skills ({portfolioStore.skills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('experience')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all flex-shrink-0 ${
            activeTab === 'experience'
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Layers size={15} />
          <span>Work Experience ({portfolioStore.experiences.length})</span>
        </button>
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB A: PROFILE */}
      {activeTab === 'profile' && (
        <Card className="p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">Profile Details & Bio</h2>
              <p className="text-xs text-gray-400">Information presented on the portfolio hero and contact cards.</p>
            </div>
            {profileSaved && (
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <Check size={13} /> Saved to Site!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                required
              />
              <Input
                label="Professional Headline / Title"
                value={profileForm.title}
                onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                required
              />
            </div>

            <Textarea
              label="Bio / Overview"
              rows={3}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Current Engineering Focus"
                value={profileForm.currentFocus}
                onChange={(e) => setProfileForm({ ...profileForm, currentFocus: e.target.value })}
              />
              <Input
                label="Location"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="GitHub URL"
                value={profileForm.githubUrl}
                onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
              />
              <Input
                label="LinkedIn URL"
                value={profileForm.linkedinUrl}
                onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
              />
              <Input
                label="Contact Email"
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Avatar / Photo URL"
                value={profileForm.avatarUrl}
                onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
              />
              <Input
                label="Resume Link (Google Drive or PDF URL)"
                value={profileForm.resumeUrl}
                onChange={(e) => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" variant="primary" className="gap-2">
                <Save size={16} /> Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB B: PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white">Showcased Projects</h2>
            <Button onClick={openNewProjectModal} variant="primary" size="sm" className="gap-1.5">
              <Plus size={15} /> Add Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolioStore.projects.map((proj) => (
              <Card key={proj.id} className="p-4 flex flex-col justify-between border-white/10 hover:border-blue-500/30 transition-all">
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{proj.title}</h3>
                        {proj.featured && (
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            ★ Featured
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{proj.description}</p>
                    </div>
                  </div>

                  {/* Tech Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.techStack.map((tech) => (
                      <span key={tech} className="text-[10px] font-mono bg-white/5 text-gray-300 px-2 py-0.5 rounded border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-xs text-blue-400 font-mono">
                    {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-1">Code <ExternalLink size={11} /></a>}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditProjectModal(proj)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
                      title="Edit Project"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${proj.title}"?`)) {
                          portfolioStore.deleteProject(proj.id);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 transition-all"
                      title="Delete Project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB C: SKILLS */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white">Technical Skills & Proficiencies</h2>
            <Button onClick={openNewSkillModal} variant="primary" size="sm" className="gap-1.5">
              <Plus size={15} /> Add Skill
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {portfolioStore.skills.map((skill) => (
              <Card key={skill.id} className="p-3.5 flex items-center justify-between border-white/10 hover:border-white/20 transition-all">
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="text-xs font-bold text-white truncate">{skill.name}</div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-gray-400">
                    <span className="text-blue-400">{skill.category}</span>
                    <span>•</span>
                    <span className="font-bold text-emerald-400">{skill.proficiency}%</span>
                  </div>
                  <div className="w-24 bg-white/10 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${skill.proficiency}%` }} />
                  </div>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => openEditSkillModal(skill)}
                    className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => portfolioStore.deleteSkill(skill.id)}
                    className="p-1 rounded-lg bg-rose-600/10 hover:bg-rose-600/20 text-rose-400"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB D: EXPERIENCE */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-white">Work Experience & Roles</h2>
            <Button onClick={openNewExpModal} variant="primary" size="sm" className="gap-1.5">
              <Plus size={15} /> Add Experience
            </Button>
          </div>

          <div className="space-y-3">
            {portfolioStore.experiences.map((exp) => (
              <Card key={exp.id} className="p-4 sm:p-5 border-white/10 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-white">{exp.role}</h3>
                    <p className="text-xs text-blue-400 font-mono">{exp.company} • {exp.period}</p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Button onClick={() => openEditExpModal(exp)} variant="secondary" size="sm" className="gap-1">
                      <Edit2 size={13} /> Edit
                    </Button>
                    <Button
                      onClick={() => {
                        if (confirm(`Delete experience at "${exp.company}"?`)) {
                          portfolioStore.deleteExperience(exp.id);
                        }
                      }}
                      variant="danger"
                      size="sm"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">{exp.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {exp.technologies.map((t) => (
                    <span key={t} className="text-[10px] font-mono bg-blue-500/10 text-blue-300 px-2 py-0.5 rounded border border-blue-500/20">
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* --- MODALS --- */}

      {/* Project Modal */}
      <Modal isOpen={projectModalOpen} onClose={() => setProjectModalOpen(false)} title={editingProjectId ? 'Edit Project' : 'Add New Project'}>
        <div className="space-y-3.5 pt-1 max-h-[75vh] overflow-y-auto pr-1">
          <Input
            label="Project Title"
            value={projectForm.title}
            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
            placeholder="e.g. Distributed Task Orchestrator"
            required
          />

          <Input
            label="Short Summary"
            value={projectForm.description}
            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            placeholder="1-2 sentences summarizing the project for the card view"
            required
          />

          <Textarea
            label="Full Description"
            rows={3}
            value={projectForm.longDescription}
            onChange={(e) => setProjectForm({ ...projectForm, longDescription: e.target.value })}
            placeholder="Detailed architecture, challenges solved, results achieved"
          />

          <Input
            label="Architecture Notes"
            value={projectForm.architectureNotes}
            onChange={(e) => setProjectForm({ ...projectForm, architectureNotes: e.target.value })}
            placeholder="e.g. Spring Boot 3, Kafka, Redis, PostgreSQL with B-Tree indexes"
          />

          <Input
            label="Tech Stack (Comma Separated)"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            placeholder="e.g. Java 21, Spring Boot, Kafka, Docker"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="GitHub URL"
              value={projectForm.githubUrl}
              onChange={(e) => setProjectForm({ ...projectForm, githubUrl: e.target.value })}
              placeholder="https://github.com/..."
            />
            <Input
              label="Live Demo URL"
              value={projectForm.liveUrl}
              onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <Input
            label="Cover Image URL"
            value={projectForm.imageUrl}
            onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="projFeatured"
              checked={projectForm.featured}
              onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
              className="rounded border-gray-700 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="projFeatured" className="text-xs text-gray-300 font-semibold cursor-pointer">
              Feature on Portfolio Homepage
            </label>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
            <Button variant="ghost" onClick={() => setProjectModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveProject}>Save Project</Button>
          </div>
        </div>
      </Modal>

      {/* Skill Modal */}
      <Modal isOpen={skillModalOpen} onClose={() => setSkillModalOpen(false)} title={editingSkillId ? 'Edit Skill' : 'Add New Skill'}>
        <div className="space-y-4 pt-1">
          <Input
            label="Skill Name"
            value={skillForm.name}
            onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
            placeholder="e.g. Java 21 Virtual Threads, Kafka, PostgreSQL"
            required
          />

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 font-mono">Category</label>
            <select
              value={skillForm.category}
              onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as any })}
              className="w-full bg-[#121622] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="Backend">Backend</option>
              <option value="Database & Storage">Database & Storage</option>
              <option value="Distributed Systems">Distributed Systems</option>
              <option value="Frontend">Frontend</option>
              <option value="DevOps & Tools">DevOps & Tools</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
              <span>Proficiency</span>
              <span className="font-bold text-emerald-400">{skillForm.proficiency}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={skillForm.proficiency}
              onChange={(e) => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) })}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
            <Button variant="ghost" onClick={() => setSkillModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveSkill}>Save Skill</Button>
          </div>
        </div>
      </Modal>

      {/* Experience Modal */}
      <Modal isOpen={expModalOpen} onClose={() => setExpModalOpen(false)} title={editingExpId ? 'Edit Experience' : 'Add Experience'}>
        <div className="space-y-3.5 pt-1 max-h-[75vh] overflow-y-auto pr-1">
          <Input
            label="Company Name"
            value={expForm.company}
            onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
            placeholder="e.g. Tech Solutions Inc."
            required
          />

          <Input
            label="Role / Title"
            value={expForm.role}
            onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
            placeholder="e.g. Software Engineer"
            required
          />

          <Input
            label="Period"
            value={expForm.period}
            onChange={(e) => setExpForm({ ...expForm, period: e.target.value })}
            placeholder="e.g. 2024 – Present or Jan 2023 – Dec 2024"
            required
          />

          <Textarea
            label="Responsibilities & Impact"
            rows={3}
            value={expForm.description}
            onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
            placeholder="Key achievements, technologies used, performance optimizations..."
          />

          <Input
            label="Technologies Used (Comma Separated)"
            value={expTechInput}
            onChange={(e) => setExpTechInput(e.target.value)}
            placeholder="e.g. Java 21, Spring Boot, PostgreSQL, Kafka, Redis"
          />

          <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
            <Button variant="ghost" onClick={() => setExpModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveExp}>Save Experience</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
