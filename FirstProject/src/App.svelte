<script>
  import meetups from "./Meetups/meetups-store.js";

  import Header from "./UI/Header.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import TextInput from "./UI/TextInput.svelte";
  import Button from "./UI/Button.svelte";
  import EditMeetup from "./Meetups/EditMeetup.svelte";

  //let meetups;

  let editMode;

  function addMeetup(event) {
    const meetupData = {
      title: event.detail.title,
      subtitle: event.detail.subtitle,
      contactEmail: event.detail.email,
      description: event.detail.description,
      imageUrl: event.detail.imageUrl,
      address: event.detail.address
      // isFavorite: false
    };

    meetups.addMeetup(meetupData);

    editMode = null;
  }

  function togglefavorite(event) {
    const id = event.detail;
    meetups.toggleFavorite(id);
  }

  function cancelEdit() {
    editMode = null;
  }
</script>

<style>
  main {
    margin-top: 5rem;
  }
  .meetup-control {
    margin: 1rem;
  }
</style>

<Header />

<main>
  <div class="meetup-control">
    <Button on:click={() => (editMode = 'new')}>New MeetUp</Button>
  </div>
  {#if editMode === 'new'}
    <EditMeetup on:save={addMeetup} on:cancel={cancelEdit} />
  {/if}
  <MeetupGrid meetups={$meetups} on:togglefavorite={togglefavorite} />
</main>
