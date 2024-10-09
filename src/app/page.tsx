'use client';
import { ThemeProvider } from '../lib/builder/src/context/ThemeContext';
import Builder from '../lib/builder/src';

export default function Home() {
  return (
      <ThemeProvider>
        <Builder />
      </ThemeProvider>
  );
}