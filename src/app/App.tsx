import { AppShell } from '../components/layout/AppShell'
import { AnalysisWorkflowProvider } from './analysisWorkflow'
import { AppRoutes } from './routes'

export default function App() {
  return (
    <AnalysisWorkflowProvider>
      <AppShell>
        <AppRoutes />
      </AppShell>
    </AnalysisWorkflowProvider>
  )
}
