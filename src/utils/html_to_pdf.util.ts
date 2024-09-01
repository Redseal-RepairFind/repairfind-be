// const puppeteer = require('puppeteer');
// const nodemailer = require('nodemailer');
// // Function to generate PDF from HTML
// export async function generatePDF(htmlContent: any, outputPath: any) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.setContent(htmlContent);
//   await page.pdf({ path: outputPath, format: 'A4' });
//   await browser.close();
// }
import {PdfDocument} from "@ironsoftware/ironpdf";




export async function generatePDF(htmlContent: any) {
   
    
     // Render the HTML string
	const pdf = await PdfDocument.fromHtml("<h1>Testing</h1>");

    console.log('pdf',pdf)
    // Export the PDF document
	// await pdf.saveAs("pdf-from-html.pdf");
   
}
