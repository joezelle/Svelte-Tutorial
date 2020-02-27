<script>
  import ContactCard from "./ContactCard.svelte";
  let name = "Joel";
  let jobTitle = "";
  let description = "";
  let image = "";
  let id;
  $: uppercaseName = name.toUpperCase();
  // let done = true;
  let formState = "empty";
  let createdContacts = [];

  function changeName() {
    name = "John";
  }

  // using a function
  function inputName(event) {
    const enteredValue = event.target.value;
    name = enteredValue;
  }

  function addCard() {
    if (
      name.trim().length === 0 ||
      image.trim().length === 0 ||
      jobTitle.trim().length === 0 ||
      description.trim().length === 0
    ) {
      formState = "invalid";
      return;
    }
    createdContacts = [
      ...createdContacts,
      {
        id: Math.random(),
        name: name,
        jobTitle: jobTitle,
        image: image,
        description: description
      }
    ];
    formState = "done";
  }

  function deleteFirst() {
    createdContacts = createdContacts.slice(1);
  }

  function deleteLast() {
    createdContacts = createdContacts.slice(0, -1);
  }
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  /* h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  } */

  #form {
    width: 30rem;
    max-width: 100%;
  }
</style>

<!-- <h1>Hello {name}</h1> -->
<!-- <button on:click={changeName}>Change Name</button> -->
<!-- <input type="text" value={name} on:input={inputName} /> -->
<!-- <input type="text" bind:value={name} />
<input type="text" bind:value={image} />
<input type="text" bind:value={jobTitle} />
<input type="text" bind:value={description} /> -->

<div id="form">
  <div class="form-control">
    <label for="userName">User Name</label>
    <input type="text" bind:value={name} id="userName" />
  </div>
  <div class="form-control">
    <label for="jobTitle">Job Title</label>
    <input type="text" bind:value={jobTitle} id="jobTitle" />
  </div>
  <div class="form-control">
    <label for="image">Image URL</label>
    <input type="text" bind:value={image} id="image" />
  </div>
  <div class="form-control">
    <label for="desc">Description</label>
    <textarea rows="3" bind:value={description} id="desc" />
  </div>
</div>

<button on:click={addCard}>Add Card Contact</button>
<button
  on:click={event => {
    createdContacts = createdContacts.slice(1);
  }}>
  Delete First Card
</button>
<button on:click={event => (createdContacts = createdContacts.slice(0, -1))}>
  Delete Last Card
</button>

{#if formState === 'invalid'}
  <p>Invalid Input.</p>
{:else}
  <p>Please fill in your data</p>
{/if}

{#each createdContacts as contacts, i (contacts.id)}
  <h2># {i + 1}</h2>
  <ContactCard
    username={contacts.name}
    jobTitle={contacts.jobTitle}
    description={contacts.description}
    image={contacts.image} />
{:else}
  <p>Please add some Contacts</p>
{/each}
<main />
