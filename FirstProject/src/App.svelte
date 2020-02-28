<script>
  import Header from "./UI/Header.svelte";
  import MeetupGrid from "./Meetups/MeetupGrid.svelte";
  import TextInput from "./UI/TextInput.svelte";

  let title = "";
  let subtitle = "";
  let description = "";
  let email = "";
  let address = "";
  let imageUrl = "";

  let meetups = [
    {
      id: "meet1",
      title: "Coding Bootcamp",
      subtitle: "Learn to code in 30 Minutes",
      description: "In this meetup, we will have some experts that teach",
      imageUrl:
        "https://elevenfifty.org/wp-content/uploads/2017/04/Coding-Bootcamp-1-880x499.jpg",
      address: "27the Nerd Road,  32523 New York",
      contactEmail: "testing-testing@eamail.com"
    },
    {
      id: "meet2",
      title: "Boys Night Out",
      subtitle: "Boys Stepping Out",
      description: "Time for the real Gees to have some good time, bro-bonding",
      imageUrl:
        "https://www.partner-kz.com/wp-content/uploads/2019/01/Great-Boys%E2%80%99-Night-Out.jpg",
      address: "1020 ParkEast Road,  32523 Las Vegas",
      contactEmail: "testing@eamail.com"
    },
    {
      id: "meet3",
      title: "Double Date",
      subtitle: "First of its Kind",
      description: "Its time for that double date amongs the lovers",
      imageUrl:
        "https://www.liberaldictionary.com/wp-content/uploads/2018/12/double-date.jpg",
      address: "2234 Starklet Road,  32523 Los Angeles",
      contactEmail: "testing-testing@eamail.com"
    }
  ];

  function addMeetup() {
    const newMeetup = {
      id: Math.random().toString(),
      title: title,
      subtitle: subtitle,
      description: description,
      imageUrl: imageUrl,
      address: address,
      contactEmail: email
    };

    meetups = [newMeetup, ...meetups];
  }
</script>

<style>
  main {
    margin-top: 5rem;
  }

  form {
    width: 30rem;
    max-width: 90%;
    margin: auto;
  }
</style>

<Header />

<main>
  <form on:submit|preventDefault={addMeetup}>
    <TextInput
      id="title"
      label="title"
      value={title}
      on:input={event => (title = event.target.value)} />
    <TextInput
      id="subtitle"
      label="subtitle"
      type="text"
      value={subtitle}
      on:input={event => (subtitle = event.target.value)} />
    <TextInput
      id="address"
      label="address"
      type="text"
      value={address}
      on:input={event => (address = event.target.value)} />
    <TextInput
      id="imageUrl"
      label="imageUrl"
      type="text"
      value={imageUrl}
      on:input={event => (imageUrl = event.target.value)} />
    <TextInput
      id="email"
      label="email"
      type="email"
      value={email}
      on:input={event => (email = event.target.value)} />
    <TextInput
      id="description"
      label="description"
      controlType="textarea"
      value={description}
      on:input={event => (description = event.target.value)} />
    <button type="submit">Save</button>
  </form>
  <MeetupGrid {meetups} />
</main>
