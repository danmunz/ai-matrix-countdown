"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const GLYPHS = "▓▒░█<>/#%0123456789·—";

function scrambleFrame(target: string, progress: number): string {
  let out = "";
  for (let i = 0; i < target.length; i++) {
    if (i < progress) {
      out += target[i];
    } else if (target[i] === " ") {
      out += " ";
    } else {
      out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }
  }
  return out;
}

function erodeFrame(target: string, progress: number): string {
  let out = "";
  const threshold = target.length - progress;
  for (let i = 0; i < target.length; i++) {
    if (i >= threshold) {
      out += Math.random() < 0.55 ? " " : target[i];
    } else {
      out += target[i];
    }
  }
  return out;
}

interface UseScrambleOptions {
  text: string;
  charsPerFrame?: number;
  frameInterval?: number;
  direction?: "resolve" | "erode";
  autoStart?: boolean;
  onComplete?: () => void;
}

export function useScramble({
  text,
  charsPerFrame = 2,
  frameInterval = 42,
  direction = "resolve",
  autoStart = true,
  onComplete,
}: UseScrambleOptions) {
  const [display, setDisplay] = useState(autoStart ? scrambleFrame(text, 0) : text);
  const progressRef = useRef(0);
  const rafRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  }, []);

  const start = useCallback(() => {
    if (reducedMotion.current) {
      setDisplay(direction === "resolve" ? text : "");
      onComplete?.();
      return;
    }

    progressRef.current = 0;
    if (rafRef.current) clearInterval(rafRef.current);

    rafRef.current = setInterval(() => {
      progressRef.current += charsPerFrame;
      const fn = direction === "resolve" ? scrambleFrame : erodeFrame;
      setDisplay(fn(text, progressRef.current));

      if (progressRef.current >= text.length) {
        if (rafRef.current) clearInterval(rafRef.current);
        rafRef.current = null;
        setDisplay(direction === "resolve" ? text : "");
        onComplete?.();
      }
    }, frameInterval);
  }, [text, charsPerFrame, frameInterval, direction, onComplete]);

  useEffect(() => {
    if (autoStart) start();
    return () => {
      if (rafRef.current) clearInterval(rafRef.current);
    };
  }, [autoStart, start]);

  return { display, start };
}

export function useGhostPhrase(phrases: string[], holdMs = 8000) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"resolve" | "hold" | "erode">("resolve");
  const currentPhrase = phrases[index];

  const { display, start } = useScramble({
    text: currentPhrase,
    charsPerFrame: 2,
    frameInterval: 42,
    direction: phase === "erode" ? "erode" : "resolve",
    autoStart: phase !== "hold",
    onComplete: () => {
      if (phase === "resolve") {
        setPhase("hold");
      } else if (phase === "erode") {
        setIndex((i) => (i + 1) % phrases.length);
        setPhase("resolve");
      }
    },
  });

  useEffect(() => {
    if (phase !== "hold") return;
    const t = setTimeout(() => setPhase("erode"), holdMs);
    return () => clearTimeout(t);
  }, [phase, holdMs]);

  useEffect(() => {
    if (phase === "resolve" || phase === "erode") {
      start();
    }
  }, [phase, start]);

  return display;
}
