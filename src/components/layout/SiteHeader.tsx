import { useEffect, useRef, useState } from 'react'
import type { Ref } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { PageContainer } from './PageContainer'
import { BRAND_NAME } from '../../lib/brand'

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Analyzer', to: '/analyzer' },
]

function NavigationLinks({ onNavigate, firstLinkRef }: { onNavigate?: () => void; firstLinkRef?: Ref<HTMLAnchorElement> }) {
  return (
    <nav aria-label="Primary navigation" className="site-nav">
      {navigation.map((item, index) => (
        <NavLink
          key={item.to}
          ref={index === 0 ? firstLinkRef : undefined}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          end={item.to === '/'}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null)
  const wasMenuOpenRef = useRef(false)

  useEffect(() => {
    if (isMenuOpen) {
      firstMobileLinkRef.current?.focus()
    } else if (wasMenuOpenRef.current) {
      menuButtonRef.current?.focus()
    }
    wasMenuOpenRef.current = isMenuOpen
  }, [isMenuOpen])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  return (
    <header className="site-header">
      <PageContainer className="site-header__inner">
        <Link className="brand" to="/" aria-label={`${BRAND_NAME} home`}>
          <span className="brand-mark" aria-hidden="true">
            <span className="brand-mark__page" />
            <span className="brand-mark__signal" />
          </span>
          <span className="brand-wordmark">{BRAND_NAME}</span>
        </Link>

        <div className="site-header__desktop-nav">
          <NavigationLinks />
          <Link className="button button--small button--primary" to="/analyzer">
            Analyze my resume
          </Link>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          className="icon-button site-header__menu-button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" className={`menu-icon${isMenuOpen ? ' menu-icon--open' : ''}`} />
        </button>

        <div
          id="mobile-navigation"
          className={`site-header__mobile-nav${isMenuOpen ? ' site-header__mobile-nav--open' : ''}`}
          hidden={!isMenuOpen}
        >
          <div className="site-header__mobile-links">
            <NavigationLinks onNavigate={() => setIsMenuOpen(false)} firstLinkRef={firstMobileLinkRef} />
            <Link className="button button--primary" to="/analyzer" onClick={() => setIsMenuOpen(false)}>
              Analyze my resume
            </Link>
          </div>
        </div>
      </PageContainer>
    </header>
  )
}
