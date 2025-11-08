/**
 * i18n Composable for Vue
 * Provides translation functionality
 */

import { ref, computed } from 'vue';
import { translations } from '../../lib/i18n.js';

const currentLang = ref(localStorage.getItem('lang') || 'en');

export function useI18n() {
  /**
   * Get translation for a key
   * @param {string} key - Translation key (e.g., 'nav.showcase')
   * @param {Object} replacements - Optional object with placeholder replacements
   * @returns {string} Translated text
   */
  const t = (key, replacements = {}) => {
    const keys = key.split('.');
    let value = translations[currentLang.value];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation not found: ${key} (${currentLang.value})`);
        return key;
      }
    }

    // Replace placeholders like {name}, {count}, etc.
    if (typeof value === 'string' && Object.keys(replacements).length > 0) {
      return value.replace(/\{(\w+)\}/g, (match, placeholder) => {
        return replacements[placeholder] !== undefined ? replacements[placeholder] : match;
      });
    }

    return value;
  };

  /**
   * Change the current language
   * @param {string} newLang - Language code ('en' or 'pt')
   */
  const changeLanguage = (newLang) => {
    currentLang.value = newLang;
    localStorage.setItem('lang', newLang);
  };

  return {
    lang: currentLang,
    t,
    changeLanguage,
    translations: computed(() => translations[currentLang.value])
  };
}
