const { normalizeURL, crawler } = require("./crawler.js")

async function readFromTerminal() {
    const input = process.argv

   if(input.length < 3 || input.length > 3) {
    console.log("solo son permitidos 3 parametros!")
   } else {
        const validatedURL = normalizeURL(input[2])

        if(validatedURL == "Invalid URL") {
          console.log("write a valid url")
        }else{
          await crawler(validatedURL)
        }
   }
}

readFromTerminal()