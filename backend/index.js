const express = require("express")
const nodemailer = require("nodemailer")
const cors = require("cors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express()

dotenv.config()
app.use(cors())
app.use(express.json())

const MONGO = process.env.MONGO_URL
const PORT = process.env.PORT

app.get("/", (req, res) => {
    res.status(200).send("Backend Connected....")
})

mongoose.connect(MONGO)
    .then(() => {
        console.log("Database Connected....")
    }).catch(() => {
        console.log("Failed to conect Database....")
    })

const credential = mongoose.model("credential", {}, "bulkmail")

app.post("/sendemail", (req, res) => {
    const messgae = req.body.msg
    const emailList = req.body.emails

    credential.find().then((data) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass
            }
        })

        new Promise(async (resolve, reject) => {
            try {
                for (let i = 0; i < emailList.length; i++) {
                    await transporter.sendMail({
                        from: "abik10203@gmail.com",
                        to: emailList[i],
                        subject: "A message from Bulkmail",
                        text: messgae
                    },
                    )
                    console.log("Email send to:", emailList[i])
                }
                resolve("Success")
            } catch (error) {
                console.log("Error:", error)
                reject("Failed")
            }
        }).then(() => {
            res.status(200).send(true)
        }).catch(() => {
            res.status(404).send(false)
        })
    }).catch((error) => {
        console.log(error)
    })
})

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`)
})
