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

export const user = writable(userRec || null)
