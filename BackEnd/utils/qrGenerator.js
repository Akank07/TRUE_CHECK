const QRCode = require("qrcode");

const generateQRCode = async (text) => {
    try {
        return await QRCode.toDataURL(text);
    } catch (error) {
        throw error;
    }
};

module.exports = generateQRCode;