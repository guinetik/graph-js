const D = {
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  TRACE: 5
}, Ut = "info", pt = "sandbox_logging_filters", bt = ["themeswitcher", "codemirroreditor", "editoradapter"];
class qt {
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
  constructor(t = {}) {
    this.enabled = t.enabled !== !1, this.level = t.level || Ut, this.prefix = t.prefix || "", this.component = this.prefix, this.redactSecrets = t.redactSecrets || !1, this.currentLevel = D[this.level.toUpperCase()] ?? D.INFO, this.loggingManager = t.loggingManager, this.console = t.console || console, this.component && this.loggingManager && this.loggingManager.registerComponent(this.component);
  }
  /**
   * Checks if a message should be logged based on current level, enabled state, and component filter
   * @param {string} level - The log level to check
   * @returns {boolean} True if the message should be logged
   */
  shouldLog(t) {
    if (t.toUpperCase() === "ERROR")
      return this.enabled && D[t.toUpperCase()] <= this.currentLevel;
    const e = !this.component || !this.loggingManager || this.loggingManager.isComponentEnabled(this.component);
    return this.enabled && e && D[t.toUpperCase()] <= this.currentLevel;
  }
  /**
   * Redacts potential secrets from arguments
   * @param {Array} args - Arguments to redact
   * @returns {Array} Redacted arguments
   */
  redactArgs(t) {
    return this.redactSecrets ? t.map((e) => this.redactValue(e)) : t;
  }
  /**
   * Recursively redacts secrets from a value
   * @param {any} value - Value to redact
   * @returns {any} Redacted value
   */
  redactValue(t) {
    if (typeof t == "string")
      return t.replace(/\b[a-zA-Z0-9_-]{20,}\b/g, "[REDACTED]");
    if (Array.isArray(t))
      return t.map((e) => this.redactValue(e));
    if (t && typeof t == "object" && t.constructor === Object) {
      const e = {};
      for (const s in t)
        Object.prototype.hasOwnProperty.call(t, s) && (e[s] = this.redactValue(t[s]));
      return e;
    }
    return t;
  }
  /**
   * Formats a message with prefix
   * @param {string} message - The message to format
   * @param {...any} args - Additional arguments
   * @returns {Array} Formatted message array
   */
  formatMessage(t, ...e) {
    const s = this.prefix ? `[${this.prefix}] ` : "", o = this.redactArgs(e);
    return [s + t, ...o];
  }
  /**
   * Logs an error message
   * @param {string} message - The error message
   * @param {...any} args - Additional arguments
   */
  error(t, ...e) {
    this.shouldLog("error") && this.console.error(...this.formatMessage(t, ...e));
  }
  /**
   * Logs a warning message
   * @param {string} message - The warning message
   * @param {...any} args - Additional arguments
   */
  warn(t, ...e) {
    this.shouldLog("warn") && this.console.warn(...this.formatMessage(t, ...e));
  }
  /**
   * Logs an info message
   * @param {string} message - The info message
   * @param {...any} args - Additional arguments
   */
  info(t, ...e) {
    this.shouldLog("info") && this.console.info(...this.formatMessage(t, ...e));
  }
  /**
   * Logs a general message
   * @param {string} message - The message
   * @param {...any} args - Additional arguments
   */
  log(t, ...e) {
    this.shouldLog("info") && this.console.log(...this.formatMessage(t, ...e));
  }
  /**
   * Logs a debug message
   * @param {string} message - The debug message
   * @param {...any} args - Additional arguments
   */
  debug(t, ...e) {
    this.shouldLog("debug") && this.console.debug(...this.formatMessage(t, ...e));
  }
  /**
   * Logs a trace message (with secret redaction by default)
   * @param {string} message - The trace message
   * @param {...any} args - Additional arguments
   */
  trace(t, ...e) {
    if (this.shouldLog("trace")) {
      const s = this.redactSecrets;
      this.redactSecrets = !0;
      const o = this.formatMessage(t, ...e);
      this.redactSecrets = s, this.console.trace(...o);
    }
  }
  /**
   * Logs a table of data
   * @param {any} data - The data to display in table format
   * @param {Array} [columns] - Optional column names
   */
  table(t, e) {
    if (this.shouldLog("info")) {
      const s = this.prefix ? `[${this.prefix}]` : "";
      s && this.console.log(s), this.console.table(t, e);
    }
  }
  /**
   * Creates a new group in the console
   * @param {string} label - The group label
   */
  group(t) {
    this.shouldLog("info") && this.console.group(...this.formatMessage(t));
  }
  /**
   * Creates a new collapsed group in the console
   * @param {string} label - The group label
   */
  groupCollapsed(t) {
    this.shouldLog("info") && this.console.groupCollapsed(...this.formatMessage(t));
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
  time(t) {
    this.shouldLog("debug") && this.console.time(this.prefix ? `[${this.prefix}] ${t}` : t);
  }
  /**
   * Ends a timer with the given label
   * @param {string} label - The timer label
   */
  timeEnd(t) {
    this.shouldLog("debug") && this.console.timeEnd(this.prefix ? `[${this.prefix}] ${t}` : t);
  }
  /**
   * Sets the log level
   * @param {string} level - The new log level
   */
  setLevel(t) {
    this.level = t, this.currentLevel = D[t.toUpperCase()] ?? D.INFO;
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
class Qt {
  /**
   * Creates a new LoggingManager instance
   * @param {object} options - Configuration options
   * @param {object} options.storage - Storage adapter instance
   * @param {object} options.console - Console object (default: console)
   */
  constructor(t = {}) {
    this.storage = t.storage, this.console = t.console || console, this.allowedComponents = /* @__PURE__ */ new Set(), this.globalEnabled = !0, this.allowAll = !1, this.registeredComponents = /* @__PURE__ */ new Set(), this.storage && this.loadFromStorage();
  }
  /**
   * Enables logging for specific components
   * @param {...string} components - Component names to enable
   */
  enable(...t) {
    t.forEach((e) => this.allowedComponents.add(e.toLowerCase())), this.saveToStorage(), this.console.log("🔧 Logging enabled for:", t.join(", "));
  }
  /**
   * Disables logging for specific components
   * @param {...string} components - Component names to disable
   */
  disable(...t) {
    t.forEach((e) => this.allowedComponents.delete(e.toLowerCase())), this.saveToStorage(), this.console.log("🔧 Logging disabled for:", t.join(", "));
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
    this.console.log("🔧 Available components to filter:"), Array.from(this.registeredComponents).sort().forEach((t) => {
      const e = this.isComponentEnabled(t);
      this.console.log(`  ${e ? "✅" : "❌"} ${t}`);
    });
  }
  /**
   * Checks if a component should log
   * @param {string} component - Component name
   * @returns {boolean} True if component should log
   */
  isComponentEnabled(t) {
    return this.globalEnabled ? this.allowAll ? !0 : this.allowedComponents.has(t.toLowerCase()) : !1;
  }
  /**
   * Registers a component for tracking
   * @param {string} component - Component name
   */
  registerComponent(t) {
    this.registeredComponents.add(t);
  }
  /**
   * Saves filter state to storage
   */
  saveToStorage() {
    if (this.storage)
      try {
        const t = {
          allowedComponents: Array.from(this.allowedComponents),
          allowAll: this.allowAll,
          globalEnabled: this.globalEnabled
        };
        this.storage.setItem(pt, JSON.stringify(t));
      } catch {
      }
  }
  /**
   * Loads filter state from storage
   */
  loadFromStorage() {
    if (this.storage)
      try {
        const t = this.storage.getItem(pt), e = JSON.parse(t || "{}");
        this.allowedComponents = new Set(e.allowedComponents || []), this.allowAll = e.allowAll || !1, this.globalEnabled = e.globalEnabled !== !1, t || (this.allowedComponents = new Set(bt));
      } catch {
        this.allowedComponents = new Set(bt);
      }
  }
}
class kt {
  /**
   * Gets an item from storage
   * @param {string} key - Storage key
   * @returns {string|null} Stored value or null
   */
  getItem(t) {
    throw new Error("StorageAdapter.getItem must be implemented");
  }
  /**
   * Sets an item in storage
   * @param {string} key - Storage key
   * @param {string} value - Value to store
   */
  setItem(t, e) {
    throw new Error("StorageAdapter.setItem must be implemented");
  }
  /**
   * Removes an item from storage
   * @param {string} key - Storage key
   */
  removeItem(t) {
    throw new Error("StorageAdapter.removeItem must be implemented");
  }
}
class Dt extends kt {
  constructor() {
    super(), this.storage = /* @__PURE__ */ new Map();
  }
  getItem(t) {
    return this.storage.get(t) ?? null;
  }
  setItem(t, e) {
    this.storage.set(t, e);
  }
  removeItem(t) {
    this.storage.delete(t);
  }
}
class $t extends kt {
  getItem(t) {
    try {
      return localStorage.getItem(t);
    } catch {
      return null;
    }
  }
  setItem(t, e) {
    try {
      localStorage.setItem(t, e);
    } catch {
    }
  }
  removeItem(t) {
    try {
      localStorage.removeItem(t);
    } catch {
    }
  }
}
function te() {
  return typeof localStorage < "u" ? new $t() : new Dt();
}
class Mt {
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
  setGlobalProperty(t, e) {
    throw new Error("GlobalAdapter.setGlobalProperty must be implemented");
  }
  /**
   * Checks if a property exists on the global object
   * @param {string} key - Property key
   * @returns {boolean} True if property exists
   */
  hasGlobalProperty(t) {
    throw new Error("GlobalAdapter.hasGlobalProperty must be implemented");
  }
}
class ee extends Mt {
  getGlobal() {
    return window;
  }
  setGlobalProperty(t, e) {
    window[t] = e;
  }
  hasGlobalProperty(t) {
    return t in window;
  }
}
class se extends Mt {
  getGlobal() {
    return globalThis;
  }
  setGlobalProperty(t, e) {
    globalThis[t] = e;
  }
  hasGlobalProperty(t) {
    return t in globalThis;
  }
}
function oe() {
  return typeof window < "u" ? new ee() : new se();
}
const ne = te(), ie = oe(), _ = new Qt({
  storage: ne,
  console
});
typeof window < "u" && ie.setGlobalProperty("logFilter", {
  enable: (...n) => _.enable(...n),
  disable: (...n) => _.disable(...n),
  enableAll: () => _.enableAll(),
  disableAll: () => _.disableAll(),
  status: () => _.status(),
  list: () => _.listComponents()
});
function rt(n = {}) {
  return new qt({
    ...n,
    loggingManager: _
  });
}
class $ {
  constructor(t) {
    this.workerScript = t, this.worker = null;
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
  static create(t) {
    if (typeof globalThis < "u" && globalThis.__USE_MOCK_WORKERS__)
      return new ae(t);
    if (typeof Worker < "u")
      return new gt(t);
    if (typeof require < "u")
      try {
        return require.resolve("worker_threads"), new re(t);
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
  postMessage(t, e = []) {
    throw new Error("Must implement postMessage");
  }
  /**
   * Set message handler
   * @abstract
   * @param {Function} callback - Handler for messages from worker
   */
  onMessage(t) {
    throw new Error("Must implement onMessage");
  }
  /**
   * Set error handler
   * @abstract
   * @param {Function} callback - Handler for worker errors
   */
  onError(t) {
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
class gt extends $ {
  constructor(t) {
    super(t), this.worker = new Worker(t, { type: "module" });
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
  static fromCode(t) {
    const e = new Blob([t], { type: "application/javascript" }), s = URL.createObjectURL(e);
    return new gt(s);
  }
  postMessage(t, e = []) {
    this.worker.postMessage(t, e);
  }
  onMessage(t) {
    this.worker.onmessage = (e) => t(e.data);
  }
  onError(t) {
    this.worker.onerror = (e) => {
      t(new Error(e.message || "Worker error"));
    };
  }
  terminate() {
    this.worker && (this.worker.terminate(), this.worker = null);
  }
}
class re extends $ {
  constructor(t) {
    super(t);
    const { Worker: e } = require("worker_threads");
    this.worker = new e(t);
  }
  postMessage(t, e = []) {
    this.worker.postMessage(t, e);
  }
  onMessage(t) {
    this.worker.on("message", t);
  }
  onError(t) {
    this.worker.on("error", (e) => {
      t(e);
    }), this.worker.on("exit", (e) => {
      e !== 0 && t(new Error(`Worker stopped with exit code ${e}`));
    });
  }
  terminate() {
    this.worker && (this.worker.terminate(), this.worker = null);
  }
}
class ae extends $ {
  constructor(t) {
    super(t), this.messageHandler = null;
  }
  postMessage(t, e = []) {
    setTimeout(async () => {
      if (this.messageHandler)
        try {
          const s = await this.executeSync(t);
          this.messageHandler({
            id: t.id,
            status: "complete",
            result: s
          });
        } catch (s) {
          this.errorHandler ? this.errorHandler(s) : this.messageHandler({
            id: t.id,
            status: "error",
            error: s.message || "Unknown error",
            stack: s.stack
          });
        }
    }, 0);
  }
  onMessage(t) {
    this.messageHandler = t;
  }
  onError(t) {
    this.errorHandler = t;
  }
  terminate() {
    this.messageHandler = null, this.errorHandler = null;
  }
  /**
   * Synchronous execution using module registry
   * @private
   */
  async executeSync(t) {
    const { executeTask: e } = await Promise.resolve().then(() => cs);
    return e(t);
  }
}
class ce {
  /**
   * Create a new worker pool
   *
   * @param {Object} options - Configuration options
   * @param {number} [options.maxWorkers] - Maximum number of workers (default: CPU count)
   * @param {string} [options.workerScript] - Path to worker script
   * @param {number} [options.taskTimeout] - Task timeout in ms (default: 300000, 5 minutes)
   * @param {boolean} [options.verbose] - Enable verbose logging
   * @param {boolean} [options.enableAffinity=true] - Enable worker affinity (route same algorithm to same worker)
   * @param {number} [options.affinityCacheLimit=50] - Max cached function keys per worker
   */
  constructor(t = {}) {
    this.maxWorkers = t.maxWorkers || this.detectCPUCount(), this.workerScript = t.workerScript || this.getDefaultWorkerScript(), this.taskTimeout = t.taskTimeout || 3e5, this.verbose = t.verbose || !1, this.affinityCacheLimit = t.affinityCacheLimit || 50, this.enableAffinity = t.enableAffinity !== !1, this.workers = [], this.availableWorkers = [], this.taskQueue = [], this.activeTasks = /* @__PURE__ */ new Map(), this.taskIdCounter = 0, this.initialized = !1, this.affinityMetrics = {
      hits: 0,
      misses: 0
    }, this.log = rt({
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
        for (let t = 0; t < this.maxWorkers; t++) {
          const e = await this.createWorker(t);
          this.workers.push(e), this.availableWorkers.push(e);
        }
        this.initialized = !0, this.log.info("Worker pool initialized successfully", { workerCount: this.maxWorkers });
      } catch (t) {
        throw this.log.error("Failed to initialize worker pool", {
          error: t.message,
          stack: t.stack
        }), await this.terminate(), t;
      }
    }
  }
  /**
   * Create a worker with message and error handlers
   * @private
   * @param {number} id - Worker ID for logging
   * @returns {WorkerAdapter} Configured worker
   */
  async createWorker(t) {
    const e = $.create(this.workerScript);
    return e.id = t, e.currentTaskId = null, e.cachedFunctions = /* @__PURE__ */ new Set(), e.tasksExecuted = 0, e.lastTaskTime = 0, e.onMessage((s) => {
      this.handleWorkerMessage(e, s);
    }), e.onError((s) => {
      this.handleWorkerError(e, s);
    }), this.log.debug("Worker created", { workerId: t }), e;
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
  async execute(t, e = {}) {
    if (!this.initialized)
      throw new Error("Worker pool not initialized. Call initialize() first.");
    return new Promise((s, o) => {
      const i = `task_${this.taskIdCounter++}`, r = { id: i, ...t }, a = e.timeout || this.taskTimeout, l = setTimeout(() => {
        this.handleTaskTimeout(i);
      }, a);
      this.activeTasks.set(i, {
        resolve: s,
        reject: o,
        onProgress: e.onProgress,
        timeoutId: l,
        startTime: Date.now(),
        task: r
        // Store task for affinity tracking
      });
      const h = this._selectWorker(r);
      h ? this.assignTask(h, r) : (this.taskQueue.push(r), this.log.debug("Task queued", { taskId: i, queueLength: this.taskQueue.length }));
    });
  }
  /**
   * Assign task to worker
   * @private
   * @param {WorkerAdapter} worker - Worker to assign to
   * @param {Object} task - Task to execute
   */
  assignTask(t, e) {
    t.currentTaskId = e.id, t.postMessage(e);
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
  _getAffinityKey(t) {
    return t && t.module && t.functionName ? `${t.module}:${t.functionName}` : null;
  }
  /**
   * Select optimal worker for task using affinity-aware algorithm
   * @private
   * @param {Object} task - Task to assign
   * @returns {WorkerAdapter|null} Selected worker or null if none available
   */
  _selectWorker(t) {
    if (this.availableWorkers.length === 0)
      return null;
    if (!this.enableAffinity) {
      const o = this.availableWorkers.pop();
      return this.log.debug("Worker selected (affinity disabled)", {
        workerId: o.id,
        taskId: t.id
      }), o;
    }
    const e = this._getAffinityKey(t);
    if (e) {
      const o = this.availableWorkers.find(
        (i) => i.cachedFunctions.has(e)
      );
      if (o)
        return this._recordAffinityHit(), this.log.info("🎯 Worker selected via affinity", {
          workerId: o.id,
          taskId: t.id,
          affinityKey: e,
          cachedFunctions: Array.from(o.cachedFunctions)
        }), this.log.debug("Worker selected via affinity (detailed)", {
          workerId: o.id,
          taskId: t.id,
          affinityKey: e,
          cachedFunctions: Array.from(o.cachedFunctions),
          tasksExecuted: o.tasksExecuted
        }), this._removeFromAvailable(o);
      this._recordAffinityMiss(), this.log.debug("No affinity match found", {
        taskId: t.id,
        affinityKey: e,
        availableWorkers: this.availableWorkers.length
      });
    }
    const s = this.availableWorkers.reduce(
      (o, i) => i.tasksExecuted < o.tasksExecuted ? i : o
    );
    return this.log.debug("Worker selected (least loaded)", {
      workerId: s.id,
      taskId: t.id,
      tasksExecuted: s.tasksExecuted,
      affinityKey: e || "none"
    }), this._removeFromAvailable(s);
  }
  /**
   * Remove worker from available pool and return it
   * @private
   * @param {WorkerAdapter} worker - Worker to remove
   * @returns {WorkerAdapter} The removed worker
   */
  _removeFromAvailable(t) {
    const e = this.availableWorkers.indexOf(t);
    return e > -1 && this.availableWorkers.splice(e, 1), t;
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
  _updateWorkerAffinity(t, e) {
    const s = this._getAffinityKey(e);
    if (!s) return;
    const o = !t.cachedFunctions.has(s);
    if (t.cachedFunctions.add(s), t.tasksExecuted++, t.lastTaskTime = Date.now(), o && (this.log.info("📦 Worker affinity cache updated", {
      workerId: t.id,
      affinityKey: s,
      cacheSize: t.cachedFunctions.size,
      tasksExecuted: t.tasksExecuted
    }), this.log.debug("Worker affinity cache updated (detailed)", {
      workerId: t.id,
      affinityKey: s,
      cacheSize: t.cachedFunctions.size,
      tasksExecuted: t.tasksExecuted,
      allCachedFunctions: Array.from(t.cachedFunctions)
    })), t.cachedFunctions.size > this.affinityCacheLimit) {
      const i = t.cachedFunctions.size;
      this._evictAffinityEntries(t), this.log.debug("Worker affinity cache evicted", {
        workerId: t.id,
        beforeSize: i,
        afterSize: t.cachedFunctions.size,
        limit: this.affinityCacheLimit
      });
    }
  }
  /**
   * Evict oldest entries from worker's affinity cache
   * @private
   * @param {WorkerAdapter} worker - Worker to evict entries from
   */
  _evictAffinityEntries(t) {
    const e = Array.from(t.cachedFunctions), s = e.slice(0, Math.floor(e.length / 2));
    s.forEach((o) => t.cachedFunctions.delete(o)), this.log.debug("Evicted affinity entries", {
      workerId: t.id,
      evicted: s.length,
      remaining: t.cachedFunctions.size
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
  handleWorkerMessage(t, e) {
    const { id: s, status: o, result: i, progress: r, error: a } = e, l = this.activeTasks.get(s);
    if (!l) {
      this.log.warn("Received message for unknown task", { taskId: s });
      return;
    }
    if (o === "progress")
      l.onProgress && l.onProgress(r), this.log.debug("Task progress", { taskId: s, progress: Math.round(r * 100) });
    else if (o === "complete") {
      const h = Date.now() - l.startTime;
      this.log.debug("Task completed", { taskId: s, duration: h }), clearTimeout(l.timeoutId), l.resolve(i), l.task && this._updateWorkerAffinity(t, l.task), this.activeTasks.delete(s), this.freeWorker(t);
    } else o === "error" && (this.log.error("Task failed", { taskId: s, error: a }), clearTimeout(l.timeoutId), l.reject(new Error(a)), this.activeTasks.delete(s), this.freeWorker(t));
  }
  /**
   * Handle worker error
   * @private
   * @param {WorkerAdapter} worker - Worker that errored
   * @param {Error} error - Error object
   */
  handleWorkerError(t, e) {
    if (this.log.error("Worker error", {
      workerId: t.id,
      error: e.message,
      stack: e.stack
    }), t.currentTaskId) {
      const s = this.activeTasks.get(t.currentTaskId);
      s && (clearTimeout(s.timeoutId), s.reject(e), this.activeTasks.delete(t.currentTaskId));
    }
    this.restartWorker(t);
  }
  /**
   * Handle task timeout
   * @private
   * @param {string} taskId - Task that timed out
   */
  handleTaskTimeout(t) {
    const e = this.activeTasks.get(t);
    if (!e) return;
    this.log.warn("Task timed out", { taskId: t, timeout: this.taskTimeout }), e.reject(new Error(`Task timed out after ${this.taskTimeout}ms`)), this.activeTasks.delete(t);
    const s = this.workers.find((o) => o.currentTaskId === t);
    s && this.restartWorker(s);
  }
  /**
   * Free worker and assign next queued task
   * @private
   * @param {WorkerAdapter} worker - Worker to free
   */
  freeWorker(t) {
    if (t.currentTaskId = null, this.taskQueue.length > 0) {
      const e = this.taskQueue.shift();
      this.assignTask(t, e), this.log.debug("Task assigned from queue", { taskId: e.id, workerId: t.id });
    } else
      this.availableWorkers.push(t);
  }
  /**
   * Restart failed worker
   * @private
   * @param {WorkerAdapter} oldWorker - Worker to restart
   */
  async restartWorker(t) {
    const e = this.workers.indexOf(t);
    if (e !== -1) {
      this.log.debug("Restarting worker", { workerId: t.id });
      try {
        t.terminate();
        const s = await this.createWorker(t.id);
        this.workers[e] = s, this.availableWorkers.push(s), this.log.info("Worker restarted successfully", {
          workerId: t.id,
          lostAffinityEntries: t.cachedFunctions?.size || 0
        });
      } catch (s) {
        this.log.error("Failed to restart worker", {
          workerId: t.id,
          error: s.message,
          stack: s.stack
        }), this.workers.splice(e, 1);
      }
    }
  }
  /**
   * Wait for active tasks to complete
   *
   * @param {number} [timeout=5000] - Max time to wait in ms
   * @returns {Promise<void>}
   */
  async waitForActiveTasks(t = 5e3) {
    if (this.activeTasks.size !== 0)
      return this.log.debug("Waiting for active tasks", { taskCount: this.activeTasks.size, timeout: t }), new Promise((e) => {
        const s = Date.now(), o = setInterval(() => {
          (this.activeTasks.size === 0 || Date.now() - s > t) && (clearInterval(o), this.log.debug("Wait complete", { remainingTasks: this.activeTasks.size }), e());
        }, 100);
      });
  }
  /**
   * Terminate all workers and clean up
   *
   * @param {boolean} [force=false] - Force termination without waiting
   * @returns {Promise<void>}
   */
  async terminate(t = !1) {
    this.initialized && (this.log.info("Terminating worker pool", { force: t }), t || await this.waitForActiveTasks(5e3), this.activeTasks.forEach((e, s) => {
      clearTimeout(e.timeoutId), e.reject(new Error("Worker pool terminated"));
    }), this.activeTasks.clear(), this.workers.forEach((e) => {
      try {
        e.terminate();
      } catch (s) {
        this.log.error("Error terminating worker", {
          workerId: e.id,
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
    const t = this.getAffinityStats();
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
        hitRate: t.hitRate
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
    const t = this.affinityMetrics.hits + this.affinityMetrics.misses;
    return {
      hits: this.affinityMetrics.hits,
      misses: this.affinityMetrics.misses,
      hitRate: t > 0 ? this.affinityMetrics.hits / t : 0,
      workerCaches: this.workers.map((e) => ({
        workerId: e.id,
        cachedFunctions: Array.from(e.cachedFunctions || []),
        tasksExecuted: e.tasksExecuted || 0
      }))
    };
  }
}
class H {
  constructor() {
    if (H.instance)
      return H.instance;
    this.workerPool = null, this.initialized = !1, this.initPromise = null, this.log = rt({
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
   * @param {number} [options.taskTimeout=300000] - Default task timeout in ms (default: 5 minutes)
   * @param {boolean} [options.verbose=false] - Enable verbose logging
   * @param {boolean} [options.enableAffinity=true] - Enable worker affinity (route same algorithm to same worker)
   * @param {number} [options.affinityCacheLimit=50] - Max cached function keys per worker
   * @returns {Promise<void>}
   */
  async initialize(t = {}) {
    if (this.initPromise)
      return this.initPromise;
    if (this.initialized && this.workerPool)
      return Promise.resolve();
    this.initPromise = this._doInitialize(t);
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
  async _doInitialize(t) {
    const {
      maxWorkers: e,
      workerScript: s,
      taskTimeout: o = 3e5,
      // 5 minutes default
      verbose: i = !1,
      enableAffinity: r = !0,
      affinityCacheLimit: a = 50
    } = t;
    this.log.setLevel(i ? "debug" : "info");
    let l = s;
    if (!l)
      try {
        l = new URL("data:text/javascript;base64,LyoqCiAqIE5ldHdvcmsgV29ya2VyIC0gRXhlY3V0ZXMgY29tcHV0ZSBmdW5jdGlvbnMgZnJvbSBhbGdvcml0aG0gbW9kdWxlcwogKgogKiAqKkJ1bmRsZXItRnJpZW5kbHkgQXJjaGl0ZWN0dXJlOioqCiAqIC0gU3RhdGljYWxseSBpbXBvcnRzIGFsbCBhbGdvcml0aG0gbW9kdWxlcyB1cGZyb250CiAqIC0gQ3JlYXRlcyBhIHJlZ2lzdHJ5IHRoYXQgbWFwcyBtb2R1bGUgcGF0aHMgdG8gdGhlaXIgZXhwb3J0cwogKiAtIE1haW4gdGhyZWFkIHNlbmRzOiB7IGlkLCBtb2R1bGUsIGZ1bmN0aW9uTmFtZSwgYXJncyB9CiAqIC0gV29ya2VyIGxvb2tzIHVwIG1vZHVsZSBmcm9tIHJlZ2lzdHJ5IGFuZCBleGVjdXRlcyBmdW5jdGlvbgogKgogKiBUaGlzIGFwcHJvYWNoIHdvcmtzIHdpdGggYWxsIGJ1bmRsZXJzIChWaXRlLCBXZWJwYWNrLCBSb2xsdXApIGJlY2F1c2UKICogaW1wb3J0cyBhcmUga25vd24gYXQgYnVpbGQgdGltZS4KICoKICogQG1vZHVsZSBuZXR3b3JrLXdvcmtlcgogKi8KCmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJ0BndWluZXRpay9sb2dnZXInOwoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBTVEFUSUMgSU1QT1JUUyAtIEFsbCBhbGdvcml0aG0gbW9kdWxlcyBpbXBvcnRlZCB1cGZyb250Ci8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCi8vIENyZWF0ZSBsb2dnZXIgZm9yIHdvcmtlciAocnVucyBpbiBzZXBhcmF0ZSBjb250ZXh0LCBubyB3aW5kb3cubG9nRmlsdGVyKQpjb25zdCBsb2cgPSBjcmVhdGVMb2dnZXIoewogIHByZWZpeDogJ25ldHdvcmstd29ya2VyJywKICBsZXZlbDogJ2luZm8nIC8vIFdvcmtlcnMgZGVmYXVsdCB0byBpbmZvIGxldmVsCn0pOwoKLy8gU3RhdGlzdGljcyBhbGdvcml0aG1zIChub2RlLWxldmVsIGFuZCBncmFwaC1sZXZlbCkKaW1wb3J0ICogYXMgbm9kZVN0YXRzQ29tcHV0ZSBmcm9tICcuLi9zdGF0aXN0aWNzL2FsZ29yaXRobXMvbm9kZS1zdGF0cy5qcyc7CmltcG9ydCAqIGFzIGdyYXBoU3RhdHNDb21wdXRlIGZyb20gJy4uL3N0YXRpc3RpY3MvYWxnb3JpdGhtcy9ncmFwaC1zdGF0cy5qcyc7CgovLyBDb21tdW5pdHkgZGV0ZWN0aW9uIGFsZ29yaXRobXMKaW1wb3J0ICogYXMgbG91dmFpbkNvbXB1dGUgZnJvbSAnLi4vY29tbXVuaXR5L2FsZ29yaXRobXMvbG91dmFpbi5qcyc7CgovLyBMYXlvdXQgYWxnb3JpdGhtcwppbXBvcnQgKiBhcyByYW5kb21Db21wdXRlIGZyb20gJy4uL2xheW91dHMvcmFuZG9tLmpzJzsKaW1wb3J0ICogYXMgY2lyY3VsYXJDb21wdXRlIGZyb20gJy4uL2xheW91dHMvY2lyY3VsYXIuanMnOwppbXBvcnQgKiBhcyBzcGlyYWxDb21wdXRlIGZyb20gJy4uL2xheW91dHMvc3BpcmFsLmpzJzsKaW1wb3J0ICogYXMgc2hlbGxDb21wdXRlIGZyb20gJy4uL2xheW91dHMvc2hlbGwuanMnOwppbXBvcnQgKiBhcyBzcGVjdHJhbENvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9zcGVjdHJhbC5qcyc7CmltcG9ydCAqIGFzIGZvcmNlRGlyZWN0ZWRDb21wdXRlIGZyb20gJy4uL2xheW91dHMvZm9yY2UtZGlyZWN0ZWQuanMnOwppbXBvcnQgKiBhcyBrYW1hZGFLYXdhaUNvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9rYW1hZGEta2F3YWkuanMnOwppbXBvcnQgKiBhcyBiaXBhcnRpdGVDb21wdXRlIGZyb20gJy4uL2xheW91dHMvYmlwYXJ0aXRlLmpzJzsKaW1wb3J0ICogYXMgbXVsdGlwYXJ0aXRlQ29tcHV0ZSBmcm9tICcuLi9sYXlvdXRzL211bHRpcGFydGl0ZS5qcyc7CmltcG9ydCAqIGFzIGJmc0NvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9iZnMuanMnOwoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBNT0RVTEUgUkVHSVNUUlkgLSBNYXBzIG1vZHVsZSBwYXRocyB0byB0aGVpciBleHBvcnRzCi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCmNvbnN0IE1PRFVMRV9SRUdJU1RSWSA9IHsKICAvLyBOb2RlLWxldmVsIHN0YXRpc3RpY3MgKGFsbCBpbiBvbmUgZmlsZSkKICAnLi4vc3RhdGlzdGljcy9hbGdvcml0aG1zL25vZGUtc3RhdHMuanMnOiBub2RlU3RhdHNDb21wdXRlLAoKICAvLyBHcmFwaC1sZXZlbCBzdGF0aXN0aWNzCiAgJy4uL3N0YXRpc3RpY3MvYWxnb3JpdGhtcy9ncmFwaC1zdGF0cy5qcyc6IGdyYXBoU3RhdHNDb21wdXRlLAoKICAvLyBDb21tdW5pdHkKICAnLi4vY29tbXVuaXR5L2FsZ29yaXRobXMvbG91dmFpbi5qcyc6IGxvdXZhaW5Db21wdXRlLAoKICAvLyBMYXlvdXRzCiAgJy4uL2xheW91dHMvcmFuZG9tLmpzJzogcmFuZG9tQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9jaXJjdWxhci5qcyc6IGNpcmN1bGFyQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9zcGlyYWwuanMnOiBzcGlyYWxDb21wdXRlLAogICcuLi9sYXlvdXRzL3NoZWxsLmpzJzogc2hlbGxDb21wdXRlLAogICcuLi9sYXlvdXRzL3NwZWN0cmFsLmpzJzogc3BlY3RyYWxDb21wdXRlLAogICcuLi9sYXlvdXRzL2ZvcmNlLWRpcmVjdGVkLmpzJzogZm9yY2VEaXJlY3RlZENvbXB1dGUsCiAgJy4uL2xheW91dHMva2FtYWRhLWthd2FpLmpzJzoga2FtYWRhS2F3YWlDb21wdXRlLAogICcuLi9sYXlvdXRzL2JpcGFydGl0ZS5qcyc6IGJpcGFydGl0ZUNvbXB1dGUsCiAgJy4uL2xheW91dHMvbXVsdGlwYXJ0aXRlLmpzJzogbXVsdGlwYXJ0aXRlQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9iZnMuanMnOiBiZnNDb21wdXRlCn07CgovLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ci8vIFdPUktFUiBNRVNTQUdFIEhBTkRMRVIKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKLyoqCiAqIE1haW4gbWVzc2FnZSBoYW5kbGVyIC0gcmVjZWl2ZXMgdGFza3MgYW5kIGRlbGVnYXRlcyB0byBhbGdvcml0aG0gbW9kdWxlcwogKi8Kc2VsZi5vbm1lc3NhZ2UgPSBhc3luYyBmdW5jdGlvbihldmVudCkgewogIGNvbnN0IHsgaWQsIG1vZHVsZSwgZnVuY3Rpb25OYW1lLCBhcmdzID0gW10gfSA9IGV2ZW50LmRhdGE7CgogIHRyeSB7CiAgICAvLyBWYWxpZGF0ZSBtZXNzYWdlIGZvcm1hdAogICAgaWYgKCFtb2R1bGUgfHwgIWZ1bmN0aW9uTmFtZSkgewogICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdGFzazogbW9kdWxlIGFuZCBmdW5jdGlvbk5hbWUgYXJlIHJlcXVpcmVkJyk7CiAgICB9CgogICAgbG9nLmRlYnVnKCdQcm9jZXNzaW5nIHRhc2snLCB7CiAgICAgIGlkLAogICAgICBtb2R1bGUsCiAgICAgIGZ1bmN0aW9uTmFtZSwKICAgICAgYXJnc0xlbmd0aDogYXJncz8ubGVuZ3RoIHx8IDAKICAgIH0pOwoKICAgIC8vIENyZWF0ZSBwcm9ncmVzcyBjYWxsYmFjayB0aGF0IHJlcG9ydHMgYmFjayB0byBtYWluIHRocmVhZAogICAgY29uc3QgcHJvZ3Jlc3NDYWxsYmFjayA9IChwcm9ncmVzcykgPT4gewogICAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgICBpZCwKICAgICAgICBzdGF0dXM6ICdwcm9ncmVzcycsCiAgICAgICAgcHJvZ3Jlc3M6IE1hdGgubWluKE1hdGgubWF4KHByb2dyZXNzLCAwKSwgMSkgLy8gQ2xhbXAgdG8gWzAsIDFdCiAgICAgIH0pOwogICAgfTsKCiAgICAvLyBMb29rIHVwIGFsZ29yaXRobSBtb2R1bGUgZnJvbSByZWdpc3RyeQogICAgY29uc3QgYWxnb3JpdGhtTW9kdWxlID0gTU9EVUxFX1JFR0lTVFJZW21vZHVsZV07CgogICAgaWYgKCFhbGdvcml0aG1Nb2R1bGUpIHsKICAgICAgdGhyb3cgbmV3IEVycm9yKAogICAgICAgIGBNb2R1bGUgJyR7bW9kdWxlfScgbm90IGZvdW5kIGluIHJlZ2lzdHJ5LiBgICsKICAgICAgICBgQXZhaWxhYmxlIG1vZHVsZXM6ICR7T2JqZWN0LmtleXMoTU9EVUxFX1JFR0lTVFJZKS5qb2luKCcsICcpfWAKICAgICAgKTsKICAgIH0KCiAgICAvLyBHZXQgdGhlIGNvbXB1dGUgZnVuY3Rpb24KICAgIGNvbnN0IGNvbXB1dGVGdW5jdGlvbiA9IGFsZ29yaXRobU1vZHVsZVtmdW5jdGlvbk5hbWVdOwoKICAgIGlmICghY29tcHV0ZUZ1bmN0aW9uIHx8IHR5cGVvZiBjb21wdXRlRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHsKICAgICAgdGhyb3cgbmV3IEVycm9yKAogICAgICAgIGBGdW5jdGlvbiAnJHtmdW5jdGlvbk5hbWV9JyBub3QgZm91bmQgaW4gbW9kdWxlICcke21vZHVsZX0nLiBgICsKICAgICAgICBgQXZhaWxhYmxlIGZ1bmN0aW9uczogJHtPYmplY3Qua2V5cyhhbGdvcml0aG1Nb2R1bGUpLmpvaW4oJywgJyl9YAogICAgICApOwogICAgfQoKICAgIC8vIEV4ZWN1dGUgdGhlIGNvbXB1dGUgZnVuY3Rpb24KICAgIC8vIExhc3QgYXJnIGlzIGFsd2F5cyB0aGUgcHJvZ3Jlc3MgY2FsbGJhY2sKICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNvbXB1dGVGdW5jdGlvbiguLi5hcmdzLCBwcm9ncmVzc0NhbGxiYWNrKTsKCiAgICAvLyBTZW5kIHN1Y2Nlc3NmdWwgcmVzdWx0CiAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgaWQsCiAgICAgIHN0YXR1czogJ2NvbXBsZXRlJywKICAgICAgcmVzdWx0CiAgICB9KTsKCiAgfSBjYXRjaCAoZXJyb3IpIHsKICAgIC8vIFNlbmQgZXJyb3IKICAgIGxvZy5lcnJvcignVGFzayBmYWlsZWQnLCB7CiAgICAgIGlkLAogICAgICBlcnJvcjogZXJyb3IubWVzc2FnZSwKICAgICAgc3RhY2s6IGVycm9yLnN0YWNrCiAgICB9KTsKICAgIHNlbGYucG9zdE1lc3NhZ2UoewogICAgICBpZCwKICAgICAgc3RhdHVzOiAnZXJyb3InLAogICAgICBlcnJvcjogZXJyb3IubWVzc2FnZSB8fCAnVW5rbm93biBlcnJvcicsCiAgICAgIHN0YWNrOiBlcnJvci5zdGFjawogICAgfSk7CiAgfQp9OwoKLyoqCiAqIEhhbmRsZSB3b3JrZXIgZXJyb3JzCiAqLwpzZWxmLm9uZXJyb3IgPSBmdW5jdGlvbihlcnJvcikgewogIGxvZy5lcnJvcignV29ya2VyIGVycm9yJywgewogICAgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfHwgJ1dvcmtlciBlcnJvciBvY2N1cnJlZCcsCiAgICBzdGFjazogZXJyb3Iuc3RhY2sKICB9KTsKICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgIHN0YXR1czogJ2Vycm9yJywKICAgIGVycm9yOiBlcnJvci5tZXNzYWdlIHx8ICdXb3JrZXIgZXJyb3Igb2NjdXJyZWQnCiAgfSk7Cn07CgovLyBMb2cgd29ya2VyIGluaXRpYWxpemF0aW9uCmxvZy5pbmZvKCdJbml0aWFsaXplZCcsIHsgbW9kdWxlQ291bnQ6IE9iamVjdC5rZXlzKE1PRFVMRV9SRUdJU1RSWSkubGVuZ3RoIH0pOwo=", import.meta.url).href;
      } catch {
        l = "/graph-js/src/compute/network-worker.js", this.log.warn("Could not resolve worker path from import.meta.url, using fallback", { workerPath: l });
      }
    if (!$.isSupported())
      throw new Error(
        "Web Workers are not supported in this environment. This library requires Web Worker support (browser) or Worker Threads (Node.js)."
      );
    this.workerPool = new ce({
      maxWorkers: e || this._getDefaultWorkerCount(),
      workerScript: l,
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
  async execute(t, e = {}) {
    return this.initialized || await this.initialize(), this.workerPool.execute(t, e);
  }
  /**
   * Serialize a graph for transfer to workers
   * Minimizes data transfer by only sending necessary information
   *
   * @param {Graph} graph - Graph to serialize
   * @returns {Object} Serialized graph data
   */
  serializeGraph(t) {
    return {
      nodes: Array.from(t.nodes),
      edges: t.edges.map((e) => ({
        source: e.u,
        target: e.v,
        weight: e.weight
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
   * Get detailed affinity statistics
   *
   * @returns {Object|null} Affinity metrics including per-worker cache info or null if not initialized
   *
   * @example
   * const stats = WorkerManager.getAffinityStats();
   * console.log(`Affinity hit rate: ${(stats.hitRate * 100).toFixed(1)}%`);
   * console.log(`Hits: ${stats.hits}, Misses: ${stats.misses}`);
   */
  getAffinityStats() {
    return this.workerPool ? this.workerPool.getAffinityStats() : null;
  }
  /**
   * Terminate the worker pool and cleanup resources
   *
   * @param {boolean} [force=false] - Force immediate termination
   * @returns {Promise<void>}
   */
  async terminate(t = !1) {
    this.workerPool && (await this.workerPool.terminate(t), this.workerPool = null, this.initialized = !1);
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
const tt = new H();
class E {
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
  constructor(t, e = "", s = "node", o = null) {
    if (new.target === E)
      throw new Error("StatisticAlgorithm is abstract and cannot be instantiated directly");
    if (s !== "node" && s !== "graph")
      throw new Error(`Scope must be 'node' or 'graph', got: ${s}`);
    if (!o || !o.module || !o.functionName)
      throw new Error("computeConfig with module and functionName is required");
    this.name = t, this.description = e, this.scope = s, this.computeConfig = o, this.options = {};
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
  async calculate(t, e = null, s = {}) {
    const o = tt.serializeGraph(t), i = {
      module: this.computeConfig.module,
      functionName: this.computeConfig.functionName,
      args: [o, e, this.options]
    };
    return await tt.execute(i, s);
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
class le {
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
  addNode(t) {
    return this.nodes.add(t), this;
  }
  /**
   * Add multiple nodes to the graph.
   *
   * @param {Array<string|number>} nodes - Array of node identifiers to add
   * @returns {Graph} The graph instance for chaining
   * @example
   * graph.addNodesFrom(['node1', 'node2', 'node3']);
   */
  addNodesFrom(t) {
    return t.forEach((e) => this.nodes.add(e)), this;
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
  removeNode(t) {
    if (!this.nodes.has(t))
      throw new Error(`Node '${t}' does not exist in the graph`);
    return this.nodes.delete(t), this.edges = this.edges.filter((e) => e.u !== t && e.v !== t), this.adjacencyMap.has(t) && (Array.from(this.adjacencyMap.get(t).keys()).forEach((s) => {
      this.adjacencyMap.has(s) && this.adjacencyMap.get(s).delete(t);
    }), this.adjacencyMap.delete(t)), this;
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
  hasNode(t) {
    return this.nodes.has(t);
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
  addEdgesFrom(t) {
    return t.forEach(([e, s, o = 1]) => {
      this.addEdge(e, s, o);
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
  addEdge(t, e, s = 1) {
    this.nodes.add(t), this.nodes.add(e);
    const o = { u: t, v: e, weight: s };
    return this.edges.push(o), this.adjacencyMap.has(t) || this.adjacencyMap.set(t, /* @__PURE__ */ new Map()), this.adjacencyMap.has(e) || this.adjacencyMap.set(e, /* @__PURE__ */ new Map()), this.adjacencyMap.get(t).set(e, s), this.adjacencyMap.get(e).set(t, s), this;
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
  getNeighbors(t) {
    return this.adjacencyMap.has(t) ? Array.from(this.adjacencyMap.get(t).keys()) : [];
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
  removeEdge(t, e) {
    const s = this.edges.findIndex(
      (o) => o.u === t && o.v === e || o.u === e && o.v === t
    );
    if (s === -1)
      throw new Error(`Edge between '${t}' and '${e}' does not exist`);
    return this.edges.splice(s, 1), this.adjacencyMap.has(t) && this.adjacencyMap.get(t).delete(e), this.adjacencyMap.has(e) && this.adjacencyMap.get(e).delete(t), this;
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
  hasEdge(t, e) {
    return this.adjacencyMap.has(t) && this.adjacencyMap.get(t).has(e);
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
  getEdgeWeight(t, e) {
    return this.hasEdge(t, e) ? this.adjacencyMap.get(t).get(e) : null;
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
  updateEdgeWeight(t, e, s) {
    if (!this.hasEdge(t, e))
      throw new Error(`Edge between '${t}' and '${e}' does not exist`);
    this.adjacencyMap.get(t).set(e, s), this.adjacencyMap.get(e).set(t, s);
    const o = this.edges.find(
      (i) => i.u === t && i.v === e || i.u === e && i.v === t
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
  degree(t) {
    return this.adjacencyMap.has(t) ? this.adjacencyMap.get(t).size : 0;
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
const K = rt({
  prefix: "compute-utils",
  level: "info"
  // Default to info, can be verbose in debug builds
});
function L(n) {
  K.debug("Starting reconstruction", {
    isObject: n && typeof n == "object",
    hasNodes: n && "nodes" in n,
    hasEdges: n && "edges" in n,
    graphDataKeys: n ? Object.keys(n) : "N/A"
  });
  const t = new le();
  if (!n || typeof n != "object")
    return K.error("Invalid graphData passed to reconstructGraph", { graphData: n }), t;
  if (n.nodes !== void 0 && n.nodes !== null) {
    K.debug("Processing nodes", {
      type: typeof n.nodes,
      isArray: Array.isArray(n.nodes),
      length: Array.isArray(n.nodes) ? n.nodes.length : "N/A"
    });
    try {
      let e;
      if (Array.isArray(n.nodes))
        e = n.nodes;
      else if (n.nodes[Symbol.iterator])
        e = Array.from(n.nodes);
      else
        throw new Error(`nodes is not iterable: ${typeof n.nodes}`);
      K.debug("Node array created", { length: e.length }), e.forEach((s) => {
        t.addNode(s);
      }), K.debug("Nodes added successfully", {
        type: typeof t.nodes,
        size: t.nodes.size
      });
    } catch (e) {
      throw K.error("Error adding nodes", {
        error: e.message,
        stack: e.stack,
        nodesValue: n.nodes,
        nodesType: typeof n.nodes,
        nodesConstructor: n.nodes?.constructor?.name
      }), new Error(`Failed to reconstruct nodes: ${e.message}`);
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
      let e;
      if (Array.isArray(n.edges))
        e = n.edges;
      else if (n.edges[Symbol.iterator])
        e = Array.from(n.edges);
      else
        throw new Error(`edges is not iterable: ${typeof n.edges}`);
      K.debug("Edge array created", { length: e.length }), e.forEach((s) => {
        const o = s.source !== void 0 ? s.source : s.u, i = s.target !== void 0 ? s.target : s.v, r = s.weight || 1;
        o !== void 0 && i !== void 0 && t.addEdge(o, i, r);
      }), K.debug("Edges added successfully");
    } catch (e) {
      throw K.error("Error adding edges", {
        error: e.message,
        stack: e.stack,
        edgesValue: n.edges,
        edgesType: typeof n.edges
      }), new Error(`Failed to reconstruct edges: ${e.message}`);
    }
  } else
    K.warn("No edges found in graphData");
  return K.debug("Reconstruction complete", {
    nodes: t.nodes.size,
    edges: t.edges.length
  }), t;
}
function y(n, t) {
  n && typeof n == "function" && n(Math.min(Math.max(t, 0), 1));
}
function de(n, t) {
  const e = /* @__PURE__ */ new Map([[t, 0]]), s = /* @__PURE__ */ new Map([[t, 1]]), o = /* @__PURE__ */ new Map(), i = [t], r = [];
  for (; i.length > 0; ) {
    const a = i.shift();
    r.push(a);
    const l = n.getNeighbors(a), h = e.get(a);
    l.forEach((d) => {
      e.has(d) || (e.set(d, h + 1), i.push(d)), e.get(d) === h + 1 && (s.set(d, (s.get(d) || 0) + s.get(a)), o.has(d) || o.set(d, []), o.get(d).push(a));
    });
  }
  return { distance: e, pathCount: s, predecessors: o, stack: r };
}
function Bt(n, t) {
  const e = /* @__PURE__ */ new Map(), s = [t], o = /* @__PURE__ */ new Set([t]);
  for (e.set(t, 0); s.length > 0; ) {
    const i = s.shift(), r = e.get(i);
    for (const a of n.getNeighbors(i))
      o.has(a) || (o.add(a), s.push(a), e.set(a, r + 1));
  }
  return e;
}
function Nt(n, t) {
  const e = n.getNeighbors(t), s = e.length;
  if (s < 2)
    return 0;
  let o = 0;
  for (let i = 0; i < e.length; i++)
    for (let r = i + 1; r < e.length; r++)
      n.hasEdge(e[i], e[r]) && o++;
  return 2 * o / (s * (s - 1));
}
function he(n, t) {
  const e = n.getNeighbors(t);
  let s = 0;
  for (let o = 0; o < e.length; o++)
    for (let i = o + 1; i < e.length; i++)
      n.hasEdge(e[o], e[i]) && s++;
  return s;
}
function U(n) {
  const t = Math.sqrt(
    Object.values(n).reduce((e, s) => e + s * s, 0)
  );
  return t > 0 && Object.keys(n).forEach((e) => {
    n[e] /= t;
  }), n;
}
function Lt(n, t) {
  const e = Object.keys(n);
  let s = 0;
  for (const o of e)
    s += Math.abs((n[o] || 0) - (t[o] || 0));
  return s;
}
class ge extends E {
  constructor() {
    super("degree", "Number of connections per node", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "degreeCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class ue extends E {
  constructor(t = {}) {
    super("closeness", "Average distance to all other nodes (inverted)", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "closenessCompute"
    }), this.options = {
      normalized: t.normalized !== !1
    };
  }
  // calculate() inherited from base class - delegates to worker!
}
class me extends E {
  constructor(t = {}) {
    super("ego-density", "Density of connections among neighbors", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "egoDensityCompute"
    }), this.options = {
      radius: t.radius || 1
    };
  }
  // calculate() inherited from base class - delegates to worker!
}
class fe extends E {
  constructor() {
    super("betweenness", "Frequency on shortest paths between other nodes", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "betweennessCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class ye extends E {
  constructor() {
    super("clustering", "Local clustering coefficient", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "clusteringCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class pe extends E {
  constructor(t = {}) {
    super("eigenvector", "Importance based on neighbor importance", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "eigenvectorCompute"
    }), this.options = {
      maxIter: t.maxIter || 100,
      tolerance: t.tolerance || 1e-6
    };
  }
  // calculate() inherited from base class - delegates to worker!
}
class be extends E {
  constructor(t = {}) {
    super("pagerank", "PageRank importance score with damping", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "pageRankCompute"
    }), this.options = {
      dampingFactor: t.dampingFactor ?? 0.85,
      maxIter: t.maxIter ?? 100,
      tolerance: t.tolerance ?? 1e-6
    };
  }
  // calculate() inherited from base class - delegates to worker!
}
class Ie extends E {
  constructor(t = {}) {
    super("eigenvector-laplacian", "X,Y coordinates from Laplacian eigenvectors", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "eigenvectorLaplacianCompute"
    }), this.options = {
      maxIter: t.maxIter || 100,
      tolerance: t.tolerance || 1e-6
    };
  }
  // calculate() inherited from base class - delegates to worker!
}
class Ce extends E {
  constructor() {
    super("cliques", "Number of maximal cliques per node", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "cliquesCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
async function we(n, t, e, s) {
  const o = L(n), i = t || Array.from(o.nodes), r = {};
  return i.forEach((a, l) => {
    r[a] = o.degree(a), l % 100 === 0 && y(s, l / i.length);
  }), y(s, 1), r;
}
async function ve(n, t, e, s) {
  const o = L(n), i = t || Array.from(o.nodes), r = Array.from(o.nodes), a = {};
  r.forEach((d) => {
    a[d] = 0;
  }), i.forEach((d, c) => {
    const g = de(o, d);
    Ae(a, g, r, d), c % Math.max(1, Math.floor(i.length / 10)) === 0 && y(s, c / i.length);
  });
  const l = r.length, h = l > 2 ? 2 / ((l - 1) * (l - 2)) : 1;
  return r.forEach((d) => {
    a[d] *= h;
  }), y(s, 1), a;
}
function Ae(n, t, e, s) {
  const { pathCount: o, predecessors: i, stack: r } = t, a = /* @__PURE__ */ new Map();
  for (e.forEach((l) => {
    a.set(l, 0);
  }); r.length > 0; ) {
    const l = r.pop();
    (i.get(l) || []).forEach((d) => {
      const c = o.get(d) / o.get(l) * (1 + a.get(l));
      a.set(d, a.get(d) + c);
    }), l !== s && (n[l] += a.get(l));
  }
}
async function Ge(n, t, e, s) {
  const o = L(n), i = t || Array.from(o.nodes), r = {};
  return i.forEach((a, l) => {
    r[a] = Nt(o, a), l % 100 === 0 && y(s, l / i.length);
  }), y(s, 1), r;
}
async function Te(n, t, e, s) {
  const o = L(n), { maxIter: i = 100, tolerance: r = 1e-6 } = e || {}, a = Array.from(o.nodes), l = a.length;
  let h = {};
  a.forEach((d) => {
    h[d] = 1 / l;
  });
  for (let d = 0; d < i; d++) {
    const c = {};
    a.forEach((m) => {
      c[m] = 0;
    }), a.forEach((m) => {
      o.getNeighbors(m).forEach((p) => {
        const v = o.adjacencyMap.get(m).get(p);
        c[p] += h[m] * v;
      });
    }), U(c);
    const g = Lt(c, h);
    if (h = c, d % 10 === 0 && y(s, d / i), g < r)
      break;
  }
  return y(s, 1), h;
}
async function Pe(n, t, e, s) {
  const o = L(n), { dampingFactor: i = 0.85, maxIter: r = 100, tolerance: a = 1e-6 } = e || {}, l = Array.from(o.nodes), h = l.length;
  if (h === 0)
    return y(s, 1), {};
  let d = {};
  l.forEach((p) => {
    d[p] = 1 / h;
  });
  const c = {};
  l.forEach((p) => {
    c[p] = o.getNeighbors(p).length;
  });
  const g = l.filter((p) => c[p] === 0), m = (1 - i) / h;
  for (let p = 0; p < r; p++) {
    const v = {};
    let b = 0;
    g.forEach((w) => {
      b += d[w];
    });
    const A = i * b / h;
    l.forEach((w) => {
      v[w] = m + A;
    }), l.forEach((w) => {
      const x = o.getNeighbors(w);
      if (x.length > 0) {
        const P = i * d[w] / x.length;
        x.forEach((G) => {
          v[G] += P;
        });
      }
    });
    const C = Lt(v, d);
    if (d = v, p % 10 === 0 && y(s, p / r), C < a)
      break;
  }
  const u = Object.values(d).reduce((p, v) => p + v, 0);
  return u > 0 && l.forEach((p) => {
    d[p] /= u;
  }), y(s, 1), d;
}
async function xe(n, t, e, s) {
  const o = L(n), i = t || Array.from(o.nodes), r = {};
  return i.forEach((a, l) => {
    r[a] = he(o, a), l % 100 === 0 && y(s, l / i.length);
  }), y(s, 1), r;
}
async function We(n, t, e, s) {
  const o = L(n), i = t || Array.from(o.nodes), a = Array.from(o.nodes).length, l = {}, h = e?.normalized !== !1;
  return i.forEach((d, c) => {
    const g = /* @__PURE__ */ new Map(), m = [d], u = /* @__PURE__ */ new Set([d]);
    for (g.set(d, 0); m.length > 0; ) {
      const v = m.shift(), b = g.get(v);
      for (const A of o.getNeighbors(v))
        u.has(A) || (u.add(A), m.push(A), g.set(A, b + 1));
    }
    const p = g.size - 1;
    if (p === 0)
      l[d] = 0;
    else {
      const v = Array.from(g.values()).reduce((b, A) => b + A, 0);
      if (v === 0)
        l[d] = 0;
      else {
        const b = p / v;
        l[d] = h ? b * (p / (a - 1)) : b;
      }
    }
    c % 100 === 0 && y(s, c / i.length);
  }), y(s, 1), l;
}
async function Ze(n, t, e, s) {
  const o = L(n), i = t || Array.from(o.nodes), r = {};
  return i.forEach((a, l) => {
    const h = o.getNeighbors(a), d = h.length;
    if (d < 2)
      r[a] = 0;
    else {
      let c = 0;
      for (let m = 0; m < d; m++)
        for (let u = m + 1; u < d; u++)
          o.hasEdge(h[m], h[u]) && c++;
      const g = d * (d - 1) / 2;
      r[a] = c / g;
    }
    l % 100 === 0 && y(s, l / i.length);
  }), y(s, 1), r;
}
async function Xe(n, t, e, s) {
  const o = L(n), i = Array.from(o.nodes), r = i.length;
  if (r < 3) {
    const u = {};
    return i.forEach((p) => {
      u[p] = { laplacian_x: Math.random() * 2 - 1, laplacian_y: Math.random() * 2 - 1 };
    }), y(s, 1), u;
  }
  const { maxIter: a = 100, tolerance: l = 1e-6 } = e || {}, h = Array(r).fill(null).map(() => Array(r).fill(0)), d = /* @__PURE__ */ new Map();
  i.forEach((u, p) => d.set(u, p));
  for (let u = 0; u < r; u++) {
    const p = i[u], v = o.getNeighbors(p);
    h[u][u] = v.length, v.forEach((b) => {
      const A = d.get(b);
      A !== void 0 && (h[u][A] = -1);
    });
  }
  y(s, 0.2);
  const c = Array(r).fill(0).map(() => Math.random()), g = Array(r).fill(0).map(() => Math.random());
  U(c), U(g);
  for (let u = 0; u < a; u++) {
    const p = It(h, c);
    U(p);
    let v = 0;
    for (let b = 0; b < r; b++)
      v += Math.abs(p[b] - c[b]);
    if (v < l) break;
    for (let b = 0; b < r; b++)
      c[b] = p[b];
    u % 20 === 0 && y(s, 0.2 + u / a * 0.4);
  }
  y(s, 0.6), lt(g, c), U(g);
  for (let u = 0; u < a; u++) {
    const p = It(h, g);
    U(p), lt(p, c), lt(p, g), U(p);
    let v = 0;
    for (let b = 0; b < r; b++)
      v += Math.abs(p[b] - g[b]);
    if (v < l) break;
    for (let b = 0; b < r; b++)
      g[b] = p[b];
    u % 20 === 0 && y(s, 0.6 + u / a * 0.39);
  }
  y(s, 0.99);
  const m = {};
  return i.forEach((u, p) => {
    m[u] = {
      laplacian_x: c[p],
      laplacian_y: g[p]
    };
  }), y(s, 1), m;
}
function It(n, t) {
  const e = n.length, s = Array(e).fill(0);
  for (let o = 0; o < e; o++)
    for (let i = 0; i < e; i++)
      s[o] += n[o][i] * t[i];
  return s;
}
function lt(n, t) {
  let e = 0;
  for (let s = 0; s < n.length; s++)
    e += n[s] * t[s];
  for (let s = 0; s < n.length; s++)
    n[s] -= e * t[s];
}
const Et = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BetweennessStatistic: fe,
  CliquesStatistic: Ce,
  ClosenessStatistic: ue,
  ClusteringStatistic: ye,
  DegreeStatistic: ge,
  EgoDensityStatistic: me,
  EigenvectorLaplacianStatistic: Ie,
  EigenvectorStatistic: pe,
  PageRankStatistic: be,
  betweennessCompute: ve,
  cliquesCompute: xe,
  closenessCompute: We,
  clusteringCompute: Ge,
  degreeCompute: we,
  egoDensityCompute: Ze,
  eigenvectorCompute: Te,
  eigenvectorLaplacianCompute: Xe,
  pageRankCompute: Pe
}, Symbol.toStringTag, { value: "Module" }));
class ke extends E {
  constructor() {
    super("density", "Ratio of actual edges to possible edges", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "densityCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Me extends E {
  constructor() {
    super("diameter", "Longest shortest path in the graph", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "diameterCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Be extends E {
  constructor() {
    super("average_clustering", "Mean clustering coefficient across all nodes", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "averageClusteringCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Ne extends E {
  constructor() {
    super("average_shortest_path", "Mean distance between all node pairs", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "averageShortestPathCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Le extends E {
  constructor() {
    super("connected_components", "Number of disconnected subgraphs", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "connectedComponentsCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Ee extends E {
  constructor() {
    super("average_degree", "Mean number of connections per node", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "averageDegreeCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
async function Re(n, t, e, s) {
  const o = L(n), i = o.nodes.size, r = o.edges.length;
  if (i < 2)
    return 0;
  const a = i * (i - 1) / 2, l = r / a;
  return y(s, 1), l;
}
async function ze(n, t, e, s) {
  const o = L(n), i = Array.from(o.nodes);
  let r = 0;
  return i.forEach((a, l) => {
    const h = Bt(o, a);
    for (const d of h.values())
      d > r && (r = d);
    l % Math.max(1, Math.floor(i.length / 10)) === 0 && y(s, l / i.length);
  }), y(s, 1), r;
}
async function Fe(n, t, e, s) {
  const o = L(n), i = Array.from(o.nodes);
  let r = 0;
  return i.forEach((a, l) => {
    r += Nt(o, a), l % 100 === 0 && y(s, l / i.length);
  }), y(s, 1), i.length > 0 ? r / i.length : 0;
}
async function Je(n, t, e, s) {
  const o = L(n), i = Array.from(o.nodes);
  let r = 0, a = 0;
  return i.forEach((l, h) => {
    Bt(o, l).forEach((c, g) => {
      g !== l && (a += c, r++);
    }), h % Math.max(1, Math.floor(i.length / 10)) === 0 && y(s, h / i.length);
  }), y(s, 1), r > 0 ? a / r : 0;
}
async function Ke(n, t, e, s) {
  const o = L(n), i = Array.from(o.nodes), r = /* @__PURE__ */ new Set(), a = {};
  let l = 0;
  return i.forEach((h) => {
    if (!r.has(h)) {
      const d = [h];
      for (r.add(h), a[h] = l; d.length > 0; ) {
        const c = d.shift();
        for (const g of o.getNeighbors(c))
          r.has(g) || (r.add(g), d.push(g), a[g] = l);
      }
      l++;
    }
  }), y(s, 1), {
    count: l,
    components: a
  };
}
async function je(n, t, e, s) {
  const o = L(n), i = Array.from(o.nodes);
  let r = 0;
  return i.forEach((a) => {
    r += o.getNeighbors(a).length;
  }), y(s, 1), i.length > 0 ? r / i.length : 0;
}
const Rt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AverageClusteringStatistic: Be,
  AverageDegreeStatistic: Ee,
  AverageShortestPathStatistic: Ne,
  ConnectedComponentsStatistic: Le,
  DensityStatistic: ke,
  DiameterStatistic: Me,
  averageClusteringCompute: Fe,
  averageDegreeCompute: je,
  averageShortestPathCompute: Je,
  connectedComponentsCompute: Ke,
  densityCompute: Re,
  diameterCompute: ze
}, Symbol.toStringTag, { value: "Module" }));
class ut {
  /**
   * Create a community detection algorithm
   *
   * @param {string} name - Algorithm identifier (e.g., 'louvain', 'label-propagation')
   * @param {string} description - Human-readable description of the algorithm
   * @param {Object} computeConfig - Compute function configuration
   * @param {string} computeConfig.module - Module path containing compute function
   * @param {string} computeConfig.functionName - Name of compute function to call
   */
  constructor(t, e = "", s = null) {
    if (new.target === ut)
      throw new Error("CommunityAlgorithm is abstract and cannot be instantiated directly");
    if (!s || !s.module || !s.functionName)
      throw new Error("computeConfig with module and functionName is required");
    this.name = t, this.description = e, this.computeConfig = s, this.options = {};
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
  async detect(t, e = {}) {
    const s = tt.serializeGraph(t), o = {
      module: this.computeConfig.module,
      functionName: this.computeConfig.functionName,
      args: [s, this.options]
    };
    return {
      ...await tt.execute(o, e),
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
class Ct extends ut {
  /**
   * Create a Louvain algorithm instance
   *
   * @param {Object} [options={}] - Algorithm options
   * @param {number} [options.resolution=1.0] - Resolution parameter for modularity
   * @param {number} [options.maxIterations=100] - Maximum number of iterations
   */
  constructor(t = {}) {
    super(
      "louvain",
      "Louvain method for community detection using modularity optimization",
      {
        module: "../community/algorithms/louvain.js",
        functionName: "louvainCompute"
      }
    ), this.options = {
      resolution: t.resolution || 1,
      maxIterations: t.maxIterations || 100
    };
  }
  // detect() inherited from base class - delegates to worker!
}
async function Se(n, t, e) {
  const s = L(n), { resolution: o = 1, maxIterations: i = 100 } = t || {}, r = Array.from(s.nodes), a = (b) => {
    const A = s.getNeighbors(b);
    let C = 0;
    return A.forEach((w) => {
      C += s.getEdgeWeight(b, w);
    }), C;
  };
  let l = 0;
  s.edges.forEach((b) => {
    l += b.weight;
  });
  const h = 2 * l, d = {};
  r.forEach((b) => {
    d[b] = b;
  });
  let c = !0, g = 0;
  for (; c && g < i; ) {
    c = !1, g++;
    for (const b of r) {
      const A = d[b], C = s.getNeighbors(b), w = /* @__PURE__ */ new Set();
      C.forEach((M) => {
        w.add(d[M]);
      });
      const x = a(b);
      let P = A, G = 0;
      w.forEach((M) => {
        if (M === A) return;
        const X = Ye(
          s,
          b,
          A,
          M,
          d,
          h,
          o,
          x,
          a
        );
        X > G && (G = X, P = M);
      }), P !== A && (d[b] = P, c = !0);
    }
    if (y(e, Math.min(g / i, 0.9)), !c) break;
  }
  const m = Array.from(new Set(Object.values(d))), u = {};
  m.forEach((b, A) => {
    u[b] = A;
  });
  const p = {};
  Object.keys(d).forEach((b) => {
    p[b] = u[d[b]];
  });
  const v = Ve(s, p, l, a);
  return y(e, 1), {
    communities: p,
    modularity: v,
    numCommunities: m.length,
    iterations: g
  };
}
function Ye(n, t, e, s, o, i, r, a, l) {
  const h = n.getNeighbors(t);
  let d = 0, c = 0;
  h.forEach((v) => {
    const b = n.getEdgeWeight(t, v);
    o[v] === s && (d += b), o[v] === e && v !== t && (c += b);
  });
  const g = Array.from(n.nodes);
  let m = 0, u = 0;
  return g.forEach((v) => {
    o[v] === s && (m += l(v)), o[v] === e && (u += l(v));
  }), d / i - r * (m * a) / (i * i) - (c / i - r * (u * a) / (i * i));
}
function Ve(n, t, e, s) {
  if (e === 0) return 0;
  const o = 2 * e, i = new Set(Object.values(t));
  let r = 0;
  return i.forEach((a) => {
    let l = 0, h = 0;
    Object.keys(t).filter(
      (c) => t[c] === a
    ).forEach((c) => {
      h += s(c);
    }), n.edges.forEach((c) => {
      const g = c.u, m = c.v, u = c.weight;
      t[g] === a && t[m] === a && (l += u);
    }), r += l / o - Math.pow(h / o, 2);
  }), r;
}
const zt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  LouvainAlgorithm: Ct,
  default: Ct,
  louvainCompute: Se
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
  constructor(t, e = {}, s = null) {
    if (!t)
      throw new Error("Graph is required for layout computation");
    if (!s || !s.module || !s.functionName)
      throw new Error("computeConfig with module and functionName is required");
    this.graph = t, this.options = e, this.computeConfig = s, this._positions = null;
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
  async computePositions(t = {}) {
    const e = { ...this.options, ...t }, { onProgress: s, timeout: o, ...i } = e, r = tt.serializeGraph(this.graph), a = {
      module: this.computeConfig.module,
      functionName: this.computeConfig.functionName,
      args: [r, i]
    };
    return await tt.execute(a, {
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
  async getPositions(t = {}, e = !1) {
    return (!this._positions || e) && (this._positions = await this.computePositions(t)), this._positions;
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
  async updateLayout(t = 1) {
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
class wt extends V {
  /**
   * Create a random layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {number} [options.scale=100] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   * @param {number} [options.seed=null] - Random seed for reproducibility (null = non-deterministic)
   */
  constructor(t, e = {}) {
    super(t, {
      scale: 100,
      center: { x: 0, y: 0 },
      seed: null,
      ...e
    }, {
      module: "../layouts/random.js",
      functionName: "randomCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function He(n, t, e) {
  const s = Array.from(n.nodes || []), {
    scale: o = 1,
    center: i = { x: 0, y: 0 },
    seed: r = null
  } = t || {}, a = {};
  let l;
  return r !== null ? l = function(d) {
    return function() {
      let c = d += 1831565813;
      return c = Math.imul(c ^ c >>> 15, c | 1), c ^= c + Math.imul(c ^ c >>> 7, c | 61), ((c ^ c >>> 14) >>> 0) / 4294967296;
    };
  }(r) : l = Math.random, s.forEach((h) => {
    const d = (l() * 2 - 1) * o + i.x, c = (l() * 2 - 1) * o + i.y;
    a[h] = { x: d, y: c };
  }), y(e, 1), a;
}
const Ft = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  RandomLayout: wt,
  default: wt,
  randomCompute: He
}, Symbol.toStringTag, { value: "Module" }));
class vt extends V {
  /**
   * Create a circular layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {number} [options.scale=100] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   * @param {Function} [options.sortBy=null] - Optional sort function for node ordering
   */
  constructor(t, e = {}) {
    super(t, {
      scale: 100,
      center: { x: 0, y: 0 },
      sortBy: null,
      ...e
    }, {
      module: "../layouts/circular.js",
      functionName: "circularCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function Oe(n, t, e) {
  const s = L(n), {
    scale: o = 1,
    center: i = { x: 0, y: 0 },
    sortBy: r = null
  } = t || {};
  let a = Array.from(s.nodes);
  const l = a.length;
  if (l === 0)
    return y(e, 1), {};
  if (l === 1) {
    const d = { [a[0]]: { x: i.x, y: i.y } };
    return y(e, 1), d;
  }
  r && typeof r == "function" && (a = a.sort(r));
  const h = {};
  return a.forEach((d, c) => {
    const g = 2 * Math.PI * c / l;
    h[d] = {
      x: Math.cos(g) * o + i.x,
      y: Math.sin(g) * o + i.y
    };
  }), y(e, 1), h;
}
const Jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CircularLayout: vt,
  circularCompute: Oe,
  default: vt
}, Symbol.toStringTag, { value: "Module" }));
class At extends V {
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
  constructor(t, e = {}) {
    super(t, {
      scale: 100,
      center: { x: 0, y: 0 },
      resolution: 0.35,
      equidistant: !1,
      ...e
    }, {
      module: "../layouts/spiral.js",
      functionName: "spiralCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
function _e(n, t = 1) {
  if (n.length === 0) return n;
  let e = 1 / 0, s = -1 / 0, o = 1 / 0, i = -1 / 0;
  for (const [d, c] of n)
    e = Math.min(e, d), s = Math.max(s, d), o = Math.min(o, c), i = Math.max(i, c);
  const r = s - e || 1, a = i - o || 1, l = Math.max(r, a), h = 2 * t / l;
  return n.map(([d, c]) => [
    (d - e - r / 2) * h + t,
    (c - o - a / 2) * h + t
  ]);
}
async function Ue(n, t, e) {
  const s = Array.from(n.nodes || []), o = s.length, {
    scale: i = 1,
    center: r = { x: 0, y: 0 },
    resolution: a = 0.35,
    equidistant: l = !1
  } = t || {};
  if (o === 0)
    return y(e, 1), {};
  if (o === 1) {
    const c = { [s[0]]: { x: r.x, y: r.y } };
    return y(e, 1), c;
  }
  let h = [];
  if (l) {
    let g = 0.5, m = a;
    m += 1 / (g * m);
    for (let u = 0; u < o; u++) {
      const p = g * m;
      m += 1 / p, h.push([Math.cos(m) * p, Math.sin(m) * p]);
    }
  } else
    for (let c = 0; c < o; c++) {
      const g = a * c, m = c;
      h.push([Math.cos(g) * m, Math.sin(g) * m]);
    }
  h = _e(h, i);
  const d = {};
  return s.forEach((c, g) => {
    d[c] = {
      x: h[g][0] + r.x,
      y: h[g][1] + r.y
    };
  }), y(e, 1), d;
}
const Kt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SpiralLayout: At,
  default: At,
  spiralCompute: Ue
}, Symbol.toStringTag, { value: "Module" }));
class Gt extends V {
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
  constructor(t, e = {}) {
    super(t, {
      scale: 100,
      center: { x: 0, y: 0 },
      nlist: null,
      rotate: null,
      nodeProperties: null,
      // Map of node ID -> {degree, ...properties}
      ...e
    }, {
      module: "../layouts/shell.js",
      functionName: "shellCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function qe(n, t, e) {
  const s = Array.from(n.nodes || []), o = s.length, {
    scale: i = 1,
    center: r = { x: 0, y: 0 },
    nlist: a = null,
    rotate: l = null,
    nodeProperties: h = null
    // Map or Object of node ID -> {degree, ...properties}
  } = t || {}, d = h instanceof Map, c = h && typeof h == "object" && !d, g = d ? h.size > 0 : c ? Object.keys(h).length > 0 : !1, m = (w) => d ? h.get(w) : c ? h[w] : null;
  if (o === 0)
    return y(e, 1), {};
  if (o === 1) {
    const w = { [s[0]]: { x: r.x, y: r.y } };
    return y(e, 1), w;
  }
  let u;
  if (a && Array.isArray(a))
    u = a;
  else {
    let w = /* @__PURE__ */ new Map();
    if (g)
      s.forEach((G) => {
        const M = m(G), X = M && typeof M == "object" && M.degree || 0;
        w.set(G, X);
      });
    else if (s.forEach((G) => {
      w.set(G, 0);
    }), n.edges)
      for (const G of n.edges) {
        const M = G.u !== void 0 ? G.u : G.source !== void 0 ? G.source : G[0], X = G.v !== void 0 ? G.v : G.target !== void 0 ? G.target : G[1];
        w.has(M) && w.set(M, w.get(M) + 1), w.has(X) && w.set(X, w.get(X) + 1);
      }
    const x = /* @__PURE__ */ new Map();
    s.forEach((G) => {
      const M = w.get(G) || 0;
      x.has(M) || x.set(M, []), x.get(M).push(G);
    }), u = Array.from(x.keys()).sort((G, M) => M - G).map((G) => x.get(G));
  }
  const p = i / u.length;
  let v;
  u[0].length === 1 ? v = 0 : v = p;
  let b;
  l === null ? b = Math.PI / u.length : b = l;
  const A = {};
  let C = b;
  for (const w of u) {
    const x = w.length;
    if (x === 0) continue;
    const P = [];
    for (let G = 0; G < x; G++)
      P.push(2 * Math.PI * G / x + C);
    w.forEach((G, M) => {
      const X = P[M], Z = v * Math.cos(X) + r.x, N = v * Math.sin(X) + r.y;
      A[G] = { x: Z, y: N };
    }), v += p, C += b;
  }
  return y(e, 1), A;
}
const jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShellLayout: Gt,
  default: Gt,
  shellCompute: qe
}, Symbol.toStringTag, { value: "Module" }));
class Tt extends V {
  /**
   * Create a spectral layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {number} [options.scale=100] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   */
  constructor(t, e = {}) {
    super(t, {
      scale: 100,
      center: { x: 0, y: 0 },
      ...e
    }, {
      module: "../layouts/spectral.js",
      functionName: "spectralCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function Qe(n, t, e) {
  const s = Array.from(n.nodes || []), o = s.length;
  console.log("[spectralCompute] Starting with", o, "nodes"), console.log("[spectralCompute] Raw options:", t), console.log("[spectralCompute] Raw options keys:", t ? Object.keys(t) : "null"), console.log("[spectralCompute] nodeProperties in options:", t?.nodeProperties);
  const {
    scale: i = 1,
    center: r = { x: 0, y: 0 },
    nodeProperties: a = null
    // Map or Object of node ID -> {laplacian_x, laplacian_y}
  } = t || {}, l = a instanceof Map, h = a && typeof a == "object" && !l, d = l ? a.size > 0 : h ? Object.keys(a).length > 0 : !1;
  if (console.log(
    "[spectralCompute] nodeProperties:",
    l ? `Map with ${a.size} entries` : h ? `Object with ${Object.keys(a).length} entries` : "null"
  ), o === 0)
    return y(e, 1), {};
  if (o === 1) {
    const v = { [s[0]]: { x: r.x, y: r.y } };
    return y(e, 1), v;
  }
  const c = {}, g = [], m = (v) => l ? a.get(v) : h ? a[v] : null;
  console.log("[spectralCompute] Processing", o, "nodes for eigenvector extraction");
  const u = [];
  for (const v of s) {
    let b, A;
    if (d) {
      const C = m(v);
      C && C.laplacian_x !== void 0 && C.laplacian_y !== void 0 ? (b = C.laplacian_x, A = C.laplacian_y) : (u.push(v), b = (Math.random() - 0.5) * 0.1, A = (Math.random() - 0.5) * 0.1, console.log(`[spectralCompute] Node "${v}" missing laplacian data, using fallback position`));
    } else
      throw new Error(
        "Spectral layout requires eigenvector-laplacian stat. Include 'eigenvector-laplacian' in analyze() features."
      );
    g.push([b, A]);
  }
  u.length > 0 && console.log(`[spectralCompute] ${u.length} nodes missing laplacian data, used fallback positions`), console.log("[spectralCompute] Extracted", g.length, "coordinates. Sample:", g[0]), y(e, 0.5), console.log("[spectralCompute] Starting rescaleLayout...");
  const p = De(g, i);
  return console.log("[spectralCompute] Rescaled. Sample:", p[0]), y(e, 0.99), s.forEach((v, b) => {
    c[v] = {
      x: p[b][0] + r.x,
      y: p[b][1] + r.y
    };
  }), console.log("[spectralCompute] Created positions for", Object.keys(c).length, "nodes"), y(e, 1), console.log("[spectralCompute] Completed successfully"), c;
}
function De(n, t = 1) {
  if (n.length === 0) return n;
  let e = 1 / 0, s = -1 / 0, o = 1 / 0, i = -1 / 0;
  for (const [d, c] of n)
    e = Math.min(e, d), s = Math.max(s, d), o = Math.min(o, c), i = Math.max(i, c);
  const r = s - e || 1, a = i - o || 1, l = Math.max(r, a), h = 2 * t / l;
  return n.map(([d, c]) => [
    (d - e - r / 2) * h + t,
    (c - o - a / 2) * h + t
  ]);
}
const St = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SpectralLayout: Tt,
  default: Tt,
  spectralCompute: Qe
}, Symbol.toStringTag, { value: "Module" }));
function nt(n, t, e = 1, s = { x: 0, y: 0 }) {
  if (t.length === 0) return n;
  let o = 0, i = 0;
  t.forEach((c) => {
    o += n[c].x, i += n[c].y;
  });
  const r = o / t.length, a = i / t.length, l = {};
  t.forEach((c) => {
    l[c] = {
      x: n[c].x - r,
      y: n[c].y - a
    };
  });
  let h = 0;
  t.forEach((c) => {
    const g = Math.abs(l[c].x), m = Math.abs(l[c].y);
    h = Math.max(h, g, m);
  });
  const d = {};
  if (h > 0) {
    const c = e / h;
    t.forEach((g) => {
      d[g] = {
        x: l[g].x * c + s.x,
        y: l[g].y * c + s.y
      };
    });
  } else
    t.forEach((c) => {
      d[c] = { x: s.x, y: s.y };
    });
  return d;
}
class Pt extends V {
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
  constructor(t, e = {}) {
    super(t, {
      iterations: 50,
      k: null,
      scale: 1,
      center: { x: 0, y: 0 },
      initialPositions: null,
      threshold: 1e-4,
      ...e
    }, {
      module: "../layouts/force-directed.js",
      functionName: "forceDirectedCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function $e(n, t, e) {
  const s = L(n), {
    iterations: o = 50,
    k: i = null,
    scale: r = 1,
    center: a = { x: 0, y: 0 },
    initialPositions: l = null,
    threshold: h = 1e-4
  } = t || {}, d = Array.from(s.nodes), c = d.length;
  if (c === 0)
    return y(e, 1), {};
  if (c === 1) {
    const P = { [d[0]]: { x: a.x, y: a.y } };
    return y(e, 1), P;
  }
  let g = {};
  l ? g = { ...l } : d.forEach((P) => {
    g[P] = {
      x: Math.random(),
      y: Math.random()
    };
  });
  const m = i !== null ? i : Math.sqrt(1 / c);
  let u = 1 / 0, p = -1 / 0, v = 1 / 0, b = -1 / 0;
  d.forEach((P) => {
    const G = g[P];
    u = Math.min(u, G.x), p = Math.max(p, G.x), v = Math.min(v, G.y), b = Math.max(b, G.y);
  });
  let A = Math.max(p - u, b - v) * 0.1;
  const C = A / (o + 1), w = /* @__PURE__ */ new Map();
  d.forEach((P) => {
    const G = new Set(s.getNeighbors(P));
    w.set(P, G);
  });
  for (let P = 0; P < o; P++) {
    const G = {};
    d.forEach((X) => {
      G[X] = { x: 0, y: 0 };
    }), d.forEach((X) => {
      const Z = g[X];
      let N = 0, F = 0;
      d.forEach((R) => {
        if (R !== X) {
          const I = g[R], f = Z.x - I.x, W = Z.y - I.y;
          let k = Math.sqrt(f * f + W * W);
          k < 0.01 && (k = 0.01);
          const B = w.get(X).has(R), J = m * m / (k * k), S = B ? k / m : 0, O = J - S;
          N += f / k * O, F += W / k * O;
        }
      }), G[X] = { x: N, y: F };
    });
    let M = 0;
    if (d.forEach((X) => {
      const Z = G[X], N = Math.sqrt(Z.x * Z.x + Z.y * Z.y);
      if (N > 0) {
        const F = Math.max(N, 0.01), R = A / F;
        g[X].x += Z.x * R, g[X].y += Z.y * R, M += N;
      }
    }), A -= C, M / c < h) {
      y(e, 1);
      break;
    }
    P % 10 === 0 && y(e, P / o);
  }
  const x = nt(g, d, r, a);
  return y(e, 1), x;
}
const Yt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ForceDirectedLayout: Pt,
  default: Pt,
  forceDirectedCompute: $e
}, Symbol.toStringTag, { value: "Module" }));
class xt extends V {
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
  constructor(t, e = {}) {
    super(t, {
      iterations: 1e3,
      scale: 1,
      center: { x: 0, y: 0 },
      initialPositions: null,
      threshold: 1e-4,
      K: null,
      ...e
    }, {
      module: "../layouts/kamada-kawai.js",
      functionName: "kamadaKawaiCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function ts(n, t, e) {
  console.log("[Kamada-Kawai] Received graphData:", {
    hasNodes: "nodes" in n,
    nodesType: typeof n.nodes,
    nodesIsArray: Array.isArray(n.nodes),
    hasEdges: "edges" in n,
    edgesType: typeof n.edges,
    edgesIsArray: Array.isArray(n.edges)
  });
  const s = L(n);
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
    threshold: l = 1e-4,
    K: h = null
  } = t || {}, d = Array.from(s.nodes), c = d.length;
  if (console.log("[Kamada-Kawai] Nodes array:", {
    length: d.length,
    isArray: Array.isArray(d),
    sample: d.slice(0, 3)
  }), c === 0)
    return y(e, 1), {};
  if (c === 1) {
    const I = { [d[0]]: { x: r.x, y: r.y } };
    return y(e, 1), I;
  }
  y(e, 0.1), console.log("[Kamada-Kawai] About to compute all-pairs shortest paths:", {
    nodesLength: d.length,
    nodesIsArray: Array.isArray(d),
    nodesType: typeof d
  });
  let g;
  try {
    g = es(s, d), console.log("[Kamada-Kawai] All-pairs shortest paths computed successfully");
    let I = !1, f = !1, W = 0, k = 0;
    for (let B = 0; B < g.length; B++)
      for (let J = 0; J < g[B].length; J++)
        isFinite(g[B][J]) || (I = g[B][J] === 1 / 0, f = isNaN(g[B][J]), I && W++, f && k++);
    (W > 0 || k > 0) && console.warn("[Kamada-Kawai] Distances contain problematic values:", {
      infinityCount: W,
      nanCount: k,
      totalDistances: g.length * g[0].length,
      sample: g[0].slice(0, 5)
    });
  } catch (I) {
    throw console.error("[Kamada-Kawai] Error in computeAllPairsShortestPaths:", I.message, I.stack), I;
  }
  y(e, 0.3), console.log("[Kamada-Kawai] About to initialize positions");
  let m;
  try {
    m = ss(d, a), console.log("[Kamada-Kawai] Positions initialized successfully, pos:", {
      type: typeof m,
      isArray: Array.isArray(m),
      length: m?.length || "N/A"
    });
  } catch (I) {
    throw console.error("[Kamada-Kawai] Error in initializePositions:", I.message, I.stack), I;
  }
  const u = g.flat().filter((I) => isFinite(I) && I > 0);
  u.length === 0 && console.warn("[Kamada-Kawai] All distances are placeholder (disconnected)!");
  const p = u.length > 0 ? u.reduce((I, f) => Math.max(I, f), 0) : 1, v = Math.sqrt(c), b = v / p, A = h !== null ? h : c;
  console.log("[Kamada-Kawai] Distance matrix stats:", {
    totalPairs: g.flat().length,
    finitePairs: u.length,
    infinitePairs: g.flat().length - u.length,
    max_dij: p,
    L0: v,
    L: b,
    kkconst: A,
    isKvalFinite: isFinite(A) && isFinite(b),
    avgDij: u.reduce((I, f) => I + f, 0) / u.length
  }), y(e, 0.4);
  const C = Array(c).fill(null).map(() => Array(c).fill(0)), w = Array(c).fill(null).map(() => Array(c).fill(0));
  for (let I = 0; I < c; I++)
    for (let f = 0; f < c; f++) {
      if (I === f) continue;
      const W = g[I][f];
      C[I][f] = A / (W * W), w[I][f] = b * W;
    }
  if (c > 1) {
    const W = Math.sqrt(
      Math.pow(m[0][0] - m[1][0], 2) + Math.pow(m[0][1] - m[1][1], 2)
    );
    console.log("[Kamada-Kawai] Sample spring values:", {
      "graph_dist[0,1]": g[0][1],
      "spring_const_kij[0,1]": C[0][1].toExponential(4),
      "desired_dist_lij[0,1]": w[0][1].toFixed(4),
      initial_euclidean_dist: W.toFixed(4),
      stress_ratio: (W / w[0][1]).toFixed(4),
      force: (C[0][1] * Math.abs(W - w[0][1])).toExponential(4)
    });
  }
  const x = Array(c).fill(0), P = Array(c).fill(0);
  for (let I = 0; I < c; I++)
    for (let f = 0; f < c; f++) {
      if (f === I) continue;
      const W = m[I][0] - m[f][0], k = m[I][1] - m[f][1], B = Math.sqrt(W * W + k * k);
      B !== 0 && (x[I] += C[I][f] * (W - w[I][f] * W / B), P[I] += C[I][f] * (k - w[I][f] * k / B));
    }
  const G = x.map((I, f) => Math.sqrt(I * I + P[f] * P[f])), M = Math.max(...G), X = G.reduce((I, f) => I + f, 0) / c;
  console.log("[Kamada-Kawai] Initial gradient stats:", {
    maxEnergy: M.toFixed(4),
    avgEnergy: X.toFixed(4),
    threshold: Math.sqrt(l).toFixed(6)
  });
  for (let I = 0; I < o; I++) {
    let f = 0, W = -1;
    for (let T = 0; T < c; T++) {
      const z = x[T] * x[T] + P[T] * P[T];
      z > W && (f = T, W = z);
    }
    if (W < l) {
      console.log(`[Kamada-Kawai] Converged at iteration ${I}/${o} with max_delta ${Math.sqrt(W).toFixed(6)} (threshold: ${Math.sqrt(l).toFixed(6)})`);
      break;
    }
    y(e, 0.4 + 0.6 * (I + 1) / o), (I % 500 === 0 || I < 5 || I === o - 1) && console.log(`[Kamada-Kawai] Iteration ${I}/${o}: max_delta = ${Math.sqrt(W).toFixed(6)}, node ${f}`);
    const k = m[f][0], B = m[f][1];
    let J = 0, S = 0, O = 0;
    for (let T = 0; T < c; T++) {
      if (T === f) continue;
      const z = k - m[T][0], j = B - m[T][1], q = Math.sqrt(z * z + j * j);
      if (q === 0) continue;
      const Y = q * (z * z + j * j);
      J += C[f][T] * (1 - w[f][T] * j * j / Y), S += C[f][T] * w[f][T] * z * j / Y, O += C[f][T] * (1 - w[f][T] * z * z / Y);
    }
    let at = 0, ct = 0;
    const mt = 1e-13, et = x[f], st = P[f];
    if (et * et + st * st >= mt * mt) {
      const T = O * J - S * S;
      Math.abs(T) > 1e-10 ? (ct = (S * et - J * st) / T, at = (S * st - O * et) / T) : I < 5 && console.warn(`[Kamada-Kawai] Iteration ${I}: Singular matrix (det=${T.toExponential(2)}) for node ${f}`);
    } else I < 5 && console.warn(`[Kamada-Kawai] Iteration ${I}: Gradient too small for node ${f}`);
    I < 3 && f === 0 && console.log(`[Kamada-Kawai] Iteration ${I}, node ${f}:`, {
      A: J.toFixed(4),
      B: S.toFixed(4),
      C: O.toFixed(4),
      det: (O * J - S * S).toExponential(4),
      myD1: et.toFixed(4),
      myD2: st.toFixed(4),
      delta_x: at.toFixed(6),
      delta_y: ct.toFixed(6),
      old_pos: [k.toFixed(2), B.toFixed(2)]
    });
    const ft = k + at, yt = B + ct;
    x[f] = 0, P[f] = 0;
    for (let T = 0; T < c; T++) {
      if (T === f) continue;
      const z = k - m[T][0], j = B - m[T][1], q = Math.sqrt(z * z + j * j), Y = ft - m[T][0], Q = yt - m[T][1], ot = Math.sqrt(Y * Y + Q * Q);
      q === 0 || ot === 0 || (x[T] -= C[f][T] * (-z + w[f][T] * z / q), P[T] -= C[f][T] * (-j + w[f][T] * j / q), x[T] += C[f][T] * (-Y + w[f][T] * Y / ot), P[T] += C[f][T] * (-Q + w[f][T] * Q / ot), x[f] += C[f][T] * (Y - w[f][T] * Y / ot), P[f] += C[f][T] * (Q - w[f][T] * Q / ot));
    }
    m[f][0] = ft, m[f][1] = yt;
  }
  y(e, 0.95), console.log("[Kamada-Kawai] Before rescaling - preparing positions");
  const Z = {};
  d.forEach((I, f) => {
    Z[I] = {
      x: m[f][0],
      y: m[f][1]
    };
  });
  const N = d[0];
  console.log("[Kamada-Kawai] Sample positions BEFORE rescaling:", {
    sample: N,
    value: Z[N],
    allCount: Object.keys(Z).length,
    minMax: (() => {
      let I = 1 / 0, f = -1 / 0, W = 1 / 0, k = -1 / 0;
      return Object.values(Z).forEach((B) => {
        I = Math.min(I, B.x), f = Math.max(f, B.x), W = Math.min(W, B.y), k = Math.max(k, B.y);
      }), { minX: I, maxX: f, minY: W, maxY: k, rangeX: f - I, rangeY: k - W };
    })()
  }), console.log("[Kamada-Kawai] Calling rescaleLayout with correct signature, scale:", i, "center:", r);
  const F = nt(Z, d, i, r);
  console.log("[Kamada-Kawai] rescaleLayout completed successfully"), console.log("[Kamada-Kawai] Sample positions AFTER rescaling:", {
    sample: N,
    value: F[N],
    minMax: (() => {
      let I = 1 / 0, f = -1 / 0, W = 1 / 0, k = -1 / 0;
      return Object.values(F).forEach((B) => {
        I = Math.min(I, B.x), f = Math.max(f, B.x), W = Math.min(W, B.y), k = Math.max(k, B.y);
      }), { minX: I, maxX: f, minY: W, maxY: k, rangeX: f - I, rangeY: k - W };
    })()
  });
  const R = {};
  console.log("[Kamada-Kawai] Creating final positions dictionary");
  try {
    Object.entries(F).forEach(([W, k]) => {
      R[W] = {
        x: k.x,
        y: k.y
      };
    }), console.log("[Kamada-Kawai] Final positions dictionary created successfully, count:", Object.keys(R).length);
    const I = d.slice(0, 3), f = {};
    I.forEach((W) => {
      f[W] = R[W];
    }), console.log("[Kamada-Kawai] Sample final positions:", f);
  } catch (I) {
    throw console.error("[Kamada-Kawai] Error creating positions dictionary:", I.message), console.error("  rescaledDict:", F), I;
  }
  return y(e, 1), R;
}
function es(n, t) {
  const e = t.length, s = Array(e).fill(null).map(() => Array(e).fill(1 / 0)), o = {};
  t.forEach((r, a) => {
    o[r] = a, s[a][a] = 0;
  });
  for (let r = 0; r < e; r++) {
    const a = t[r], l = [[a, 0]], h = /* @__PURE__ */ new Set([a]);
    for (; l.length > 0; ) {
      const [d, c] = l.shift(), g = o[d];
      g !== void 0 && (s[r][g] = c);
      const m = n.getNeighbors(d) || [];
      for (const u of m)
        h.has(u) || (h.add(u), l.push([u, c + 1]));
    }
  }
  let i = 0;
  for (let r = 0; r < e; r++)
    for (let a = r + 1; a < e; a++)
      isFinite(s[r][a]) && s[r][a] > i && (i = s[r][a]);
  for (let r = 0; r < e; r++)
    for (let a = 0; a < e; a++)
      s[r][a] > i && (s[r][a] = i);
  return s;
}
function ss(n, t) {
  const e = n.length, s = [];
  if (t && Object.keys(t).length > 0)
    n.forEach((o) => {
      const i = t[o];
      i ? s.push([i.x || 0, i.y || 0]) : s.push([Math.random(), Math.random()]);
    });
  else {
    const o = Math.sqrt(e);
    if (e > 100) {
      const i = o * 3;
      console.log(`[Kamada-Kawai] Random initialization: spread=${i.toFixed(2)}, L0=${o.toFixed(2)}`);
      for (let r = 0; r < e; r++) {
        const a = (Math.random() - 0.5) * i, l = (Math.random() - 0.5) * i;
        s.push([a, l]);
      }
    } else {
      const i = 2 * Math.PI / e, r = o * 2;
      console.log(`[Kamada-Kawai] Circular initialization: radius=${r.toFixed(2)}, L0=${o.toFixed(2)}`);
      for (let a = 0; a < e; a++) {
        const l = r * Math.cos(a * i), h = r * Math.sin(a * i);
        s.push([l, h]);
      }
    }
  }
  return s;
}
const Vt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KamadaKawaiLayout: xt,
  default: xt,
  kamadaKawaiCompute: ts
}, Symbol.toStringTag, { value: "Module" }));
class Wt extends V {
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
  constructor(t, e = {}) {
    super(t, {
      partition: null,
      align: "vertical",
      scale: 1,
      aspectRatio: 4 / 3,
      center: { x: 0, y: 0 },
      ...e
    }, {
      module: "../layouts/bipartite.js",
      functionName: "bipartiteCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function os(n, t, e) {
  const s = L(n), {
    partition: o = null,
    align: i = "vertical",
    scale: r = 1,
    aspectRatio: a = 4 / 3,
    center: l = { x: 0, y: 0 }
  } = t || {}, h = Array.from(s.nodes), d = h.length;
  if (d === 0)
    return y(e, 1), {};
  if (d === 1) {
    const Z = { [h[0]]: { x: l.x, y: l.y } };
    return y(e, 1), Z;
  }
  y(e, 0.3);
  let c, g;
  o && o.length > 0 ? (c = new Set(o), g = new Set(h.filter((Z) => !c.has(Z)))) : (c = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set(), h.forEach((Z, N) => {
    N % 2 === 0 ? c.add(Z) : g.add(Z);
  })), y(e, 0.5);
  const m = Array.from(c), u = Array.from(g), p = [], v = m.length - 1 || 1, b = u.length - 1 || 1, A = a * 2, C = 2, w = A / 2, x = C / 2;
  m.forEach((Z, N) => {
    const F = -w, R = v > 0 ? N * C / v - x : 0;
    p.push([F, R]);
  }), u.forEach((Z, N) => {
    const F = w, R = b > 0 ? N * C / b - x : 0;
    p.push([F, R]);
  }), y(e, 0.7);
  const P = [...m, ...u], G = {};
  P.forEach((Z, N) => {
    G[Z] = {
      x: p[N][0],
      y: p[N][1]
    };
  });
  const M = nt(G, P, r, l);
  y(e, 0.9);
  const X = {};
  return P.forEach((Z) => {
    X[Z] = M[Z];
  }), i === "horizontal" && Object.keys(X).forEach((Z) => {
    const N = X[Z].x;
    X[Z].x = X[Z].y, X[Z].y = N;
  }), y(e, 1), X;
}
const Ht = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BipartiteLayout: Wt,
  bipartiteCompute: os,
  default: Wt
}, Symbol.toStringTag, { value: "Module" }));
class Zt extends V {
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
  constructor(t, e = {}) {
    super(t, {
      subsets: null,
      align: "vertical",
      scale: 1,
      center: { x: 0, y: 0 },
      ...e
    }, {
      module: "../layouts/multipartite.js",
      functionName: "multipartiteCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function ns(n, t, e) {
  const s = L(n), {
    subsets: o = null,
    align: i = "vertical",
    scale: r = 1,
    center: a = { x: 0, y: 0 }
  } = t || {}, l = Array.from(s.nodes), h = l.length;
  if (h === 0)
    return y(e, 1), {};
  if (h === 1) {
    const A = { [l[0]]: { x: a.x, y: a.y } };
    return y(e, 1), A;
  }
  y(e, 0.3);
  let d;
  if (o && Object.keys(o).length > 0)
    d = Object.keys(o).sort((C, w) => {
      const x = parseInt(C), P = parseInt(w);
      return isNaN(x) ? 1 : isNaN(P) ? -1 : x - P;
    }).map((C) => o[C]);
  else {
    const A = /* @__PURE__ */ new Map();
    l.forEach((C, w) => {
      const x = w % 3;
      A.has(x) || A.set(x, []), A.get(x).push(C);
    }), d = Array.from(A.values());
  }
  y(e, 0.5);
  const c = [], g = {}, m = d.length, u = m * 2 - 1;
  d.forEach((A, C) => {
    const w = A.length - 1 || 1, x = (C * 2 - u / 2) / (m - 1 || 1);
    A.forEach((P, G) => {
      const M = w > 0 ? 2 * G / w - 1 : 0;
      c.push([x, M]);
    });
  }), y(e, 0.7);
  const p = [];
  d.forEach((A) => {
    A.forEach((C) => {
      p.push(C);
    });
  });
  const v = {};
  p.forEach((A, C) => {
    v[A] = {
      x: c[C][0],
      y: c[C][1]
    };
  });
  const b = nt(v, p, r, a);
  return y(e, 0.9), p.forEach((A) => {
    g[A] = b[A];
  }), i === "horizontal" && Object.keys(g).forEach((A) => {
    const C = g[A].x;
    g[A].x = g[A].y, g[A].y = C;
  }), y(e, 1), g;
}
const Ot = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MultipartiteLayout: Zt,
  default: Zt,
  multipartiteCompute: ns
}, Symbol.toStringTag, { value: "Module" }));
class Xt extends V {
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
  constructor(t, e = {}) {
    super(t, {
      startNode: null,
      align: "vertical",
      scale: 1,
      center: { x: 0, y: 0 },
      ...e
    }, {
      module: "../layouts/bfs.js",
      functionName: "bfsCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function is(n, t, e) {
  const s = L(n), {
    startNode: o = null,
    align: i = "vertical",
    scale: r = 1,
    center: a = { x: 0, y: 0 }
  } = t || {}, l = Array.from(s.nodes), h = l.length;
  if (h === 0)
    return y(e, 1), {};
  if (h === 1) {
    const C = { [l[0]]: { x: a.x, y: a.y } };
    return y(e, 1), C;
  }
  y(e, 0.2);
  let d = o;
  (!d || !l.includes(d)) && (d = l[0]), y(e, 0.3);
  const c = rs(s, d);
  y(e, 0.6);
  const g = /* @__PURE__ */ new Set();
  if (c.forEach((C) => {
    C.forEach((w) => g.add(w));
  }), g.size !== h) {
    const C = l.filter((w) => !g.has(w));
    C.length > 0 && c.push(C);
  }
  y(e, 0.7);
  const m = [], u = c.length;
  Math.max(...c.map((C) => C.length)), c.forEach((C, w) => {
    const x = u > 1 ? 2 * w / (u - 1) - 1 : 0, P = C.length - 1 || 1;
    C.forEach((G, M) => {
      const X = P > 0 ? 2 * M / P - 1 : 0;
      m.push([x, X]);
    });
  }), y(e, 0.85);
  const p = [];
  c.forEach((C) => {
    C.forEach((w) => {
      p.push(w);
    });
  });
  const v = {};
  p.forEach((C, w) => {
    v[C] = {
      x: m[w][0],
      y: m[w][1]
    };
  });
  const b = nt(v, p, r, a);
  y(e, 0.95);
  const A = {};
  return p.forEach((C) => {
    A[C] = b[C];
  }), i === "horizontal" && Object.keys(A).forEach((C) => {
    const w = A[C].x;
    A[C].x = A[C].y, A[C].y = w;
  }), y(e, 1), A;
}
function rs(n, t, e) {
  const s = [], o = /* @__PURE__ */ new Set(), i = [t];
  let r = [];
  for (o.add(t); i.length > 0; ) {
    const c = i.shift();
    r.push(c);
    const m = (n.getNeighbors(c) || []).filter((u) => !o.has(u));
    m.forEach((u) => {
      o.add(u), i.push(u);
    }), (i.length === 0 || m.length > 0) && r.length > 0 && (s.push([...r]), r = []);
  }
  s.length = 0, r = [];
  const a = /* @__PURE__ */ new Map(), l = [t];
  let h = 0;
  a.set(t, 0);
  let d = 0;
  for (; h < l.length; ) {
    const c = l[h], g = a.get(c);
    g > d && (r.length > 0 && (s.push([...r]), r = []), d = g), r.push(c), (n.getNeighbors(c) || []).forEach((u) => {
      a.has(u) || (a.set(u, g + 1), l.push(u));
    }), h++;
  }
  return r.length > 0 && s.push([...r]), s;
}
const _t = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BFSLayout: Xt,
  bfsCompute: is,
  default: Xt
}, Symbol.toStringTag, { value: "Module" })), it = rt({
  prefix: "network-worker",
  level: "info"
  // Workers default to info level
}), dt = {
  // Node-level statistics (all in one file)
  "../statistics/algorithms/node-stats.js": Et,
  // Graph-level statistics
  "../statistics/algorithms/graph-stats.js": Rt,
  // Community
  "../community/algorithms/louvain.js": zt,
  // Layouts
  "../layouts/random.js": Ft,
  "../layouts/circular.js": Jt,
  "../layouts/spiral.js": Kt,
  "../layouts/shell.js": jt,
  "../layouts/spectral.js": St,
  "../layouts/force-directed.js": Yt,
  "../layouts/kamada-kawai.js": Vt,
  "../layouts/bipartite.js": Ht,
  "../layouts/multipartite.js": Ot,
  "../layouts/bfs.js": _t
};
self.onmessage = async function(n) {
  const { id: t, module: e, functionName: s, args: o = [] } = n.data;
  try {
    if (!e || !s)
      throw new Error("Invalid task: module and functionName are required");
    it.debug("Processing task", {
      id: t,
      module: e,
      functionName: s,
      argsLength: o?.length || 0
    });
    const i = (h) => {
      self.postMessage({
        id: t,
        status: "progress",
        progress: Math.min(Math.max(h, 0), 1)
        // Clamp to [0, 1]
      });
    }, r = dt[e];
    if (!r)
      throw new Error(
        `Module '${e}' not found in registry. Available modules: ${Object.keys(dt).join(", ")}`
      );
    const a = r[s];
    if (!a || typeof a != "function")
      throw new Error(
        `Function '${s}' not found in module '${e}'. Available functions: ${Object.keys(r).join(", ")}`
      );
    const l = await a(...o, i);
    self.postMessage({
      id: t,
      status: "complete",
      result: l
    });
  } catch (i) {
    it.error("Task failed", {
      id: t,
      error: i.message,
      stack: i.stack
    }), self.postMessage({
      id: t,
      status: "error",
      error: i.message || "Unknown error",
      stack: i.stack
    });
  }
};
self.onerror = function(n) {
  it.error("Worker error", {
    error: n.message || "Worker error occurred",
    stack: n.stack
  }), self.postMessage({
    status: "error",
    error: n.message || "Worker error occurred"
  });
};
it.info("Initialized", { moduleCount: Object.keys(dt).length });
const ht = {
  // Node-level statistics (all in one file)
  "../statistics/algorithms/node-stats.js": Et,
  // Graph-level statistics
  "../statistics/algorithms/graph-stats.js": Rt,
  // Community
  "../community/algorithms/louvain.js": zt,
  // Layouts
  "../layouts/random.js": Ft,
  "../layouts/circular.js": Jt,
  "../layouts/spiral.js": Kt,
  "../layouts/shell.js": jt,
  "../layouts/spectral.js": St,
  "../layouts/force-directed.js": Yt,
  "../layouts/kamada-kawai.js": Vt,
  "../layouts/bipartite.js": Ht,
  "../layouts/multipartite.js": Ot,
  "../layouts/bfs.js": _t
};
async function as(n) {
  const { module: t, functionName: e, args: s = [] } = n;
  if (!t || !e)
    throw new Error("Invalid task: module and functionName are required");
  const o = ht[t];
  if (!o)
    throw new Error(
      `Module '${t}' not found in registry. Available modules: ${Object.keys(ht).join(", ")}`
    );
  const i = o[e];
  if (!i || typeof i != "function")
    throw new Error(
      `Function '${e}' not found in module '${t}'. Available functions: ${Object.keys(o).join(", ")}`
    );
  const r = () => {
  };
  return await i(...s, r);
}
const cs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MODULE_REGISTRY: ht,
  executeTask: as
}, Symbol.toStringTag, { value: "Module" }));
//# sourceMappingURL=network-worker.js.map
