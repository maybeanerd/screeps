import { deleteSource, grabEnergyFromMiner } from "helper/helper.move";

export function run(creep: Creep) {
  if (creep.memory.working && creep.store.energy == 0) {
    creep.memory.working = false;
    creep.say("🔄 grab E-Girls");
  }
  if (!creep.memory.working && creep.store.energy >= creep.store.getCapacity() / 2) {
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
    grabEnergyFromMiner(creep);
  }
}
