import { deleteSource, grabEnergyFromMiner } from "helper/helper.move";
const importantTargets = [STRUCTURE_CONTAINER, STRUCTURE_EXTENSION, STRUCTURE_ROAD];

function toTarget(creep: Creep, trgt: any) {
  if (!creep.memory.targetSource) {
    const sources = creep.room.find(FIND_SOURCES);
    //const sourceindex = Math.floor(Math.random() * Math.floor(sources.length));
    // since id 0 has 3 slots, and id 1 has 1 slot, we will adjust the randomness accordingly
    let sourceindex = Math.floor(Math.random() * 4); // number between 0 and 3
    if (sourceindex > 1) {
      sourceindex = 0;
    }
    /* console.log(sourceindex); */
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

function deleteTarget(creep: Creep) {
  delete creep.memory.targetSource;
}

function findImportantStructuresFirst(creep: Creep) {
  const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (targ) => {
      /*   console.log(targ);
      console.log("important?", importantTargets.findIndex((el) => el === targ.structureType) > -1);
      console.log("hitpoints:", targ.hits, "/", targ.hitsMax);
      console.log(
        "fulfills all criteria:",
        importantTargets.findIndex((el) => el === targ.structureType) > -1 && targ.hits < targ.hitsMax * 0.8
      ); */
      return importantTargets.findIndex((el) => el === targ.structureType) > -1 && targ.hits < targ.hitsMax * 0.8;
    }
  });
  /* console.log("repair target halflife:", target); */
  if (target) {
    if (creep.repair(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {
        visualizePathStyle: {
          stroke: "#ffffff"
        }
      });
    }
    return target;
  } else {
    const unimportantTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (targ) => targ.hits < targ.hitsMax / 2
    });
    /*     console.log("repair unimportant target halflife:", unimportantTarget);*/

    if (unimportantTarget) {
      if (creep.repair(unimportantTarget) == ERR_NOT_IN_RANGE) {
        creep.moveTo(unimportantTarget, {
          visualizePathStyle: {
            stroke: "#ffffff"
          }
        });
      }
      return unimportantTarget;
    }
  }
  return null;
}

export function run(creep: Creep) {
  if (creep.memory.working && creep.carry.energy == 0) {
    creep.memory.working = false;
    creep.say("🔄 grab E-Girls");
  }
  if (!creep.memory.working && creep.carry.energy >= creep.carryCapacity / 2) {
    deleteSource(creep);
    creep.memory.working = true;
    creep.say("🛠 repair");
  }

  if (creep.memory.working) {
    const target = findImportantStructuresFirst(creep);
    if (!target) {
      const secondTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (targ) => targ.hits < targ.hitsMax
      });
      /*       console.log("repair target not fullife:", secondTarget); */
      if (secondTarget) {
        if (creep.repair(secondTarget) == ERR_NOT_IN_RANGE) {
          creep.moveTo(secondTarget, {
            visualizePathStyle: {
              stroke: "#ffffff"
            }
          });
        }
      }
    }
  } else {
    grabEnergyFromMiner(creep);
  }
}
