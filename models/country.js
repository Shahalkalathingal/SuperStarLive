// Import any required dependencies
const mongoose = require('mongoose');

// Define the schema for the countries model
const countrySchema = new mongoose.Schema({
    name: {
        type: String, // Change the type to an array of strings
        required: true
    },
    code:{
        type:String,
        required: true
    }
});

// Create the countries model using the schema
const Country = mongoose.model('Country', countrySchema);

// Export the model
module.exports = Country;
