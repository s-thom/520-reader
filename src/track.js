import { localStorage } from './browser';

let userId = -1;

/**
 * Stores an event in the browser's localStorage
 * 
 * @export
 * @param {number} userId ID of the user
 * @param {string} name Name of the event
 * @param {any} [data={}] Extra data to include
 */
export function event(name, data = {}) {
  let str = localStorage.getItem('events') || '[]';
  let store = JSON.parse(str);

  store.push({
    user: userId,
    event: name,
    time: Date.now(),
    data,
  });

  localStorage.setItem('events', JSON.stringify(store));
}

/**
 * Sets the user ID for this session
 * 
 * @export
 * @param {number} id 
 */
export function setUser(id) {
  userId = id;
  localStorage.setItem('uid', id.toString());
}

export function getStartupUser() {
  userId = parseInt(localStorage.getItem('uid'), 10) || -1;
  return userId;
}

/**
 * Resets the events stored in localStorage
 * 
 * @export
 */
export function reset() {
  localStorage.removeItem('events');
  localStorage.removeItem('uid');
}
