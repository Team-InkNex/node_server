const express = require('express');
const multer = require('multer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');
const ipp = require('ipp');

const printer = ipp.Printer("http://172.18.100.235:631/printers/HP-LaserJet-P1006");

const app = express();
const port = 3000;

// Setup EJS
app.set('view engine', 'ejs');

// Multer configuration for file storage
const storage = multer.diskStorage({
    destination: './',
    filename: function(req, file, cb){
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage
}).single('myFile');

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/upload', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            res.send('Error uploading file.');
            return;
        }
        
        // Read the number of pages in the uploaded PDF
        try {
            const pdfBytes = await fs.promises.readFile(path.join(__dirname, req.file.originalname));
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const numPages = pdfDoc.getPageCount();
            res.send(`File uploaded successfully. The PDF has ${numPages} pages.`);

			let msg = {
				"operation-attributes-tag": {
					"requesting-user-name": "InkNext",
					"job-name": "My Test Job",
					"document-format": "application/pdf"
				},
				data: pdfBytes
			};

			printer.execute("Print-Job", msg, function(err, res){
				console.log(res);
				console.log(JSON.stringify(res));
			});
			// res.send('File sent to printer.');

        } catch (pdfError) {
            console.error(pdfError);
            res.send('Failed to read the number of pages in the PDF.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
