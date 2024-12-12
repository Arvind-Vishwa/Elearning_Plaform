const mongoose=require('mongoose');
const {Schema} =mongoose;
const contactSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required:true },
    // additionalDetail: String, // Optional field
});


const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;