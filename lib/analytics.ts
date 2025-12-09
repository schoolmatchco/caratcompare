// Google Analytics event tracking utility

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

// Specific event tracking functions with clear, descriptive labels

export const trackAffiliateClick = (retailer: string, carat: number, shape: string, linkType: 'logo' | 'text') => {
  const linkTypeLabel = linkType === 'logo' ? 'Logo Button' : 'Check Prices Link'
  const shapeName = shape.charAt(0).toUpperCase() + shape.slice(1)

  trackEvent(`Affiliate Click - ${retailer}`, {
    retailer,
    carat,
    shape,
    link_type: linkType,
    event_category: 'Affiliate Clicks',
    event_label: `${retailer} - ${carat}ct ${shapeName} - ${linkTypeLabel}`,
    value: carat * 100, // For conversion value tracking
  })
}

export const trackShopButtonClick = (carat: number, shape: string, position: 'left' | 'right') => {
  const shapeName = shape.charAt(0).toUpperCase() + shape.slice(1)
  const positionLabel = position === 'left' ? 'Left Diamond' : 'Right Diamond'

  trackEvent('Shop Button Click', {
    carat,
    shape,
    position,
    event_category: 'Navigation',
    event_label: `Shop ${carat}ct ${shapeName} (${positionLabel})`,
  })
}

export const trackChangeButtonClick = () => {
  trackEvent('Change Button Click', {
    event_category: 'Navigation',
    event_label: 'Open Comparison Modal',
  })
}

export const trackComparisonChange = (
  carat1: number,
  shape1: string,
  carat2: number,
  shape2: string
) => {
  const shape1Name = shape1.charAt(0).toUpperCase() + shape1.slice(1)
  const shape2Name = shape2.charAt(0).toUpperCase() + shape2.slice(1)

  trackEvent('Comparison Updated', {
    carat1,
    shape1,
    carat2,
    shape2,
    event_category: 'User Engagement',
    event_label: `${carat1}ct ${shape1Name} vs ${carat2}ct ${shape2Name}`,
  })
}

export const trackFAQExpand = (question: string) => {
  trackEvent('FAQ Expanded', {
    event_category: 'Content Engagement',
    event_label: question,
  })
}

export const trackLogoClick = () => {
  trackEvent('Logo Click', {
    event_category: 'Navigation',
    event_label: 'Return to Homepage',
  })
}
