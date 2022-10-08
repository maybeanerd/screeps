export function run(creep: Creep) {
  if (!creep.memory.targetSource) {
    const sources = creep.room.find(FIND_SOURCES);
    //const sourceindex = Math.floor(Math.random() * Math.floor(sources.length));
    // since id 0 has 3 slots, and id 1 has 1 slot, we will adjust the randomness accordingly
    let sourceindex = Math.floor(Math.random() * 4); // number between 0 and 3
    if (sourceindex > 1) {
      sourceindex = 0;
    }
    console.log(sourceindex);
    creep.memory.targetSource = sources[sourceindex].id;
  }

  if (creep.store[RESOURCE_ENERGY] === creep.store.getCapacity(RESOURCE_ENERGY)) {
    console.log("attempting to store...");
    const [container] = creep.pos.findInRange(FIND_STRUCTURES, 1, {
      filter: (struct) =>
        struct.structureType === STRUCTURE_CONTAINER && struct.store.getFreeCapacity(RESOURCE_ENERGY) > 0
    });
    if (container) {
      console.log("found container...");
      const transferPossible = creep.transfer(container, RESOURCE_ENERGY);
      if (transferPossible !== OK) {
        console.log("failed to put into container...");
      }
    } else {
      console.log("did not find container...");
    }
  }
  const target = Game.getObjectById(creep.memory.targetSource);
  if (target && creep.harvest(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: {
        stroke: "#ffaa00"
      }
    });
  }
}
