"use client";
import { useState, useEffect } from "react";
import { computeDaysLeft } from "@/lib/countdown";

export function useDaysLeft(): number {
  const [days, setDays] = useState(computeDaysLeft);

  useEffect(() => {
    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      2
    );
    const msUntil = nextMidnight.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      setDays(computeDaysLeft());
      const interval = setInterval(() => {
        setDays(computeDaysLeft());
      }, 86_400_000);
      return () => clearInterval(interval);
    }, msUntil);

    return () => clearTimeout(timeout);
  }, []);

  return days;
}
