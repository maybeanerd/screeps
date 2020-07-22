import { toSource, deleteSource, grabEnergyFromMiner } from "helper/helper.move";

export function run(creep: Creep) {
  if (creep.memory.working && creep.carry.energy == 0) {
    creep.memory.working = false;
    creep.say("🔄 fetch");
  }
  if (!creep.memory.working && creep.carry.energy >= creep.carryCapacity / 2) {
    deleteSource(creep);
    creep.memory.working = true;
    creep.say("⚡ deliver");
  }

  if (creep.memory.working) {
    let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return (
          (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER) &&
          structure.energy < structure.energyCapacity
        );
      }
    });
    if (!target) {
      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER
          );
        }
      });
    }
    if (target) {
      if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
          visualizePathStyle: {
            stroke: "#ffffff"
          }
        });
      }
    }
  } else {
    grabEnergyFromMiner(creep);
  }
}
