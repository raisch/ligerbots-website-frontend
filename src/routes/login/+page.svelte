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

  /** @type {Bool}*/
  let rememberMe

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

  // const navigateToSignup = () => {
  //   goto('/signup')
  // }
</script>

<svelte:head>
  <title>LigerBots Login</title>
  <meta property="og:title" content="Login" />
</svelte:head>

<div class="flex flex-col">
  <!-- <div class="title-bar"> -->
  <!--   <center> -->
  <!--     <div class="notindex-title"> -->
  <!--       <a href="/login" style="color: white;">LOGIN</a> -->
  <!--     </div> -->
  <!--   </center> -->
  <!--   <br /> -->
  <!-- </div> -->
    <center>
      <form on:submit|preventDefault={handleSubmit}>
        <div class="flex flex-col w-[20vw] gap-[1vw]">
          <div class="flex flex-col gap-[0.5vw] items-start font-bold text-gray-700">
            Username:
            <input class="h-[1vw] w-full font-[12pt] text-black py-[1vw] px-[0.5vw] border-1 border-gray-400 inset-shadow-2xs inset-shadow-gray-300 rounded-[0.2vw] transition ease-in-out duration-150 focus:border-blue-400 focus:shadow-blue-400/50 focus:shadow-md focus:outline-none font-normal" bind:value={email} type="email" placeholder="Email" />
          </div>
          <div class="flex flex-col gap-[0.5vw] items-start font-bold text-gray-700">
            Password: 
            <input class="h-[1vw] w-full font-[12pt] text-black py-[1vw] px-[0.5vw] border-1 border-gray-400 inset-shadow-2xs inset-shadow-gray-300 rounded-[0.2vw] transition ease-in-out duration-150 focus:border-blue-400 focus:shadow-blue-400/50 focus:shadow-md focus:outline-none font-normal" bind:value={password} type="password" placeholder="Password" />
          </div>
          <label class="font-[Open_Sans] cursor-pointer flex flex-row items-center">
            <input class="h-[2vw] w-fit pt-[0.2vw] pb-[0.3vw] my-auto px-[0.5vw] border-1 border-gray-400 rounded-[0.2vw] hover:bg-gray-100 cursor-pointer" type="checkbox" bind:value={rememberMe}/> 
            &nbsp;Remember me
          </label>
          <button class="h-[2vw] w-fit pt-[0.2vw] pb-[0.3vw] my-auto px-[0.5vw] border-1 border-gray-400 inset-shadow-2xs inset-shadow-gray-300 rounded-[0.2vw] hover:bg-gray-100 cursor-pointer"> Login </button>
        </div>
      </form>
      <div id="error-msg" class="bottom-margin">Error</div>
      <br />
      <p class="font-[Open_Sans]">
        Don't have an account?
        <a href="/signup" class="text-blue-500 hover:text-blue-700 hover:underline font-bold">Sign Up</a>
      </p>
    </center>
</div>

<style>
  #error-msg {
    display: none;
    color: red;
  }
</style>
