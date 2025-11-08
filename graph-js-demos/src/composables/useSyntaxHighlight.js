import { ref, onMounted } from 'vue';
import { createHighlighter } from 'shiki';

let highlighterInstance = null;
let highlighterPromise = null;

/**
 * Composable for syntax highlighting using Shiki
 * Provides a shared highlighter instance across components
 */
export function useSyntaxHighlight() {
  const isReady = ref(false);

  /**
   * Initialize the Shiki highlighter with themes and languages
   */
  async function initHighlighter() {
    if (highlighterInstance) {
      isReady.value = true;
      return highlighterInstance;
    }

    if (!highlighterPromise) {
      highlighterPromise = createHighlighter({
        themes: ['github-dark', 'github-light'],
        langs: ['javascript', 'typescript', 'python', 'bash', 'json', 'css', 'html']
      });
    }

    highlighterInstance = await highlighterPromise;
    isReady.value = true;
    return highlighterInstance;
  }

  /**
   * Highlight code with the specified language
   * @param {string} code - The code to highlight
   * @param {string} lang - The language identifier
   * @param {string} theme - The theme to use (default: 'github-dark')
   * @returns {Promise<string>} - HTML string with syntax highlighting
   */
  async function highlight(code, lang = 'javascript', theme = 'github-dark') {
    const highlighter = await initHighlighter();

    return highlighter.codeToHtml(code, {
      lang,
      theme
    });
  }

  onMounted(() => {
    initHighlighter();
  });

  return {
    isReady,
    highlight,
    initHighlighter
  };
}
