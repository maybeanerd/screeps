import { deleteSource, grabEnergyFromMiner } from "helper/helper.move";

const priorities: Array<BuildableStructureConstant> = [STRUCTURE_CONTAINER, STRUCTURE_EXTENSION, STRUCTURE_ROAD];

export function run(creep: Creep) {
  if (creep.memory.working && creep.store.energy == 0) {
    creep.memory.working = false;
    creep.say("🔄 grab E-Girls");
  }
  if (!creep.memory.working && creep.store.energy >= creep.store.getCapacity() / 2) {
    deleteSource(creep);
    creep.memory.working = true;
    creep.say("🚧 build");
  }

  if (creep.memory.working) {
    let target: ConstructionSite<BuildableStructureConstant> | null = null;
    priorities.forEach((priority) => {
      if (!target) {
        target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
          filter: (site) => priority === site.structureType
        });
      }
    });
    if (!target) {
      target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    }
    if (target) {
      if (creep.build(target) == ERR_NOT_IN_RANGE) {
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
