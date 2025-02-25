import { BinaryToTextEncoding, createHash, privateDecrypt,constants } from "crypto";
import { readFileSync } from 'fs';

export class Helper {
    static isToday(date: Date): boolean {
        const today = new Date();

        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    }

    static generateNumber(lastNumber: number | null): number {
        // Get current date in GMT+7 timezone
        const currentDate: Date = new Date();
        const gmtPlus7Time: number = currentDate.getTime() + (7 * 60 * 60 * 1000); // Adjust for GMT+7
        const gmtPlus7Date: string = new Date(gmtPlus7Time).toISOString().slice(0, 10);

        // If it's a new day or no last number provided, start from 1, else use provided last number + 1
        const currentNumber: number = lastNumber === null || gmtPlus7Date !== lastNumber.toString().slice(0, 8)
            ? 1
            : lastNumber + 1;

        // Pad the number with leading zeros
        const formattedNumber: string = currentNumber.toString().padStart(4, '0');

        // Construct the 12-digit number
        const number: number = parseInt(`${gmtPlus7Date.replace(/-/g, '')}${formattedNumber}`);
        return number - 100000000000;
    }

    static generate12DigitDateString = () => {
        const date = new Date();

        // Get the year, month, day, hours, minutes, and seconds from the date
        const year = date.getFullYear().toString().slice(-2);  // e.g., "24" for 2024
        const month = (date.getMonth() + 1).toString().padStart(2, '0');  // e.g., 05 for May
        const day = date.getDate().toString().padStart(2, '0');  // e.g., 29
        const hours = date.getHours().toString().padStart(2, '0');  // e.g., 13 for 1 PM
        const minutes = date.getMinutes().toString().padStart(2, '0');  // e.g., 45
        const seconds = date.getSeconds().toString().padStart(2, '0');  // e.g., 30

        // Combine the components into a single string
        const dateString = `${year}${month}${day}${hours}${minutes}${seconds}`;  // e.g., "20240529134530"

        return dateString;
    }

    static generateChecksum(str: string, algorithm: string, encoding: BinaryToTextEncoding) {
        return createHash(algorithm || 'md5')
            .update(str, 'utf8')
            .digest(encoding || 'hex');
    }

    static validateThaiSSID(ssid: string) {
        // Check if the input is exactly 13 digits long
        if (!/^\d{13}$/.test(ssid)) {
            return false;
        }

        let sum = 0;
        // Calculate the checksum using the first 12 digits
        for (let i = 0; i < 12; i++) {
            sum += parseInt(ssid.charAt(i)) * (13 - i);
        }

        // Modulo 11 and subtract from 11 to get the check digit
        let checkDigit = (11 - (sum % 11)) % 10;

        // Compare the calculated check digit with the 13th digit
        return checkDigit === parseInt(ssid.charAt(12));
    }

    static isValidThaiPhoneNumber(phoneNumber) {
        const thaiPhoneRegex = /^(?:\+66|0)[2689]\d{7,8}$/;
        return thaiPhoneRegex.test(phoneNumber);
    }
    static decryptData(encryptedData: string): string {

        const privateKey = readFileSync(process.env.PRIVATE_KEY_PATH, 'utf-8');
        const encryptedBuffer = Buffer.from(encryptedData, 'base64');

        // Decrypt the data using the private key with RSA-OAEP padding
        const decryptedBuffer = privateDecrypt(
            {
                key: privateKey,
                padding: constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            encryptedBuffer
        );

        // Convert the decrypted buffer to a string and return it
        return decryptedBuffer.toString('utf-8');
    }
}


export function imagePath(path: string | null) {
    if (!path) {
        return null
    }

    return process.env.APP_URL + '/' + path;
}