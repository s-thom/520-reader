import { window } from './util';

/**
 * Stores an event in the browser's localStorage
 * 
 * @export
 * @param {number} userId ID of the user
 * @param {string} name Name of the event
 * @param {any} [data={}] Extra data to include
 */
export function event(userId, name, data = {}) {
  let store = window.localStorage.getItem('events') || [];

  store.push({
    user: userId,
    event: name,
    time: Date.now(),
    data,
  });

  window.localStorage.setItem('events', store);
}
