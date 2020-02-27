import App from "./App.svelte";
// import Header from './UI/Header.svelte';

const app = new App({
  // target: document.querySelector('#app')
  target: document.body
});

// const header = new Header({
// target:document.querySelector('#header');
// })

//this kind of mounting of components will not allow components talk to each other like it would in SPA, this is because they are mounted in the html page separately.

export default app;
