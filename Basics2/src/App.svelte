<script>
  import Product from "./Product.svelte";

  let products = [
    {
      id: "p1",
      title: "Shoe",
      price: 9.99
    },
    {
      id: "p2",
      title: "Bag",
      price: 4.99,
      onDemand: "On Demand"
    }
  ];

  function addToCart(event) {
    console.log(event);
  }

  function deleteProduct(event) {
    console.log(event);
  }
</script>

<main>
  <!-- this is one way of passing props -->
  <!-- {#each products as product}
    <Product 
      title={product.title}
      price={product.price}
      on:add-to-cart={addToCart}
      on:delete={deleteProduct} />
  {/each} -->

  <!-- using the spread operator as long as props match the variable name-->
  {#each products as product}
    <Product
      {...product}
      on:add-to-cart={addToCart}
      on:delete={deleteProduct} />
  {/each}
</main>
