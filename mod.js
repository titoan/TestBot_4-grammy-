const XLSX = require("xlsx");

function TableInfo(){    
        this.workbook = XLSX.readFile("data/myData.xlsx");
        this.worksheet = this.workbook.Sheets.Page1;  
        this.numberToolsCell = this.worksheet.B2.v;
        this.allTools = this.worksheet.B1.v;

        this.restTools = function(){
            return this.allTools - this.numberToolsCell
        }

        this.getWriteToTable = function(toolsCount){
            XLSX.utils.sheet_add_aoa(this.worksheet, [[toolsCount]], { origin: "B2" });
            XLSX.writeFile(this.workbook, "data/myData.xlsx");
        }

        this.dropCount = function(){
            XLSX.utils.sheet_add_aoa(this.worksheet, [[0]], { origin: "B2" });
            this.numberToolsCell = this.worksheet.B2.v;
        }
}

let tableInfo = new TableInfo()
module.exports = tableInfo;