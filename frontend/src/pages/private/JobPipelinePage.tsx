import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { useCareerStore } from '../../stores/careerStore';
import { evaluateRoleMatch } from '../../engine/roleMatchingEngine';
import type { JobOpportunity, JobApplicationState } from '../../types/career';
import { 
  Briefcase, Plus, ExternalLink, ShieldCheck, CheckCircle2, 
  AlertCircle, ChevronRight, IndianRupee, MapPin, Building2, Trash2, Edit2 
} from 'lucide-react';

const PIPELINE_COLUMNS: { state: JobApplicationState; label: string; color: string }[] = [
  { state: 'SAVED', label: 'Saved & Researching', color: 'border-gray-500' },
  { state: 'PREPARING', label: 'Closing Skill Gaps', color: 'border-blue-500' },
  { state: 'APPLIED', label: 'Applied / Referral', color: 'border-purple-500' },
  { state: 'OA', label: 'Online Assessment', color: 'border-amber-500' },
  { state: 'INTERVIEW', label: 'Technical Rounds', color: 'border-emerald-500' },
  { state: 'OFFER', label: 'Offer Received', color: 'border-yellow-400' },
];

export const JobPipelinePage: React.FC = () => {
  const { jobs, skills, profile, addJob, updateJobStatus, deleteJob } = useCareerStore();

  const [selectedJobId, setSelectedJobId] = useState<string | null>(jobs[0]?.id || null);
  const [addJobModalOpen, setAddJobModalOpen] = useState(false);

  // New Job Form State
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('Software Engineer - Backend (Java / Spring Boot)');
  const [newUrl, setNewUrl] = useState('');
  const [newLocation, setNewLocation] = useState('Bangalore / Hybrid');
  const [newReqSkills, setNewReqSkills] = useState('Java, Spring Boot, PostgreSQL, DSA, REST APIs');
  const [newPrefSkills, setNewPrefSkills] = useState('Redis, Kafka, Docker, AWS');
  const [newFixedLpa, setNewFixedLpa] = useState<number>(28);
  const [newTotalLpa, setNewTotalLpa] = useState<number>(38);
  const [newNotes, setNewNotes] = useState('');

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const matchResult = selectedJob ? evaluateRoleMatch(selectedJob, skills) : null;

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim()) return;

    addJob({
      company: newCompany,
      role: newRole,
      officialJobUrl: newUrl,
      location: newLocation,
      workMode: 'HYBRID',
      experienceRequiredYears: 1,
      requiredSkills: newReqSkills.split(',').map(s => s.trim()).filter(Boolean),
      preferredSkills: newPrefSkills.split(',').map(s => s.trim()).filter(Boolean),
      status: 'SAVED',
      referralStatus: 'NONE',
      interviewRounds: [
        { roundName: 'Online Coding Assessment (DSA)', status: 'PENDING' },
        { roundName: 'Technical Round 1 (Java, Concurrency & DSA)', status: 'PENDING' },
        { roundName: 'Technical Round 2 (System Design & LLD)', status: 'PENDING' },
      ],
      compensation: {
        fixedLpa: newFixedLpa || undefined,
        totalLpa: newTotalLpa || undefined,
        source: 'USER_ENTERED',
      },
      notes: newNotes,
      followUpActions: ['Match skills and identify top 2 gaps to close'],
    });

    setAddJobModalOpen(false);
    setNewCompany('');
    setNewUrl('');
    setNewNotes('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Target Role & Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono border border-emerald-500/30">
              Target CTC: ₹{profile.targetCareer.targetCtcMinLpa}–{profile.targetCareer.targetCtcMaxLpa} LPA
            </span>
            <span className="text-xs text-gray-400 font-mono">
              Target Window: May–June 2027
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Target Role & Job Pipeline
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {profile.targetCareer.primaryIdentity} • Grounded matching against real JD requirements.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setAddJobModalOpen(true)}
          className="text-xs flex items-center justify-center min-h-[44px] w-full sm:w-auto gap-1.5"
        >
          <Plus size={14} />
          <span>Add Target Job Opportunity</span>
        </Button>
      </div>

      {/* Main Grid: Pipeline List & Match Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Job Pipeline Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
              Tracked Opportunities ({jobs.length})
            </h2>
            <div className="text-xs text-gray-500 font-mono">
              Saved → Preparing → Applied → OA → Interview → Offer
            </div>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => {
              const isSelected = selectedJob?.id === job.id;
              const match = evaluateRoleMatch(job, skills);

              return (
                <Card
                  key={job.id}
                  className={`p-4 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-900/20 border-blue-500/50 shadow-md'
                      : 'bg-[#0d1017] border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setSelectedJobId(job.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-blue-400 shrink-0" />
                        <h3 className="text-sm font-bold text-white">{job.company}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-white/10 text-gray-300">
                          {job.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-300">{job.role}</div>
                      <div className="text-[11px] text-gray-400 flex items-center gap-2">
                        <span>{job.location}</span>
                        {job.compensation.totalLpa && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-semibold font-mono">
                              ₹{job.compensation.totalLpa} LPA CTC
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-bold text-white font-mono">
                          {match.matchScorePct}% Match
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {match.criticalSkillGaps.length} gaps to close
                        </div>
                      </div>

                      <select
                        value={job.status}
                        onChange={(e) => updateJobStatus(job.id, e.target.value as JobApplicationState)}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-[#161a26] border border-white/10 rounded px-2 py-1 text-xs text-white focus:outline-none"
                      >
                        <option value="SAVED">Saved</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="APPLIED">Applied</option>
                        <option value="OA">OA</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFER">Offer</option>
                        <option value="REJECTED">Rejected</option>
                      </select>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteJob(job.id);
                        }}
                        className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Column: Grounded Match Analysis & Gap Closing Plan */}
        <div>
          {selectedJob && matchResult ? (
            <Card className="p-5 bg-[#0d1017] border-white/10 space-y-4 sticky top-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-gray-400">Role Match Inspection</span>
                  <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold ${
                    matchResult.matchScorePct >= 80 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : matchResult.matchScorePct >= 65 
                      ? 'bg-blue-500/20 text-blue-300' 
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {matchResult.matchScorePct}% Qualified
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{selectedJob.company}</h3>
                <div className="text-xs text-gray-400">{selectedJob.role}</div>

                {selectedJob.officialJobUrl && (
                  <a
                    href={selectedJob.officialJobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 mt-1 font-mono"
                  >
                    <span>View Official Posting</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>

              {/* Compensation Breakdown */}
              <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1 text-xs">
                <div className="font-semibold text-gray-400 text-[10px] uppercase">Compensation Target</div>
                <div className="flex items-center justify-between text-white font-mono">
                  <span>Fixed Base Salary:</span>
                  <span className="font-bold text-emerald-400">₹{selectedJob.compensation.fixedLpa || 'N/A'} LPA</span>
                </div>
                <div className="flex items-center justify-between text-white font-mono">
                  <span>Total Target CTC:</span>
                  <span className="font-bold text-emerald-400">₹{selectedJob.compensation.totalLpa || 'N/A'} LPA</span>
                </div>
                <div className="text-[10px] text-gray-500">Source: {selectedJob.compensation.source}</div>
              </div>

              {/* Verified Strengths */}
              <div>
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Verified Strengths ({matchResult.matchedStrengths.length})</span>
                </h4>
                <div className="space-y-1.5">
                  {matchResult.matchedStrengths.map((s, idx) => (
                    <div key={idx} className="p-2 rounded bg-emerald-950/20 border border-emerald-500/20 text-xs flex items-center justify-between">
                      <span className="text-gray-200">{s.skillName}</span>
                      <span className="text-[10px] font-mono text-emerald-300">Level {s.assessedLevel}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Skill Gaps & Action Tasks */}
              <div>
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle size={14} />
                  <span>Gaps to Close ({matchResult.criticalSkillGaps.length})</span>
                </h4>
                <div className="space-y-2">
                  {matchResult.criticalSkillGaps.map((gap, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-amber-950/20 border border-amber-500/20 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold text-white">
                        <span>{gap.requiredSkill}</span>
                        <span className="text-[10px] text-amber-300 font-mono">Lv {gap.currentAssessedLevel}</span>
                      </div>
                      <div className="text-[11px] text-gray-300 leading-snug">
                        {gap.recommendedPreparationTask}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Rounds */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Interview Rounds
                </h4>
                <div className="space-y-1">
                  {selectedJob.interviewRounds.map((round, idx) => (
                    <div key={idx} className="p-2 rounded bg-white/5 text-xs flex items-center justify-between text-gray-300">
                      <span>{round.roundName}</span>
                      <span className="text-[10px] font-mono text-gray-500">{round.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            <div className="p-6 text-center text-xs text-gray-500">
              Select a job to view match breakdown.
            </div>
          )}
        </div>
      </div>

      {/* Add Job Modal */}
      <Modal isOpen={addJobModalOpen} onClose={() => setAddJobModalOpen(false)} title="Track Target Job Opportunity">
        <form onSubmit={handleCreateJob} className="space-y-4 max-h-[75vh] overflow-y-auto text-sm pr-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Company Name</label>
              <Input
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="e.g. Razorpay, Swiggy, Atlassian"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Role Title</label>
              <Input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g. SDE-1 (Java Backend)"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Official Career URL</label>
              <Input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://careers.company.com/job/..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Location / Work Mode</label>
              <Input
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Bangalore, India (Hybrid)"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Required Skills (Comma separated)</label>
            <Input
              value={newReqSkills}
              onChange={(e) => setNewReqSkills(e.target.value)}
              placeholder="Java, Spring Boot, PostgreSQL, DSA"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Preferred Bonus Skills (Comma separated)</label>
            <Input
              value={newPrefSkills}
              onChange={(e) => setNewPrefSkills(e.target.value)}
              placeholder="Redis, Kafka, Docker, AWS"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Estimated Fixed Base (LPA)</label>
              <Input
                type="number"
                value={newFixedLpa}
                onChange={(e) => setNewFixedLpa(Number(e.target.value))}
                placeholder="28"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Estimated Total CTC (LPA)</label>
              <Input
                type="number"
                value={newTotalLpa}
                onChange={(e) => setNewTotalLpa(Number(e.target.value))}
                placeholder="38"
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
            <Button variant="secondary" type="button" onClick={() => setAddJobModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Job Opportunity
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
