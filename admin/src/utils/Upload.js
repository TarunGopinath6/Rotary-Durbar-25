import * as XLSX from 'xlsx';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../API/firebaseConfig"
import supabase from "../API/supabase";

import { downloadFile } from './Storage';


export const processFile = async (file) => {
    if (!file) {
        alert('Please upload a file!');
        return;
    }

    console.log(file)

    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'binary' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let records = XLSX.utils.sheet_to_json(sheet, {
        raw: false,  // Convert all values to strings
        dateNF: 'yyyy-mm-dd',  // Date format string
        cellDates: true  // Convert Excel dates to JS Date objects
    });

    const parseToNumber = (str, fallback = 0) => isNaN(Number(str.replace(/,/g, ''))) ? fallback : Number(str.replace(/,/g, ''));

    for (let record of records) {

        const updatedRecord = Object.keys(record).reduce((acc, key) => {
            const normalizedKey = key
                .toLowerCase()
                .trim()
                .replace(/ /g, '_')
                .replace(/'/g, '');
            acc[normalizedKey] = record[key];
            return acc;
        }, {});


        // Firebase: Check if user exists by email
        const email = updatedRecord.email;
        console.log(email);
        let userExists = false;
        try {
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .eq('email', email)
                .maybeSingle();

            if (error) {
                console.error(`Error checking Supabase: ${error.message}`);
                throw error;
            }

            if (data) {
                userExists = true;
            }
            else
                console.log('User does not exist')
        } catch (error) {
            console.error(`Unexpected error: ${error.message}`);
        }

        // Skip record if user exists
        if (userExists) {
            console.log(`User already exists for email: ${email}, skipping.`);
            continue
        }

        // Create new user in Firebase Auth
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, email.split('@')[0] + '_password' );
            console.log(`User created for email: ${email}`);
            updatedRecord['id'] = userCredential.user.uid;
        } catch (error) {
            console.error(`Error creating user. No user data but user account exists. Contact admin: ${error.message}`);
            continue;
        }

        // Rename columns
        const renamedRecord = {
            ...updatedRecord,
            company_name: updatedRecord['if_self-employed_:_business_name_/_if_salaried_:_company_name'] || '',
            sets_designation: updatedRecord['designation'] || '',
            designation: updatedRecord['role_in_business_/_designation_in_company'] || '',
            name: updatedRecord['full_name'] || '',
        };

        // Delete the old columns
        delete renamedRecord['if_self-employed_:_business_name_/_if_salaried_:_company_name'];
        delete renamedRecord['designation'];
        delete renamedRecord['role_in_business_/_designation_in_company'];
        delete renamedRecord['full_name'];

        // Add default columns
        renamedRecord.priority = 0;
        renamedRecord.role = 'member';
        renamedRecord.support = false;

        // Remove timestamp column and handle NA values
        delete renamedRecord.timestamp;
        for (let key in renamedRecord) {
            if (renamedRecord[key] === null || renamedRecord[key] === undefined || renamedRecord[key] === 'NA') {
                renamedRecord[key] = '';
            }
        }

        renamedRecord['date_of_birth'] = processDateString(renamedRecord['date_of_birth'])
        renamedRecord['wedding_anniversary'] = processDateString(renamedRecord['wedding_anniversary'])
        renamedRecord['rotarian_since'] = parseToNumber(renamedRecord['rotarian_since'])
        renamedRecord['emergency_contact_phone'] = String(parseToNumber(renamedRecord['emergency_contact_phone']))
        renamedRecord['phone'] = String(parseToNumber(renamedRecord['phone']))


        console.log('Processed record:', renamedRecord);

        const photoResponse = downloadFile(renamedRecord['uid'], renamedRecord['photograph'])
        if (photoResponse.status === true)
            renamedRecord['photograph'] = photoResponse.url
        else
            renamedRecord['photograph'] = null

        try {
            const { data: insertedData, error } = await supabase
                .from("members")
                .insert([renamedRecord]); // Supabase expects an array of objects for inserting

            if (error) {
                console.error('Error inserting data:', error.message);
                return null;
            }

            console.log('Inserted data:');
        } catch (err) {
            console.error('Unexpected error:', err);
            return null;
        }
    }

};


function processDateString(dateString) {
    // Check if the date works directly with `new Date`
    const validDate = new Date(dateString);
    if (!isNaN(validDate)) {
        return dateString; // Return as is if it's a valid date
    }

    // Check for formats like "22/09" (DD/MM)
    const currentYear = new Date().getFullYear();
    const match = dateString.match(/^(\d{1,2})\/(\d{1,2})$/); // Match DD/MM format

    if (match) {
        const day = match[1];
        const month = match[2];
        // Create a new date string with the current year
        const updatedDateString = `${currentYear}-${month}-${day}`;
        const updatedDate = new Date(updatedDateString);

        if (!isNaN(updatedDate)) {
            return updatedDate.toISOString().split('T')[0]; // Return in YYYY-MM-DD format
        }
    }
    return null
    // If none of the conditions match, return null or throw an error
}