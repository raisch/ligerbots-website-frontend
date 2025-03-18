<script>
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { goto } from '$app/navigation'
  import { redirect } from '@sveltejs/kit'
  import { browser } from '$app/environment'

  $: user = writable()
  setContext('user', user)

  /** @type {String}*/
  let email

  /** @type {String}*/
  let password

  async function handleSubmit(/** @type {Event} */ evt) {
    let loginFields = { email, password }

    // TODO: implement login
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginFields)
    })

    const result = await res.json()

    if (result.error) {
      const elt = document.getElementById('error-msg')
      if (elt) {
        elt.innerHTML = result.error
        elt.style.display = 'block'
      }
      return
    }

    document.cookie = `auth=true; path=/; max-age=86400; samesite=strict`

    // save user
    sessionStorage.setItem('user', JSON.stringify(result.user))

    user.set(result.user)
    if (browser) {
      window.location.href = '/'
    }
  }

  const navigateToSignup = () => {
    goto('/signup')
  }
</script>

<svelte:head>
  <title>LigerBots Login</title>
  <meta property="og:title" content="LigerBots Login" />
</svelte:head>

<div class="flex flex-col space-y-4">
  <div class="bg-blue-600 text-white font-serif font-bold text-lg text-center py-2 rounded-lg">
    <a href="/login" style="color: white;">LOGIN</a>
  </div>
  <div class="flex flex-col space-y-4">
    <div class="w-full">
      <center>
        <form on:submit|preventDefault={handleSubmit} class="space-y-4">
          <input class="border border-gray-300 p-2 rounded-lg w-full" bind:value={email} type="email" placeholder="Email" />
          <input class="border border-gray-300 p-2 rounded-lg w-full" bind:value={password} type="password" placeholder="Password" />
          <button class="bg-blue-500 text-white py-2 px-4 rounded-lg"> Login </button>
        </form>
        <div id="error-msg" class="text-red-500 mt-4">Error</div>
        <br />
        <p>
          Don't have an account?
          <a href="#none" on:click={navigateToSignup}><strong>Sign up</strong></a>
        </p>
      </center>
    </div>
  </div>
</div>

<style>
  #error-msg {
    display: none;
    color: red;
  }
</style>
