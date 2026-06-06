import axios from 'axios'

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || ''}/api/v1`,
  timeout: 120000,
})

export const uploadResume = (file, onUploadProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
}

export const getSession = (sessionId) =>
  api.get(`/resume/session/${sessionId}`)

export const getJobMatches = (sessionId) =>
  api.get(`/jobs/match/${sessionId}`)

export const getRoadmap = (sessionId, jobId) =>
  api.get(`/roadmap/generate/${sessionId}`, { params: { job_id: jobId } })
