<script>
  import Product from "./Product.svelte";
  import Modal from "./Modal.svelte";

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

  let showModal = false;

  let closeable = false;
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

  <button
    on:click={event => {
      showModal = true;
    }}>
    Show Modal
  </button>

  {#if showModal}
    <Modal
      on:close={() => {
        showModal = false;
      }}
      on:cancel={() => {
        showModal = false;
      }}
      let:didAgree={closeable}>
      <h1 slot="header">hello there</h1>
      <p>this works</p>

      <!-- use on:click because it is a button type -->
      <button
        slot="footer"
        on:click={() => {
          showModal = false;
        }}
        disabled={!closeable}
        type="button">
        Confirm
      </button>
    </Modal>
  {/if}

</main>
