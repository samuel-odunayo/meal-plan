require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const JWT_TOKEN = process.env.JWT_TOKEN;


const settings = {
    JWT_SECRET,
    JWT_TOKEN
};
export default settings;