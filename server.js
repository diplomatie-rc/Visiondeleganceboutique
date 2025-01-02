require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
const axios = require('axios');

// Servir les fichiers statiques (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour traiter les données du formulaire (POST)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route pour afficher le formulaire de contact
app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Route pour traiter l'envoi du formulaire
app.post('/send-email', (req, res) => {
    const { name, email, message, image } = req.body;  // Récupérer les champs du formulaire
    
    // Créer un transporteur SMTP
    const transporter = nodemailer.createTransport({
        service: 'gmail',  // Utiliser Gmail (ou un autre fournisseur SMTP)
        auth: {
            user: 'rglaiv28@gmail.com',  // Utiliser la variable d'environnement pour l'email
            pass: 'zkou qrfn wsev grtr'   // Utiliser la variable d'environnement pour le mot de passe
        }
    });

    // Chemin de l'image
    const imagePath = path.join(__dirname, 'public', 'assets', 'images', 'FEMME', 'Vetements', image);

    // Créer les options de l'email
    const mailOptions = {
        from: email,  // L'email de l'utilisateur
        to: 'rolphlouya28@gmail.com',  // L'email où vous voulez recevoir le message
        subject: `Message de ${name}`,  // Objet de l'email
        text: `Email: ${email}\n\nMessage: ${message}`,  // Corps du message en texte brut
        attachments: image ? [
            {
                filename: image,
                path: imagePath,
                cid: 'image@cid'  // Identifier l'image dans l'email pour l'intégration dans le message HTML
            }
        ] : [] // Si une image est spécifiée, l'ajouter en pièce jointe
    };

    // Envoyer l'email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Erreur lors de l\'envoi du message.');
        }
        res.send(`Message envoyé avec succès !`);
    });
});

// Lancer le serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});


