const D = {
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  TRACE: 5
}, Oe = "info", pe = "sandbox_logging_filters", be = ["themeswitcher", "codemirroreditor", "editoradapter"];
class qe {
  /**
   * Creates a new Logger instance
   * @param {object} options - Logger configuration options
   * @param {boolean} [options.enabled=true] - Whether logging is enabled
   * @param {string} [options.level='info'] - Log level (error, warn, info, debug, trace)
   * @param {string} [options.prefix=''] - Prefix to add to all log messages
   * @param {boolean} [options.redactSecrets=false] - Whether to redact potential secrets
   * @param {object} [options.loggingManager] - LoggingManager instance for component filtering
   * @param {object} [options.console=console] - Console object to use
   */
  constructor(e = {}) {
    this.enabled = e.enabled !== !1, this.level = e.level || Oe, this.prefix = e.prefix || "", this.component = this.prefix, this.redactSecrets = e.redactSecrets || !1, this.currentLevel = D[this.level.toUpperCase()] ?? D.INFO, this.loggingManager = e.loggingManager, this.console = e.console || console, this.component && this.loggingManager && this.loggingManager.registerComponent(this.component);
  }
  /**
   * Checks if a message should be logged based on current level, enabled state, and component filter
   * @param {string} level - The log level to check
   * @returns {boolean} True if the message should be logged
   */
  shouldLog(e) {
    if (e.toUpperCase() === "ERROR")
      return this.enabled && D[e.toUpperCase()] <= this.currentLevel;
    const t = !this.component || !this.loggingManager || this.loggingManager.isComponentEnabled(this.component);
    return this.enabled && t && D[e.toUpperCase()] <= this.currentLevel;
  }
  /**
   * Redacts potential secrets from arguments
   * @param {Array} args - Arguments to redact
   * @returns {Array} Redacted arguments
   */
  redactArgs(e) {
    return this.redactSecrets ? e.map((t) => this.redactValue(t)) : e;
  }
  /**
   * Recursively redacts secrets from a value
   * @param {any} value - Value to redact
   * @returns {any} Redacted value
   */
  redactValue(e) {
    if (typeof e == "string")
      return e.replace(/\b[a-zA-Z0-9_-]{20,}\b/g, "[REDACTED]");
    if (Array.isArray(e))
      return e.map((t) => this.redactValue(t));
    if (e && typeof e == "object" && e.constructor === Object) {
      const t = {};
      for (const s in e)
        Object.prototype.hasOwnProperty.call(e, s) && (t[s] = this.redactValue(e[s]));
      return t;
    }
    return e;
  }
  /**
   * Formats a message with prefix
   * @param {string} message - The message to format
   * @param {...any} args - Additional arguments
   * @returns {Array} Formatted message array
   */
  formatMessage(e, ...t) {
    const s = this.prefix ? `[${this.prefix}] ` : "", o = this.redactArgs(t);
    return [s + e, ...o];
  }
  /**
   * Logs an error message
   * @param {string} message - The error message
   * @param {...any} args - Additional arguments
   */
  error(e, ...t) {
    this.shouldLog("error") && this.console.error(...this.formatMessage(e, ...t));
  }
  /**
   * Logs a warning message
   * @param {string} message - The warning message
   * @param {...any} args - Additional arguments
   */
  warn(e, ...t) {
    this.shouldLog("warn") && this.console.warn(...this.formatMessage(e, ...t));
  }
  /**
   * Logs an info message
   * @param {string} message - The info message
   * @param {...any} args - Additional arguments
   */
  info(e, ...t) {
    this.shouldLog("info") && this.console.info(...this.formatMessage(e, ...t));
  }
  /**
   * Logs a general message
   * @param {string} message - The message
   * @param {...any} args - Additional arguments
   */
  log(e, ...t) {
    this.shouldLog("info") && this.console.log(...this.formatMessage(e, ...t));
  }
  /**
   * Logs a debug message
   * @param {string} message - The debug message
   * @param {...any} args - Additional arguments
   */
  debug(e, ...t) {
    this.shouldLog("debug") && this.console.debug(...this.formatMessage(e, ...t));
  }
  /**
   * Logs a trace message (with secret redaction by default)
   * @param {string} message - The trace message
   * @param {...any} args - Additional arguments
   */
  trace(e, ...t) {
    if (this.shouldLog("trace")) {
      const s = this.redactSecrets;
      this.redactSecrets = !0;
      const o = this.formatMessage(e, ...t);
      this.redactSecrets = s, this.console.trace(...o);
    }
  }
  /**
   * Logs a table of data
   * @param {any} data - The data to display in table format
   * @param {Array} [columns] - Optional column names
   */
  table(e, t) {
    if (this.shouldLog("info")) {
      const s = this.prefix ? `[${this.prefix}]` : "";
      s && this.console.log(s), this.console.table(e, t);
    }
  }
  /**
   * Creates a new group in the console
   * @param {string} label - The group label
   */
  group(e) {
    this.shouldLog("info") && this.console.group(...this.formatMessage(e));
  }
  /**
   * Creates a new collapsed group in the console
   * @param {string} label - The group label
   */
  groupCollapsed(e) {
    this.shouldLog("info") && this.console.groupCollapsed(...this.formatMessage(e));
  }
  /**
   * Ends the current console group
   */
  groupEnd() {
    this.shouldLog("info") && this.console.groupEnd();
  }
  /**
   * Starts a timer with the given label
   * @param {string} label - The timer label
   */
  time(e) {
    this.shouldLog("debug") && this.console.time(this.prefix ? `[${this.prefix}] ${e}` : e);
  }
  /**
   * Ends a timer with the given label
   * @param {string} label - The timer label
   */
  timeEnd(e) {
    this.shouldLog("debug") && this.console.timeEnd(this.prefix ? `[${this.prefix}] ${e}` : e);
  }
  /**
   * Sets the log level
   * @param {string} level - The new log level
   */
  setLevel(e) {
    this.level = e, this.currentLevel = D[e.toUpperCase()] ?? D.INFO;
  }
  /**
   * Enables logging
   */
  enable() {
    this.enabled = !0;
  }
  /**
   * Disables logging
   */
  disable() {
    this.enabled = !1;
  }
  /**
   * Checks if logging is enabled
   * @returns {boolean} True if logging is enabled
   */
  isEnabled() {
    return this.enabled;
  }
}
class Qe {
  /**
   * Creates a new LoggingManager instance
   * @param {object} options - Configuration options
   * @param {object} options.storage - Storage adapter instance
   * @param {object} options.console - Console object (default: console)
   */
  constructor(e = {}) {
    this.storage = e.storage, this.console = e.console || console, this.allowedComponents = /* @__PURE__ */ new Set(), this.globalEnabled = !0, this.allowAll = !1, this.registeredComponents = /* @__PURE__ */ new Set(), this.storage && this.loadFromStorage();
  }
  /**
   * Enables logging for specific components
   * @param {...string} components - Component names to enable
   */
  enable(...e) {
    e.forEach((t) => this.allowedComponents.add(t.toLowerCase())), this.saveToStorage(), this.console.log("🔧 Logging enabled for:", e.join(", "));
  }
  /**
   * Disables logging for specific components
   * @param {...string} components - Component names to disable
   */
  disable(...e) {
    e.forEach((t) => this.allowedComponents.delete(t.toLowerCase())), this.saveToStorage(), this.console.log("🔧 Logging disabled for:", e.join(", "));
  }
  /**
   * Enables logging for all components
   */
  enableAll() {
    this.allowAll = !0, this.saveToStorage(), this.console.log("🔧 Logging enabled for ALL components");
  }
  /**
   * Disables logging for all components except errors
   */
  disableAll() {
    this.allowAll = !1, this.allowedComponents.clear(), this.saveToStorage(), this.console.log("🔧 Logging disabled for ALL components (errors still show)");
  }
  /**
   * Shows current logging status
   */
  status() {
    this.console.log("🔧 Logging Status:"), this.console.log("  Global enabled:", this.globalEnabled), this.console.log("  Allow all:", this.allowAll), this.console.log("  Enabled components:", Array.from(this.allowedComponents).join(", ") || "none");
  }
  /**
   * Lists available components that have loggers
   */
  listComponents() {
    this.console.log("🔧 Available components to filter:"), Array.from(this.registeredComponents).sort().forEach((e) => {
      const t = this.isComponentEnabled(e);
      this.console.log(`  ${t ? "✅" : "❌"} ${e}`);
    });
  }
  /**
   * Checks if a component should log
   * @param {string} component - Component name
   * @returns {boolean} True if component should log
   */
  isComponentEnabled(e) {
    return this.globalEnabled ? this.allowAll ? !0 : this.allowedComponents.has(e.toLowerCase()) : !1;
  }
  /**
   * Registers a component for tracking
   * @param {string} component - Component name
   */
  registerComponent(e) {
    this.registeredComponents.add(e);
  }
  /**
   * Saves filter state to storage
   */
  saveToStorage() {
    if (this.storage)
      try {
        const e = {
          allowedComponents: Array.from(this.allowedComponents),
          allowAll: this.allowAll,
          globalEnabled: this.globalEnabled
        };
        this.storage.setItem(pe, JSON.stringify(e));
      } catch {
      }
  }
  /**
   * Loads filter state from storage
   */
  loadFromStorage() {
    if (this.storage)
      try {
        const e = this.storage.getItem(pe), t = JSON.parse(e || "{}");
        this.allowedComponents = new Set(t.allowedComponents || []), this.allowAll = t.allowAll || !1, this.globalEnabled = t.globalEnabled !== !1, e || (this.allowedComponents = new Set(be));
      } catch {
        this.allowedComponents = new Set(be);
      }
  }
}
class Be {
  /**
   * Gets an item from storage
   * @param {string} key - Storage key
   * @returns {string|null} Stored value or null
   */
  getItem(e) {
    throw new Error("StorageAdapter.getItem must be implemented");
  }
  /**
   * Sets an item in storage
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   */
  setItem(e, t) {
    throw new Error("StorageAdapter.setItem must be implemented");
  }
  /**
   * Removes an item from storage
   * @param {string} key - Storage key
   */
  removeItem(e) {
    throw new Error("StorageAdapter.removeItem must be implemented");
  }
}
class De extends Be {
  constructor() {
    super(), this.storage = /* @__PURE__ */ new Map();
  }
  getItem(e) {
    return this.storage.get(e) ?? null;
  }
  setItem(e, t) {
    this.storage.set(e, t);
  }
  removeItem(e) {
    this.storage.delete(e);
  }
}
class $e extends Be {
  getItem(e) {
    try {
      return localStorage.getItem(e);
    } catch {
      return null;
    }
  }
  setItem(e, t) {
    try {
      localStorage.setItem(e, t);
    } catch {
    }
  }
  removeItem(e) {
    try {
      localStorage.removeItem(e);
    } catch {
    }
  }
}
function et() {
  return typeof localStorage < "u" ? new $e() : new De();
}
class ke {
  /**
   * Gets the global object
   * @returns {object} Global object
   */
  getGlobal() {
    throw new Error("GlobalAdapter.getGlobal must be implemented");
  }
  /**
   * Sets a property on the global object
   * @param {string} key - Property key
   * @param {any} value - Property value
   */
  setGlobalProperty(e, t) {
    throw new Error("GlobalAdapter.setGlobalProperty must be implemented");
  }
  /**
   * Checks if a property exists on the global object
   * @param {string} key - Property key
   * @returns {boolean} True if property exists
   */
  hasGlobalProperty(e) {
    throw new Error("GlobalAdapter.hasGlobalProperty must be implemented");
  }
}
class tt extends ke {
  getGlobal() {
    return window;
  }
  setGlobalProperty(e, t) {
    window[e] = t;
  }
  hasGlobalProperty(e) {
    return e in window;
  }
}
class st extends ke {
  getGlobal() {
    return globalThis;
  }
  setGlobalProperty(e, t) {
    globalThis[e] = t;
  }
  hasGlobalProperty(e) {
    return e in globalThis;
  }
}
function ot() {
  return typeof window < "u" ? new tt() : new st();
}
const nt = et(), it = ot(), U = new Qe({
  storage: nt,
  console
});
typeof window < "u" && it.setGlobalProperty("logFilter", {
  enable: (...n) => U.enable(...n),
  disable: (...n) => U.disable(...n),
  enableAll: () => U.enableAll(),
  disableAll: () => U.disableAll(),
  status: () => U.status(),
  list: () => U.listComponents()
});
function re(n = {}) {
  return new qe({
    ...n,
    loggingManager: U
  });
}
class $ {
  constructor(e) {
    this.workerScript = e, this.worker = null;
  }
  /**
   * Factory method to create appropriate worker adapter for current platform
   *
   * @param {string} workerScript - Path to worker script
   * @returns {WorkerAdapter} Platform-specific worker adapter
   * @throws {Error} If workers are not supported
   *
   * @example
   * const worker = WorkerAdapter.create('./network-worker.js');
   * worker.postMessage({ type: 'compute', data: [...] });
   */
  static create(e) {
    if (typeof globalThis < "u" && globalThis.__USE_MOCK_WORKERS__)
      return new at(e);
    if (typeof Worker < "u")
      return new ge(e);
    if (typeof require < "u")
      try {
        return require.resolve("worker_threads"), new rt(e);
      } catch {
        throw new Error("Worker Threads not available in this Node.js version");
      }
    else
      throw new Error("No worker support available in this environment");
  }
  /**
   * Check if workers are supported in current environment
   *
   * @returns {boolean} True if workers are available
   */
  static isSupported() {
    if (typeof Worker < "u")
      return !0;
    if (typeof require < "u")
      try {
        return require.resolve("worker_threads"), !0;
      } catch {
        return !1;
      }
    return !1;
  }
  /**
   * Post message to worker
   * @abstract
   * @param {Object} message - Message to send
   * @param {Array} [transferList] - Objects to transfer ownership
   */
  postMessage(e, t = []) {
    throw new Error("Must implement postMessage");
  }
  /**
   * Set message handler
   * @abstract
   * @param {Function} callback - Handler for messages from worker
   */
  onMessage(e) {
    throw new Error("Must implement onMessage");
  }
  /**
   * Set error handler
   * @abstract
   * @param {Function} callback - Handler for worker errors
   */
  onError(e) {
    throw new Error("Must implement onError");
  }
  /**
   * Terminate worker
   * @abstract
   */
  terminate() {
    throw new Error("Must implement terminate");
  }
}
class ge extends $ {
  constructor(e) {
    super(e), this.worker = new Worker(e, { type: "module" });
  }
  /**
   * Create worker from inline code (useful for bundlers)
   *
   * @param {string} code - Worker code as string
   * @returns {BrowserWorkerAdapter}
   *
   * @example
   * const code = `
   *   self.onmessage = (e) => {
   *     const result = compute(e.data);
   *     self.postMessage(result);
   *   };
   * `;
   * const worker = BrowserWorkerAdapter.fromCode(code);
   */
  static fromCode(e) {
    const t = new Blob([e], { type: "application/javascript" }), s = URL.createObjectURL(t);
    return new ge(s);
  }
  postMessage(e, t = []) {
    this.worker.postMessage(e, t);
  }
  onMessage(e) {
    this.worker.onmessage = (t) => e(t.data);
  }
  onError(e) {
    this.worker.onerror = (t) => {
      e(new Error(t.message || "Worker error"));
    };
  }
  terminate() {
    this.worker && (this.worker.terminate(), this.worker = null);
  }
}
class rt extends $ {
  constructor(e) {
    super(e);
    const { Worker: t } = require("worker_threads");
    this.worker = new t(e);
  }
  postMessage(e, t = []) {
    this.worker.postMessage(e, t);
  }
  onMessage(e) {
    this.worker.on("message", e);
  }
  onError(e) {
    this.worker.on("error", (t) => {
      e(t);
    }), this.worker.on("exit", (t) => {
      t !== 0 && e(new Error(`Worker stopped with exit code ${t}`));
    });
  }
  terminate() {
    this.worker && (this.worker.terminate(), this.worker = null);
  }
}
class at extends $ {
  constructor(e) {
    super(e), this.messageHandler = null;
  }
  postMessage(e, t = []) {
    setTimeout(async () => {
      if (this.messageHandler)
        try {
          const s = await this.executeSync(e);
          this.messageHandler({
            id: e.id,
            status: "complete",
            result: s
          });
        } catch (s) {
          this.errorHandler ? this.errorHandler(s) : this.messageHandler({
            id: e.id,
            status: "error",
            error: s.message || "Unknown error",
            stack: s.stack
          });
        }
    }, 0);
  }
  onMessage(e) {
    this.messageHandler = e;
  }
  onError(e) {
    this.errorHandler = e;
  }
  terminate() {
    this.messageHandler = null, this.errorHandler = null;
  }
  /**
   * Synchronous execution using module registry
   * @private
   */
  async executeSync(e) {
    const { executeTask: t } = await Promise.resolve().then(() => cs);
    return t(e);
  }
}
class ct {
  /**
   * Create a new worker pool
   *
   * @param {Object} options - Configuration options
   * @param {number} [options.maxWorkers] - Maximum number of workers (default: CPU count)
   * @param {string} [options.workerScript] - Path to worker script
   * @param {number} [options.taskTimeout] - Task timeout in ms (default: 60000)
   * @param {boolean} [options.verbose] - Enable verbose logging
   * @param {boolean} [options.enableAffinity=true] - Enable worker affinity (route same algorithm to same worker)
   * @param {number} [options.affinityCacheLimit=50] - Max cached function keys per worker
   */
  constructor(e = {}) {
    this.maxWorkers = e.maxWorkers || this.detectCPUCount(), this.workerScript = e.workerScript || this.getDefaultWorkerScript(), this.taskTimeout = e.taskTimeout || 6e4, this.verbose = e.verbose || !1, this.affinityCacheLimit = e.affinityCacheLimit || 50, this.enableAffinity = e.enableAffinity !== !1, this.workers = [], this.availableWorkers = [], this.taskQueue = [], this.activeTasks = /* @__PURE__ */ new Map(), this.taskIdCounter = 0, this.initialized = !1, this.affinityMetrics = {
      hits: 0,
      misses: 0
    }, this.log = re({
      prefix: "WorkerPool",
      level: this.verbose ? "debug" : "info"
    });
  }
  /**
   * Detect number of CPU cores
   * @private
   * @returns {number} CPU count
   */
  detectCPUCount() {
    if (typeof navigator < "u" && navigator.hardwareConcurrency)
      return navigator.hardwareConcurrency;
    if (typeof require < "u")
      try {
        return require("os").cpus().length;
      } catch {
      }
    return 4;
  }
  /**
   * Get default worker script path
   * @private
   * @returns {string} Worker script path
   */
  getDefaultWorkerScript() {
    return typeof window < "u" ? new URL("data:text/javascript;base64,LyoqCiAqIE5ldHdvcmsgV29ya2VyIC0gRXhlY3V0ZXMgY29tcHV0ZSBmdW5jdGlvbnMgZnJvbSBhbGdvcml0aG0gbW9kdWxlcwogKgogKiAqKkJ1bmRsZXItRnJpZW5kbHkgQXJjaGl0ZWN0dXJlOioqCiAqIC0gU3RhdGljYWxseSBpbXBvcnRzIGFsbCBhbGdvcml0aG0gbW9kdWxlcyB1cGZyb250CiAqIC0gQ3JlYXRlcyBhIHJlZ2lzdHJ5IHRoYXQgbWFwcyBtb2R1bGUgcGF0aHMgdG8gdGhlaXIgZXhwb3J0cwogKiAtIE1haW4gdGhyZWFkIHNlbmRzOiB7IGlkLCBtb2R1bGUsIGZ1bmN0aW9uTmFtZSwgYXJncyB9CiAqIC0gV29ya2VyIGxvb2tzIHVwIG1vZHVsZSBmcm9tIHJlZ2lzdHJ5IGFuZCBleGVjdXRlcyBmdW5jdGlvbgogKgogKiBUaGlzIGFwcHJvYWNoIHdvcmtzIHdpdGggYWxsIGJ1bmRsZXJzIChWaXRlLCBXZWJwYWNrLCBSb2xsdXApIGJlY2F1c2UKICogaW1wb3J0cyBhcmUga25vd24gYXQgYnVpbGQgdGltZS4KICoKICogQG1vZHVsZSBuZXR3b3JrLXdvcmtlcgogKi8KCmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJ0BndWluZXRpay9sb2dnZXInOwoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBTVEFUSUMgSU1QT1JUUyAtIEFsbCBhbGdvcml0aG0gbW9kdWxlcyBpbXBvcnRlZCB1cGZyb250Ci8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCi8vIENyZWF0ZSBsb2dnZXIgZm9yIHdvcmtlciAocnVucyBpbiBzZXBhcmF0ZSBjb250ZXh0LCBubyB3aW5kb3cubG9nRmlsdGVyKQpjb25zdCBsb2cgPSBjcmVhdGVMb2dnZXIoewogIHByZWZpeDogJ25ldHdvcmstd29ya2VyJywKICBsZXZlbDogJ2luZm8nIC8vIFdvcmtlcnMgZGVmYXVsdCB0byBpbmZvIGxldmVsCn0pOwoKLy8gU3RhdGlzdGljcyBhbGdvcml0aG1zIChub2RlLWxldmVsIGFuZCBncmFwaC1sZXZlbCkKaW1wb3J0ICogYXMgbm9kZVN0YXRzQ29tcHV0ZSBmcm9tICcuLi9zdGF0aXN0aWNzL2FsZ29yaXRobXMvbm9kZS1zdGF0cy5qcyc7CmltcG9ydCAqIGFzIGdyYXBoU3RhdHNDb21wdXRlIGZyb20gJy4uL3N0YXRpc3RpY3MvYWxnb3JpdGhtcy9ncmFwaC1zdGF0cy5qcyc7CgovLyBDb21tdW5pdHkgZGV0ZWN0aW9uIGFsZ29yaXRobXMKaW1wb3J0ICogYXMgbG91dmFpbkNvbXB1dGUgZnJvbSAnLi4vY29tbXVuaXR5L2FsZ29yaXRobXMvbG91dmFpbi5qcyc7CgovLyBMYXlvdXQgYWxnb3JpdGhtcwppbXBvcnQgKiBhcyByYW5kb21Db21wdXRlIGZyb20gJy4uL2xheW91dHMvcmFuZG9tLmpzJzsKaW1wb3J0ICogYXMgY2lyY3VsYXJDb21wdXRlIGZyb20gJy4uL2xheW91dHMvY2lyY3VsYXIuanMnOwppbXBvcnQgKiBhcyBzcGlyYWxDb21wdXRlIGZyb20gJy4uL2xheW91dHMvc3BpcmFsLmpzJzsKaW1wb3J0ICogYXMgc2hlbGxDb21wdXRlIGZyb20gJy4uL2xheW91dHMvc2hlbGwuanMnOwppbXBvcnQgKiBhcyBzcGVjdHJhbENvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9zcGVjdHJhbC5qcyc7CmltcG9ydCAqIGFzIGZvcmNlRGlyZWN0ZWRDb21wdXRlIGZyb20gJy4uL2xheW91dHMvZm9yY2UtZGlyZWN0ZWQuanMnOwppbXBvcnQgKiBhcyBrYW1hZGFLYXdhaUNvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9rYW1hZGEta2F3YWkuanMnOwppbXBvcnQgKiBhcyBiaXBhcnRpdGVDb21wdXRlIGZyb20gJy4uL2xheW91dHMvYmlwYXJ0aXRlLmpzJzsKaW1wb3J0ICogYXMgbXVsdGlwYXJ0aXRlQ29tcHV0ZSBmcm9tICcuLi9sYXlvdXRzL211bHRpcGFydGl0ZS5qcyc7CmltcG9ydCAqIGFzIGJmc0NvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9iZnMuanMnOwoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBNT0RVTEUgUkVHSVNUUlkgLSBNYXBzIG1vZHVsZSBwYXRocyB0byB0aGVpciBleHBvcnRzCi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCmNvbnN0IE1PRFVMRV9SRUdJU1RSWSA9IHsKICAvLyBOb2RlLWxldmVsIHN0YXRpc3RpY3MgKGFsbCBpbiBvbmUgZmlsZSkKICAnLi4vc3RhdGlzdGljcy9hbGdvcml0aG1zL25vZGUtc3RhdHMuanMnOiBub2RlU3RhdHNDb21wdXRlLAoKICAvLyBHcmFwaC1sZXZlbCBzdGF0aXN0aWNzCiAgJy4uL3N0YXRpc3RpY3MvYWxnb3JpdGhtcy9ncmFwaC1zdGF0cy5qcyc6IGdyYXBoU3RhdHNDb21wdXRlLAoKICAvLyBDb21tdW5pdHkKICAnLi4vY29tbXVuaXR5L2FsZ29yaXRobXMvbG91dmFpbi5qcyc6IGxvdXZhaW5Db21wdXRlLAoKICAvLyBMYXlvdXRzCiAgJy4uL2xheW91dHMvcmFuZG9tLmpzJzogcmFuZG9tQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9jaXJjdWxhci5qcyc6IGNpcmN1bGFyQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9zcGlyYWwuanMnOiBzcGlyYWxDb21wdXRlLAogICcuLi9sYXlvdXRzL3NoZWxsLmpzJzogc2hlbGxDb21wdXRlLAogICcuLi9sYXlvdXRzL3NwZWN0cmFsLmpzJzogc3BlY3RyYWxDb21wdXRlLAogICcuLi9sYXlvdXRzL2ZvcmNlLWRpcmVjdGVkLmpzJzogZm9yY2VEaXJlY3RlZENvbXB1dGUsCiAgJy4uL2xheW91dHMva2FtYWRhLWthd2FpLmpzJzoga2FtYWRhS2F3YWlDb21wdXRlLAogICcuLi9sYXlvdXRzL2JpcGFydGl0ZS5qcyc6IGJpcGFydGl0ZUNvbXB1dGUsCiAgJy4uL2xheW91dHMvbXVsdGlwYXJ0aXRlLmpzJzogbXVsdGlwYXJ0aXRlQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9iZnMuanMnOiBiZnNDb21wdXRlCn07CgovLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ci8vIFdPUktFUiBNRVNTQUdFIEhBTkRMRVIKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKLyoqCiAqIE1haW4gbWVzc2FnZSBoYW5kbGVyIC0gcmVjZWl2ZXMgdGFza3MgYW5kIGRlbGVnYXRlcyB0byBhbGdvcml0aG0gbW9kdWxlcwogKi8Kc2VsZi5vbm1lc3NhZ2UgPSBhc3luYyBmdW5jdGlvbihldmVudCkgewogIGNvbnN0IHsgaWQsIG1vZHVsZSwgZnVuY3Rpb25OYW1lLCBhcmdzID0gW10gfSA9IGV2ZW50LmRhdGE7CgogIHRyeSB7CiAgICAvLyBWYWxpZGF0ZSBtZXNzYWdlIGZvcm1hdAogICAgaWYgKCFtb2R1bGUgfHwgIWZ1bmN0aW9uTmFtZSkgewogICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdGFzazogbW9kdWxlIGFuZCBmdW5jdGlvbk5hbWUgYXJlIHJlcXVpcmVkJyk7CiAgICB9CgogICAgbG9nLmRlYnVnKCdQcm9jZXNzaW5nIHRhc2snLCB7CiAgICAgIGlkLAogICAgICBtb2R1bGUsCiAgICAgIGZ1bmN0aW9uTmFtZSwKICAgICAgYXJnc0xlbmd0aDogYXJncz8ubGVuZ3RoIHx8IDAKICAgIH0pOwoKICAgIC8vIENyZWF0ZSBwcm9ncmVzcyBjYWxsYmFjayB0aGF0IHJlcG9ydHMgYmFjayB0byBtYWluIHRocmVhZAogICAgY29uc3QgcHJvZ3Jlc3NDYWxsYmFjayA9IChwcm9ncmVzcykgPT4gewogICAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgICBpZCwKICAgICAgICBzdGF0dXM6ICdwcm9ncmVzcycsCiAgICAgICAgcHJvZ3Jlc3M6IE1hdGgubWluKE1hdGgubWF4KHByb2dyZXNzLCAwKSwgMSkgLy8gQ2xhbXAgdG8gWzAsIDFdCiAgICAgIH0pOwogICAgfTsKCiAgICAvLyBMb29rIHVwIGFsZ29yaXRobSBtb2R1bGUgZnJvbSByZWdpc3RyeQogICAgY29uc3QgYWxnb3JpdGhtTW9kdWxlID0gTU9EVUxFX1JFR0lTVFJZW21vZHVsZV07CgogICAgaWYgKCFhbGdvcml0aG1Nb2R1bGUpIHsKICAgICAgdGhyb3cgbmV3IEVycm9yKAogICAgICAgIGBNb2R1bGUgJyR7bW9kdWxlfScgbm90IGZvdW5kIGluIHJlZ2lzdHJ5LiBgICsKICAgICAgICBgQXZhaWxhYmxlIG1vZHVsZXM6ICR7T2JqZWN0LmtleXMoTU9EVUxFX1JFR0lTVFJZKS5qb2luKCcsICcpfWAKICAgICAgKTsKICAgIH0KCiAgICAvLyBHZXQgdGhlIGNvbXB1dGUgZnVuY3Rpb24KICAgIGNvbnN0IGNvbXB1dGVGdW5jdGlvbiA9IGFsZ29yaXRobU1vZHVsZVtmdW5jdGlvbk5hbWVdOwoKICAgIGlmICghY29tcHV0ZUZ1bmN0aW9uIHx8IHR5cGVvZiBjb21wdXRlRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHsKICAgICAgdGhyb3cgbmV3IEVycm9yKAogICAgICAgIGBGdW5jdGlvbiAnJHtmdW5jdGlvbk5hbWV9JyBub3QgZm91bmQgaW4gbW9kdWxlICcke21vZHVsZX0nLiBgICsKICAgICAgICBgQXZhaWxhYmxlIGZ1bmN0aW9uczogJHtPYmplY3Qua2V5cyhhbGdvcml0aG1Nb2R1bGUpLmpvaW4oJywgJyl9YAogICAgICApOwogICAgfQoKICAgIC8vIEV4ZWN1dGUgdGhlIGNvbXB1dGUgZnVuY3Rpb24KICAgIC8vIExhc3QgYXJnIGlzIGFsd2F5cyB0aGUgcHJvZ3Jlc3MgY2FsbGJhY2sKICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNvbXB1dGVGdW5jdGlvbiguLi5hcmdzLCBwcm9ncmVzc0NhbGxiYWNrKTsKCiAgICAvLyBTZW5kIHN1Y2Nlc3NmdWwgcmVzdWx0CiAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgaWQsCiAgICAgIHN0YXR1czogJ2NvbXBsZXRlJywKICAgICAgcmVzdWx0CiAgICB9KTsKCiAgfSBjYXRjaCAoZXJyb3IpIHsKICAgIC8vIFNlbmQgZXJyb3IKICAgIGxvZy5lcnJvcignVGFzayBmYWlsZWQnLCB7CiAgICAgIGlkLAogICAgICBlcnJvcjogZXJyb3IubWVzc2FnZSwKICAgICAgc3RhY2s6IGVycm9yLnN0YWNrCiAgICB9KTsKICAgIHNlbGYucG9zdE1lc3NhZ2UoewogICAgICBpZCwKICAgICAgc3RhdHVzOiAnZXJyb3InLAogICAgICBlcnJvcjogZXJyb3IubWVzc2FnZSB8fCAnVW5rbm93biBlcnJvcicsCiAgICAgIHN0YWNrOiBlcnJvci5zdGFjawogICAgfSk7CiAgfQp9OwoKLyoqCiAqIEhhbmRsZSB3b3JrZXIgZXJyb3JzCiAqLwpzZWxmLm9uZXJyb3IgPSBmdW5jdGlvbihlcnJvcikgewogIGxvZy5lcnJvcignV29ya2VyIGVycm9yJywgewogICAgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfHwgJ1dvcmtlciBlcnJvciBvY2N1cnJlZCcsCiAgICBzdGFjazogZXJyb3Iuc3RhY2sKICB9KTsKICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgIHN0YXR1czogJ2Vycm9yJywKICAgIGVycm9yOiBlcnJvci5tZXNzYWdlIHx8ICdXb3JrZXIgZXJyb3Igb2NjdXJyZWQnCiAgfSk7Cn07CgovLyBMb2cgd29ya2VyIGluaXRpYWxpemF0aW9uCmxvZy5pbmZvKCdJbml0aWFsaXplZCcsIHsgbW9kdWxlQ291bnQ6IE9iamVjdC5rZXlzKE1PRFVMRV9SRUdJU1RSWSkubGVuZ3RoIH0pOwo=", import.meta.url).href : typeof require < "u" ? require("path").join(__dirname, "network-worker.js") : "./network-worker.js";
  }
  /**
   * Initialize worker pool
   *
   * @returns {Promise<void>}
   * @throws {Error} If workers are not supported
   */
  async initialize() {
    if (!this.initialized) {
      if (!$.isSupported())
        throw new Error("Workers not supported in this environment");
      this.log.debug("Initializing worker pool", { maxWorkers: this.maxWorkers });
      try {
        for (let e = 0; e < this.maxWorkers; e++) {
          const t = await this.createWorker(e);
          this.workers.push(t), this.availableWorkers.push(t);
        }
        this.initialized = !0, this.log.info("Worker pool initialized successfully", { workerCount: this.maxWorkers });
      } catch (e) {
        throw this.log.error("Failed to initialize worker pool", {
          error: e.message,
          stack: e.stack
        }), await this.terminate(), e;
      }
    }
  }
  /**
   * Create a worker with message and error handlers
   * @private
   * @param {number} id - Worker ID for logging
   * @returns {WorkerAdapter} Configured worker
   */
  async createWorker(e) {
    const t = $.create(this.workerScript);
    return t.id = e, t.currentTaskId = null, t.cachedFunctions = /* @__PURE__ */ new Set(), t.tasksExecuted = 0, t.lastTaskTime = 0, t.onMessage((s) => {
      this.handleWorkerMessage(t, s);
    }), t.onError((s) => {
      this.handleWorkerError(t, s);
    }), this.log.debug("Worker created", { workerId: e }), t;
  }
  /**
   * Execute task on worker pool
   *
   * @param {Object} task - Task to execute
   * @param {string} task.type - Task type (algorithm name)
   * @param {Object} [options] - Execution options
   * @param {Function} [options.onProgress] - Progress callback (0-1)
   * @param {number} [options.timeout] - Task timeout in ms
   * @returns {Promise<any>} Task result
   *
   * @example
   * const result = await pool.execute({
   *   type: 'degree',
   *   graphData: { nodes: [...], edges: [...] },
   *   nodeIds: ['a', 'b', 'c']
   * }, {
   *   onProgress: (progress) => console.log(`${progress * 100}%`),
   *   timeout: 30000
   * });
   */
  async execute(e, t = {}) {
    if (!this.initialized)
      throw new Error("Worker pool not initialized. Call initialize() first.");
    return new Promise((s, o) => {
      const i = `task_${this.taskIdCounter++}`, r = { id: i, ...e }, a = t.timeout || this.taskTimeout, d = setTimeout(() => {
        this.handleTaskTimeout(i);
      }, a);
      this.activeTasks.set(i, {
        resolve: s,
        reject: o,
        onProgress: t.onProgress,
        timeoutId: d,
        startTime: Date.now(),
        task: r
        // Store task for affinity tracking
      });
      const g = this._selectWorker(r);
      g ? this.assignTask(g, r) : (this.taskQueue.push(r), this.log.debug("Task queued", { taskId: i, queueLength: this.taskQueue.length }));
    });
  }
  /**
   * Assign task to worker
   * @private
   * @param {WorkerAdapter} worker - Worker to assign to
   * @param {Object} task - Task to execute
   */
  assignTask(e, t) {
    e.currentTaskId = t.id, e.postMessage(t);
  }
  // ============================================================================
  // WORKER AFFINITY METHODS
  // ============================================================================
  /**
   * Generate affinity key from task
   * @private
   * @param {Object} task - Task with module and functionName
   * @returns {string|null} Affinity key or null if not applicable
   */
  _getAffinityKey(e) {
    return e && e.module && e.functionName ? `${e.module}:${e.functionName}` : null;
  }
  /**
   * Select optimal worker for task using affinity-aware algorithm
   * @private
   * @param {Object} task - Task to assign
   * @returns {WorkerAdapter|null} Selected worker or null if none available
   */
  _selectWorker(e) {
    if (this.availableWorkers.length === 0)
      return null;
    if (!this.enableAffinity) {
      const o = this.availableWorkers.pop();
      return this.log.debug("Worker selected (affinity disabled)", {
        workerId: o.id,
        taskId: e.id
      }), o;
    }
    const t = this._getAffinityKey(e);
    if (t) {
      const o = this.availableWorkers.find(
        (i) => i.cachedFunctions.has(t)
      );
      if (o)
        return this._recordAffinityHit(), this.log.debug("Worker selected via affinity", {
          workerId: o.id,
          taskId: e.id,
          affinityKey: t,
          cachedFunctions: Array.from(o.cachedFunctions)
        }), this._removeFromAvailable(o);
      this._recordAffinityMiss(), this.log.debug("No affinity match found", {
        taskId: e.id,
        affinityKey: t,
        availableWorkers: this.availableWorkers.length
      });
    }
    const s = this.availableWorkers.reduce(
      (o, i) => i.tasksExecuted < o.tasksExecuted ? i : o
    );
    return this.log.debug("Worker selected (least loaded)", {
      workerId: s.id,
      taskId: e.id,
      tasksExecuted: s.tasksExecuted,
      affinityKey: t || "none"
    }), this._removeFromAvailable(s);
  }
  /**
   * Remove worker from available pool and return it
   * @private
   * @param {WorkerAdapter} worker - Worker to remove
   * @returns {WorkerAdapter} The removed worker
   */
  _removeFromAvailable(e) {
    const t = this.availableWorkers.indexOf(e);
    return t > -1 && this.availableWorkers.splice(t, 1), e;
  }
  /**
   * Record affinity cache hit
   * @private
   */
  _recordAffinityHit() {
    this.affinityMetrics.hits++;
  }
  /**
   * Record affinity cache miss
   * @private
   */
  _recordAffinityMiss() {
    this.affinityMetrics.misses++;
  }
  /**
   * Update worker's affinity cache after task completion
   * @private
   * @param {WorkerAdapter} worker - Worker that completed task
   * @param {Object} task - Completed task
   */
  _updateWorkerAffinity(e, t) {
    const s = this._getAffinityKey(t);
    if (!s) return;
    const o = !e.cachedFunctions.has(s);
    if (e.cachedFunctions.add(s), e.tasksExecuted++, e.lastTaskTime = Date.now(), o && this.log.debug("Worker affinity cache updated", {
      workerId: e.id,
      affinityKey: s,
      cacheSize: e.cachedFunctions.size,
      tasksExecuted: e.tasksExecuted
    }), e.cachedFunctions.size > this.affinityCacheLimit) {
      const i = e.cachedFunctions.size;
      this._evictAffinityEntries(e), this.log.debug("Worker affinity cache evicted", {
        workerId: e.id,
        beforeSize: i,
        afterSize: e.cachedFunctions.size,
        limit: this.affinityCacheLimit
      });
    }
  }
  /**
   * Evict oldest entries from worker's affinity cache
   * @private
   * @param {WorkerAdapter} worker - Worker to evict entries from
   */
  _evictAffinityEntries(e) {
    const t = Array.from(e.cachedFunctions), s = t.slice(0, Math.floor(t.length / 2));
    s.forEach((o) => e.cachedFunctions.delete(o)), this.log.debug("Evicted affinity entries", {
      workerId: e.id,
      evicted: s.length,
      remaining: e.cachedFunctions.size
    });
  }
  // ============================================================================
  // END WORKER AFFINITY METHODS
  // ============================================================================
  /**
   * Handle message from worker
   * @private
   * @param {WorkerAdapter} worker - Worker that sent message
   * @param {Object} message - Message from worker
   */
  handleWorkerMessage(e, t) {
    const { id: s, status: o, result: i, progress: r, error: a } = t, d = this.activeTasks.get(s);
    if (!d) {
      this.log.warn("Received message for unknown task", { taskId: s });
      return;
    }
    if (o === "progress")
      d.onProgress && d.onProgress(r), this.log.debug("Task progress", { taskId: s, progress: Math.round(r * 100) });
    else if (o === "complete") {
      const g = Date.now() - d.startTime;
      this.log.debug("Task completed", { taskId: s, duration: g }), clearTimeout(d.timeoutId), d.resolve(i), d.task && this._updateWorkerAffinity(e, d.task), this.activeTasks.delete(s), this.freeWorker(e);
    } else o === "error" && (this.log.error("Task failed", { taskId: s, error: a }), clearTimeout(d.timeoutId), d.reject(new Error(a)), this.activeTasks.delete(s), this.freeWorker(e));
  }
  /**
   * Handle worker error
   * @private
   * @param {WorkerAdapter} worker - Worker that errored
   * @param {Error} error - Error object
   */
  handleWorkerError(e, t) {
    if (this.log.error("Worker error", {
      workerId: e.id,
      error: t.message,
      stack: t.stack
    }), e.currentTaskId) {
      const s = this.activeTasks.get(e.currentTaskId);
      s && (clearTimeout(s.timeoutId), s.reject(t), this.activeTasks.delete(e.currentTaskId));
    }
    this.restartWorker(e);
  }
  /**
   * Handle task timeout
   * @private
   * @param {string} taskId - Task that timed out
   */
  handleTaskTimeout(e) {
    const t = this.activeTasks.get(e);
    if (!t) return;
    this.log.warn("Task timed out", { taskId: e, timeout: this.taskTimeout }), t.reject(new Error(`Task timed out after ${this.taskTimeout}ms`)), this.activeTasks.delete(e);
    const s = this.workers.find((o) => o.currentTaskId === e);
    s && this.restartWorker(s);
  }
  /**
   * Free worker and assign next queued task
   * @private
   * @param {WorkerAdapter} worker - Worker to free
   */
  freeWorker(e) {
    if (e.currentTaskId = null, this.taskQueue.length > 0) {
      const t = this.taskQueue.shift();
      this.assignTask(e, t), this.log.debug("Task assigned from queue", { taskId: t.id, workerId: e.id });
    } else
      this.availableWorkers.push(e);
  }
  /**
   * Restart failed worker
   * @private
   * @param {WorkerAdapter} oldWorker - Worker to restart
   */
  async restartWorker(e) {
    const t = this.workers.indexOf(e);
    if (t !== -1) {
      this.log.debug("Restarting worker", { workerId: e.id });
      try {
        e.terminate();
        const s = await this.createWorker(e.id);
        this.workers[t] = s, this.availableWorkers.push(s), this.log.info("Worker restarted successfully", {
          workerId: e.id,
          lostAffinityEntries: e.cachedFunctions?.size || 0
        });
      } catch (s) {
        this.log.error("Failed to restart worker", {
          workerId: e.id,
          error: s.message,
          stack: s.stack
        }), this.workers.splice(t, 1);
      }
    }
  }
  /**
   * Wait for active tasks to complete
   *
   * @param {number} [timeout=5000] - Max time to wait in ms
   * @returns {Promise<void>}
   */
  async waitForActiveTasks(e = 5e3) {
    if (this.activeTasks.size !== 0)
      return this.log.debug("Waiting for active tasks", { taskCount: this.activeTasks.size, timeout: e }), new Promise((t) => {
        const s = Date.now(), o = setInterval(() => {
          (this.activeTasks.size === 0 || Date.now() - s > e) && (clearInterval(o), this.log.debug("Wait complete", { remainingTasks: this.activeTasks.size }), t());
        }, 100);
      });
  }
  /**
   * Terminate all workers and clean up
   *
   * @param {boolean} [force=false] - Force termination without waiting
   * @returns {Promise<void>}
   */
  async terminate(e = !1) {
    this.initialized && (this.log.info("Terminating worker pool", { force: e }), e || await this.waitForActiveTasks(5e3), this.activeTasks.forEach((t, s) => {
      clearTimeout(t.timeoutId), t.reject(new Error("Worker pool terminated"));
    }), this.activeTasks.clear(), this.workers.forEach((t) => {
      try {
        t.terminate();
      } catch (s) {
        this.log.error("Error terminating worker", {
          workerId: t.id,
          error: s.message
        });
      }
    }), this.workers = [], this.availableWorkers = [], this.taskQueue = [], this.initialized = !1, this.log.info("Worker pool terminated"));
  }
  /**
   * Get current pool status
   *
   * @returns {Object} Status information
   *
   * @example
   * const status = pool.getStatus();
   * console.log(`Workers: ${status.availableWorkers}/${status.totalWorkers}`);
   * console.log(`Queue: ${status.queuedTasks}, Active: ${status.activeTasks}`);
   */
  getStatus() {
    const e = this.getAffinityStats();
    return {
      initialized: this.initialized,
      totalWorkers: this.workers.length,
      availableWorkers: this.availableWorkers.length,
      busyWorkers: this.workers.length - this.availableWorkers.length,
      activeTasks: this.activeTasks.size,
      queuedTasks: this.taskQueue.length,
      // Affinity info
      affinity: {
        enabled: this.enableAffinity,
        cacheLimit: this.affinityCacheLimit,
        hitRate: e.hitRate
      }
    };
  }
  /**
   * Get detailed affinity statistics
   *
   * @returns {Object} Affinity metrics including per-worker cache info
   *
   * @example
   * const stats = pool.getAffinityStats();
   * console.log(`Affinity hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
   * console.log(`Hits: ${stats.hits}, Misses: ${stats.misses}`);
   */
  getAffinityStats() {
    const e = this.affinityMetrics.hits + this.affinityMetrics.misses;
    return {
      hits: this.affinityMetrics.hits,
      misses: this.affinityMetrics.misses,
      hitRate: e > 0 ? this.affinityMetrics.hits / e : 0,
      workerCaches: this.workers.map((t) => ({
        workerId: t.id,
        cachedFunctions: Array.from(t.cachedFunctions || []),
        tasksExecuted: t.tasksExecuted || 0
      }))
    };
  }
}
class H {
  constructor() {
    if (H.instance)
      return H.instance;
    this.workerPool = null, this.initialized = !1, this.initPromise = null, this.log = re({
      prefix: "WorkerManager",
      level: "info"
      // Can be overridden by verbose option
    }), H.instance = this;
  }
  /**
   * Initialize the worker pool
   *
   * @param {Object} [options={}] - Configuration options
   * @param {number} [options.maxWorkers] - Maximum number of workers (default: auto-detect CPU cores)
   * @param {string} [options.workerScript] - Path to worker script
   * @param {number} [options.taskTimeout=60000] - Default task timeout in ms
   * @param {boolean} [options.verbose=false] - Enable verbose logging
   * @param {boolean} [options.enableAffinity=true] - Enable worker affinity (route same algorithm to same worker)
   * @param {number} [options.affinityCacheLimit=50] - Max cached function keys per worker
   * @returns {Promise<void>}
   */
  async initialize(e = {}) {
    if (this.initPromise)
      return this.initPromise;
    if (this.initialized && this.workerPool)
      return Promise.resolve();
    this.initPromise = this._doInitialize(e);
    try {
      await this.initPromise;
    } finally {
      this.initPromise = null;
    }
  }
  /**
   * Internal initialization logic
   * @private
   */
  async _doInitialize(e) {
    const {
      maxWorkers: t,
      workerScript: s,
      taskTimeout: o = 6e4,
      verbose: i = !1,
      enableAffinity: r = !0,
      affinityCacheLimit: a = 50
    } = e;
    this.log.setLevel(i ? "debug" : "info");
    let d = s;
    if (!d)
      try {
        d = new URL("data:text/javascript;base64,LyoqCiAqIE5ldHdvcmsgV29ya2VyIC0gRXhlY3V0ZXMgY29tcHV0ZSBmdW5jdGlvbnMgZnJvbSBhbGdvcml0aG0gbW9kdWxlcwogKgogKiAqKkJ1bmRsZXItRnJpZW5kbHkgQXJjaGl0ZWN0dXJlOioqCiAqIC0gU3RhdGljYWxseSBpbXBvcnRzIGFsbCBhbGdvcml0aG0gbW9kdWxlcyB1cGZyb250CiAqIC0gQ3JlYXRlcyBhIHJlZ2lzdHJ5IHRoYXQgbWFwcyBtb2R1bGUgcGF0aHMgdG8gdGhlaXIgZXhwb3J0cwogKiAtIE1haW4gdGhyZWFkIHNlbmRzOiB7IGlkLCBtb2R1bGUsIGZ1bmN0aW9uTmFtZSwgYXJncyB9CiAqIC0gV29ya2VyIGxvb2tzIHVwIG1vZHVsZSBmcm9tIHJlZ2lzdHJ5IGFuZCBleGVjdXRlcyBmdW5jdGlvbgogKgogKiBUaGlzIGFwcHJvYWNoIHdvcmtzIHdpdGggYWxsIGJ1bmRsZXJzIChWaXRlLCBXZWJwYWNrLCBSb2xsdXApIGJlY2F1c2UKICogaW1wb3J0cyBhcmUga25vd24gYXQgYnVpbGQgdGltZS4KICoKICogQG1vZHVsZSBuZXR3b3JrLXdvcmtlcgogKi8KCmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJ0BndWluZXRpay9sb2dnZXInOwoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBTVEFUSUMgSU1QT1JUUyAtIEFsbCBhbGdvcml0aG0gbW9kdWxlcyBpbXBvcnRlZCB1cGZyb250Ci8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCi8vIENyZWF0ZSBsb2dnZXIgZm9yIHdvcmtlciAocnVucyBpbiBzZXBhcmF0ZSBjb250ZXh0LCBubyB3aW5kb3cubG9nRmlsdGVyKQpjb25zdCBsb2cgPSBjcmVhdGVMb2dnZXIoewogIHByZWZpeDogJ25ldHdvcmstd29ya2VyJywKICBsZXZlbDogJ2luZm8nIC8vIFdvcmtlcnMgZGVmYXVsdCB0byBpbmZvIGxldmVsCn0pOwoKLy8gU3RhdGlzdGljcyBhbGdvcml0aG1zIChub2RlLWxldmVsIGFuZCBncmFwaC1sZXZlbCkKaW1wb3J0ICogYXMgbm9kZVN0YXRzQ29tcHV0ZSBmcm9tICcuLi9zdGF0aXN0aWNzL2FsZ29yaXRobXMvbm9kZS1zdGF0cy5qcyc7CmltcG9ydCAqIGFzIGdyYXBoU3RhdHNDb21wdXRlIGZyb20gJy4uL3N0YXRpc3RpY3MvYWxnb3JpdGhtcy9ncmFwaC1zdGF0cy5qcyc7CgovLyBDb21tdW5pdHkgZGV0ZWN0aW9uIGFsZ29yaXRobXMKaW1wb3J0ICogYXMgbG91dmFpbkNvbXB1dGUgZnJvbSAnLi4vY29tbXVuaXR5L2FsZ29yaXRobXMvbG91dmFpbi5qcyc7CgovLyBMYXlvdXQgYWxnb3JpdGhtcwppbXBvcnQgKiBhcyByYW5kb21Db21wdXRlIGZyb20gJy4uL2xheW91dHMvcmFuZG9tLmpzJzsKaW1wb3J0ICogYXMgY2lyY3VsYXJDb21wdXRlIGZyb20gJy4uL2xheW91dHMvY2lyY3VsYXIuanMnOwppbXBvcnQgKiBhcyBzcGlyYWxDb21wdXRlIGZyb20gJy4uL2xheW91dHMvc3BpcmFsLmpzJzsKaW1wb3J0ICogYXMgc2hlbGxDb21wdXRlIGZyb20gJy4uL2xheW91dHMvc2hlbGwuanMnOwppbXBvcnQgKiBhcyBzcGVjdHJhbENvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9zcGVjdHJhbC5qcyc7CmltcG9ydCAqIGFzIGZvcmNlRGlyZWN0ZWRDb21wdXRlIGZyb20gJy4uL2xheW91dHMvZm9yY2UtZGlyZWN0ZWQuanMnOwppbXBvcnQgKiBhcyBrYW1hZGFLYXdhaUNvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9rYW1hZGEta2F3YWkuanMnOwppbXBvcnQgKiBhcyBiaXBhcnRpdGVDb21wdXRlIGZyb20gJy4uL2xheW91dHMvYmlwYXJ0aXRlLmpzJzsKaW1wb3J0ICogYXMgbXVsdGlwYXJ0aXRlQ29tcHV0ZSBmcm9tICcuLi9sYXlvdXRzL211bHRpcGFydGl0ZS5qcyc7CmltcG9ydCAqIGFzIGJmc0NvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9iZnMuanMnOwoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBNT0RVTEUgUkVHSVNUUlkgLSBNYXBzIG1vZHVsZSBwYXRocyB0byB0aGVpciBleHBvcnRzCi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCmNvbnN0IE1PRFVMRV9SRUdJU1RSWSA9IHsKICAvLyBOb2RlLWxldmVsIHN0YXRpc3RpY3MgKGFsbCBpbiBvbmUgZmlsZSkKICAnLi4vc3RhdGlzdGljcy9hbGdvcml0aG1zL25vZGUtc3RhdHMuanMnOiBub2RlU3RhdHNDb21wdXRlLAoKICAvLyBHcmFwaC1sZXZlbCBzdGF0aXN0aWNzCiAgJy4uL3N0YXRpc3RpY3MvYWxnb3JpdGhtcy9ncmFwaC1zdGF0cy5qcyc6IGdyYXBoU3RhdHNDb21wdXRlLAoKICAvLyBDb21tdW5pdHkKICAnLi4vY29tbXVuaXR5L2FsZ29yaXRobXMvbG91dmFpbi5qcyc6IGxvdXZhaW5Db21wdXRlLAoKICAvLyBMYXlvdXRzCiAgJy4uL2xheW91dHMvcmFuZG9tLmpzJzogcmFuZG9tQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9jaXJjdWxhci5qcyc6IGNpcmN1bGFyQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9zcGlyYWwuanMnOiBzcGlyYWxDb21wdXRlLAogICcuLi9sYXlvdXRzL3NoZWxsLmpzJzogc2hlbGxDb21wdXRlLAogICcuLi9sYXlvdXRzL3NwZWN0cmFsLmpzJzogc3BlY3RyYWxDb21wdXRlLAogICcuLi9sYXlvdXRzL2ZvcmNlLWRpcmVjdGVkLmpzJzogZm9yY2VEaXJlY3RlZENvbXB1dGUsCiAgJy4uL2xheW91dHMva2FtYWRhLWthd2FpLmpzJzoga2FtYWRhS2F3YWlDb21wdXRlLAogICcuLi9sYXlvdXRzL2JpcGFydGl0ZS5qcyc6IGJpcGFydGl0ZUNvbXB1dGUsCiAgJy4uL2xheW91dHMvbXVsdGlwYXJ0aXRlLmpzJzogbXVsdGlwYXJ0aXRlQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9iZnMuanMnOiBiZnNDb21wdXRlCn07CgovLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ci8vIFdPUktFUiBNRVNTQUdFIEhBTkRMRVIKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKLyoqCiAqIE1haW4gbWVzc2FnZSBoYW5kbGVyIC0gcmVjZWl2ZXMgdGFza3MgYW5kIGRlbGVnYXRlcyB0byBhbGdvcml0aG0gbW9kdWxlcwogKi8Kc2VsZi5vbm1lc3NhZ2UgPSBhc3luYyBmdW5jdGlvbihldmVudCkgewogIGNvbnN0IHsgaWQsIG1vZHVsZSwgZnVuY3Rpb25OYW1lLCBhcmdzID0gW10gfSA9IGV2ZW50LmRhdGE7CgogIHRyeSB7CiAgICAvLyBWYWxpZGF0ZSBtZXNzYWdlIGZvcm1hdAogICAgaWYgKCFtb2R1bGUgfHwgIWZ1bmN0aW9uTmFtZSkgewogICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdGFzazogbW9kdWxlIGFuZCBmdW5jdGlvbk5hbWUgYXJlIHJlcXVpcmVkJyk7CiAgICB9CgogICAgbG9nLmRlYnVnKCdQcm9jZXNzaW5nIHRhc2snLCB7CiAgICAgIGlkLAogICAgICBtb2R1bGUsCiAgICAgIGZ1bmN0aW9uTmFtZSwKICAgICAgYXJnc0xlbmd0aDogYXJncz8ubGVuZ3RoIHx8IDAKICAgIH0pOwoKICAgIC8vIENyZWF0ZSBwcm9ncmVzcyBjYWxsYmFjayB0aGF0IHJlcG9ydHMgYmFjayB0byBtYWluIHRocmVhZAogICAgY29uc3QgcHJvZ3Jlc3NDYWxsYmFjayA9IChwcm9ncmVzcykgPT4gewogICAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgICBpZCwKICAgICAgICBzdGF0dXM6ICdwcm9ncmVzcycsCiAgICAgICAgcHJvZ3Jlc3M6IE1hdGgubWluKE1hdGgubWF4KHByb2dyZXNzLCAwKSwgMSkgLy8gQ2xhbXAgdG8gWzAsIDFdCiAgICAgIH0pOwogICAgfTsKCiAgICAvLyBMb29rIHVwIGFsZ29yaXRobSBtb2R1bGUgZnJvbSByZWdpc3RyeQogICAgY29uc3QgYWxnb3JpdGhtTW9kdWxlID0gTU9EVUxFX1JFR0lTVFJZW21vZHVsZV07CgogICAgaWYgKCFhbGdvcml0aG1Nb2R1bGUpIHsKICAgICAgdGhyb3cgbmV3IEVycm9yKAogICAgICAgIGBNb2R1bGUgJyR7bW9kdWxlfScgbm90IGZvdW5kIGluIHJlZ2lzdHJ5LiBgICsKICAgICAgICBgQXZhaWxhYmxlIG1vZHVsZXM6ICR7T2JqZWN0LmtleXMoTU9EVUxFX1JFR0lTVFJZKS5qb2luKCcsICcpfWAKICAgICAgKTsKICAgIH0KCiAgICAvLyBHZXQgdGhlIGNvbXB1dGUgZnVuY3Rpb24KICAgIGNvbnN0IGNvbXB1dGVGdW5jdGlvbiA9IGFsZ29yaXRobU1vZHVsZVtmdW5jdGlvbk5hbWVdOwoKICAgIGlmICghY29tcHV0ZUZ1bmN0aW9uIHx8IHR5cGVvZiBjb21wdXRlRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHsKICAgICAgdGhyb3cgbmV3IEVycm9yKAogICAgICAgIGBGdW5jdGlvbiAnJHtmdW5jdGlvbk5hbWV9JyBub3QgZm91bmQgaW4gbW9kdWxlICcke21vZHVsZX0nLiBgICsKICAgICAgICBgQXZhaWxhYmxlIGZ1bmN0aW9uczogJHtPYmplY3Qua2V5cyhhbGdvcml0aG1Nb2R1bGUpLmpvaW4oJywgJyl9YAogICAgICApOwogICAgfQoKICAgIC8vIEV4ZWN1dGUgdGhlIGNvbXB1dGUgZnVuY3Rpb24KICAgIC8vIExhc3QgYXJnIGlzIGFsd2F5cyB0aGUgcHJvZ3Jlc3MgY2FsbGJhY2sKICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNvbXB1dGVGdW5jdGlvbiguLi5hcmdzLCBwcm9ncmVzc0NhbGxiYWNrKTsKCiAgICAvLyBTZW5kIHN1Y2Nlc3NmdWwgcmVzdWx0CiAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgaWQsCiAgICAgIHN0YXR1czogJ2NvbXBsZXRlJywKICAgICAgcmVzdWx0CiAgICB9KTsKCiAgfSBjYXRjaCAoZXJyb3IpIHsKICAgIC8vIFNlbmQgZXJyb3IKICAgIGxvZy5lcnJvcignVGFzayBmYWlsZWQnLCB7CiAgICAgIGlkLAogICAgICBlcnJvcjogZXJyb3IubWVzc2FnZSwKICAgICAgc3RhY2s6IGVycm9yLnN0YWNrCiAgICB9KTsKICAgIHNlbGYucG9zdE1lc3NhZ2UoewogICAgICBpZCwKICAgICAgc3RhdHVzOiAnZXJyb3InLAogICAgICBlcnJvcjogZXJyb3IubWVzc2FnZSB8fCAnVW5rbm93biBlcnJvcicsCiAgICAgIHN0YWNrOiBlcnJvci5zdGFjawogICAgfSk7CiAgfQp9OwoKLyoqCiAqIEhhbmRsZSB3b3JrZXIgZXJyb3JzCiAqLwpzZWxmLm9uZXJyb3IgPSBmdW5jdGlvbihlcnJvcikgewogIGxvZy5lcnJvcignV29ya2VyIGVycm9yJywgewogICAgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfHwgJ1dvcmtlciBlcnJvciBvY2N1cnJlZCcsCiAgICBzdGFjazogZXJyb3Iuc3RhY2sKICB9KTsKICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgIHN0YXR1czogJ2Vycm9yJywKICAgIGVycm9yOiBlcnJvci5tZXNzYWdlIHx8ICdXb3JrZXIgZXJyb3Igb2NjdXJyZWQnCiAgfSk7Cn07CgovLyBMb2cgd29ya2VyIGluaXRpYWxpemF0aW9uCmxvZy5pbmZvKCdJbml0aWFsaXplZCcsIHsgbW9kdWxlQ291bnQ6IE9iamVjdC5rZXlzKE1PRFVMRV9SRUdJU1RSWSkubGVuZ3RoIH0pOwo=", import.meta.url).href;
      } catch {
        d = "/graph-js/src/compute/network-worker.js", this.log.warn("Could not resolve worker path from import.meta.url, using fallback", { workerPath: d });
      }
    if (!$.isSupported())
      throw new Error(
        "Web Workers are not supported in this environment. This library requires Web Worker support (browser) or Worker Threads (Node.js)."
      );
    this.workerPool = new ct({
      maxWorkers: t || this._getDefaultWorkerCount(),
      workerScript: d,
      taskTimeout: o,
      verbose: i,
      enableAffinity: r,
      affinityCacheLimit: a
    }), await this.workerPool.initialize(), this.initialized = !0, this.log.info("Initialized successfully", {
      workerCount: this.workerPool.maxWorkers
    });
  }
  /**
   * Get default worker count based on CPU cores
   * @private
   */
  _getDefaultWorkerCount() {
    if (typeof navigator < "u" && navigator.hardwareConcurrency)
      return navigator.hardwareConcurrency;
    try {
      return require("os").cpus().length;
    } catch {
      return 4;
    }
  }
  /**
   * Execute a task in the worker pool
   *
   * @param {Object} task - Task configuration
   * @param {string} task.type - Task type (algorithm name)
   * @param {Object} task.graphData - Serialized graph data
   * @param {Object} [task.options] - Algorithm-specific options
   * @param {Object} [execOptions={}] - Execution options
   * @param {Function} [execOptions.onProgress] - Progress callback
   * @param {number} [execOptions.timeout] - Task timeout override
   * @returns {Promise<any>} Task result
   */
  async execute(e, t = {}) {
    return this.initialized || await this.initialize(), this.workerPool.execute(e, t);
  }
  /**
   * Serialize a graph for transfer to workers
   * Minimizes data transfer by only sending necessary information
   *
   * @param {Graph} graph - Graph to serialize
   * @returns {Object} Serialized graph data
   */
  serializeGraph(e) {
    return {
      nodes: Array.from(e.nodes),
      edges: e.edges.map((t) => ({
        source: t.u,
        target: t.v,
        weight: t.weight
      }))
    };
  }
  /**
   * Get current worker pool status
   *
   * @returns {Object|null} Worker pool status or null if not initialized
   */
  getStatus() {
    return this.workerPool ? this.workerPool.getStatus() : null;
  }
  /**
   * Terminate the worker pool and cleanup resources
   *
   * @param {boolean} [force=false] - Force immediate termination
   * @returns {Promise<void>}
   */
  async terminate(e = !1) {
    this.workerPool && (await this.workerPool.terminate(e), this.workerPool = null, this.initialized = !1);
  }
  /**
   * Reset the singleton instance (mainly for testing)
   * @private
   */
  static reset() {
    H.instance && (H.instance.terminate(!0), H.instance = null);
  }
}
H.instance = null;
const ee = new H();
class L {
  /**
   * Create a statistic algorithm
   *
   * @param {string} name - Algorithm identifier (e.g., 'degree', 'closeness')
   * @param {string} description - Human-readable description
   * @param {string} scope - Either 'node' for per-node stats or 'graph' for graph-level stats
   * @param {Object} computeConfig - Compute function configuration
   * @param {string} computeConfig.module - Module path containing compute function
   * @param {string} computeConfig.functionName - Name of compute function to call
   */
  constructor(e, t = "", s = "node", o = null) {
    if (new.target === L)
      throw new Error("StatisticAlgorithm is abstract and cannot be instantiated directly");
    if (s !== "node" && s !== "graph")
      throw new Error(`Scope must be 'node' or 'graph', got: ${s}`);
    if (!o || !o.module || !o.functionName)
      throw new Error("computeConfig with module and functionName is required");
    this.name = e, this.description = t, this.scope = s, this.computeConfig = o, this.options = {};
  }
  /**
   * Calculate the statistic for a graph.
   * Delegates computation to web workers for performance.
   *
   * **ASYNC**: All calculations are asynchronous
   *
   * @param {Graph} graph - The graph to analyze
   * @param {Array<string>} [nodeIds=null] - Optional subset of nodes to calculate (for node-level stats)
   * @param {Object} [execOptions={}] - Execution options
   * @param {Function} [execOptions.onProgress] - Progress callback (0-1)
   * @param {number} [execOptions.timeout] - Task timeout override
   * @returns {Promise<Object|number>} For node-level: { nodeId: value }, For graph-level: single number
   */
  async calculate(e, t = null, s = {}) {
    const o = ee.serializeGraph(e), i = {
      module: this.computeConfig.module,
      functionName: this.computeConfig.functionName,
      args: [o, t, this.options]
    };
    return await ee.execute(i, s);
  }
  /**
   * Get algorithm metadata
   *
   * @returns {Object} Algorithm information
   */
  getInfo() {
    return {
      name: this.name,
      description: this.description,
      scope: this.scope
    };
  }
  /**
   * Check if this is a node-level statistic
   *
   * @returns {boolean}
   */
  isNodeLevel() {
    return this.scope === "node";
  }
  /**
   * Check if this is a graph-level statistic
   *
   * @returns {boolean}
   */
  isGraphLevel() {
    return this.scope === "graph";
  }
}
class lt {
  /**
   * Creates a new empty graph.
   */
  constructor() {
    this.nodes = /* @__PURE__ */ new Set(), this.edges = [], this.adjacencyMap = /* @__PURE__ */ new Map();
  }
  /**
   * Add a single node to the graph.
   *
   * @param {string|number} node - Node identifier to add
   * @returns {Graph} The graph instance for chaining
   * @example
   * graph.addNode('A');
   * graph.addNode(42);
   */
  addNode(e) {
    return this.nodes.add(e), this;
  }
  /**
   * Add multiple nodes to the graph.
   *
   * @param {Array<string|number>} nodes - Array of node identifiers to add
   * @returns {Graph} The graph instance for chaining
   * @example
   * graph.addNodesFrom(['node1', 'node2', 'node3']);
   */
  addNodesFrom(e) {
    return e.forEach((t) => this.nodes.add(t)), this;
  }
  /**
   * Remove a node and all its associated edges from the graph.
   * Time complexity: O(V + E) in worst case where V is vertices and E is edges.
   *
   * @param {string|number} node - Node identifier to remove
   * @returns {Graph} The graph instance for chaining
   * @throws {Error} If node does not exist
   * @example
   * graph.addNode('A');
   * graph.addEdge('A', 'B', 1);
   * graph.removeNode('A'); // Removes 'A' and edge A-B
   */
  removeNode(e) {
    if (!this.nodes.has(e))
      throw new Error(`Node '${e}' does not exist in the graph`);
    return this.nodes.delete(e), this.edges = this.edges.filter((t) => t.u !== e && t.v !== e), this.adjacencyMap.has(e) && (Array.from(this.adjacencyMap.get(e).keys()).forEach((s) => {
      this.adjacencyMap.has(s) && this.adjacencyMap.get(s).delete(e);
    }), this.adjacencyMap.delete(e)), this;
  }
  /**
   * Check if a node exists in the graph.
   *
   * @param {string|number} node - Node identifier to check
   * @returns {boolean} True if node exists, false otherwise
   * @example
   * graph.addNode('A');
   * console.log(graph.hasNode('A')); // true
   * console.log(graph.hasNode('Z')); // false
   */
  hasNode(e) {
    return this.nodes.has(e);
  }
  /**
   * Add multiple edges to the graph from a list of edge tuples.
   *
   * @param {Array<Array<string|number|number>>} edgeList - Array of [source, target, weight?] tuples
   * @returns {Graph} The graph instance for chaining
   * @example
   * graph.addEdgesFrom([
   *   ['A', 'B', 2],
   *   ['B', 'C', 1.5],
   *   ['C', 'D'] // weight defaults to 1
   * ]);
   */
  addEdgesFrom(e) {
    return e.forEach(([t, s, o = 1]) => {
      this.addEdge(t, s, o);
    }), this;
  }
  /**
   * Add a weighted edge between two nodes.
   * Creates an undirected connection (bidirectional).
   * Automatically adds nodes if they don't exist.
   *
   * @param {string|number} source - Source node identifier
   * @param {string|number} target - Target node identifier
   * @param {number} [weight=1] - Edge weight (default: 1)
   * @returns {Graph} The graph instance for chaining
   * @example
   * graph.addEdge('A', 'B', 2.5);
   */
  addEdge(e, t, s = 1) {
    this.nodes.add(e), this.nodes.add(t);
    const o = { u: e, v: t, weight: s };
    return this.edges.push(o), this.adjacencyMap.has(e) || this.adjacencyMap.set(e, /* @__PURE__ */ new Map()), this.adjacencyMap.has(t) || this.adjacencyMap.set(t, /* @__PURE__ */ new Map()), this.adjacencyMap.get(e).set(t, s), this.adjacencyMap.get(t).set(e, s), this;
  }
  /**
   * Get all neighbors (adjacent nodes) of a given node.
   * Time complexity: O(1) lookup + O(k) where k is number of neighbors.
   *
   * @param {string|number} node - The node identifier
   * @returns {Array<string|number>} Array of neighbor node identifiers (empty if node not found)
   * @example
   * graph.addEdge('A', 'B');
   * graph.addEdge('A', 'C');
   * console.log(graph.getNeighbors('A')); // ['B', 'C']
   */
  getNeighbors(e) {
    return this.adjacencyMap.has(e) ? Array.from(this.adjacencyMap.get(e).keys()) : [];
  }
  /**
   * Get all edges in the graph.
   *
   * @returns {Array<{u: string|number, v: string|number, weight: number}>} Array of edge objects
   * @example
   * const edges = graph.getAllEdges();
   * edges.forEach(edge => console.log(edge.u, '->', edge.v, 'weight:', edge.weight));
   */
  getAllEdges() {
    return this.edges;
  }
  /**
   * Get all nodes in the graph as an array.
   *
   * @returns {Array<string|number>} Array of all node identifiers
   * @example
   * const nodes = graph.getNodeList();
   * console.log(`Graph has ${nodes.length} nodes`);
   */
  getNodeList() {
    return Array.from(this.nodes);
  }
  /**
   * Get the number of nodes in the graph.
   * Time complexity: O(1)
   *
   * @returns {number} Number of nodes
   * @example
   * graph.addNodesFrom(['A', 'B', 'C']);
   * console.log(graph.numberOfNodes()); // 3
   */
  numberOfNodes() {
    return this.nodes.size;
  }
  /**
   * Get the number of edges in the graph.
   * Time complexity: O(1)
   *
   * @returns {number} Number of edges
   * @example
   * graph.addEdge('A', 'B');
   * graph.addEdge('B', 'C');
   * console.log(graph.numberOfEdges()); // 2
   */
  numberOfEdges() {
    return this.edges.length;
  }
  /**
   * Remove an edge between two nodes.
   * Works for both (source, target) and (target, source) order.
   *
   * @param {string|number} source - Source node identifier
   * @param {string|number} target - Target node identifier
   * @returns {Graph} The graph instance for chaining
   * @throws {Error} If edge does not exist
   * @example
   * graph.addEdge('A', 'B', 1);
   * graph.removeEdge('A', 'B');
   */
  removeEdge(e, t) {
    const s = this.edges.findIndex(
      (o) => o.u === e && o.v === t || o.u === t && o.v === e
    );
    if (s === -1)
      throw new Error(`Edge between '${e}' and '${t}' does not exist`);
    return this.edges.splice(s, 1), this.adjacencyMap.has(e) && this.adjacencyMap.get(e).delete(t), this.adjacencyMap.has(t) && this.adjacencyMap.get(t).delete(e), this;
  }
  /**
   * Check if an edge exists between two nodes.
   *
   * @param {string|number} source - Source node identifier
   * @param {string|number} target - Target node identifier
   * @returns {boolean} True if edge exists, false otherwise
   * @example
   * graph.addEdge('A', 'B');
   * console.log(graph.hasEdge('A', 'B')); // true
   * console.log(graph.hasEdge('B', 'A')); // true (undirected)
   * console.log(graph.hasEdge('A', 'C')); // false
   */
  hasEdge(e, t) {
    return this.adjacencyMap.has(e) && this.adjacencyMap.get(e).has(t);
  }
  /**
   * Get the weight of an edge between two nodes.
   *
   * @param {string|number} source - Source node identifier
   * @param {string|number} target - Target node identifier
   * @returns {number|null} Edge weight, or null if edge doesn't exist
   * @example
   * graph.addEdge('A', 'B', 2.5);
   * console.log(graph.getEdgeWeight('A', 'B')); // 2.5
   */
  getEdgeWeight(e, t) {
    return this.hasEdge(e, t) ? this.adjacencyMap.get(e).get(t) : null;
  }
  /**
   * Update the weight of an existing edge.
   *
   * @param {string|number} source - Source node identifier
   * @param {string|number} target - Target node identifier
   * @param {number} weight - New weight value
   * @returns {Graph} The graph instance for chaining
   * @throws {Error} If edge does not exist
   * @example
   * graph.addEdge('A', 'B', 1);
   * graph.updateEdgeWeight('A', 'B', 2.5);
   */
  updateEdgeWeight(e, t, s) {
    if (!this.hasEdge(e, t))
      throw new Error(`Edge between '${e}' and '${t}' does not exist`);
    this.adjacencyMap.get(e).set(t, s), this.adjacencyMap.get(t).set(e, s);
    const o = this.edges.find(
      (i) => i.u === e && i.v === t || i.u === t && i.v === e
    );
    return o && (o.weight = s), this;
  }
  /**
   * Get degree (number of neighbors) of a node.
   *
   * @param {string|number} node - Node identifier
   * @returns {number} Degree of the node (0 if node doesn't exist)
   * @example
   * graph.addEdge('A', 'B');
   * graph.addEdge('A', 'C');
   * console.log(graph.degree('A')); // 2
   */
  degree(e) {
    return this.adjacencyMap.has(e) ? this.adjacencyMap.get(e).size : 0;
  }
  /**
   * Clear all nodes and edges from the graph.
   *
   * @returns {Graph} The graph instance for chaining
   * @example
   * graph.addNode('A');
   * graph.clear();
   * console.log(graph.numberOfNodes()); // 0
   */
  clear() {
    return this.nodes.clear(), this.edges = [], this.adjacencyMap.clear(), this;
  }
}
const K = re({
  prefix: "compute-utils",
  level: "info"
  // Default to info, can be verbose in debug builds
});
function N(n) {
  K.debug("Starting reconstruction", {
    isObject: n && typeof n == "object",
    hasNodes: n && "nodes" in n,
    hasEdges: n && "edges" in n,
    graphDataKeys: n ? Object.keys(n) : "N/A"
  });
  const e = new lt();
  if (!n || typeof n != "object")
    return K.error("Invalid graphData passed to reconstructGraph", { graphData: n }), e;
  if (n.nodes !== void 0 && n.nodes !== null) {
    K.debug("Processing nodes", {
      type: typeof n.nodes,
      isArray: Array.isArray(n.nodes),
      length: Array.isArray(n.nodes) ? n.nodes.length : "N/A"
    });
    try {
      let t;
      if (Array.isArray(n.nodes))
        t = n.nodes;
      else if (n.nodes[Symbol.iterator])
        t = Array.from(n.nodes);
      else
        throw new Error(`nodes is not iterable: ${typeof n.nodes}`);
      K.debug("Node array created", { length: t.length }), t.forEach((s) => {
        e.addNode(s);
      }), K.debug("Nodes added successfully", {
        type: typeof e.nodes,
        size: e.nodes.size
      });
    } catch (t) {
      throw K.error("Error adding nodes", {
        error: t.message,
        stack: t.stack,
        nodesValue: n.nodes,
        nodesType: typeof n.nodes,
        nodesConstructor: n.nodes?.constructor?.name
      }), new Error(`Failed to reconstruct nodes: ${t.message}`);
    }
  } else
    K.warn("No nodes found in graphData");
  if (n.edges !== void 0 && n.edges !== null) {
    K.debug("Processing edges", {
      type: typeof n.edges,
      isArray: Array.isArray(n.edges),
      length: Array.isArray(n.edges) ? n.edges.length : "N/A"
    });
    try {
      let t;
      if (Array.isArray(n.edges))
        t = n.edges;
      else if (n.edges[Symbol.iterator])
        t = Array.from(n.edges);
      else
        throw new Error(`edges is not iterable: ${typeof n.edges}`);
      K.debug("Edge array created", { length: t.length }), t.forEach((s) => {
        const o = s.source !== void 0 ? s.source : s.u, i = s.target !== void 0 ? s.target : s.v, r = s.weight || 1;
        o !== void 0 && i !== void 0 && e.addEdge(o, i, r);
      }), K.debug("Edges added successfully");
    } catch (t) {
      throw K.error("Error adding edges", {
        error: t.message,
        stack: t.stack,
        edgesValue: n.edges,
        edgesType: typeof n.edges
      }), new Error(`Failed to reconstruct edges: ${t.message}`);
    }
  } else
    K.warn("No edges found in graphData");
  return K.debug("Reconstruction complete", {
    nodes: e.nodes.size,
    edges: e.edges.length
  }), e;
}
function y(n, e) {
  n && typeof n == "function" && n(Math.min(Math.max(e, 0), 1));
}
function dt(n, e) {
  const t = /* @__PURE__ */ new Map([[e, 0]]), s = /* @__PURE__ */ new Map([[e, 1]]), o = /* @__PURE__ */ new Map(), i = [e], r = [];
  for (; i.length > 0; ) {
    const a = i.shift();
    r.push(a);
    const d = n.getNeighbors(a), g = t.get(a);
    d.forEach((l) => {
      t.has(l) || (t.set(l, g + 1), i.push(l)), t.get(l) === g + 1 && (s.set(l, (s.get(l) || 0) + s.get(a)), o.has(l) || o.set(l, []), o.get(l).push(a));
    });
  }
  return { distance: t, pathCount: s, predecessors: o, stack: r };
}
function Me(n, e) {
  const t = /* @__PURE__ */ new Map(), s = [e], o = /* @__PURE__ */ new Set([e]);
  for (t.set(e, 0); s.length > 0; ) {
    const i = s.shift(), r = t.get(i);
    for (const a of n.getNeighbors(i))
      o.has(a) || (o.add(a), s.push(a), t.set(a, r + 1));
  }
  return t;
}
function Ne(n, e) {
  const t = n.getNeighbors(e), s = t.length;
  if (s < 2)
    return 0;
  let o = 0;
  for (let i = 0; i < t.length; i++)
    for (let r = i + 1; r < t.length; r++)
      n.hasEdge(t[i], t[r]) && o++;
  return 2 * o / (s * (s - 1));
}
function ht(n, e) {
  const t = n.getNeighbors(e);
  let s = 0;
  for (let o = 0; o < t.length; o++)
    for (let i = o + 1; i < t.length; i++)
      n.hasEdge(t[o], t[i]) && s++;
  return s;
}
function O(n) {
  const e = Math.sqrt(
    Object.values(n).reduce((t, s) => t + s * s, 0)
  );
  return e > 0 && Object.keys(n).forEach((t) => {
    n[t] /= e;
  }), n;
}
function Le(n, e) {
  const t = Object.keys(n);
  let s = 0;
  for (const o of t)
    s += Math.abs((n[o] || 0) - (e[o] || 0));
  return s;
}
class gt extends L {
  constructor() {
    super("degree", "Number of connections per node", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "degreeCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class ut extends L {
  constructor(e = {}) {
    super("closeness", "Average distance to all other nodes (inverted)", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "closenessCompute"
    }), this.options = {
      normalized: e.normalized !== !1
    };
  }
  // calculate() inherited from base class - delegates to worker!
}
class mt extends L {
  constructor(e = {}) {
    super("ego-density", "Density of connections among neighbors", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "egoDensityCompute"
    }), this.options = {
      radius: e.radius || 1
    };
  }
  // calculate() inherited from base class - delegates to worker!
}
class ft extends L {
  constructor() {
    super("betweenness", "Frequency on shortest paths between other nodes", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "betweennessCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class yt extends L {
  constructor() {
    super("clustering", "Local clustering coefficient", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "clusteringCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class pt extends L {
  constructor(e = {}) {
    super("eigenvector", "Importance based on neighbor importance", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "eigenvectorCompute"
    }), this.options = {
      maxIter: e.maxIter || 100,
      tolerance: e.tolerance || 1e-6
    };
  }
  // calculate() inherited from base class - delegates to worker!
}
class bt extends L {
  constructor(e = {}) {
    super("pagerank", "PageRank importance score with damping", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "pageRankCompute"
    }), this.options = {
      dampingFactor: e.dampingFactor ?? 0.85,
      maxIter: e.maxIter ?? 100,
      tolerance: e.tolerance ?? 1e-6
    };
  }
  // calculate() inherited from base class - delegates to worker!
}
class It extends L {
  constructor(e = {}) {
    super("eigenvector-laplacian", "X,Y coordinates from Laplacian eigenvectors", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "eigenvectorLaplacianCompute"
    }), this.options = {
      maxIter: e.maxIter || 100,
      tolerance: e.tolerance || 1e-6
    };
  }
  // calculate() inherited from base class - delegates to worker!
}
class Ct extends L {
  constructor() {
    super("cliques", "Number of maximal cliques per node", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "cliquesCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
async function wt(n, e, t, s) {
  const o = N(n), i = e || Array.from(o.nodes), r = {};
  return i.forEach((a, d) => {
    r[a] = o.degree(a), d % 100 === 0 && y(s, d / i.length);
  }), y(s, 1), r;
}
async function vt(n, e, t, s) {
  const o = N(n), i = e || Array.from(o.nodes), r = Array.from(o.nodes), a = {};
  r.forEach((l) => {
    a[l] = 0;
  }), i.forEach((l, c) => {
    const h = dt(o, l);
    At(a, h, r, l), c % Math.max(1, Math.floor(i.length / 10)) === 0 && y(s, c / i.length);
  });
  const d = r.length, g = d > 2 ? 2 / ((d - 1) * (d - 2)) : 1;
  return r.forEach((l) => {
    a[l] *= g;
  }), y(s, 1), a;
}
function At(n, e, t, s) {
  const { pathCount: o, predecessors: i, stack: r } = e, a = /* @__PURE__ */ new Map();
  for (t.forEach((d) => {
    a.set(d, 0);
  }); r.length > 0; ) {
    const d = r.pop();
    (i.get(d) || []).forEach((l) => {
      const c = o.get(l) / o.get(d) * (1 + a.get(d));
      a.set(l, a.get(l) + c);
    }), d !== s && (n[d] += a.get(d));
  }
}
async function Gt(n, e, t, s) {
  const o = N(n), i = e || Array.from(o.nodes), r = {};
  return i.forEach((a, d) => {
    r[a] = Ne(o, a), d % 100 === 0 && y(s, d / i.length);
  }), y(s, 1), r;
}
async function Tt(n, e, t, s) {
  const o = N(n), { maxIter: i = 100, tolerance: r = 1e-6 } = t || {}, a = Array.from(o.nodes), d = a.length;
  let g = {};
  a.forEach((l) => {
    g[l] = 1 / d;
  });
  for (let l = 0; l < i; l++) {
    const c = {};
    a.forEach((u) => {
      c[u] = 0;
    }), a.forEach((u) => {
      o.getNeighbors(u).forEach((b) => {
        const v = o.adjacencyMap.get(u).get(b);
        c[b] += g[u] * v;
      });
    }), O(c);
    const h = Le(c, g);
    if (g = c, l % 10 === 0 && y(s, l / i), h < r)
      break;
  }
  return y(s, 1), g;
}
async function Pt(n, e, t, s) {
  const o = N(n), { dampingFactor: i = 0.85, maxIter: r = 100, tolerance: a = 1e-6 } = t || {}, d = Array.from(o.nodes), g = d.length;
  if (g === 0)
    return y(s, 1), {};
  let l = {};
  d.forEach((b) => {
    l[b] = 1 / g;
  });
  const c = {};
  d.forEach((b) => {
    c[b] = o.getNeighbors(b).length;
  });
  const h = d.filter((b) => c[b] === 0), u = (1 - i) / g;
  for (let b = 0; b < r; b++) {
    const v = {};
    let C = 0;
    h.forEach((w) => {
      C += l[w];
    });
    const A = i * C / g;
    d.forEach((w) => {
      v[w] = u + A;
    }), d.forEach((w) => {
      const x = o.getNeighbors(w);
      if (x.length > 0) {
        const T = i * l[w] / x.length;
        x.forEach((B) => {
          v[B] += T;
        });
      }
    });
    const m = Le(v, l);
    if (l = v, b % 10 === 0 && y(s, b / r), m < a)
      break;
  }
  const p = Object.values(l).reduce((b, v) => b + v, 0);
  return p > 0 && d.forEach((b) => {
    l[b] /= p;
  }), y(s, 1), l;
}
async function xt(n, e, t, s) {
  const o = N(n), i = e || Array.from(o.nodes), r = {};
  return i.forEach((a, d) => {
    r[a] = ht(o, a), d % 100 === 0 && y(s, d / i.length);
  }), y(s, 1), r;
}
async function Wt(n, e, t, s) {
  const o = N(n), i = e || Array.from(o.nodes), a = Array.from(o.nodes).length, d = {}, g = t?.normalized !== !1;
  return i.forEach((l, c) => {
    const h = /* @__PURE__ */ new Map(), u = [l], p = /* @__PURE__ */ new Set([l]);
    for (h.set(l, 0); u.length > 0; ) {
      const v = u.shift(), C = h.get(v);
      for (const A of o.getNeighbors(v))
        p.has(A) || (p.add(A), u.push(A), h.set(A, C + 1));
    }
    const b = h.size - 1;
    if (b === 0)
      d[l] = 0;
    else {
      const v = Array.from(h.values()).reduce((C, A) => C + A, 0);
      if (v === 0)
        d[l] = 0;
      else {
        const C = b / v;
        d[l] = g ? C * (b / (a - 1)) : C;
      }
    }
    c % 100 === 0 && y(s, c / i.length);
  }), y(s, 1), d;
}
async function Zt(n, e, t, s) {
  const o = N(n), i = e || Array.from(o.nodes), r = {};
  return i.forEach((a, d) => {
    const g = o.getNeighbors(a), l = g.length;
    if (l < 2)
      r[a] = 0;
    else {
      let c = 0;
      for (let u = 0; u < l; u++)
        for (let p = u + 1; p < l; p++)
          o.hasEdge(g[u], g[p]) && c++;
      const h = l * (l - 1) / 2;
      r[a] = c / h;
    }
    d % 100 === 0 && y(s, d / i.length);
  }), y(s, 1), r;
}
async function Xt(n, e, t, s) {
  const o = N(n), i = Array.from(o.nodes), r = i.length;
  if (r < 3) {
    const p = {};
    return i.forEach((b) => {
      p[b] = { laplacian_x: Math.random() * 2 - 1, laplacian_y: Math.random() * 2 - 1 };
    }), y(s, 1), p;
  }
  const { maxIter: a = 100, tolerance: d = 1e-6 } = t || {}, g = Array(r).fill(null).map(() => Array(r).fill(0)), l = /* @__PURE__ */ new Map();
  i.forEach((p, b) => l.set(p, b));
  for (let p = 0; p < r; p++) {
    const b = i[p], v = o.getNeighbors(b);
    g[p][p] = v.length, v.forEach((C) => {
      const A = l.get(C);
      A !== void 0 && (g[p][A] = -1);
    });
  }
  y(s, 0.2);
  const c = Array(r).fill(0).map(() => Math.random()), h = Array(r).fill(0).map(() => Math.random());
  O(c), O(h);
  for (let p = 0; p < a; p++) {
    const b = Ie(g, c);
    O(b);
    let v = 0;
    for (let C = 0; C < r; C++)
      v += Math.abs(b[C] - c[C]);
    if (v < d) break;
    for (let C = 0; C < r; C++)
      c[C] = b[C];
    p % 20 === 0 && y(s, 0.2 + p / a * 0.4);
  }
  y(s, 0.6), le(h, c), O(h);
  for (let p = 0; p < a; p++) {
    const b = Ie(g, h);
    O(b), le(b, c), le(b, h), O(b);
    let v = 0;
    for (let C = 0; C < r; C++)
      v += Math.abs(b[C] - h[C]);
    if (v < d) break;
    for (let C = 0; C < r; C++)
      h[C] = b[C];
    p % 20 === 0 && y(s, 0.6 + p / a * 0.39);
  }
  y(s, 0.99);
  const u = {};
  return i.forEach((p, b) => {
    u[p] = {
      laplacian_x: c[b],
      laplacian_y: h[b]
    };
  }), y(s, 1), u;
}
function Ie(n, e) {
  const t = n.length, s = Array(t).fill(0);
  for (let o = 0; o < t; o++)
    for (let i = 0; i < t; i++)
      s[o] += n[o][i] * e[i];
  return s;
}
function le(n, e) {
  let t = 0;
  for (let s = 0; s < n.length; s++)
    t += n[s] * e[s];
  for (let s = 0; s < n.length; s++)
    n[s] -= t * e[s];
}
const Ee = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BetweennessStatistic: ft,
  CliquesStatistic: Ct,
  ClosenessStatistic: ut,
  ClusteringStatistic: yt,
  DegreeStatistic: gt,
  EgoDensityStatistic: mt,
  EigenvectorLaplacianStatistic: It,
  EigenvectorStatistic: pt,
  PageRankStatistic: bt,
  betweennessCompute: vt,
  cliquesCompute: xt,
  closenessCompute: Wt,
  clusteringCompute: Gt,
  degreeCompute: wt,
  egoDensityCompute: Zt,
  eigenvectorCompute: Tt,
  eigenvectorLaplacianCompute: Xt,
  pageRankCompute: Pt
}, Symbol.toStringTag, { value: "Module" }));
class Bt extends L {
  constructor() {
    super("density", "Ratio of actual edges to possible edges", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "densityCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class kt extends L {
  constructor() {
    super("diameter", "Longest shortest path in the graph", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "diameterCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Mt extends L {
  constructor() {
    super("average_clustering", "Mean clustering coefficient across all nodes", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "averageClusteringCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Nt extends L {
  constructor() {
    super("average_shortest_path", "Mean distance between all node pairs", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "averageShortestPathCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Lt extends L {
  constructor() {
    super("connected_components", "Number of disconnected subgraphs", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "connectedComponentsCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Et extends L {
  constructor() {
    super("average_degree", "Mean number of connections per node", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "averageDegreeCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
async function Rt(n, e, t, s) {
  const o = N(n), i = o.nodes.size, r = o.edges.length;
  if (i < 2)
    return 0;
  const a = i * (i - 1) / 2, d = r / a;
  return y(s, 1), d;
}
async function zt(n, e, t, s) {
  const o = N(n), i = Array.from(o.nodes);
  let r = 0;
  return i.forEach((a, d) => {
    const g = Me(o, a);
    for (const l of g.values())
      l > r && (r = l);
    d % Math.max(1, Math.floor(i.length / 10)) === 0 && y(s, d / i.length);
  }), y(s, 1), r;
}
async function Jt(n, e, t, s) {
  const o = N(n), i = Array.from(o.nodes);
  let r = 0;
  return i.forEach((a, d) => {
    r += Ne(o, a), d % 100 === 0 && y(s, d / i.length);
  }), y(s, 1), i.length > 0 ? r / i.length : 0;
}
async function Ft(n, e, t, s) {
  const o = N(n), i = Array.from(o.nodes);
  let r = 0, a = 0;
  return i.forEach((d, g) => {
    Me(o, d).forEach((c, h) => {
      h !== d && (a += c, r++);
    }), g % Math.max(1, Math.floor(i.length / 10)) === 0 && y(s, g / i.length);
  }), y(s, 1), r > 0 ? a / r : 0;
}
async function Kt(n, e, t, s) {
  const o = N(n), i = Array.from(o.nodes), r = /* @__PURE__ */ new Set(), a = {};
  let d = 0;
  return i.forEach((g) => {
    if (!r.has(g)) {
      const l = [g];
      for (r.add(g), a[g] = d; l.length > 0; ) {
        const c = l.shift();
        for (const h of o.getNeighbors(c))
          r.has(h) || (r.add(h), l.push(h), a[h] = d);
      }
      d++;
    }
  }), y(s, 1), {
    count: d,
    components: a
  };
}
async function St(n, e, t, s) {
  const o = N(n), i = Array.from(o.nodes);
  let r = 0;
  return i.forEach((a) => {
    r += o.getNeighbors(a).length;
  }), y(s, 1), i.length > 0 ? r / i.length : 0;
}
const Re = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AverageClusteringStatistic: Mt,
  AverageDegreeStatistic: Et,
  AverageShortestPathStatistic: Nt,
  ConnectedComponentsStatistic: Lt,
  DensityStatistic: Bt,
  DiameterStatistic: kt,
  averageClusteringCompute: Jt,
  averageDegreeCompute: St,
  averageShortestPathCompute: Ft,
  connectedComponentsCompute: Kt,
  densityCompute: Rt,
  diameterCompute: zt
}, Symbol.toStringTag, { value: "Module" }));
class ue {
  /**
   * Create a community detection algorithm
   *
   * @param {string} name - Algorithm identifier (e.g., 'louvain', 'label-propagation')
   * @param {string} description - Human-readable description of the algorithm
   * @param {Object} computeConfig - Compute function configuration
   * @param {string} computeConfig.module - Module path containing compute function
   * @param {string} computeConfig.functionName - Name of compute function to call
   */
  constructor(e, t = "", s = null) {
    if (new.target === ue)
      throw new Error("CommunityAlgorithm is abstract and cannot be instantiated directly");
    if (!s || !s.module || !s.functionName)
      throw new Error("computeConfig with module and functionName is required");
    this.name = e, this.description = t, this.computeConfig = s, this.options = {};
  }
  /**
   * Detect communities in a graph.
   * Delegates computation to web workers for performance.
   *
   * **ASYNC**: All community detection is asynchronous
   *
   * @param {Graph} graph - The graph to analyze
   * @param {Object} [execOptions={}] - Execution options
   * @param {Function} [execOptions.onProgress] - Progress callback (0-1)
   * @param {number} [execOptions.timeout] - Task timeout override
   * @returns {Promise<Object>} Community detection results
   * {
   *   communities: { nodeId: communityId },
   *   modularity: number,
   *   numCommunities: number,
   *   algorithm: string,
   *   ...
   * }
   */
  async detect(e, t = {}) {
    const s = ee.serializeGraph(e), o = {
      module: this.computeConfig.module,
      functionName: this.computeConfig.functionName,
      args: [s, this.options]
    };
    return {
      ...await ee.execute(o, t),
      algorithm: this.name
    };
  }
  /**
   * Get algorithm metadata
   *
   * @returns {Object} Algorithm information
   */
  getInfo() {
    return {
      name: this.name,
      description: this.description
    };
  }
}
class Ce extends ue {
  /**
   * Create a Louvain algorithm instance
   *
   * @param {Object} [options={}] - Algorithm options
   * @param {number} [options.resolution=1.0] - Resolution parameter for modularity
   * @param {number} [options.maxIterations=100] - Maximum number of iterations
   */
  constructor(e = {}) {
    super(
      "louvain",
      "Louvain method for community detection using modularity optimization",
      {
        module: "../community/algorithms/louvain.js",
        functionName: "louvainCompute"
      }
    ), this.options = {
      resolution: e.resolution || 1,
      maxIterations: e.maxIterations || 100
    };
  }
  // detect() inherited from base class - delegates to worker!
}
async function Yt(n, e, t) {
  const s = N(n), { resolution: o = 1, maxIterations: i = 100 } = e || {}, r = Array.from(s.nodes), a = (C) => {
    const A = s.getNeighbors(C);
    let m = 0;
    return A.forEach((w) => {
      m += s.getEdgeWeight(C, w);
    }), m;
  };
  let d = 0;
  s.edges.forEach((C) => {
    d += C.weight;
  });
  const g = 2 * d, l = {};
  r.forEach((C) => {
    l[C] = C;
  });
  let c = !0, h = 0;
  for (; c && h < i; ) {
    c = !1, h++;
    for (const C of r) {
      const A = l[C], m = s.getNeighbors(C), w = /* @__PURE__ */ new Set();
      m.forEach((E) => {
        w.add(l[E]);
      });
      const x = a(C);
      let T = A, B = 0;
      w.forEach((E) => {
        if (E === A) return;
        const k = jt(
          s,
          C,
          A,
          E,
          l,
          g,
          o,
          x,
          a
        );
        k > B && (B = k, T = E);
      }), T !== A && (l[C] = T, c = !0);
    }
    if (y(t, Math.min(h / i, 0.9)), !c) break;
  }
  const u = Array.from(new Set(Object.values(l))), p = {};
  u.forEach((C, A) => {
    p[C] = A;
  });
  const b = {};
  Object.keys(l).forEach((C) => {
    b[C] = p[l[C]];
  });
  const v = Vt(s, b, d, a);
  return y(t, 1), {
    communities: b,
    modularity: v,
    numCommunities: u.length,
    iterations: h
  };
}
function jt(n, e, t, s, o, i, r, a, d) {
  const g = n.getNeighbors(e);
  let l = 0, c = 0;
  g.forEach((v) => {
    const C = n.getEdgeWeight(e, v);
    o[v] === s && (l += C), o[v] === t && v !== e && (c += C);
  });
  const h = Array.from(n.nodes);
  let u = 0, p = 0;
  return h.forEach((v) => {
    o[v] === s && (u += d(v)), o[v] === t && (p += d(v));
  }), l / i - r * (u * a) / (i * i) - (c / i - r * (p * a) / (i * i));
}
function Vt(n, e, t, s) {
  if (t === 0) return 0;
  const o = 2 * t, i = new Set(Object.values(e));
  let r = 0;
  return i.forEach((a) => {
    let d = 0, g = 0;
    Object.keys(e).filter(
      (c) => e[c] === a
    ).forEach((c) => {
      g += s(c);
    }), n.edges.forEach((c) => {
      const h = c.u, u = c.v, p = c.weight;
      e[h] === a && e[u] === a && (d += p);
    }), r += d / o - Math.pow(g / o, 2);
  }), r;
}
const ze = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  LouvainAlgorithm: Ce,
  default: Ce,
  louvainCompute: Yt
}, Symbol.toStringTag, { value: "Module" }));
class V {
  /**
   * Create a new layout instance.
   *
   * @param {Graph} graph - The graph structure to layout
   * @param {Object} [options={}] - Layout-specific configuration options
   * @param {Object} computeConfig - Compute function configuration
   * @param {string} computeConfig.module - Module path containing compute function
   * @param {string} computeConfig.functionName - Name of compute function to call
   * @throws {Error} If graph is null or undefined
   * @example
   * import { Graph } from '../graph.js';
   * import { ForceDirectedLayout } from './force-directed.js';
   *
   * const graph = new Graph();
   * graph.addNodesFrom(['A', 'B', 'C']);
   * graph.addEdge('A', 'B', 1);
   *
   * const layout = new ForceDirectedLayout(graph, {
   *   width: 800,
   *   height: 600,
   *   iterations: 100
   * });
   */
  constructor(e, t = {}, s = null) {
    if (!e)
      throw new Error("Graph is required for layout computation");
    if (!s || !s.module || !s.functionName)
      throw new Error("computeConfig with module and functionName is required");
    this.graph = e, this.options = t, this.computeConfig = s, this._positions = null;
  }
  /**
   * Compute node positions based on the layout algorithm.
   * Delegates computation to web workers for performance.
   *
   * **ASYNC**: All layout computation is asynchronous
   *
   * @param {Object} [options={}] - Layout-specific options (merged with constructor options)
   * @param {Function} [options.onProgress] - Progress callback (0-1)
   * @param {number} [options.timeout] - Task timeout override
   * @returns {Promise<Object>} Map of node IDs to {x, y} coordinates
   * @example
   * const positions = await layout.computePositions({
   *   iterations: 200,
   *   onProgress: (p) => console.log(`${Math.round(p * 100)}%`)
   * });
   */
  async computePositions(e = {}) {
    const t = { ...this.options, ...e }, { onProgress: s, timeout: o, ...i } = t, r = ee.serializeGraph(this.graph), a = {
      module: this.computeConfig.module,
      functionName: this.computeConfig.functionName,
      args: [r, i]
    };
    return await ee.execute(a, {
      onProgress: s,
      timeout: o
    });
  }
  /**
   * Get node positions, computing them if not already cached.
   * This is the main public API method that adapters should call.
   *
   * @param {Object} [options={}] - Layout options to override defaults
   * @param {boolean} [forceRecompute=false] - Force recomputation even if cached
   * @returns {Promise<Object>} Map of node IDs to {x, y} coordinates
   * @example
   * const layout = new ForceDirectedLayout(graph);
   * const positions = await layout.getPositions();
   * // positions = { 'A': {x: 100, y: 200}, 'B': {x: 300, y: 150}, ... }
   */
  async getPositions(e = {}, t = !1) {
    return (!this._positions || t) && (this._positions = await this.computePositions(e)), this._positions;
  }
  /**
   * Update layout iteratively (for algorithms that support incremental refinement).
   * Subclasses can override this to support step-by-step layout animation.
   *
   * @param {number} [iterations=1] - Number of iterations to perform
   * @returns {Promise<Object>} Updated positions map
   * @example
   * // Initial positions
   * const positions = await layout.getPositions();
   *
   * // Refine layout over multiple frames
   * for (let i = 0; i < 100; i++) {
   *   const updated = await layout.updateLayout(1);
   *   // Render updated positions
   * }
   */
  async updateLayout(e = 1) {
    return this.getPositions({}, !0);
  }
  /**
   * Reset cached positions.
   * Useful when graph structure changes.
   *
   * @example
   * graph.addEdge('A', 'B', 1);
   * layout.reset(); // Invalidate cache
   * const newPositions = await layout.getPositions();
   */
  reset() {
    this._positions = null;
  }
  /**
   * Get all nodes in the graph.
   * Convenience method for subclasses.
   *
   * @protected
   * @returns {Array} Array of node IDs
   */
  getNodes() {
    return this.graph.getNodeList();
  }
  /**
   * Get the number of nodes in the graph.
   * Convenience method for subclasses.
   *
   * @protected
   * @returns {number} Node count
   */
  getNodeCount() {
    return this.graph.numberOfNodes();
  }
}
class we extends V {
  /**
   * Create a random layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {number} [options.scale=100] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   * @param {number} [options.seed=null] - Random seed for reproducibility (null = non-deterministic)
   */
  constructor(e, t = {}) {
    super(e, {
      scale: 100,
      center: { x: 0, y: 0 },
      seed: null,
      ...t
    }, {
      module: "../layouts/random.js",
      functionName: "randomCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function Ht(n, e, t) {
  const s = Array.from(n.nodes || []), {
    scale: o = 1,
    center: i = { x: 0, y: 0 },
    seed: r = null
  } = e || {}, a = {};
  let d;
  return r !== null ? d = function(l) {
    return function() {
      let c = l += 1831565813;
      return c = Math.imul(c ^ c >>> 15, c | 1), c ^= c + Math.imul(c ^ c >>> 7, c | 61), ((c ^ c >>> 14) >>> 0) / 4294967296;
    };
  }(r) : d = Math.random, s.forEach((g) => {
    const l = (d() * 2 - 1) * o + i.x, c = (d() * 2 - 1) * o + i.y;
    a[g] = { x: l, y: c };
  }), y(t, 1), a;
}
const Je = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  RandomLayout: we,
  default: we,
  randomCompute: Ht
}, Symbol.toStringTag, { value: "Module" }));
class ve extends V {
  /**
   * Create a circular layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {number} [options.scale=100] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   * @param {Function} [options.sortBy=null] - Optional sort function for node ordering
   */
  constructor(e, t = {}) {
    super(e, {
      scale: 100,
      center: { x: 0, y: 0 },
      sortBy: null,
      ...t
    }, {
      module: "../layouts/circular.js",
      functionName: "circularCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function _t(n, e, t) {
  const s = N(n), {
    scale: o = 1,
    center: i = { x: 0, y: 0 },
    sortBy: r = null
  } = e || {};
  let a = Array.from(s.nodes);
  const d = a.length;
  if (d === 0)
    return y(t, 1), {};
  if (d === 1) {
    const l = { [a[0]]: { x: i.x, y: i.y } };
    return y(t, 1), l;
  }
  r && typeof r == "function" && (a = a.sort(r));
  const g = {};
  return a.forEach((l, c) => {
    const h = 2 * Math.PI * c / d;
    g[l] = {
      x: Math.cos(h) * o + i.x,
      y: Math.sin(h) * o + i.y
    };
  }), y(t, 1), g;
}
const Fe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CircularLayout: ve,
  circularCompute: _t,
  default: ve
}, Symbol.toStringTag, { value: "Module" }));
class Ae extends V {
  /**
   * Create a spiral layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {number} [options.scale=100] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   * @param {number} [options.resolution=0.35] - Spiral compactness (lower = more compressed)
   * @param {boolean} [options.equidistant=false] - True = equidistant nodes, False = equal angles
   */
  constructor(e, t = {}) {
    super(e, {
      scale: 100,
      center: { x: 0, y: 0 },
      resolution: 0.35,
      equidistant: !1,
      ...t
    }, {
      module: "../layouts/spiral.js",
      functionName: "spiralCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
function Ut(n, e = 1) {
  if (n.length === 0) return n;
  let t = 1 / 0, s = -1 / 0, o = 1 / 0, i = -1 / 0;
  for (const [l, c] of n)
    t = Math.min(t, l), s = Math.max(s, l), o = Math.min(o, c), i = Math.max(i, c);
  const r = s - t || 1, a = i - o || 1, d = Math.max(r, a), g = 2 * e / d;
  return n.map(([l, c]) => [
    (l - t - r / 2) * g + e,
    (c - o - a / 2) * g + e
  ]);
}
async function Ot(n, e, t) {
  const s = Array.from(n.nodes || []), o = s.length, {
    scale: i = 1,
    center: r = { x: 0, y: 0 },
    resolution: a = 0.35,
    equidistant: d = !1
  } = e || {};
  if (o === 0)
    return y(t, 1), {};
  if (o === 1) {
    const c = { [s[0]]: { x: r.x, y: r.y } };
    return y(t, 1), c;
  }
  let g = [];
  if (d) {
    let h = 0.5, u = a;
    u += 1 / (h * u);
    for (let p = 0; p < o; p++) {
      const b = h * u;
      u += 1 / b, g.push([Math.cos(u) * b, Math.sin(u) * b]);
    }
  } else
    for (let c = 0; c < o; c++) {
      const h = a * c, u = c;
      g.push([Math.cos(h) * u, Math.sin(h) * u]);
    }
  g = Ut(g, i);
  const l = {};
  return s.forEach((c, h) => {
    l[c] = {
      x: g[h][0] + r.x,
      y: g[h][1] + r.y
    };
  }), y(t, 1), l;
}
const Ke = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SpiralLayout: Ae,
  default: Ae,
  spiralCompute: Ot
}, Symbol.toStringTag, { value: "Module" }));
class Ge extends V {
  /**
   * Create a shell layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {number} [options.scale=100] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   * @param {Array<Array<string>>} [options.nlist=null] - Pre-defined node shells (groups of node IDs)
   * @param {number|null} [options.rotate=null] - Rotation offset between shells (default: π/num_shells)
   */
  constructor(e, t = {}) {
    super(e, {
      scale: 100,
      center: { x: 0, y: 0 },
      nlist: null,
      rotate: null,
      nodeProperties: null,
      // Map of node ID -> {degree, ...properties}
      ...t
    }, {
      module: "../layouts/shell.js",
      functionName: "shellCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function qt(n, e, t) {
  const s = Array.from(n.nodes || []), o = s.length, {
    scale: i = 1,
    center: r = { x: 0, y: 0 },
    nlist: a = null,
    rotate: d = null,
    nodeProperties: g = null
    // Map of node ID -> {degree, ...properties}
  } = e || {};
  if (o === 0)
    return y(t, 1), {};
  if (o === 1) {
    const v = { [s[0]]: { x: r.x, y: r.y } };
    return y(t, 1), v;
  }
  let l;
  if (a && Array.isArray(a))
    l = a;
  else {
    let v = /* @__PURE__ */ new Map();
    if (g && g.size > 0)
      s.forEach((m) => {
        const w = g.get(m), x = w && typeof w == "object" && w.degree || 0;
        v.set(m, x);
      });
    else if (s.forEach((m) => {
      v.set(m, 0);
    }), n.edges)
      for (const m of n.edges) {
        const w = m.u !== void 0 ? m.u : m.source !== void 0 ? m.source : m[0], x = m.v !== void 0 ? m.v : m.target !== void 0 ? m.target : m[1];
        v.has(w) && v.set(w, v.get(w) + 1), v.has(x) && v.set(x, v.get(x) + 1);
      }
    const C = /* @__PURE__ */ new Map();
    s.forEach((m) => {
      const w = v.get(m) || 0;
      C.has(w) || C.set(w, []), C.get(w).push(m);
    }), l = Array.from(C.keys()).sort((m, w) => w - m).map((m) => C.get(m));
  }
  const c = i / l.length;
  let h;
  l[0].length === 1 ? h = 0 : h = c;
  let u;
  d === null ? u = Math.PI / l.length : u = d;
  const p = {};
  let b = u;
  for (const v of l) {
    const C = v.length;
    if (C === 0) continue;
    const A = [];
    for (let m = 0; m < C; m++)
      A.push(2 * Math.PI * m / C + b);
    v.forEach((m, w) => {
      const x = A[w], T = h * Math.cos(x) + r.x, B = h * Math.sin(x) + r.y;
      p[m] = { x: T, y: B };
    }), h += c, b += u;
  }
  return y(t, 1), p;
}
const Se = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShellLayout: Ge,
  default: Ge,
  shellCompute: qt
}, Symbol.toStringTag, { value: "Module" }));
class Te extends V {
  /**
   * Create a spectral layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {number} [options.scale=100] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   */
  constructor(e, t = {}) {
    super(e, {
      scale: 100,
      center: { x: 0, y: 0 },
      ...t
    }, {
      module: "../layouts/spectral.js",
      functionName: "spectralCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function Qt(n, e, t) {
  const s = Array.from(n.nodes || []), o = s.length;
  console.log("[spectralCompute] Starting with", o, "nodes");
  const {
    scale: i = 1,
    center: r = { x: 0, y: 0 },
    nodeProperties: a = null
    // Map of node ID -> {laplacian_x, laplacian_y}
  } = e || {};
  if (console.log("[spectralCompute] nodeProperties:", a ? `Map with ${a.size} entries` : "null"), o === 0)
    return y(t, 1), {};
  if (o === 1) {
    const h = { [s[0]]: { x: r.x, y: r.y } };
    return y(t, 1), h;
  }
  const d = {}, g = [], l = a || /* @__PURE__ */ new Map();
  console.log("[spectralCompute] Processing", o, "nodes for eigenvector extraction");
  for (const h of s) {
    let u, p;
    if (l && l.size > 0) {
      const b = l.get(h);
      if (b && b.laplacian_x !== void 0 && b.laplacian_y !== void 0)
        u = b.laplacian_x, p = b.laplacian_y;
      else
        throw new Error(
          `Spectral layout requires eigenvector-laplacian stat. Node "${h}" missing laplacian_x/laplacian_y. Include 'eigenvector-laplacian' in analyze() features.`
        );
    } else if (n.nodes && typeof n.nodes[Symbol.iterator] == "function")
      throw new Error(
        "Spectral layout requires eigenvector-laplacian stat. Include 'eigenvector-laplacian' in analyze() features."
      );
    g.push([u, p]);
  }
  console.log("[spectralCompute] Extracted", g.length, "coordinates. Sample:", g[0]), y(t, 0.5), console.log("[spectralCompute] Starting rescaleLayout...");
  const c = Dt(g, i);
  return console.log("[spectralCompute] Rescaled. Sample:", c[0]), y(t, 0.99), s.forEach((h, u) => {
    d[h] = {
      x: c[u][0] + r.x,
      y: c[u][1] + r.y
    };
  }), console.log("[spectralCompute] Created positions for", Object.keys(d).length, "nodes"), y(t, 1), console.log("[spectralCompute] Completed successfully"), d;
}
function Dt(n, e = 1) {
  if (n.length === 0) return n;
  let t = 1 / 0, s = -1 / 0, o = 1 / 0, i = -1 / 0;
  for (const [l, c] of n)
    t = Math.min(t, l), s = Math.max(s, l), o = Math.min(o, c), i = Math.max(i, c);
  const r = s - t || 1, a = i - o || 1, d = Math.max(r, a), g = 2 * e / d;
  return n.map(([l, c]) => [
    (l - t - r / 2) * g + e,
    (c - o - a / 2) * g + e
  ]);
}
const Ye = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SpectralLayout: Te,
  default: Te,
  spectralCompute: Qt
}, Symbol.toStringTag, { value: "Module" }));
function ne(n, e, t = 1, s = { x: 0, y: 0 }) {
  if (e.length === 0) return n;
  let o = 0, i = 0;
  e.forEach((c) => {
    o += n[c].x, i += n[c].y;
  });
  const r = o / e.length, a = i / e.length, d = {};
  e.forEach((c) => {
    d[c] = {
      x: n[c].x - r,
      y: n[c].y - a
    };
  });
  let g = 0;
  e.forEach((c) => {
    const h = Math.abs(d[c].x), u = Math.abs(d[c].y);
    g = Math.max(g, h, u);
  });
  const l = {};
  if (g > 0) {
    const c = t / g;
    e.forEach((h) => {
      l[h] = {
        x: d[h].x * c + s.x,
        y: d[h].y * c + s.y
      };
    });
  } else
    e.forEach((c) => {
      l[c] = { x: s.x, y: s.y };
    });
  return l;
}
class Pe extends V {
  /**
   * Create a force-directed layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {number} [options.iterations=50] - Number of iterations to run
   * @param {number} [options.k=null] - Optimal distance between nodes (auto-calculated if null)
   * @param {number} [options.scale=1] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   * @param {Object} [options.initialPositions=null] - Initial node positions
   * @param {number} [options.threshold=1e-4] - Convergence threshold
   */
  constructor(e, t = {}) {
    super(e, {
      iterations: 50,
      k: null,
      scale: 1,
      center: { x: 0, y: 0 },
      initialPositions: null,
      threshold: 1e-4,
      ...t
    }, {
      module: "../layouts/force-directed.js",
      functionName: "forceDirectedCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function $t(n, e, t) {
  const s = N(n), {
    iterations: o = 50,
    k: i = null,
    scale: r = 1,
    center: a = { x: 0, y: 0 },
    initialPositions: d = null,
    threshold: g = 1e-4
  } = e || {}, l = Array.from(s.nodes), c = l.length;
  if (c === 0)
    return y(t, 1), {};
  if (c === 1) {
    const T = { [l[0]]: { x: a.x, y: a.y } };
    return y(t, 1), T;
  }
  let h = {};
  d ? h = { ...d } : l.forEach((T) => {
    h[T] = {
      x: Math.random(),
      y: Math.random()
    };
  });
  const u = i !== null ? i : Math.sqrt(1 / c);
  let p = 1 / 0, b = -1 / 0, v = 1 / 0, C = -1 / 0;
  l.forEach((T) => {
    const B = h[T];
    p = Math.min(p, B.x), b = Math.max(b, B.x), v = Math.min(v, B.y), C = Math.max(C, B.y);
  });
  let A = Math.max(b - p, C - v) * 0.1;
  const m = A / (o + 1), w = /* @__PURE__ */ new Map();
  l.forEach((T) => {
    const B = new Set(s.getNeighbors(T));
    w.set(T, B);
  });
  for (let T = 0; T < o; T++) {
    const B = {};
    l.forEach((k) => {
      B[k] = { x: 0, y: 0 };
    }), l.forEach((k) => {
      const W = h[k];
      let M = 0, J = 0;
      l.forEach((R) => {
        if (R !== k) {
          const I = h[R], f = W.x - I.x, P = W.y - I.y;
          let Z = Math.sqrt(f * f + P * P);
          Z < 0.01 && (Z = 0.01);
          const X = w.get(k).has(R), F = u * u / (Z * Z), Y = X ? Z / u : 0, _ = F - Y;
          M += f / Z * _, J += P / Z * _;
        }
      }), B[k] = { x: M, y: J };
    });
    let E = 0;
    if (l.forEach((k) => {
      const W = B[k], M = Math.sqrt(W.x * W.x + W.y * W.y);
      if (M > 0) {
        const J = Math.max(M, 0.01), R = A / J;
        h[k].x += W.x * R, h[k].y += W.y * R, E += M;
      }
    }), A -= m, E / c < g) {
      y(t, 1);
      break;
    }
    T % 10 === 0 && y(t, T / o);
  }
  const x = ne(h, l, r, a);
  return y(t, 1), x;
}
const je = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ForceDirectedLayout: Pe,
  default: Pe,
  forceDirectedCompute: $t
}, Symbol.toStringTag, { value: "Module" }));
class xe extends V {
  /**
   * Create a Kamada-Kawai layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {number} [options.iterations=100] - Number of iterations to run
   * @param {number} [options.scale=1] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   * @param {Object} [options.initialPositions=null] - Initial node positions
   * @param {number} [options.threshold=1e-4] - Convergence threshold
   * @param {number} [options.K=null] - Scaling factor for spring constant (auto-calculated if null)
   */
  constructor(e, t = {}) {
    super(e, {
      iterations: 1e3,
      scale: 1,
      center: { x: 0, y: 0 },
      initialPositions: null,
      threshold: 1e-4,
      K: null,
      ...t
    }, {
      module: "../layouts/kamada-kawai.js",
      functionName: "kamadaKawaiCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function es(n, e, t) {
  console.log("[Kamada-Kawai] Received graphData:", {
    hasNodes: "nodes" in n,
    nodesType: typeof n.nodes,
    nodesIsArray: Array.isArray(n.nodes),
    hasEdges: "edges" in n,
    edgesType: typeof n.edges,
    edgesIsArray: Array.isArray(n.edges)
  });
  const s = N(n);
  console.log("[Kamada-Kawai] After reconstructGraph, graph.nodes:", {
    type: typeof s.nodes,
    isSet: s.nodes instanceof Set,
    size: s.nodes?.size || "N/A"
  });
  const {
    iterations: o = 100,
    scale: i = 1,
    center: r = { x: 0, y: 0 },
    initialPositions: a = null,
    threshold: d = 1e-4,
    K: g = null
  } = e || {}, l = Array.from(s.nodes), c = l.length;
  if (console.log("[Kamada-Kawai] Nodes array:", {
    length: l.length,
    isArray: Array.isArray(l),
    sample: l.slice(0, 3)
  }), c === 0)
    return y(t, 1), {};
  if (c === 1) {
    const I = { [l[0]]: { x: r.x, y: r.y } };
    return y(t, 1), I;
  }
  y(t, 0.1), console.log("[Kamada-Kawai] About to compute all-pairs shortest paths:", {
    nodesLength: l.length,
    nodesIsArray: Array.isArray(l),
    nodesType: typeof l
  });
  let h;
  try {
    h = ts(s, l), console.log("[Kamada-Kawai] All-pairs shortest paths computed successfully");
    let I = !1, f = !1, P = 0, Z = 0;
    for (let X = 0; X < h.length; X++)
      for (let F = 0; F < h[X].length; F++)
        isFinite(h[X][F]) || (I = h[X][F] === 1 / 0, f = isNaN(h[X][F]), I && P++, f && Z++);
    (P > 0 || Z > 0) && console.warn("[Kamada-Kawai] Distances contain problematic values:", {
      infinityCount: P,
      nanCount: Z,
      totalDistances: h.length * h[0].length,
      sample: h[0].slice(0, 5)
    });
  } catch (I) {
    throw console.error("[Kamada-Kawai] Error in computeAllPairsShortestPaths:", I.message, I.stack), I;
  }
  y(t, 0.3), console.log("[Kamada-Kawai] About to initialize positions");
  let u;
  try {
    u = ss(l, a), console.log("[Kamada-Kawai] Positions initialized successfully, pos:", {
      type: typeof u,
      isArray: Array.isArray(u),
      length: u?.length || "N/A"
    });
  } catch (I) {
    throw console.error("[Kamada-Kawai] Error in initializePositions:", I.message, I.stack), I;
  }
  const p = h.flat().filter((I) => isFinite(I) && I > 0);
  p.length === 0 && console.warn("[Kamada-Kawai] All distances are placeholder (disconnected)!");
  const b = p.length > 0 ? p.reduce((I, f) => Math.max(I, f), 0) : 1, v = Math.sqrt(c), C = v / b, A = g !== null ? g : c;
  console.log("[Kamada-Kawai] Distance matrix stats:", {
    totalPairs: h.flat().length,
    finitePairs: p.length,
    infinitePairs: h.flat().length - p.length,
    max_dij: b,
    L0: v,
    L: C,
    kkconst: A,
    isKvalFinite: isFinite(A) && isFinite(C),
    avgDij: p.reduce((I, f) => I + f, 0) / p.length
  }), y(t, 0.4);
  const m = Array(c).fill(null).map(() => Array(c).fill(0)), w = Array(c).fill(null).map(() => Array(c).fill(0));
  for (let I = 0; I < c; I++)
    for (let f = 0; f < c; f++) {
      if (I === f) continue;
      const P = h[I][f];
      m[I][f] = A / (P * P), w[I][f] = C * P;
    }
  if (c > 1) {
    const P = Math.sqrt(
      Math.pow(u[0][0] - u[1][0], 2) + Math.pow(u[0][1] - u[1][1], 2)
    );
    console.log("[Kamada-Kawai] Sample spring values:", {
      "graph_dist[0,1]": h[0][1],
      "spring_const_kij[0,1]": m[0][1].toExponential(4),
      "desired_dist_lij[0,1]": w[0][1].toFixed(4),
      initial_euclidean_dist: P.toFixed(4),
      stress_ratio: (P / w[0][1]).toFixed(4),
      force: (m[0][1] * Math.abs(P - w[0][1])).toExponential(4)
    });
  }
  const x = Array(c).fill(0), T = Array(c).fill(0);
  for (let I = 0; I < c; I++)
    for (let f = 0; f < c; f++) {
      if (f === I) continue;
      const P = u[I][0] - u[f][0], Z = u[I][1] - u[f][1], X = Math.sqrt(P * P + Z * Z);
      X !== 0 && (x[I] += m[I][f] * (P - w[I][f] * P / X), T[I] += m[I][f] * (Z - w[I][f] * Z / X));
    }
  const B = x.map((I, f) => Math.sqrt(I * I + T[f] * T[f])), E = Math.max(...B), k = B.reduce((I, f) => I + f, 0) / c;
  console.log("[Kamada-Kawai] Initial gradient stats:", {
    maxEnergy: E.toFixed(4),
    avgEnergy: k.toFixed(4),
    threshold: Math.sqrt(d).toFixed(6)
  });
  for (let I = 0; I < o; I++) {
    let f = 0, P = -1;
    for (let G = 0; G < c; G++) {
      const z = x[G] * x[G] + T[G] * T[G];
      z > P && (f = G, P = z);
    }
    if (P < d) {
      console.log(`[Kamada-Kawai] Converged at iteration ${I}/${o} with max_delta ${Math.sqrt(P).toFixed(6)} (threshold: ${Math.sqrt(d).toFixed(6)})`);
      break;
    }
    y(t, 0.4 + 0.6 * (I + 1) / o), (I % 500 === 0 || I < 5 || I === o - 1) && console.log(`[Kamada-Kawai] Iteration ${I}/${o}: max_delta = ${Math.sqrt(P).toFixed(6)}, node ${f}`);
    const Z = u[f][0], X = u[f][1];
    let F = 0, Y = 0, _ = 0;
    for (let G = 0; G < c; G++) {
      if (G === f) continue;
      const z = Z - u[G][0], S = X - u[G][1], q = Math.sqrt(z * z + S * S);
      if (q === 0) continue;
      const j = q * (z * z + S * S);
      F += m[f][G] * (1 - w[f][G] * S * S / j), Y += m[f][G] * w[f][G] * z * S / j, _ += m[f][G] * (1 - w[f][G] * z * z / j);
    }
    let ae = 0, ce = 0;
    const me = 1e-13, te = x[f], se = T[f];
    if (te * te + se * se >= me * me) {
      const G = _ * F - Y * Y;
      Math.abs(G) > 1e-10 ? (ce = (Y * te - F * se) / G, ae = (Y * se - _ * te) / G) : I < 5 && console.warn(`[Kamada-Kawai] Iteration ${I}: Singular matrix (det=${G.toExponential(2)}) for node ${f}`);
    } else I < 5 && console.warn(`[Kamada-Kawai] Iteration ${I}: Gradient too small for node ${f}`);
    I < 3 && f === 0 && console.log(`[Kamada-Kawai] Iteration ${I}, node ${f}:`, {
      A: F.toFixed(4),
      B: Y.toFixed(4),
      C: _.toFixed(4),
      det: (_ * F - Y * Y).toExponential(4),
      myD1: te.toFixed(4),
      myD2: se.toFixed(4),
      delta_x: ae.toFixed(6),
      delta_y: ce.toFixed(6),
      old_pos: [Z.toFixed(2), X.toFixed(2)]
    });
    const fe = Z + ae, ye = X + ce;
    x[f] = 0, T[f] = 0;
    for (let G = 0; G < c; G++) {
      if (G === f) continue;
      const z = Z - u[G][0], S = X - u[G][1], q = Math.sqrt(z * z + S * S), j = fe - u[G][0], Q = ye - u[G][1], oe = Math.sqrt(j * j + Q * Q);
      q === 0 || oe === 0 || (x[G] -= m[f][G] * (-z + w[f][G] * z / q), T[G] -= m[f][G] * (-S + w[f][G] * S / q), x[G] += m[f][G] * (-j + w[f][G] * j / oe), T[G] += m[f][G] * (-Q + w[f][G] * Q / oe), x[f] += m[f][G] * (j - w[f][G] * j / oe), T[f] += m[f][G] * (Q - w[f][G] * Q / oe));
    }
    u[f][0] = fe, u[f][1] = ye;
  }
  y(t, 0.95), console.log("[Kamada-Kawai] Before rescaling - preparing positions");
  const W = {};
  l.forEach((I, f) => {
    W[I] = {
      x: u[f][0],
      y: u[f][1]
    };
  });
  const M = l[0];
  console.log("[Kamada-Kawai] Sample positions BEFORE rescaling:", {
    sample: M,
    value: W[M],
    allCount: Object.keys(W).length,
    minMax: (() => {
      let I = 1 / 0, f = -1 / 0, P = 1 / 0, Z = -1 / 0;
      return Object.values(W).forEach((X) => {
        I = Math.min(I, X.x), f = Math.max(f, X.x), P = Math.min(P, X.y), Z = Math.max(Z, X.y);
      }), { minX: I, maxX: f, minY: P, maxY: Z, rangeX: f - I, rangeY: Z - P };
    })()
  }), console.log("[Kamada-Kawai] Calling rescaleLayout with correct signature, scale:", i, "center:", r);
  const J = ne(W, l, i, r);
  console.log("[Kamada-Kawai] rescaleLayout completed successfully"), console.log("[Kamada-Kawai] Sample positions AFTER rescaling:", {
    sample: M,
    value: J[M],
    minMax: (() => {
      let I = 1 / 0, f = -1 / 0, P = 1 / 0, Z = -1 / 0;
      return Object.values(J).forEach((X) => {
        I = Math.min(I, X.x), f = Math.max(f, X.x), P = Math.min(P, X.y), Z = Math.max(Z, X.y);
      }), { minX: I, maxX: f, minY: P, maxY: Z, rangeX: f - I, rangeY: Z - P };
    })()
  });
  const R = {};
  console.log("[Kamada-Kawai] Creating final positions dictionary");
  try {
    Object.entries(J).forEach(([P, Z]) => {
      R[P] = {
        x: Z.x,
        y: Z.y
      };
    }), console.log("[Kamada-Kawai] Final positions dictionary created successfully, count:", Object.keys(R).length);
    const I = l.slice(0, 3), f = {};
    I.forEach((P) => {
      f[P] = R[P];
    }), console.log("[Kamada-Kawai] Sample final positions:", f);
  } catch (I) {
    throw console.error("[Kamada-Kawai] Error creating positions dictionary:", I.message), console.error("  rescaledDict:", J), I;
  }
  return y(t, 1), R;
}
function ts(n, e) {
  const t = e.length, s = Array(t).fill(null).map(() => Array(t).fill(1 / 0)), o = {};
  e.forEach((r, a) => {
    o[r] = a, s[a][a] = 0;
  });
  for (let r = 0; r < t; r++) {
    const a = e[r], d = [[a, 0]], g = /* @__PURE__ */ new Set([a]);
    for (; d.length > 0; ) {
      const [l, c] = d.shift(), h = o[l];
      h !== void 0 && (s[r][h] = c);
      const u = n.getNeighbors(l) || [];
      for (const p of u)
        g.has(p) || (g.add(p), d.push([p, c + 1]));
    }
  }
  let i = 0;
  for (let r = 0; r < t; r++)
    for (let a = r + 1; a < t; a++)
      isFinite(s[r][a]) && s[r][a] > i && (i = s[r][a]);
  for (let r = 0; r < t; r++)
    for (let a = 0; a < t; a++)
      s[r][a] > i && (s[r][a] = i);
  return s;
}
function ss(n, e) {
  const t = n.length, s = [];
  if (e && Object.keys(e).length > 0)
    n.forEach((o) => {
      const i = e[o];
      i ? s.push([i.x || 0, i.y || 0]) : s.push([Math.random(), Math.random()]);
    });
  else {
    const o = Math.sqrt(t);
    if (t > 100) {
      const i = o * 3;
      console.log(`[Kamada-Kawai] Random initialization: spread=${i.toFixed(2)}, L0=${o.toFixed(2)}`);
      for (let r = 0; r < t; r++) {
        const a = (Math.random() - 0.5) * i, d = (Math.random() - 0.5) * i;
        s.push([a, d]);
      }
    } else {
      const i = 2 * Math.PI / t, r = o * 2;
      console.log(`[Kamada-Kawai] Circular initialization: radius=${r.toFixed(2)}, L0=${o.toFixed(2)}`);
      for (let a = 0; a < t; a++) {
        const d = r * Math.cos(a * i), g = r * Math.sin(a * i);
        s.push([d, g]);
      }
    }
  }
  return s;
}
const Ve = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KamadaKawaiLayout: xe,
  default: xe,
  kamadaKawaiCompute: es
}, Symbol.toStringTag, { value: "Module" }));
class We extends V {
  /**
   * Create a bipartite layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {Array} [options.partition=null] - Node IDs for first partition (auto-detect if null)
   * @param {string} [options.align='vertical'] - 'vertical' or 'horizontal'
   * @param {number} [options.scale=1] - Scale factor for positions
   * @param {number} [options.aspectRatio=4/3] - Width to height ratio
   * @param {Object} [options.center={x:0, y:0}] - Center point
   */
  constructor(e, t = {}) {
    super(e, {
      partition: null,
      align: "vertical",
      scale: 1,
      aspectRatio: 4 / 3,
      center: { x: 0, y: 0 },
      ...t
    }, {
      module: "../layouts/bipartite.js",
      functionName: "bipartiteCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function os(n, e, t) {
  const s = N(n), {
    partition: o = null,
    align: i = "vertical",
    scale: r = 1,
    aspectRatio: a = 4 / 3,
    center: d = { x: 0, y: 0 }
  } = e || {}, g = Array.from(s.nodes), l = g.length;
  if (l === 0)
    return y(t, 1), {};
  if (l === 1) {
    const W = { [g[0]]: { x: d.x, y: d.y } };
    return y(t, 1), W;
  }
  y(t, 0.3);
  let c, h;
  o && o.length > 0 ? (c = new Set(o), h = new Set(g.filter((W) => !c.has(W)))) : (c = /* @__PURE__ */ new Set(), h = /* @__PURE__ */ new Set(), g.forEach((W, M) => {
    M % 2 === 0 ? c.add(W) : h.add(W);
  })), y(t, 0.5);
  const u = Array.from(c), p = Array.from(h), b = [], v = u.length - 1 || 1, C = p.length - 1 || 1, A = a * 2, m = 2, w = A / 2, x = m / 2;
  u.forEach((W, M) => {
    const J = -w, R = v > 0 ? M * m / v - x : 0;
    b.push([J, R]);
  }), p.forEach((W, M) => {
    const J = w, R = C > 0 ? M * m / C - x : 0;
    b.push([J, R]);
  }), y(t, 0.7);
  const T = [...u, ...p], B = {};
  T.forEach((W, M) => {
    B[W] = {
      x: b[M][0],
      y: b[M][1]
    };
  });
  const E = ne(B, T, r, d);
  y(t, 0.9);
  const k = {};
  return T.forEach((W) => {
    k[W] = E[W];
  }), i === "horizontal" && Object.keys(k).forEach((W) => {
    const M = k[W].x;
    k[W].x = k[W].y, k[W].y = M;
  }), y(t, 1), k;
}
const He = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BipartiteLayout: We,
  bipartiteCompute: os,
  default: We
}, Symbol.toStringTag, { value: "Module" }));
class Ze extends V {
  /**
   * Create a multipartite layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {Object} [options.subsets=null] - Map of subset_id -> array of node IDs
   * @param {string} [options.align='vertical'] - 'vertical' or 'horizontal'
   * @param {number} [options.scale=1] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   */
  constructor(e, t = {}) {
    super(e, {
      subsets: null,
      align: "vertical",
      scale: 1,
      center: { x: 0, y: 0 },
      ...t
    }, {
      module: "../layouts/multipartite.js",
      functionName: "multipartiteCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function ns(n, e, t) {
  const s = N(n), {
    subsets: o = null,
    align: i = "vertical",
    scale: r = 1,
    center: a = { x: 0, y: 0 }
  } = e || {}, d = Array.from(s.nodes), g = d.length;
  if (g === 0)
    return y(t, 1), {};
  if (g === 1) {
    const A = { [d[0]]: { x: a.x, y: a.y } };
    return y(t, 1), A;
  }
  y(t, 0.3);
  let l;
  if (o && Object.keys(o).length > 0)
    l = Object.keys(o).sort((m, w) => {
      const x = parseInt(m), T = parseInt(w);
      return isNaN(x) ? 1 : isNaN(T) ? -1 : x - T;
    }).map((m) => o[m]);
  else {
    const A = /* @__PURE__ */ new Map();
    d.forEach((m, w) => {
      const x = w % 3;
      A.has(x) || A.set(x, []), A.get(x).push(m);
    }), l = Array.from(A.values());
  }
  y(t, 0.5);
  const c = [], h = {}, u = l.length, p = u * 2 - 1;
  l.forEach((A, m) => {
    const w = A.length - 1 || 1, x = (m * 2 - p / 2) / (u - 1 || 1);
    A.forEach((T, B) => {
      const E = w > 0 ? 2 * B / w - 1 : 0;
      c.push([x, E]);
    });
  }), y(t, 0.7);
  const b = [];
  l.forEach((A) => {
    A.forEach((m) => {
      b.push(m);
    });
  });
  const v = {};
  b.forEach((A, m) => {
    v[A] = {
      x: c[m][0],
      y: c[m][1]
    };
  });
  const C = ne(v, b, r, a);
  return y(t, 0.9), b.forEach((A) => {
    h[A] = C[A];
  }), i === "horizontal" && Object.keys(h).forEach((A) => {
    const m = h[A].x;
    h[A].x = h[A].y, h[A].y = m;
  }), y(t, 1), h;
}
const _e = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MultipartiteLayout: Ze,
  default: Ze,
  multipartiteCompute: ns
}, Symbol.toStringTag, { value: "Module" }));
class Xe extends V {
  /**
   * Create a BFS layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {string} [options.startNode=null] - Starting node for BFS (first node if null)
   * @param {string} [options.align='vertical'] - 'vertical' or 'horizontal'
   * @param {number} [options.scale=1] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   */
  constructor(e, t = {}) {
    super(e, {
      startNode: null,
      align: "vertical",
      scale: 1,
      center: { x: 0, y: 0 },
      ...t
    }, {
      module: "../layouts/bfs.js",
      functionName: "bfsCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function is(n, e, t) {
  const s = N(n), {
    startNode: o = null,
    align: i = "vertical",
    scale: r = 1,
    center: a = { x: 0, y: 0 }
  } = e || {}, d = Array.from(s.nodes), g = d.length;
  if (g === 0)
    return y(t, 1), {};
  if (g === 1) {
    const m = { [d[0]]: { x: a.x, y: a.y } };
    return y(t, 1), m;
  }
  y(t, 0.2);
  let l = o;
  (!l || !d.includes(l)) && (l = d[0]), y(t, 0.3);
  const c = rs(s, l);
  y(t, 0.6);
  const h = /* @__PURE__ */ new Set();
  if (c.forEach((m) => {
    m.forEach((w) => h.add(w));
  }), h.size !== g) {
    const m = d.filter((w) => !h.has(w));
    m.length > 0 && c.push(m);
  }
  y(t, 0.7);
  const u = [], p = c.length;
  Math.max(...c.map((m) => m.length)), c.forEach((m, w) => {
    const x = p > 1 ? 2 * w / (p - 1) - 1 : 0, T = m.length - 1 || 1;
    m.forEach((B, E) => {
      const k = T > 0 ? 2 * E / T - 1 : 0;
      u.push([x, k]);
    });
  }), y(t, 0.85);
  const b = [];
  c.forEach((m) => {
    m.forEach((w) => {
      b.push(w);
    });
  });
  const v = {};
  b.forEach((m, w) => {
    v[m] = {
      x: u[w][0],
      y: u[w][1]
    };
  });
  const C = ne(v, b, r, a);
  y(t, 0.95);
  const A = {};
  return b.forEach((m) => {
    A[m] = C[m];
  }), i === "horizontal" && Object.keys(A).forEach((m) => {
    const w = A[m].x;
    A[m].x = A[m].y, A[m].y = w;
  }), y(t, 1), A;
}
function rs(n, e, t) {
  const s = [], o = /* @__PURE__ */ new Set(), i = [e];
  let r = [];
  for (o.add(e); i.length > 0; ) {
    const c = i.shift();
    r.push(c);
    const u = (n.getNeighbors(c) || []).filter((p) => !o.has(p));
    u.forEach((p) => {
      o.add(p), i.push(p);
    }), (i.length === 0 || u.length > 0) && r.length > 0 && (s.push([...r]), r = []);
  }
  s.length = 0, r = [];
  const a = /* @__PURE__ */ new Map(), d = [e];
  let g = 0;
  a.set(e, 0);
  let l = 0;
  for (; g < d.length; ) {
    const c = d[g], h = a.get(c);
    h > l && (r.length > 0 && (s.push([...r]), r = []), l = h), r.push(c), (n.getNeighbors(c) || []).forEach((p) => {
      a.has(p) || (a.set(p, h + 1), d.push(p));
    }), g++;
  }
  return r.length > 0 && s.push([...r]), s;
}
const Ue = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BFSLayout: Xe,
  bfsCompute: is,
  default: Xe
}, Symbol.toStringTag, { value: "Module" })), ie = re({
  prefix: "network-worker",
  level: "info"
  // Workers default to info level
}), de = {
  // Node-level statistics (all in one file)
  "../statistics/algorithms/node-stats.js": Ee,
  // Graph-level statistics
  "../statistics/algorithms/graph-stats.js": Re,
  // Community
  "../community/algorithms/louvain.js": ze,
  // Layouts
  "../layouts/random.js": Je,
  "../layouts/circular.js": Fe,
  "../layouts/spiral.js": Ke,
  "../layouts/shell.js": Se,
  "../layouts/spectral.js": Ye,
  "../layouts/force-directed.js": je,
  "../layouts/kamada-kawai.js": Ve,
  "../layouts/bipartite.js": He,
  "../layouts/multipartite.js": _e,
  "../layouts/bfs.js": Ue
};
self.onmessage = async function(n) {
  const { id: e, module: t, functionName: s, args: o = [] } = n.data;
  try {
    if (!t || !s)
      throw new Error("Invalid task: module and functionName are required");
    ie.debug("Processing task", {
      id: e,
      module: t,
      functionName: s,
      argsLength: o?.length || 0
    });
    const i = (g) => {
      self.postMessage({
        id: e,
        status: "progress",
        progress: Math.min(Math.max(g, 0), 1)
        // Clamp to [0, 1]
      });
    }, r = de[t];
    if (!r)
      throw new Error(
        `Module '${t}' not found in registry. Available modules: ${Object.keys(de).join(", ")}`
      );
    const a = r[s];
    if (!a || typeof a != "function")
      throw new Error(
        `Function '${s}' not found in module '${t}'. Available functions: ${Object.keys(r).join(", ")}`
      );
    const d = await a(...o, i);
    self.postMessage({
      id: e,
      status: "complete",
      result: d
    });
  } catch (i) {
    ie.error("Task failed", {
      id: e,
      error: i.message,
      stack: i.stack
    }), self.postMessage({
      id: e,
      status: "error",
      error: i.message || "Unknown error",
      stack: i.stack
    });
  }
};
self.onerror = function(n) {
  ie.error("Worker error", {
    error: n.message || "Worker error occurred",
    stack: n.stack
  }), self.postMessage({
    status: "error",
    error: n.message || "Worker error occurred"
  });
};
ie.info("Initialized", { moduleCount: Object.keys(de).length });
const he = {
  // Node-level statistics (all in one file)
  "../statistics/algorithms/node-stats.js": Ee,
  // Graph-level statistics
  "../statistics/algorithms/graph-stats.js": Re,
  // Community
  "../community/algorithms/louvain.js": ze,
  // Layouts
  "../layouts/random.js": Je,
  "../layouts/circular.js": Fe,
  "../layouts/spiral.js": Ke,
  "../layouts/shell.js": Se,
  "../layouts/spectral.js": Ye,
  "../layouts/force-directed.js": je,
  "../layouts/kamada-kawai.js": Ve,
  "../layouts/bipartite.js": He,
  "../layouts/multipartite.js": _e,
  "../layouts/bfs.js": Ue
};
async function as(n) {
  const { module: e, functionName: t, args: s = [] } = n;
  if (!e || !t)
    throw new Error("Invalid task: module and functionName are required");
  const o = he[e];
  if (!o)
    throw new Error(
      `Module '${e}' not found in registry. Available modules: ${Object.keys(he).join(", ")}`
    );
  const i = o[t];
  if (!i || typeof i != "function")
    throw new Error(
      `Function '${t}' not found in module '${e}'. Available functions: ${Object.keys(o).join(", ")}`
    );
  const r = () => {
  };
  return await i(...s, r);
}
const cs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MODULE_REGISTRY: he,
  executeTask: as
}, Symbol.toStringTag, { value: "Module" }));
//# sourceMappingURL=network-worker.js.map
