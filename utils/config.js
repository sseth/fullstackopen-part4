require('dotenv').config();

const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/bloglist';

module.exports = { PORT, MONGO_URI };
