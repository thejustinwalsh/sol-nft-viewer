import { useTheme } from 'next-themes';
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from './Button';

export function ThemeToggleButton() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const toggleTheme = useCallback(() => {
    const targetTheme = resolvedTheme === "light" ? "dark" : "light";
    setTheme(targetTheme);
  }, [resolvedTheme, setTheme]);

  if (!mounted) return null;
  return (
    <Button
      style={{ position: 'fixed', zIndex: 999, right: 15, top: 15 }}
      onClick={toggleTheme}
    >
      Toggle theme
    </Button>
  );
}
