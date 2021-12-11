
const link = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
// const chalk = require("chalk");
const request= require("request");
const cheerio = require("cheerio");
const gamObj = require("./allMatchs.js");
const fs= require("fs");
const path = require("path");
const { dirname } = require("path");

const filePath= path.join(__dirname, "ipl");
dirCreater(filePath);

request(link , cb);

function cb(error, response, html)
{
    if(error)
    {
        console.log(error);
    }
    else
    {
        let $= cheerio.load(html) ;
        let link= $('a[data-hover="View All Results"]');
        link = $(link).attr("href");
        let fullLink = "https://www.espncricinfo.com" + link ;
        // console.log(fullLink);
        gamObj.gam(fullLink);
    }

}

function dirCreater(filePath)
{    
    if(fs.existsSync(filePath)== false)
        fs.mkdirSync(filePath);
    
}
