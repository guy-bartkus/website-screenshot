const puppeteer = require('puppeteer');
const sanitize = require("sanitize-filename");
const {appendFileSync, existsSync, mkdirSync} = require('fs');
const config = require('./config');
const {getLines} = require('./lineReader');

if(config.saveFormat !== ('png' || 'pdf')) {
    console.error("ERROR: Save format should either be png of pdf!");
    process.exit(1);
}

if(!existsSync(config.screenshotPath)) mkdirSync(config.screenshotPath, {recursive: true});

const links = getLines("./links.txt");

let finished = 0;
let curLink = 0;

(async () => {
    const browser = await puppeteer.launch({defaultViewport: {width: config.width, height: 1080}});

    const loadInterval = setInterval(() => {
        const url = links[curLink++];

        if(curLink >= links.length) clearInterval(loadInterval);

        loadPage(browser, url, curLink).catch(err => {
            if(config.consoleLogFails) console.error(err);
            if(config.fileLogFails) appendFail(url);
        }).finally(async () => {
            finished++;
        
            if(finished >= links.length) {
                await browser.close();
        
                console.log("Done!");
            }
        });
    }, config.pageLoadInterval);
})();

async function loadPage(browser, url, index) {
    const page = await browser.newPage();

    const res = await page.goto(url, {waitUntil: 'networkidle0'});
    const status = res.status();

    if(config.httpCodeWhitelist.indexOf(status) < 0) throw new Error(`Page status code (${status}) is not in whitelist for link #${index} (${url})!`);

    const title = sanitize(await page.title());

    if(config.saveFormat === 'png') await page.screenshot({path: `${config.screenshotPath}/${title}.png`, fullPage: true});
    if(config.saveFormat === 'pdf') await page.pdf({
        path: `${config.screenshotPath}/${title}.pdf`,
        displayHeaderFooter: true,
        headerTemplate: '',
        footerTemplate: '',
        printBackground: true,
        format: 'A4'
    });

    if(config.consoleLogSuccess) console.log(`Successfully saved ${title}.${config.saveFormat}`);

    await page.close();
}

function appendFail(url) {
    appendFileSync("./fails.txt", `${url}\n`);
}