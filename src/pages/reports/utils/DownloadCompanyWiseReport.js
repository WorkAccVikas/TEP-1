import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export function downloadCompanyWiseReport(data, name) {
    // Remove `_id` key from each object
    const sanitizedData = data.map(({ _id, ...rest }) => rest);

    // Generate headers (with "Sr No" and "Company Name" at the start)
    const headers = ["Sr No", "Company Name", ...Object.keys(sanitizedData[0] || {}).filter((key) => key !== "company_name")];

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${name}_${new Date().toISOString().split("T")[0]}`);

    // Add header row
    const headerRow = worksheet.addRow(headers);

    // Style the header row
    headerRow.font = { bold: true }; // Bold header row
    headerRow.eachCell((cell) => {
        cell.alignment = { horizontal: "center" }; // Center align header row
    });

    // Add data rows
    sanitizedData.forEach((item, index) => {
        const row = [
            index + 1, // Sr No
            item.company_name, // Company Name
            ...Object.keys(item)
                .filter((key) => key !== "company_name")
                .map((key) => item[key]), // Remaining data
        ];
        worksheet.addRow(row);
    });

    // Calculate totals for numeric columns
    const totalRow = ["", "Total"]; // First two columns (Sr No and Company Name) remain empty
    headers.slice(2).forEach((header, colIndex) => {
        const colValues = worksheet.getColumn(colIndex + 3).values.slice(2); // Skip header and totals row
        if (colValues.every((value) => typeof value === "number")) {
            totalRow.push(colValues.reduce((sum, value) => sum + (value || 0), 0)); // Sum numeric values
        } else {
            totalRow.push(""); // Leave non-numeric columns empty
        }
    });

    // Add the totals row
    worksheet.addRow(totalRow);

    // Style the totals row
    const lastRow = worksheet.lastRow;
    if (lastRow) {
        lastRow.font = { bold: true }; // Bold totals row
        lastRow.eachCell((cell) => {
            cell.alignment = { horizontal: "center" }; // Center align totals row
        });
    }

    // Write the workbook to a buffer and trigger the download
    workbook.xlsx.writeBuffer().then((buffer) => {
        const fileName = `${name}_${new Date().toISOString().split("T")[0]}.xlsx`;
        saveAs(new Blob([buffer], { type: "application/octet-stream" }), fileName);
    });
}
