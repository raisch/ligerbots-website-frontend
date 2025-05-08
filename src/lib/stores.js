/** @module lib/stores */

import { writable } from 'svelte/store'
import { browser } from '$app/environment'

let userRec
if (browser) {
  userRec = localStorage.getItem('user') || null
  if (userRec) {
    userRec = JSON.parse(userRec)
  }
}

/**
 * A writable store to manage the user state.
 * <br/>
 * This store is used to keep track of the current user in the application.
 * It is initialized with the user data from localStorage if available.
 */
export const user = writable(userRec || null)
