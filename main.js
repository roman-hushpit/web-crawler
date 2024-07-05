import { argv } from 'node:process';
import {crawlPage} from "./crawl.js";
import { printReport, sortPages } from './report.js';

async function main() {
    if (argv.length < 3) {
        console.log("No input parameter BASE_URL")
    }
    if (argv.length > 3) {
        console.log("Too much input parameters")
    }
    console.log(`Crawling web site: ${argv[2]}`)
    const result = await crawlPage(argv[2])
    printReport(sortPages(result))
}  

main()