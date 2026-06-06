import React, { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { GitBranch, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'
import { getRoadmap } from '../services/api'
import { MatchingSkillBadge, MissingSkillBadge } from '../components/ui/SkillBadge'
import EmptyState from '../components/ui/EmptyState'
import LoadingState from '../components/ui/LoadingState'
import clsx from 'clsx'

const PRIORITY_COLORS = {
  High:   { bar: '#ef4444', badge: 'bg-red-500/15 text-red-400 border-red-500/20' },
  Medium: { bar: '#f59e0b', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  Low:    { bar: '#10b981', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
}

function getPriority(idx, total) {
  if (idx < total * 0.33) return 'High'
  if (idx < total * 0.66) return 'Medium'
  return 'Low'
}

export default function SkillGap() {
  const navigate = useNavigate()
  const { jobData, sessionId, setRoadmapData, setSelectedJobId } = useResume()
  const [active, setActive] = useState(0)
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false)

  if (!jobData) return <EmptyState title="No Skill Gap Data" description="Upload your resume and run job matching first." />

  const { skill_gaps, recommendations } = jobData

  if (generatingRoadmap) {
    return <div className="p-8"><LoadingState message="Building your roadmap..." subtext="AI is crafting a personalized learning plan" /></div>
  }

  if (!skill_gaps || skill_gaps.length === 0) {
    return (
      <div className="p-8">
        <div className="glass-card p-10 text-center">
          <TrendingUp size={40} className="text-emerald-400 mx-auto mb-4" />
          <p className="text-white font-bold text-lg">No Skill Gaps!</p>
          <p className="text-slate-400 text-sm mt-2">Your skills match the top recommended roles perfectly.</p>
        </div>
      </div>
    )
  }

  const gap = skill_gaps[active]
  const match = recommendations.find(r => r.job.title === gap.target_role)

  const chartData = gap.missing_skills.slice(0, 8).map((skill, i) => ({
    skill,
    priority: 10 - i,
    priorityLabel: getPriority(i, gap.missing_skills.length),
  }))

  const handleGetRoadmap = async () => {
    if (!match) return
    setGeneratingRoadmap(true)
    try {
      const { data } = await getRoadmap(sessionId, match.job.id)
      setRoadmapData(data)
      setSelectedJobId(match.job.id)
      navigate('/roadmap')
    } catch (err) {
      console.error(err)
    } finally {
      setGeneratingRoadmap(false)
    }
  }

  return (
    <div className="p-8 space-y-6">
      {/* Role tabs */}
      <div className="flex gap-2">
        {skill_gaps.map((gap, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={clsx(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              i === active
                ? 'bg-brand-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            )}
          >
            {gap.target_role}
          </button>
        ))}
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-extrabold text-white">{gap.required_skills.length}</p>
          <p className="text-sm text-slate-400 mt-1">Required Skills</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-extrabold text-emerald-400">{gap.current_skills.length}</p>
          <p className="text-sm text-slate-400 mt-1">Skills You Have</p>
        </div>
        <div className="glass-card p-5 text-center">
          <p className="text-3xl font-extrabold text-red-400">{gap.missing_skills.length}</p>
          <p className="text-sm text-slate-400 mt-1">Skills to Learn</p>
        </div>
      </div>

      {/* Chart + Priority list */}
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <p className="section-title mb-4">Missing Skills Priority</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis type="number" domain={[0, 10]} tick={{ fill: '#64748b', fontSize: 11 }} />
              <YAxis type="category" dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 11 }} width={80} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                cursor={{ fill: '#1e293b' }}
              />
              <Bar dataKey="priority" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={PRIORITY_COLORS[entry.priorityLabel].bar} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <p className="section-title mb-4">Priority Breakdown</p>
          <div className="space-y-2 mb-6">
            {gap.missing_skills.map((skill, i) => {
              const priority = getPriority(i, gap.missing_skills.length)
              return (
                <div key={skill} className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-xl">
                  <span className="text-sm text-slate-200">{skill}</span>
                  <span className={clsx('badge border text-xs', PRIORITY_COLORS[priority].badge)}>{priority}</span>
                </div>
              )
            })}
          </div>
          <button onClick={handleGetRoadmap} className="btn-primary w-full flex items-center justify-center gap-2 mt-auto">
            <GitBranch size={16} /> Generate Learning Roadmap <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Current vs Missing skills side by side */}
      <div className="grid grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <p className="section-title text-emerald-400 mb-3">Skills You Have</p>
          <div className="flex flex-wrap gap-1.5">
            {gap.current_skills.map(s => <MatchingSkillBadge key={s} skill={s} />)}
            {gap.current_skills.length === 0 && <p className="text-slate-600 text-sm">None matching.</p>}
          </div>
        </div>
        <div className="glass-card p-6">
          <p className="section-title text-red-400 mb-3">Skills You Need</p>
          <div className="flex flex-wrap gap-1.5">
            {gap.missing_skills.map(s => <MissingSkillBadge key={s} skill={s} />)}
          </div>
        </div>
      </div>

      {/* Impact banner */}
      {match && (
        <div className="glass-card p-5 border-brand-500/30 bg-brand-500/5">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-brand-400 shrink-0" />
            <p className="text-sm text-slate-200">
              By learning these <span className="font-bold text-brand-300">{gap.missing_skills.length} skills</span>,
              your match for <span className="font-bold text-white">{gap.target_role}</span> can jump from{' '}
              <span className="font-bold text-amber-400">{match.match_percentage}%</span> to{' '}
              <span className="font-bold text-emerald-400">90%+</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
