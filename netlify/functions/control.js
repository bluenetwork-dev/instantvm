// netlify/functions/control.js
const InstanceStore = require('./instanceStore');

exports.handler = async function(event) {
  const data = JSON.parse(event.body);
  let instance = InstanceStore.getInstance(data.session);

  if(data.shareCode){
    instance = InstanceStore.findByShareCode(data.shareCode);
    if(!instance) return { statusCode:404, body:JSON.stringify({ error:'Session not found'}) };
  }

  instance.users.push(data.user || 'guest');
  instance.queue.push(data);

  if(instance.queue.length===1) runQueue(instance);

  return { statusCode:200, body:JSON.stringify({ message:'Command queued'}) };
};

async function runQueue(instance){
  while(instance.queue.length>0){
    const cmd = instance.queue[0];
    const page = instance.page;

    try{
      switch(cmd.type){
        case 'goto': await page.goto(cmd.url); break;
        case 'click': await page.mouse.click(cmd.x, cmd.y); break;
        case 'type': await page.keyboard.type(cmd.text); break;
        case 'key': await page.keyboard.press(cmd.key); break;
        case 'open_app': require('./appLauncher').launchApp(instance.id, cmd.appName, cmd.command); break;
        case 'play_game': require('./appLauncher').launchGame(instance.id, cmd.gameName, cmd.mode); break;
      }
    } catch(e){ console.log(e); }

    instance.queue.shift();
  }
}
