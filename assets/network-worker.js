const D = {
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
  TRACE: 5
}, Ne = "info", fe = "sandbox_logging_filters", pe = ["themeswitcher", "codemirroreditor", "editoradapter"];
class Le {
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
    this.enabled = e.enabled !== !1, this.level = e.level || Ne, this.prefix = e.prefix || "", this.component = this.prefix, this.redactSecrets = e.redactSecrets || !1, this.currentLevel = D[this.level.toUpperCase()] ?? D.INFO, this.loggingManager = e.loggingManager, this.console = e.console || console, this.component && this.loggingManager && this.loggingManager.registerComponent(this.component);
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
    const s = this.prefix ? `[${this.prefix}] ` : "", n = this.redactArgs(t);
    return [s + e, ...n];
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
      const n = this.formatMessage(e, ...t);
      this.redactSecrets = s, this.console.trace(...n);
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
class Re {
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
        this.storage.setItem(fe, JSON.stringify(e));
      } catch {
      }
  }
  /**
   * Loads filter state from storage
   */
  loadFromStorage() {
    if (this.storage)
      try {
        const e = this.storage.getItem(fe), t = JSON.parse(e || "{}");
        this.allowedComponents = new Set(t.allowedComponents || []), this.allowAll = t.allowAll || !1, this.globalEnabled = t.globalEnabled !== !1, e || (this.allowedComponents = new Set(pe));
      } catch {
        this.allowedComponents = new Set(pe);
      }
  }
}
class Xe {
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
class Je extends Xe {
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
class ze extends Xe {
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
function Ee() {
  return typeof localStorage < "u" ? new ze() : new Je();
}
class Be {
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
class Ke extends Be {
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
class Ye extends Be {
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
function Fe() {
  return typeof window < "u" ? new Ke() : new Ye();
}
const Ve = Ee(), Se = Fe(), O = new Re({
  storage: Ve,
  console
});
typeof window < "u" && Se.setGlobalProperty("logFilter", {
  enable: (...o) => O.enable(...o),
  disable: (...o) => O.disable(...o),
  enableAll: () => O.enableAll(),
  disableAll: () => O.disableAll(),
  status: () => O.status(),
  list: () => O.listComponents()
});
function re(o = {}) {
  return new Le({
    ...o,
    loggingManager: O
  });
}
class oe {
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
    if (typeof Worker < "u")
      return new ge(e);
    if (typeof require < "u")
      try {
        return require.resolve("worker_threads"), new je(e);
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
class ge extends oe {
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
class je extends oe {
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
class He {
  /**
   * Create a new worker pool
   *
   * @param {Object} options - Configuration options
   * @param {number} [options.maxWorkers] - Maximum number of workers (default: CPU count)
   * @param {string} [options.workerScript] - Path to worker script
   * @param {number} [options.taskTimeout] - Task timeout in ms (default: 60000)
   * @param {boolean} [options.verbose] - Enable verbose logging
   */
  constructor(e = {}) {
    this.maxWorkers = e.maxWorkers || this.detectCPUCount(), this.workerScript = e.workerScript || this.getDefaultWorkerScript(), this.taskTimeout = e.taskTimeout || 6e4, this.verbose = e.verbose || !1, this.workers = [], this.availableWorkers = [], this.taskQueue = [], this.activeTasks = /* @__PURE__ */ new Map(), this.taskIdCounter = 0, this.initialized = !1, this.log = re({
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
      if (!oe.isSupported())
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
    const t = oe.create(this.workerScript);
    return t.id = e, t.currentTaskId = null, t.onMessage((s) => {
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
    return new Promise((s, n) => {
      const r = `task_${this.taskIdCounter++}`, i = { id: r, ...e }, a = t.timeout || this.taskTimeout, d = setTimeout(() => {
        this.handleTaskTimeout(r);
      }, a);
      if (this.activeTasks.set(r, {
        resolve: s,
        reject: n,
        onProgress: t.onProgress,
        timeoutId: d,
        startTime: Date.now()
      }), this.availableWorkers.length > 0) {
        const h = this.availableWorkers.pop();
        this.assignTask(h, i), this.log.debug("Task assigned to worker", { taskId: r, workerId: h.id });
      } else
        this.taskQueue.push(i), this.log.debug("Task queued", { taskId: r, queueLength: this.taskQueue.length });
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
  /**
   * Handle message from worker
   * @private
   * @param {WorkerAdapter} worker - Worker that sent message
   * @param {Object} message - Message from worker
   */
  handleWorkerMessage(e, t) {
    const { id: s, status: n, result: r, progress: i, error: a } = t, d = this.activeTasks.get(s);
    if (!d) {
      this.log.warn("Received message for unknown task", { taskId: s });
      return;
    }
    if (n === "progress")
      d.onProgress && d.onProgress(i), this.log.debug("Task progress", { taskId: s, progress: Math.round(i * 100) });
    else if (n === "complete") {
      const h = Date.now() - d.startTime;
      this.log.debug("Task completed", { taskId: s, duration: h }), clearTimeout(d.timeoutId), d.resolve(r), this.activeTasks.delete(s), this.freeWorker(e);
    } else n === "error" && (this.log.error("Task failed", { taskId: s, error: a }), clearTimeout(d.timeoutId), d.reject(new Error(a)), this.activeTasks.delete(s), this.freeWorker(e));
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
    const s = this.workers.find((n) => n.currentTaskId === e);
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
        this.workers[t] = s, this.availableWorkers.push(s), this.log.info("Worker restarted successfully", { workerId: e.id });
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
        const s = Date.now(), n = setInterval(() => {
          (this.activeTasks.size === 0 || Date.now() - s > e) && (clearInterval(n), this.log.debug("Wait complete", { remainingTasks: this.activeTasks.size }), t());
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
    return {
      initialized: this.initialized,
      totalWorkers: this.workers.length,
      availableWorkers: this.availableWorkers.length,
      busyWorkers: this.workers.length - this.availableWorkers.length,
      activeTasks: this.activeTasks.size,
      queuedTasks: this.taskQueue.length
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
      taskTimeout: n = 6e4,
      verbose: r = !1
    } = e;
    this.log.setLevel(r ? "debug" : "info");
    let i = s;
    if (!i)
      try {
        i = new URL("data:text/javascript;base64,LyoqCiAqIE5ldHdvcmsgV29ya2VyIC0gRXhlY3V0ZXMgY29tcHV0ZSBmdW5jdGlvbnMgZnJvbSBhbGdvcml0aG0gbW9kdWxlcwogKgogKiAqKkJ1bmRsZXItRnJpZW5kbHkgQXJjaGl0ZWN0dXJlOioqCiAqIC0gU3RhdGljYWxseSBpbXBvcnRzIGFsbCBhbGdvcml0aG0gbW9kdWxlcyB1cGZyb250CiAqIC0gQ3JlYXRlcyBhIHJlZ2lzdHJ5IHRoYXQgbWFwcyBtb2R1bGUgcGF0aHMgdG8gdGhlaXIgZXhwb3J0cwogKiAtIE1haW4gdGhyZWFkIHNlbmRzOiB7IGlkLCBtb2R1bGUsIGZ1bmN0aW9uTmFtZSwgYXJncyB9CiAqIC0gV29ya2VyIGxvb2tzIHVwIG1vZHVsZSBmcm9tIHJlZ2lzdHJ5IGFuZCBleGVjdXRlcyBmdW5jdGlvbgogKgogKiBUaGlzIGFwcHJvYWNoIHdvcmtzIHdpdGggYWxsIGJ1bmRsZXJzIChWaXRlLCBXZWJwYWNrLCBSb2xsdXApIGJlY2F1c2UKICogaW1wb3J0cyBhcmUga25vd24gYXQgYnVpbGQgdGltZS4KICoKICogQG1vZHVsZSBuZXR3b3JrLXdvcmtlcgogKi8KCmltcG9ydCB7IGNyZWF0ZUxvZ2dlciB9IGZyb20gJ0BndWluZXRpay9sb2dnZXInOwoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBTVEFUSUMgSU1QT1JUUyAtIEFsbCBhbGdvcml0aG0gbW9kdWxlcyBpbXBvcnRlZCB1cGZyb250Ci8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCi8vIENyZWF0ZSBsb2dnZXIgZm9yIHdvcmtlciAocnVucyBpbiBzZXBhcmF0ZSBjb250ZXh0LCBubyB3aW5kb3cubG9nRmlsdGVyKQpjb25zdCBsb2cgPSBjcmVhdGVMb2dnZXIoewogIHByZWZpeDogJ25ldHdvcmstd29ya2VyJywKICBsZXZlbDogJ2luZm8nIC8vIFdvcmtlcnMgZGVmYXVsdCB0byBpbmZvIGxldmVsCn0pOwoKLy8gU3RhdGlzdGljcyBhbGdvcml0aG1zIChub2RlLWxldmVsIGFuZCBncmFwaC1sZXZlbCkKaW1wb3J0ICogYXMgbm9kZVN0YXRzQ29tcHV0ZSBmcm9tICcuLi9zdGF0aXN0aWNzL2FsZ29yaXRobXMvbm9kZS1zdGF0cy5qcyc7CmltcG9ydCAqIGFzIGdyYXBoU3RhdHNDb21wdXRlIGZyb20gJy4uL3N0YXRpc3RpY3MvYWxnb3JpdGhtcy9ncmFwaC1zdGF0cy5qcyc7CgovLyBDb21tdW5pdHkgZGV0ZWN0aW9uIGFsZ29yaXRobXMKaW1wb3J0ICogYXMgbG91dmFpbkNvbXB1dGUgZnJvbSAnLi4vY29tbXVuaXR5L2FsZ29yaXRobXMvbG91dmFpbi5qcyc7CgovLyBMYXlvdXQgYWxnb3JpdGhtcwppbXBvcnQgKiBhcyByYW5kb21Db21wdXRlIGZyb20gJy4uL2xheW91dHMvcmFuZG9tLmpzJzsKaW1wb3J0ICogYXMgY2lyY3VsYXJDb21wdXRlIGZyb20gJy4uL2xheW91dHMvY2lyY3VsYXIuanMnOwppbXBvcnQgKiBhcyBzcGlyYWxDb21wdXRlIGZyb20gJy4uL2xheW91dHMvc3BpcmFsLmpzJzsKaW1wb3J0ICogYXMgc2hlbGxDb21wdXRlIGZyb20gJy4uL2xheW91dHMvc2hlbGwuanMnOwppbXBvcnQgKiBhcyBzcGVjdHJhbENvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9zcGVjdHJhbC5qcyc7CmltcG9ydCAqIGFzIGZvcmNlRGlyZWN0ZWRDb21wdXRlIGZyb20gJy4uL2xheW91dHMvZm9yY2UtZGlyZWN0ZWQuanMnOwppbXBvcnQgKiBhcyBrYW1hZGFLYXdhaUNvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9rYW1hZGEta2F3YWkuanMnOwppbXBvcnQgKiBhcyBiaXBhcnRpdGVDb21wdXRlIGZyb20gJy4uL2xheW91dHMvYmlwYXJ0aXRlLmpzJzsKaW1wb3J0ICogYXMgbXVsdGlwYXJ0aXRlQ29tcHV0ZSBmcm9tICcuLi9sYXlvdXRzL211bHRpcGFydGl0ZS5qcyc7CmltcG9ydCAqIGFzIGJmc0NvbXB1dGUgZnJvbSAnLi4vbGF5b3V0cy9iZnMuanMnOwoKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQovLyBNT0RVTEUgUkVHSVNUUlkgLSBNYXBzIG1vZHVsZSBwYXRocyB0byB0aGVpciBleHBvcnRzCi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0KCmNvbnN0IE1PRFVMRV9SRUdJU1RSWSA9IHsKICAvLyBOb2RlLWxldmVsIHN0YXRpc3RpY3MgKGFsbCBpbiBvbmUgZmlsZSkKICAnLi4vc3RhdGlzdGljcy9hbGdvcml0aG1zL25vZGUtc3RhdHMuanMnOiBub2RlU3RhdHNDb21wdXRlLAoKICAvLyBHcmFwaC1sZXZlbCBzdGF0aXN0aWNzCiAgJy4uL3N0YXRpc3RpY3MvYWxnb3JpdGhtcy9ncmFwaC1zdGF0cy5qcyc6IGdyYXBoU3RhdHNDb21wdXRlLAoKICAvLyBDb21tdW5pdHkKICAnLi4vY29tbXVuaXR5L2FsZ29yaXRobXMvbG91dmFpbi5qcyc6IGxvdXZhaW5Db21wdXRlLAoKICAvLyBMYXlvdXRzCiAgJy4uL2xheW91dHMvcmFuZG9tLmpzJzogcmFuZG9tQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9jaXJjdWxhci5qcyc6IGNpcmN1bGFyQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9zcGlyYWwuanMnOiBzcGlyYWxDb21wdXRlLAogICcuLi9sYXlvdXRzL3NoZWxsLmpzJzogc2hlbGxDb21wdXRlLAogICcuLi9sYXlvdXRzL3NwZWN0cmFsLmpzJzogc3BlY3RyYWxDb21wdXRlLAogICcuLi9sYXlvdXRzL2ZvcmNlLWRpcmVjdGVkLmpzJzogZm9yY2VEaXJlY3RlZENvbXB1dGUsCiAgJy4uL2xheW91dHMva2FtYWRhLWthd2FpLmpzJzoga2FtYWRhS2F3YWlDb21wdXRlLAogICcuLi9sYXlvdXRzL2JpcGFydGl0ZS5qcyc6IGJpcGFydGl0ZUNvbXB1dGUsCiAgJy4uL2xheW91dHMvbXVsdGlwYXJ0aXRlLmpzJzogbXVsdGlwYXJ0aXRlQ29tcHV0ZSwKICAnLi4vbGF5b3V0cy9iZnMuanMnOiBiZnNDb21wdXRlCn07CgovLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09Ci8vIFdPUktFUiBNRVNTQUdFIEhBTkRMRVIKLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PQoKLyoqCiAqIE1haW4gbWVzc2FnZSBoYW5kbGVyIC0gcmVjZWl2ZXMgdGFza3MgYW5kIGRlbGVnYXRlcyB0byBhbGdvcml0aG0gbW9kdWxlcwogKi8Kc2VsZi5vbm1lc3NhZ2UgPSBhc3luYyBmdW5jdGlvbihldmVudCkgewogIGNvbnN0IHsgaWQsIG1vZHVsZSwgZnVuY3Rpb25OYW1lLCBhcmdzID0gW10gfSA9IGV2ZW50LmRhdGE7CgogIHRyeSB7CiAgICAvLyBWYWxpZGF0ZSBtZXNzYWdlIGZvcm1hdAogICAgaWYgKCFtb2R1bGUgfHwgIWZ1bmN0aW9uTmFtZSkgewogICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdGFzazogbW9kdWxlIGFuZCBmdW5jdGlvbk5hbWUgYXJlIHJlcXVpcmVkJyk7CiAgICB9CgogICAgbG9nLmRlYnVnKCdQcm9jZXNzaW5nIHRhc2snLCB7CiAgICAgIGlkLAogICAgICBtb2R1bGUsCiAgICAgIGZ1bmN0aW9uTmFtZSwKICAgICAgYXJnc0xlbmd0aDogYXJncz8ubGVuZ3RoIHx8IDAKICAgIH0pOwoKICAgIC8vIENyZWF0ZSBwcm9ncmVzcyBjYWxsYmFjayB0aGF0IHJlcG9ydHMgYmFjayB0byBtYWluIHRocmVhZAogICAgY29uc3QgcHJvZ3Jlc3NDYWxsYmFjayA9IChwcm9ncmVzcykgPT4gewogICAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgICBpZCwKICAgICAgICBzdGF0dXM6ICdwcm9ncmVzcycsCiAgICAgICAgcHJvZ3Jlc3M6IE1hdGgubWluKE1hdGgubWF4KHByb2dyZXNzLCAwKSwgMSkgLy8gQ2xhbXAgdG8gWzAsIDFdCiAgICAgIH0pOwogICAgfTsKCiAgICAvLyBMb29rIHVwIGFsZ29yaXRobSBtb2R1bGUgZnJvbSByZWdpc3RyeQogICAgY29uc3QgYWxnb3JpdGhtTW9kdWxlID0gTU9EVUxFX1JFR0lTVFJZW21vZHVsZV07CgogICAgaWYgKCFhbGdvcml0aG1Nb2R1bGUpIHsKICAgICAgdGhyb3cgbmV3IEVycm9yKAogICAgICAgIGBNb2R1bGUgJyR7bW9kdWxlfScgbm90IGZvdW5kIGluIHJlZ2lzdHJ5LiBgICsKICAgICAgICBgQXZhaWxhYmxlIG1vZHVsZXM6ICR7T2JqZWN0LmtleXMoTU9EVUxFX1JFR0lTVFJZKS5qb2luKCcsICcpfWAKICAgICAgKTsKICAgIH0KCiAgICAvLyBHZXQgdGhlIGNvbXB1dGUgZnVuY3Rpb24KICAgIGNvbnN0IGNvbXB1dGVGdW5jdGlvbiA9IGFsZ29yaXRobU1vZHVsZVtmdW5jdGlvbk5hbWVdOwoKICAgIGlmICghY29tcHV0ZUZ1bmN0aW9uIHx8IHR5cGVvZiBjb21wdXRlRnVuY3Rpb24gIT09ICdmdW5jdGlvbicpIHsKICAgICAgdGhyb3cgbmV3IEVycm9yKAogICAgICAgIGBGdW5jdGlvbiAnJHtmdW5jdGlvbk5hbWV9JyBub3QgZm91bmQgaW4gbW9kdWxlICcke21vZHVsZX0nLiBgICsKICAgICAgICBgQXZhaWxhYmxlIGZ1bmN0aW9uczogJHtPYmplY3Qua2V5cyhhbGdvcml0aG1Nb2R1bGUpLmpvaW4oJywgJyl9YAogICAgICApOwogICAgfQoKICAgIC8vIEV4ZWN1dGUgdGhlIGNvbXB1dGUgZnVuY3Rpb24KICAgIC8vIExhc3QgYXJnIGlzIGFsd2F5cyB0aGUgcHJvZ3Jlc3MgY2FsbGJhY2sKICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGNvbXB1dGVGdW5jdGlvbiguLi5hcmdzLCBwcm9ncmVzc0NhbGxiYWNrKTsKCiAgICAvLyBTZW5kIHN1Y2Nlc3NmdWwgcmVzdWx0CiAgICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgICAgaWQsCiAgICAgIHN0YXR1czogJ2NvbXBsZXRlJywKICAgICAgcmVzdWx0CiAgICB9KTsKCiAgfSBjYXRjaCAoZXJyb3IpIHsKICAgIC8vIFNlbmQgZXJyb3IKICAgIGxvZy5lcnJvcignVGFzayBmYWlsZWQnLCB7CiAgICAgIGlkLAogICAgICBlcnJvcjogZXJyb3IubWVzc2FnZSwKICAgICAgc3RhY2s6IGVycm9yLnN0YWNrCiAgICB9KTsKICAgIHNlbGYucG9zdE1lc3NhZ2UoewogICAgICBpZCwKICAgICAgc3RhdHVzOiAnZXJyb3InLAogICAgICBlcnJvcjogZXJyb3IubWVzc2FnZSB8fCAnVW5rbm93biBlcnJvcicsCiAgICAgIHN0YWNrOiBlcnJvci5zdGFjawogICAgfSk7CiAgfQp9OwoKLyoqCiAqIEhhbmRsZSB3b3JrZXIgZXJyb3JzCiAqLwpzZWxmLm9uZXJyb3IgPSBmdW5jdGlvbihlcnJvcikgewogIGxvZy5lcnJvcignV29ya2VyIGVycm9yJywgewogICAgZXJyb3I6IGVycm9yLm1lc3NhZ2UgfHwgJ1dvcmtlciBlcnJvciBvY2N1cnJlZCcsCiAgICBzdGFjazogZXJyb3Iuc3RhY2sKICB9KTsKICBzZWxmLnBvc3RNZXNzYWdlKHsKICAgIHN0YXR1czogJ2Vycm9yJywKICAgIGVycm9yOiBlcnJvci5tZXNzYWdlIHx8ICdXb3JrZXIgZXJyb3Igb2NjdXJyZWQnCiAgfSk7Cn07CgovLyBMb2cgd29ya2VyIGluaXRpYWxpemF0aW9uCmxvZy5pbmZvKCdJbml0aWFsaXplZCcsIHsgbW9kdWxlQ291bnQ6IE9iamVjdC5rZXlzKE1PRFVMRV9SRUdJU1RSWSkubGVuZ3RoIH0pOwo=", import.meta.url).href;
      } catch {
        i = "/graph-js/src/compute/network-worker.js", this.log.warn("Could not resolve worker path from import.meta.url, using fallback", { workerPath: i });
      }
    if (!oe.isSupported())
      throw new Error(
        "Web Workers are not supported in this environment. This library requires Web Worker support (browser) or Worker Threads (Node.js)."
      );
    this.workerPool = new He({
      maxWorkers: t || this._getDefaultWorkerCount(),
      workerScript: i,
      taskTimeout: n,
      verbose: r
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
const $ = new H();
class R {
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
  constructor(e, t = "", s = "node", n = null) {
    if (new.target === R)
      throw new Error("StatisticAlgorithm is abstract and cannot be instantiated directly");
    if (s !== "node" && s !== "graph")
      throw new Error(`Scope must be 'node' or 'graph', got: ${s}`);
    if (!n || !n.module || !n.functionName)
      throw new Error("computeConfig with module and functionName is required");
    this.name = e, this.description = t, this.scope = s, this.computeConfig = n, this.options = {};
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
    const n = $.serializeGraph(e), r = {
      module: this.computeConfig.module,
      functionName: this.computeConfig.functionName,
      args: [n, t, this.options]
    };
    return await $.execute(r, s);
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
class Ue {
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
    return e.forEach(([t, s, n = 1]) => {
      this.addEdge(t, s, n);
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
    const n = { u: e, v: t, weight: s };
    return this.edges.push(n), this.adjacencyMap.has(e) || this.adjacencyMap.set(e, /* @__PURE__ */ new Map()), this.adjacencyMap.has(t) || this.adjacencyMap.set(t, /* @__PURE__ */ new Map()), this.adjacencyMap.get(e).set(t, s), this.adjacencyMap.get(t).set(e, s), this;
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
      (n) => n.u === e && n.v === t || n.u === t && n.v === e
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
    const n = this.edges.find(
      (r) => r.u === e && r.v === t || r.u === t && r.v === e
    );
    return n && (n.weight = s), this;
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
const Y = re({
  prefix: "compute-utils",
  level: "info"
  // Default to info, can be verbose in debug builds
});
function N(o) {
  Y.debug("Starting reconstruction", {
    isObject: o && typeof o == "object",
    hasNodes: o && "nodes" in o,
    hasEdges: o && "edges" in o,
    graphDataKeys: o ? Object.keys(o) : "N/A"
  });
  const e = new Ue();
  if (!o || typeof o != "object")
    return Y.error("Invalid graphData passed to reconstructGraph", { graphData: o }), e;
  if (o.nodes !== void 0 && o.nodes !== null) {
    Y.debug("Processing nodes", {
      type: typeof o.nodes,
      isArray: Array.isArray(o.nodes),
      length: Array.isArray(o.nodes) ? o.nodes.length : "N/A"
    });
    try {
      let t;
      if (Array.isArray(o.nodes))
        t = o.nodes;
      else if (o.nodes[Symbol.iterator])
        t = Array.from(o.nodes);
      else
        throw new Error(`nodes is not iterable: ${typeof o.nodes}`);
      Y.debug("Node array created", { length: t.length }), t.forEach((s) => {
        e.addNode(s);
      }), Y.debug("Nodes added successfully", {
        type: typeof e.nodes,
        size: e.nodes.size
      });
    } catch (t) {
      throw Y.error("Error adding nodes", {
        error: t.message,
        stack: t.stack,
        nodesValue: o.nodes,
        nodesType: typeof o.nodes,
        nodesConstructor: o.nodes?.constructor?.name
      }), new Error(`Failed to reconstruct nodes: ${t.message}`);
    }
  } else
    Y.warn("No nodes found in graphData");
  if (o.edges !== void 0 && o.edges !== null) {
    Y.debug("Processing edges", {
      type: typeof o.edges,
      isArray: Array.isArray(o.edges),
      length: Array.isArray(o.edges) ? o.edges.length : "N/A"
    });
    try {
      let t;
      if (Array.isArray(o.edges))
        t = o.edges;
      else if (o.edges[Symbol.iterator])
        t = Array.from(o.edges);
      else
        throw new Error(`edges is not iterable: ${typeof o.edges}`);
      Y.debug("Edge array created", { length: t.length }), t.forEach((s) => {
        const n = s.source !== void 0 ? s.source : s.u, r = s.target !== void 0 ? s.target : s.v, i = s.weight || 1;
        n !== void 0 && r !== void 0 && e.addEdge(n, r, i);
      }), Y.debug("Edges added successfully");
    } catch (t) {
      throw Y.error("Error adding edges", {
        error: t.message,
        stack: t.stack,
        edgesValue: o.edges,
        edgesType: typeof o.edges
      }), new Error(`Failed to reconstruct edges: ${t.message}`);
    }
  } else
    Y.warn("No edges found in graphData");
  return Y.debug("Reconstruction complete", {
    nodes: e.nodes.size,
    edges: e.edges.length
  }), e;
}
function f(o, e) {
  o && typeof o == "function" && o(Math.min(Math.max(e, 0), 1));
}
function Oe(o, e) {
  const t = /* @__PURE__ */ new Map([[e, 0]]), s = /* @__PURE__ */ new Map([[e, 1]]), n = /* @__PURE__ */ new Map(), r = [e], i = [];
  for (; r.length > 0; ) {
    const a = r.shift();
    i.push(a);
    const d = o.getNeighbors(a), h = t.get(a);
    d.forEach((l) => {
      t.has(l) || (t.set(l, h + 1), r.push(l)), t.get(l) === h + 1 && (s.set(l, (s.get(l) || 0) + s.get(a)), n.has(l) || n.set(l, []), n.get(l).push(a));
    });
  }
  return { distance: t, pathCount: s, predecessors: n, stack: i };
}
function Me(o, e) {
  const t = /* @__PURE__ */ new Map(), s = [e], n = /* @__PURE__ */ new Set([e]);
  for (t.set(e, 0); s.length > 0; ) {
    const r = s.shift(), i = t.get(r);
    for (const a of o.getNeighbors(r))
      n.has(a) || (n.add(a), s.push(a), t.set(a, i + 1));
  }
  return t;
}
function ke(o, e) {
  const t = o.getNeighbors(e), s = t.length;
  if (s < 2)
    return 0;
  let n = 0;
  for (let r = 0; r < t.length; r++)
    for (let i = r + 1; i < t.length; i++)
      o.hasEdge(t[r], t[i]) && n++;
  return 2 * n / (s * (s - 1));
}
function _e(o, e) {
  const t = o.getNeighbors(e);
  let s = 0;
  for (let n = 0; n < t.length; n++)
    for (let r = n + 1; r < t.length; r++)
      o.hasEdge(t[n], t[r]) && s++;
  return s;
}
function _(o) {
  const e = Math.sqrt(
    Object.values(o).reduce((t, s) => t + s * s, 0)
  );
  return e > 0 && Object.keys(o).forEach((t) => {
    o[t] /= e;
  }), o;
}
function qe(o, e) {
  const t = Object.keys(o);
  let s = 0;
  for (const n of t)
    s += Math.abs((o[n] || 0) - (e[n] || 0));
  return s;
}
class Qe extends R {
  constructor() {
    super("degree", "Number of connections per node", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "degreeCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class De extends R {
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
class $e extends R {
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
class et extends R {
  constructor() {
    super("betweenness", "Frequency on shortest paths between other nodes", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "betweennessCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class tt extends R {
  constructor() {
    super("clustering", "Local clustering coefficient", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "clusteringCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class st extends R {
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
class ot extends R {
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
class nt extends R {
  constructor() {
    super("cliques", "Number of maximal cliques per node", "node", {
      module: "../statistics/algorithms/node-stats.js",
      functionName: "cliquesCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
async function it(o, e, t, s) {
  const n = N(o), r = e || Array.from(n.nodes), i = {};
  return r.forEach((a, d) => {
    i[a] = n.degree(a), d % 100 === 0 && f(s, d / r.length);
  }), f(s, 1), i;
}
async function rt(o, e, t, s) {
  const n = N(o), r = e || Array.from(n.nodes), i = Array.from(n.nodes), a = {};
  i.forEach((l) => {
    a[l] = 0;
  }), r.forEach((l, c) => {
    const g = Oe(n, l);
    at(a, g, i), c % Math.max(1, Math.floor(r.length / 10)) === 0 && f(s, c / r.length);
  });
  const d = i.length, h = d > 2 ? 2 / ((d - 1) * (d - 2)) : 1;
  return i.forEach((l) => {
    a[l] *= h;
  }), f(s, 1), a;
}
function at(o, e, t) {
  const { pathCount: s, predecessors: n, stack: r } = e, i = /* @__PURE__ */ new Map();
  for (t.forEach((a) => {
    i.set(a, 0);
  }); r.length > 0; ) {
    const a = r.pop();
    (n.get(a) || []).forEach((h) => {
      const l = s.get(h) / s.get(a) * (1 + i.get(a));
      i.set(h, i.get(h) + l);
    }), a !== r[0] && (o[a] += i.get(a));
  }
}
async function ct(o, e, t, s) {
  const n = N(o), r = e || Array.from(n.nodes), i = {};
  return r.forEach((a, d) => {
    i[a] = ke(n, a), d % 100 === 0 && f(s, d / r.length);
  }), f(s, 1), i;
}
async function lt(o, e, t, s) {
  const n = N(o), { maxIter: r = 100, tolerance: i = 1e-6 } = t || {}, a = Array.from(n.nodes), d = a.length;
  let h = {};
  a.forEach((l) => {
    h[l] = 1 / d;
  });
  for (let l = 0; l < r; l++) {
    const c = {};
    a.forEach((u) => {
      c[u] = 0;
    }), a.forEach((u) => {
      n.getNeighbors(u).forEach((C) => {
        const G = n.adjacencyMap.get(u).get(C);
        c[C] += h[u] * G;
      });
    }), _(c);
    const g = qe(c, h);
    if (h = c, l % 10 === 0 && f(s, l / r), g < i)
      break;
  }
  return f(s, 1), h;
}
async function dt(o, e, t, s) {
  const n = N(o), r = e || Array.from(n.nodes), i = {};
  return r.forEach((a, d) => {
    i[a] = _e(n, a), d % 100 === 0 && f(s, d / r.length);
  }), f(s, 1), i;
}
async function gt(o, e, t, s) {
  const n = N(o), r = e || Array.from(n.nodes), a = Array.from(n.nodes).length, d = {}, h = t?.normalized !== !1;
  return r.forEach((l, c) => {
    const g = /* @__PURE__ */ new Map(), u = [l], p = /* @__PURE__ */ new Set([l]);
    for (g.set(l, 0); u.length > 0; ) {
      const G = u.shift(), I = g.get(G);
      for (const w of n.getNeighbors(G))
        p.has(w) || (p.add(w), u.push(w), g.set(w, I + 1));
    }
    const C = g.size - 1;
    if (C === 0)
      d[l] = 0;
    else {
      const G = Array.from(g.values()).reduce((I, w) => I + w, 0);
      if (G === 0)
        d[l] = 0;
      else {
        const I = C / G;
        d[l] = h ? I * (C / (a - 1)) : I;
      }
    }
    c % 100 === 0 && f(s, c / r.length);
  }), f(s, 1), d;
}
async function ht(o, e, t, s) {
  const n = N(o), r = e || Array.from(n.nodes), i = {};
  return r.forEach((a, d) => {
    const h = n.getNeighbors(a), l = h.length;
    if (l < 2)
      i[a] = 0;
    else {
      let c = 0;
      for (let u = 0; u < l; u++)
        for (let p = u + 1; p < l; p++)
          n.hasEdge(h[u], h[p]) && c++;
      const g = l * (l - 1) / 2;
      i[a] = c / g;
    }
    d % 100 === 0 && f(s, d / r.length);
  }), f(s, 1), i;
}
async function ut(o, e, t, s) {
  const n = N(o), r = Array.from(n.nodes), i = r.length;
  if (i < 3) {
    const p = {};
    return r.forEach((C) => {
      p[C] = { laplacian_x: Math.random() * 2 - 1, laplacian_y: Math.random() * 2 - 1 };
    }), f(s, 1), p;
  }
  const { maxIter: a = 100, tolerance: d = 1e-6 } = t || {}, h = Array(i).fill(null).map(() => Array(i).fill(0)), l = /* @__PURE__ */ new Map();
  r.forEach((p, C) => l.set(p, C));
  for (let p = 0; p < i; p++) {
    const C = r[p], G = n.getNeighbors(C);
    h[p][p] = G.length, G.forEach((I) => {
      const w = l.get(I);
      w !== void 0 && (h[p][w] = -1);
    });
  }
  f(s, 0.2);
  const c = Array(i).fill(0).map(() => Math.random()), g = Array(i).fill(0).map(() => Math.random());
  _(c), _(g);
  for (let p = 0; p < a; p++) {
    const C = be(h, c);
    _(C);
    let G = 0;
    for (let I = 0; I < i; I++)
      G += Math.abs(C[I] - c[I]);
    if (G < d) break;
    for (let I = 0; I < i; I++)
      c[I] = C[I];
    p % 20 === 0 && f(s, 0.2 + p / a * 0.4);
  }
  f(s, 0.6), le(g, c), _(g);
  for (let p = 0; p < a; p++) {
    const C = be(h, g);
    _(C), le(C, c), le(C, g), _(C);
    let G = 0;
    for (let I = 0; I < i; I++)
      G += Math.abs(C[I] - g[I]);
    if (G < d) break;
    for (let I = 0; I < i; I++)
      g[I] = C[I];
    p % 20 === 0 && f(s, 0.6 + p / a * 0.39);
  }
  f(s, 0.99);
  const u = {};
  return r.forEach((p, C) => {
    u[p] = {
      laplacian_x: c[C],
      laplacian_y: g[C]
    };
  }), f(s, 1), u;
}
function be(o, e) {
  const t = o.length, s = Array(t).fill(0);
  for (let n = 0; n < t; n++)
    for (let r = 0; r < t; r++)
      s[n] += o[n][r] * e[r];
  return s;
}
function le(o, e) {
  let t = 0;
  for (let s = 0; s < o.length; s++)
    t += o[s] * e[s];
  for (let s = 0; s < o.length; s++)
    o[s] -= t * e[s];
}
const mt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BetweennessStatistic: et,
  CliquesStatistic: nt,
  ClosenessStatistic: De,
  ClusteringStatistic: tt,
  DegreeStatistic: Qe,
  EgoDensityStatistic: $e,
  EigenvectorLaplacianStatistic: ot,
  EigenvectorStatistic: st,
  betweennessCompute: rt,
  cliquesCompute: dt,
  closenessCompute: gt,
  clusteringCompute: ct,
  degreeCompute: it,
  egoDensityCompute: ht,
  eigenvectorCompute: lt,
  eigenvectorLaplacianCompute: ut
}, Symbol.toStringTag, { value: "Module" }));
class yt extends R {
  constructor() {
    super("density", "Ratio of actual edges to possible edges", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "densityCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class ft extends R {
  constructor() {
    super("diameter", "Longest shortest path in the graph", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "diameterCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class pt extends R {
  constructor() {
    super("average_clustering", "Mean clustering coefficient across all nodes", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "averageClusteringCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class bt extends R {
  constructor() {
    super("average_shortest_path", "Mean distance between all node pairs", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "averageShortestPathCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class It extends R {
  constructor() {
    super("connected_components", "Number of disconnected subgraphs", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "connectedComponentsCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
class Ct extends R {
  constructor() {
    super("average_degree", "Mean number of connections per node", "graph", {
      module: "../statistics/algorithms/graph-stats.js",
      functionName: "averageDegreeCompute"
    });
  }
  // calculate() inherited from base class - delegates to worker!
}
async function wt(o, e, t, s) {
  const n = N(o), r = n.nodes.size, i = n.edges.length;
  if (r < 2)
    return 0;
  const a = r * (r - 1) / 2, d = i / a;
  return f(s, 1), d;
}
async function vt(o, e, t, s) {
  const n = N(o), r = Array.from(n.nodes);
  let i = 0;
  return r.forEach((a, d) => {
    const h = Me(n, a);
    for (const l of h.values())
      l > i && (i = l);
    d % Math.max(1, Math.floor(r.length / 10)) === 0 && f(s, d / r.length);
  }), f(s, 1), i;
}
async function Gt(o, e, t, s) {
  const n = N(o), r = Array.from(n.nodes);
  let i = 0;
  return r.forEach((a, d) => {
    i += ke(n, a), d % 100 === 0 && f(s, d / r.length);
  }), f(s, 1), r.length > 0 ? i / r.length : 0;
}
async function At(o, e, t, s) {
  const n = N(o), r = Array.from(n.nodes);
  let i = 0, a = 0;
  return r.forEach((d, h) => {
    Me(n, d).forEach((c, g) => {
      g !== d && (a += c, i++);
    }), h % Math.max(1, Math.floor(r.length / 10)) === 0 && f(s, h / r.length);
  }), f(s, 1), i > 0 ? a / i : 0;
}
async function Tt(o, e, t, s) {
  const n = N(o), r = Array.from(n.nodes), i = /* @__PURE__ */ new Set(), a = {};
  let d = 0;
  return r.forEach((h) => {
    if (!i.has(h)) {
      const l = [h];
      for (i.add(h), a[h] = d; l.length > 0; ) {
        const c = l.shift();
        for (const g of n.getNeighbors(c))
          i.has(g) || (i.add(g), l.push(g), a[g] = d);
      }
      d++;
    }
  }), f(s, 1), {
    count: d,
    components: a
  };
}
async function Pt(o, e, t, s) {
  const n = N(o), r = Array.from(n.nodes);
  let i = 0;
  return r.forEach((a) => {
    i += n.getNeighbors(a).length;
  }), f(s, 1), r.length > 0 ? i / r.length : 0;
}
const Zt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AverageClusteringStatistic: pt,
  AverageDegreeStatistic: Ct,
  AverageShortestPathStatistic: bt,
  ConnectedComponentsStatistic: It,
  DensityStatistic: yt,
  DiameterStatistic: ft,
  averageClusteringCompute: Gt,
  averageDegreeCompute: Pt,
  averageShortestPathCompute: At,
  connectedComponentsCompute: Tt,
  densityCompute: wt,
  diameterCompute: vt
}, Symbol.toStringTag, { value: "Module" }));
class he {
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
    if (new.target === he)
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
    const s = $.serializeGraph(e), n = {
      module: this.computeConfig.module,
      functionName: this.computeConfig.functionName,
      args: [s, this.options]
    };
    return {
      ...await $.execute(n, t),
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
class Ie extends he {
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
async function xt(o, e, t) {
  const s = N(o), { resolution: n = 1, maxIterations: r = 100 } = e || {}, i = Array.from(s.nodes), a = (I) => {
    const w = s.getNeighbors(I);
    let m = 0;
    return w.forEach((v) => {
      m += s.getEdgeWeight(I, v);
    }), m;
  };
  let d = 0;
  s.edges.forEach((I) => {
    d += I.weight;
  });
  const h = 2 * d, l = {};
  i.forEach((I) => {
    l[I] = I;
  });
  let c = !0, g = 0;
  for (; c && g < r; ) {
    c = !1, g++;
    for (const I of i) {
      const w = l[I], m = s.getNeighbors(I), v = /* @__PURE__ */ new Set();
      m.forEach((L) => {
        v.add(l[L]);
      });
      const Z = a(I);
      let T = w, M = 0;
      v.forEach((L) => {
        if (L === w) return;
        const B = Wt(
          s,
          I,
          w,
          L,
          l,
          h,
          n,
          Z,
          a
        );
        B > M && (M = B, T = L);
      }), T !== w && (l[I] = T, c = !0);
    }
    if (f(t, Math.min(g / r, 0.9)), !c) break;
  }
  const u = Array.from(new Set(Object.values(l))), p = {};
  u.forEach((I, w) => {
    p[I] = w;
  });
  const C = {};
  Object.keys(l).forEach((I) => {
    C[I] = p[l[I]];
  });
  const G = Xt(s, C, d, a);
  return f(t, 1), {
    communities: C,
    modularity: G,
    numCommunities: u.length,
    iterations: g
  };
}
function Wt(o, e, t, s, n, r, i, a, d) {
  const h = o.getNeighbors(e);
  let l = 0, c = 0;
  h.forEach((G) => {
    const I = o.getEdgeWeight(e, G);
    n[G] === s && (l += I), n[G] === t && G !== e && (c += I);
  });
  const g = Array.from(o.nodes);
  let u = 0, p = 0;
  return g.forEach((G) => {
    n[G] === s && (u += d(G)), n[G] === t && (p += d(G));
  }), l / r - i * (u * a) / (r * r) - (c / r - i * (p * a) / (r * r));
}
function Xt(o, e, t, s) {
  if (t === 0) return 0;
  const n = 2 * t, r = new Set(Object.values(e));
  let i = 0;
  return r.forEach((a) => {
    let d = 0, h = 0;
    Object.keys(e).filter(
      (c) => e[c] === a
    ).forEach((c) => {
      h += s(c);
    }), o.edges.forEach((c) => {
      const g = c.u, u = c.v, p = c.weight;
      e[g] === a && e[u] === a && (d += p);
    }), i += d / n - Math.pow(h / n, 2);
  }), i;
}
const Bt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  LouvainAlgorithm: Ie,
  default: Ie,
  louvainCompute: xt
}, Symbol.toStringTag, { value: "Module" }));
class j {
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
    const t = { ...this.options, ...e }, { onProgress: s, timeout: n, ...r } = t, i = $.serializeGraph(this.graph), a = {
      module: this.computeConfig.module,
      functionName: this.computeConfig.functionName,
      args: [i, r]
    };
    return await $.execute(a, {
      onProgress: s,
      timeout: n
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
class Ce extends j {
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
async function Mt(o, e, t) {
  const s = Array.from(o.nodes || []), {
    scale: n = 1,
    center: r = { x: 0, y: 0 },
    seed: i = null
  } = e || {}, a = {};
  let d;
  return i !== null ? d = function(l) {
    return function() {
      let c = l += 1831565813;
      return c = Math.imul(c ^ c >>> 15, c | 1), c ^= c + Math.imul(c ^ c >>> 7, c | 61), ((c ^ c >>> 14) >>> 0) / 4294967296;
    };
  }(i) : d = Math.random, s.forEach((h) => {
    const l = (d() * 2 - 1) * n + r.x, c = (d() * 2 - 1) * n + r.y;
    a[h] = { x: l, y: c };
  }), f(t, 1), a;
}
const kt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  RandomLayout: Ce,
  default: Ce,
  randomCompute: Mt
}, Symbol.toStringTag, { value: "Module" }));
class we extends j {
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
async function Nt(o, e, t) {
  const s = N(o), {
    scale: n = 1,
    center: r = { x: 0, y: 0 },
    sortBy: i = null
  } = e || {};
  let a = Array.from(s.nodes);
  const d = a.length;
  if (d === 0)
    return f(t, 1), {};
  if (d === 1) {
    const l = { [a[0]]: { x: r.x, y: r.y } };
    return f(t, 1), l;
  }
  i && typeof i == "function" && (a = a.sort(i));
  const h = {};
  return a.forEach((l, c) => {
    const g = 2 * Math.PI * c / d;
    h[l] = {
      x: Math.cos(g) * n + r.x,
      y: Math.sin(g) * n + r.y
    };
  }), f(t, 1), h;
}
const Lt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CircularLayout: we,
  circularCompute: Nt,
  default: we
}, Symbol.toStringTag, { value: "Module" }));
class ve extends j {
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
function Rt(o, e = 1) {
  if (o.length === 0) return o;
  let t = 1 / 0, s = -1 / 0, n = 1 / 0, r = -1 / 0;
  for (const [l, c] of o)
    t = Math.min(t, l), s = Math.max(s, l), n = Math.min(n, c), r = Math.max(r, c);
  const i = s - t || 1, a = r - n || 1, d = Math.max(i, a), h = 2 * e / d;
  return o.map(([l, c]) => [
    (l - t - i / 2) * h + e,
    (c - n - a / 2) * h + e
  ]);
}
async function Jt(o, e, t) {
  const s = Array.from(o.nodes || []), n = s.length, {
    scale: r = 1,
    center: i = { x: 0, y: 0 },
    resolution: a = 0.35,
    equidistant: d = !1
  } = e || {};
  if (n === 0)
    return f(t, 1), {};
  if (n === 1) {
    const c = { [s[0]]: { x: i.x, y: i.y } };
    return f(t, 1), c;
  }
  let h = [];
  if (d) {
    let g = 0.5, u = a;
    u += 1 / (g * u);
    for (let p = 0; p < n; p++) {
      const C = g * u;
      u += 1 / C, h.push([Math.cos(u) * C, Math.sin(u) * C]);
    }
  } else
    for (let c = 0; c < n; c++) {
      const g = a * c, u = c;
      h.push([Math.cos(g) * u, Math.sin(g) * u]);
    }
  h = Rt(h, r);
  const l = {};
  return s.forEach((c, g) => {
    l[c] = {
      x: h[g][0] + i.x,
      y: h[g][1] + i.y
    };
  }), f(t, 1), l;
}
const zt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SpiralLayout: ve,
  default: ve,
  spiralCompute: Jt
}, Symbol.toStringTag, { value: "Module" }));
class Ge extends j {
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
async function Et(o, e, t) {
  const s = Array.from(o.nodes || []), n = s.length, {
    scale: r = 1,
    center: i = { x: 0, y: 0 },
    nlist: a = null,
    rotate: d = null,
    nodeProperties: h = null
    // Map of node ID -> {degree, ...properties}
  } = e || {};
  if (n === 0)
    return f(t, 1), {};
  if (n === 1) {
    const G = { [s[0]]: { x: i.x, y: i.y } };
    return f(t, 1), G;
  }
  let l;
  if (a && Array.isArray(a))
    l = a;
  else {
    let G = /* @__PURE__ */ new Map();
    if (h && h.size > 0)
      s.forEach((m) => {
        const v = h.get(m), Z = v && typeof v == "object" && v.degree || 0;
        G.set(m, Z);
      });
    else if (s.forEach((m) => {
      G.set(m, 0);
    }), o.edges)
      for (const m of o.edges) {
        const v = m.u !== void 0 ? m.u : m.source !== void 0 ? m.source : m[0], Z = m.v !== void 0 ? m.v : m.target !== void 0 ? m.target : m[1];
        G.has(v) && G.set(v, G.get(v) + 1), G.has(Z) && G.set(Z, G.get(Z) + 1);
      }
    const I = /* @__PURE__ */ new Map();
    s.forEach((m) => {
      const v = G.get(m) || 0;
      I.has(v) || I.set(v, []), I.get(v).push(m);
    }), l = Array.from(I.keys()).sort((m, v) => v - m).map((m) => I.get(m));
  }
  const c = r / l.length;
  let g;
  l[0].length === 1 ? g = 0 : g = c;
  let u;
  d === null ? u = Math.PI / l.length : u = d;
  const p = {};
  let C = u;
  for (const G of l) {
    const I = G.length;
    if (I === 0) continue;
    const w = [];
    for (let m = 0; m < I; m++)
      w.push(2 * Math.PI * m / I + C);
    G.forEach((m, v) => {
      const Z = w[v], T = g * Math.cos(Z) + i.x, M = g * Math.sin(Z) + i.y;
      p[m] = { x: T, y: M };
    }), g += c, C += u;
  }
  return f(t, 1), p;
}
const Kt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ShellLayout: Ge,
  default: Ge,
  shellCompute: Et
}, Symbol.toStringTag, { value: "Module" }));
class Ae extends j {
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
async function Yt(o, e, t) {
  const s = Array.from(o.nodes || []), n = s.length;
  console.log("[spectralCompute] Starting with", n, "nodes");
  const {
    scale: r = 1,
    center: i = { x: 0, y: 0 },
    nodeProperties: a = null
    // Map of node ID -> {laplacian_x, laplacian_y}
  } = e || {};
  if (console.log("[spectralCompute] nodeProperties:", a ? `Map with ${a.size} entries` : "null"), n === 0)
    return f(t, 1), {};
  if (n === 1) {
    const g = { [s[0]]: { x: i.x, y: i.y } };
    return f(t, 1), g;
  }
  const d = {}, h = [], l = a || /* @__PURE__ */ new Map();
  console.log("[spectralCompute] Processing", n, "nodes for eigenvector extraction");
  for (const g of s) {
    let u, p;
    if (l && l.size > 0) {
      const C = l.get(g);
      if (C && C.laplacian_x !== void 0 && C.laplacian_y !== void 0)
        u = C.laplacian_x, p = C.laplacian_y;
      else
        throw new Error(
          `Spectral layout requires eigenvector-laplacian stat. Node "${g}" missing laplacian_x/laplacian_y. Include 'eigenvector-laplacian' in analyze() features.`
        );
    } else if (o.nodes && typeof o.nodes[Symbol.iterator] == "function")
      throw new Error(
        "Spectral layout requires eigenvector-laplacian stat. Include 'eigenvector-laplacian' in analyze() features."
      );
    h.push([u, p]);
  }
  console.log("[spectralCompute] Extracted", h.length, "coordinates. Sample:", h[0]), f(t, 0.5), console.log("[spectralCompute] Starting rescaleLayout...");
  const c = Ft(h, r);
  return console.log("[spectralCompute] Rescaled. Sample:", c[0]), f(t, 0.99), s.forEach((g, u) => {
    d[g] = {
      x: c[u][0] + i.x,
      y: c[u][1] + i.y
    };
  }), console.log("[spectralCompute] Created positions for", Object.keys(d).length, "nodes"), f(t, 1), console.log("[spectralCompute] Completed successfully"), d;
}
function Ft(o, e = 1) {
  if (o.length === 0) return o;
  let t = 1 / 0, s = -1 / 0, n = 1 / 0, r = -1 / 0;
  for (const [l, c] of o)
    t = Math.min(t, l), s = Math.max(s, l), n = Math.min(n, c), r = Math.max(r, c);
  const i = s - t || 1, a = r - n || 1, d = Math.max(i, a), h = 2 * e / d;
  return o.map(([l, c]) => [
    (l - t - i / 2) * h + e,
    (c - n - a / 2) * h + e
  ]);
}
const Vt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  SpectralLayout: Ae,
  default: Ae,
  spectralCompute: Yt
}, Symbol.toStringTag, { value: "Module" }));
function ne(o, e, t = 1, s = { x: 0, y: 0 }) {
  if (e.length === 0) return o;
  let n = 0, r = 0;
  e.forEach((c) => {
    n += o[c].x, r += o[c].y;
  });
  const i = n / e.length, a = r / e.length, d = {};
  e.forEach((c) => {
    d[c] = {
      x: o[c].x - i,
      y: o[c].y - a
    };
  });
  let h = 0;
  e.forEach((c) => {
    const g = Math.abs(d[c].x), u = Math.abs(d[c].y);
    h = Math.max(h, g, u);
  });
  const l = {};
  if (h > 0) {
    const c = t / h;
    e.forEach((g) => {
      l[g] = {
        x: d[g].x * c + s.x,
        y: d[g].y * c + s.y
      };
    });
  } else
    e.forEach((c) => {
      l[c] = { x: s.x, y: s.y };
    });
  return l;
}
class Te extends j {
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
async function St(o, e, t) {
  const s = N(o), {
    iterations: n = 50,
    k: r = null,
    scale: i = 1,
    center: a = { x: 0, y: 0 },
    initialPositions: d = null,
    threshold: h = 1e-4
  } = e || {}, l = Array.from(s.nodes), c = l.length;
  if (c === 0)
    return f(t, 1), {};
  if (c === 1) {
    const T = { [l[0]]: { x: a.x, y: a.y } };
    return f(t, 1), T;
  }
  let g = {};
  d ? g = { ...d } : l.forEach((T) => {
    g[T] = {
      x: Math.random(),
      y: Math.random()
    };
  });
  const u = r !== null ? r : Math.sqrt(1 / c);
  let p = 1 / 0, C = -1 / 0, G = 1 / 0, I = -1 / 0;
  l.forEach((T) => {
    const M = g[T];
    p = Math.min(p, M.x), C = Math.max(C, M.x), G = Math.min(G, M.y), I = Math.max(I, M.y);
  });
  let w = Math.max(C - p, I - G) * 0.1;
  const m = w / (n + 1), v = /* @__PURE__ */ new Map();
  l.forEach((T) => {
    const M = new Set(s.getNeighbors(T));
    v.set(T, M);
  });
  for (let T = 0; T < n; T++) {
    const M = {};
    l.forEach((B) => {
      M[B] = { x: 0, y: 0 };
    }), l.forEach((B) => {
      const x = g[B];
      let k = 0, E = 0;
      l.forEach((J) => {
        if (J !== B) {
          const b = g[J], y = x.x - b.x, P = x.y - b.y;
          let W = Math.sqrt(y * y + P * P);
          W < 0.01 && (W = 0.01);
          const X = v.get(B).has(J), K = u * u / (W * W), V = X ? W / u : 0, U = K - V;
          k += y / W * U, E += P / W * U;
        }
      }), M[B] = { x: k, y: E };
    });
    let L = 0;
    if (l.forEach((B) => {
      const x = M[B], k = Math.sqrt(x.x * x.x + x.y * x.y);
      if (k > 0) {
        const E = Math.max(k, 0.01), J = w / E;
        g[B].x += x.x * J, g[B].y += x.y * J, L += k;
      }
    }), w -= m, L / c < h) {
      f(t, 1);
      break;
    }
    T % 10 === 0 && f(t, T / n);
  }
  const Z = ne(g, l, i, a);
  return f(t, 1), Z;
}
const jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ForceDirectedLayout: Te,
  default: Te,
  forceDirectedCompute: St
}, Symbol.toStringTag, { value: "Module" }));
class Pe extends j {
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
async function Ht(o, e, t) {
  console.log("[Kamada-Kawai] Received graphData:", {
    hasNodes: "nodes" in o,
    nodesType: typeof o.nodes,
    nodesIsArray: Array.isArray(o.nodes),
    hasEdges: "edges" in o,
    edgesType: typeof o.edges,
    edgesIsArray: Array.isArray(o.edges)
  });
  const s = N(o);
  console.log("[Kamada-Kawai] After reconstructGraph, graph.nodes:", {
    type: typeof s.nodes,
    isSet: s.nodes instanceof Set,
    size: s.nodes?.size || "N/A"
  });
  const {
    iterations: n = 100,
    scale: r = 1,
    center: i = { x: 0, y: 0 },
    initialPositions: a = null,
    threshold: d = 1e-4,
    K: h = null
  } = e || {}, l = Array.from(s.nodes), c = l.length;
  if (console.log("[Kamada-Kawai] Nodes array:", {
    length: l.length,
    isArray: Array.isArray(l),
    sample: l.slice(0, 3)
  }), c === 0)
    return f(t, 1), {};
  if (c === 1) {
    const b = { [l[0]]: { x: i.x, y: i.y } };
    return f(t, 1), b;
  }
  f(t, 0.1), console.log("[Kamada-Kawai] About to compute all-pairs shortest paths:", {
    nodesLength: l.length,
    nodesIsArray: Array.isArray(l),
    nodesType: typeof l
  });
  let g;
  try {
    g = Ut(s, l), console.log("[Kamada-Kawai] All-pairs shortest paths computed successfully");
    let b = !1, y = !1, P = 0, W = 0;
    for (let X = 0; X < g.length; X++)
      for (let K = 0; K < g[X].length; K++)
        isFinite(g[X][K]) || (b = g[X][K] === 1 / 0, y = isNaN(g[X][K]), b && P++, y && W++);
    (P > 0 || W > 0) && console.warn("[Kamada-Kawai] Distances contain problematic values:", {
      infinityCount: P,
      nanCount: W,
      totalDistances: g.length * g[0].length,
      sample: g[0].slice(0, 5)
    });
  } catch (b) {
    throw console.error("[Kamada-Kawai] Error in computeAllPairsShortestPaths:", b.message, b.stack), b;
  }
  f(t, 0.3), console.log("[Kamada-Kawai] About to initialize positions");
  let u;
  try {
    u = Ot(l, a), console.log("[Kamada-Kawai] Positions initialized successfully, pos:", {
      type: typeof u,
      isArray: Array.isArray(u),
      length: u?.length || "N/A"
    });
  } catch (b) {
    throw console.error("[Kamada-Kawai] Error in initializePositions:", b.message, b.stack), b;
  }
  const p = g.flat().filter((b) => isFinite(b) && b > 0);
  p.length === 0 && console.warn("[Kamada-Kawai] All distances are placeholder (disconnected)!");
  const C = p.length > 0 ? p.reduce((b, y) => Math.max(b, y), 0) : 1, G = Math.sqrt(c), I = G / C, w = h !== null ? h : c;
  console.log("[Kamada-Kawai] Distance matrix stats:", {
    totalPairs: g.flat().length,
    finitePairs: p.length,
    infinitePairs: g.flat().length - p.length,
    max_dij: C,
    L0: G,
    L: I,
    kkconst: w,
    isKvalFinite: isFinite(w) && isFinite(I),
    avgDij: p.reduce((b, y) => b + y, 0) / p.length
  }), f(t, 0.4);
  const m = Array(c).fill(null).map(() => Array(c).fill(0)), v = Array(c).fill(null).map(() => Array(c).fill(0));
  for (let b = 0; b < c; b++)
    for (let y = 0; y < c; y++) {
      if (b === y) continue;
      const P = g[b][y];
      m[b][y] = w / (P * P), v[b][y] = I * P;
    }
  if (c > 1) {
    const P = Math.sqrt(
      Math.pow(u[0][0] - u[1][0], 2) + Math.pow(u[0][1] - u[1][1], 2)
    );
    console.log("[Kamada-Kawai] Sample spring values:", {
      "graph_dist[0,1]": g[0][1],
      "spring_const_kij[0,1]": m[0][1].toExponential(4),
      "desired_dist_lij[0,1]": v[0][1].toFixed(4),
      initial_euclidean_dist: P.toFixed(4),
      stress_ratio: (P / v[0][1]).toFixed(4),
      force: (m[0][1] * Math.abs(P - v[0][1])).toExponential(4)
    });
  }
  const Z = Array(c).fill(0), T = Array(c).fill(0);
  for (let b = 0; b < c; b++)
    for (let y = 0; y < c; y++) {
      if (y === b) continue;
      const P = u[b][0] - u[y][0], W = u[b][1] - u[y][1], X = Math.sqrt(P * P + W * W);
      X !== 0 && (Z[b] += m[b][y] * (P - v[b][y] * P / X), T[b] += m[b][y] * (W - v[b][y] * W / X));
    }
  const M = Z.map((b, y) => Math.sqrt(b * b + T[y] * T[y])), L = Math.max(...M), B = M.reduce((b, y) => b + y, 0) / c;
  console.log("[Kamada-Kawai] Initial gradient stats:", {
    maxEnergy: L.toFixed(4),
    avgEnergy: B.toFixed(4),
    threshold: Math.sqrt(d).toFixed(6)
  });
  for (let b = 0; b < n; b++) {
    let y = 0, P = -1;
    for (let A = 0; A < c; A++) {
      const z = Z[A] * Z[A] + T[A] * T[A];
      z > P && (y = A, P = z);
    }
    if (P < d) {
      console.log(`[Kamada-Kawai] Converged at iteration ${b}/${n} with max_delta ${Math.sqrt(P).toFixed(6)} (threshold: ${Math.sqrt(d).toFixed(6)})`);
      break;
    }
    f(t, 0.4 + 0.6 * (b + 1) / n), (b % 500 === 0 || b < 5 || b === n - 1) && console.log(`[Kamada-Kawai] Iteration ${b}/${n}: max_delta = ${Math.sqrt(P).toFixed(6)}, node ${y}`);
    const W = u[y][0], X = u[y][1];
    let K = 0, V = 0, U = 0;
    for (let A = 0; A < c; A++) {
      if (A === y) continue;
      const z = W - u[A][0], F = X - u[A][1], q = Math.sqrt(z * z + F * F);
      if (q === 0) continue;
      const S = q * (z * z + F * F);
      K += m[y][A] * (1 - v[y][A] * F * F / S), V += m[y][A] * v[y][A] * z * F / S, U += m[y][A] * (1 - v[y][A] * z * z / S);
    }
    let ae = 0, ce = 0;
    const ue = 1e-13, ee = Z[y], te = T[y];
    if (ee * ee + te * te >= ue * ue) {
      const A = U * K - V * V;
      Math.abs(A) > 1e-10 ? (ce = (V * ee - K * te) / A, ae = (V * te - U * ee) / A) : b < 5 && console.warn(`[Kamada-Kawai] Iteration ${b}: Singular matrix (det=${A.toExponential(2)}) for node ${y}`);
    } else b < 5 && console.warn(`[Kamada-Kawai] Iteration ${b}: Gradient too small for node ${y}`);
    b < 3 && y === 0 && console.log(`[Kamada-Kawai] Iteration ${b}, node ${y}:`, {
      A: K.toFixed(4),
      B: V.toFixed(4),
      C: U.toFixed(4),
      det: (U * K - V * V).toExponential(4),
      myD1: ee.toFixed(4),
      myD2: te.toFixed(4),
      delta_x: ae.toFixed(6),
      delta_y: ce.toFixed(6),
      old_pos: [W.toFixed(2), X.toFixed(2)]
    });
    const me = W + ae, ye = X + ce;
    Z[y] = 0, T[y] = 0;
    for (let A = 0; A < c; A++) {
      if (A === y) continue;
      const z = W - u[A][0], F = X - u[A][1], q = Math.sqrt(z * z + F * F), S = me - u[A][0], Q = ye - u[A][1], se = Math.sqrt(S * S + Q * Q);
      q === 0 || se === 0 || (Z[A] -= m[y][A] * (-z + v[y][A] * z / q), T[A] -= m[y][A] * (-F + v[y][A] * F / q), Z[A] += m[y][A] * (-S + v[y][A] * S / se), T[A] += m[y][A] * (-Q + v[y][A] * Q / se), Z[y] += m[y][A] * (S - v[y][A] * S / se), T[y] += m[y][A] * (Q - v[y][A] * Q / se));
    }
    u[y][0] = me, u[y][1] = ye;
  }
  f(t, 0.95), console.log("[Kamada-Kawai] Before rescaling - preparing positions");
  const x = {};
  l.forEach((b, y) => {
    x[b] = {
      x: u[y][0],
      y: u[y][1]
    };
  });
  const k = l[0];
  console.log("[Kamada-Kawai] Sample positions BEFORE rescaling:", {
    sample: k,
    value: x[k],
    allCount: Object.keys(x).length,
    minMax: (() => {
      let b = 1 / 0, y = -1 / 0, P = 1 / 0, W = -1 / 0;
      return Object.values(x).forEach((X) => {
        b = Math.min(b, X.x), y = Math.max(y, X.x), P = Math.min(P, X.y), W = Math.max(W, X.y);
      }), { minX: b, maxX: y, minY: P, maxY: W, rangeX: y - b, rangeY: W - P };
    })()
  }), console.log("[Kamada-Kawai] Calling rescaleLayout with correct signature, scale:", r, "center:", i);
  const E = ne(x, l, r, i);
  console.log("[Kamada-Kawai] rescaleLayout completed successfully"), console.log("[Kamada-Kawai] Sample positions AFTER rescaling:", {
    sample: k,
    value: E[k],
    minMax: (() => {
      let b = 1 / 0, y = -1 / 0, P = 1 / 0, W = -1 / 0;
      return Object.values(E).forEach((X) => {
        b = Math.min(b, X.x), y = Math.max(y, X.x), P = Math.min(P, X.y), W = Math.max(W, X.y);
      }), { minX: b, maxX: y, minY: P, maxY: W, rangeX: y - b, rangeY: W - P };
    })()
  });
  const J = {};
  console.log("[Kamada-Kawai] Creating final positions dictionary");
  try {
    Object.entries(E).forEach(([P, W]) => {
      J[P] = {
        x: W.x,
        y: W.y
      };
    }), console.log("[Kamada-Kawai] Final positions dictionary created successfully, count:", Object.keys(J).length);
    const b = l.slice(0, 3), y = {};
    b.forEach((P) => {
      y[P] = J[P];
    }), console.log("[Kamada-Kawai] Sample final positions:", y);
  } catch (b) {
    throw console.error("[Kamada-Kawai] Error creating positions dictionary:", b.message), console.error("  rescaledDict:", E), b;
  }
  return f(t, 1), J;
}
function Ut(o, e) {
  const t = e.length, s = Array(t).fill(null).map(() => Array(t).fill(1 / 0)), n = {};
  e.forEach((i, a) => {
    n[i] = a, s[a][a] = 0;
  });
  for (let i = 0; i < t; i++) {
    const a = e[i], d = [[a, 0]], h = /* @__PURE__ */ new Set([a]);
    for (; d.length > 0; ) {
      const [l, c] = d.shift(), g = n[l];
      g !== void 0 && (s[i][g] = c);
      const u = o.getNeighbors(l) || [];
      for (const p of u)
        h.has(p) || (h.add(p), d.push([p, c + 1]));
    }
  }
  let r = 0;
  for (let i = 0; i < t; i++)
    for (let a = i + 1; a < t; a++)
      isFinite(s[i][a]) && s[i][a] > r && (r = s[i][a]);
  for (let i = 0; i < t; i++)
    for (let a = 0; a < t; a++)
      s[i][a] > r && (s[i][a] = r);
  return s;
}
function Ot(o, e) {
  const t = o.length, s = [];
  if (e && Object.keys(e).length > 0)
    o.forEach((n) => {
      const r = e[n];
      r ? s.push([r.x || 0, r.y || 0]) : s.push([Math.random(), Math.random()]);
    });
  else {
    const n = Math.sqrt(t);
    if (t > 100) {
      const r = n * 3;
      console.log(`[Kamada-Kawai] Random initialization: spread=${r.toFixed(2)}, L0=${n.toFixed(2)}`);
      for (let i = 0; i < t; i++) {
        const a = (Math.random() - 0.5) * r, d = (Math.random() - 0.5) * r;
        s.push([a, d]);
      }
    } else {
      const r = 2 * Math.PI / t, i = n * 2;
      console.log(`[Kamada-Kawai] Circular initialization: radius=${i.toFixed(2)}, L0=${n.toFixed(2)}`);
      for (let a = 0; a < t; a++) {
        const d = i * Math.cos(a * r), h = i * Math.sin(a * r);
        s.push([d, h]);
      }
    }
  }
  return s;
}
const _t = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  KamadaKawaiLayout: Pe,
  default: Pe,
  kamadaKawaiCompute: Ht
}, Symbol.toStringTag, { value: "Module" }));
class Ze extends j {
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
async function qt(o, e, t) {
  const s = N(o), {
    partition: n = null,
    align: r = "vertical",
    scale: i = 1,
    aspectRatio: a = 4 / 3,
    center: d = { x: 0, y: 0 }
  } = e || {}, h = Array.from(s.nodes), l = h.length;
  if (l === 0)
    return f(t, 1), {};
  if (l === 1) {
    const x = { [h[0]]: { x: d.x, y: d.y } };
    return f(t, 1), x;
  }
  f(t, 0.3);
  let c, g;
  n && n.length > 0 ? (c = new Set(n), g = new Set(h.filter((x) => !c.has(x)))) : (c = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Set(), h.forEach((x, k) => {
    k % 2 === 0 ? c.add(x) : g.add(x);
  })), f(t, 0.5);
  const u = Array.from(c), p = Array.from(g), C = [], G = u.length - 1 || 1, I = p.length - 1 || 1, w = a * 2, m = 2, v = w / 2, Z = m / 2;
  u.forEach((x, k) => {
    const E = -v, J = G > 0 ? k * m / G - Z : 0;
    C.push([E, J]);
  }), p.forEach((x, k) => {
    const E = v, J = I > 0 ? k * m / I - Z : 0;
    C.push([E, J]);
  }), f(t, 0.7);
  const T = [...u, ...p], M = {};
  T.forEach((x, k) => {
    M[x] = {
      x: C[k][0],
      y: C[k][1]
    };
  });
  const L = ne(M, T, i, d);
  f(t, 0.9);
  const B = {};
  return T.forEach((x) => {
    B[x] = L[x];
  }), r === "horizontal" && Object.keys(B).forEach((x) => {
    const k = B[x].x;
    B[x].x = B[x].y, B[x].y = k;
  }), f(t, 1), B;
}
const Qt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BipartiteLayout: Ze,
  bipartiteCompute: qt,
  default: Ze
}, Symbol.toStringTag, { value: "Module" }));
class xe extends j {
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
async function Dt(o, e, t) {
  const s = N(o), {
    subsets: n = null,
    align: r = "vertical",
    scale: i = 1,
    center: a = { x: 0, y: 0 }
  } = e || {}, d = Array.from(s.nodes), h = d.length;
  if (h === 0)
    return f(t, 1), {};
  if (h === 1) {
    const w = { [d[0]]: { x: a.x, y: a.y } };
    return f(t, 1), w;
  }
  f(t, 0.3);
  let l;
  if (n && Object.keys(n).length > 0)
    l = Object.keys(n).sort((m, v) => {
      const Z = parseInt(m), T = parseInt(v);
      return isNaN(Z) ? 1 : isNaN(T) ? -1 : Z - T;
    }).map((m) => n[m]);
  else {
    const w = /* @__PURE__ */ new Map();
    d.forEach((m, v) => {
      const Z = v % 3;
      w.has(Z) || w.set(Z, []), w.get(Z).push(m);
    }), l = Array.from(w.values());
  }
  f(t, 0.5);
  const c = [], g = {}, u = l.length, p = u * 2 - 1;
  l.forEach((w, m) => {
    const v = w.length - 1 || 1, Z = (m * 2 - p / 2) / (u - 1 || 1);
    w.forEach((T, M) => {
      const L = v > 0 ? 2 * M / v - 1 : 0;
      c.push([Z, L]);
    });
  }), f(t, 0.7);
  const C = [];
  l.forEach((w) => {
    w.forEach((m) => {
      C.push(m);
    });
  });
  const G = {};
  C.forEach((w, m) => {
    G[w] = {
      x: c[m][0],
      y: c[m][1]
    };
  });
  const I = ne(G, C, i, a);
  return f(t, 0.9), C.forEach((w) => {
    g[w] = I[w];
  }), r === "horizontal" && Object.keys(g).forEach((w) => {
    const m = g[w].x;
    g[w].x = g[w].y, g[w].y = m;
  }), f(t, 1), g;
}
const $t = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MultipartiteLayout: xe,
  default: xe,
  multipartiteCompute: Dt
}, Symbol.toStringTag, { value: "Module" }));
class We extends j {
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
async function es(o, e, t) {
  const s = N(o), {
    startNode: n = null,
    align: r = "vertical",
    scale: i = 1,
    center: a = { x: 0, y: 0 }
  } = e || {}, d = Array.from(s.nodes), h = d.length;
  if (h === 0)
    return f(t, 1), {};
  if (h === 1) {
    const m = { [d[0]]: { x: a.x, y: a.y } };
    return f(t, 1), m;
  }
  f(t, 0.2);
  let l = n;
  (!l || !d.includes(l)) && (l = d[0]), f(t, 0.3);
  const c = ts(s, l);
  f(t, 0.6);
  const g = /* @__PURE__ */ new Set();
  if (c.forEach((m) => {
    m.forEach((v) => g.add(v));
  }), g.size !== h) {
    const m = d.filter((v) => !g.has(v));
    m.length > 0 && c.push(m);
  }
  f(t, 0.7);
  const u = [], p = c.length;
  Math.max(...c.map((m) => m.length)), c.forEach((m, v) => {
    const Z = p > 1 ? 2 * v / (p - 1) - 1 : 0, T = m.length - 1 || 1;
    m.forEach((M, L) => {
      const B = T > 0 ? 2 * L / T - 1 : 0;
      u.push([Z, B]);
    });
  }), f(t, 0.85);
  const C = [];
  c.forEach((m) => {
    m.forEach((v) => {
      C.push(v);
    });
  });
  const G = {};
  C.forEach((m, v) => {
    G[m] = {
      x: u[v][0],
      y: u[v][1]
    };
  });
  const I = ne(G, C, i, a);
  f(t, 0.95);
  const w = {};
  return C.forEach((m) => {
    w[m] = I[m];
  }), r === "horizontal" && Object.keys(w).forEach((m) => {
    const v = w[m].x;
    w[m].x = w[m].y, w[m].y = v;
  }), f(t, 1), w;
}
function ts(o, e, t) {
  const s = [], n = /* @__PURE__ */ new Set(), r = [e];
  let i = [];
  for (n.add(e); r.length > 0; ) {
    const c = r.shift();
    i.push(c);
    const u = (o.getNeighbors(c) || []).filter((p) => !n.has(p));
    u.forEach((p) => {
      n.add(p), r.push(p);
    }), (r.length === 0 || u.length > 0) && i.length > 0 && (s.push([...i]), i = []);
  }
  s.length = 0, i = [];
  const a = /* @__PURE__ */ new Map(), d = [e];
  let h = 0;
  a.set(e, 0);
  let l = 0;
  for (; h < d.length; ) {
    const c = d[h], g = a.get(c);
    g > l && (i.length > 0 && (s.push([...i]), i = []), l = g), i.push(c), (o.getNeighbors(c) || []).forEach((p) => {
      a.has(p) || (a.set(p, g + 1), d.push(p));
    }), h++;
  }
  return i.length > 0 && s.push([...i]), s;
}
const ss = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BFSLayout: We,
  bfsCompute: es,
  default: We
}, Symbol.toStringTag, { value: "Module" })), ie = re({
  prefix: "network-worker",
  level: "info"
  // Workers default to info level
}), de = {
  // Node-level statistics (all in one file)
  "../statistics/algorithms/node-stats.js": mt,
  // Graph-level statistics
  "../statistics/algorithms/graph-stats.js": Zt,
  // Community
  "../community/algorithms/louvain.js": Bt,
  // Layouts
  "../layouts/random.js": kt,
  "../layouts/circular.js": Lt,
  "../layouts/spiral.js": zt,
  "../layouts/shell.js": Kt,
  "../layouts/spectral.js": Vt,
  "../layouts/force-directed.js": jt,
  "../layouts/kamada-kawai.js": _t,
  "../layouts/bipartite.js": Qt,
  "../layouts/multipartite.js": $t,
  "../layouts/bfs.js": ss
};
self.onmessage = async function(o) {
  const { id: e, module: t, functionName: s, args: n = [] } = o.data;
  try {
    if (!t || !s)
      throw new Error("Invalid task: module and functionName are required");
    ie.debug("Processing task", {
      id: e,
      module: t,
      functionName: s,
      argsLength: n?.length || 0
    });
    const r = (h) => {
      self.postMessage({
        id: e,
        status: "progress",
        progress: Math.min(Math.max(h, 0), 1)
        // Clamp to [0, 1]
      });
    }, i = de[t];
    if (!i)
      throw new Error(
        `Module '${t}' not found in registry. Available modules: ${Object.keys(de).join(", ")}`
      );
    const a = i[s];
    if (!a || typeof a != "function")
      throw new Error(
        `Function '${s}' not found in module '${t}'. Available functions: ${Object.keys(i).join(", ")}`
      );
    const d = await a(...n, r);
    self.postMessage({
      id: e,
      status: "complete",
      result: d
    });
  } catch (r) {
    ie.error("Task failed", {
      id: e,
      error: r.message,
      stack: r.stack
    }), self.postMessage({
      id: e,
      status: "error",
      error: r.message || "Unknown error",
      stack: r.stack
    });
  }
};
self.onerror = function(o) {
  ie.error("Worker error", {
    error: o.message || "Worker error occurred",
    stack: o.stack
  }), self.postMessage({
    status: "error",
    error: o.message || "Worker error occurred"
  });
};
ie.info("Initialized", { moduleCount: Object.keys(de).length });
//# sourceMappingURL=network-worker.js.map
