export function toSource(creep: Creep) {
  if (!creep.memory.targetSource) {
    const sources = creep.room.find(FIND_SOURCES);
    //const sourceindex = Math.floor(Math.random() * Math.floor(sources.length));
    // since id 0 has 3 slots, and id 1 has 1 slot, we will adjust the randomness accordingly
    let sourceindex = Math.floor(Math.random() * 4); // number between 0 and 3
    if (sourceindex > 1) {
      sourceindex = 0;
    }
    console.log(sourceindex);
    creep.memory.targetSource = sources[sourceindex /* 0 */].id;
    /* const targetSource = creep.pos.findClosestByPath(FIND_SOURCES);
            creep.memory.targetSource = targetSource; */
  }
  const target = Game.getObjectById(creep.memory.targetSource /*.id*/);
  if (target && creep.harvest(target) == ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {
      visualizePathStyle: {
        stroke: "#ffaa00"
      }
    });
  }
}

export function deleteSource(creep: Creep) {
  delete creep.memory.targetSource;
}

export function grabEnergyFromMiner(creep: Creep) {
  const potentialTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_CONTAINER && structure.store.energy >= creep.carryCapacity;
    }
  });
  /* console.log("fetcher potential target", potentialTarget); */
  if (potentialTarget && creep.withdraw(potentialTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
    creep.moveTo(potentialTarget, {
      visualizePathStyle: {
        stroke: "#ffffff"
      }
    });
    return true;
  }
  const secondaryTarget = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
    filter: (res) => {
      return res.resourceType == RESOURCE_ENERGY;
    }
  });
  if (secondaryTarget && creep.pickup(secondaryTarget) == ERR_NOT_IN_RANGE) {
    creep.moveTo(secondaryTarget, {
      visualizePathStyle: {
        stroke: "#ffffff"
      }
    });
    return true;
  }
  return false;
}
