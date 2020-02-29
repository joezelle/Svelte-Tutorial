<script>
  import { createEventDispatcher } from "svelte";

  export let title;
  export let price;
  export let id;
  export let onDemand = false;

  const dispatch = createEventDispatcher();

  function addToCart() {
    dispatch("add-to-cart", { id: "p1" });
  }
  function deleteCart() {
    dispatch("delete", { id: "p1" });
  }
</script>

<article>
  <h1>{title}</h1>
  <h3>${price}</h3>

  {#if onDemand}
    <h3>{onDemand}</h3>
  {/if}
  <button on:click={addToCart}>Add to cart</button>
  <button
    on:click={() => {
      dispatch('delete');
    }}>
    Delete
  </button>
</article>
