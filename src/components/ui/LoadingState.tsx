interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Loading' }: LoadingStateProps) {
  return (
    <div className="loading-state">
      <span className="spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
