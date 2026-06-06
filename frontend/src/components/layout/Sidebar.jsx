import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Code2, Briefcase, GitBranch,
  Map, ChevronRight, Zap, RotateCcw,
} from 'lucide-react'
import { useResume } from '../../context/ResumeContext'
import clsx from 'clsx'

const NAV_ITEMS = [
  { to: '/',           icon: LayoutDashboard, label: 'Overview',         requiresSession: false },
  { to: '/analysis',   icon: FileText,        label: 'Resume Analysis',  requiresSession: true  },
  { to: '/skills',     icon: Code2,           label: 'Skills',           requiresSession: true  },
  { to: '/jobs',       icon: Briefcase,       label: 'Job Matches',      requiresSession: true  },
  { to: '/skill-gap',  icon: GitBranch,       label: 'Skill Gap',        requiresSession: true  },
  { to: '/roadmap',    icon: Map,             label: 'Learning Roadmap', requiresSession: true  },
]

export default function Sidebar() {
  const { sessionId, resumeData, reset } = useResume()
  const navigate = useNavigate()

  const handleReset = () => {
    reset()
    navigate('/')
  }

  return (
    <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-white leading-tight">CareerGrowth</p>
            <p className="text-xs text-brand-400 font-medium">AI Platform</p>
          </div>
        </div>
      </div>

      {/* Session indicator */}
      {sessionId && (
        <div className="mx-4 mt-4 px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium truncate">
              {resumeData?.parsed_resume?.personal_info?.name || 'Resume loaded'}
            </span>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label, requiresSession }) => {
          const locked = requiresSession && !sessionId
          return (
            <NavLink
              key={to}
              to={locked ? '/' : to}
              onClick={locked ? (e) => e.preventDefault() : undefined}
              className={({ isActive }) =>
                clsx(
                  'flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  locked
                    ? 'text-slate-600 cursor-not-allowed'
                    : isActive
                    ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                )
              }
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                {label}
              </div>
              {!locked && <ChevronRight size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />}
              {locked && <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-600">locked</span>}
            </NavLink>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        {sessionId ? (
          <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-red-400 transition-all duration-200">
            <RotateCcw size={16} />
            Upload New Resume
          </button>
        ) : (
          <p className="text-xs text-slate-600 text-center">Upload a resume to unlock all features</p>
        )}
      </div>
    </aside>
  )
}
