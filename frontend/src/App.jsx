import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ResumeProvider } from './context/ResumeContext'
import Sidebar from './components/layout/Sidebar'
import Header from './components/layout/Header'
import Overview from './pages/Overview'
import ResumeAnalysis from './pages/ResumeAnalysis'
import Skills from './pages/Skills'
import JobRecommendations from './pages/JobRecommendations'
import SkillGap from './pages/SkillGap'
import LearningRoadmap from './pages/LearningRoadmap'

function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/"          element={<Overview />} />
            <Route path="/analysis"  element={<ResumeAnalysis />} />
            <Route path="/skills"    element={<Skills />} />
            <Route path="/jobs"      element={<JobRecommendations />} />
            <Route path="/skill-gap" element={<SkillGap />} />
            <Route path="/roadmap"   element={<LearningRoadmap />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ResumeProvider>
        <Layout />
      </ResumeProvider>
    </BrowserRouter>
  )
}
