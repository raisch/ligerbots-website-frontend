<script>
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  import { goto } from '$app/navigation'
  import { redirect } from '@sveltejs/kit'
  import { browser } from '$app/environment'
  import { page } from '$app/stores';

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

<div class="row">
  <div class="title-bar">
    <center>
      <div class="notindex-title">
        <a href="/login" style="color: white;">LOGIN</a>
      </div>
    </center>
    <br />
  </div>
  <div class="row bottom-margin row-margins">
    <div class="col-xs-12">
      <center>
        {#if $page.url.hash.startsWith('#msg=')}
          <div id="top-error-msg">
            {#if $page.url.hash === '#msg=not-logged-in'}
              You must be logged in to view this page.
            {/if}
          </div>
        {/if}
        <form on:submit|preventDefault={handleSubmit}>
          <input class="form-field" bind:value={email} type="email" placeholder="Email" />
          <input class="form-field" bind:value={password} type="password" placeholder="Password" />
          <button class="form-field"> Login </button>
        </form>
        <div id="error-msg" class="bottom-margin">Error</div>
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
  .form-field {
    width: 400px;
    height: 40px;
    margin: 10px;
    padding: 5px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    transition: all 0.1s ease-in-out;
    display: block;
  }
  .form-field:is(:hover, :focus):not(:disabled) {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }
  
  
  #error-msg {
    display: none;
    color: red;
  }
  #top-error-msg {
    width: 400px;
    border: 1px solid red;
    color: red;
    background-color: pink;
    padding: 10px;
    border-radius: 5px;
    font-size: 14px;
  }
</style>
