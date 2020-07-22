export function toSource(creep: Creep) {
  if (!creep.memory.targetSource) {
    const sources = creep.room.find(FIND_SOURCES);
    const sourceindex = Math.floor(Math.random() * Math.floor(sources.length));
    /*     console.log(sourceindex); */
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
