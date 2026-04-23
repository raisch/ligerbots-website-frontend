<script lang="ts">
  let email: string = $state("")

  let oldPassword: string = $state("")
  let newPassword: string = $state("")
  let confirmPassword: string = $state("")

  async function handleSubmit(evt: Event) {
    evt.preventDefault()

    if (newPassword !== confirmPassword) {
      const elt = document.getElementById('error-msg')
      if (elt) {
        elt.innerHTML = "New password and confirm password do not match"
        elt.style.display = 'block'
      }
      return
    }

    let updateFields = { email, oldPassword, newPassword }
    const res = await fetch('/api/settings/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateFields)
    })

    const result = await res.json()

    if (!result.success) {
      const elt = document.getElementById('error-msg')
      if (elt) {
        elt.innerHTML = result.error || "Failed to change password"
        elt.style.display = 'block'
      }
      return
    }

    alert("Password changed successfully")
  }
</script>

<div class="row">
  <div class="title-bar">
    <center>
      <div class="notindex-title">
        <span style="color: white;">SETTINGS</span>
      </div>
    </center>
    <br />
  </div>
  <div class="row bottom-margin row-margins">
    <div class="col-xs-12">
      <h2 class="bottom-margin">Change Password</h2>
      <center>
        <form onsubmit={handleSubmit}>
          <input class="form-field" bind:value={email} type="email" placeholder="Email" required />
          <input class="form-field" bind:value={oldPassword} type="password" placeholder="Old Password" required />
          <input class="form-field" bind:value={newPassword} type="password" placeholder="New Password" required />
          <input class="form-field" bind:value={confirmPassword} type="password" placeholder="Confirm New Password" required />
          <button class="form-field">Update Password</button>
        </form>
        <div id="error-msg" class="bottom-margin">Error</div>
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
