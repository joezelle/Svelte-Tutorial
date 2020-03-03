<script>
  import Header from "./UI/Header.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import TextInput from "./UI/TextInput.svelte";
  import Button from "./UI/Button.svelte";
  import EditMeetup from "./Meetups/EditMeetup.svelte";

  let meetups = [
    {
      id: "meet1",
      title: "Coding Bootcamp",
      subtitle: "Learn to code in 30 Minutes",
      description: "In this meetup, we will have some experts that teach",
      imageUrl:
        "https://elevenfifty.org/wp-content/uploads/2017/04/Coding-Bootcamp-1-880x499.jpg",
      address: "27the Nerd Road,  32523 New York",
      contactEmail: "testing-testing@eamail.com",
      isFavorite: false
    },
    {
      id: "meet2",
      title: "Boys Night Out",
      subtitle: "Boys Stepping Out",
      description: "Time for the real Gees to have some good time, bro-bonding",
      imageUrl:
        "https://www.partner-kz.com/wp-content/uploads/2019/01/Great-Boys%E2%80%99-Night-Out.jpg",
      address: "1020 ParkEast Road,  32523 Las Vegas",
      contactEmail: "testing@eamail.com",
      isFavorite: false
    },
    {
      id: "meet3",
      title: "Double Date",
      subtitle: "First of its Kind",
      description: "Its time for that double date amongs the lovers",
      imageUrl:
        "https://www.liberaldictionary.com/wp-content/uploads/2018/12/double-date.jpg",
      address: "2234 Starklet Road,  32523 Los Angeles",
      contactEmail: "testing-testing@eamail.com",
      isFavorite: false
    }
  ];

  let editMode;

  function addMeetup(event) {
    const newMeetup = {
      id: Math.random().toString(),
      title: event.detail.title,
      subtitle: event.detail.subtitle,
      description: event.detail.description,
      imageUrl: event.detail.imageUrl,
      address: event.detail.address,
      contactEmail: event.detail.email
      // isFavorite: false
    };

    meetups = [newMeetup, ...meetups];

    editMode = null;
  }

  function togglefavorite(event) {
    const id = event.detail;
    const updatedMeetup = { ...meetups.find(m => m.id === id) };
    updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
    const meetupIndex = meetups.findIndex(m => m.id === id);
    const updatedMeetups = [...meetups];
    updatedMeetups[meetupIndex] = updatedMeetup;
    meetups = updatedMeetups;
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
    <EditMeetup on:save={addMeetup} />
  {/if}
  <MeetupGrid {meetups} on:togglefavorite={togglefavorite} />
</main>
