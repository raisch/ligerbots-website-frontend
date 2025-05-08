/** @module debugging */

// Client-side debugging messages

import { browser } from '$app/environment'

const DEBUGGING = '__LIGERBOTS_DEBUGGING__'

export default class Debug {
  static _state = 'false'

  static get state() {
    return Debug._state === 'true'
  }

  static on() {
    Debug._state = 'true'
    return Debug
  }

  static off() {
    Debug._state = 'false'
  }

  static test() {
    console.log('test')
    Debug.on()
    Debug.log('Debugging is on')
    Debug.off()
    Debug.log('Debugging is off')
  }

  /**
   * Print a debug message to the console.
   *
   * @param  {...any} args
   */
  static log(...args) {
    if (Debug.state) {
      console.log(...args)
    }
  }
}

if (browser) {
  // @ts-ignore
  window.__Ligerbots = { Debug }
}
