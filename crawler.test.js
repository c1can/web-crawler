const { test, expect } = require("@jest/globals")
const { normalizeURL, getAnchors } = require("./crawler.js")


test("normalizeURL remove protocol", () => {
    expect(normalizeURL("https://example.com/pathname")).toEqual("example.com/pathname")
})

test("normalizeURL remove last slash", () => {
    expect(normalizeURL("https://example.com/pathname/")).toEqual("example.com/pathname")
})

test("push anchors to array" , () => {
    
    const htmlBody = `
    <html>
        <body>
            <a href="https://domain.com/pagos">
                Pagos
            </a>
            <a href="https://domain.com/referrals">
                Referidos
            </a> 
        </body>
    </html>
    `
    const pageURL = "https://domain.com"
    expect(getAnchors(htmlBody, pageURL)).toEqual(["https://domain.com/pagos","https://domain.com/referrals"])
})

test("convert relative to absolute path", () => {
    const htmlBody = `
    <html>
        <body>
            <a href="/pagos">
                Pagos
            </a>
            <a href="https://domain.com/referrals">
                Referidos
            </a> 
        </body>
    </html>
    `
    const pageURL = "https://domain.com"

    expect(getAnchors(htmlBody, pageURL)).toEqual(["https://domain.com/pagos", "https://domain.com/referrals"])

})

test("prevent push when invalid url", () => {
    const htmlBody = `
    <html>
        <body>
            <a href="invalid">
                Pagos
            </a>
        </body>
    </html>
    `
    const pageURL = "https://domain.com"

    expect(getAnchors(htmlBody, pageURL)).toEqual([])

})