// In-Memory Sliding-Window Rate Limiter for Backend Security
// Protects API endpoints against DDoS, scraping, and LLM token exhaustion

interface RateLimitRecord {
  timestamps: number[];
}

const ipRequestMap = new Map<string, RateLimitRecord>();
const CLEANUP_INTERVAL_MS = 60 * 1000; // 1 minute

// Periodic garbage collection for expired IP entries
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    const windowStart = now - 60 * 1000;
    ipRequestMap.forEach((record, ip) => {
      record.timestamps = record.timestamps.filter(ts => ts > windowStart);
      if (record.timestamps.length === 0) {
        ipRequestMap.delete(ip);
      }
    });
  }, CLEANUP_INTERVAL_MS);
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export function checkRateLimit(
  ip: string,
  limit: number = 60,
  windowSeconds: number = 60
): RateLimitResult {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const windowStart = now - windowMs;

  let record = ipRequestMap.get(ip);
  if (!record) {
    record = { timestamps: [] };
    ipRequestMap.set(ip, record);
  }

  // Retain only requests within current window
  record.timestamps = record.timestamps.filter(ts => ts > windowStart);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0] || now;
    const resetSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));
    return {
      allowed: false,
      limit,
      remaining: 0,
      resetSeconds
    };
  }

  record.timestamps.push(now);
  return {
    allowed: true,
    limit,
    remaining: Math.max(0, limit - record.timestamps.length),
    resetSeconds: windowSeconds
  };
}
