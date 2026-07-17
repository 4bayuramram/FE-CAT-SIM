import { useRef } from "react";
import { motion, useInView } from "motion/react";

/**
 * RowReveal — animasi masuk (scale+fade) per baris, dipakai untuk
 * membungkus <LeaderboardRow> tanpa mengubah tampilan/komposisi baris.
 * Diadaptasi dari AnimatedItem milik AnimatedList, tanpa fitur list
 * (scroll container, gradient, keyboard nav) karena leaderboard sudah
 * punya scroll container & style sendiri.
 */
export default function RowReveal({ children, index = 0, delay = 0.05 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.7, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index, 10) * delay }}
    >
      {children}
    </motion.div>
  );
}
