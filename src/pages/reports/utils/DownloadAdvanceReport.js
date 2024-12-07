import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export function downloadAdvanceReport(data, name) {
    // Define columns to sum for totals
    const columnsToSum = ["approvedInterest", "approvedAmount", "requestedInterest", "requestedAmount"];

    // Add "Sr No" at the start of headers
    const headers = ["Sr No", ...Object.keys(data[0] || {})];

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`${name}_${new Date().toISOString().split("T")[0]}`);

    // Add header row
    const headerRow = worksheet.addRow(headers);

    // Style the header row
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
        cell.alignment = { horizontal: "center" }; // Center align headers
    });

    // Add data rows
    data.forEach((item, index) => {
        const row = [
            index + 1, // Sr No
            ...headers.slice(1).map((key) => item[key]), // Add remaining keys dynamically
        ];
        worksheet.addRow(row);
    });

    // Calculate totals for specified columns
    const totalRow = ["", "Total"]; // Start the row with placeholders for Sr No and Total label
    headers.slice(2).forEach((header) => {
        if (columnsToSum.includes(header)) {
            // Sum values for the column
            const colValues = worksheet.getColumn(headers.indexOf(header) + 1).values.slice(2); // Skip header and totals row
            const total = colValues.reduce((sum, value) => sum + (value || 0), 0);
            totalRow.push(total);
        } else {
            totalRow.push(""); // Leave non-sum columns empty
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
