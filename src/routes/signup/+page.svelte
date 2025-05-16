<script>
  import { goto } from '$app/navigation'


  /** @type {string} */
  let firstname
  /** @type {string} */
  let lastname
  /** @type {string} */
  let username
  /** @type {string}*/
  let email
  /** @type {string} */
  let phonenumber

  /** @type {string} */
  let school

  /** @type {string}*/
  let address1
  /** @type {string}*/
  let address2
  /** @type {string}*/
  let city
  /** @type {string}*/
  let state
  /** @type {number}*/
  let zip

  /** @type {string}*/
  let password1
  /** @type {string}*/
  let password2

  const handleSubmit = (/** @type {Event} */ evt) => {
    let loginFields = { email, password1, password2, firstname, lastname, username, phonenumber, address1, address2, city, state, zip }
    alert(loginFields)
    return goto('/')
  }

  const navigateToLogin = () => {
    goto('/login')
  }
</script>

<div class="row">
  <div class="title-bar">
    <center>
      <div class="notindex-title">
        <span style="color: white;">SIGNUP</span>
      </div>
    </center>
    <br />
  </div>
  <div class="row bottom-margin row-margins">
    <div class="col-xs-12">
      <center>
        <div>This is the SIGNUP page.</div>
        <form on:submit|preventDefault={handleSubmit} id="signup-form">
          <div id="name-fields">
            <input class="form-field" bind:value={firstname} type="email" placeholder="First Name" />
            <input class="form-field" bind:value={lastname} type="email" placeholder="Last Name" />
          </div>

          <input class="form-field" bind:value={username} type="text" placeholder="Username" required pattern="^[^\s]+$"/>

          <input class="form-field" bind:value={email} type="email" placeholder="Email" required/>
          <input class="form-field" bind:value={phonenumber} type="text" placeholder="Phone Number" pattern="^[\d()+- ]*$"/>

          <input class="form-field" bind:value={address1} type="text" placeholder="Address"/>
          <input class="form-field" bind:value={address2} type="text" placeholder="Address Line 2"/>
          <div id="address-city">
            <input class="form-field" bind:value={city} type="text" placeholder="City" required/>
            <select class="form-field" bind:value={state} placeholder="State" required>
              <option value="MA">Massachusetts</option>
              <option value="NH" disabled>New Hampshire</option>
              <option value="ME" disabled>Maine</option>
              <option value="VT" disabled>Vermont</option>
              <option value="CT" disabled>Connecticut</option>
              <option value="RI" disabled>Rhode Island</option>
            </select>
            <input class="form-field" bind:value={zip} type="text" placeholder="Zip Code" required pattern="(\d{5}(-\d{4}(\d\d)?)?)?" maxlength="12"/>
          </div>
          <select class="form-field" bind:value={school} required>
            <option value="newton-north">Newton North</option>
            <option value="newton-south">Newton South</option>
            <option value="other">Other</option>
            <option value="none">None</option>
          </select>

          <input class="form-field" bind:value={password1} type="password" placeholder="Password" required/>
          <input class="form-field" bind:value={password2} type="password" placeholder="Confirm Password" required/>
          <button class="form-field" disabled={password1 != password2}>Sign Up</button>
        </form>
        <div id="error-msg" class="bottom-margin">Error</div>
        <br />
        <p>
          Already have an account?
          <a href="#none" on:click={navigateToLogin}><strong>Login</strong></a>
        </p>
      </center>
    </div>
  </div>
</div>

<style>
  #signup-form {
    width: 500px;
  }
  #signup-form > * {
    display: block;
    width: 100%;
  }
  .form-field {
    padding: 5px;
    margin: 10px auto;
    height: 40px;
    font-size: 16px;
    border-radius: 5px;
    border: 1px solid #ccc;
    transition: all 0.1s ease-in-out;
  }
  #signup-form > div {
    display: flex;
    justify-content: space-between;
    margin: -10px 0;
  }
  #signup-form > div > .form-field {
    flex: 1;
    width: calc(50% - 50px);
  }
  #signup-form > div > .form-field:not(:last-child) {
    margin-right: 10px;
  }


  .form-field:is(:hover, :focus):not(:disabled) {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    outline: none;
  }
  button.form-field::after {
    content: "Account creation is not possible at this time.";
    position: absolute;
    left: calc(50% - 180px);
    display: block;
    text-align: center;
    width: 360px;
    color: transparent;
    transition: all 0.1s ease-in-out;
  }
  button.form-field:hover::after {
    color: red;
  }
    

  #error-msg {
    display: none;
    color: red;
  }
</style>
