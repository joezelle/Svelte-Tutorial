<script>
  import { scale } from "svelte/transition";
</script>

<style>
  span {
    display: inline-block;
    margin: 0 0.25rem;
    border-radius: 3px;
    border: 1px solid #1f9fd1;
    background: #1f9fd1;
    color: white;
    padding: 0 0.5rem;
    font-family: "lato", sans-serif;
    font-size: 0.8rem;
  }
</style>

<span transition:scale>
  <slot />
</span>
