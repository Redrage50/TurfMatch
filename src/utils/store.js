// Lightweight localStorage-backed store standing in for a backend.
// Every "table" is a JSON array under its own key, seeded once on first run.

const NS = "turfapp:";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(NS + key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(NS + key, JSON.stringify(value));
}

export function seedOnce(key, seedValue) {
  const existing = localStorage.getItem(NS + key);
  if (existing === null) {
    write(key, seedValue);
    return seedValue;
  }
  return read(key, seedValue);
}

// Like seedOnce, but for arrays of records with an `id`: if the stored array is
// missing seed items added in a later version of the app (matched by id), those
// items get appended. Anything the user has already added/edited is left untouched.
export function seedAndMerge(key, seedArray) {
  const existing = localStorage.getItem(NS + key);
  if (existing === null) {
    write(key, seedArray);
    return seedArray;
  }
  const current = read(key, seedArray);
  const currentIds = new Set(current.map((item) => item.id));
  const missing = seedArray.filter((item) => !currentIds.has(item.id));
  if (missing.length === 0) return current;
  const merged = [...current, ...missing];
  write(key, merged);
  return merged;
}

export const store = {
  get: (key, fallback) => read(key, fallback),
  set: (key, value) => write(key, value),
  update: (key, updater, fallback) => {
    const current = read(key, fallback);
    const next = updater(current);
    write(key, next);
    return next;
  },
};

export function uid(prefix = "id") {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
