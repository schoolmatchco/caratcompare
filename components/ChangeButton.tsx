'use client'

import { motion } from 'framer-motion'

interface ChangeButtonProps {
  onClick: () => void
}

export default function ChangeButton({ onClick }: ChangeButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        y: [0, -8, 0, -4, 0]
      }}
      transition={{
        delay: 5,
        duration: 0.6,
        ease: 'easeInOut'
      }}
      className="relative w-16 h-16"
    >
      <img
        src="/svg/change.svg"
        alt="Change"
        className="w-full h-full object-contain"
      />
    </motion.button>
  )
}
