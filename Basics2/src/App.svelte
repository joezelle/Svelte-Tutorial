<script>
  import Product from "./Product.svelte";
</script>

<main>

  <Product
    productTitle="Shoes"
    on:add-to-cart={() => alert('add to cart')}
    on:delete={() => alert('delete')} />

</main>
