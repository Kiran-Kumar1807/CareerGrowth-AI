import React from 'react'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'
import { Code2, Layers, Database, Cloud, Wrench, MessageSquare } from 'lucide-react'
import { useResume } from '../context/ResumeContext'
import SkillBadge from '../components/ui/SkillBadge'
import EmptyState from '../components/ui/EmptyState'

const CATEGORIES = [
  { key: 'programming_languages', label: 'Languages',   icon: Code2,         variant: 'purple' },
  { key: 'frameworks',            label: 'Frameworks',  icon: Layers,        variant: 'blue'   },
  { key: 'databases',             label: 'Databases',   icon: Database,      variant: 'cyan'   },
  { key: 'cloud',                 label: 'Cloud',       icon: Cloud,         variant: 'green'  },
  { key: 'tools',                 label: 'Tools',       icon: Wrench,        variant: 'amber'  },
  { key: 'soft_skills',           label: 'Soft Skills', icon: MessageSquare, variant: 'pink'   },
]

export default function Skills() {
  const { resumeData } = useResume()
  if (!resumeData) return <EmptyState title="No Skills Extracted" description="Upload your resume to see your skill profile." />

  const { skills } = resumeData.parsed_resume

  const radarData = CATEGORIES.map(cat => ({
    category: cat.label,
    count: (skills[cat.key] || []).length,
    fullMark: 10,
  }))

  const totalSkills = CATEGORIES.reduce((sum, cat) => sum + (skills[cat.key] || []).length, 0)

  return (
    <div className="p-8 space-y-8">
      {/* Summary row */}
      <div className="grid grid-cols-6 gap-4">
        {CATEGORIES.map(cat => (
          <div key={cat.key} className="glass-card p-4 text-center hover:border-brand-500/30 transition-colors">
            <div className="flex justify-center mb-2">
              <cat.icon size={20} className="text-brand-400" />
            </div>
            <p className="text-2xl font-bold text-white">{(skills[cat.key] || []).length}</p>
            <p className="text-xs text-slate-500 mt-0.5">{cat.label}</p>
          </div>
        ))}
      </div>

      {/* Radar + Skill Lists */}
      <div className="grid grid-cols-3 gap-6">
        {/* Radar chart */}
        <div className="glass-card p-6 flex flex-col items-center">
          <p className="section-title mb-1">Skills Radar</p>
          <p className="text-xs text-slate-500 mb-4">Count per category</p>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px' }}
                labelStyle={{ color: '#f1f5f9' }}
              />
              <Radar
                name="Skills" dataKey="count" stroke="#6366f1"
                fill="#6366f1" fillOpacity={0.25} strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-sm text-slate-400 mt-3">
            <span className="text-white font-bold text-lg">{totalSkills}</span> total skills detected
          </p>
        </div>

        {/* Skill badges grid */}
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {CATEGORIES.map(cat => {
            const skillList = skills[cat.key] || []
            return (
              <div key={cat.key} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-brand-500/15 flex items-center justify-center">
                    <cat.icon size={14} className="text-brand-400" />
                  </div>
                  <p className="font-semibold text-white text-sm">{cat.label}</p>
                  <span className="ml-auto badge bg-slate-800 text-slate-400 border border-slate-700">{skillList.length}</span>
                </div>
                {skillList.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {skillList.map(skill => (
                      <SkillBadge key={skill} skill={skill} variant={cat.variant} size="xs" />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600">None detected</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
