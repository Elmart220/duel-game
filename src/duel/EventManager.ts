export class EventManager {
  private _events: { [key: string]: Function[] } = {};

  public on(eventName: string, callback: Function) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].push(callback);
  }

  public emit(eventName: string, ...args: any[]) {
    if (!this._events[eventName]) {
      return;
    }
    this._events[eventName].forEach(callback => callback(...args));
  }

  public off(eventName?: string, callback?: Function) {
    if (!eventName) {
      this._events = {};
      return;
    }

    if (!this._events[eventName]) {
      return;
    }

    if (!callback) {
      this._events[eventName] = [];
      return;
    }

    const index = this._events[eventName].indexOf(callback);
    if (index !== -1) {
      this._events[eventName].splice(index, 1);
    }
  }
}
