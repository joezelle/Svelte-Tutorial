<script>
  import CustomInput from "./CustomInput.svelte";
  import Toggle from "./Toggle.svelte";

  let name = "";
  let selectedOption = 1;
  let price = 0;
  let agreed;
  let favColor = "blue";
  let selectedItem;
  //   for checkboxes
  //let favColor = ["blue"];

  $: console.log(selectedOption);
  $: console.log(price);
  $: console.log(agreed);
  $: console.log(favColor);
  $: console.log(selectedItem);
</script>

<main>
  <CustomInput bind:val={name} />
  <p>{name}</p>

  <Toggle bind:chosenOption={selectedOption} />

  <!-- to get numbers as output not string -->
  <input type="number" bind:value={price} />
  <!-- two way binding doesn't allow dynamic value of type -->

  <!-- use bind:checked -->
  <label>
    <input type="checkbox" bind:checked={agreed} />
    I agree to terms and conditions
  </label>

  <!-- for radio -->
  Favorite Color
  <label>
    <input type="radio" value="blue" name={favColor} bind:group={favColor} />
    Blue
  </label>
  <label>
    <input type="radio" value="white" name={favColor} bind:group={favColor} />
    White
  </label>
  <label>
    <input type="radio" value="black" name={favColor} bind:group={favColor} />
    Black
  </label>
  <label>
    <input type="radio" value="cobalt" name={favColor} bind:group={favColor} />
    Cobalt
  </label>

  <!-- returns an array -->
  <label>
    <input type="checkbox" value="blue" name={favColor} bind:group={favColor} />
    Blue
  </label>
  <label>
    <input
      type="checkbox"
      value="white"
      name={favColor}
      bind:group={favColor} />
    White
  </label>
  <label>
    <input
      type="checkbox"
      value="black"
      name={favColor}
      bind:group={favColor} />
    Black
  </label>
  <label>
    <input
      type="checkbox"
      value="cobalt"
      name={favColor}
      bind:group={favColor} />
    Cobalt
  </label>

  <!-- Dropdown -->

  <select bind:value={selectedItem} id="">
    <option value="blue">Blue</option>
    <option value="cobalt">cobalt</option>
    <option value="Sapphire">Sapphire</option>
  </select>

</main>
