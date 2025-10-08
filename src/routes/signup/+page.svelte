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
      <div class="notindex-title">
        <a href="/gallery" style="color: white;">SIGNUP</a>
      </div>
    </center>
    <br />
  </div>
  <div class="row bottom-margin row-margins">
    <div class="col-xs-12">
      <center>
        <div>This is the SIGNUP page.</div>
      </center>
    </div>
  </div>
</div>
