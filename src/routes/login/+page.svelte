<script>
  import { preventDefault } from 'svelte/legacy';

  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { goto } from '$app/navigation'
  import { redirect } from '@sveltejs/kit'
  import { browser } from '$app/environment'

  let user = $derived(writable())
  setContext('user', user)

  /** @type {String}*/
  let email = $state()

  /** @type {String}*/
  let password = $state()

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

    // sessionStorage.setItem('user', JSON.stringify(result.user))
    document.cookie = `user=${encodeURIComponent(JSON.stringify(result.user))}; path=/; max-age=86400; samesite=strict`

    const redirectUrl = new URLSearchParams(location.search).get('redirect')

    user.set(result.user)
    if (browser) {
      if (redirectUrl) {
        // if there is a redirect query parameter, redirect to that page after login
        location.href = redirectUrl
        return
      }
      location.href = '/'
    }
  }

  const navigateToSignup = () => {
    const redirectUrl = new URLSearchParams(location.search).get('redirect')
    if (redirectUrl) {
      // if there is a redirect query parameter, redirect to that page after signup
      goto(`/signup?redirect=${redirectUrl}`)
      return
    }
    goto('/signup')
  }
</script>

<svelte:head>
  <title>LigerBots Login</title>
  <meta property="og:title" content="LigerBots Login" />
</svelte:head>

<div class="row">
  <div class="title-bar">
    <center>
      <div class="notindex-title">
        <span style="color: white;">LOGIN</span>
      </div>
    </center>
    <br />
  </div>
  <div class="row bottom-margin row-margins">
    <div class="col-xs-12">
      <center>
        <form onsubmit={preventDefault(handleSubmit)}>
          <input class="form-field" bind:value={email} type="email" placeholder="Email" />
          <input class="form-field" bind:value={password} type="password" placeholder="Password" />
          <button class="form-field">Login</button>
        </form>
        <div id="error-msg" class="bottom-margin">Error</div>
        <br />
        <p>
          Don't have an account?
          <a href="#none" onclick={navigateToSignup}><strong>Sign up</strong></a>
        </p>
      </center>
    </div>
  </div>
</div>

<style>
  .form-field {
    width: 300px;
    height: 40px;
    margin: 10px;
    padding: 5px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    transition: all 0.1s ease-in-out;
    display: block;
  }
  .form-field:is(:global(:hover, :focus)):not(:disabled) {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }
    

  #error-msg {
    display: none;
    color: red;
  }
</style>
