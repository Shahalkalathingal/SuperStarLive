const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true }, // sign up !!!
        username: { type: String, required: true }, // sign up !!!            
        email: { type: String, required: true }, // sign up !!!
        interest:{type:String, default:""},
        bio: { type: String , default: 'Hey there! I am using Superstar Live'},
        password: { type: String, required: true }, // sign up !!!
        loginType: { type: Number, enum: [0, 1, 2] , default:0}, // 0.normal 1.google 2.facebook
        platformType: { type: Number, enum: [-1, 0, 1], required: true }, //0.android  1.ios
        gender: { type: String, required: true }, // sign up !!!
        mobileNumber: { type: String, required: true }, // sign up !!!
        profileImage: { type: String,  default:"https://www.svgrepo.com/show/408476/user-person-profile-block-account-circle.svg"}, // sign up !!!
        age: { type: Number, required: true }, 
        dob: { type: String, required: true }, // sign up !!!
        coin: { type: Number,  default: 0 },
        country: { type: String, required: true }, // sign up !!!
        isOnline: { type: Boolean,  default: true},
        isBusy: { type: Boolean,  default: false},
        isLive: { type: Boolean,  default: false},
        isBlock: { type: Boolean,  default: false},
        followers: { type: Number,  default: 0},
        following: { type: Number,  default: 0},
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Then Export Schema model Name is "User"
module.exports = mongoose.model("User", userSchema);
