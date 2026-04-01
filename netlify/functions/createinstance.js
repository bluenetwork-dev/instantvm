// netlify/functions/createInstance.js
const puppeteer = require('puppeteer');
const { v4: uuidv4 } = require('uuid');
const InstanceStore = require('./instanceStore');

const supportedOS = ['Windows','Ubuntu','Debian','Fedora','Arch','Kali','PopOS','Manjaro','Android'];

exports.handler = async function(event) {
  const { osType } = JSON.parse(event.body);
  if(!supportedOS.includes(osType))
    return { statusCode:400, body:JSON.stringify({ error:'Unsupported OS' }) };

  const id = uuidv4();
  const shareCode = Math.random().toString(36).substring(2,8).toUpperCase();

  const browser = await puppeteer.launch({ headless:false });
  const page = await browser.newPage();

  const instance = {
    id,
    osType,
    browser,
    page,
    users: [],
    queue: [],
    shareCode,
    apps: [],
    cloudGames: []
  };

  InstanceStore.addInstance(instance);

  return { statusCode:200, body:JSON.stringify({ id, osType, shareCode }) };
};
