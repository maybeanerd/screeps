import { toSource, deleteSource } from "helper/helper.move";
const importantTargets = [STRUCTURE_CONTAINER, STRUCTURE_EXTENSION, STRUCTURE_ROAD];

function findImportantStructuresFirst(creep: Creep) {
  const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
    filter: (targ) => {
      console.log(targ);
      console.log("important?", importantTargets.findIndex((el) => el === targ.structureType) > -1);
      console.log("hitpoints:", targ.hits, "/", targ.hitsMax);
      console.log(
        "fulfills all criteria:",
        importantTargets.findIndex((el) => el === targ.structureType) > -1 && targ.hits < targ.hitsMax * 0.8
      );
      return importantTargets.findIndex((el) => el === targ.structureType) > -1 && targ.hits < targ.hitsMax * 0.8;
    }
  });
  console.log("rapair target halflife:", target);
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
    console.log("repair unimportant target halflife:", unimportantTarget);
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
    creep.say("🔄 harvest");
  }
  if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
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
      console.log("rapair target not fullife:", secondTarget);
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
    toSource(creep);
  }
}
