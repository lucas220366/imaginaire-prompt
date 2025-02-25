
export class TimeoutManager {
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  setOperationTimeout(taskUUID: string, callback: () => void, duration: number): void {
    const timeout = setTimeout(() => {
      this.clearTimeout(taskUUID);
      callback();
    }, duration);
    this.timeouts.set(taskUUID, timeout);
  }

  clearTimeout(taskUUID: string): void {
    const timeout = this.timeouts.get(taskUUID);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(taskUUID);
    }
  }

  clearAll(): void {
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts.clear();
  }
}
