import React from 'react'
import clsx from 'clsx'

const VARIANTS = {
  purple:  'bg-purple-500/15 text-purple-300 border-purple-500/25',
  blue:    'bg-blue-500/15 text-blue-300 border-blue-500/25',
  green:   'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  amber:   'bg-amber-500/15 text-amber-300 border-amber-500/25',
  red:     'bg-red-500/15 text-red-300 border-red-500/25',
  cyan:    'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  pink:    'bg-pink-500/15 text-pink-300 border-pink-500/25',
  slate:   'bg-slate-700/50 text-slate-300 border-slate-600/40',
}

export default function SkillBadge({ skill, variant = 'slate', size = 'sm' }) {
  return (
    <span className={clsx(
      'badge border',
      VARIANTS[variant],
      size === 'xs' && 'text-[11px] px-2 py-0.5',
    )}>
      {skill}
    </span>
  )
}

export function MissingSkillBadge({ skill }) {
  return (
    <span className="badge bg-red-500/10 text-red-400 border border-red-500/20">
      <span className="text-red-500">−</span> {skill}
    </span>
  )
}

export function MatchingSkillBadge({ skill }) {
  return (
    <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
      <span className="text-emerald-500">✓</span> {skill}
    </span>
  )
}
