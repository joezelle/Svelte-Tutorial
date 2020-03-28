import { writable } from "svelte/store";

const meetups = writable([
  {
    id: "meet1",
    title: "Coding Bootcamp",
    subtitle: "Learn to code in 30 Minutes",
    description: "In this meetup, we will have some experts that teach",
    imageUrl:
      "https://elevenfifty.org/wp-content/uploads/2017/04/Coding-Bootcamp-1-880x499.jpg",
    address: "27the Nerd Road,  32523 New York",
    contactEmail: "testing-testing@eamail.com",
    isFavorite: false
  },
  {
    id: "meet2",
    title: "Boys Night Out",
    subtitle: "Boys Stepping Out",
    description: "Time for the real Gees to have some good time, bro-bonding",
    imageUrl:
      "https://www.partner-kz.com/wp-content/uploads/2019/01/Great-Boys%E2%80%99-Night-Out.jpg",
    address: "1020 ParkEast Road,  32523 Las Vegas",
    contactEmail: "testing@eamail.com",
    isFavorite: false
  },
  {
    id: "meet3",
    title: "Double Date",
    subtitle: "First of its Kind",
    description: "Its time for that double date amongs the lovers",
    imageUrl:
      "https://www.liberaldictionary.com/wp-content/uploads/2018/12/double-date.jpg",
    address: "2234 Starklet Road,  32523 Los Angeles",
    contactEmail: "testing-testing@eamail.com",
    isFavorite: false
  }
]);

const customMeetUpStore = {
  subscribe: meetups.subscribe,
  addMeetup: meetupData => {
    const newMeetup = {
      ...meetupData,
      id: Math.random().toString(),
      isFavorite: false
    };
    meetups.update(items => {
      return [newMeetup, ...items];
    });
  },
  updateMeetup: (id, meetupData) => {
    meetups.update(items => {
      const meetupIndex = items.findIndex(i => i.id === id);
      const updatedMeetup = { ...items[meetupIndex], ...meetupData };
      const updatedMeetups = [...items];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  },
  removeMeetup: id => {
    meetups.update(items => {
      return items.filter(i => i.id !== id);
    });
  },
  toggleFavorite: id => {
    meetups.update(items => {
      const updatedMeetup = { ...items.find(m => m.id === id) };
      updatedMeetup.isFavorite = !updatedMeetup.isFavorite;
      const meetupIndex = items.findIndex(m => m.id === id);
      const updatedMeetups = [...items];
      updatedMeetups[meetupIndex] = updatedMeetup;
      return updatedMeetups;
    });
  }
};

export default customMeetUpStore;
