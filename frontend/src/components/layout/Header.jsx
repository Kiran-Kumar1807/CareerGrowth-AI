import React from 'react'
import { useLocation } from 'react-router-dom'
import { Bell, Sparkles } from 'lucide-react'
import { useResume } from '../../context/ResumeContext'

const PAGE_META = {
  '/':           { title: 'Overview',          subtitle: 'Your career health at a glance' },
  '/analysis':   { title: 'Resume Analysis',   subtitle: 'Detailed ATS feedback and suggestions' },
  '/skills':     { title: 'Skills Profile',    subtitle: 'Your technical and soft skills breakdown' },
  '/jobs':       { title: 'Job Matches',        subtitle: 'Roles matched to your skillset' },
  '/skill-gap':  { title: 'Skill Gap Analysis', subtitle: 'What you need to reach your target role' },
  '/roadmap':    { title: 'Learning Roadmap',   subtitle: 'Personalized upskilling plan' },
}

export default function Header() {
  const { pathname } = useLocation()
  const { resumeData } = useResume()
  const meta = PAGE_META[pathname] || { title: 'CareerGrowth AI', subtitle: '' }
  const atsScore = resumeData?.ats_analysis?.overall_score

  return (
    <header className="h-16 bg-slate-900/80 border-b border-slate-800 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-10">
      <div>
        <h1 className="font-semibold text-white text-base leading-tight">{meta.title}</h1>
        <p className="text-xs text-slate-500">{meta.subtitle}</p>
      </div>

      <div className="flex items-center gap-4">
        {atsScore !== undefined && (
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5">
            <Sparkles size={14} className="text-brand-400" />
            <span className="text-xs font-medium text-slate-300">ATS Score:</span>
            <span className={`text-sm font-bold ${atsScore >= 75 ? 'text-emerald-400' : atsScore >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
              {atsScore}
            </span>
          </div>
        )}
        <button className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center hover:bg-slate-700 transition-colors">
          <Bell size={16} className="text-slate-400" />
        </button>
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-brand-500/20">
          U
        </div>
      </div>
    </header>
  )
}
