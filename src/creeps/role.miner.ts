import { toSource } from "helper/helper.move";

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
  /*   if (creep.store[RESOURCE_ENERGY] === creep.store.getCapacity(RESOURCE_ENERGY)){
    // TODO put into storage
  } */
  const target = Game.getObjectById(creep.memory.targetSource);
  if (target && creep.harvest(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: {
        stroke: "#ffaa00"
      }
    });
  }
}