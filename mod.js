const XLSX = require("xlsx");
const { Keyboard, InlineKeyboard } = require("grammy");

function TableInfo() {
  this.workbook = XLSX.readFile("data/myData.xlsx");
  this.worksheet = this.workbook.Sheets.Page1;
  this.numberToolsCell = this.worksheet.B2.v;
  this.allTools = this.worksheet.B1.v;

  this.restTools = function () {   
    return this.allTools - this.numberToolsCell;
  };

  this.getWriteToTable = function (toolsCount) {
    XLSX.utils.sheet_add_aoa(this.worksheet, [[toolsCount]], { origin: "B2" });
    XLSX.writeFile(this.workbook, "data/myData.xlsx");
  };

  this.dropCount = function () {
    XLSX.utils.sheet_add_aoa(this.worksheet, [[0]], { origin: "B2" });
    this.numberToolsCell = this.worksheet.B2.v;
  };

    this.setNumberTools = function(value){      
      this.numberToolsCell = value;
    }
}

function queryData(bot,toolsCount){
  bot.on('callback_query:data', async ctx=>{
    const chatID = ctx.update.callback_query.message.chat.id;
    const msgID = ctx.update.callback_query.message.message_id;
    let data = ctx.callbackQuery.data;
    let stickerToken = "CAACAgIAAxkBAAIK9GMINLdux4Ak-FvCdMgWzfhD120KAAJ2AANBqK4GssoUFC9GDaspBA";
  
    if (data === "countUp") {
      toolsCount++;
      bot.api.deleteMessage(chatID, msgID);
      ctx.reply(`Готово всего: ${toolsCount}`, { reply_markup: countKeyboard });
    } else if (data === "countDown") {
      toolsCount--;
      bot.api.deleteMessage(chatID, msgID);
      ctx.reply(`Готово всего: ${toolsCount}`, { reply_markup: countKeyboard });
    } else if (data === "getWriteToolsNumber") {
      bot.api.deleteMessage(chatID, msgID);
      tableInfo.getWriteToTable(toolsCount);
      bot.api.sendSticker(chatID, stickerToken);
      ctx.reply(`Готово всего: ${toolsCount}`, { reply_markup: countKeyboard });
    } else if (data === "dropCount") {
      ctx.reply("Чувак, ты уверен?", { reply_markup: dropCountMenu });
    } else if (data === "dropCountYeas") {
      bot.api.deleteMessage(chatID, msgID);
      tableInfo.dropCount();
      toolsCount = tableInfo.numberToolsCell;
      ctx.reply("Значение счетчика обнулено");
      ctx.reply(`Готово всего: ${toolsCount}`, { reply_markup: countKeyboard });
    } else if (data === "dropCountNope") {
      bot.api.deleteMessage(chatID, msgID);
    }
  })

  return toolsCount;
}

let tableInfo = new TableInfo();

const mainMenu = new Keyboard()
  .text("Cчетчик сделанных инструментов")
  .row()
  .text("Информация о работе 😈")
  .row()
  .resized();

const countKeyboard = new InlineKeyboard()
  .text("+", "countUp")
  .text("-", "countDown")
  .row()
  .text("Записать в таблицу", "getWriteToolsNumber")
  .row()
  .text("Обнулить", "dropCount");

const dropCountMenu = new InlineKeyboard()
  .text("Да, более чем", "dropCountYeas")
  .row()
  .text("Ну, чет как-то не очень", "dropCountNope");

module.exports = {
  tableInfo,
  mainMenu,
  countKeyboard,
  dropCountMenu,
  queryData
};
