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

  /** @type {string} */
  let school
  /** @type {string} */
  let category

  /** @type {string[]} */
  let parentNames
  /** @type {string} */
  let parentEmail
  /** @type {string} */
  let parentPhone
  /** @type {number} */
  let graduationYear

  /** @type {string[]} */
  let roles
  /** @type {string[]} */
  let childrenNames

  async function handleSubmit(/** @type {Event} */ evt) {
    let loginFields = {
      firstname,
      lastname,
      username,
      email,
      phonenumber,
      address1,
      address2,
      city,
      state,
      zip,
      school,
      category,
      parentNames,
      parentEmail,
      parentPhone,
      graduationYear,
      roles,
      childrenNames
    }
    
    // alert(loginFields)

    const res = await fetch('/api/signup', {
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

    return goto('/signup/success')
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
        <form on:submit|preventDefault={handleSubmit} id="signup-form">
          <h3>Name</h3>
          <span class="form-label">Your Name</span>
          <div id="name-fields">
            <input class="form-field" bind:value={firstname} type="email" placeholder="First Name" />
            <input class="form-field" bind:value={lastname} type="email" placeholder="Last Name" />
          </div>

          <span class="form-label">Username</span>
          <input class="form-field" bind:value={username} type="text" placeholder="Username" required pattern="^[^\s]+$"/>

          <h3>Contact Information</h3>
          <span class="form-label">Email</span>
          <input class="form-field" bind:value={email} type="email" placeholder="email@example.com" required/>
          <span class="form-label">Phone Number</span>
          <input class="form-field" bind:value={phonenumber} type="text" placeholder="800-555-0123" pattern="^[\d()+- ]*$"/>

          <h3>Address</h3>
          <span class="form-label">Address</span>
          <input class="form-field" bind:value={address1} type="text" placeholder="Address" required/>
          <input class="form-field" bind:value={address2} type="text" placeholder="Address Line 2" required/>
          <span class="form-label">City, State, Zip</span>
          <div id="address-city">
            <input class="form-field" list="address-cities" bind:value={city} type="text" placeholder="City" required/>
            <datalist id="address-cities">
              <option value="Newton"></option>
              <option value="Boston"></option>
            </datalist>
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
          <h3>School</h3>
          <select class="form-field" bind:value={school} required>
            <option value="" disabled selected>School</option>
            <option value="newton-north">Newton North</option>
            <option value="newton-south">Newton South</option>
            <option value="other">Other</option>
            <option value="none">None</option>
          </select>

          <h3>Member Type</h3>
          <select class="form-field" bind:value={category}>
            <option value="" disabled selected>Role</option>
            <option value="student">Student</option>
            <option value="adult">Adult</option>
          </select>

          {#if category === 'student'}
            <h3>Parent/Guardian Information</h3>
            <span class="form-label">Name(s)</span>
            <input class="form-field" type="text" bind:value={parentNames} placeholder="" /> <!-- PLACEHOLDER - Replace with list -->
            <span class="form-label">Email</span>
            <input class="form-field" type="email" bind:value={parentEmail} placeholder="parent@example.com" />
            <span class="form-label">Phone</span>
            <input class="form-field" type="text" bind:value={parentPhone} placeholder="800-555-1234" pattern="^[\d()+- ]*$" />
            <h3>Other Information</h3>
            <span class="form-label">Graduation Year</span>
            <input class="form-field" type="number" bind:value={graduationYear} />
          {:else if category === 'adult'}
            <span class="form-label">Roles</span>
            <input class="form-field" type="text" bind:value={roles} placeholder="Roles" />
            <span class="form-label">Children</span>
            <input class="form-field" type="text" bind:value={childrenNames} placeholder="Children's Name(s)" /> <!-- PLACEHOLDER - Replace with list -->
          {/if}
          <hr>
          <!-- <input class="form-field" bind:value={password1} type="password" placeholder="Password" required/>
          <input class="form-field" bind:value={password2} type="password" placeholder="Confirm Password" required/> -->
          <button class="form-field">Sign Up</button>
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
  .form-label {
    text-align: left;
    margin-bottom: -10px;

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
