'use client';

import { motion } from 'framer-motion';

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Red Cube */}
      <motion.div
        className="hidden sm:block absolute top-20 right-[15%] w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48"
        animate={{
          y: [0, -30, 0],
          rotateY: [0, 360],
          rotateX: [0, 15, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <div className="relative w-full h-full preserve-3d">
          <div
            className="absolute inset-0 rounded-xl glow-red"
            style={{
              background:
                'linear-gradient(135deg, hsl(0 84% 60%), hsl(0 84% 50%))',
              transform: 'rotateX(-15deg) rotateY(15deg)',
              boxShadow: '0 30px 60px hsl(0 84% 60% / 0.4)',
            }}
          />
        </div>
      </motion.div>

      {/* Green Cube */}
      <motion.div
        className="hidden sm:block absolute top-[40%] right-[25%] w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56"
        animate={{
          y: [0, -25, 0],
          rotateY: [0, -360],
          rotateX: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      >
        <div className="relative w-full h-full">
          <div
            className="absolute inset-0 rounded-xl glow-green"
            style={{
              background:
                'linear-gradient(135deg, hsl(142 71% 45%), hsl(142 71% 35%))',
              transform: 'rotateX(-20deg) rotateY(-15deg)',
              boxShadow: '0 30px 60px hsl(142 71% 45% / 0.4)',
            }}
          />
        </div>
      </motion.div>

      {/* Icosahedron / Diamond */}
      <motion.div
        className="hidden sm:block absolute top-[30%] right-[8%] w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      >
        <div
          className="w-full h-full"
          style={{
            background:
              'linear-gradient(135deg, hsl(0 0% 85%), hsl(0 0% 95%))',
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            boxShadow: '0 20px 40px hsl(0 0% 50% / 0.3)',
          }}
        />
      </motion.div>

      {/* Blue Platform */}
      <motion.div
        className="hidden sm:block absolute bottom-[15%] right-[10%] w-32 h-16 sm:w-44 sm:h-24 md:w-64 md:h-32"
        animate={{
          y: [0, -15, 0],
          rotateX: [0, 5, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      >
        <div
          className="w-full h-full rounded-xl glow-blue"
          style={{
            background:
              'linear-gradient(180deg, hsl(221 83% 65%), hsl(221 83% 45%))',
            transform: 'perspective(500px) rotateX(60deg)',
            boxShadow: '0 30px 60px hsl(221 83% 53% / 0.5)',
          }}
        />
      </motion.div>

      {/* Ambient glow effects */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-rgb-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-rgb-green/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 right-[15%] w-64 h-64 bg-rgb-red/10 rounded-full blur-3xl" />
    </div>
  );
}

