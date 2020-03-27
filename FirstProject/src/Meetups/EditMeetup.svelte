<script>
  import { createEventDispatcher } from "svelte";
  import TextInput from "../UI/TextInput.svelte";
  import Button from "../UI/Button.svelte";
  import Modal from "../UI/Modal.svelte";
  import { isEmpty, isEmail } from "../helpers/validation.js";

  let title = "";
  let subtitle = "";
  let description = "";
  let email = "";
  let address = "";
  let imageUrl = "";

  const dispatch = createEventDispatcher();

  $: titleValid = !isEmpty(title);
  $: subtitleValid = !isEmpty(subtitle);
  $: descriptionValid = !isEmpty(description);
  //$: emailValid = !isEmpty(email);
  $: addressValid = !isEmpty(address);
  $: imageUrlValid = !isEmpty(imageUrl);
  $: isValidEmail = isEmail(email);
  $: formIsValid =
    titleValid &&
    subtitleValid &&
    descriptionValid &&
    addressValid &&
    imageUrlValid;

  function submitForm() {
    dispatch("save", {
      title: title,
      subtitle: subtitle,
      description: description,
      email: email,
      address: address,
      imageUrl: imageUrl
    });
  }

  function cancel() {
    dispatch("cancel");
  }
</script>

<style>
  form {
    width: 100%;
  }
</style>

<main>
  <Modal title="Edit Meetup" on:cancel>
    <form on:submit|preventDefault={submitForm}>
      <TextInput
        id="title"
        label="title"
        valid={titleValid}
        errorMessage="please enter a valid title"
        value={title}
        on:input={event => (title = event.target.value)} />
      <TextInput
        id="subtitle"
        label="subtitle"
        valid={subtitleValid}
        errorMessage="please enter a valid subtitle"
        value={subtitle}
        on:input={event => (subtitle = event.target.value)} />
      <TextInput
        id="address"
        label="address"
        valid={addressValid}
        errorMessage="please enter a valid address"
        value={address}
        on:input={event => (address = event.target.value)} />
      <TextInput
        id="imageUrl"
        label="imageUrl"
        valid={imageUrlValid}
        errorMessage="please enter a valid link"
        value={imageUrl}
        on:input={event => (imageUrl = event.target.value)} />
      <TextInput
        id="email"
        label="email"
        type="email"
        valid={isValidEmail}
        errorMessage="please enter a valid email"
        value={email}
        on:input={event => (email = event.target.value)} />
      <TextInput
        id="description"
        label="description"
        controlType="textarea"
        bind:value={description}
        on:input={event => (description = event.target.value)} />
    </form>
    <div slot="footer">
      <Button type="button" mode="outline" on:click={cancel}>Cancel</Button>
      <Button
        type="button"
        newclass="save"
        on:click={submitForm}
        disabled={!formIsValid}>
        Save
      </Button>
    </div>
  </Modal>
</main>
