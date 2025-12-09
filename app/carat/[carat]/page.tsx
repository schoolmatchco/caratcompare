import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { VALID_CARATS, VALID_SHAPES, capitalize, generateComparisonSlug, formatCaratForDisplay } from '@/lib/urlHelpers';
import { generateCaratStaticParams } from '@/lib/generateStaticParams';
import diamondSizes from '@/data/diamond-sizes.json';

type Props = {
  params: { carat: string };
};

// Generate static params for all carat hub pages
export async function generateStaticParams() {
  return generateCaratStaticParams();
}

// Generate metadata for each carat hub page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!params || !params.carat) {
    return {
      title: 'Diamond Carat Comparison | Carat Compare',
      description: 'Compare diamond carat weights and sizes.',
    };
  }

  const caratValue = parseFloat(params.carat);

  if (isNaN(caratValue) || !VALID_CARATS.includes(caratValue)) {
    return {
      title: 'Carat Weight Not Found | Carat Compare',
      description: 'The carat weight you are looking for could not be found.',
    };
  }

  const caratDisplay = formatCaratForDisplay(caratValue);
  const title = `${caratDisplay} Carat Diamond Size Comparison | All Shapes | Carat Compare`;
  const description = `Compare ${caratDisplay} carat diamonds across all shapes. See how round, oval, princess, cushion, emerald, and other cuts look at ${caratDisplay} carats.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'website',
      url: `https://caratcompare.co/carat/${params.carat}`,
    },
    alternates: {
      canonical: `https://caratcompare.co/carat/${params.carat}`,
    },
  };
}

// Get dimensions for a shape at a specific carat
function getDimensions(shape: string, carat: number) {
  const caratKey = carat.toFixed(2);
  const shapeData = diamondSizes[shape as keyof typeof diamondSizes];
  if (!shapeData) return null;
  return shapeData[caratKey as keyof typeof shapeData] as { width: number; height: number } | undefined;
}

// Carat hub page component
export default function CaratHubPage({ params }: Props) {
  if (!params || !params.carat) {
    notFound();
  }

  const caratValue = parseFloat(params.carat);

  // Validate carat
  if (isNaN(caratValue) || !VALID_CARATS.includes(caratValue)) {
    notFound();
  }

  const caratDisplay = formatCaratForDisplay(caratValue);

  // Get dimensions for all shapes at this carat weight
  const shapeDimensions = VALID_SHAPES.map((shape) => {
    const dims = getDimensions(shape, caratValue);
    return {
      shape,
      dimensions: dims,
    };
  }).filter((item) => item.dimensions !== null && item.dimensions !== undefined);

  // Find adjacent carat weights for comparison suggestions
  const currentIndex = VALID_CARATS.indexOf(caratValue);
  const smallerCarat = currentIndex > 0 ? VALID_CARATS[currentIndex - 1] : null;
  const largerCarat = currentIndex < VALID_CARATS.length - 1 ? VALID_CARATS[currentIndex + 1] : null;

  // Generate shape-to-shape comparisons at this carat weight
  const shapeComparisons: Array<{ slug: string; label: string }> = [];
  VALID_SHAPES.forEach((shape1, i) => {
    VALID_SHAPES.slice(i + 1).forEach((shape2) => {
      shapeComparisons.push({
        slug: generateComparisonSlug(caratValue, shape1, caratValue, shape2),
        label: `${capitalize(shape1)} vs ${capitalize(shape2)}`,
      });
    });
  });

  // Generate size upgrade/downgrade comparisons
  const sizeComparisons: Array<{ slug: string; label: string }> = [];
  if (smallerCarat) {
    VALID_SHAPES.forEach((shape) => {
      sizeComparisons.push({
        slug: generateComparisonSlug(smallerCarat, shape, caratValue, shape),
        label: `${formatCaratForDisplay(smallerCarat)}ct vs ${caratDisplay}ct ${capitalize(shape)}`,
      });
    });
  }
  if (largerCarat) {
    VALID_SHAPES.forEach((shape) => {
      sizeComparisons.push({
        slug: generateComparisonSlug(caratValue, shape, largerCarat, shape),
        label: `${caratDisplay}ct vs ${formatCaratForDisplay(largerCarat)}ct ${capitalize(shape)}`,
      });
    });
  }

  return (
    <main className="min-h-screen bg-main-gray">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase mb-4">
            {caratDisplay} Carat Diamonds
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Compare how {caratDisplay} carat diamonds look across all shapes
          </p>
        </div>

        {/* Dimension overview */}
        <div className="bg-[#1a1a1a] rounded-lg p-8 md:p-12 mb-12 border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-6">
            {caratDisplay} Carat Size Guide
          </h2>
          <p className="text-gray-300 text-lg mb-6">
            A {caratDisplay} carat diamond varies in appearance depending on the shape. Here are the actual
            dimensions (width × height) for each cut:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shapeDimensions.map(({ shape, dimensions }) => (
              <div
                key={shape}
                className="bg-main-gray rounded-lg p-4 border border-white/10"
              >
                <h3 className="text-white font-bold mb-2">{capitalize(shape)}</h3>
                <p className="text-cyan text-sm">
                  {dimensions?.width}mm × {dimensions?.height}mm
                </p>
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-sm mt-6 italic">
            Note: Dimensions are based on well-cut diamonds with standard proportions. Actual sizes
            may vary slightly based on cut quality and proportions.
          </p>
        </div>

        {/* Shape comparisons at this carat */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Compare Shapes at {caratDisplay} Carats
          </h2>
          <p className="text-gray-300 mb-6">
            See how different diamond shapes compare when they're all {caratDisplay} carats:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shapeComparisons.slice(0, 24).map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 hover:border-cyan/50 rounded-lg p-4 transition-all duration-200"
              >
                <span className="text-white font-medium">{comp.label}</span>
                <span className="text-gray-400 text-sm block mt-1">
                  at {caratDisplay} carats
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Size comparisons */}
        {sizeComparisons.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">Size Up or Down</h2>
            <p className="text-gray-300 mb-6">
              Compare {caratDisplay} carat diamonds to nearby carat weights:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sizeComparisons.slice(0, 18).map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 hover:border-magenta/50 rounded-lg p-4 transition-all duration-200"
                >
                  <span className="text-white font-medium">{comp.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Other carat weights */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">Explore Other Carat Weights</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {VALID_CARATS.filter((c) => c !== caratValue).map((carat) => (
              <Link
                key={carat}
                href={`/carat/${carat}`}
                className="bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 hover:border-cyan/50 rounded-lg p-4 text-center transition-all duration-200"
              >
                <span className="text-white font-bold">{formatCaratForDisplay(carat)}ct</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Shape hub links */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Browse by Diamond Shape</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {VALID_SHAPES.map((shape) => (
              <Link
                key={shape}
                href={`/${shape}`}
                className="bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 hover:border-magenta/50 rounded-lg p-6 text-center transition-all duration-200"
              >
                <span className="text-white font-bold">{capitalize(shape)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
