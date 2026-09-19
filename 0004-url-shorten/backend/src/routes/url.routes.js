import express from "express" ;
const router = express.Router(); 
import generateCode from "../utils/generateCode.js"
import urlModel from '../model/url.model.js'

/**
 * @POST 
 */

router.post("/",async(req,res)=>{
    const{url} = req.body ;
     if ((url.startsWith("http://") == false) && (url.startsWith("https://") == false)) {
        return res.status(400).json({ error: "Please enter a valid URL starting with http:// or https://" })
    }
//if (!http && !https)

// 👉 && = dono conditions true honi chahiye
// ➡️ Neither http nor https → Error  agr http hua to ye condition ni chlegi no error mtlb

// if (!http || !https)

// 👉 || = ek bhi condition true hui to overall true  agr http hua url me to ek condition true mtlb errro wala code chl jyega 
// ➡️ Is case mein valid URLs bhi reject ho jayenge ❌
    if (url.length > 2048) {
        return res.status(400).json({ error: "URL is too long." })
    }


const code =  generateCode(); //random code 
const newUrl =await  urlModel.create({
    originalUrl : url ,
    shortCode : code, 
})
return res.status(201).json({
        message: "URL shortened successfully",
        data: {
            originalUrl: newUrl.originalUrl,
            shortCode: newUrl.shortCode,
            clicks:newUrl.clicks,
        }
    })

})

router.get("/", async function (req, res) {

    const urls = await urlModel.find()

    return res.status(200).json({
        message: "URLs fetched successfully",
        data: {
            urls
        }
    })

})

router.delete("/:id", async function (req, res) {

    const { id } = req.params

    const url = await urlModel.findById(id)

    if (!url) {
        return res.status(404).json({
            message: "URL not found"
        })
    }

    await urlModel.findByIdAndDelete(id)

    return res.status(200).json({
        message: "URL deleted successfully"
    })

})


export default router ; 