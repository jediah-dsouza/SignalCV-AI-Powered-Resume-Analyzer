import { Link } from 'react-router-dom'
import { PageContainer } from './PageContainer'
import { BRAND_NAME } from '../../lib/brand'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <PageContainer className="site-footer__inner">
        <div>
          <Link className="brand brand--footer" to="/" aria-label={`${BRAND_NAME} home`}>
            <span className="brand-mark" aria-hidden="true">
              <span className="brand-mark__page" />
              <span className="brand-mark__signal" />
            </span>
            <span className="brand-wordmark">{BRAND_NAME}</span>
          </Link>
          <p className="site-footer__tagline">Turn resume uncertainty into clear next steps.</p>
        </div>
        <nav aria-label="Footer navigation" className="site-footer__nav">
          <Link to="/how-it-works">How it works</Link>
          <Link to="/analyzer">Analyzer</Link>
        </nav>
          <p className="site-footer__copyright">© 2026 {BRAND_NAME}. Built for clearer career moves.</p>
      </PageContainer>
    </footer>
  )
}
