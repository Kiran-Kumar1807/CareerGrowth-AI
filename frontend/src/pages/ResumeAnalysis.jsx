import React from 'react'
import { CheckCircle2, XCircle, Lightbulb, User, Briefcase, GraduationCap, Award, FolderOpen } from 'lucide-react'
import { useResume } from '../context/ResumeContext'
import { ScoreGauge } from '../components/ui/ScoreRing'
import EmptyState from '../components/ui/EmptyState'
import clsx from 'clsx'

function ScoreBar({ label, score }) {
  const color = score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-slate-300 font-medium">{label}</span>
        <span className={clsx('font-bold', score >= 75 ? 'text-emerald-400' : score >= 50 ? 'text-amber-400' : 'text-red-400')}>
          {score}/100
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

export default function ResumeAnalysis() {
  const { resumeData } = useResume()
  if (!resumeData) return <EmptyState title="No Resume Analyzed" description="Upload your resume on the Overview page to see a full analysis." />

  const { parsed_resume: resume, ats_analysis: ats } = resumeData
  const { personal_info: info, experience, education, certifications, projects, skills } = resume

  return (
    <div className="p-8 space-y-8">
      {/* Top row: score + sub-scores */}
      <div className="grid grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col items-center justify-center gap-3">
          <ScoreGauge score={ats.overall_score} label="ATS Score" size={160} />
          <p className={clsx('text-sm font-semibold',
            ats.overall_score >= 75 ? 'text-emerald-400' :
            ats.overall_score >= 50 ? 'text-amber-400' : 'text-red-400'
          )}>
            {ats.overall_score >= 75 ? 'Excellent' : ats.overall_score >= 50 ? 'Good — Needs Work' : 'Needs Improvement'}
          </p>
        </div>

        <div className="glass-card p-6 col-span-2 space-y-4">
          <p className="section-title">Score Breakdown</p>
          <ScoreBar label="Resume Structure"    score={ats.structure_score}   />
          <ScoreBar label="Keyword Optimization" score={ats.keyword_score}   />
          <ScoreBar label="Experience Relevance" score={ats.experience_score} />
          <ScoreBar label="Skills Coverage"      score={ats.skills_score}     />
          <ScoreBar label="Formatting Quality"   score={ats.formatting_score} />
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <p className="section-title text-emerald-400 mb-4 flex items-center gap-2">
            <CheckCircle2 size={18} /> Strengths
          </p>
          <ul className="space-y-2">
            {ats.strengths.map((s, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-300">
                <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card p-6">
          <p className="section-title text-red-400 mb-4 flex items-center gap-2">
            <XCircle size={18} /> Weaknesses
          </p>
          <ul className="space-y-2">
            {ats.weaknesses.map((w, i) => (
              <li key={i} className="flex gap-2 text-sm text-slate-300">
                <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* AI Improvement Suggestions */}
      <div className="glass-card p-6">
        <p className="section-title flex items-center gap-2 mb-4">
          <Lightbulb size={18} className="text-amber-400" /> AI Improvement Suggestions
        </p>
        <div className="grid grid-cols-1 gap-3">
          {ats.improvements.map((imp, i) => (
            <div key={i} className="flex gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center shrink-0 text-amber-400 text-xs font-bold">
                {i + 1}
              </div>
              <div>
                <span className="inline-block badge bg-brand-500/15 text-brand-300 border border-brand-500/20 mb-1">{imp.category}</span>
                <p className="text-sm text-red-400/80 mb-1"><span className="font-medium text-slate-300">Issue: </span>{imp.issue}</p>
                <p className="text-sm text-emerald-400/80"><span className="font-medium text-slate-300">Fix: </span>{imp.suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Parsed Resume Details */}
      <div className="grid grid-cols-2 gap-6">
        {/* Personal Info */}
        <div className="glass-card p-6">
          <p className="section-title flex items-center gap-2 mb-4"><User size={16} /> Personal Info</p>
          <dl className="space-y-2 text-sm">
            {[
              { label: 'Name',     value: info.name },
              { label: 'Email',    value: info.email },
              { label: 'Phone',    value: info.phone },
              { label: 'Location', value: info.location },
              { label: 'LinkedIn', value: info.linkedin },
              { label: 'GitHub',   value: info.github },
            ].filter(r => r.value).map(({ label, value }) => (
              <div key={label} className="flex gap-3">
                <dt className="text-slate-500 w-20 shrink-0">{label}</dt>
                <dd className="text-slate-200 truncate">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Education */}
        <div className="glass-card p-6">
          <p className="section-title flex items-center gap-2 mb-4"><GraduationCap size={16} /> Education</p>
          <div className="space-y-3">
            {education.map((ed, i) => (
              <div key={i} className="p-3 bg-slate-800/40 rounded-xl">
                <p className="text-sm font-semibold text-white">{ed.degree}</p>
                <p className="text-xs text-slate-400">{ed.institution}</p>
                <div className="flex gap-3 mt-1">
                  {ed.year && <span className="text-xs text-slate-500">{ed.year}</span>}
                  {ed.gpa && <span className="text-xs text-emerald-500">GPA: {ed.gpa}</span>}
                </div>
              </div>
            ))}
            {education.length === 0 && <p className="text-slate-600 text-sm">No education extracted.</p>}
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="glass-card p-6">
        <p className="section-title flex items-center gap-2 mb-4"><Briefcase size={16} /> Experience</p>
        <div className="space-y-4">
          {experience.map((exp, i) => (
            <div key={i} className="relative pl-6 border-l-2 border-slate-700">
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-brand-500" />
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="font-semibold text-white text-sm">{exp.title}</p>
                  <p className="text-xs text-brand-400">{exp.company}</p>
                </div>
                <span className="badge bg-slate-800 text-slate-400 border border-slate-700 text-xs shrink-0">{exp.duration}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{exp.description}</p>
            </div>
          ))}
          {experience.length === 0 && <p className="text-slate-600 text-sm">No experience extracted.</p>}
        </div>
      </div>

      {/* Certifications & Projects */}
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <p className="section-title flex items-center gap-2 mb-4"><Award size={16} /> Certifications</p>
          {certifications.length > 0 ? (
            <ul className="space-y-2">
              {certifications.map((c, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-300">
                  <Award size={14} className="text-amber-400 shrink-0 mt-0.5" />{c}
                </li>
              ))}
            </ul>
          ) : <p className="text-slate-600 text-sm">No certifications found.</p>}
        </div>
        <div className="glass-card p-6">
          <p className="section-title flex items-center gap-2 mb-4"><FolderOpen size={16} /> Projects</p>
          {projects.length > 0 ? (
            <ul className="space-y-2">
              {projects.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-300">
                  <FolderOpen size={14} className="text-cyan-400 shrink-0 mt-0.5" />{p}
                </li>
              ))}
            </ul>
          ) : <p className="text-slate-600 text-sm">No projects found.</p>}
        </div>
      </div>
    </div>
  )
}
