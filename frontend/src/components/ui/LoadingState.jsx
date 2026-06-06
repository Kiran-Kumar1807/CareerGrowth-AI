import React from 'react'
import { Loader2 } from 'lucide-react'

export default function LoadingState({ message = 'Analyzing with AI...', subtext = '' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
          <Loader2 size={32} className="text-brand-400 animate-spin" />
        </div>
        <span className="absolute inset-0 rounded-full bg-brand-500/5 animate-ping" />
      </div>
      <div className="text-center">
        <p className="text-white font-semibold text-lg">{message}</p>
        {subtext && <p className="text-slate-500 text-sm mt-1">{subtext}</p>}
      </div>
      <div className="flex gap-2">
        {[0,1,2,3].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-brand-500/60 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  )
}
