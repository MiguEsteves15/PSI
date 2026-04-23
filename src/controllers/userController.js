const User = require('../models/User');
const Artist = require('../models/Artist');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS || 10);
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '2h';
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const USERNAME_REGEX = /^[A-Za-z0-9]+$/;
const BASIC_EMAIL_REGEX = /^[^@\s]+@[^@\s]+$/;

async function validateCurrentPassword(user, currentPassword) {
    if (!currentPassword) {
        return false;
    }

    return bcrypt.compare(currentPassword, user.password);
}

async function applyEmailUpdate(user, email) {
    if (!email) {
        return null;
    }

    if (typeof email !== 'string' || !BASIC_EMAIL_REGEX.test(email.trim())) {
        return { status: 400, message: 'Email invalido.' };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUserByEmail = await User.findOne({ email: normalizedEmail });
    if (existingUserByEmail && existingUserByEmail._id.toString() !== user._id.toString()) {
        return { status: 409, message: 'Email ja registado.' };
    }

    user.email = normalizedEmail;
    return null;
}

function applyBirthDateUpdate(user, dataNascimento) {
    if (!dataNascimento) {
        return null;
    }

    const parsedBirthDate = new Date(dataNascimento);
    if (Number.isNaN(parsedBirthDate.getTime())) {
        return { status: 400, message: 'dataNascimento invalida.' };
    }

    user.dataNascimento = parsedBirthDate;
    return null;
}

exports.register = async (req, res) => {
    try {
        const { username, email, password, dataNascimento } = req.body;

        if (typeof email !== 'string' || !BASIC_EMAIL_REGEX.test(email.trim())) {
            return res.status(400).json({
                success: false,
                message: 'Email invalido.'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 1. Validação da password
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'A password deve ter pelo menos 8 caracteres, incluindo uma maiúscula, uma minúscula e um número.'
            });
        }

        // 2. Verificar duplicados
        const existingUser = await User.findOne({ $or: [{ username }, { email: normalizedEmail }] });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Username ou email já registados.' });
        }

        // 3. Hash da password
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // 4. Criar utilizador
        const newUser = new User({
            username,
            email: normalizedEmail,
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
        // Erro de duplicação (unique constraint)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({
                success: false,
                message: `${field.charAt(0).toUpperCase() + field.slice(1)} já está registado.`
            });
        }

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
        const { username, password } = req.body;

        const user = await User.findOne({ username });
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

exports.getCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password') // remove a pass do resultado
            .populate('artistaFavorito', 'nome isni anoInicioAtividade tipoArtista'); // em vez de enivar apenas o id, substitui pelo que decidi

        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilizador nao encontrado.' });
        }

        return res.status(200).json({success: true, data: {user}});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
};

exports.updateUsername = async (req, res) => {
    try {
        const { username, currentPassword } = req.body;

        if (!username || typeof username !== 'string' || !USERNAME_REGEX.test(username.trim())) {
            return res.status(400).json({success: false, message: 'O username deve conter apenas letras e numeros.'});
        }

        const normalizedUsername = username.trim();
        const currentUser = await User.findById(req.user.id);

        if (!currentUser) {
            return res.status(404).json({ success: false, message: 'Utilizador nao encontrado.' });
        }

        const isCurrentPasswordValid = await validateCurrentPassword(currentUser, currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ success: false, message: 'Password atual invalida.' });
        }

        if (currentUser.username === normalizedUsername) {
            return res.status(400).json({ success: false, message: 'Novo username igual ao atual.' });
        }

        const existingUser = await User.findOne({ username: normalizedUsername});
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Username ja registado.' });
        }

        currentUser.username = normalizedUsername;
        await currentUser.save();

        const payload = { id: currentUser._id, username: currentUser.username };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });

        return res.status(200).json({
            success: true,
            message: 'Username atualizado com sucesso.',
            data: {
                user: {
                    id: currentUser._id,
                    username: currentUser.username,
                    email: currentUser.email
                },
                token
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'currentPassword e newPassword sao obrigatorios.'
            });
        }

        if (!PASSWORD_REGEX.test(newPassword)) {
            return res.status(400).json({
                success: false,
                message: 'A nova password deve ter pelo menos 8 caracteres, incluindo uma maiuscula, uma minuscula e um numero.'
            });
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilizador nao encontrado.' });
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ success: false, message: 'Password errada.' });
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({ success: false, message: 'A nova password deve ser diferente da atual.' });
        }

        user.password = await bcrypt.hash(newPassword, SALT_ROUNDS);
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password atualizada com sucesso.'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
};

