export const shipChooser = {
  getShipName: () => {
    const ships = [
      "Gros Mollo",
      "The Black Pearl",
      "Millenium Falcon",
      "The Bounty",
      "The Great Condor",
      "Goldorak",
    ];
    const index = Math.floor(Math.random() * ships.length);
    return ships[index];
  },
};
