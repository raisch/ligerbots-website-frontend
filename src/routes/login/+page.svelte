<script>
  import { goto } from '$app/navigation'

  import App from '../../App.svelte'

  /** @type {string}*/
  let email

  /** @type {string}*/
  let password

  const handleSubmit = (/** @type {Event} */ evt) => {
    let loginFields = { email, password }
    alert(JSON.stringify(loginFields))
    // TODO: implement login
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginFields)
    })
    //
    return goto('/')
  }

  const navigateToSignup = () => {
    goto('/signup')
  }
</script>

<svelte:head>
  <title>LigerBots Login</title>
  <meta property="og:title" content="LigerBots Login" />
</svelte:head>

<App>
  <div class="row">
    <div class="title-bar">
      <center>
        <div class="notindex-title">
          <a href="/gallery" style="color: white;">LOGIN</a>
        </div>
      </center>
      <br />
    </div>
    <div class="row bottom-margin row-margins">
      <div class="col-xs-12">
        <center>
          <form on:submit|preventDefault={handleSubmit}>
            <input class="form-field" bind:value={email} type="email" placeholder="Email" />
            <input class="form-field" bind:value={password} type="password" placeholder="Password" />
            <button class="form-field"> Login </button>
          </form>
          <br />
          <p>
            Don't have an account?
            <a href="#none" on:click={navigateToSignup}><strong>Sign up</strong></a>
          </p>
        </center>
      </div>
    </div>
  </div>
</App>
