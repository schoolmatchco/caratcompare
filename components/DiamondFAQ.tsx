'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: 'Does diamond size matter?',
    answer: 'When buying a diamond, carat weight is often the biggest driver of price. However, physical dimensions (millimeters) don\'t always scale linearly with weight. For example, a 2.0ct diamond is twice as heavy as a 1.0ct, but only about 25% wider visually. Use the comparison tool above to visualize exactly how much "face-up" surface area you gain by moving up in carat weight.'
  },
  {
    question: 'What\'s the difference between carat weight and size?',
    answer: 'Carat (ct) measures weight, not size. One carat equals 200 milligrams. Two diamonds with the same carat weight can look different sizes depending on their cut proportions and shape. A well-cut diamond maximizes face-up appearance, while a poorly cut diamond may hide weight in the depth, appearing smaller. This is why comparing millimeter dimensions is more reliable than carat alone.'
  },
  {
    question: 'Which diamond shape looks biggest?',
    answer: 'Elongated shapes like Oval, Pear, and Marquise typically appear larger than Round diamonds of the same carat weight because they have more surface area spread across their length and width. For example, a 1.0ct Oval might measure 7.7 x 5.7mm, while a 1.0ct Round is 6.5mm in diameter. The Oval visually covers more finger space despite weighing the same.'
  },
  {
    question: 'How much should I spend on an engagement ring?',
    answer: 'Forget the "3 months salary" myth. Spend what feels comfortable for your budget and lifestyle. The average engagement ring in the US costs $5,000-$6,000, but there\'s no "right" amount. Consider what matters most to you: size, quality, or brand. Many couples prioritize a larger, eye-clean diamond over perfect clarity grades that require magnification to see.'
  },
  {
    question: 'What is the most popular diamond size for engagement rings?',
    answer: 'The most popular carat weight for engagement rings is 1.0 carat, followed by 0.75ct and 1.5ct. Round diamonds remain the most chosen shape (about 50% of purchases), followed by Oval, Princess, and Cushion cuts. However, "popular" doesn\'t mean it\'s right for everyone—choose based on your partner\'s style, hand size, and your budget.'
  },
  {
    question: 'Do lab-grown diamonds look different from natural diamonds?',
    answer: 'No. Lab-grown diamonds are chemically, physically, and optically identical to natural diamonds. Even professional gemologists need specialized equipment to tell them apart. The only real differences are origin (one formed in Earth\'s mantle over billions of years, the other in a lab in weeks) and price (lab-grown cost 40-60% less). Both are real diamonds with the same brilliance, hardness, and beauty.'
  }
]

export default function DiamondFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="w-full bg-main-gray py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-white text-2xl font-black mb-8 text-center">Diamond FAQ</h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={index}
                className={`rounded-lg transition-colors ${isOpen ? '' : 'border border-gray-600'}`}
                style={isOpen ? { backgroundColor: '#CCCCCC' } : { backgroundColor: '#2A2A2A' }}
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
                        <p className="text-gray-800 text-base font-normal leading-relaxed">
                          {faq.answer}
                        </p>
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
