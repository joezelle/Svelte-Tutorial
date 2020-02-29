<script>
  import {
    createEventDispatcher,
    onMount,
    onDestroy,
    beforeUpdate,
    afterUpdate
  } from "svelte";

  const dispatch = createEventDispatcher();

  let agreed = false;
  let autoscroll = false;

  console.log("script executed");

  onMount(() => {
    console.log("mounted");
  });

  onDestroy(() => {
    console.log("destroyed");
  });

  beforeUpdate(() => {
    console.log("before update");
    autoscroll = agreed;
  });

  afterUpdate(() => {
    console.log("after update");
    if (autoscroll) {
      const modal = document.querySelector(".modal");
      modal.scrollTo(0, modal.scrollHeight);
    }
  });
</script>

<style>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.75);
    z-index: 10;
  }

  .modal {
    padding: 1rem;
    position: fixed;
    top: 10vh;
    left: 10%;
    width: 80%;
    max-height: 10vh;
    background: white;
    border-radius: 5px;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    overflow: scroll;
  }
  header {
    border-bottom: 1px solid #ccc;
  }
</style>

<div class="backdrop" on:click={() => dispatch('cancel')} />

<div class="modal">
  <header>
    <slot name="header" />
  </header>
  <slot />
  <div class="disclaimer">
    <p>Before you close, you need to agree to our terms!</p>
    <button on:click={() => (agreed = true)}>Agree</button>
  </div>
  <footer>
    <slot name="footer" didAgree={agreed}>
      <button
        type="button"
        on:click={() => dispatch('close')}
        disabled={!agreed}>
        Close
      </button>
    </slot>
  </footer>
</div>
