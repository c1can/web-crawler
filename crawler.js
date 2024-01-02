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

async function crawler(validatedURL) {
    const urlWithProtocol = `https://${validatedURL}` 

    try {
        console.log("starting crawl...")
        const response = await fetch(urlWithProtocol)

        //check content type to be just html
        const contentType = response.headers.get("content-type")

        if(!contentType.includes("text/html")) {
            console.log("failed to crawl...")
            console.log("provide an url for a html page!")
            return
        }
        const htmlResponse = await response.text()

        const anchorsArray = getAnchors(htmlResponse, urlWithProtocol)

        //anchors = ["url", etc....]
        console.log(anchorsArray)

        for(const anchor of anchorsArray) {
            console.log(anchor)
        }

    } catch (error) {
        console.log("failed to crawl...")
        console.log(`agrega un dominio existente!`, error.message)
    }


}

function normalizeURL(url) {

    try {
        const urlObj = new URL(url)
        const { hostname, pathname } = urlObj
        const hostpath = `${hostname}${pathname}`
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