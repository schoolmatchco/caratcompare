'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackFAQExpand, trackAffiliateClick } from '@/lib/analytics'

// Affiliate retailer links (generic search pages with full affiliate tracking)
const RETAILERS = {
  blueNile: 'https://www.bluenile.com/diamond-search?a_aid=6938679a08145&a_cid=55e51e63',
  jamesAllen: 'https://www.jamesallen.com/loose-diamonds/all-diamonds/?a_aid=6938679a08145&a_cid=dfef9309',
}

// Helper to render text with affiliate links
const AffiliateLink = ({ href, retailer, children }: { href: string; retailer: string; children: React.ReactNode }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => trackAffiliateClick(retailer, 0, '', 'faq-content')}
    className="text-blue-600 hover:text-blue-800 underline"
  >
    {children}
  </a>
)

const faqs = [
  {
    question: 'What are the 4Cs of diamonds?',
    answer: (
      <>
        The 4Cs are how all diamonds get graded: Cut, Color, Clarity, and Carat. Cut is how well it's shaped (this affects sparkle the most). Color goes from D (totally colorless) to Z (yellowish tint), though anything D through J looks white in a ring. Clarity is about tiny flaws inside—most are invisible without a jeweler's loupe, so VS1 or VS2 is plenty. Carat is just weight. Here's the trick: get an Excellent cut first, then aim for G-H color and VS2 clarity, and spend whatever's left on the biggest carat you can afford.{' '}
        <AffiliateLink href={RETAILERS.blueNile} retailer="Blue Nile">Start your diamond search</AffiliateLink> to compare options.
      </>
    )
  },
  {
    question: 'Does diamond size matter?',
    answer: 'Size definitely matters for visual impact, but here\'s the weird part: carat weight doesn\'t scale the way you\'d think. A 2 carat diamond weighs twice as much as a 1 carat, but it only looks about 25% bigger from the top. That\'s because weight includes the depth you can\'t see when it\'s mounted. Use the comparison tool above to see exactly how much bigger one carat looks compared to another—the difference might surprise you.'
  },
  {
    question: 'Which diamond shape looks biggest?',
    answer: (
      <>
        Oval, pear, and marquise shapes look way bigger than round diamonds at the same carat weight. A 1 carat oval is around 7.7 x 5.7mm, while a 1 carat round is only 6.5mm across. The oval spreads out more, so it covers more finger real estate even though they weigh the same. If you want maximum visual size for your budget, go with one of these elongated shapes.{' '}
        <AffiliateLink href={RETAILERS.blueNile} retailer="Blue Nile">Browse elongated diamonds</AffiliateLink> to see the size difference.
      </>
    )
  },
  {
    question: 'What diamond clarity grade should I choose?',
    answer: 'VS1 or VS2 is the sweet spot. These are "Very Slightly Included" which sounds worse than it is—you literally cannot see anything wrong with the naked eye. VVS and Flawless grades cost way more but look exactly the same unless you use a microscope. SI1 can work if you examine it closely first, since some have visible specks. Unless you\'re buying it as an investment or really care about the certificate saying "Flawless," just get VS2 and save the money.'
  },
  {
    question: 'What color grade is best for a diamond?',
    answer: 'G or H color is where you get the most bang for your buck. They\'re called "near-colorless" but they look completely white when they\'re set in a ring, especially with white gold or platinum. D-F grades (colorless) cost 15-25% more and honestly you can\'t tell the difference unless you put them side-by-side without a setting. If you\'re doing yellow or rose gold, you can even drop to I or J since the warm metal hides any hint of tint anyway.'
  },
  {
    question: 'What is diamond cut quality and why does it matter?',
    answer: 'Cut quality is literally the difference between a diamond that lights up a room and one that looks like glass. It\'s how well the facets are angled to bounce light back at you. An Excellent cut will sparkle like crazy. A Poor cut just sits there looking dull, even if it has perfect color and clarity. Never compromise on cut. A well-cut 0.9ct will blow away a poorly-cut 1.1ct every time—and cost less.'
  },
  {
    question: 'Should I prioritize carat size or quality?',
    answer: 'Get the best cut you can (Excellent, always), then decide if you care more about size or stats. Most people go for size: a 1.5ct with G color and VS2 clarity looks incredible and costs about the same as a 1ct with D color and VVS1 clarity. Unless you really want to flex the certificate specs, bigger usually wins because you can\'t see the difference between G and D or VS2 and VVS1 without a loupe anyway.'
  },
  {
    question: 'What\'s diamond fluorescence and does it matter?',
    answer: 'Fluorescence is when a diamond glows under UV light (like a blacklight). About 30% of diamonds have it, usually blue. Most of the time it doesn\'t affect how the diamond looks in normal light, so you can save 5-15% by getting a diamond with medium fluorescence. Strong fluorescence can sometimes make a diamond look hazy or oily in sunlight, so check the cert comments. If it doesn\'t mention haziness, you\'re fine. For D-F colorless diamonds, skip fluorescence. For G-J, it can actually make the stone look whiter.'
  },
  {
    question: 'How much should I spend on an engagement ring?',
    answer: 'Ignore that old "3 months salary" nonsense. Spend what makes sense for your life. The average in the US is $5,000-$6,000, but that doesn\'t mean it\'s right for you. Some people care more about getting a bigger stone, others want top grades, others want a designer setting. There\'s no wrong answer as long as you\'re not going into debt over it. Figure out your priorities and spend accordingly.'
  },
  {
    question: 'What is the most popular diamond size for engagement rings?',
    answer: 'Most people go for 1 carat, with 0.75ct and 1.5ct being runner-ups. Round is still the most popular shape—about half of all engagement rings—but oval has been catching up fast. Princess and cushion are also pretty common. That said, "popular" doesn\'t mean it\'s right for you. Get what fits your partner\'s style and your budget, not what\'s trending.'
  },
  {
    question: 'Are fancy shapes cheaper than round diamonds?',
    answer: 'Yep, fancy shapes (anything that\'s not round) are usually 15-40% cheaper than round brilliants at the same quality and weight. Rounds waste more of the rough diamond when they\'re cut, so you pay for that. This is great news—you can get a bigger fancy shape for the same money, or save cash on the same size. Oval, cushion, and emerald are especially good deals. Princess is the cheapest if you want maximum sparkle.'
  },
  {
    question: 'What\'s the bow-tie effect in oval and pear diamonds?',
    answer: 'The bow-tie is a dark shadow across the middle of oval, pear, and marquise diamonds that looks like—you guessed it—a bow tie. Every elongated diamond has some degree of bow-tie, but a strong one kills the sparkle in the center. You can\'t tell from a certificate, you have to actually look at photos or video. A faint bow-tie is normal and fine. A thick, dark bow-tie means the diamond was cut poorly. Always ask to see a video or high-res photo before buying any fancy shape.'
  },
  {
    question: 'Do lab-grown diamonds look different from natural diamonds?',
    answer: 'Nope, they\'re identical. Same chemical structure, same hardness, same sparkle. Even professional jewelers can\'t tell them apart without special equipment. The only differences are how they formed (one in the earth over billions of years, one in a lab over weeks) and price (lab-grown are 40-60% cheaper). Both are real diamonds. If someone tells you they can spot a lab-grown by eye, they\'re lying.'
  },
  {
    question: 'Should I buy a certified diamond?',
    answer: (
      <>
        Yes, always. A certificate from GIA or AGS proves what you're actually getting. Without it, you're just trusting whatever the seller tells you, and jewelers are notorious for grade inflation on uncertified stones. GIA is the gold standard—most trusted, most consistent. AGS is also great. IGI and HRD are fine for lab-grown. But if there's no cert or it's from some random lab you've never heard of, walk away. You have no idea what you're really buying.{' '}
        <AffiliateLink href={RETAILERS.blueNile} retailer="Blue Nile">Browse certified diamonds</AffiliateLink>.
      </>
    )
  },
  {
    question: 'What\'s the difference between GIA and IGI certification?',
    answer: 'GIA is stricter and more consistent—their G color is everyone\'s G color. IGI tends to grade a bit more generously, especially on color and clarity (an IGI G might be an H from GIA). For natural diamonds, always get GIA. For lab-grown diamonds, IGI is totally fine since they specialize in those and the grading is reliable. IGI certs are also cheaper, which is why most lab-grown diamonds use them. Just don\'t directly compare IGI grades to GIA grades—they\'re not quite apples to apples.'
  },
  {
    question: 'What\'s the most sparkly diamond shape?',
    answer: 'Round brilliant is the sparkle king—58 facets all angled to throw maximum light. If you want a fancy shape, cushion, oval, and radiant are your best bets for fire. Princess cuts also sparkle great and they\'re cheaper. Emerald and asscher are different—they do these big flashes instead of tiny sparkles, more elegant than flashy. Pear and marquise are somewhere in the middle. Bottom line: if you want serious sparkle, go round, cushion, or oval with an Excellent cut.'
  }
]

export default function DiamondFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    const isCurrentlyOpen = openIndex === index
    if (!isCurrentlyOpen) {
      // Track only when expanding (not collapsing)
      trackFAQExpand(faqs[index].question)
    }
    setOpenIndex(isCurrentlyOpen ? null : index)
  }

  return (
    <div className="w-full bg-main-gray py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Heading with Diamond Image */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <img
            src="/diamond-faq.png"
            alt="Diamond"
            className="w-12 h-12 object-contain"
          />
          <h2 className="text-white text-2xl font-black">Diamond FAQ</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`rounded-lg transition-colors ${isOpen ? '' : 'border border-gray-600'}`}
                style={isOpen ? { backgroundColor: '#FFFFFF' } : { backgroundColor: '#2E2E2E' }}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left py-4 px-4 flex justify-between items-center group"
                >
                  <span className={`text-lg font-semibold pr-4 transition-colors ${isOpen ? 'text-gray-800' : 'text-white group-hover:text-cyan-400'}`}>
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={isOpen ? 'text-gray-800' : 'text-white'}
                    style={{ fontSize: '1.5rem', flexShrink: 0 }}
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-4 px-4">
                        <div className="text-gray-800 text-base font-normal leading-relaxed">
                          {faq.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
