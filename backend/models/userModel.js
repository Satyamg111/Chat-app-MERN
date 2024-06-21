const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');


const userSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique:true
        },
        password:{
            type: String,
            required: true,
        },
        pic:{
            type: String,
            default:"https://png.pngtree.com/png-clipart/20210129/ourmid/pngtree-default-male-avatar-png-image_2811083.jpg",
        }
    },
    {
        timestamps: true,
    }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
     return bcryptjs.compare(enteredPassword, this.password);
}

userSchema.pre('save', async function(next){
    if(!this.isModified) {
        next();
    }
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);

}) 


const User = mongoose.model("User", userSchema);

module.exports = User;