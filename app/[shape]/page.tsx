import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { VALID_SHAPES, capitalize, generateComparisonSlug } from '@/lib/urlHelpers';
import { generateShapeStaticParams } from '@/lib/generateStaticParams';

type Props = {
  params: { shape: string };
};

const POPULAR_CARATS = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0, 2.5, 3.0];

// Shape descriptions for SEO
const SHAPE_INFO: Record<string, { description: string; characteristics: string[] }> = {
  round: {
    description:
      'The round brilliant is the most popular diamond shape, representing about 75% of all diamonds sold. Its 58 facets maximize brilliance and fire.',
    characteristics: [
      'Maximum brilliance and sparkle',
      'Classic and timeless appearance',
      'Works with any ring setting',
      'Best light performance',
    ],
  },
  oval: {
    description:
      'Oval diamonds offer a unique look with brilliant sparkle similar to round diamonds, but with an elongated shape that can make fingers appear longer and more slender.',
    characteristics: [
      'Elongates the appearance of fingers',
      'Brilliant sparkle like round diamonds',
      'Larger surface area per carat',
      'Modern and elegant style',
    ],
  },
  princess: {
    description:
      'Princess cut diamonds are the most popular fancy shape. Known for their sharp, uncut corners and brilliant facet pattern.',
    characteristics: [
      'Modern square or rectangular shape',
      'Exceptional brilliance',
      'Works well in contemporary settings',
      'Good value per carat',
    ],
  },
  cushion: {
    description:
      'Cushion cut diamonds blend a square cut with rounded corners, resembling a pillow. This romantic cut has been popular for over a century.',
    characteristics: [
      'Soft, romantic appearance',
      'Excellent fire and brilliance',
      'Vintage-inspired look',
      'Works well with halo settings',
    ],
  },
  emerald: {
    description:
      'Emerald cut diamonds feature a rectangular shape with step-cut facets, creating a hall-of-mirrors effect with distinctive flashes of light.',
    characteristics: [
      'Elegant, sophisticated look',
      'Hall-of-mirrors effect',
      'Shows clarity well',
      'Art deco and vintage appeal',
    ],
  },
  asscher: {
    description:
      'Asscher cut diamonds are similar to emerald cuts but in a square shape, featuring step-cut facets and a distinctive X pattern when viewed from above.',
    characteristics: [
      'Vintage art deco style',
      'Unique X-pattern',
      'Exceptional clarity display',
      'Square shape with cut corners',
    ],
  },
  radiant: {
    description:
      'Radiant cut diamonds combine the elegant shape of emerald cuts with the brilliant sparkle of round diamonds, featuring trimmed corners.',
    characteristics: [
      'Brilliant sparkle in rectangular shape',
      'Versatile and vibrant',
      'Trimmed corners for durability',
      'Works well in various settings',
    ],
  },
  pear: {
    description:
      'Pear shaped diamonds, also called teardrop diamonds, combine the best of round and marquise cuts into a unique, elegant shape.',
    characteristics: [
      'Unique teardrop silhouette',
      'Elongates fingers',
      'Versatile orientation',
      'Distinctive and elegant',
    ],
  },
  marquise: {
    description:
      'Marquise cut diamonds are elongated with pointed ends, maximizing carat weight and creating a dramatic, eye-catching appearance.',
    characteristics: [
      'Maximum surface area per carat',
      'Dramatic elongated shape',
      'Vintage royal heritage',
      'Makes fingers appear longer',
    ],
  },
  heart: {
    description:
      'Heart shaped diamonds are the ultimate symbol of love and romance, featuring a distinctive heart silhouette with brilliant sparkle.',
    characteristics: [
      'Ultimate symbol of romance',
      'Unique and memorable',
      'Brilliant sparkle',
      'Best in larger carat weights',
    ],
  },
};

// Force static generation
export const dynamic = 'force-static';

// Generate static params for all shape hub pages
export async function generateStaticParams() {
  return generateShapeStaticParams();
}

