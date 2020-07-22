import { ErrorMapper } from "utils/ErrorMapper";

import { run as runFetcher } from "./creeps/role.fetcher";
import { run as runUpgrader } from "./creeps/role.upgrader";
import { run as runBuilder } from "./creeps/role.builder";
import { run as runRepairer } from "./creeps/role.repairer";
import { run as runMiner } from "./creeps/role.miner";

const roles = [
  {
    name: "miner",
    startcount: 2,
    startbody: [WORK, CARRY, MOVE],
    body: [WORK, WORK, WORK, WORK, CARRY, MOVE],
    count: 2
  },
  {
    name: "fetcher",
    startcount: 1,
    startbody: [CARRY, CARRY, MOVE, MOVE],
    body: [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    count: 2
  },
  {
    name: "upgrader",
    startcount: 1,
    startbody: [WORK, CARRY, MOVE],
    body: [WORK, CARRY, CARRY, CARRY, CARRY, MOVE],
    count: 1
  },
  {
    name: "builder",
    startcount: 1,
    startbody: [WORK, CARRY, MOVE],
    body: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
    count: 1
  },
  {
    name: "repairer",
    startcount: 1,
    startbody: [WORK, CARRY, MOVE],
    body: [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE],
    count: 1
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
  let minerMaxed = false;
  const spawning = Game.spawns[mainSpawner].spawning;
  if (!spawning) {
    // make sure we always have the minimum amount of screeps
    for (const roleid in roles) {
      const role = roles[roleid];
      const creepswithrole = _.filter(Game.creeps, (creep) => creep.memory.role == role.name);
      if (creepswithrole.length < role.startcount + role.count) {
        const newName = role.name + " " + Game.time;
        const canSpawn = !minerMaxed
          ? null
          : Game.spawns[mainSpawner].spawnCreep(role.body, "big " + newName, {
              memory: {
                role: role.name,
                working: false
              }
            });
        if (canSpawn === OK) {
          break;
        } else if (creepswithrole.length < role.startcount) {
          Game.spawns[mainSpawner].spawnCreep(role.startbody, "small " + newName, {
            memory: {
              role: role.name,
              working: false
            }
          });
          break;
        }
        if (role.name === "miner" && creepswithrole.length < role.startcount + role.count) {
          minerMaxed = false;
        } else {
          minerMaxed = true;
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
