<script>
  import ContactCard from "./ContactCard.svelte";
  let name = "";
  let jobTitle = "";
  let description = "";
  let image = "";
  $: uppercaseName = name.toUpperCase();

  function changeName() {
    name = "John";
  }

  // using a function
  function inputName(event) {
    const enteredValue = event.target.value;
    name = enteredValue;
  }
</script>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>

<h1>Hello {name}</h1>
<!-- <button on:click={changeName}>Change Name</button> -->
<!-- <input type="text" value={name} on:input={inputName} /> -->
<input type="text" bind:value={name} />
<input type="text" bind:value={image} />
<input type="text" bind:value={jobTitle} />
<input type="text" bind:value={description} />

<ContactCard username={name} {jobTitle} {description} {image} />
<main />
