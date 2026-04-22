import { motion } from 'framer-motion';

export const AnimatedBlobs = () => {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-gray-50">
      {/* Blob 1 */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-100/50 mix-blend-multiply filter blur-[100px]"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      {/* Blob 2 */}
      <motion.div
        className="absolute top-[20%] right-[-5%] w-[600px] h-[600px] rounded-full bg-cyan-100/40 mix-blend-multiply filter blur-[120px]"
        animate={{
          x: [0, -80, 0],
          y: [0, 100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2,
        }}
      />
      {/* Blob 3 */}
      <motion.div
        className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] rounded-full bg-slate-200/60 mix-blend-multiply filter blur-[150px]"
        animate={{
          x: [0, 150, 0],
          y: [0, -100, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 4,
        }}
      />
      {/* Overlay to ensure readability */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
    </div>
  );
};
