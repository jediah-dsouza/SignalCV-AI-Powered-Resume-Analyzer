import { Navigate, Route, Routes } from 'react-router-dom'
import { AnalysisResultsPage } from '../pages/AnalysisResultsPage'
import { AnalyzerPage } from '../pages/AnalyzerPage'
import { HomePage } from '../pages/HomePage'
import { HowItWorksPage } from '../pages/HowItWorksPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/analyzer" element={<AnalyzerPage />} />
      <Route path="/analysis" element={<AnalysisResultsPage />} />
      <Route path="/how-it-works" element={<HowItWorksPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
