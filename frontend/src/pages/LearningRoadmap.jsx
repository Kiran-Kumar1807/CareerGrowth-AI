import React, { useState } from 'react'
import { Map, Target, TrendingUp, BookOpen, CheckSquare, ChevronDown, ChevronUp, Zap, ExternalLink } from 'lucide-react'
import { useResume } from '../context/ResumeContext'
import SkillBadge from '../components/ui/SkillBadge'
import EmptyState from '../components/ui/EmptyState'
import clsx from 'clsx'

const MONTH_COLORS = ['brand', 'purple', 'cyan', 'green']
const MONTH_GRADIENTS = [
  'from-brand-500/10 to-brand-600/5 border-brand-500/20',
  'from-purple-500/10 to-purple-600/5 border-purple-500/20',
  'from-cyan-500/10 to-cyan-600/5 border-cyan-500/20',
  'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20',
]

function ProgressArrow({ from, to }) {
  return (
    <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700 rounded-2xl px-6 py-4">
      <div className="text-center">
        <p className="text-2xl font-extrabold text-amber-400">{from}%</p>
        <p className="text-xs text-slate-500">Current Match</p>
      </div>
      <div className="flex-1 flex items-center gap-1">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-gradient-to-r from-amber-500 to-emerald-500 opacity-50" />
        ))}
        <TrendingUp size={20} className="text-emerald-400 shrink-0" />
      </div>
      <div className="text-center">
        <p className="text-2xl font-extrabold text-emerald-400">{to}%</p>
        <p className="text-xs text-slate-500">After Roadmap</p>
      </div>
    </div>
  )
}

function WeekCard({ week }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-3 hover:bg-slate-800/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
            {week.week}
          </span>
          <p className="text-sm text-slate-200 font-medium">{week.topic}</p>
        </div>
        {open ? <ChevronUp size={14} className="text-slate-500" /> : <ChevronDown size={14} className="text-slate-500" />}
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-3 bg-slate-900/40">
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <BookOpen size={12} /> Resources
            </p>
            <ul className="space-y-1">
              {week.resources.map((r, i) => (
                <li key={i} className="text-xs text-brand-300 flex items-center gap-1.5">
                  <ExternalLink size={10} className="shrink-0" /> {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
              <CheckSquare size={12} /> Deliverable
            </p>
            <p className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
              {week.deliverable}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function LearningRoadmap() {
  const { roadmapData } = useResume()
  const [expandedMonth, setExpandedMonth] = useState(0)

  if (!roadmapData) {
    return (
      <EmptyState
        icon={Map}
        title="No Roadmap Yet"
        description="Go to Job Matches or Skill Gap page and click 'Get Roadmap' to generate your personalized learning plan."
      />
    )
  }

  const { target_role, current_match, projected_match, total_duration_weeks, months, priority_skills } = roadmapData

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={18} className="text-brand-400" />
              <p className="text-xs text-brand-400 font-semibold uppercase tracking-wider">Target Role</p>
            </div>
            <p className="text-2xl font-extrabold text-white">{target_role}</p>
            <p className="text-slate-400 text-sm mt-1">{total_duration_weeks}-week personalized learning plan</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 mb-1">Priority Skills</p>
            <div className="flex flex-wrap gap-1.5 justify-end max-w-xs">
              {priority_skills.map((s, i) => (
                <SkillBadge key={s} skill={s} variant={['purple', 'blue', 'cyan', 'green', 'amber'][i % 5]} />
              ))}
            </div>
          </div>
        </div>
        <ProgressArrow from={current_match} to={projected_match} />
      </div>

      {/* Months */}
      <div className="space-y-4">
        {months.map((month, mi) => {
          const isOpen = expandedMonth === mi
          return (
            <div key={mi} className={clsx('glass-card overflow-hidden border bg-gradient-to-br', MONTH_GRADIENTS[mi % 4])}>
              {/* Month header */}
              <button
                onClick={() => setExpandedMonth(isOpen ? -1 : mi)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col items-center justify-center shrink-0">
                    <p className="text-[10px] text-slate-500 font-medium leading-none">Month</p>
                    <p className="text-xl font-extrabold text-white leading-none">{month.month}</p>
                  </div>
                  <div>
                    <p className="font-bold text-white text-base">{month.title}</p>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {month.skills.map(s => (
                        <SkillBadge key={s} skill={s} variant={MONTH_COLORS[mi % 4]} size="xs" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="badge bg-slate-800/80 text-slate-400 border border-slate-700 text-xs">
                    {month.weeks.length} weeks
                  </span>
                  {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                </div>
              </button>

              {/* Weeks */}
              {isOpen && (
                <div className="px-5 pb-5 space-y-2">
                  <div className="h-px bg-slate-800 mb-4" />
                  {month.weeks.map(week => <WeekCard key={week.week} week={week} />)}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer tip */}
      <div className="glass-card p-5 border-brand-500/20 bg-brand-500/5">
        <p className="text-sm text-slate-300 flex items-start gap-2">
          <Target size={16} className="text-brand-400 shrink-0 mt-0.5" />
          <span>
            Completing this roadmap is estimated to raise your <strong className="text-white">{target_role}</strong> match from{' '}
            <strong className="text-amber-400">{current_match}%</strong> to{' '}
            <strong className="text-emerald-400">{projected_match}%</strong>.
            Dedicate 1–2 hours per day and you can complete this in {total_duration_weeks} weeks.
          </span>
        </p>
      </div>
    </div>
  )
}
