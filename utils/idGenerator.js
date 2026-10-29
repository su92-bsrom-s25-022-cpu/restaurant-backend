const { customAlphabet } = require('nanoid');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const nanoid = customAlphabet(alphabet, 8);

const generateOrderId = () => `ORD-${nanoid()}`;
const generateReservationId = () => `SVR-${nanoid()}`;
const generateMenuId = () => `MN-${nanoid()}`;

module.exports = {
    generateOrderId,
    generateReservationId,
    generateMenuId
};
