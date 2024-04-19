const express = require('express');
const app = express();
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const Utilisateur = require('./Utilisateur');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/auth-service')
    .then(() => {
        app.listen(port, () => console.log(`Server is running on port ${port}`));
    })
    .catch((err) => console.log(err));

app.post('/auth/register', async (req, res) => {
    const { name, email, password} = req.body

    const userExist = await Utilisateur.findOne({ email: email })

    if (userExist) {
        return res.json({error: "Utilisateur exist déja"})
    }
    const hashedPassword = await bcrypt.hash(password,10)
    const utilisateur = await Utilisateur.create({
        name,
        email,
        password: hashedPassword,
    })
    res.json(utilisateur)

})

app.post('/auth/login',async (req, res) => {
    const {email, password} = req.body
    const utilisateurExist = await Utilisateur.findOne({email: email})
    if(!utilisateurExist){
        return res.json({error: "Utilisateur non trouvé"})
    }
    const isPassword = await  bcrypt.compare(password, utilisateurExist.password)
    if(!isPassword){
        return res.json({error: 'Mot de passe incorect'})
    }
    const token = jwt.sign({utilisateurId: utilisateurExist._id}, 'secretKey')
    res.status(201).json({token})
})

app.post('/auth/reset-password', (req, res) => {
    const { token, newPassword } = req.body;

    jwt.verify(token, 'secretKey', async (err, decoded) => {
        if (err) {
            return res.json({ error: 'Invalid token' });
        }

        const _id = decoded.utilisateurId;

        try {
            const utilisateur = await Utilisateur.findById(_id);
            if (!utilisateur) {
                return res.json({ error: "Utilisateur non trouvé" });
            }

            // Mettre à jour le mot de passe
            utilisateur.password = await bcrypt.hash(newPassword,10);
            await utilisateur.save();

            res.json({ message: "Password updated" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Erreur lors de la mise à jour du mot de passe" });
        }
    });
});