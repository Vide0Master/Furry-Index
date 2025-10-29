const globalVariables = require("./globalVariables")
const nodemailer = require("nodemailer")
const cmd = require("./cmdPretty")

const blocks = {
    first: (text) => {
        return `<div style="
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-bottom: 1px solid #505050;">
        ${text}
        </div>`
    },
    middle: (text) => {
        return `<div style="
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        border-bottom: 1px solid #505050;">
        ${text}
        </div>` },
    last: (text) => {
        return `<div style="
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;">
        ${text}
        </div>`}
}

async function sendMail(textArr = [], subject = "Furry Index", address, features = []) {
    const transporter = nodemailer.createTransport({
        host: globalVariables.mailServer,
        port: 587,
        secure: false,
        auth: { user: globalVariables.mailBox, pass: globalVariables.mailBoxPass },
        tls: { rejectUnauthorized: true },
        connectionTimeout: 10000
    });

    const text = []

    text.push(`<html style="display: flex;
        flex-direction: column;
        align-items: center;">`)
    text.push(`<body style="
        font-size: 16px;
        font-family: Arial, Helvetica, sans-serif;
        border-radius: 10px;
        border: 1px solid #505050;
        width: fit-content;">`)

    for (let i = 0; i < textArr.length; i++) {
        const textLn = textArr[i]
        if (i === 0) {
            text.push(blocks.first(textLn))
        } else if (i === textArr.length - 1) {
            text.push(blocks.last(textLn))
        } else {
            text.push(blocks.middle(textLn))
        }
    }

    text.push(`</body></html>`)

    await transporter.sendMail({
        from: `"Furry Index" <${globalVariables.mailBox}>`,
        to: address,
        subject: subject,
        text: textArr.join("\n"),
        html: text.join("")
    })
}

module.exports = sendMail