exports.updateEmail = async (req, res) => {
    try {
        const { email, currentPassword } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email e obrigatorio.' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilizador nao encontrado.' });
        }

        const isCurrentPasswordValid = await validateCurrentPassword(user, currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ success: false, message: 'Password atual invalida.' });
        }

        const emailError = await applyEmailUpdate(user, email);
        if (emailError) {
            return res.status(emailError.status).json({ success: false, message: emailError.message });
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Email atualizado com sucesso.',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    dataNascimento: user.dataNascimento
                }
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }

        console.error(error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
};

exports.updateBirthDate = async (req, res) => {
    try {
        const { dataNascimento, currentPassword } = req.body;

        if (!dataNascimento) {
            return res.status(400).json({ success: false, message: 'dataNascimento e obrigatoria.' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilizador nao encontrado.' });
        }

        const isCurrentPasswordValid = await validateCurrentPassword(user, currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ success: false, message: 'Password atual invalida.' });
        }

        const birthDateError = applyBirthDateUpdate(user, dataNascimento);
        if (birthDateError) {
            return res.status(birthDateError.status).json({ success: false, message: birthDateError.message });
        }

        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Data de nascimento atualizada com sucesso.',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    dataNascimento: user.dataNascimento
                }
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val) => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }

        console.error(error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
};

exports.setFavoriteArtist = async (req, res) => {
    try {
        const { artistId, currentPassword } = req.body;

        if (!artistId || !mongoose.Types.ObjectId.isValid(artistId)) {
            return res.status(400).json({
                success: false,
                message: 'artistId invalido.'
            });
        }

        const [user, artist] = await Promise.all([
            User.findById(req.user.id),
            Artist.findById(artistId).select('_id nome')
        ]);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilizador nao encontrado.' });
        }

        const isCurrentPasswordValid = await validateCurrentPassword(user, currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ success: false, message: 'Password atual invalida.' });
        }

        if (!artist) {
            return res.status(404).json({ success: false, message: 'Artista nao encontrado.' });
        }

        if (user.artistaFavorito && user.artistaFavorito.toString() === artistId) {
            return res.status(200).json({
                success: true,
                message: 'Este artista ja esta definido como favorito.'
            });
        }

        if (user.artistaFavorito && user.artistaFavorito.toString() !== artistId) {
            return res.status(409).json({
                success: false,
                message: 'Ja tens outro artista favorito definido. Remove-o primeiro.'
            });
        }

        user.artistaFavorito = artist._id;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Artista favorito definido com sucesso.',
            data: {
                favoriteArtistId: artist._id
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
};

exports.removeFavoriteArtist = async (req, res) => {
    try {
        const { currentPassword } = req.body || {};
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilizador nao encontrado.' });
        }

        const isCurrentPasswordValid = await validateCurrentPassword(user, currentPassword);
        if (!isCurrentPasswordValid) {
            return res.status(401).json({ success: false, message: 'Password atual invalida.' });
        }

        if (!user.artistaFavorito) {
            return res.status(200).json({
                success: true,
                message: 'Utilizador nao tem artista favorito definido.'
            });
        }

        user.artistaFavorito = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Artista favorito removido com sucesso.'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
};