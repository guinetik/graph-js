import { createLogger as p } from "@guinetik/logger";
import { v as g, w as d, x as f, y as k, z as y, H as j, I as h, J as C, N as w, O as b, P as M, Q as v, T as E } from "./bfs-LP6D7Mt2.js";
const a = p({
  prefix: "network-worker",
  level: "info"
  // Workers default to info level
}), u = {
  // Node-level statistics (all in one file)
  "../statistics/algorithms/node-stats.js": E,
  // Graph-level statistics
  "../statistics/algorithms/graph-stats.js": v,
  // Community
  "../community/algorithms/louvain.js": M,
  // Layouts
  "../layouts/random.js": b,
  "../layouts/circular.js": w,
  "../layouts/spiral.js": C,
  "../layouts/shell.js": h,
  "../layouts/spectral.js": j,
  "../layouts/force-directed.js": y,
  "../layouts/kamada-kawai.js": k,
  "../layouts/bipartite.js": f,
  "../layouts/multipartite.js": d,
  "../layouts/bfs.js": g
};
self.onmessage = async function(t) {
  const { id: e, module: o, functionName: r, args: l = [] } = t.data;
  try {
    if (!o || !r)
      throw new Error("Invalid task: module and functionName are required");
    a.debug("Processing task", {
      id: e,
      module: o,
      functionName: r,
      argsLength: l?.length || 0
    });
    const s = (m) => {
      self.postMessage({
        id: e,
        status: "progress",
        progress: Math.min(Math.max(m, 0), 1)
        // Clamp to [0, 1]
      });
    }, i = u[o];
    if (!i)
      throw new Error(
        `Module '${o}' not found in registry. Available modules: ${Object.keys(u).join(", ")}`
      );
    const n = i[r];
    if (!n || typeof n != "function")
      throw new Error(
        `Function '${r}' not found in module '${o}'. Available functions: ${Object.keys(i).join(", ")}`
      );
    const c = await n(...l, s);
    self.postMessage({
      id: e,
      status: "complete",
      result: c
    });
  } catch (s) {
    a.error("Task failed", {
      id: e,
      error: s.message,
      stack: s.stack
    }), self.postMessage({
      id: e,
      status: "error",
      error: s.message || "Unknown error",
      stack: s.stack
    });
  }
};
self.onerror = function(t) {
  a.error("Worker error", {
    error: t.message || "Worker error occurred",
    stack: t.stack
  }), self.postMessage({
    status: "error",
    error: t.message || "Worker error occurred"
  });
};
a.info("Initialized", { moduleCount: Object.keys(u).length });
//# sourceMappingURL=network-worker.js.map
