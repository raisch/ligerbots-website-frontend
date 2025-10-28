<!-- 
  TODO: Get signup working
-->

<script>
  import { goto } from '$app/navigation'

  /** @type {string}*/
  let email

  /** @type {string}*/
  let password

  const handleSubmit = (/** @type {Event} */ evt) => {
    let loginFields = { email, password }
    alert(loginFields)
    return goto('/')
  }

  const navigateToSignup = () => {
    goto('/signup')
  }
</script>

<div class="row">
  <div class="title-bar">
    <center>
      <div class="font-[PT_Serif] font-bold text-[20pt] leading-[26pt] text-center bg-[#d04e1d] px-[2em] py-[0.5em] w-1/7 rounded mx-auto flex flex-row justify-center">
        <a class="text-white " href="/gallery">SIGNUP</a>
      </div>
    </center>
    <br />
  </div>
  <div class="flex flex-col">
    <center>
      <div>This is the SIGNUP page.</div>
    </center>
  </div>
</div>
