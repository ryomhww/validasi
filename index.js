const express = require('express');
const { body, validationResult } = require('express-validator');
const Joi = require('joi');

const app = express();
const port = 3000;

app.use(express.json());

const validateInput = [
    body('username').isLength({ min: 5 }).withMessage('Panjang username minimal 5 karakter'),
    body('email').isEmail().withMessage('Format email tidak valid'),
];

const validateInputJoi = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(5).required(),
        email: Joi.string().email().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }

    next();
};

app.post('/user-joi', validateInput, validateInputJoi, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    res.json({ message: 'Data user valid' });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});