// Vitest global setup for Happy-Birthday-Website
import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// Ensure React is globally available for legacy JSX transform env
// Otherwise components compiled with classic runtime may error in tests
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
globalThis.React = React;

// Mock Next.js Image to plain <img> using React.createElement to avoid JSX in .ts file
vi.mock('canvas-confetti', () => ({ __esModule: true, default: () => {} }));

vi.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => () => null,
}));

vi.mock('next/navigation', () => {
  return {
    __esModule: true,
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
    }),
    usePathname: () => '/',
  };
});

vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: (props: any) => React.createElement('a', { ...props, href: props.href }),
  };
});

vi.mock('next/image', () => {
  return {
    __esModule: true,
    default: (props: any) => React.createElement('img', props),
  };
});
