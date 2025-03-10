import { getLocalStorage } from './localStorage';

/**
 * Get the user's preferred theme from local storage, defaulting to the browser's preferred theme if not set.
 * @returns True if the theme is "dark", otherwise false.
 */
export const getThemePreference = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }
  const themePreference = getLocalStorage('themePreference');
  return themePreference === 'dark';
};
