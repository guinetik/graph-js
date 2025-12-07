const Q = {
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  TRACE: 5
}, se = "info", pt = "sandbox_logging_filters", bt = ["themeswitcher", "codemirroreditor", "editoradapter"];
class oe {
  /**
   * Creates a new Logger instance
   * @param {object} options - Logger configuration options
   * @param {boolean} [options.enabled=true] - Whether logging is enabled
   * @param {string} [options.level='info'] - Log level (error, warn, info, debug, trace)
   * @param {string} [options.prefix=''] - Prefix to add to all log messages
   * @param {boolean} [options.redactSecrets=false] - Whether to redact potential secrets
   * @param {boolean} [options.showTimestamp=true] - Whether to show timestamps in logs
   * @param {string} [options.format='[{timestamp}] [{prefix}] {message}'] - Format string with placeholders: {timestamp}, {prefix}, {message}
   * @param {object} [options.loggingManager] - LoggingManager instance for component filtering
   * @param {object} [options.console=console] - Console object to use
   */
  constructor(t = {}) {
    this.enabled = t.enabled !== !1, this.level = t.level || se, this.prefix = t.prefix || "", this.component = this.prefix, this.redactSecrets = t.redactSecrets || !1, this.showTimestamp = t.showTimestamp !== !1, this.format = t.format || "[{timestamp}] [{prefix}] {message}", this.currentLevel = Q[this.level.toUpperCase()] ?? Q.INFO, this.loggingManager = t.loggingManager, this.console = t.console || console, this.component && this.loggingManager && this.loggingManager.registerComponent(this.component);
  }
  /**
   * Checks if a message should be logged based on current level, enabled state, and component filter
   * @param {string} level - The log level to check
   * @returns {boolean} True if the message should be logged
   */
  shouldLog(t) {
    if (t.toUpperCase() === "ERROR")
      return this.enabled && Q[t.toUpperCase()] <= this.currentLevel;
    const e = !this.component || !this.loggingManager || this.loggingManager.isComponentEnabled(this.component);
    return this.enabled && e && Q[t.toUpperCase()] <= this.currentLevel;
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
   * Gets a timestamp string in ISO format
   * @returns {string} Formatted timestamp
   */
  getTimestamp() {
    return (/* @__PURE__ */ new Date()).toISOString();
  }
  /**
   * Formats a message with prefix and optional timestamp
   * @param {string} message - The message to format
   * @param {...any} args - Additional arguments
   * @returns {Array} Formatted message array
   */
  formatMessage(t, ...e) {
    const s = this.showTimestamp ? this.getTimestamp() : "", o = this.prefix;
    let r = this.format.replace("{timestamp}", s).replace("{prefix}", o).replace("{message}", t);
    this.showTimestamp || (r = r.replace(/\s*\[?\]\s*/g, " ").replace(/\s+/g, " ").trim());
    const i = this.redactArgs(e);
    return [r, ...i];
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
    this.level = t, this.currentLevel = Q[t.toUpperCase()] ?? Q.INFO;
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
class ne {
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
class zt {
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
class ie extends zt {
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
class re extends zt {
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
function ae() {
  return typeof localStorage < "u" ? new re() : new ie();
}
class Nt {
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
class ce extends Nt {
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
class le extends Nt {
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
function de() {
  return typeof window < "u" ? new ce() : new le();
}
const he = ae(), It = de(), _ = new ne({
  storage: he,
  console
});
if (typeof window < "u") {
  const n = {
    enable: (...t) => _.enable(...t),
    disable: (...t) => _.disable(...t),
    enableAll: () => _.enableAll(),
    disableAll: () => _.disableAll(),
    status: () => _.status(),
    list: () => _.listComponents()
  };
  It.setGlobalProperty("logFilter", n), It.setGlobalProperty("loggerjs", n);
}
function rt(n = {}) {
  return new oe({
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
      return new ge(t);
    if (typeof Worker < "u")
      return new ut(t);
    if (typeof require < "u")
      try {
        return require.resolve("worker_threads"), new ue(t);
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
class ut extends $ {
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
    return new ut(s);
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
class ue extends $ {
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
class ge extends $ {
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
    const { executeTask: e } = await Promise.resolve().then(() => Gs);
    return e(t);
  }
}
class fe {
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
    return typeof window < "u" ? new URL("data:text/javascript;base64,LyoqCiAqIE5ldHdvcmsgV29ya2VyIC0gRXhlY3V0ZXMgY29tcHV0ZSBmdW5jdGlvbnMgZnJvbSBhbGdvcml0aG0gbW9kdWxlcwogKgogKiAqKkJ1bmRsZXItRnJpZW5kbHkgQXJjaGl0ZWN0dXJlOioqCiAqIC0gU3RhdGljYWxseSBpbXBvcnRzIGFsbCBhbGdvcml0aG0gbW9kdWxlcyB1cGZyb250CiAqIC0gQ3JlYXRlcyBhIHJlZ2lzdHJ5IHRoYXQgbWFwcyBtb2R1bGUgcGF0aHMgdG8gdGhlaXIgZXhwb3J0cwogKiAtIE1haW4gdGhyZWFkIHNlbmRzOiB7IGlkLCBtb2R1bGUsIGZ1bmN0aW9uTmFtZSwgYXJncyB9CiAqIC0gV29ya2VyIGxvb2tzIHVwIG1vZHVsZSBmcm9tIHJlZ2lzdHJ5IGFuZCBleGVjdXRlcyBmdW5jdGlvbgogKgogKiBUaGlzIGFwcHJvYWNoIHdvcmtzIHdpdGggYWxsIGJ1bmRsZXJzIChWaXRlLCBXZWJwYWNrLCBSb2xsdXApIGJlY2F1c2UKICogaW1wb3J0cyBhcmUga25vd24gYXQgYnVpbGQgdGltZS4KICoKICogQG1vZHVsZSBuZXR3b3JrLXdvcmtlcgogKi8KCmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJ0BndWluZXRpay9sb2dnZXInOwoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBTVEFUSUMgSU1QT1JUUyAtIEFsbCBhbGdvcml0aG0gbW9kdWxlcyBpbXBvcnRlZCB1cGZyb250Ci8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCi8vIENyZWF0ZSBsb2dnZXIgZm9yIHdvcmtlciAocnVucyBpbiBzZXBhcmF0ZSBjb250ZXh0LCBubyB3aW5kb3cubG9nRmlsdGVyKQpjb25zdCBsb2cgPSBjcmVhdGVMb2dnZXIoewogIHByZWZpeDogJ25ldHdvcmstd29ya2VyJywKICBsZXZlbDogJ2luZm8nIC8vIFdvcmtlcnMgZGVmYXVsdCB0byBpbmZvIGxldmVsCn0pOwoKLy8gU3RhdGlzdGljcyBhbGdvcml0aG1zIChub2RlLWxldmVsIGFuZCBncmFwaC1sZXZlbCkKaW1wb3J0ICogYXMgbm9kZVN0YXRzQ29tcHV0ZSBmcm9tICcuLi9zdGF0aXN0aWNzL2FsZ29yaXRobXMvbm9kZS1zdGF0cy5qcyc7CmltcG9ydCAqIGFzIGdyYXBoU3RhdHNDb21wdXRlIGZyb20gJy4uL3N0YXRpc3RpY3MvYWxnb3JpdGhtcy9ncmFwaC1zdGF0cy5qcyc7CgovLyBDb21tdW5pdHkgZGV0ZWN0aW9uIGFsZ29yaXRobXMKaW1wb3J0ICogYXMgbG91dmFpbkNvbXB1dGUgZnJvbSAnLi4vY29tbXVuaXR5L2FsZ29yaXRobXMvbG91dmFpbi5qcyc7CgovLyBMYXlvdXQgYWxnb3JpdGhtcwppbXBvcnQgKiBhcyByYW5kb21Db21wdXRlIGZyb20gJy4uL2xheW91dHMvcmFuZG9tLmpzJzsKaW1wb3J0ICogYXMgY2lyY3VsYXJDb21wdXRlIGZyb20gJy4uL2xheW91dHMvY2lyY3VsYXIuanMnOwppbXBvcnQgKiBhcyBzcGlyYWxDb21wdXRlIGZyb20gJy4uL2xheW91dHMvc3BpcmFsLmpzJzsKaW1wb3J0ICogYXMgc2hlbGxDb21wdXRlIGZyb20gJy4uL2xheW91dHMvc2hlbGwuanMnOwppbXBvcnQgKiBhcyBzcGVjdHJhbENvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9zcGVjdHJhbC5qcyc7CmltcG9ydCAqIGFzIGZvcmNlRGlyZWN0ZWRDb21wdXRlIGZyb20gJy4uL2xheW91dHMvZm9yY2UtZGlyZWN0ZWQuanMnOwppbXBvcnQgKiBhcyBrYW1hZGFLYXdhaUNvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9rYW1hZGEta2F3YWkuanMnOwppbXBvcnQgKiBhcyBiaXBhcnRpdGVDb21wdXRlIGZyb20gJy4uL2xheW91dHMvYmlwYXJ0aXRlLmpzJzsKaW1wb3J0ICogYXMgbXVsdGlwYXJ0aXRlQ29tcHV0ZSBmcm9tICcuLi9sYXlvdXRzL211bHRpcGFydGl0ZS5qcyc7CmltcG9ydCAqIGFzIGJmc0NvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9iZnMuanMnOwppbXBvcnQgKiBhcyBkZnNDb21wdXRlIGZyb20gJy4uL2xheW91dHMvZGZzLmpzJzsKaW1wb3J0ICogYXMgcmFkaWFsQ29tcHV0ZSBmcm9tICcuLi9sYXlvdXRzL3JhZGlhbC5qcyc7CmltcG9ydCAqIGFzIGZvcmNlRGlyZWN0ZWQzRENvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9mb3JjZS1kaXJlY3RlZC0zZC5qcyc7CgovLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ci8vIE1PRFVMRSBSRUdJU1RSWSAtIE1hcHMgbW9kdWxlIHBhdGhzIHRvIHRoZWlyIGV4cG9ydHMKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKY29uc3QgTU9EVUxFX1JFR0lTVFJZID0gewogIC8vIE5vZGUtbGV2ZWwgc3RhdGlzdGljcyAoYWxsIGluIG9uZSBmaWxlKQogICcuLi9zdGF0aXN0aWNzL2FsZ29yaXRobXMvbm9kZS1zdGF0cy5qcyc6IG5vZGVTdGF0c0NvbXB1dGUsCgogIC8vIEdyYXBoLWxldmVsIHN0YXRpc3RpY3MKICAnLi4vc3RhdGlzdGljcy9hbGdvcml0aG1zL2dyYXBoLXN0YXRzLmpzJzogZ3JhcGhTdGF0c0NvbXB1dGUsCgogIC8vIENvbW11bml0eQogICcuLi9jb21tdW5pdHkvYWxnb3JpdGhtcy9sb3V2YWluLmpzJzogbG91dmFpbkNvbXB1dGUsCgogIC8vIExheW91dHMKICAnLi4vbGF5b3V0cy9yYW5kb20uanMnOiByYW5kb21Db21wdXRlLAogICcuLi9sYXlvdXRzL2NpcmN1bGFyLmpzJzogY2lyY3VsYXJDb21wdXRlLAogICcuLi9sYXlvdXRzL3NwaXJhbC5qcyc6IHNwaXJhbENvbXB1dGUsCiAgJy4uL2xheW91dHMvc2hlbGwuanMnOiBzaGVsbENvbXB1dGUsCiAgJy4uL2xheW91dHMvc3BlY3RyYWwuanMnOiBzcGVjdHJhbENvbXB1dGUsCiAgJy4uL2xheW91dHMvZm9yY2UtZGlyZWN0ZWQuanMnOiBmb3JjZURpcmVjdGVkQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9rYW1hZGEta2F3YWkuanMnOiBrYW1hZGFLYXdhaUNvbXB1dGUsCiAgJy4uL2xheW91dHMvYmlwYXJ0aXRlLmpzJzogYmlwYXJ0aXRlQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9tdWx0aXBhcnRpdGUuanMnOiBtdWx0aXBhcnRpdGVDb21wdXRlLAogICcuLi9sYXlvdXRzL2Jmcy5qcyc6IGJmc0NvbXB1dGUsCiAgJy4uL2xheW91dHMvZGZzLmpzJzogZGZzQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9yYWRpYWwuanMnOiByYWRpYWxDb21wdXRlLAogICcuLi9sYXlvdXRzL2ZvcmNlLWRpcmVjdGVkLTNkLmpzJzogZm9yY2VEaXJlY3RlZDNEQ29tcHV0ZQp9OwoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBXT1JLRVIgTUVTU0FHRSBIQU5ETEVSCi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCi8qKgogKiBNYWluIG1lc3NhZ2UgaGFuZGxlciAtIHJlY2VpdmVzIHRhc2tzIGFuZCBkZWxlZ2F0ZXMgdG8gYWxnb3JpdGhtIG1vZHVsZXMKICovCnNlbGYub25tZXNzYWdlID0gYXN5bmMgZnVuY3Rpb24oZXZlbnQpIHsKICBjb25zdCB7IGlkLCBtb2R1bGUsIGZ1bmN0aW9uTmFtZSwgYXJncyA9IFtdIH0gPSBldmVudC5kYXRhOwoKICB0cnkgewogICAgLy8gVmFsaWRhdGUgbWVzc2FnZSBmb3JtYXQKICAgIGlmICghbW9kdWxlIHx8ICFmdW5jdGlvbk5hbWUpIHsKICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRhc2s6IG1vZHVsZSBhbmQgZnVuY3Rpb25OYW1lIGFyZSByZXF1aXJlZCcpOwogICAgfQoKICAgIGxvZy5kZWJ1ZygnUHJvY2Vzc2luZyB0YXNrJywgewogICAgICBpZCwKICAgICAgbW9kdWxlLAogICAgICBmdW5jdGlvbk5hbWUsCiAgICAgIGFyZ3NMZW5ndGg6IGFyZ3M/Lmxlbmd0aCB8fCAwCiAgICB9KTsKCiAgICAvLyBDcmVhdGUgcHJvZ3Jlc3MgY2FsbGJhY2sgdGhhdCByZXBvcnRzIGJhY2sgdG8gbWFpbiB0aHJlYWQKICAgIGNvbnN0IHByb2dyZXNzQ2FsbGJhY2sgPSAocHJvZ3Jlc3MpID0+IHsKICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7CiAgICAgICAgaWQsCiAgICAgICAgc3RhdHVzOiAncHJvZ3Jlc3MnLAogICAgICAgIHByb2dyZXNzOiBNYXRoLm1pbihNYXRoLm1heChwcm9ncmVzcywgMCksIDEpIC8vIENsYW1wIHRvIFswLCAxXQogICAgICB9KTsKICAgIH07CgogICAgLy8gTG9vayB1cCBhbGdvcml0aG0gbW9kdWxlIGZyb20gcmVnaXN0cnkKICAgIGNvbnN0IGFsZ29yaXRobU1vZHVsZSA9IE1PRFVMRV9SRUdJU1RSWVttb2R1bGVdOwoKICAgIGlmICghYWxnb3JpdGhtTW9kdWxlKSB7CiAgICAgIHRocm93IG5ldyBFcnJvcigKICAgICAgICBgTW9kdWxlICcke21vZHVsZX0nIG5vdCBmb3VuZCBpbiByZWdpc3RyeS4gYCArCiAgICAgICAgYEF2YWlsYWJsZSBtb2R1bGVzOiAke09iamVjdC5rZXlzKE1PRFVMRV9SRUdJU1RSWSkuam9pbignLCAnKX1gCiAgICAgICk7CiAgICB9CgogICAgLy8gR2V0IHRoZSBjb21wdXRlIGZ1bmN0aW9uCiAgICBjb25zdCBjb21wdXRlRnVuY3Rpb24gPSBhbGdvcml0aG1Nb2R1bGVbZnVuY3Rpb25OYW1lXTsKCiAgICBpZiAoIWNvbXB1dGVGdW5jdGlvbiB8fCB0eXBlb2YgY29tcHV0ZUZ1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7CiAgICAgIHRocm93IG5ldyBFcnJvcigKICAgICAgICBgRnVuY3Rpb24gJyR7ZnVuY3Rpb25OYW1lfScgbm90IGZvdW5kIGluIG1vZHVsZSAnJHttb2R1bGV9Jy4gYCArCiAgICAgICAgYEF2YWlsYWJsZSBmdW5jdGlvbnM6ICR7T2JqZWN0LmtleXMoYWxnb3JpdGhtTW9kdWxlKS5qb2luKCcsICcpfWAKICAgICAgKTsKICAgIH0KCiAgICAvLyBFeGVjdXRlIHRoZSBjb21wdXRlIGZ1bmN0aW9uCiAgICAvLyBMYXN0IGFyZyBpcyBhbHdheXMgdGhlIHByb2dyZXNzIGNhbGxiYWNrCiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjb21wdXRlRnVuY3Rpb24oLi4uYXJncywgcHJvZ3Jlc3NDYWxsYmFjayk7CgogICAgLy8gU2VuZCBzdWNjZXNzZnVsIHJlc3VsdAogICAgc2VsZi5wb3N0TWVzc2FnZSh7CiAgICAgIGlkLAogICAgICBzdGF0dXM6ICdjb21wbGV0ZScsCiAgICAgIHJlc3VsdAogICAgfSk7CgogIH0gY2F0Y2ggKGVycm9yKSB7CiAgICAvLyBTZW5kIGVycm9yCiAgICBsb2cuZXJyb3IoJ1Rhc2sgZmFpbGVkJywgewogICAgICBpZCwKICAgICAgZXJyb3I6IGVycm9yLm1lc3NhZ2UsCiAgICAgIHN0YWNrOiBlcnJvci5zdGFjawogICAgfSk7CiAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgaWQsCiAgICAgIHN0YXR1czogJ2Vycm9yJywKICAgICAgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3InLAogICAgICBzdGFjazogZXJyb3Iuc3RhY2sKICAgIH0pOwogIH0KfTsKCi8qKgogKiBIYW5kbGUgd29ya2VyIGVycm9ycwogKi8Kc2VsZi5vbmVycm9yID0gZnVuY3Rpb24oZXJyb3IpIHsKICBsb2cuZXJyb3IoJ1dvcmtlciBlcnJvcicsIHsKICAgIGVycm9yOiBlcnJvci5tZXNzYWdlIHx8ICdXb3JrZXIgZXJyb3Igb2NjdXJyZWQnLAogICAgc3RhY2s6IGVycm9yLnN0YWNrCiAgfSk7CiAgc2VsZi5wb3N0TWVzc2FnZSh7CiAgICBzdGF0dXM6ICdlcnJvcicsCiAgICBlcnJvcjogZXJyb3IubWVzc2FnZSB8fCAnV29ya2VyIGVycm9yIG9jY3VycmVkJwogIH0pOwp9OwoKLy8gTG9nIHdvcmtlciBpbml0aWFsaXphdGlvbgpsb2cuaW5mbygnSW5pdGlhbGl6ZWQnLCB7IG1vZHVsZUNvdW50OiBPYmplY3Qua2V5cyhNT0RVTEVfUkVHSVNUUlkpLmxlbmd0aCB9KTsK", import.meta.url).href : typeof require < "u" ? require("path").join(__dirname, "network-worker.js") : "./network-worker.js";
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
      const r = `task_${this.taskIdCounter++}`, i = { id: r, ...t }, a = e.timeout || this.taskTimeout, d = setTimeout(() => {
        this.handleTaskTimeout(r);
      }, a);
      this.activeTasks.set(r, {
        resolve: s,
        reject: o,
        onProgress: e.onProgress,
        timeoutId: d,
        startTime: Date.now(),
        task: i
        // Store task for affinity tracking
      });
      const h = this._selectWorker(i);
      h ? this.assignTask(h, i) : (this.taskQueue.push(i), this.log.debug("Task queued", { taskId: r, queueLength: this.taskQueue.length }));
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
        (r) => r.cachedFunctions.has(e)
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
      (o, r) => r.tasksExecuted < o.tasksExecuted ? r : o
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
      const r = t.cachedFunctions.size;
      this._evictAffinityEntries(t), this.log.debug("Worker affinity cache evicted", {
        workerId: t.id,
        beforeSize: r,
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
    const { id: s, status: o, result: r, progress: i, error: a } = e, d = this.activeTasks.get(s);
    if (!d) {
      this.log.warn("Received message for unknown task", { taskId: s });
      return;
    }
    if (o === "progress")
      d.onProgress && d.onProgress(i), this.log.debug("Task progress", { taskId: s, progress: Math.round(i * 100) });
    else if (o === "complete") {
      const h = Date.now() - d.startTime;
      this.log.debug("Task completed", { taskId: s, duration: h }), clearTimeout(d.timeoutId), d.resolve(r), d.task && this._updateWorkerAffinity(t, d.task), this.activeTasks.delete(s), this.freeWorker(t);
    } else o === "error" && (this.log.error("Task failed", { taskId: s, error: a }), clearTimeout(d.timeoutId), d.reject(new Error(a)), this.activeTasks.delete(s), this.freeWorker(t));
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
class O {
  constructor() {
    if (O.instance)
      return O.instance;
    this.workerPool = null, this.initialized = !1, this.initPromise = null, this.log = rt({
      prefix: "WorkerManager",
      level: "info"
      // Can be overridden by verbose option
    }), O.instance = this;
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
      verbose: r = !1,
      enableAffinity: i = !0,
      affinityCacheLimit: a = 50
    } = t;
    this.log.setLevel(r ? "debug" : "info");
    let d = s;
    if (!d)
      try {
        d = new URL("data:text/javascript;base64,LyoqCiAqIE5ldHdvcmsgV29ya2VyIC0gRXhlY3V0ZXMgY29tcHV0ZSBmdW5jdGlvbnMgZnJvbSBhbGdvcml0aG0gbW9kdWxlcwogKgogKiAqKkJ1bmRsZXItRnJpZW5kbHkgQXJjaGl0ZWN0dXJlOioqCiAqIC0gU3RhdGljYWxseSBpbXBvcnRzIGFsbCBhbGdvcml0aG0gbW9kdWxlcyB1cGZyb250CiAqIC0gQ3JlYXRlcyBhIHJlZ2lzdHJ5IHRoYXQgbWFwcyBtb2R1bGUgcGF0aHMgdG8gdGhlaXIgZXhwb3J0cwogKiAtIE1haW4gdGhyZWFkIHNlbmRzOiB7IGlkLCBtb2R1bGUsIGZ1bmN0aW9uTmFtZSwgYXJncyB9CiAqIC0gV29ya2VyIGxvb2tzIHVwIG1vZHVsZSBmcm9tIHJlZ2lzdHJ5IGFuZCBleGVjdXRlcyBmdW5jdGlvbgogKgogKiBUaGlzIGFwcHJvYWNoIHdvcmtzIHdpdGggYWxsIGJ1bmRsZXJzIChWaXRlLCBXZWJwYWNrLCBSb2xsdXApIGJlY2F1c2UKICogaW1wb3J0cyBhcmUga25vd24gYXQgYnVpbGQgdGltZS4KICoKICogQG1vZHVsZSBuZXR3b3JrLXdvcmtlcgogKi8KCmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJ0BndWluZXRpay9sb2dnZXInOwoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBTVEFUSUMgSU1QT1JUUyAtIEFsbCBhbGdvcml0aG0gbW9kdWxlcyBpbXBvcnRlZCB1cGZyb250Ci8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCi8vIENyZWF0ZSBsb2dnZXIgZm9yIHdvcmtlciAocnVucyBpbiBzZXBhcmF0ZSBjb250ZXh0LCBubyB3aW5kb3cubG9nRmlsdGVyKQpjb25zdCBsb2cgPSBjcmVhdGVMb2dnZXIoewogIHByZWZpeDogJ25ldHdvcmstd29ya2VyJywKICBsZXZlbDogJ2luZm8nIC8vIFdvcmtlcnMgZGVmYXVsdCB0byBpbmZvIGxldmVsCn0pOwoKLy8gU3RhdGlzdGljcyBhbGdvcml0aG1zIChub2RlLWxldmVsIGFuZCBncmFwaC1sZXZlbCkKaW1wb3J0ICogYXMgbm9kZVN0YXRzQ29tcHV0ZSBmcm9tICcuLi9zdGF0aXN0aWNzL2FsZ29yaXRobXMvbm9kZS1zdGF0cy5qcyc7CmltcG9ydCAqIGFzIGdyYXBoU3RhdHNDb21wdXRlIGZyb20gJy4uL3N0YXRpc3RpY3MvYWxnb3JpdGhtcy9ncmFwaC1zdGF0cy5qcyc7CgovLyBDb21tdW5pdHkgZGV0ZWN0aW9uIGFsZ29yaXRobXMKaW1wb3J0ICogYXMgbG91dmFpbkNvbXB1dGUgZnJvbSAnLi4vY29tbXVuaXR5L2FsZ29yaXRobXMvbG91dmFpbi5qcyc7CgovLyBMYXlvdXQgYWxnb3JpdGhtcwppbXBvcnQgKiBhcyByYW5kb21Db21wdXRlIGZyb20gJy4uL2xheW91dHMvcmFuZG9tLmpzJzsKaW1wb3J0ICogYXMgY2lyY3VsYXJDb21wdXRlIGZyb20gJy4uL2xheW91dHMvY2lyY3VsYXIuanMnOwppbXBvcnQgKiBhcyBzcGlyYWxDb21wdXRlIGZyb20gJy4uL2xheW91dHMvc3BpcmFsLmpzJzsKaW1wb3J0ICogYXMgc2hlbGxDb21wdXRlIGZyb20gJy4uL2xheW91dHMvc2hlbGwuanMnOwppbXBvcnQgKiBhcyBzcGVjdHJhbENvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9zcGVjdHJhbC5qcyc7CmltcG9ydCAqIGFzIGZvcmNlRGlyZWN0ZWRDb21wdXRlIGZyb20gJy4uL2xheW91dHMvZm9yY2UtZGlyZWN0ZWQuanMnOwppbXBvcnQgKiBhcyBrYW1hZGFLYXdhaUNvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9rYW1hZGEta2F3YWkuanMnOwppbXBvcnQgKiBhcyBiaXBhcnRpdGVDb21wdXRlIGZyb20gJy4uL2xheW91dHMvYmlwYXJ0aXRlLmpzJzsKaW1wb3J0ICogYXMgbXVsdGlwYXJ0aXRlQ29tcHV0ZSBmcm9tICcuLi9sYXlvdXRzL211bHRpcGFydGl0ZS5qcyc7CmltcG9ydCAqIGFzIGJmc0NvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9iZnMuanMnOwppbXBvcnQgKiBhcyBkZnNDb21wdXRlIGZyb20gJy4uL2xheW91dHMvZGZzLmpzJzsKaW1wb3J0ICogYXMgcmFkaWFsQ29tcHV0ZSBmcm9tICcuLi9sYXlvdXRzL3JhZGlhbC5qcyc7CmltcG9ydCAqIGFzIGZvcmNlRGlyZWN0ZWQzRENvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9mb3JjZS1kaXJlY3RlZC0zZC5qcyc7CgovLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ci8vIE1PRFVMRSBSRUdJU1RSWSAtIE1hcHMgbW9kdWxlIHBhdGhzIHRvIHRoZWlyIGV4cG9ydHMKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKY29uc3QgTU9EVUxFX1JFR0lTVFJZID0gewogIC8vIE5vZGUtbGV2ZWwgc3RhdGlzdGljcyAoYWxsIGluIG9uZSBmaWxlKQogICcuLi9zdGF0aXN0aWNzL2FsZ29yaXRobXMvbm9kZS1zdGF0cy5qcyc6IG5vZGVTdGF0c0NvbXB1dGUsCgogIC8vIEdyYXBoLWxldmVsIHN0YXRpc3RpY3MKICAnLi4vc3RhdGlzdGljcy9hbGdvcml0aG1zL2dyYXBoLXN0YXRzLmpzJzogZ3JhcGhTdGF0c0NvbXB1dGUsCgogIC8vIENvbW11bml0eQogICcuLi9jb21tdW5pdHkvYWxnb3JpdGhtcy9sb3V2YWluLmpzJzogbG91dmFpbkNvbXB1dGUsCgogIC8vIExheW91dHMKICAnLi4vbGF5b3V0cy9yYW5kb20uanMnOiByYW5kb21Db21wdXRlLAogICcuLi9sYXlvdXRzL2NpcmN1bGFyLmpzJzogY2lyY3VsYXJDb21wdXRlLAogICcuLi9sYXlvdXRzL3NwaXJhbC5qcyc6IHNwaXJhbENvbXB1dGUsCiAgJy4uL2xheW91dHMvc2hlbGwuanMnOiBzaGVsbENvbXB1dGUsCiAgJy4uL2xheW91dHMvc3BlY3RyYWwuanMnOiBzcGVjdHJhbENvbXB1dGUsCiAgJy4uL2xheW91dHMvZm9yY2UtZGlyZWN0ZWQuanMnOiBmb3JjZURpcmVjdGVkQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9rYW1hZGEta2F3YWkuanMnOiBrYW1hZGFLYXdhaUNvbXB1dGUsCiAgJy4uL2xheW91dHMvYmlwYXJ0aXRlLmpzJzogYmlwYXJ0aXRlQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9tdWx0aXBhcnRpdGUuanMnOiBtdWx0aXBhcnRpdGVDb21wdXRlLAogICcuLi9sYXlvdXRzL2Jmcy5qcyc6IGJmc0NvbXB1dGUsCiAgJy4uL2xheW91dHMvZGZzLmpzJzogZGZzQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9yYWRpYWwuanMnOiByYWRpYWxDb21wdXRlLAogICcuLi9sYXlvdXRzL2ZvcmNlLWRpcmVjdGVkLTNkLmpzJzogZm9yY2VEaXJlY3RlZDNEQ29tcHV0ZQp9OwoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBXT1JLRVIgTUVTU0FHRSBIQU5ETEVSCi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCi8qKgogKiBNYWluIG1lc3NhZ2UgaGFuZGxlciAtIHJlY2VpdmVzIHRhc2tzIGFuZCBkZWxlZ2F0ZXMgdG8gYWxnb3JpdGhtIG1vZHVsZXMKICovCnNlbGYub25tZXNzYWdlID0gYXN5bmMgZnVuY3Rpb24oZXZlbnQpIHsKICBjb25zdCB7IGlkLCBtb2R1bGUsIGZ1bmN0aW9uTmFtZSwgYXJncyA9IFtdIH0gPSBldmVudC5kYXRhOwoKICB0cnkgewogICAgLy8gVmFsaWRhdGUgbWVzc2FnZSBmb3JtYXQKICAgIGlmICghbW9kdWxlIHx8ICFmdW5jdGlvbk5hbWUpIHsKICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRhc2s6IG1vZHVsZSBhbmQgZnVuY3Rpb25OYW1lIGFyZSByZXF1aXJlZCcpOwogICAgfQoKICAgIGxvZy5kZWJ1ZygnUHJvY2Vzc2luZyB0YXNrJywgewogICAgICBpZCwKICAgICAgbW9kdWxlLAogICAgICBmdW5jdGlvbk5hbWUsCiAgICAgIGFyZ3NMZW5ndGg6IGFyZ3M/Lmxlbmd0aCB8fCAwCiAgICB9KTsKCiAgICAvLyBDcmVhdGUgcHJvZ3Jlc3MgY2FsbGJhY2sgdGhhdCByZXBvcnRzIGJhY2sgdG8gbWFpbiB0aHJlYWQKICAgIGNvbnN0IHByb2dyZXNzQ2FsbGJhY2sgPSAocHJvZ3Jlc3MpID0+IHsKICAgICAgc2VsZi5wb3N0TWVzc2FnZSh7CiAgICAgICAgaWQsCiAgICAgICAgc3RhdHVzOiAncHJvZ3Jlc3MnLAogICAgICAgIHByb2dyZXNzOiBNYXRoLm1pbihNYXRoLm1heChwcm9ncmVzcywgMCksIDEpIC8vIENsYW1wIHRvIFswLCAxXQogICAgICB9KTsKICAgIH07CgogICAgLy8gTG9vayB1cCBhbGdvcml0aG0gbW9kdWxlIGZyb20gcmVnaXN0cnkKICAgIGNvbnN0IGFsZ29yaXRobU1vZHVsZSA9IE1PRFVMRV9SRUdJU1RSWVttb2R1bGVdOwoKICAgIGlmICghYWxnb3JpdGhtTW9kdWxlKSB7CiAgICAgIHRocm93IG5ldyBFcnJvcigKICAgICAgICBgTW9kdWxlICcke21vZHVsZX0nIG5vdCBmb3VuZCBpbiByZWdpc3RyeS4gYCArCiAgICAgICAgYEF2YWlsYWJsZSBtb2R1bGVzOiAke09iamVjdC5rZXlzKE1PRFVMRV9SRUdJU1RSWSkuam9pbignLCAnKX1gCiAgICAgICk7CiAgICB9CgogICAgLy8gR2V0IHRoZSBjb21wdXRlIGZ1bmN0aW9uCiAgICBjb25zdCBjb21wdXRlRnVuY3Rpb24gPSBhbGdvcml0aG1Nb2R1bGVbZnVuY3Rpb25OYW1lXTsKCiAgICBpZiAoIWNvbXB1dGVGdW5jdGlvbiB8fCB0eXBlb2YgY29tcHV0ZUZ1bmN0aW9uICE9PSAnZnVuY3Rpb24nKSB7CiAgICAgIHRocm93IG5ldyBFcnJvcigKICAgICAgICBgRnVuY3Rpb24gJyR7ZnVuY3Rpb25OYW1lfScgbm90IGZvdW5kIGluIG1vZHVsZSAnJHttb2R1bGV9Jy4gYCArCiAgICAgICAgYEF2YWlsYWJsZSBmdW5jdGlvbnM6ICR7T2JqZWN0LmtleXMoYWxnb3JpdGhtTW9kdWxlKS5qb2luKCcsICcpfWAKICAgICAgKTsKICAgIH0KCiAgICAvLyBFeGVjdXRlIHRoZSBjb21wdXRlIGZ1bmN0aW9uCiAgICAvLyBMYXN0IGFyZyBpcyBhbHdheXMgdGhlIHByb2dyZXNzIGNhbGxiYWNrCiAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBjb21wdXRlRnVuY3Rpb24oLi4uYXJncywgcHJvZ3Jlc3NDYWxsYmFjayk7CgogICAgLy8gU2VuZCBzdWNjZXNzZnVsIHJlc3VsdAogICAgc2VsZi5wb3N0TWVzc2FnZSh7CiAgICAgIGlkLAogICAgICBzdGF0dXM6ICdjb21wbGV0ZScsCiAgICAgIHJlc3VsdAogICAgfSk7CgogIH0gY2F0Y2ggKGVycm9yKSB7CiAgICAvLyBTZW5kIGVycm9yCiAgICBsb2cuZXJyb3IoJ1Rhc2sgZmFpbGVkJywgewogICAgICBpZCwKICAgICAgZXJyb3I6IGVycm9yLm1lc3NhZ2UsCiAgICAgIHN0YWNrOiBlcnJvci5zdGFjawogICAgfSk7CiAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgaWQsCiAgICAgIHN0YXR1czogJ2Vycm9yJywKICAgICAgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfHwgJ1Vua25vd24gZXJyb3InLAogICAgICBzdGFjazogZXJyb3Iuc3RhY2sKICAgIH0pOwogIH0KfTsKCi8qKgogKiBIYW5kbGUgd29ya2VyIGVycm9ycwogKi8Kc2VsZi5vbmVycm9yID0gZnVuY3Rpb24oZXJyb3IpIHsKICBsb2cuZXJyb3IoJ1dvcmtlciBlcnJvcicsIHsKICAgIGVycm9yOiBlcnJvci5tZXNzYWdlIHx8ICdXb3JrZXIgZXJyb3Igb2NjdXJyZWQnLAogICAgc3RhY2s6IGVycm9yLnN0YWNrCiAgfSk7CiAgc2VsZi5wb3N0TWVzc2FnZSh7CiAgICBzdGF0dXM6ICdlcnJvcicsCiAgICBlcnJvcjogZXJyb3IubWVzc2FnZSB8fCAnV29ya2VyIGVycm9yIG9jY3VycmVkJwogIH0pOwp9OwoKLy8gTG9nIHdvcmtlciBpbml0aWFsaXphdGlvbgpsb2cuaW5mbygnSW5pdGlhbGl6ZWQnLCB7IG1vZHVsZUNvdW50OiBPYmplY3Qua2V5cyhNT0RVTEVfUkVHSVNUUlkpLmxlbmd0aCB9KTsK", import.meta.url).href;
      } catch {
        d = "/graph-js/src/compute/network-worker.js", this.log.warn("Could not resolve worker path from import.meta.url, using fallback", { workerPath: d });
      }
    if (!$.isSupported())
      throw new Error(
        "Web Workers are not supported in this environment. This library requires Web Worker support (browser) or Worker Threads (Node.js)."
      );
    this.workerPool = new fe({
      maxWorkers: e || this._getDefaultWorkerCount(),
      workerScript: d,
      taskTimeout: o,
      verbose: r,
      enableAffinity: i,
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
    O.instance && (O.instance.terminate(!0), O.instance = null);
  }
}
O.instance = null;
const tt = new O();
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
  constructor(t, e = "", s = "node", o = null) {
    if (new.target === L)
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
    const o = tt.serializeGraph(t), r = {
      module: this.computeConfig.module,
      functionName: this.computeConfig.functionName,
      args: [o, e, this.options]
    };
    return await tt.execute(r, s);
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
class me {
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
      (r) => r.u === t && r.v === e || r.u === e && r.v === t
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
const j = rt({
  prefix: "compute-utils",
  level: "info"
  // Default to info, can be verbose in debug builds
});
function R(n) {
  j.debug("Starting reconstruction", {
    isObject: n && typeof n == "object",
    hasNodes: n && "nodes" in n,
    hasEdges: n && "edges" in n,
    graphDataKeys: n ? Object.keys(n) : "N/A"
  });
  const t = new me();
  if (!n || typeof n != "object")
    return j.error("Invalid graphData passed to reconstructGraph", { graphData: n }), t;
  if (n.nodes !== void 0 && n.nodes !== null) {
    j.debug("Processing nodes", {
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
      j.debug("Node array created", { length: e.length }), e.forEach((s) => {
        t.addNode(s);
      }), j.debug("Nodes added successfully", {
        type: typeof t.nodes,
        size: t.nodes.size
      });
    } catch (e) {
      throw j.error("Error adding nodes", {
        error: e.message,
        stack: e.stack,
        nodesValue: n.nodes,
        nodesType: typeof n.nodes,
        nodesConstructor: n.nodes?.constructor?.name
      }), new Error(`Failed to reconstruct nodes: ${e.message}`);
    }
  } else
    j.warn("No nodes found in graphData");
  if (n.edges !== void 0 && n.edges !== null) {
    j.debug("Processing edges", {
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
      j.debug("Edge array created", { length: e.length }), e.forEach((s) => {
        const o = s.source !== void 0 ? s.source : s.u, r = s.target !== void 0 ? s.target : s.v, i = s.weight || 1;
        o !== void 0 && r !== void 0 && t.addEdge(o, r, i);
      }), j.debug("Edges added successfully");
    } catch (e) {
      throw j.error("Error adding edges", {
        error: e.message,
        stack: e.stack,
        edgesValue: n.edges,
        edgesType: typeof n.edges
      }), new Error(`Failed to reconstruct edges: ${e.message}`);
    }
  } else
    j.warn("No edges found in graphData");
  return j.debug("Reconstruction complete", {
    nodes: t.nodes.size,
    edges: t.edges.length
  }), t;
}
function m(n, t) {
  n && typeof n == "function" && n(Math.min(Math.max(t, 0), 1));
}
function ye(n, t) {
  const e = /* @__PURE__ */ new Map([[t, 0]]), s = /* @__PURE__ */ new Map([[t, 1]]), o = /* @__PURE__ */ new Map(), r = [t], i = [];
  for (; r.length > 0; ) {
    const a = r.shift();
    i.push(a);
    const d = n.getNeighbors(a), h = e.get(a);
    d.forEach((l) => {
      e.has(l) || (e.set(l, h + 1), r.push(l)), e.get(l) === h + 1 && (s.set(l, (s.get(l) || 0) + s.get(a)), o.has(l) || o.set(l, []), o.get(l).push(a));
    });
  }
  return { distance: e, pathCount: s, predecessors: o, stack: i };
}
function Rt(n, t) {
  const e = /* @__PURE__ */ new Map(), s = [t], o = /* @__PURE__ */ new Set([t]);
  for (e.set(t, 0); s.length > 0; ) {
    const r = s.shift(), i = e.get(r);
    for (const a of n.getNeighbors(r))
      o.has(a) || (o.add(a), s.push(a), e.set(a, i + 1));
  }
  return e;
}
function St(n, t) {
  const e = n.getNeighbors(t), s = e.length;
  if (s < 2)
    return 0;
  let o = 0;
  for (let r = 0; r < e.length; r++)
    for (let i = r + 1; i < e.length; i++)
      n.hasEdge(e[r], e[i]) && o++;
  return 2 * o / (s * (s - 1));
}
function pe(n, t) {
  const e = n.getNeighbors(t);
  let s = 0;
  for (let o = 0; o < e.length; o++)
    for (let r = o + 1; r < e.length; r++)
      n.hasEdge(e[o], e[r]) && s++;
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
class be extends L {
  constructor() {
    super("degree", "Number of connections per node", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "degreeCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Ie extends L {
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
class Ce extends L {
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
class we extends L {
  constructor() {
    super("betweenness", "Frequency on shortest paths between other nodes", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "betweennessCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class ve extends L {
  constructor() {
    super("clustering", "Local clustering coefficient", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "clusteringCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Ge extends L {
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
class Ae extends L {
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
class Te extends L {
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
class xe extends L {
  constructor() {
    super("cliques", "Number of maximal cliques per node", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "cliquesCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
async function Pe(n, t, e, s) {
  const o = R(n), r = t || Array.from(o.nodes), i = {};
  return r.forEach((a, d) => {
    i[a] = o.degree(a), d % 100 === 0 && m(s, d / r.length);
  }), m(s, 1), i;
}
async function Ze(n, t, e, s) {
  const o = R(n), r = t || Array.from(o.nodes), i = Array.from(o.nodes), a = {};
  i.forEach((l) => {
    a[l] = 0;
  }), r.forEach((l, c) => {
    const u = ye(o, l);
    We(a, u, i, l), c % Math.max(1, Math.floor(r.length / 10)) === 0 && m(s, c / r.length);
  });
  const d = i.length, h = d > 2 ? 2 / ((d - 1) * (d - 2)) : 1;
  return i.forEach((l) => {
    a[l] *= h;
  }), m(s, 1), a;
}
function We(n, t, e, s) {
  const { pathCount: o, predecessors: r, stack: i } = t, a = /* @__PURE__ */ new Map();
  for (e.forEach((d) => {
    a.set(d, 0);
  }); i.length > 0; ) {
    const d = i.pop();
    (r.get(d) || []).forEach((l) => {
      const c = o.get(l) / o.get(d) * (1 + a.get(d));
      a.set(l, a.get(l) + c);
    }), d !== s && (n[d] += a.get(d));
  }
}
async function Me(n, t, e, s) {
  const o = R(n), r = t || Array.from(o.nodes), i = {};
  return r.forEach((a, d) => {
    i[a] = St(o, a), d % 100 === 0 && m(s, d / r.length);
  }), m(s, 1), i;
}
async function Xe(n, t, e, s) {
  const o = R(n), { maxIter: r = 100, tolerance: i = 1e-6 } = e || {}, a = Array.from(o.nodes), d = a.length;
  let h = {};
  a.forEach((l) => {
    h[l] = 1 / d;
  });
  for (let l = 0; l < r; l++) {
    const c = {};
    a.forEach((g) => {
      c[g] = 0;
    }), a.forEach((g) => {
      o.getNeighbors(g).forEach((y) => {
        const w = o.adjacencyMap.get(g).get(y);
        c[y] += h[g] * w;
      });
    }), U(c);
    const u = Lt(c, h);
    if (h = c, l % 10 === 0 && m(s, l / r), u < i)
      break;
  }
  return m(s, 1), h;
}
async function Be(n, t, e, s) {
  const o = R(n), { dampingFactor: r = 0.85, maxIter: i = 100, tolerance: a = 1e-6 } = e || {}, d = Array.from(o.nodes), h = d.length;
  if (h === 0)
    return m(s, 1), {};
  let l = {};
  d.forEach((y) => {
    l[y] = 1 / h;
  });
  const c = {};
  d.forEach((y) => {
    c[y] = o.getNeighbors(y).length;
  });
  const u = d.filter((y) => c[y] === 0), g = (1 - r) / h;
  for (let y = 0; y < i; y++) {
    const w = {};
    let C = 0;
    u.forEach((A) => {
      C += l[A];
    });
    const T = r * C / h;
    d.forEach((A) => {
      w[A] = g + T;
    }), d.forEach((A) => {
      const Z = o.getNeighbors(A);
      if (Z.length > 0) {
        const I = r * l[A] / Z.length;
        Z.forEach((P) => {
          w[P] += I;
        });
      }
    });
    const v = Lt(w, l);
    if (l = w, y % 10 === 0 && m(s, y / i), v < a)
      break;
  }
  const f = Object.values(l).reduce((y, w) => y + w, 0);
  return f > 0 && d.forEach((y) => {
    l[y] /= f;
  }), m(s, 1), l;
}
async function ke(n, t, e, s) {
  const o = R(n), r = t || Array.from(o.nodes), i = {};
  return r.forEach((a, d) => {
    i[a] = pe(o, a), d % 100 === 0 && m(s, d / r.length);
  }), m(s, 1), i;
}
async function Ee(n, t, e, s) {
  const o = R(n), r = t || Array.from(o.nodes), a = Array.from(o.nodes).length, d = {}, h = e?.normalized !== !1;
  return r.forEach((l, c) => {
    const u = /* @__PURE__ */ new Map(), g = [l], f = /* @__PURE__ */ new Set([l]);
    for (u.set(l, 0); g.length > 0; ) {
      const w = g.shift(), C = u.get(w);
      for (const T of o.getNeighbors(w))
        f.has(T) || (f.add(T), g.push(T), u.set(T, C + 1));
    }
    const y = u.size - 1;
    if (y === 0)
      d[l] = 0;
    else {
      const w = Array.from(u.values()).reduce((C, T) => C + T, 0);
      if (w === 0)
        d[l] = 0;
      else {
        const C = y / w;
        d[l] = h ? C * (y / (a - 1)) : C;
      }
    }
    c % 100 === 0 && m(s, c / r.length);
  }), m(s, 1), d;
}
async function ze(n, t, e, s) {
  const o = R(n), r = t || Array.from(o.nodes), i = {};
  return r.forEach((a, d) => {
    const h = o.getNeighbors(a), l = h.length;
    if (l < 2)
      i[a] = 0;
    else {
      let c = 0;
      for (let g = 0; g < l; g++)
        for (let f = g + 1; f < l; f++)
          o.hasEdge(h[g], h[f]) && c++;
      const u = l * (l - 1) / 2;
      i[a] = c / u;
    }
    d % 100 === 0 && m(s, d / r.length);
  }), m(s, 1), i;
}
async function Ne(n, t, e, s) {
  const o = R(n), r = Array.from(o.nodes), i = r.length;
  if (i < 3) {
    const f = {};
    return r.forEach((y) => {
      f[y] = { laplacian_x: Math.random() * 2 - 1, laplacian_y: Math.random() * 2 - 1 };
    }), m(s, 1), f;
  }
  const { maxIter: a = 100, tolerance: d = 1e-6 } = e || {}, h = Array(i).fill(null).map(() => Array(i).fill(0)), l = /* @__PURE__ */ new Map();
  r.forEach((f, y) => l.set(f, y));
  for (let f = 0; f < i; f++) {
    const y = r[f], w = o.getNeighbors(y);
    h[f][f] = w.length, w.forEach((C) => {
      const T = l.get(C);
      T !== void 0 && (h[f][T] = -1);
    });
  }
  m(s, 0.2);
  const c = Array(i).fill(0).map(() => Math.random()), u = Array(i).fill(0).map(() => Math.random());
  U(c), U(u);
  for (let f = 0; f < a; f++) {
    const y = Ct(h, c);
    U(y);
    let w = 0;
    for (let C = 0; C < i; C++)
      w += Math.abs(y[C] - c[C]);
    if (w < d) break;
    for (let C = 0; C < i; C++)
      c[C] = y[C];
    f % 20 === 0 && m(s, 0.2 + f / a * 0.4);
  }
  m(s, 0.6), lt(u, c), U(u);
  for (let f = 0; f < a; f++) {
    const y = Ct(h, u);
    U(y), lt(y, c), lt(y, u), U(y);
    let w = 0;
    for (let C = 0; C < i; C++)
      w += Math.abs(y[C] - u[C]);
    if (w < d) break;
    for (let C = 0; C < i; C++)
      u[C] = y[C];
    f % 20 === 0 && m(s, 0.6 + f / a * 0.39);
  }
  m(s, 0.99);
  const g = {};
  return r.forEach((f, y) => {
    g[f] = {
      laplacian_x: c[y],
      laplacian_y: u[y]
    };
  }), m(s, 1), g;
}
function Ct(n, t) {
  const e = n.length, s = Array(e).fill(0);
  for (let o = 0; o < e; o++)
    for (let r = 0; r < e; r++)
      s[o] += n[o][r] * t[r];
  return s;
}
function lt(n, t) {
  let e = 0;
  for (let s = 0; s < n.length; s++)
    e += n[s] * t[s];
  for (let s = 0; s < n.length; s++)
    n[s] -= e * t[s];
}
const Yt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BetweennessStatistic: we,
  CliquesStatistic: xe,
  ClosenessStatistic: Ie,
  ClusteringStatistic: ve,
  DegreeStatistic: be,
  EgoDensityStatistic: Ce,
  EigenvectorLaplacianStatistic: Te,
  EigenvectorStatistic: Ge,
  PageRankStatistic: Ae,
  betweennessCompute: Ze,
  cliquesCompute: ke,
  closenessCompute: Ee,
  clusteringCompute: Me,
  degreeCompute: Pe,
  egoDensityCompute: ze,
  eigenvectorCompute: Xe,
  eigenvectorLaplacianCompute: Ne,
  pageRankCompute: Be
}, Symbol.toStringTag, { value: "Module" }));
class Re extends L {
  constructor() {
    super("density", "Ratio of actual edges to possible edges", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "densityCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Se extends L {
  constructor() {
    super("diameter", "Longest shortest path in the graph", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "diameterCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Le extends L {
  constructor() {
    super("average_clustering", "Mean clustering coefficient across all nodes", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "averageClusteringCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Ye extends L {
  constructor() {
    super("average_shortest_path", "Mean distance between all node pairs", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "averageShortestPathCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Je extends L {
  constructor() {
    super("connected_components", "Number of disconnected subgraphs", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "connectedComponentsCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class je extends L {
  constructor() {
    super("average_degree", "Mean number of connections per node", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "averageDegreeCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
async function Ve(n, t, e, s) {
  const o = R(n), r = o.nodes.size, i = o.edges.length;
  if (r < 2)
    return 0;
  const a = r * (r - 1) / 2, d = i / a;
  return m(s, 1), d;
}
async function Fe(n, t, e, s) {
  const o = R(n), r = Array.from(o.nodes);
  let i = 0;
  return r.forEach((a, d) => {
    const h = Rt(o, a);
    for (const l of h.values())
      l > i && (i = l);
    d % Math.max(1, Math.floor(r.length / 10)) === 0 && m(s, d / r.length);
  }), m(s, 1), i;
}
async function Ke(n, t, e, s) {
  const o = R(n), r = Array.from(o.nodes);
  let i = 0;
  return r.forEach((a, d) => {
    i += St(o, a), d % 100 === 0 && m(s, d / r.length);
  }), m(s, 1), r.length > 0 ? i / r.length : 0;
}
async function He(n, t, e, s) {
  const o = R(n), r = Array.from(o.nodes);
  let i = 0, a = 0;
  return r.forEach((d, h) => {
    Rt(o, d).forEach((c, u) => {
      u !== d && (a += c, i++);
    }), h % Math.max(1, Math.floor(r.length / 10)) === 0 && m(s, h / r.length);
  }), m(s, 1), i > 0 ? a / i : 0;
}
async function Oe(n, t, e, s) {
  const o = R(n), r = Array.from(o.nodes), i = /* @__PURE__ */ new Set(), a = {};
  let d = 0;
  return r.forEach((h) => {
    if (!i.has(h)) {
      const l = [h];
      for (i.add(h), a[h] = d; l.length > 0; ) {
        const c = l.shift();
        for (const u of o.getNeighbors(c))
          i.has(u) || (i.add(u), l.push(u), a[u] = d);
      }
      d++;
    }
  }), m(s, 1), {
    count: d,
    components: a
  };
}
async function _e(n, t, e, s) {
  const o = R(n), r = Array.from(o.nodes);
  let i = 0;
  return r.forEach((a) => {
    i += o.getNeighbors(a).length;
  }), m(s, 1), r.length > 0 ? i / r.length : 0;
}
const Jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AverageClusteringStatistic: Le,
  AverageDegreeStatistic: je,
  AverageShortestPathStatistic: Ye,
  ConnectedComponentsStatistic: Je,
  DensityStatistic: Re,
  DiameterStatistic: Se,
  averageClusteringCompute: Ke,
  averageDegreeCompute: _e,
  averageShortestPathCompute: He,
  connectedComponentsCompute: Oe,
  densityCompute: Ve,
  diameterCompute: Fe
}, Symbol.toStringTag, { value: "Module" }));
class gt {
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
    if (new.target === gt)
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
class wt extends gt {
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
async function Ue(n, t, e) {
  const s = R(n), { resolution: o = 1, maxIterations: r = 100 } = t || {}, i = Array.from(s.nodes), a = (C) => {
    const T = s.getNeighbors(C);
    let v = 0;
    return T.forEach((A) => {
      v += s.getEdgeWeight(C, A);
    }), v;
  };
  let d = 0;
  s.edges.forEach((C) => {
    d += C.weight;
  });
  const h = 2 * d, l = {};
  i.forEach((C) => {
    l[C] = C;
  });
  let c = !0, u = 0;
  for (; c && u < r; ) {
    c = !1, u++;
    for (const C of i) {
      const T = l[C], v = s.getNeighbors(C), A = /* @__PURE__ */ new Set();
      v.forEach((W) => {
        A.add(l[W]);
      });
      const Z = a(C);
      let I = T, P = 0;
      A.forEach((W) => {
        if (W === T) return;
        const G = qe(
          s,
          C,
          T,
          W,
          l,
          h,
          o,
          Z,
          a
        );
        G > P && (P = G, I = W);
      }), I !== T && (l[C] = I, c = !0);
    }
    if (m(e, Math.min(u / r, 0.9)), !c) break;
  }
  const g = Array.from(new Set(Object.values(l))), f = {};
  g.forEach((C, T) => {
    f[C] = T;
  });
  const y = {};
  Object.keys(l).forEach((C) => {
    y[C] = f[l[C]];
  });
  const w = De(s, y, d, a);
  return m(e, 1), {
    communities: y,
    modularity: w,
    numCommunities: g.length,
    iterations: u
  };
}
function qe(n, t, e, s, o, r, i, a, d) {
  const h = n.getNeighbors(t);
  let l = 0, c = 0;
  h.forEach((w) => {
    const C = n.getEdgeWeight(t, w);
    o[w] === s && (l += C), o[w] === e && w !== t && (c += C);
  });
  const u = Array.from(n.nodes);
  let g = 0, f = 0;
  return u.forEach((w) => {
    o[w] === s && (g += d(w)), o[w] === e && (f += d(w));
  }), l / r - i * (g * a) / (r * r) - (c / r - i * (f * a) / (r * r));
}
function De(n, t, e, s) {
  if (e === 0) return 0;
  const o = 2 * e, r = new Set(Object.values(t));
  let i = 0;
  return r.forEach((a) => {
    let d = 0, h = 0;
    Object.keys(t).filter(
      (c) => t[c] === a
    ).forEach((c) => {
      h += s(c);
    }), n.edges.forEach((c) => {
      const u = c.u, g = c.v, f = c.weight;
      t[u] === a && t[g] === a && (d += f);
    }), i += d / o - Math.pow(h / o, 2);
  }), i;
}
const jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  LouvainAlgorithm: wt,
  default: wt,
  louvainCompute: Ue
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
    const e = { ...this.options, ...t }, { onProgress: s, timeout: o, ...r } = e, i = tt.serializeGraph(this.graph), a = {
      module: this.computeConfig.module,
      functionName: this.computeConfig.functionName,
      args: [i, r]
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
class vt extends V {
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
async function Qe(n, t, e) {
  const s = Array.from(n.nodes || []), {
    scale: o = 1,
    center: r = { x: 0, y: 0 },
    seed: i = null
  } = t || {}, a = {};
  let d;
  return i !== null ? d = function(l) {
    return function() {
      let c = l += 1831565813;
      return c = Math.imul(c ^ c >>> 15, c | 1), c ^= c + Math.imul(c ^ c >>> 7, c | 61), ((c ^ c >>> 14) >>> 0) / 4294967296;
    };
  }(i) : d = Math.random, s.forEach((h) => {
    const l = (d() * 2 - 1) * o + r.x, c = (d() * 2 - 1) * o + r.y;
    a[h] = { x: l, y: c };
  }), m(e, 1), a;
}
const Vt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  RandomLayout: vt,
  default: vt,
  randomCompute: Qe
}, Symbol.toStringTag, { value: "Module" }));
class Gt extends V {
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
async function $e(n, t, e) {
  const s = R(n), {
    scale: o = 1,
    center: r = { x: 0, y: 0 },
    sortBy: i = null
  } = t || {};
  let a = Array.from(s.nodes);
  const d = a.length;
  if (d === 0)
    return m(e, 1), {};
  if (d === 1) {
    const l = { [a[0]]: { x: r.x, y: r.y } };
    return m(e, 1), l;
  }
  i && typeof i == "function" && (a = a.sort(i));
  const h = {};
  return a.forEach((l, c) => {
    const u = 2 * Math.PI * c / d;
    h[l] = {
      x: Math.cos(u) * o + r.x,
      y: Math.sin(u) * o + r.y
    };
  }), m(e, 1), h;
}
const Ft = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CircularLayout: Gt,
  circularCompute: $e,
  default: Gt
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
function ts(n, t = 1) {
  if (n.length === 0) return n;
  let e = 1 / 0, s = -1 / 0, o = 1 / 0, r = -1 / 0;
  for (const [l, c] of n)
    e = Math.min(e, l), s = Math.max(s, l), o = Math.min(o, c), r = Math.max(r, c);
  const i = s - e || 1, a = r - o || 1, d = Math.max(i, a), h = 2 * t / d;
  return n.map(([l, c]) => [
    (l - e - i / 2) * h + t,
    (c - o - a / 2) * h + t
  ]);
}
async function es(n, t, e) {
  const s = Array.from(n.nodes || []), o = s.length, {
    scale: r = 1,
    center: i = { x: 0, y: 0 },
    resolution: a = 0.35,
    equidistant: d = !1
  } = t || {};
  if (o === 0)
    return m(e, 1), {};
  if (o === 1) {
    const c = { [s[0]]: { x: i.x, y: i.y } };
    return m(e, 1), c;
  }
  let h = [];
  if (d) {
    let u = 0.5, g = a;
    g += 1 / (u * g);
    for (let f = 0; f < o; f++) {
      const y = u * g;
      g += 1 / y, h.push([Math.cos(g) * y, Math.sin(g) * y]);
    }
  } else
    for (let c = 0; c < o; c++) {
      const u = a * c, g = c;
      h.push([Math.cos(u) * g, Math.sin(u) * g]);
    }
  h = ts(h, r);
  const l = {};
  return s.forEach((c, u) => {
    l[c] = {
      x: h[u][0] + i.x,
      y: h[u][1] + i.y
    };
  }), m(e, 1), l;
}
const Kt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SpiralLayout: At,
  default: At,
  spiralCompute: es
}, Symbol.toStringTag, { value: "Module" }));
class Tt extends V {
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
async function ss(n, t, e) {
  const s = Array.from(n.nodes || []), o = s.length, {
    scale: r = 1,
    center: i = { x: 0, y: 0 },
    nlist: a = null,
    rotate: d = null,
    nodeProperties: h = null
    // Map or Object of node ID -> {degree, ...properties}
  } = t || {}, l = h instanceof Map, c = h && typeof h == "object" && !l, u = l ? h.size > 0 : c ? Object.keys(h).length > 0 : !1, g = (A) => l ? h.get(A) : c ? h[A] : null;
  if (o === 0)
    return m(e, 1), {};
  if (o === 1) {
    const A = { [s[0]]: { x: i.x, y: i.y } };
    return m(e, 1), A;
  }
  let f;
  if (a && Array.isArray(a))
    f = a;
  else {
    let A = /* @__PURE__ */ new Map();
    if (u)
      s.forEach((P) => {
        const W = g(P), G = W && typeof W == "object" && W.degree || 0;
        A.set(P, G);
      });
    else if (s.forEach((P) => {
      A.set(P, 0);
    }), n.edges)
      for (const P of n.edges) {
        const W = P.u !== void 0 ? P.u : P.source !== void 0 ? P.source : P[0], G = P.v !== void 0 ? P.v : P.target !== void 0 ? P.target : P[1];
        A.has(W) && A.set(W, A.get(W) + 1), A.has(G) && A.set(G, A.get(G) + 1);
      }
    const Z = /* @__PURE__ */ new Map();
    s.forEach((P) => {
      const W = A.get(P) || 0;
      Z.has(W) || Z.set(W, []), Z.get(W).push(P);
    }), f = Array.from(Z.keys()).sort((P, W) => W - P).map((P) => Z.get(P));
  }
  const y = r / f.length;
  let w;
  f[0].length === 1 ? w = 0 : w = y;
  let C;
  d === null ? C = Math.PI / f.length : C = d;
  const T = {};
  let v = C;
  for (const A of f) {
    const Z = A.length;
    if (Z === 0) continue;
    const I = [];
    for (let P = 0; P < Z; P++)
      I.push(2 * Math.PI * P / Z + v);
    A.forEach((P, W) => {
      const G = I[W], x = w * Math.cos(G) + i.x, M = w * Math.sin(G) + i.y;
      T[P] = { x, y: M };
    }), w += y, v += C;
  }
  return m(e, 1), T;
}
const Ht = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShellLayout: Tt,
  default: Tt,
  shellCompute: ss
}, Symbol.toStringTag, { value: "Module" }));
class xt extends V {
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
async function os(n, t, e) {
  const s = Array.from(n.nodes || []), o = s.length;
  console.log("[spectralCompute] Starting with", o, "nodes"), console.log("[spectralCompute] Raw options:", t), console.log("[spectralCompute] Raw options keys:", t ? Object.keys(t) : "null"), console.log("[spectralCompute] nodeProperties in options:", t?.nodeProperties);
  const {
    scale: r = 1,
    center: i = { x: 0, y: 0 },
    nodeProperties: a = null
    // Map or Object of node ID -> {laplacian_x, laplacian_y}
  } = t || {}, d = a instanceof Map, h = a && typeof a == "object" && !d, l = d ? a.size > 0 : h ? Object.keys(a).length > 0 : !1;
  if (console.log(
    "[spectralCompute] nodeProperties:",
    d ? `Map with ${a.size} entries` : h ? `Object with ${Object.keys(a).length} entries` : "null"
  ), o === 0)
    return m(e, 1), {};
  if (o === 1) {
    const w = { [s[0]]: { x: i.x, y: i.y } };
    return m(e, 1), w;
  }
  const c = {}, u = [], g = (w) => d ? a.get(w) : h ? a[w] : null;
  console.log("[spectralCompute] Processing", o, "nodes for eigenvector extraction");
  const f = [];
  for (const w of s) {
    let C, T;
    if (l) {
      const v = g(w);
      v && v.laplacian_x !== void 0 && v.laplacian_y !== void 0 ? (C = v.laplacian_x, T = v.laplacian_y) : (f.push(w), C = (Math.random() - 0.5) * 0.1, T = (Math.random() - 0.5) * 0.1, console.log(`[spectralCompute] Node "${w}" missing laplacian data, using fallback position`));
    } else
      throw new Error(
        "Spectral layout requires eigenvector-laplacian stat. Include 'eigenvector-laplacian' in analyze() features."
      );
    u.push([C, T]);
  }
  f.length > 0 && console.log(`[spectralCompute] ${f.length} nodes missing laplacian data, used fallback positions`), console.log("[spectralCompute] Extracted", u.length, "coordinates. Sample:", u[0]), m(e, 0.5), console.log("[spectralCompute] Starting rescaleLayout...");
  const y = ns(u, r);
  return console.log("[spectralCompute] Rescaled. Sample:", y[0]), m(e, 0.99), s.forEach((w, C) => {
    c[w] = {
      x: y[C][0] + i.x,
      y: y[C][1] + i.y
    };
  }), console.log("[spectralCompute] Created positions for", Object.keys(c).length, "nodes"), m(e, 1), console.log("[spectralCompute] Completed successfully"), c;
}
function ns(n, t = 1) {
  if (n.length === 0) return n;
  let e = 1 / 0, s = -1 / 0, o = 1 / 0, r = -1 / 0;
  for (const [l, c] of n)
    e = Math.min(e, l), s = Math.max(s, l), o = Math.min(o, c), r = Math.max(r, c);
  const i = s - e || 1, a = r - o || 1, d = Math.max(i, a), h = 2 * t / d;
  return n.map(([l, c]) => [
    (l - e - i / 2) * h + t,
    (c - o - a / 2) * h + t
  ]);
}
const Ot = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SpectralLayout: xt,
  default: xt,
  spectralCompute: os
}, Symbol.toStringTag, { value: "Module" }));
function et(n, t, e = 1, s = { x: 0, y: 0 }) {
  if (t.length === 0) return n;
  let o = 0, r = 0;
  t.forEach((c) => {
    o += n[c].x, r += n[c].y;
  });
  const i = o / t.length, a = r / t.length, d = {};
  t.forEach((c) => {
    d[c] = {
      x: n[c].x - i,
      y: n[c].y - a
    };
  });
  let h = 0;
  t.forEach((c) => {
    const u = Math.abs(d[c].x), g = Math.abs(d[c].y);
    h = Math.max(h, u, g);
  });
  const l = {};
  if (h > 0) {
    const c = e / h;
    t.forEach((u) => {
      l[u] = {
        x: d[u].x * c + s.x,
        y: d[u].y * c + s.y
      };
    });
  } else
    t.forEach((c) => {
      l[c] = { x: s.x, y: s.y };
    });
  return l;
}
function is(n) {
  const t = {};
  return n.forEach((e) => {
    t[e] = {
      x: Math.random(),
      y: Math.random(),
      z: Math.random()
    };
  }), t;
}
function rs(n, t, e = 1, s = { x: 0, y: 0, z: 0 }) {
  if (t.length === 0) return n;
  let o = 0, r = 0, i = 0;
  t.forEach((g) => {
    o += n[g].x, r += n[g].y, i += n[g].z;
  });
  const a = o / t.length, d = r / t.length, h = i / t.length, l = {};
  t.forEach((g) => {
    l[g] = {
      x: n[g].x - a,
      y: n[g].y - d,
      z: n[g].z - h
    };
  });
  let c = 0;
  t.forEach((g) => {
    const f = Math.abs(l[g].x), y = Math.abs(l[g].y), w = Math.abs(l[g].z);
    c = Math.max(c, f, y, w);
  });
  const u = {};
  if (c > 0) {
    const g = e / c;
    t.forEach((f) => {
      u[f] = {
        x: l[f].x * g + s.x,
        y: l[f].y * g + s.y,
        z: l[f].z * g + s.z
      };
    });
  } else
    t.forEach((g) => {
      u[g] = { x: s.x, y: s.y, z: s.z };
    });
  return u;
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
async function as(n, t, e) {
  const s = R(n), {
    iterations: o = 50,
    k: r = null,
    scale: i = 1,
    center: a = { x: 0, y: 0 },
    initialPositions: d = null,
    threshold: h = 1e-4
  } = t || {}, l = Array.from(s.nodes), c = l.length;
  if (c === 0)
    return m(e, 1), {};
  if (c === 1) {
    const I = { [l[0]]: { x: a.x, y: a.y } };
    return m(e, 1), I;
  }
  let u = {};
  d ? u = { ...d } : l.forEach((I) => {
    u[I] = {
      x: Math.random(),
      y: Math.random()
    };
  });
  const g = r !== null ? r : Math.sqrt(1 / c);
  let f = 1 / 0, y = -1 / 0, w = 1 / 0, C = -1 / 0;
  l.forEach((I) => {
    const P = u[I];
    f = Math.min(f, P.x), y = Math.max(y, P.x), w = Math.min(w, P.y), C = Math.max(C, P.y);
  });
  let T = Math.max(y - f, C - w) * 0.1;
  const v = T / (o + 1), A = /* @__PURE__ */ new Map();
  l.forEach((I) => {
    const P = new Set(s.getNeighbors(I));
    A.set(I, P);
  });
  for (let I = 0; I < o; I++) {
    const P = {};
    l.forEach((G) => {
      P[G] = { x: 0, y: 0 };
    }), l.forEach((G) => {
      const x = u[G];
      let M = 0, z = 0;
      l.forEach((N) => {
        if (N !== G) {
          const p = u[N], b = x.x - p.x, X = x.y - p.y;
          let k = Math.sqrt(b * b + X * X);
          k < 0.01 && (k = 0.01);
          const E = A.get(G).has(N), S = g * g / (k * k), J = E ? k / g : 0, K = S - J;
          M += b / k * K, z += X / k * K;
        }
      }), P[G] = { x: M, y: z };
    });
    let W = 0;
    if (l.forEach((G) => {
      const x = P[G], M = Math.sqrt(x.x * x.x + x.y * x.y);
      if (M > 0) {
        const z = Math.max(M, 0.01), N = T / z;
        u[G].x += x.x * N, u[G].y += x.y * N, W += M;
      }
    }), T -= v, W / c < h) {
      m(e, 1);
      break;
    }
    I % 10 === 0 && m(e, I / o);
  }
  const Z = et(u, l, i, a);
  return m(e, 1), Z;
}
const _t = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ForceDirectedLayout: Pt,
  default: Pt,
  forceDirectedCompute: as
}, Symbol.toStringTag, { value: "Module" }));
class Zt extends V {
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
async function cs(n, t, e) {
  console.log("[Kamada-Kawai] Received graphData:", {
    hasNodes: "nodes" in n,
    nodesType: typeof n.nodes,
    nodesIsArray: Array.isArray(n.nodes),
    hasEdges: "edges" in n,
    edgesType: typeof n.edges,
    edgesIsArray: Array.isArray(n.edges)
  });
  const s = R(n);
  console.log("[Kamada-Kawai] After reconstructGraph, graph.nodes:", {
    type: typeof s.nodes,
    isSet: s.nodes instanceof Set,
    size: s.nodes?.size || "N/A"
  });
  const {
    iterations: o = 100,
    scale: r = 1,
    center: i = { x: 0, y: 0 },
    initialPositions: a = null,
    threshold: d = 1e-4,
    K: h = null
  } = t || {}, l = Array.from(s.nodes), c = l.length;
  if (console.log("[Kamada-Kawai] Nodes array:", {
    length: l.length,
    isArray: Array.isArray(l),
    sample: l.slice(0, 3)
  }), c === 0)
    return m(e, 1), {};
  if (c === 1) {
    const p = { [l[0]]: { x: i.x, y: i.y } };
    return m(e, 1), p;
  }
  m(e, 0.1), console.log("[Kamada-Kawai] About to compute all-pairs shortest paths:", {
    nodesLength: l.length,
    nodesIsArray: Array.isArray(l),
    nodesType: typeof l
  });
  let u;
  try {
    u = ls(s, l), console.log("[Kamada-Kawai] All-pairs shortest paths computed successfully");
    let p = !1, b = !1, X = 0, k = 0;
    for (let E = 0; E < u.length; E++)
      for (let S = 0; S < u[E].length; S++)
        isFinite(u[E][S]) || (p = u[E][S] === 1 / 0, b = isNaN(u[E][S]), p && X++, b && k++);
    (X > 0 || k > 0) && console.warn("[Kamada-Kawai] Distances contain problematic values:", {
      infinityCount: X,
      nanCount: k,
      totalDistances: u.length * u[0].length,
      sample: u[0].slice(0, 5)
    });
  } catch (p) {
    throw console.error("[Kamada-Kawai] Error in computeAllPairsShortestPaths:", p.message, p.stack), p;
  }
  m(e, 0.3), console.log("[Kamada-Kawai] About to initialize positions");
  let g;
  try {
    g = ds(l, a), console.log("[Kamada-Kawai] Positions initialized successfully, pos:", {
      type: typeof g,
      isArray: Array.isArray(g),
      length: g?.length || "N/A"
    });
  } catch (p) {
    throw console.error("[Kamada-Kawai] Error in initializePositions:", p.message, p.stack), p;
  }
  const f = u.flat().filter((p) => isFinite(p) && p > 0);
  f.length === 0 && console.warn("[Kamada-Kawai] All distances are placeholder (disconnected)!");
  const y = f.length > 0 ? f.reduce((p, b) => Math.max(p, b), 0) : 1, w = Math.sqrt(c), C = w / y, T = h !== null ? h : c;
  console.log("[Kamada-Kawai] Distance matrix stats:", {
    totalPairs: u.flat().length,
    finitePairs: f.length,
    infinitePairs: u.flat().length - f.length,
    max_dij: y,
    L0: w,
    L: C,
    kkconst: T,
    isKvalFinite: isFinite(T) && isFinite(C),
    avgDij: f.reduce((p, b) => p + b, 0) / f.length
  }), m(e, 0.4);
  const v = Array(c).fill(null).map(() => Array(c).fill(0)), A = Array(c).fill(null).map(() => Array(c).fill(0));
  for (let p = 0; p < c; p++)
    for (let b = 0; b < c; b++) {
      if (p === b) continue;
      const X = u[p][b];
      v[p][b] = T / (X * X), A[p][b] = C * X;
    }
  if (c > 1) {
    const X = Math.sqrt(
      Math.pow(g[0][0] - g[1][0], 2) + Math.pow(g[0][1] - g[1][1], 2)
    );
    console.log("[Kamada-Kawai] Sample spring values:", {
      "graph_dist[0,1]": u[0][1],
      "spring_const_kij[0,1]": v[0][1].toExponential(4),
      "desired_dist_lij[0,1]": A[0][1].toFixed(4),
      initial_euclidean_dist: X.toFixed(4),
      stress_ratio: (X / A[0][1]).toFixed(4),
      force: (v[0][1] * Math.abs(X - A[0][1])).toExponential(4)
    });
  }
  const Z = Array(c).fill(0), I = Array(c).fill(0);
  for (let p = 0; p < c; p++)
    for (let b = 0; b < c; b++) {
      if (b === p) continue;
      const X = g[p][0] - g[b][0], k = g[p][1] - g[b][1], E = Math.sqrt(X * X + k * k);
      E !== 0 && (Z[p] += v[p][b] * (X - A[p][b] * X / E), I[p] += v[p][b] * (k - A[p][b] * k / E));
    }
  const P = Z.map((p, b) => Math.sqrt(p * p + I[b] * I[b])), W = Math.max(...P), G = P.reduce((p, b) => p + b, 0) / c;
  console.log("[Kamada-Kawai] Initial gradient stats:", {
    maxEnergy: W.toFixed(4),
    avgEnergy: G.toFixed(4),
    threshold: Math.sqrt(d).toFixed(6)
  });
  for (let p = 0; p < o; p++) {
    let b = 0, X = -1;
    for (let B = 0; B < c; B++) {
      const Y = Z[B] * Z[B] + I[B] * I[B];
      Y > X && (b = B, X = Y);
    }
    if (X < d) {
      console.log(`[Kamada-Kawai] Converged at iteration ${p}/${o} with max_delta ${Math.sqrt(X).toFixed(6)} (threshold: ${Math.sqrt(d).toFixed(6)})`);
      break;
    }
    m(e, 0.4 + 0.6 * (p + 1) / o), (p % 500 === 0 || p < 5 || p === o - 1) && console.log(`[Kamada-Kawai] Iteration ${p}/${o}: max_delta = ${Math.sqrt(X).toFixed(6)}, node ${b}`);
    const k = g[b][0], E = g[b][1];
    let S = 0, J = 0, K = 0;
    for (let B = 0; B < c; B++) {
      if (B === b) continue;
      const Y = k - g[B][0], F = E - g[B][1], q = Math.sqrt(Y * Y + F * F);
      if (q === 0) continue;
      const H = q * (Y * Y + F * F);
      S += v[b][B] * (1 - A[b][B] * F * F / H), J += v[b][B] * A[b][B] * Y * F / H, K += v[b][B] * (1 - A[b][B] * Y * Y / H);
    }
    let at = 0, ct = 0;
    const ft = 1e-13, st = Z[b], ot = I[b];
    if (st * st + ot * ot >= ft * ft) {
      const B = K * S - J * J;
      Math.abs(B) > 1e-10 ? (ct = (J * st - S * ot) / B, at = (J * ot - K * st) / B) : p < 5 && console.warn(`[Kamada-Kawai] Iteration ${p}: Singular matrix (det=${B.toExponential(2)}) for node ${b}`);
    } else p < 5 && console.warn(`[Kamada-Kawai] Iteration ${p}: Gradient too small for node ${b}`);
    p < 3 && b === 0 && console.log(`[Kamada-Kawai] Iteration ${p}, node ${b}:`, {
      A: S.toFixed(4),
      B: J.toFixed(4),
      C: K.toFixed(4),
      det: (K * S - J * J).toExponential(4),
      myD1: st.toFixed(4),
      myD2: ot.toFixed(4),
      delta_x: at.toFixed(6),
      delta_y: ct.toFixed(6),
      old_pos: [k.toFixed(2), E.toFixed(2)]
    });
    const mt = k + at, yt = E + ct;
    Z[b] = 0, I[b] = 0;
    for (let B = 0; B < c; B++) {
      if (B === b) continue;
      const Y = k - g[B][0], F = E - g[B][1], q = Math.sqrt(Y * Y + F * F), H = mt - g[B][0], D = yt - g[B][1], nt = Math.sqrt(H * H + D * D);
      q === 0 || nt === 0 || (Z[B] -= v[b][B] * (-Y + A[b][B] * Y / q), I[B] -= v[b][B] * (-F + A[b][B] * F / q), Z[B] += v[b][B] * (-H + A[b][B] * H / nt), I[B] += v[b][B] * (-D + A[b][B] * D / nt), Z[b] += v[b][B] * (H - A[b][B] * H / nt), I[b] += v[b][B] * (D - A[b][B] * D / nt));
    }
    g[b][0] = mt, g[b][1] = yt;
  }
  m(e, 0.95), console.log("[Kamada-Kawai] Before rescaling - preparing positions");
  const x = {};
  l.forEach((p, b) => {
    x[p] = {
      x: g[b][0],
      y: g[b][1]
    };
  });
  const M = l[0];
  console.log("[Kamada-Kawai] Sample positions BEFORE rescaling:", {
    sample: M,
    value: x[M],
    allCount: Object.keys(x).length,
    minMax: (() => {
      let p = 1 / 0, b = -1 / 0, X = 1 / 0, k = -1 / 0;
      return Object.values(x).forEach((E) => {
        p = Math.min(p, E.x), b = Math.max(b, E.x), X = Math.min(X, E.y), k = Math.max(k, E.y);
      }), { minX: p, maxX: b, minY: X, maxY: k, rangeX: b - p, rangeY: k - X };
    })()
  }), console.log("[Kamada-Kawai] Calling rescaleLayout with correct signature, scale:", r, "center:", i);
  const z = et(x, l, r, i);
  console.log("[Kamada-Kawai] rescaleLayout completed successfully"), console.log("[Kamada-Kawai] Sample positions AFTER rescaling:", {
    sample: M,
    value: z[M],
    minMax: (() => {
      let p = 1 / 0, b = -1 / 0, X = 1 / 0, k = -1 / 0;
      return Object.values(z).forEach((E) => {
        p = Math.min(p, E.x), b = Math.max(b, E.x), X = Math.min(X, E.y), k = Math.max(k, E.y);
      }), { minX: p, maxX: b, minY: X, maxY: k, rangeX: b - p, rangeY: k - X };
    })()
  });
  const N = {};
  console.log("[Kamada-Kawai] Creating final positions dictionary");
  try {
    Object.entries(z).forEach(([X, k]) => {
      N[X] = {
        x: k.x,
        y: k.y
      };
    }), console.log("[Kamada-Kawai] Final positions dictionary created successfully, count:", Object.keys(N).length);
    const p = l.slice(0, 3), b = {};
    p.forEach((X) => {
      b[X] = N[X];
    }), console.log("[Kamada-Kawai] Sample final positions:", b);
  } catch (p) {
    throw console.error("[Kamada-Kawai] Error creating positions dictionary:", p.message), console.error("  rescaledDict:", z), p;
  }
  return m(e, 1), N;
}
function ls(n, t) {
  const e = t.length, s = Array(e).fill(null).map(() => Array(e).fill(1 / 0)), o = {};
  t.forEach((i, a) => {
    o[i] = a, s[a][a] = 0;
  });
  for (let i = 0; i < e; i++) {
    const a = t[i], d = [[a, 0]], h = /* @__PURE__ */ new Set([a]);
    for (; d.length > 0; ) {
      const [l, c] = d.shift(), u = o[l];
      u !== void 0 && (s[i][u] = c);
      const g = n.getNeighbors(l) || [];
      for (const f of g)
        h.has(f) || (h.add(f), d.push([f, c + 1]));
    }
  }
  let r = 0;
  for (let i = 0; i < e; i++)
    for (let a = i + 1; a < e; a++)
      isFinite(s[i][a]) && s[i][a] > r && (r = s[i][a]);
  for (let i = 0; i < e; i++)
    for (let a = 0; a < e; a++)
      s[i][a] > r && (s[i][a] = r);
  return s;
}
function ds(n, t) {
  const e = n.length, s = [];
  if (t && Object.keys(t).length > 0)
    n.forEach((o) => {
      const r = t[o];
      r ? s.push([r.x || 0, r.y || 0]) : s.push([Math.random(), Math.random()]);
    });
  else {
    const o = Math.sqrt(e);
    if (e > 100) {
      const r = o * 3;
      console.log(`[Kamada-Kawai] Random initialization: spread=${r.toFixed(2)}, L0=${o.toFixed(2)}`);
      for (let i = 0; i < e; i++) {
        const a = (Math.random() - 0.5) * r, d = (Math.random() - 0.5) * r;
        s.push([a, d]);
      }
    } else {
      const r = 2 * Math.PI / e, i = o * 2;
      console.log(`[Kamada-Kawai] Circular initialization: radius=${i.toFixed(2)}, L0=${o.toFixed(2)}`);
      for (let a = 0; a < e; a++) {
        const d = i * Math.cos(a * r), h = i * Math.sin(a * r);
        s.push([d, h]);
      }
    }
  }
  return s;
}
const Ut = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KamadaKawaiLayout: Zt,
  default: Zt,
  kamadaKawaiCompute: cs
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
async function hs(n, t, e) {
  const s = R(n), {
    partition: o = null,
    align: r = "vertical",
    scale: i = 1,
    aspectRatio: a = 4 / 3,
    center: d = { x: 0, y: 0 }
  } = t || {}, h = Array.from(s.nodes), l = h.length;
  if (l === 0)
    return m(e, 1), {};
  if (l === 1) {
    const x = { [h[0]]: { x: d.x, y: d.y } };
    return m(e, 1), x;
  }
  m(e, 0.3);
  let c, u;
  o && o.length > 0 ? (c = new Set(o), u = new Set(h.filter((x) => !c.has(x)))) : (c = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Set(), h.forEach((x, M) => {
    M % 2 === 0 ? c.add(x) : u.add(x);
  })), m(e, 0.5);
  const g = Array.from(c), f = Array.from(u), y = [], w = g.length - 1 || 1, C = f.length - 1 || 1, T = a * 2, v = 2, A = T / 2, Z = v / 2;
  g.forEach((x, M) => {
    const z = -A, N = w > 0 ? M * v / w - Z : 0;
    y.push([z, N]);
  }), f.forEach((x, M) => {
    const z = A, N = C > 0 ? M * v / C - Z : 0;
    y.push([z, N]);
  }), m(e, 0.7);
  const I = [...g, ...f], P = {};
  I.forEach((x, M) => {
    P[x] = {
      x: y[M][0],
      y: y[M][1]
    };
  });
  const W = et(P, I, i, d);
  m(e, 0.9);
  const G = {};
  return I.forEach((x) => {
    G[x] = W[x];
  }), r === "horizontal" && Object.keys(G).forEach((x) => {
    const M = G[x].x;
    G[x].x = G[x].y, G[x].y = M;
  }), m(e, 1), G;
}
const qt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BipartiteLayout: Wt,
  bipartiteCompute: hs,
  default: Wt
}, Symbol.toStringTag, { value: "Module" }));
class Mt extends V {
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
async function us(n, t, e) {
  const s = R(n), {
    subsets: o = null,
    align: r = "vertical",
    scale: i = 1,
    center: a = { x: 0, y: 0 }
  } = t || {}, d = Array.from(s.nodes), h = d.length;
  if (h === 0)
    return m(e, 1), {};
  if (h === 1) {
    const T = { [d[0]]: { x: a.x, y: a.y } };
    return m(e, 1), T;
  }
  m(e, 0.3);
  let l;
  if (o && Object.keys(o).length > 0)
    l = Object.keys(o).sort((v, A) => {
      const Z = parseInt(v), I = parseInt(A);
      return isNaN(Z) ? 1 : isNaN(I) ? -1 : Z - I;
    }).map((v) => o[v]);
  else {
    const T = /* @__PURE__ */ new Map();
    d.forEach((v, A) => {
      const Z = A % 3;
      T.has(Z) || T.set(Z, []), T.get(Z).push(v);
    }), l = Array.from(T.values());
  }
  m(e, 0.5);
  const c = [], u = {}, g = l.length, f = g * 2 - 1;
  l.forEach((T, v) => {
    const A = T.length - 1 || 1, Z = (v * 2 - f / 2) / (g - 1 || 1);
    T.forEach((I, P) => {
      const W = A > 0 ? 2 * P / A - 1 : 0;
      c.push([Z, W]);
    });
  }), m(e, 0.7);
  const y = [];
  l.forEach((T) => {
    T.forEach((v) => {
      y.push(v);
    });
  });
  const w = {};
  y.forEach((T, v) => {
    w[T] = {
      x: c[v][0],
      y: c[v][1]
    };
  });
  const C = et(w, y, i, a);
  return m(e, 0.9), y.forEach((T) => {
    u[T] = C[T];
  }), r === "horizontal" && Object.keys(u).forEach((T) => {
    const v = u[T].x;
    u[T].x = u[T].y, u[T].y = v;
  }), m(e, 1), u;
}
const Dt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MultipartiteLayout: Mt,
  default: Mt,
  multipartiteCompute: us
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
async function gs(n, t, e) {
  const s = R(n), {
    startNode: o = null,
    align: r = "vertical",
    scale: i = 1,
    center: a = { x: 0, y: 0 }
  } = t || {}, d = Array.from(s.nodes), h = d.length;
  if (h === 0)
    return m(e, 1), {};
  if (h === 1) {
    const v = { [d[0]]: { x: a.x, y: a.y } };
    return m(e, 1), v;
  }
  m(e, 0.2);
  let l = o;
  (!l || !d.includes(l)) && (l = d[0]), m(e, 0.3);
  const c = fs(s, l);
  m(e, 0.6);
  const u = /* @__PURE__ */ new Set();
  if (c.forEach((v) => {
    v.forEach((A) => u.add(A));
  }), u.size !== h) {
    const v = d.filter((A) => !u.has(A));
    v.length > 0 && c.push(v);
  }
  m(e, 0.7);
  const g = [], f = c.length;
  Math.max(...c.map((v) => v.length)), c.forEach((v, A) => {
    const Z = f > 1 ? 2 * A / (f - 1) - 1 : 0, I = v.length - 1 || 1;
    v.forEach((P, W) => {
      const G = I > 0 ? 2 * W / I - 1 : 0;
      g.push([Z, G]);
    });
  }), m(e, 0.85);
  const y = [];
  c.forEach((v) => {
    v.forEach((A) => {
      y.push(A);
    });
  });
  const w = {};
  y.forEach((v, A) => {
    w[v] = {
      x: g[A][0],
      y: g[A][1]
    };
  });
  const C = et(w, y, i, a);
  m(e, 0.95);
  const T = {};
  return y.forEach((v) => {
    T[v] = C[v];
  }), r === "horizontal" && Object.keys(T).forEach((v) => {
    const A = T[v].x;
    T[v].x = T[v].y, T[v].y = A;
  }), m(e, 1), T;
}
function fs(n, t, e) {
  const s = [], o = /* @__PURE__ */ new Set(), r = [t];
  let i = [];
  for (o.add(t); r.length > 0; ) {
    const c = r.shift();
    i.push(c);
    const g = (n.getNeighbors(c) || []).filter((f) => !o.has(f));
    g.forEach((f) => {
      o.add(f), r.push(f);
    }), (r.length === 0 || g.length > 0) && i.length > 0 && (s.push([...i]), i = []);
  }
  s.length = 0, i = [];
  const a = /* @__PURE__ */ new Map(), d = [t];
  let h = 0;
  a.set(t, 0);
  let l = 0;
  for (; h < d.length; ) {
    const c = d[h], u = a.get(c);
    u > l && (i.length > 0 && (s.push([...i]), i = []), l = u), i.push(c), (n.getNeighbors(c) || []).forEach((f) => {
      a.has(f) || (a.set(f, u + 1), d.push(f));
    }), h++;
  }
  return i.length > 0 && s.push([...i]), s;
}
const Qt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BFSLayout: Xt,
  bfsCompute: gs,
  default: Xt
}, Symbol.toStringTag, { value: "Module" }));
class Bt extends V {
  /**
   * Create a DFS layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {string} [options.startNode=null] - Starting node for DFS (first node if null)
   * @param {string} [options.align='vertical'] - 'vertical' (tree grows down) or 'horizontal' (tree grows right)
   * @param {number} [options.scale=1] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0}] - Center point
   * @param {number} [options.horizontalSpacing=1] - Spacing between sibling nodes
   * @param {number} [options.verticalSpacing=1] - Spacing between depth levels
   */
  constructor(t, e = {}) {
    super(t, {
      startNode: null,
      align: "vertical",
      scale: 1,
      center: { x: 0, y: 0 },
      horizontalSpacing: 1,
      verticalSpacing: 1,
      ...e
    }, {
      module: "../layouts/dfs.js",
      functionName: "dfsCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function ms(n, t, e) {
  const s = R(n), {
    startNode: o = null,
    align: r = "vertical",
    scale: i = 1,
    center: a = { x: 0, y: 0 },
    horizontalSpacing: d = 1,
    verticalSpacing: h = 1
  } = t || {}, l = Array.from(s.nodes), c = l.length;
  if (c === 0)
    return m(e, 1), {};
  if (c === 1) {
    const I = { [l[0]]: { x: a.x, y: a.y } };
    return m(e, 1), I;
  }
  m(e, 0.1);
  let u = o;
  (!u || !l.includes(u)) && (u = l[0]), m(e, 0.2);
  const { tree: g, roots: f, depths: y, maxDepth: w } = ys(s, u, l);
  m(e, 0.5);
  const C = ps(g, f);
  m(e, 0.7);
  const T = bs(g, f, y, w, C, {
    horizontalSpacing: d,
    verticalSpacing: h
  });
  m(e, 0.85);
  const v = Object.keys(T), A = {};
  v.forEach((I) => {
    A[I] = T[I];
  });
  const Z = et(A, v, i, a);
  return m(e, 0.95), r === "horizontal" && Object.keys(Z).forEach((I) => {
    const P = Z[I].x;
    Z[I].x = Z[I].y, Z[I].y = P;
  }), m(e, 1), Z;
}
function ys(n, t, e) {
  const s = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Map(), i = [];
  let a = 0;
  e.forEach((h) => {
    s.set(h, { parent: null, children: [] });
  });
  const d = [t];
  e.forEach((h) => {
    h !== t && d.push(h);
  });
  for (const h of d) {
    if (o.has(h)) continue;
    i.push(h);
    const l = [[h, 0]];
    for (; l.length > 0; ) {
      const [c, u] = l.pop();
      if (o.has(c)) continue;
      o.add(c), r.set(c, u), a = Math.max(a, u);
      const f = (n.getNeighbors(c) || []).filter((y) => !o.has(y));
      for (let y = f.length - 1; y >= 0; y--) {
        const w = f[y];
        s.get(c).children.push(w), s.get(w).parent = c, l.push([w, u + 1]);
      }
    }
  }
  return { tree: s, roots: i, depths: r, maxDepth: a };
}
function ps(n, t) {
  const e = /* @__PURE__ */ new Map();
  function s(o) {
    const i = n.get(o).children;
    if (i.length === 0)
      return e.set(o, 1), 1;
    let a = 0;
    for (const d of i)
      a += s(d);
    return e.set(o, a), a;
  }
  for (const o of t)
    s(o);
  return e;
}
function bs(n, t, e, s, o, r) {
  const i = {}, { horizontalSpacing: a, verticalSpacing: d } = r, h = /* @__PURE__ */ new Map();
  for (const [I, P] of e.entries())
    h.has(P) || h.set(P, []), h.get(P).push(I);
  const l = d * 2, c = a;
  for (let I = 0; I <= s; I++) {
    const P = h.get(I) || [], W = P.length;
    W !== 0 && (P.sort((G, x) => {
      const M = n.get(G).parent, z = n.get(x).parent;
      if (M === z) return 0;
      if (!M) return -1;
      if (!z) return 1;
      const N = i[M], p = i[z];
      return N && p ? N.x - p.x : 0;
    }), P.forEach((G, x) => {
      const M = (x - (W - 1) / 2) * c, z = I * l;
      i[G] = { x: M, y: z };
    }));
  }
  const u = Object.values(i).map((I) => I.x), g = Object.values(i).map((I) => I.y);
  if (u.length === 0) return i;
  const f = Math.min(...u), y = Math.max(...u), w = Math.min(...g), C = Math.max(...g), T = (f + y) / 2, v = (w + C) / 2, A = y - f || 1, Z = C - w || 1;
  return Object.keys(i).forEach((I) => {
    i[I] = {
      x: (i[I].x - T) / (A / 2),
      y: (i[I].y - v) / (Z / 2)
    };
  }), i;
}
const $t = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DFSLayout: Bt,
  default: Bt,
  dfsCompute: ms
}, Symbol.toStringTag, { value: "Module" }));
class kt extends V {
  /**
   * Create a Radial layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {string} [options.centerNode=null] - Center node (first node if null, or highest degree)
   * @param {number} [options.scale=1] - Scale factor for positions (radius of outermost ring)
   * @param {Object} [options.center={x:0, y:0}] - Center point
   * @param {number} [options.startAngle=0] - Starting angle in radians (0 = right, PI/2 = top)
   * @param {boolean} [options.sortByDegree=true] - Sort nodes within rings by degree
   */
  constructor(t, e = {}) {
    super(t, {
      centerNode: null,
      scale: 1,
      center: { x: 0, y: 0 },
      startAngle: -Math.PI / 2,
      // Start from top
      sortByDegree: !0,
      ...e
    }, {
      module: "../layouts/radial.js",
      functionName: "radialCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function Is(n, t, e) {
  const s = R(n), {
    centerNode: o = null,
    scale: r = 1,
    center: i = { x: 0, y: 0 },
    startAngle: a = -Math.PI / 2,
    sortByDegree: d = !0,
    nodeSizes: h = {},
    // Node ID -> size mapping
    defaultNodeSize: l = 8,
    // Default size for nodes not in nodeSizes
    nodePadding: c = 4
    // Extra space between nodes
  } = t || {}, u = Object.keys(h).length, g = Object.entries(h).slice(0, 3);
  console.log("[radialCompute] Options received:", {
    scale: r,
    nodeSizeCount: u,
    defaultNodeSize: l,
    nodePadding: c,
    sampleSizes: g.map(([G, x]) => `${G}: ${x}`)
  });
  const f = Array.from(s.nodes), y = f.length;
  if (y === 0)
    return m(e, 1), {};
  if (y === 1) {
    const G = { [f[0]]: { x: i.x, y: i.y } };
    return m(e, 1), G;
  }
  m(e, 0.1);
  let w = o;
  if (!w || !f.includes(w)) {
    let G = -1;
    f.forEach((x) => {
      const M = (s.getNeighbors(x) || []).length;
      M > G && (G = M, w = x);
    });
  }
  m(e, 0.2);
  const C = Cs(s, w);
  m(e, 0.5);
  const T = /* @__PURE__ */ new Set();
  if (C.forEach((G) => {
    G.forEach((x) => T.add(x));
  }), T.size !== y) {
    const G = f.filter((x) => !T.has(x));
    G.length > 0 && C.push(G);
  }
  m(e, 0.6);
  const v = /* @__PURE__ */ new Map();
  f.forEach((G) => {
    v.set(G, (s.getNeighbors(G) || []).length);
  }), d && C.forEach((G) => {
    G.sort((x, M) => v.get(M) - v.get(x));
  }), m(e, 0.7);
  const A = {};
  A[w] = { x: i.x, y: i.y };
  const Z = r * 0.5, I = r * 0.3, P = (G) => h[G] || l;
  let W = 0;
  return C.forEach((G, x) => {
    if (x === 0)
      return;
    const M = G.length, z = G.reduce((X, k) => {
      const S = P(k) * 2;
      return X + S + c;
    }, 0), N = z / (2 * Math.PI), p = x === 1 ? Z : W + I, b = Math.max(p, N);
    x <= 4 && console.log(`[radialCompute] Ring ${x}:`, {
      nodesInRing: M,
      totalArcNeeded: Math.round(z),
      radiusForSpacing: Math.round(N),
      minRadiusForPosition: Math.round(p),
      finalRadius: Math.round(b)
    }), W = b, G.forEach((X, k) => {
      const E = a + 2 * Math.PI * k / M;
      A[X] = {
        x: i.x + b * Math.cos(E),
        y: i.y + b * Math.sin(E)
      };
    });
  }), m(e, 0.95), f.forEach((G) => {
    A[G] || (A[G] = { x: i.x, y: i.y });
  }), m(e, 1), A;
}
function Cs(n, t) {
  const e = [], s = /* @__PURE__ */ new Map(), o = [t];
  let r = 0;
  s.set(t, 0);
  let i = 0, a = [];
  for (; r < o.length; ) {
    const d = o[r], h = s.get(d);
    h > i && (a.length > 0 && (e.push([...a]), a = []), i = h), a.push(d), (n.getNeighbors(d) || []).forEach((c) => {
      s.has(c) || (s.set(c, h + 1), o.push(c));
    }), r++;
  }
  return a.length > 0 && e.push([...a]), e;
}
const te = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  RadialLayout: kt,
  default: kt,
  radialCompute: Is
}, Symbol.toStringTag, { value: "Module" }));
class Et extends V {
  /**
   * Create a 3D force-directed layout instance
   *
   * @param {Graph} graph - The graph to layout
   * @param {Object} [options={}] - Layout options
   * @param {number} [options.iterations=50] - Number of iterations to run
   * @param {number} [options.k=null] - Optimal distance between nodes (auto-calculated if null)
   * @param {number} [options.scale=1] - Scale factor for positions
   * @param {Object} [options.center={x:0, y:0, z:0}] - Center point in 3D space
   * @param {Object} [options.initialPositions=null] - Initial node positions (can be 2D or 3D)
   * @param {number} [options.threshold=1e-4] - Convergence threshold
   * @param {number} [options.gravity=1] - Gravitational pull toward center (prevents drift)
   */
  constructor(t, e = {}) {
    super(t, {
      iterations: 50,
      k: null,
      scale: 1,
      center: { x: 0, y: 0, z: 0 },
      initialPositions: null,
      threshold: 1e-4,
      gravity: 1,
      ...e
    }, {
      module: "../layouts/force-directed-3d.js",
      functionName: "forceDirected3DCompute"
    });
  }
  // computePositions() inherited from base class - delegates to worker!
}
async function ws(n, t, e) {
  const s = R(n), {
    iterations: o = 50,
    k: r = null,
    scale: i = 1,
    center: a = { x: 0, y: 0, z: 0 },
    initialPositions: d = null,
    threshold: h = 1e-4,
    gravity: l = 1
  } = t || {}, c = Array.from(s.nodes), u = c.length;
  if (u === 0)
    return m(e, 1), {};
  if (u === 1) {
    const Z = { [c[0]]: { x: a.x, y: a.y, z: a.z } };
    return m(e, 1), Z;
  }
  m(e, 0.05);
  let g = {};
  d ? c.forEach((Z) => {
    const I = d[Z];
    I ? g[Z] = {
      x: I.x,
      y: I.y,
      z: I.z !== void 0 ? I.z : Math.random()
    } : g[Z] = {
      x: Math.random(),
      y: Math.random(),
      z: Math.random()
    };
  }) : g = is(c);
  const f = i * u * u, y = r !== null ? r : Math.pow(f / (u + 1), 1 / 3);
  let w = Math.sqrt(u);
  const C = w / (o + 1), T = 0.01, v = /* @__PURE__ */ new Map();
  c.forEach((Z) => {
    const I = new Set(s.getNeighbors(Z));
    v.set(Z, I);
  }), m(e, 0.1);
  for (let Z = 0; Z < o; Z++) {
    const I = {};
    c.forEach((W) => {
      I[W] = { x: 0, y: 0, z: 0 };
    });
    for (let W = 0; W < u; W++)
      for (let G = W + 1; G < u; G++) {
        const x = c[W], M = c[G], z = g[x], N = g[M], p = z.x - N.x, b = z.y - N.y, X = z.z - N.z, k = Math.sqrt(p * p + b * b + X * X) + T, E = y * y / k, S = p / k * E, J = b / k * E, K = X / k * E;
        I[x].x += S, I[x].y += J, I[x].z += K, I[M].x -= S, I[M].y -= J, I[M].z -= K;
      }
    s.edges.forEach((W) => {
      const G = g[W.u], x = g[W.v], M = x.x - G.x, z = x.y - G.y, N = x.z - G.z, p = Math.sqrt(M * M + z * z + N * N) + T, b = p * p / y, X = M / p * b, k = z / p * b, E = N / p * b;
      I[W.u].x += X, I[W.u].y += k, I[W.u].z += E, I[W.v].x -= X, I[W.v].y -= k, I[W.v].z -= E;
    }), l > 0 && c.forEach((W) => {
      const G = g[W], x = a.x - G.x, M = a.y - G.y, z = a.z - G.z, N = Math.sqrt(x * x + M * M + z * z) + T, p = 0.1 * y * l;
      I[W].x += x / N * p, I[W].y += M / N * p, I[W].z += z / N * p;
    });
    let P = 0;
    if (c.forEach((W) => {
      const G = I[W], x = Math.sqrt(G.x * G.x + G.y * G.y + G.z * G.z) + T, M = Math.min(x, w) / x;
      g[W].x += G.x * M, g[W].y += G.y * M, g[W].z += G.z * M, P += x;
    }), w -= C, P / u < h) {
      m(e, 1);
      break;
    }
    Z % 10 === 0 && m(e, 0.1 + 0.8 * (Z / o));
  }
  const A = rs(g, c, i, a);
  return m(e, 1), A;
}
const ee = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ForceDirected3DLayout: Et,
  default: Et,
  forceDirected3DCompute: ws
}, Symbol.toStringTag, { value: "Module" })), it = rt({
  prefix: "network-worker",
  level: "info"
  // Workers default to info level
}), dt = {
  // Node-level statistics (all in one file)
  "../statistics/algorithms/node-stats.js": Yt,
  // Graph-level statistics
  "../statistics/algorithms/graph-stats.js": Jt,
  // Community
  "../community/algorithms/louvain.js": jt,
  // Layouts
  "../layouts/random.js": Vt,
  "../layouts/circular.js": Ft,
  "../layouts/spiral.js": Kt,
  "../layouts/shell.js": Ht,
  "../layouts/spectral.js": Ot,
  "../layouts/force-directed.js": _t,
  "../layouts/kamada-kawai.js": Ut,
  "../layouts/bipartite.js": qt,
  "../layouts/multipartite.js": Dt,
  "../layouts/bfs.js": Qt,
  "../layouts/dfs.js": $t,
  "../layouts/radial.js": te,
  "../layouts/force-directed-3d.js": ee
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
    const r = (h) => {
      self.postMessage({
        id: t,
        status: "progress",
        progress: Math.min(Math.max(h, 0), 1)
        // Clamp to [0, 1]
      });
    }, i = dt[e];
    if (!i)
      throw new Error(
        `Module '${e}' not found in registry. Available modules: ${Object.keys(dt).join(", ")}`
      );
    const a = i[s];
    if (!a || typeof a != "function")
      throw new Error(
        `Function '${s}' not found in module '${e}'. Available functions: ${Object.keys(i).join(", ")}`
      );
    const d = await a(...o, r);
    self.postMessage({
      id: t,
      status: "complete",
      result: d
    });
  } catch (r) {
    it.error("Task failed", {
      id: t,
      error: r.message,
      stack: r.stack
    }), self.postMessage({
      id: t,
      status: "error",
      error: r.message || "Unknown error",
      stack: r.stack
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
  "../statistics/algorithms/node-stats.js": Yt,
  // Graph-level statistics
  "../statistics/algorithms/graph-stats.js": Jt,
  // Community
  "../community/algorithms/louvain.js": jt,
  // Layouts
  "../layouts/random.js": Vt,
  "../layouts/circular.js": Ft,
  "../layouts/spiral.js": Kt,
  "../layouts/shell.js": Ht,
  "../layouts/spectral.js": Ot,
  "../layouts/force-directed.js": _t,
  "../layouts/kamada-kawai.js": Ut,
  "../layouts/bipartite.js": qt,
  "../layouts/multipartite.js": Dt,
  "../layouts/bfs.js": Qt,
  "../layouts/dfs.js": $t,
  "../layouts/radial.js": te,
  "../layouts/force-directed-3d.js": ee
};
async function vs(n) {
  const { module: t, functionName: e, args: s = [] } = n;
  if (!t || !e)
    throw new Error("Invalid task: module and functionName are required");
  const o = ht[t];
  if (!o)
    throw new Error(
      `Module '${t}' not found in registry. Available modules: ${Object.keys(ht).join(", ")}`
    );
  const r = o[e];
  if (!r || typeof r != "function")
    throw new Error(
      `Function '${e}' not found in module '${t}'. Available functions: ${Object.keys(o).join(", ")}`
    );
  const i = () => {
  };
  return await r(...s, i);
}
const Gs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MODULE_REGISTRY: ht,
  executeTask: vs
}, Symbol.toStringTag, { value: "Module" }));
//# sourceMappingURL=network-worker.js.map
