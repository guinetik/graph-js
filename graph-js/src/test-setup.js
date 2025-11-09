/**
 * Test Setup for Vitest
 *
 * Configures the test environment to use MockWorkerAdapter instead of real workers
 */

// Set global flag to force mock worker usage in tests
globalThis.__USE_MOCK_WORKERS__ = true;

// Optional: Set up any global test utilities or mocks
