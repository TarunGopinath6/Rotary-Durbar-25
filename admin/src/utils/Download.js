import supabase from "../API/supabase";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


export const fetchDataAndExport = async (table) => {
    try {
        // Fetch all records from the Supabase table
        const { data, error } = await supabase.from(table).select('*');
        if (error) throw error;

        // Check if data exists
        if (!data || data.length === 0) {
            alert('No data found to export.');
            return;
        }

        // Convert data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Create a new workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Write the workbook to a binary string
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        // Convert the binary string to a Blob
        const excelBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

        // Save the file
        saveAs(excelBlob, `${table}.xlsx`);
    } catch (error) {
        console.error('Error exporting data:', error.message);
    }
};
