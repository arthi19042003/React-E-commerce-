const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true
});

// 1. Check if entered password matches hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// 2. Encrypt password before saving
userSchema.pre('save', async function (next) {
    // If password is not modified, skip hashing
    if (!this.isModified('password')) {
        return next();
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    // CRITICAL FIX: You must call next() here to finish the process!
    next();
});

module.exports = mongoose.model('User', userSchema);