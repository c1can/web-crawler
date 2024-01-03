const jsdom = require("jsdom")

const { JSDOM } = jsdom


function getAnchors(htmlBody, baseURL) {
    let anchors = []

    const dom = new JSDOM(htmlBody)

    const selectedAnchors = dom.window.document.querySelectorAll("a")
    
    selectedAnchors.forEach(anchor => {

        if(anchor.href[0] == "/") { //check for relative path
            anchors.push(`${baseURL}${anchor.href}`)
        }else {
            try {
                const urlObj = new URL(anchor.href)
                anchors.push(urlObj.href)
            } catch (error) {
                console.log(error.message)       
            }
        }
    })
  
    return anchors
}

//crawler(baseURL, currentURL, pages)

async function crawler(validatedURL, currentURL, pages) {
    const baseURL = validatedURL 
    const baseURLObject = new URL(baseURL)
    const baseHostname = baseURLObject.hostname


    const validatedCurrentURL = normalizeURL(currentURL)

    console.log(baseURL)
    console.log(validatedCurrentURL)

    
    if(validatedCurrentURL == "Invalid URL") {
        return pages
    }

    const currentURLObject = new URL(validatedCurrentURL)
    const currentHostname = currentURLObject.hostname

    //comparar el hostname de la base con el current
    if(baseHostname !== currentHostname) {
        return pages
    }

    //ver si la currentURLWithProtocol ya fue fetcheada
    if(pages[validatedCurrentURL] > 0) {
        pages[validatedCurrentURL]++
        return pages
    }
        pages[validatedCurrentURL] = 1

    try {
        console.log("starting crawl...")
        const response = await fetch(validatedCurrentURL)

        //check content type to be just html
        const contentType = response.headers.get("content-type")

        if(!contentType.includes("text/html")) {
            console.log("failed to crawl...")
            console.log("provide an url for a html page!")
            return pages
        }
        const htmlResponse = await response.text()

        const anchorsArray = getAnchors(htmlResponse, baseURL)

        for(const anchor of anchorsArray) {
            console.log(anchor)
            pages = await crawler(baseURL, anchor, pages)
        }

    } catch (error) {
        console.log("failed to crawl...")
        console.log(`agrega un dominio existente!`, error.message)
    }
    
    return pages

}

//valida si URL es legitima, valida si termina con "/" se lo quita.
function normalizeURL(url) {

    try {
        const urlObj = new URL(url)
        const { hostname, pathname, protocol } = urlObj
        const hostpath = `${protocol}${hostname}${pathname}`
        if(hostpath.length > 0 && hostpath.slice(-1) == '/') {
            return hostpath.slice(0, -1)
        }
        return hostpath
    } catch (error) {
        return error.message
    }
}


module.exports = {
    normalizeURL, 
    getAnchors,
    crawler
}