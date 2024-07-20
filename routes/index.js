var express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Country = require('../models/country');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
var router = express.Router();

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage
}).single('profileImage');

router.get('/', function (req, res) {
    res.json({ 'app': 'Superstar LIVE' });
});

router.post('/register', async (req, res) => {
    console.log(req.body);
    console.log(req.headers['user-agent']);
    console.log(req.headers['SERVER_KEY']);
    const { name, username, email, password, gender, mobileNumber, profileImage, dob, country, loginType } = req.body;
    try {
        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(409).send('Email already exists');
        }
        // Check if username already exists
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(409).send('Username already exists');
        }

        // Validate required fields
        if (!name || !username || !email || !password || !gender || !mobileNumber || !dob || !country) {
            return res.status(400).send('All fields are required');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send('Invalid email format');
        }

        // Get platformType from headers user-agent
        const userAgent = req.headers['user-agent'];
        let platformType = -1; // Default value for other platforms

        if (userAgent.includes('Android')) {
            platformType = 0; // Android
        } else if (userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod') || userAgent.includes('iOS')) {
            platformType = 1; // iOS (iPhone or iPad)
        }

        // Generate age from dob (date of birth) dob example: 7/19/1995
        const dobParts = dob.split('/');
        const dobYear = parseInt(dobParts[2]);
        const currentYear = new Date().getFullYear();
        const age = currentYear - dobYear;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = new User({
            name,
            username,
            email,
            password: hashedPassword,
            gender,
            mobileNumber,
            profileImage,
            dob,
            country,
            age,
            loginType,
            platformType
        });

        // Save the user to the database
        await user.save();
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/upload-profile/:username', upload, async (req, res) => {
    try {
        // Check if user exists
        const existingUser = await User.findOne({ username: req.params.username });
        if (!existingUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (req.file) {
            // Update user with profile image path
            const imagePath = req.file.filename;
            const image_path = 'http://192.168.31.199:3000/uploads/' + imagePath;
            console.log(image_path);
            await User.updateOne({ username: req.params.username }, { profileImage: image_path });

            res.json({ msg: 'Profile image uploaded successfully' });
        } else {
            res.json({ msg: 'No file uploaded' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username is an email
        const user = await User.findOne({ $or: [{ email: username }, { username: username }] });

        if (!user) {
            return res.status(404).send('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Invalid password');
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.get('/allowed-countries', async function (req, res, next) {
    try {
        const countries = await Country.find({});
        res.json(countries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});






module.exports = router;
