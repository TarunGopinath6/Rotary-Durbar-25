import supabase from "../API/supabase";
import axios from "axios";


export const downloadGoogle = async (uid, photoUrl) => {
    try {
        const fileId = extractFileId(photoUrl);
        if (!fileId) {
            return { status: false }
        }

        const baseUrl = "https://docs.google.com/uc?export=download&confirm=1";

        const session = axios.create({
            withCredentials: true,
        });

        let response = await session.get(baseUrl, {
            params: { id: fileId },
            responseType: "blob",
        });

        let confirmToken = getConfirmToken(response.headers["set-cookie"]);
        if (confirmToken) {
            response = await session.get(baseUrl, {
                params: { id: fileId, confirm: confirmToken },
                responseType: "blob",
            });
        }

        console.log(response);

    } catch (error) {
        return { status: false }
    }
}


export const downloadFile = async (uid, photoUrl) => {
    try {
        const fileId = extractFileId(photoUrl);
        if (!fileId) {
            return { status: false }
        }

        const baseUrl = "https://docs.google.com/uc?export=download&confirm=1";

        const session = axios.create({
            withCredentials: true,
        });

        let response = await session.get(baseUrl, {
            params: { id: fileId },
            responseType: "blob",
        });

        let confirmToken = getConfirmToken(response.headers["set-cookie"]);
        if (confirmToken) {
            response = await session.get(baseUrl, {
                params: { id: fileId, confirm: confirmToken },
                responseType: "blob",
            });
        }

        // Create a blob URL for the downloaded file
        const fileName = `${uid}.png`;
        const fileBlob = new Blob([response.data], { type: "image/png" });

        // Upload the file to Supabase storage
        const publicUrl = await uploadToSupabase(fileName, fileBlob);
        return { status: true, url: publicUrl }
    } catch (error) {
        return { status: false }
    }
};


export const extractFileId = (photoUrl) => {
    const url = new URL(photoUrl);
    const params = new URLSearchParams(url.search);
    return params.get("id");
};


const getConfirmToken = (cookies) => {
    for (const [key, value] of Object.entries(cookies)) {
        if (key.startsWith("download_warning")) {
            return value;
        }
    }
    return null;
};


const uploadToSupabase = async (fileName, fileBlob) => {
    const storageBucket = "members";

    try {
        const { data, error } = await supabase.storage
            .from(storageBucket)
            .upload(fileName, fileBlob, { upsert: true });

        if (error) throw error;

        const { publicUrl } = supabase.storage
            .from(storageBucket)
            .getPublicUrl(fileName);

        return publicUrl;
    } catch (err) {
        console.error("Error uploading to Supabase:", err);
        return null;
    }
};