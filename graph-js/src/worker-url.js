/**
 * Worker URL export for bundlers
 *
 * This module exports the URL to the network worker file.
 * It resolves correctly whether the library is:
 * - Installed from NPM
 * - Linked locally
 * - Used in a monorepo
 *
 * NOTE: This approach works in dev but may fail in production builds
 * when the consuming application bundles this code. For production builds,
 * import the worker directly with ?url suffix:
 *
 * ```javascript
 * import workerUrl from '@guinetik/graph-js/worker?url';
 * const analyzer = new NetworkStats({ workerScript: workerUrl });
 * ```
 *
 * Legacy usage (works in dev only):
 * ```javascript
 * import workerUrl from '@guinetik/graph-js/worker-url';
 * const analyzer = new NetworkStats({ workerScript: workerUrl });
 * ```
 */

// Resolve worker URL relative to this module
// When bundled by Vite/Webpack/etc, this will resolve correctly
export default new URL('./network-worker.js', import.meta.url).href;
