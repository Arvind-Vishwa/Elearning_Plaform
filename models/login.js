

const mongoose = require('mongoose');
// const { Schema } = mongoose;
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Elearning');


}



const UserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String},
    
});

module.exports = mongoose.model("User", UserSchema);