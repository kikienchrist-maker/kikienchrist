// Vitest global setup & mocks
import { vi } from 'vitest';

// Mock global fetch
global.fetch = vi.fn();

// Mock console methods for cleaner test output
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Filter out expected errors in tests
  const msg = args.join(' ');
  if (msg.includes('Web Share API failed') || msg.includes('MailerLite')) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  const msg = args.join(' ');
  if (msg.includes('deprecated') || msg.includes('experimental')) {
    return;
  }
  originalConsoleWarn(...args);
};

// Mock navigator.share for SocialShare tests
Object.defineProperty(navigator, 'share', {
  value: vi.fn().mockResolvedValue(undefined),
  writable: true,
  configurable: true,
});

// Mock navigator.clipboard for copy functionality
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
  writable: true,
  configurable: true,
});

// Mock IntersectionObserver for TableOfContents
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn();
  root = null;
  rootMargin = '';
  thresholds = [];
}

Object.defineProperty(global, 'IntersectionObserver', {
  value: MockIntersectionObserver,
  writable: true,
  configurable: true,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(global, 'ResizeObserver', {
  value: MockResizeObserver,
  writable: true,
  configurable: true,
});

// Mock matchMedia
Object.defineProperty(global, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
  writable: true,
  configurable: true,
});

// Mock crypto.randomUUID for unique IDs
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: vi.fn().mockImplementation(() => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    })),
  },
  writable: true,
  configurable: true,
});

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks();
});