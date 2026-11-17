import {PDFParse}from "pdf-parse"
import fs from "fs/promises"
const parser  = new PDFParse({
    data :await  fs.readFile("./story.pdf")
})
// –––––––––––––––––––––––––– Extract all the text from pdf file –––––––––––––––––––––––––
const text =await parser.getText() ;
console.log(text); 