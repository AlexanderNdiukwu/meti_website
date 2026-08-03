// // FILE: LoadingScreen.jsx
// // Place at: src/components/LoadingScreen.jsx
// import { motion } from 'framer-motion';

// const METI_LETTERS = 'METI'.split('');

// export default function LoadingScreen() {
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-black gap-4">
//       <div className="flex">
//         {METI_LETTERS.map((letter, i) => (
//           <motion.span
//             key={i}
//             className="text-5xl md:text-6xl font-black text-white/90"
//             initial={{ opacity: 0, y: 8 }}
//             animate={{
//               opacity: [0, 1, 0.6, 1],
//               y: 0,
//               textShadow: [
//                 '0 0 4px rgba(255,255,255,0.08)',
//                 '0 0 14px rgba(255,255,255,0.28)',
//                 '0 0 4px rgba(255,255,255,0.08)',
//               ],
//             }}
//             transition={{
//               duration: 1.8,
//               repeat: Infinity,
//               repeatType: 'loop',
//               delay: i * 0.15,
//               ease: 'easeInOut',
//             }}
//           >
//             {letter}
//           </motion.span>
//         ))}
//       </div>
//       <motion.p
//         className="text-[10px] md:text-xl tracking-[0.3em] uppercase text-white/40 font-semibold text-center px-6"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: [0, 0.6, 0.3, 0.6] }}
//         transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
//       >
//         Institute of Engineering, Technology &amp; Innovation Management
//       </motion.p>
//     </div>
//   );
// }



// FILE: LoadingScreen.jsx
// Place at: src/components/LoadingScreen.jsx
import { motion } from 'framer-motion';

const METI_LETTERS = 'METI'.split('');

export default function LoadingScreen() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-linear-to-b from-[#0a1628] via-[#0f1f38] to-[#0a1628]">

      {/* Top progress bar — sweeps left to right, loops */}
      <div className="absolute top-0 left-0 w-full h-0,75 bg-white/5 overflow-hidden">
        <motion.div
          className="h-full w-1/3 bg-linear-to-r from-transparent via-brand-primary/80 to-transparent"
          animate={{ x: ['-100%', '400%'] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Soft ambient glow behind everything */}
      <motion.div
        className="absolute w-105 h-105 rounded-full bg-brand-primary/10 blur-[100px]"
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Slow rotating ring, offset behind the text */}
      <motion.div
        className="absolute w-64 h-64 rounded-full border border-white/6 border-t-brand-primary/30"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative flex flex-col items-center gap-4">
        {/* METI wordmark — letter by letter glow-write */}
        <div className="flex">
          {METI_LETTERS.map((letter, i) => (
            <motion.span
              key={i}
              className="text-5xl md:text-6xl font-black text-white/90 tracking-wide"
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{
                opacity: [0, 1, 0.7, 1],
                y: 0,
                filter: ['blur(4px)', 'blur(0px)'],
                textShadow: [
                  '0 0 6px rgba(120,170,255,0.05)',
                  '0 0 18px rgba(120,170,255,0.25)',
                  '0 0 6px rgba(120,170,255,0.05)',
                ],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatType: 'loop',
                delay: i * 0.18,
                ease: 'easeInOut',
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* Motto — rises in softly beneath */}
        <motion.p
          className="text-[10px] md:text-xl tracking-[0.35em] uppercase text-white/40 font-semibold text-center px-6"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: [0, 0.7, 0.4, 0.7], y: 0 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        >
          Institute of Engineering, Technology &amp; Innovation Management
        </motion.p>

        {/* Three small breathing dots underneath — subtle "still working" cue */}
        <div className="flex gap-1.5 mt-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-brand-primary/60"
              animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}