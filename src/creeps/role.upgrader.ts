import { toSource, deleteSource } from "helper/helper.move";

export function run(creep: Creep) {
  if (creep.memory.working && creep.carry.energy == 0) {
    creep.memory.working = false;
    creep.say("🔄 harvest");
  }
  if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
    deleteSource(creep);
    creep.memory.working = true;
    creep.say("⚡ upgrade");
  }

  if (creep.memory.working) {
    if (creep.room.controller && creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller, {
        visualizePathStyle: {
          stroke: "#ffffff"
        }
      });
    }
  } else {
    toSource(creep);
  }
}
