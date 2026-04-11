'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [clicked, setClicked] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [hidden, setHidden] = useState(true);

  // Mouse positions
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for tracking to create an elegant "trailing" delay effect
  const springConfig = { damping: 25, stiffness: 300, mass: 0.3 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Offset by half of width/height (12px for a 24px circle)
      cursorX.set(e.clientX - 12); 
      cursorY.set(e.clientY - 12);
      setHidden(false);
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      setScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrolling(false);
      }, 150);
    };

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [cursorX, cursorY]);

  // Ensure it only renders on client to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <motion.div
      // mix-blend-difference creates an amazing inverse color effect when it hovers over light text.
      // hidden md:block disables it on mobile where there is no cursor.
      className="fixed top-0 left-0 w-6 h-6 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
      style={{
        translateX: cursorXSpring,
        translateY: cursorYSpring,
      }}
      animate={{
        scale: hidden ? 0 : clicked ? 0.5 : scrolling ? 1.5 : 1,
        opacity: hidden ? 0 : scrolling ? 0.3 : 1,
      }}
      transition={{ 
        scale: { type: "spring", stiffness: 300, damping: 20 },
        opacity: { duration: 0.2 } 
      }}
    />
  );
}
