const { normalizeURL, crawler, dontBeFunny } = require("./crawler.js")

async function readFromTerminal() {
    const input = process.argv

   if(input.length < 3 || input.length > 3) {
    console.log("solo son permitidos 3 parametros!")
   } else {
        const validatedURL = normalizeURL(input[2])

        if(!validatedURL) {
          console.log("write a valid url")
        }else if(dontBeFunny(validatedURL)) {
          console.log("dont be funny...")
        }else{
         const report = await crawler(validatedURL, validatedURL, {})

         console.log(report)
        }
   }
}

readFromTerminal()