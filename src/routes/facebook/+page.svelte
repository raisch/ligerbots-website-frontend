<!--
  TODO: Make facebook inaccessable to people who aren't logged in
-->
<script>
  // @ts-nocheck

  const DEFAULT_PHOTO_FILENAME_DOWNLOAD = 'default_user.jpg'
  const DEFAULT_PHOTO_FILENAME_DISK = '9382f638-b807-409c-8cdf-88a93f797597.jpg'

  
  /**
   * @typedef {Object} Props
   * @property {import('./$types')} data
   */

  /** @type {Props} */
  let { data } = $props();

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
    student.imageUrl = imageFilename ? `/assets/${imageFilename}` : ''
  }
</script>

<svelte:head>
  <title>LigerBots Facebook</title>
  <meta property="og:title" content="LigerBots Facebook" />
</svelte:head>

<center class="basis-1/12 font-[Open_Sans] text-[13pt] w-full text-black/80">
  <div class="bg-[#D04E1D] text-white text-[20pt] font-[PT_Serif] font-bold text-ellipsis overflow-hidden w-1/3 h-full px-2 py-3 rounded-md">LIGERBOTS FACEBOOK</div>
  <br />
  The information on this page is confidential - It is only available to registered and approved users.
  <br />
  <br />
  <br />
  <br />
</center>
<div class="grid grid-flow-row auto-rows-min grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-[50px] px-[5vw]">
  {#each students as student}
    <div class="w-[150px] h-[280px] text-[10.5pt]">
      <img src={student.imageUrl} alt="Profile picture of {student.fullname}" />
      <br />
      <div class="flex flex-row">
        <div class="w-[70%]">{student.fullname}</div>
        <div class="{student.school.toLowerCase()} {student.school.toLowerCase() === 'south' ? 'text-[#0066b3]' : 'text-[#d04e1d]'}">{student.school}</div>
      </div>
    </div>
  {/each}
</div>