// Generate metadata for each shape hub page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;

  if (!resolvedParams || !resolvedParams.shape) {
    return {
      title: 'Diamond Shape Comparison | Carat Compare',
      description: 'Compare diamond shapes and sizes.',
    };
  }

  const shape = resolvedParams.shape.toLowerCase();

  if (!VALID_SHAPES.includes(shape as any)) {
    return {
      title: 'Shape Not Found | Carat Compare',
      description: 'The diamond shape you are looking for could not be found.',
    };
  }

  const title = `${capitalize(shape)} Diamond Size Comparison | Carat Compare`;
  const description = `Compare ${shape} diamonds across all carat weights. ${SHAPE_INFO[shape]?.description || ''} See actual size differences with measurements.`;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      type: 'website',
      url: `https://www.caratcompare.co/${shape}`,
    },
    alternates: {
      canonical: `https://www.caratcompare.co/${shape}`,
    },
  };
}

// Shape hub page component
export default async function ShapeHubPage({ params }: Props) {
  const resolvedParams = await params;

  if (!resolvedParams || !resolvedParams.shape) {
    notFound();
  }

  const shape = resolvedParams.shape.toLowerCase();

  // Validate shape
  if (!VALID_SHAPES.includes(shape as any)) {
    notFound();
  }

  const info = SHAPE_INFO[shape] || { description: '', characteristics: [] };
  const otherShapes = VALID_SHAPES.filter((s) => s !== shape);

  // Generate popular comparisons for this shape
  const popularComparisons: Array<{ slug: string; label: string }> = [];

  // Same shape, different carats
  for (let i = 0; i < POPULAR_CARATS.length - 1; i++) {
    const c1 = POPULAR_CARATS[i];
    const c2 = POPULAR_CARATS[i + 1];
    popularComparisons.push({
      slug: generateComparisonSlug(c1, shape, c2, shape),
      label: `${c1}ct vs ${c2}ct ${capitalize(shape)}`,
    });
  }

  // This shape vs other shapes at popular carats
  const featuredCarats = [0.5, 1.0, 1.5, 2.0];
  featuredCarats.forEach((carat) => {
    otherShapes.slice(0, 3).forEach((otherShape) => {
      popularComparisons.push({
        slug: generateComparisonSlug(carat, shape, carat, otherShape),
        label: `${carat}ct ${capitalize(shape)} vs ${capitalize(otherShape)}`,
      });
    });
  });

  return (
    <main className="min-h-screen bg-main-gray">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase mb-4">
            {capitalize(shape)} Diamonds
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Compare {shape} diamond sizes and see how they stack up against other shapes
          </p>
        </div>

        {/* Shape information */}
        <div className="bg-[#1a1a1a] rounded-lg p-8 md:p-12 mb-12 border border-white/5">
          <h2 className="text-2xl font-bold text-white mb-4">
            About {capitalize(shape)} Cut Diamonds
          </h2>
          <p className="text-gray-300 text-lg mb-6 leading-relaxed">
            {info.description}{' '}
            <a
              href={`https://www.bluenile.com/diamonds/${shape === 'pear' || shape === 'heart' ? shape + '-shaped' : shape + '-cut'}?a_aid=6938679a08145&a_cid=55e51e63`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Browse {shape} diamonds
            </a>{' '}
            to see pricing and availability.
          </p>

          {info.characteristics.length > 0 && (
            <>
              <h3 className="text-xl font-bold text-white mb-3">Key Characteristics:</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {info.characteristics.map((char, index) => (
                  <li key={index} className="text-gray-300 flex items-start">
                    <span className="text-cyan mr-2">✓</span>
                    {char}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Popular comparisons */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Popular {capitalize(shape)} Comparisons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularComparisons.slice(0, 24).map((comp) => (
              <Link
                key={comp.slug}
                href={`/compare/${comp.slug}`}
                className="bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 hover:border-cyan/50 rounded-lg p-4 transition-all duration-200"
              >
                <span className="text-white font-medium">{comp.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Compare by carat weight */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6">
            Compare {capitalize(shape)} by Carat Weight
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {POPULAR_CARATS.map((carat) => (
              <Link
                key={carat}
                href={`/carat/${carat}`}
                className="bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 hover:border-magenta/50 rounded-lg p-4 text-center transition-all duration-200"
              >
                <span className="text-white font-bold text-lg">{carat} Carat</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Other shapes */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">Explore Other Diamond Shapes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {otherShapes.map((s) => (
              <Link
                key={s}
                href={`/${s}`}
                className="bg-[#1a1a1a] hover:bg-[#252525] border border-white/10 hover:border-cyan/50 rounded-lg p-6 text-center transition-all duration-200"
              >
                <span className="text-white font-bold">{capitalize(s)}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
