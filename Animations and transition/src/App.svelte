<script>
  import { writable } from "svelte/store";
  import { tweened } from "svelte/motion";
  import { cubicIn } from "svelte/easing";
  import { fade, fly, slide, scale } from "svelte/transition";
  import { flip } from "svelte/animate";

  import Spring from "./Spring.svelte";

  let boxInput;
  const progress = tweened(0, {
    delay: 0,
    duration: 700,
    easing: cubicIn
  });

  setTimeout(() => {
    progress.set(0.5);
  }, 1500);

  let boxex = [];

  function addBox() {
    boxex = [boxInput.value, ...boxex];
  }

  function discard(value) {
    boxex = boxex.filter(el => el !== value);
  }

  function showParagraph() {}
</script>

<style>
  div {
    width: 10rem;
    height: 10rem;
    background: #ccc;
    margin: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    border-radius: 5px;
    padding: 1rem;
  }
</style>

<!-- <Spring /> -->
<!-- <progress value={$progress} /> -->
<button
  on:click={() => {
    showParagraph = !showParagraph;
  }}>
  Toggle
</button>

{#if showParagraph}
  <p in:fade out:fly={{ x: -300 }}>Can you see me</p>
{/if}
<hr />
<input type="text" name="" bind:this={boxInput} id="" />
<button on:click={addBox}>Add</button>

{#if showParagraph}
  {#each boxex as box (box)}
    <div
      transition:fly|local={{ easing: cubicIn, x: 300, y: -300 }}
      on:click={discard.bind(this, box)}
      on:introstart={() => console.log('Adding the element starts')}
      on:introend={() => console.log('Adding the element ends')}
      on:outrostart={() => console.log('removing the element starts')}
      on:outroend={() => console.log('removing the element end')}
      animate:flip={{ duration: 400 }}>
      {box}
    </div>
  {/each}
{/if}
