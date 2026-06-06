import React, { useState } from 'react'
import { MapPin, DollarSign, Briefcase, ArrowRight, Star, CheckCircle2, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'
import { getRoadmap } from '../services/api'
import { MatchingSkillBadge, MissingSkillBadge } from '../components/ui/SkillBadge'
import EmptyState from '../components/ui/EmptyState'
import LoadingState from '../components/ui/LoadingState'
import clsx from 'clsx'

function MatchMeter({ pct }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444',
          }}
        />
      </div>
      <span className={clsx(
        'text-sm font-bold w-10 text-right',
        pct >= 70 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-400' : 'text-red-400'
      )}>
        {pct}%
      </span>
    </div>
  )
}

export default function JobRecommendations() {
  const navigate = useNavigate()
  const { jobData, sessionId, setRoadmapData, setSelectedJobId } = useResume()
  const [expanded, setExpanded] = useState(null)
  const [generatingRoadmap, setGeneratingRoadmap] = useState(null)

  if (!jobData) return <EmptyState title="No Job Matches" description="Upload your resume to get personalized job recommendations." />

  const { recommendations } = jobData

  const handleGetRoadmap = async (match) => {
    setGeneratingRoadmap(match.job.id)
    try {
      const { data } = await getRoadmap(sessionId, match.job.id)
      setRoadmapData(data)
      setSelectedJobId(match.job.id)
      navigate('/roadmap')
    } catch (err) {
      console.error(err)
    } finally {
      setGeneratingRoadmap(null)
    }
  }

  if (generatingRoadmap) {
    return (
      <div className="p-8">
        <LoadingState message="Generating your learning roadmap..." subtext="AI is creating a personalized week-by-week plan" />
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-slate-400 text-sm">{recommendations.length} roles matched to your profile</p>
        <div className="flex gap-3 text-xs">
          <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">≥70% Strong</span>
          <span className="badge bg-amber-500/10 text-amber-400 border border-amber-500/20">50–69% Good</span>
          <span className="badge bg-red-500/10 text-red-400 border border-red-500/20">&lt;50% Stretch</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {recommendations.map((match) => (
          <div
            key={match.job.id}
            className="glass-card overflow-hidden hover:border-brand-500/30 transition-all duration-300"
          >
            <div className="p-5">
              <div className="flex items-start justify-between gap-4">
                {/* Job info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500/20 to-purple-500/20 border border-brand-500/20 flex items-center justify-center">
                      <Briefcase size={18} className="text-brand-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{match.job.title}</p>
                      <p className="text-xs text-slate-400">{match.job.company}</p>
                    </div>
                    {match.match_percentage >= 75 && (
                      <span className="badge bg-amber-500/15 text-amber-400 border border-amber-500/20 ml-2">
                        <Star size={10} /> Top Match
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-400 mt-2">
                    <span className="flex items-center gap-1"><MapPin size={11} />{match.job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign size={11} />{match.job.salary_range}</span>
                    <span className="flex items-center gap-1"><Briefcase size={11} />{match.job.job_type}</span>
                  </div>
                </div>

                {/* Match pct */}
                <div className="text-right shrink-0 w-36">
                  <p className="text-xs text-slate-500 mb-1">Match Score</p>
                  <MatchMeter pct={match.match_percentage} />
                </div>
              </div>

              {/* Matching skills preview */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {match.matching_skills.slice(0, 6).map(s => <MatchingSkillBadge key={s} skill={s} />)}
                {match.missing_skills.slice(0, 3).map(s => <MissingSkillBadge key={s} skill={s} />)}
                {match.missing_skills.length > 3 && (
                  <span className="badge bg-slate-800 text-slate-500 border border-slate-700">+{match.missing_skills.length - 3} more missing</span>
                )}
              </div>

              {/* Expand toggle + roadmap button */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setExpanded(expanded === match.job.id ? null : match.job.id)}
                  className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                >
                  {expanded === match.job.id ? 'Hide details' : 'View details'}
                  <ArrowRight size={12} className={clsx('transition-transform', expanded === match.job.id && 'rotate-90')} />
                </button>
                <button
                  onClick={() => handleGetRoadmap(match)}
                  className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
                >
                  Get Roadmap <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Expanded details */}
            {expanded === match.job.id && (
              <div className="border-t border-slate-800 p-5 space-y-4 bg-slate-900/50">
                <p className="text-sm text-slate-300">{match.job.description}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1 mb-2">
                      <CheckCircle2 size={12} /> You Have ({match.matching_skills.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.matching_skills.map(s => <MatchingSkillBadge key={s} skill={s} />)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-red-400 flex items-center gap-1 mb-2">
                      <XCircle size={12} /> You Need ({match.missing_skills.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {match.missing_skills.map(s => <MissingSkillBadge key={s} skill={s} />)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
