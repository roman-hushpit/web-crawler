import { JSDOM } from 'jsdom'


function normalizeURL(inputUrl) {
    try {
        const newUrl = new URL(inputUrl);
        const pathname = newUrl.pathname.endsWith('/')  
        ? newUrl.pathname.substring(0, newUrl.pathname.length - 1) 
        :  newUrl.pathname;
        return newUrl.host + pathname
    } catch {
        console.log("Invalid url")
        return null
    }
}

function getURLsFromHTML(htmlBody, baseURL) {
   const { document } = (new JSDOM(htmlBody)).window;
   const linkElements = document.querySelectorAll('a');
   const result = []
   for (const anchor of linkElements) {
    if (anchor.hasAttribute('href')) {
      let href = anchor.getAttribute('href')

      try {
        // convert any relative URLs to absolute URLs
        href = new URL(href, baseURL).href
        result.push(href)
      } catch(err) {
        console.log(`${err.message}: ${href}`)
      }
    }
  }
  return result
}

async function fetchPage(url) {
    const result = await fetch(url)
    .then(result => {
        if (result.status > 400) {
            console.log("Bad request url, can not process");
            return null;
        }
        if (!result.headers.get("Content-Type").includes("text/html")) {
            console.log("Wrong type: " + result.headers.get("Content-Type"));
            return null;
        }
        
        return result.text();
    })
    .catch(error=> {
        console.log("Error: " + error);
    })
    return result;
}

async function crawlPage(baseURL, currentURL = baseURL , pages = {})  {
    if (!currentURL.includes(baseURL)) {
        console.log(`Not a current site ${currentURL}`);
        return pages;
    }

    const normalized =  normalizeURL(currentURL)
    if (normalized in pages) {
        pages[normalized]++
        return pages
    } else {
        pages[normalized] = 1
    } 
    const page =  await fetchPage(currentURL);
    
    const urls = getURLsFromHTML(page, baseURL)
    for (let index = 0; index <  urls.length; index++) {
        crawlPage(baseURL, urls[index], pages)
    }
    return pages;

}

export {normalizeURL, getURLsFromHTML, crawlPage};