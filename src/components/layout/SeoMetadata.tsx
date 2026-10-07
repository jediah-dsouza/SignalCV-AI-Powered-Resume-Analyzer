import { useEffect } from 'react'
import { PRODUCT_NAME } from '../../lib/brand'

interface SeoMetadataProps {
  title: string
  description: string
}

function setMeta(selector: string, attribute: 'name' | 'property', value: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, value)
    document.head.appendChild(element)
  }
  element.content = content
}

export function SeoMetadata({ title, description }: SeoMetadataProps) {
  useEffect(() => {
    document.title = title
    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', PRODUCT_NAME)
  }, [description, title])

  return null
}
