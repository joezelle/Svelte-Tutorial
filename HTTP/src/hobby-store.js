import { writable } from "svelte/store";

const hobbies = writable([]);

const customStore = {
  subscribe: hobbies.subscribe,
  setHobbies: items => {
    hobbies.set(items);
  },
  addhobby: hobby => {
    hobbies.update(items => {
      return items.concat(hobby);
    });
  }
};

export default customStore;
