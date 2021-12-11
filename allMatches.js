
const request= require("request");
const cheerio = require("cheerio");
const gscObj= require("./scoreCard.js")
// const chalk = require("chalk");
function getAllMatchInfo(url)
{
    request(url, cb);
    function cb(error, response , html){

        let $ = cheerio.load(html);
        let allMatchElement= $('a[data-hover="Scorecard"]');
        
        for(let i=0; i< allMatchElement.length;i++)
        {
            let link = $(allMatchElement[i]).attr('href');
            let fullLink = "https://www.espncricinfo.com" + link ;
            // console.log(fullLink );
            gscObj.gsc(fullLink);
            

        }
    }
}


module.exports = 
{
    gam : getAllMatchInfo
}
