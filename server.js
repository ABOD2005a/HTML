const express = require("express");
const cors = require("cors");
const XLSX = require("xlsx");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const filePath = path.join(__dirname, "text.xlsx");
let excelData = [];

function loadExcel() {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const searchValues = [];
        excelData.forEach(row => {
            Object.values(row).forEach(value => {
                if (value !== null) {
                    searchValues.push(String(value));
                }
            });
        });
        excelData = searchValues;
        console.log(":bar_chart: البيانات المحملة من Excel:", excelData);
    } catch (error) {
        console.error("Error loading Excel file:", error);
        process.exit(1);
    }
}

loadExcel();

app.post("/search", (req, res) => {
    const { searchCode } = req.body;
    if (!searchCode) return res.status(400).send(":x: كود التعريف مطلوب");

    console.log(":mag: البحث عن:", searchCode);

    const found = excelData.some(item => item.toLowerCase() === searchCode.toLowerCase());
    console.log(":pushpin: النتيجة:", found ? ":white_check_mark: موجود" : ":x: غير موجود");

    res.send(found ? "الكود موجود" : ":x: الكود غير موجود");
});

app.listen(5000, () => console.log(":rocket: Server running on http://localhost:5000"));