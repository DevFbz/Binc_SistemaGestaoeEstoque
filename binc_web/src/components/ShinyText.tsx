import { motion } from 'framer-motion';

interface ShinyTextProps {
  text: string;
  className?: string;
}

export const ShinyText = ({ text, className = '' }: ShinyTextProps) => {
  return (
    <motion.span
      className={`inline-block ${className}`}
      animate={{ backgroundPosition: ['200% center', '-200% center'] }}
      transition={{
        repeat: Infinity,
        duration: 3,
        ease: 'linear',
      }}
      style={{
        backgroundImage:
          'linear-gradient(100deg, #64CEFB 0%, #64CEFB 35%, #ffffff 50%, #64CEFB 65%, #64CEFB 100%)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        color: 'transparent',
      }}
    >
      {text}
    </motion.span>
  );
};
