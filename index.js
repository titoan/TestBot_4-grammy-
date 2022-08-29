const { Bot } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
require('dotenv').config();
let {tableInfo, mainMenu, countKeyboard, dropCountMenu, queryData} = require('./mod');

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);


const allTools = tableInfo.allTools;
let toolsCount = tableInfo.numberToolsCell;

bot.command("start", async (ctx) => { 
  await ctx.reply("Здоров, чувак, выбирай опцию:", { reply_markup: mainMenu});
});

bot.hears("Cчетчик сделанных инструментов", ctx =>{
  ctx.reply(`Готово всего: ${toolsCount}`, {reply_markup: countKeyboard})
})

toolsCount = queryData(bot, toolsCount);

bot.hears("Информация о работе 😈", async ctx=>{
  // tableInfo.setNumberTools(toolsCount);
  ctx.reply(`<b>Надо сделать всего</b>: ${allTools}
  -------------------------------------
  <b>Сделано</b>: ${toolsCount}
  -------------------------------------
  <b>Осталось</b>: ${tableInfo.restTools()}`,{ parse_mode: "HTML" })
})

bot.start();