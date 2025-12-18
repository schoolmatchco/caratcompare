import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import ComparisonArea from '@/components/ComparisonArea';
import DiamondFAQ from '@/components/DiamondFAQ';
import Footer from '@/components/Footer';
import { ComparisonSchema } from '@/components/StructuredData';
import { parseComparisonSlug, capitalize, formatCaratForDisplay } from '@/lib/urlHelpers';
import { generateComparisonText, generateMetaDescription } from '@/lib/comparisonTextGenerator';
import { generateComparisonStaticParams } from '@/lib/generateStaticParams';

type Props = {
  params: { slug: string };
};

// Force static generation
export const dynamic = 'force-static';

// Generate static params for all 1,201 comparison pages
export async function generateStaticParams() {
  return generateComparisonStaticParams();
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  if (!resolvedParams || !resolvedParams.slug) {
    return {
      title: 'Diamond Comparison | Carat Compare',
      description: 'Compare diamond sizes and shapes.',
    };
  }

  const data = parseComparisonSlug(resolvedParams.slug);

  if (!data) {
    return {
      title: 'Comparison Not Found | Carat Compare',
      description: 'The diamond comparison you are looking for could not be found.',
    };
  }

  const { carat1, shape1, carat2, shape2 } = data;
  const title = `${formatCaratForDisplay(carat1)}ct ${capitalize(shape1)} vs ${formatCaratForDisplay(carat2)}ct ${capitalize(shape2)} Diamond | Carat Compare`;
  const description = generateMetaDescription(carat1, shape1, carat2, shape2);

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'article',
      url: `https://www.caratcompare.co/compare/${resolvedParams.slug}`,
      siteName: 'Carat Compare',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
    },
    alternates: {
      canonical: `https://www.caratcompare.co/compare/${resolvedParams.slug}`,
    },
  };
}

// Main comparison page component
export default async function ComparisonPage({ params }: Props) {
  const resolvedParams = await params;

  if (!resolvedParams || !resolvedParams.slug) {
    notFound();
  }

  const data = parseComparisonSlug(resolvedParams.slug);

  // Handle invalid URLs with 404
  if (!data) {
    notFound();
  }

  const { carat1, shape1, carat2, shape2 } = data;

  // Generate unique SEO text content
  const seoText = generateComparisonText(carat1, shape1, carat2, shape2);

  // Split text into paragraphs safely
  const paragraphs = seoText.split('\n\n').filter((p) => p && p.trim().length > 0);

  // Get meta description for structured data
  const metaDescription = generateMetaDescription(carat1, shape1, carat2, shape2);

  return (
    <main className="min-h-screen bg-main-gray">
      <ComparisonSchema
        carat1={carat1}
        shape1={shape1}
        carat2={carat2}
        shape2={shape2}
        description={metaDescription}
      />
      <Header />

      {/* Main heading for SEO */}
      <div className="text-center pt-8 pb-4 px-4">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          <span className="text-cyan">{formatCaratForDisplay(carat1)} Carat {capitalize(shape1)}</span>
          <span className="font-thin mx-3">vs</span>
          <span className="text-magenta">{formatCaratForDisplay(carat2)} Carat {capitalize(shape2)}</span>
        </h1>
        <p className="text-white text-lg md:text-xl mt-4 md:mt-2 font-light">
          DIAMOND SIZE & SHAPE COMPARISON TOOL
        </p>
      </div>

      {/* Existing visual comparison tool */}
      <ComparisonArea
        initialCarat1={carat1}
        initialShape1={shape1}
        initialCarat2={carat2}
        initialShape2={shape2}
      />

      {/* Unique SEO content section */}
      <section className="bg-main-gray py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1a1a1a] rounded-lg p-8 md:p-12 border border-white/5">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              {capitalize(shape1)} vs {capitalize(shape2)} Comparison Analysis
            </h2>
            <div className="text-gray-300 text-base md:text-lg prose prose-invert max-w-none">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
              <p className="mb-4 leading-relaxed">
                Ready to shop?{' '}
                <a
                  href="https://www.bluenile.com/diamond-search?a_aid=6938679a08145&a_cid=55e51e63"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Browse certified diamonds
                </a>
                {' '}to compare prices and find your perfect diamond.
              </p>
            </div>

            {/* Related comparisons section for internal linking */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Related Comparisons</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a
                  href={`/${shape1}`}
                  className="text-gray-200 hover:text-white underline transition-colors text-sm"
                >
                  View all {capitalize(shape1)} comparisons →
                </a>
                <a
                  href={`/${shape2}`}
                  className="text-gray-200 hover:text-white underline transition-colors text-sm"
                >
                  View all {capitalize(shape2)} comparisons →
                </a>
                <a
                  href={`/carat/${formatCaratForDisplay(carat1)}`}
                  className="text-gray-200 hover:text-white underline transition-colors text-sm"
                >
                  View all {formatCaratForDisplay(carat1)} carat diamonds →
                </a>
                <a
                  href={`/carat/${formatCaratForDisplay(carat2)}`}
                  className="text-gray-200 hover:text-white underline transition-colors text-sm"
                >
                  View all {formatCaratForDisplay(carat2)} carat diamonds →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Existing FAQ section */}
      <DiamondFAQ />

      {/* Footer */}
      <Footer />
    </main>
  );
}
