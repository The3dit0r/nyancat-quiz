export class LocalVariable<T> {
  private key: string;
  private defaultValue: T;
  private _value: T;

  constructor(key: string, defaultValue: T) {
    this.key = key;
    this.defaultValue = defaultValue;
    this._value = this.load();
  }

  /**
   * Get the current value
   */
  get value(): T {
    return this._value;
  }

  /**
   * Set a new value and save to localStorage
   */
  set value(newValue: T) {
    this._value = newValue;
    this.save();
  }

  /**
   * Load value from localStorage
   */
  load(): T {
    try {
      const stored = localStorage.getItem(this.key);
      if (stored === null) {
        return this.defaultValue;
      }
      return JSON.parse(stored) as T;
    } catch (error) {
      console.warn(`Failed to load ${this.key} from localStorage:`, error);
      return this.defaultValue;
    }
  }

  /**
   * Save current value to localStorage
   */
  save(): void {
    try {
      localStorage.setItem(this.key, JSON.stringify(this._value));
    } catch (error) {
      console.error(`Failed to save ${this.key} to localStorage:`, error);
    }
  }

  /**
   * Reset to default value and update localStorage
   */
  reset(): void {
    this._value = this.defaultValue;
    this.save();
  }

  /**
   * Remove from localStorage and reset to default
   */
  clear(): void {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.error(`Failed to remove ${this.key} from localStorage:`, error);
    }
    this._value = this.defaultValue;
  }

  /**
   * Check if value exists in localStorage
   */
  exists(): boolean {
    return localStorage.getItem(this.key) !== null;
  }
}
