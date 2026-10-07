import type { PropsWithChildren } from 'react'
import { SiteFooter } from './SiteFooter'
import { SiteHeader } from './SiteHeader'

export function AppShell({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <SiteHeader />
      <main id="main-content" className="app-main">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
