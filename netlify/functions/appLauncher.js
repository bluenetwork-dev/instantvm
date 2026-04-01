// netlify/functions/appLauncher.js
const { exec } = require('child_process');
const InstanceStore = require('./instanceStore');

const gamesLibrary = [
  { name:'Roblox', command:'start roblox' },
  { name:'Minecraft', command:'start minecraft' },
  { name:'CS:GO', command:'start csgo' },
  { name:'Fortnite', command:'start fortnite' },
  { name:'Stardew Valley', command:'start stardew' },
  { name:'Steam', command:'start steam' },
  { name:'Web Game', command:'start chrome https://examplegame.com' }
];

module.exports = {
  launchApp: (sessionId, appName, command) => {
    const instance = InstanceStore.getInstance(sessionId);
    if(!instance) return { error:'Instance not found' };
    exec(command);
    instance.apps.push(appName);
    return { success:true, appName };
  },
  launchGame: (sessionId, gameName, mode='desktop') => {
    const instance = InstanceStore.getInstance(sessionId);
    if(!instance) return { error:'Instance not found' };
    const game = gamesLibrary.find(g => g.name === gameName);
    if(!game) return { error:'Game not found' };
    exec(game.command);
    instance.cloudGames.push({ gameName, mode });
    return { success:true, gameName, mode };
  },
  listGames: () => gamesLibrary.map(g => g.name)
};
