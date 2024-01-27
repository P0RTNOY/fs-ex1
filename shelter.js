// shelter.js
const shelters = [];
let eventEmitter;

function registerShelterEvent(emitter) {
  eventEmitter = emitter;
}

function getAllShelters() {
  return shelters;
}

function addShelter(newShelter) {
  shelters.push(newShelter);
  return newShelter;
}

function editShelter(shelterId, updatedShelter) {
  const index = shelters.findIndex(shelter => shelter.id === shelterId);
  if (index !== -1) {
    shelters[index] = { ...shelters[index], ...updatedShelter };
    return shelters[index];
  }
  return null;
}

function deleteShelter(shelterId) {
  const index = shelters.findIndex(shelter => shelter.id === shelterId);
  if (index !== -1) {
    shelters.splice(index, 1);
    console.log("Shelter has been deleted");
    return true; 
  }
  return false; //
}

module.exports = {
  registerShelterEvent,
  getAllShelters,
  addShelter,
  editShelter,
  deleteShelter,
};
