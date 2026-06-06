import React, { createContext, useContext, useState } from 'react'

const ResumeContext = createContext(null)

export function ResumeProvider({ children }) {
  const [sessionId, setSessionId] = useState(null)
  const [resumeData, setResumeData] = useState(null)      // ResumeAnalysisResponse
  const [jobData, setJobData] = useState(null)            // JobMatchResponse
  const [roadmapData, setRoadmapData] = useState(null)    // LearningRoadmap
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const reset = () => {
    setSessionId(null)
    setResumeData(null)
    setJobData(null)
    setRoadmapData(null)
    setSelectedJobId(null)
    setError(null)
  }

  return (
    <ResumeContext.Provider value={{
      sessionId, setSessionId,
      resumeData, setResumeData,
      jobData, setJobData,
      roadmapData, setRoadmapData,
      selectedJobId, setSelectedJobId,
      loading, setLoading,
      error, setError,
      reset,
    }}>
      {children}
    </ResumeContext.Provider>
  )
}

export const useResume = () => {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within ResumeProvider')
  return ctx
}
