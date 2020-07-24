import { ErrorMapper } from "utils/ErrorMapper";

import { run as runFetcher } from "./creeps/role.fetcher";
import { run as runUpgrader } from "./creeps/role.upgrader";
import { run as runBuilder } from "./creeps/role.builder";
import { run as runRepairer } from "./creeps/role.repairer";
import { run as runMiner } from "./creeps/role.miner";

const roles = new Map([
  [
    "miner",
    {
      small: [WORK, CARRY, MOVE],
      medium: [WORK, WORK, WORK, WORK, CARRY, MOVE]
    }
  ],
  [
    "fetcher",
    {
      small: [CARRY, CARRY, MOVE, MOVE],
      medium: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    }
  ],
  [
    "upgrader",
    {
      small: [WORK, CARRY, MOVE],
      medium: [WORK, CARRY, CARRY, CARRY, CARRY, MOVE]
    }
  ],
  [
    "builder",
    {
      small: [WORK, CARRY, MOVE],
      medium: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]
    }
  ],
  [
    "repairer",
    {
      small: [WORK, CARRY, MOVE],
      medium: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE]
    }
  ]
]);

const rolesPrioritized: Array<{ name: string; count: number }> = [
  {
    name: "miner",
    count: 2
  },
  {
    name: "fetcher",
    count: 2
  },
  {
    name: "upgrader",
    count: 1
  },
  {
    name: "builder",
    count: 1
  },
  {
    name: "repairer",
    count: 1
  },
  {
    name: "miner",
    count: 4
  },
  {
    name: "fetcher", // TODO redo fetchers, we only need 2 at most! we could use two or more of these bodies for delivering to the energy reservoir though
    count: 4
  },
  {
    name: "upgrader",
    count: 3
  },
  {
    name: "builder",
    count: 2
  },
  {
    name: "repairer",
    count: 2
  },
  {
    name: "builder",
    count: 3
  }
];

const mainSpawner = "Spawn1";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // clear memory of dead creeps
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }
  const creepTypes = new Map<string, number>();
  Object.values(Game.creeps).forEach((creep) =>
    creepTypes.set(creep.memory.role, (creepTypes.get(creep.memory.role) || 0) + 1)
  );
  console.log("----------------------------------");
  creepTypes.forEach((count, name) => console.log(name, ": ", count));

  const spawning = Game.spawns[mainSpawner].spawning;
  if (!spawning) {
    for (let i = 0; i < rolesPrioritized.length; i++) {
      const role = rolesPrioritized[i];
      const bodies = roles.get(role.name);
      if (!bodies) {
        throw new Error("Trying to spawn creep role without body definition");
      }
      const creepswithrole = _.filter(Game.creeps, (creep) => creep.memory.role == role.name);
      if (creepswithrole.length < role.count) {
        const newName = role.name + " " + Game.time;
        const canSpawn = Game.spawns[mainSpawner].spawnCreep(bodies.medium, "medium " + newName, {
          memory: {
            role: role.name,
            working: false
          }
        });
        if (canSpawn === OK) {
          break;
        } else if (canSpawn === ERR_NOT_ENOUGH_ENERGY) {
          Game.spawns[mainSpawner].spawnCreep(bodies.small, "small " + newName, {
            memory: {
              role: role.name,
              working: false
            }
          });
          break;
        }
      }
    }
  } else {
    // tell us what you're spawning
    const spawningCreep = Game.creeps[spawning.name];
    /* console.log('🛠 Spawning ', spawningCreep.name); */
    Game.spawns[mainSpawner].room.visual.text(
      "🛠️" + spawningCreep.name,
      Game.spawns[mainSpawner].pos.x + 1,
      Game.spawns[mainSpawner].pos.y,
      {
        align: "left",
        opacity: 0.8
      }
    );
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === "fetcher") {
      runFetcher(creep);
    } else if (creep.memory.role === "upgrader") {
      runUpgrader(creep);
    } else if (creep.memory.role === "builder") {
      runBuilder(creep);
    } else if (creep.memory.role === "repairer") {
      runRepairer(creep);
    } else if (creep.memory.role === "miner") {
      runMiner(creep);
    }
  }
});
