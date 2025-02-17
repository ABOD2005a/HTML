let excelData = [];

async function fetchExcelData() {
    try {
        const response = await fetch('http://localhost:5000/get-excel-dat1');
        console.log("Response status:", response.status);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, details: ${errorText}`);
        }
        const data = await response.json();
        console.log("Raw data from server:", data);
        excelData = data;
        console.log(":open_file_folder: تم تحميل بيانات الإكسل:", excelData);
    } catch (error) {
        console.error(":x: حدث خطأ أثناء تحميل البيانات:", error);
        document.getElementById('searchResult').innerHTML = `<span style='color:red;'>:x: حدث خطأ أثناء تحميل البيانات: ${error.message}</span>`;
    }
}

async function searchExcel() {
    if (excelData.length === 0) {
        await fetchExcelData();
        if (excelData.length === 0) {
            return;
        }
    }

    const query = document.getElementById('searchCode').value.trim().toLowerCase();
    const resultDiv = document.getElementById('searchResult');

    if (!query) {
        resultDiv.innerHTML = "<span style='color:red;'>:exclamation: يرجى إدخال كود التعريف</span>";
        return;
    }

    let found = excelData.some(row => row.some(cell => String(cell).toLowerCase() === query));

    if (found) {
        resultDiv.innerHTML = `<span style="color:green;">✅ الكود "${query}" موجود في الملف</span>`;
    } else {
        resultDiv.innerHTML = "<span style='color:red;'>:x: كود التعريف غير موجود</span>";
    }
}

window.addEventListener('DOMContentLoaded', () => {
    fetchExcelData().then(() => { });
});

document.getElementById('searchCode').addEventListener('input', searchExcel);