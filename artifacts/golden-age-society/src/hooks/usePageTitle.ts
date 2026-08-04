import { useEffect } from 'react';

/**
 * Sets document.title on mount (and whenever `title` changes).
 * Pattern: "Page Name | Golden Age Society"
 */
export function usePageTitle(title?: string) {
  useEffect(() => {
    const base = 'Golden Age Society';
    document.title = title ? `${title} | ${base}` : base;
    return () => {
      document.title = base;
    };
  }, [title]);
}
