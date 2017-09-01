import { localStorage, setTimeout, clearTimeout } from './browser';
import { post } from './util';

let destination = 'https://me.sthom.kiwi/data';
let userId = -1;

let timeout = 0;

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

  // Add new entry
  store.push({
    user: userId,
    event: name,
    time: Date.now(),
    data,
  });

  localStorage.setItem('events', JSON.stringify(store));

  // Introduce a timeout to reduce number of requests made
  if (timeout) {
    clearTimeout(timeout);
  }
  setTimeout(() => {
    let data = localStorage.getItem('events') || '[]';

    // Reset the local storage in case events happen during the request time
    localStorage.setItem('events', '[]');

    post(destination, {data})
      .then(() => {
        console.log('request success');
        
      }, () => {
        console.log('request failed');
        
        // Merge local storage with pre-request data
        let curr = localStorage.getItem('events');

        localStorage.setItem('events', JSON.stringify([
          ...JSON.parse(data),
          ...JSON.parse(curr)
        ]));
      });
    
  }, 5000);
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

/**
 * Reads the user's tracking ID from local storage
 * 
 * @export
 * @returns {number} ID of user
 */
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
