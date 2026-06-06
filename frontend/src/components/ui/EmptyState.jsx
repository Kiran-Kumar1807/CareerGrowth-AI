import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, ArrowRight } from 'lucide-react'

export default function EmptyState({ icon: Icon = Upload, title = 'No data yet', description = 'Upload your resume to get started.' }) {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8">
      <div className="w-20 h-20 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center">
        <Icon size={32} className="text-slate-500" />
      </div>
      <div className="text-center">
        <p className="text-white font-semibold text-lg">{title}</p>
        <p className="text-slate-500 text-sm mt-1 max-w-xs">{description}</p>
      </div>
      <button onClick={() => navigate('/')} className="btn-primary flex items-center gap-2">
        Upload Resume <ArrowRight size={16} />
      </button>
    </div>
  )
}
