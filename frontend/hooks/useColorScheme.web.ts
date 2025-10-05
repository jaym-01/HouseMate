/**
 * Always return 'light' to disable dark mode support
 */
export function useColorScheme() {
  return 'light' as const;
}
