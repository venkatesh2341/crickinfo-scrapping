// const link = "https://www.espncricinfo.com/series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";

const request= require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const path= require("path");
const xlsx= require("xlsx");
const { connect } = require("http2");
const { contents } = require("cheerio/lib/api/traversing");

function getScoreCard(link)
{
request(link , cb);

function cb(error, response, html)
{
    if(error)
    {
        console.log(error);
        return ;
    }
    else
    {
        let $= cheerio.load(html);
        // venue, data , result
        let topElement = $(".header-info .description");
        let content = $(topElement).text();
        let contentArr= content.split(",");
        let venue= contentArr[1].trim();
        let date= contentArr[2].trim();

        let resElement = $(".event .status-text");
        let result= $(resElement).text().trim();
        // console.log("//////////////////////////////////////////////////////////////////////////////////////");
        // console.log(venue, date, result);
        // console.log();
        // console.log();

        // teamname opponent 
        let innings = $(".card.content-block.match-scorecard-table>.Collapsible");
        // let tinyHtml= "";
        for(let i=0; i< innings.length;i++)
        {
            // tinyHtml+= $(innings[i]).html();
            let teamName= $(innings[i]).find(".header-title.label").text();
            teamName= teamName.split("INNINGS")[0].trim();
            // console.log(teamName);

            let ind= (i==0)?1:0;

            let opponentTeamName= $(innings[ind]).find(".header-title.label").text();
            opponentTeamName = opponentTeamName.split("INNINGS")[0].trim();
            // console.log(`${teamName} V/S ${opponentTeamName}`) ;
            // console.log();
                 
            let curInning = $(innings[i]);
            let allRows = $(curInning).find(".table.batsman tbody tr");
            
            // console.log("Name       runs       balls     fours    sixes   runrate");
            for(let j=0; j < allRows.length ;j++)
            {
                let allCols= $(allRows[j]).find("td");
                let isValid = $(allCols[0]).hasClass("batsman-cell");
                if(isValid == true)
                {
                    let playerName = $(allCols[0]).text().trim();
                    let runs       = $(allCols[2]).text().trim();
                    let balls      = $(allCols[3]).text().trim();
                    let fours      = $(allCols[5]).text().trim();
                    let sixes      = $(allCols[6]).text().trim();
                    let strikeRate = $(allCols[7]).text().trim();
                    // console.log(`${playerName}    ${runs}     ${balls}    ${fours}    ${sixes}    ${strikeRate}`);
                    processPlayer(teamName, playerName, runs, balls, fours, sixes, strikeRate, opponentTeamName,venue, date, result);
                }
                
               
            }
            // console.log();
        }
        //console.log("///////////////////////////////////////////////////////////////////////////////////////");
        
    }
}
}

function processPlayer(teamName, playerName, runs, balls, fours, sixes, strikeRate, opponentTeamName,venue,date ,result)
{
    let teamPath= path.join(__dirname, "ipl", teamName);
    dirCreater(teamPath);
    let filePath= path.join(teamPath, playerName+ ".xlsx");

    let content= excelReader(filePath, playerName);
    let playerObj= {
        teamName,
        playerName,
        runs,
        balls,
        fours,
        sixes,
        strikeRate,
        opponentTeamName,
        venue,
        result,
        date
         
    }
    content.push(playerObj);
    excelWriter(filePath, content, playerName);
}




function excelWriter(filePath, json, sheetName)
{
    let book = xlsx.utils.book_new();
    let sheet = xlsx.utils.json_to_sheet(json);
    xlsx.utils.book_append_sheet(book, sheet, sheetName);
    xlsx.writeFile(book, filePath);

}

function excelReader(filePath, sheetName)
{ 
    if(fs.existsSync(filePath) == false )
    {
        return [];
    }
    
    let rbook = xlsx.readFile(filePath);
    let rsheet= rbook.Sheets[sheetName] ;
    let rdata = xlsx.utils.sheet_to_json(rsheet);
    return rdata;
}

function dirCreater(filePath)
{
    if(fs.existsSync(filePath)== false)
    {
        fs.mkdirSync(filePath);
    }
 
}

module.exports = 
{
    gsc: getScoreCard
}
