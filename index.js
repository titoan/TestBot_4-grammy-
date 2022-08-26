const { Bot, Keyboard, InlineKeyboard } = require("grammy");
const { Menu, MenuRange } = require("@grammyjs/menu");
require('dotenv').config();
let tableInfo = require('./mod');

const token = process.env.BOT_TOKEN;
const bot = new Bot(token);

let numberToolsCell = tableInfo.numberToolsCell;
const allTools = tableInfo.allTools;
let toolsCount = numberToolsCell;


const mainMenu = new Keyboard()
  .text("Cчетчик сделанных инструментов").row()
  .text("Информация о работе 😈").row()
  .resized();

const countKeyboard = new InlineKeyboard()
  .text("+", "countUp").text("-", "countDown").row()
  .text("Записать в таблицу", "getWriteToolsNumber").row()
  .text("Обнулить", "dropCount")

const dropCountMenu = new InlineKeyboard()
.text("Да, более чем", "dropCountYeas").row()
.text("Ну, чет как-то не очень", "dropCountNope")

bot.command("start", async (ctx) => { 
  await ctx.reply("Здоров, чувак, выбирай опцию:", { reply_markup: mainMenu});
});

bot.hears("Cчетчик сделанных инструментов", ctx =>{
  ctx.reply(`Готово всего: ${toolsCount}`, {reply_markup: countKeyboard})
})

bot.hears("Информация о работе 😈", async ctx=>{  
  ctx.reply(`<b>Надо сделать всего</b>: ${allTools}
  -------------------------------------
  <b>Сделано</b>: ${toolsCount}
  -------------------------------------
  <b>Осталось</b>: ${tableInfo.restTools()}`,{ parse_mode: "HTML" })
})

bot.on('callback_query:data', async ctx=>{
  const chatID = ctx.update.callback_query.message.chat.id;
  const msgID = ctx.update.callback_query.message.message_id;
  let data = ctx.callbackQuery.data;
  let stickerToken = "CAACAgIAAxkBAAIK9GMINLdux4Ak-FvCdMgWzfhD120KAAJ2AANBqK4GssoUFC9GDaspBA";

  if(data === "countUp"){
    toolsCount++;
    bot.api.deleteMessage(chatID, msgID);
    await ctx.reply(`Готово всего: ${toolsCount}`, {reply_markup: countKeyboard});
  }else if(data === "countDown"){
    toolsCount--;
    bot.api.deleteMessage(chatID, msgID);
    await ctx.reply(`Готово всего: ${toolsCount}`, {reply_markup: countKeyboard});
  }else if(data === "getWriteToolsNumber"){
    bot.api.deleteMessage(chatID, msgID);
    tableInfo.getWriteToTable(toolsCount);
    await bot.api.sendSticker(chatID, stickerToken)
    await ctx.reply(`Готово всего: ${toolsCount}`, {reply_markup: countKeyboard});    
  }else if(data ==="dropCount"){
    ctx.reply("Чувак, ты уверен?",{reply_markup: dropCountMenu})
  }else if(data ==="dropCountYeas"){
    bot.api.deleteMessage(chatID, msgID);
    tableInfo.dropCount();
    toolsCount = tableInfo.numberToolsCell;
    ctx.reply("Значение счетчика обнулено");
    ctx.reply(`Готово всего: ${toolsCount}`, {reply_markup: countKeyboard})
  }else if(data ==="dropCountNope"){
    bot.api.deleteMessage(chatID, msgID);
  }
})

bot.start();