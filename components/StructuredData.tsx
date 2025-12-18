// Structured Data for AI Search Engines (Schema.org JSON-LD)
// Helps Google SGE, Bing Chat, Perplexity, ChatGPT, and other AI search tools
// understand and cite our diamond comparison content

export function WebsiteSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Carat Compare',
    url: 'https://www.caratcompare.co',
    description: 'Visual diamond size comparison tool with actual measurements',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.caratcompare.co/compare/{search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Carat Compare',
    url: 'https://www.caratcompare.co',
    logo: 'https://www.caratcompare.co/svg/Logo 3.svg',
    description: 'Diamond size and shape comparison tool helping customers visualize diamond differences',
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ComparisonSchemaProps {
  carat1: number;
  shape1: string;
  carat2: number;
  shape2: string;
  description: string;
}

export function ComparisonSchema({ carat1, shape1, carat2, shape2, description }: ComparisonSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${carat1}ct ${shape1} vs ${carat2}ct ${shape2} Diamond Comparison`,
    description: description,
    author: {
      '@type': 'Organization',
      name: 'Carat Compare',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Carat Compare',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.caratcompare.co/svg/Logo 3.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.caratcompare.co/compare/${carat1}-${shape1}-vs-${carat2}-${shape2}`,
    },
    about: [
      {
        '@type': 'Thing',
        name: 'Diamond',
      },
      {
        '@type': 'Thing',
        name: 'Diamond Size',
      },
      {
        '@type': 'Thing',
        name: 'Diamond Shape',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQSchemaProps {
  faqs: Array<{ question: string; answer: string }>;
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
