const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '2h';

exports.register = async (req, res) => {
    try {
        const { username, email, password, dataNascimento } = req.body;

        // 1. Validação da password
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
        if (!passRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'A password deve ter pelo menos 8 caracteres, incluindo uma maiúscula, uma minúscula e um número.'
            });
        }

        // 2. Verificar duplicados
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Username ou email já registados.' });
        }

        // 3. Hash da password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // 4. Criar utilizador
        const newUser = new User({
            username,
            email,
            password: passwordHash,
            dataNascimento
        });

        await newUser.save();

        res.status(201).json({
            success: true,
            message: 'Utilizador registado com sucesso.',
            userId: newUser._id
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body; // O identifier pode ser email ou username

        const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier }] });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }

        const payload = { id: user._id, username: user.username };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

        res.status(200).json({
            success: true,
            message: 'Login bem sucedido.',
            user: { username: user.username, id: user._id },
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
};