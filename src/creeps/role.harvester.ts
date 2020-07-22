import { toSource, deleteSource } from "helper/helper.move";

export function run(creep: Creep) {
  if (creep.carry.energy < creep.carryCapacity) {
    toSource(creep);
  } else {
    deleteSource(creep);
    //let targets = creep.room.find(FIND_STRUCTURES, {
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
      //targets = creep.room.find(FIND_STRUCTURES, {
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
  }
}
