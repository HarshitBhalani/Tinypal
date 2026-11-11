export type Listener<T> = (payload: T) => void;

/** Tiny typed event emitter. `on` returns an unsubscribe function. */
export class Emitter<Events extends Record<string, unknown>> {
  private listeners = new Map<keyof Events, Set<Listener<never>>>();

  on<K extends keyof Events>(name: K, listener: Listener<Events[K]>): () => void {
    let set = this.listeners.get(name);
    if (!set) {
      set = new Set();
      this.listeners.set(name, set);
    }
    set.add(listener as Listener<never>);
    return () => this.off(name, listener);
  }

  off<K extends keyof Events>(name: K, listener: Listener<Events[K]>): void {
    this.listeners.get(name)?.delete(listener as Listener<never>);
  }

  emit<K extends keyof Events>(name: K, payload: Events[K]): void {
    this.listeners.get(name)?.forEach((l) => (l as Listener<Events[K]>)(payload));
  }

  clear(): void {
    this.listeners.clear();
  }

  listenerCount(name?: keyof Events): number {
    if (name) return this.listeners.get(name)?.size ?? 0;
    let n = 0;
    this.listeners.forEach((s) => (n += s.size));
    return n;
  }
}
