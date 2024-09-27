<script>
  // @ts-nocheck

  import App from '../../App.svelte'

  const DEFAULT_PHOTO_FILENAME_DOWNLOAD = 'default_user.jpg'
  const DEFAULT_PHOTO_FILENAME_DISK = '9382f638-b807-409c-8cdf-88a93f797597.jpg'

  /** @type {import('./$types')}.PageData */
  export let data

  // console.log('data', data)

  const { users, photos } = data

  /**
   * Find the photo for a user
   * @param {string} slug
   *
   * @returns {object} photo
   */
  function findPhoto(slug) {
    // console.log(`looking for ${slug}.jpg`)
    return (
      photos.find((/** @type {Photo} */ photo) => photo.filename_download === slug + '.jpg') || {
        filename_download: DEFAULT_PHOTO_FILENAME_DOWNLOAD,
        filename_disk: DEFAULT_PHOTO_FILENAME_DISK
      }
    )
  }

  const students = users.filter((user) => user.groups.includes('Student'))
  // console.log(`read ${students.length} students`)

  for (const student of students) {
    student.photo = findPhoto(student.slug)
    const imageFilename = student?.photo?.filename_disk.replace(/\.jpg$/, '')
    student.imageUrl = imageFilename ? `http://ligerbots.4msg.net:8055/assets/${imageFilename}` : ''
  }
</script>

<svelte:head>
  <title>LigerBots Facebook</title>
  <meta property="og:title" content="LigerBots Facebook" />
</svelte:head>

<App>
  {#each students as student}
    <div class="facebook-entry">
      <img src={student.imageUrl} alt="Profile picture of {student.fullname}" />
      <br />
      <div class="name">{student.fullname}</div>
      <div class={student.school.toLowerCase()}>{student.school}</div>
    </div>
  {/each}
</App>
