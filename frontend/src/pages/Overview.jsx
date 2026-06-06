import React, { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, Sparkles, CheckCircle2, AlertTriangle, TrendingUp, Briefcase, ArrowRight, X } from 'lucide-react'
import { useResume } from '../context/ResumeContext'
import { uploadResume, getJobMatches } from '../services/api'
import { ScoreGauge } from '../components/ui/ScoreRing'
import LoadingState from '../components/ui/LoadingState'
import SkillBadge from '../components/ui/SkillBadge'
import clsx from 'clsx'

const SKILL_COLORS = ['purple', 'blue', 'cyan', 'green', 'amber', 'pink']

function UploadZone({ onFile }) {
  const [drag, setDrag] = useState(false)

  const handleDrop = useCallback(e => {
    e.preventDefault()
    setDrag(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }, [onFile])

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDrag(true) }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      className={clsx(
        'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300',
        drag ? 'border-brand-500 bg-brand-500/10' : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/30'
      )}
      onClick={() => document.getElementById('resume-input').click()}
    >
      <input
        id="resume-input" type="file" accept=".pdf,.docx,.doc"
        className="hidden"
        onChange={e => { if (e.target.files[0]) onFile(e.target.files[0]) }}
      />
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
          <Upload size={28} className="text-brand-400" />
        </div>
        <div>
          <p className="text-white font-semibold text-lg">Drop your resume here</p>
          <p className="text-slate-500 text-sm mt-1">or click to browse — PDF or DOCX supported</p>
        </div>
        <span className="badge bg-slate-800 text-slate-400 border border-slate-700 text-xs">Max 10MB</span>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color = 'brand', sub }) {
  const colors = {
    brand:   'from-brand-500/20 to-brand-600/10 border-brand-500/20 text-brand-400',
    green:   'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400',
    amber:   'from-amber-500/20 to-amber-600/10 border-amber-500/20 text-amber-400',
    purple:  'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400',
  }
  return (
    <div className={`stat-card bg-gradient-to-br ${colors[color]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${colors[color]}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-3xl font-extrabold text-white">{value}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
      {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function Overview() {
  const navigate = useNavigate()
  const { resumeData, jobData, setResumeData, setJobData, setSessionId, loading, setLoading, error, setError } = useResume()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [step, setStep] = useState('')

  const handleFile = async (file) => {
    setLoading(true)
    setError(null)
    setStep('Parsing resume...')
    setUploadProgress(0)

    try {
      setStep('Extracting data with AI...')
      const { data: analysis } = await uploadResume(file, e => {
        setUploadProgress(Math.round((e.loaded / e.total) * 40))
      })
      setUploadProgress(60)
      setStep('Matching jobs...')

      const { data: jobs } = await getJobMatches(analysis.session_id)
      setUploadProgress(100)

      setResumeData(analysis)
      setJobData(jobs)
      setSessionId(analysis.session_id)
      setStep('')
    } catch (err) {
      const detail = err.response?.data?.detail || ''
      const isRateLimit = detail.includes('429') || detail.toLowerCase().includes('rate')
      setError(
        isRateLimit
          ? 'The AI model is rate-limited right now. Please wait 30 seconds and try again.'
          : detail || 'Analysis failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <LoadingState
          message={step || 'Analyzing your resume...'}
          subtext="Our AI is extracting skills, scoring your resume, and finding matching jobs"
        />
        {uploadProgress > 0 && (
          <div className="max-w-md mx-auto mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>Progress</span><span>{uploadProgress}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    )
  }

  if (!resumeData) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 text-sm text-brand-400 mb-4">
            <Sparkles size={14} /> AI-Powered Career Intelligence
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3">
            Unlock Your Career<br />
            <span className="bg-gradient-to-r from-brand-400 to-purple-400 bg-clip-text text-transparent">
              Growth Potential
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Upload your resume and get an instant ATS score, skill gap analysis, job matches, and a personalized learning roadmap.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Upload failed</p>
              <p className="text-xs text-red-400/70 mt-0.5">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="ml-auto"><X size={16} /></button>
          </div>
        )}

        <UploadZone onFile={handleFile} />

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: FileText,    title: 'ATS Analysis',      desc: 'Score your resume against ATS standards with actionable improvements' },
            { icon: Briefcase,   title: 'Job Matching',       desc: 'Find roles that match your skillset with percentage compatibility' },
            { icon: TrendingUp,  title: 'Learning Roadmap',   desc: 'Get a personalized week-by-week plan to reach your target role' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-5">
              <div className="w-10 h-10 rounded-xl bg-brand-500/15 flex items-center justify-center mb-3">
                <Icon size={20} className="text-brand-400" />
              </div>
              <p className="font-semibold text-white text-sm">{title}</p>
              <p className="text-xs text-slate-500 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Dashboard view after upload
  const { parsed_resume: resume, ats_analysis: ats } = resumeData
  const allSkills = [
    ...resume.skills.programming_languages,
    ...resume.skills.frameworks,
    ...resume.skills.databases,
    ...resume.skills.cloud,
    ...resume.skills.tools,
  ]
  const topJobs = jobData?.recommendations?.slice(0, 3) || []

  return (
    <div className="p-8 space-y-8">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            Welcome back{resume.personal_info.name ? `, ${resume.personal_info.name.split(' ')[0]}` : ''}!
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">Here's your career health summary</p>
        </div>
        <button onClick={() => document.getElementById('resume-input-re')?.click()} className="btn-secondary text-sm flex items-center gap-2">
          <Upload size={15} /> Re-upload
          <input id="resume-input-re" type="file" accept=".pdf,.docx" className="hidden" onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]) }} />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={Sparkles}    label="ATS Score"         value={ats.overall_score}                        color="brand" sub="/100 points" />
        <StatCard icon={CheckCircle2} label="Skills Found"     value={allSkills.length}                         color="green" sub="across all categories" />
        <StatCard icon={Briefcase}   label="Job Match (Top)"   value={`${jobData?.top_match_percentage ?? 0}%`} color="purple" sub="highest compatibility" />
        <StatCard icon={TrendingUp}  label="Gaps to Close"     value={jobData?.skill_gaps?.[0]?.missing_skills?.length ?? 0} color="amber" sub="to reach top role" />
      </div>

      {/* ATS + Skills row */}
      <div className="grid grid-cols-3 gap-6">
        {/* ATS */}
        <div className="glass-card p-6 flex flex-col items-center gap-4">
          <ScoreGauge score={ats.overall_score} />
          <div className="w-full space-y-2">
            {[
              { label: 'Structure',    score: ats.structure_score },
              { label: 'Keywords',     score: ats.keyword_score },
              { label: 'Experience',   score: ats.experience_score },
              { label: 'Skills',       score: ats.skills_score },
            ].map(({ label, score }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white font-medium">{score}</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${score}%`,
                      background: score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Skills */}
        <div className="glass-card p-6 col-span-2">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">Top Skills</p>
            <button onClick={() => navigate('/skills')} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {allSkills.slice(0, 20).map((skill, i) => (
              <SkillBadge key={skill} skill={skill} variant={SKILL_COLORS[i % SKILL_COLORS.length]} />
            ))}
          </div>
          {allSkills.length === 0 && (
            <p className="text-slate-600 text-sm">No skills detected.</p>
          )}
        </div>
      </div>

      {/* Top Jobs + Suggestions */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top job matches */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="section-title">Top Job Matches</p>
            <button onClick={() => navigate('/jobs')} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
              See all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {topJobs.map(match => (
              <div key={match.job.id} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl hover:bg-slate-800/70 transition-colors">
                <div>
                  <p className="text-sm font-medium text-white">{match.job.title}</p>
                  <p className="text-xs text-slate-500">{match.job.company}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    'text-sm font-bold',
                    match.match_percentage >= 70 ? 'text-emerald-400' :
                    match.match_percentage >= 50 ? 'text-amber-400' : 'text-red-400'
                  )}>
                    {match.match_percentage}%
                  </span>
                </div>
              </div>
            ))}
            {topJobs.length === 0 && <p className="text-slate-600 text-sm">No job data available.</p>}
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="glass-card p-6">
          <p className="section-title mb-4">AI Improvement Tips</p>
          <div className="space-y-3">
            {ats.improvements.slice(0, 3).map((imp, i) => (
              <div key={i} className="flex gap-3 p-3 bg-slate-800/40 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold flex items-center justify-center shrink-0">
                  {i+1}
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-300">{imp.category}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{imp.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
