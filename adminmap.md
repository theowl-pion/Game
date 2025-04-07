# Résumé des Modifications et Correctifs Récents

Ce document résume les changements et corrections apportés récemment au projet.

## 1. Configuration Docker (`docker-compose.yml`)

- **Synchronisation du Code Backend :** Ajout d'un montage de volume (`volumes`) pour le service `backend`. Cela permet désormais la synchronisation en direct du code entre votre machine locale (`./backend`) et le conteneur Docker, similaire à ce qui était déjà en place pour le frontend. Toute modification dans le dossier `./backend` sera maintenant reflétée dans le conteneur sans nécessiter un rebuild complet de l'image (un redémarrage du service backend via `docker-compose up -d --build backend` est nécessaire pour appliquer le changement de volume initial).

## 2. Tableau de Bord Administrateur (`frontend/src/pages/Dashbords/AdminDashboard.jsx`)

- **Mise en Page Adaptative :** La mise en page de l'onglet "Vue d'ensemble" ("Overview") a été modifiée pour mieux s'adapter lorsque certaines sections (Graphique d'utilisation des tickets, Distribution des prix, Statistiques des tickets) sont masquées en raison de l'absence de données.
- **Ajustement des Colonnes :** Utilisation de classes conditionnelles (Tailwind CSS) pour ajuster l'étendue des colonnes (`lg:col-span-2`, `lg:col-span-3`) des sections restantes afin qu'elles occupent l'espace disponible lorsque des sections adjacentes sont cachées.
- **Nouveaux Composants Graphiques :** Intégration de nouveaux composants pour visualiser les données : `PrizeDistributionChart.jsx`, `TicketUsageChart.jsx`, `UserActivityChart.jsx`.

## 3. Résolution de Problèmes Docker (Frontend)

- **Erreur de Build :** Correction d'une erreur qui survenait lors de la construction de l'image Docker du frontend (`failed to chmod ... node_modules`). Le problème était probablement lié à la copie des `node_modules` locaux. La suppression des `node_modules` locaux avant le rebuild a permis de résoudre le problème, car les dépendances sont correctement installées par la commande `RUN npm install` dans le `Dockerfile`.

## 4. Identifiants Administrateur

- **Base de Données (MongoDB) :** Les identifiants initiaux pour l'utilisateur root de MongoDB, tels que définis dans `docker-compose.yml`, sont :
  - Utilisateur : `Admin`
  - Mot de passe : `Admin@123`
    -Email: admin@tiptop.com
  - Base de données : `tip_top_game`
- **Application :** Les identifiants spécifiques pour se connecter à l'application en tant qu'administrateur _n'ont pas été trouvés explicitement_ dans le fichier `backend/.env` examiné. Si un utilisateur administrateur spécifique est créé par l'application (par exemple, lors du premier démarrage ou via un script de "seeding"), ses identifiants pourraient être définis ailleurs ou nécessiter une consultation de la logique de création d'utilisateur dans le code backend. Les variables `EMAIL_USER` et `EMAIL_PASS` trouvées dans `.env semblent être pour la configuration d'envoi d'emails et non pour l'authentification admin de l'application.

## 5. Autres Modifications

- Plusieurs autres fichiers backend (`userController.js`, `usersModel.js`) et frontend (`package.json`, `DashboardLayout.jsx`, `Header.jsx`, `ClientDashboard.jsx`, `Game.jsx`, `Login.jsx`, `yarn.lock`) ont été modifiés et inclus dans le dernier commit (`a325321`). Ces changements concernent diverses mises à jour et fonctionnalités liées aux tableaux de bord, à la gestion des utilisateurs et au jeu.

## 6. Fonctionnalité Page Contact

**Objectif :** Permettre aux utilisateurs d'envoyer un message via un formulaire de contact.

**Étapes et Code :**

1.  **Backend : Installer `nodemailer`**

    - Dans le terminal, naviguer vers `cd backend`.
    - Exécuter : `npm install nodemailer`

2.  **Backend : Créer un service d'email (`backend/src/services/emailService.js`)** (Nouveau fichier)

    ```javascript
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
        service: 'gmail', // ou autre fournisseur
        auth: {
            user: process.env.EMAIL_USER, // Depuis .env
            pass: process.env.EMAIL_PASS  // Depuis .env
        }
    });

    const sendContactEmail = async (name, userEmail, subject, message) => {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Envoyer à l'admin
            replyTo: userEmail,
            subject: `Contact Form: ${subject}`,
            text: `Nom: ${name}\nEmail: ${userEmail}\n\nMessage:\n${message}`
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log('Email de contact envoyé avec succès');
        } catch (error) {
            console.error('Erreur lors de l'envoi de l'email de contact:', error);
            throw new Error('Échec de l'envoi de l'email');
        }
    };

    module.exports = { sendContactEmail };
    ```

3.  **Backend : Créer un contrôleur (`backend/src/controllers/contactController.js`)** (Nouveau fichier)

    ```javascript
    const { sendContactEmail } = require('../services/emailService');

    const handleContactForm = async (req, res) => {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Tous les champs sont requis.' });
        }

        try {
            await sendContactEmail(name, email, subject, message);
            res.status(200).json({ message: 'Message envoyé avec succès !' });
        } catch (error) {
            res.status(500).json({ message: error.message || 'Erreur lors de l'envoi du message.' });
        }
    };

    module.exports = { handleContactForm };
    ```

4.  **Backend : Ajouter la route (`backend/src/routes/contactRoutes.js`)** (Nouveau fichier)

    ```javascript
    const express = require("express");
    const { handleContactForm } = require("../controllers/contactController");
    const router = express.Router();

    router.post("/contact", handleContactForm);

    module.exports = router;
    ```

5.  **Backend : Utiliser la route dans `server.js`**

    - Ajouter `require('./src/routes/contactRoutes')` près des autres `require`.
    - Ajouter `app.use('/api', contactRoutes);` près des autres `app.use('/api', ...)`.

      ```javascript
      // server.js (extrait)
      const contactRoutes = require("./src/routes/contactRoutes");
      // ... autres imports

      // ... configuration app

      app.use("/api", contactRoutes); // Ajouter cette ligne
      // ... autres routes

      // ... démarrage serveur
      ```

6.  **Frontend : Mettre à jour la page Contact (`frontend/src/pages/Contact/Contact.jsx`)** (Fichier existant à adapter)

    - Utiliser `useState` pour gérer les champs du formulaire.
    - Créer une fonction `handleSubmit` qui appelle l'API backend avec `axios`.

    ```jsx
    // Contact.jsx (extrait)
    import React, { useState } from 'react';
    import axios from 'axios';

    const Contact = () => {
        const [formData, setFormData] = useState({
            name: '',
            email: '',
            subject: '',
            message: ''
        });
        const [status, setStatus] = useState('');

        const handleChange = (e) => {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            setStatus('Envoi en cours...');
            try {
                const response = await axios.post('http://localhost:4000/api/contact', formData);
                setStatus(response.data.message);
                setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
            } catch (error) {
                setStatus(error.response?.data?.message || 'Erreur lors de l'envoi.');
            }
        };

        return (
            <form onSubmit={handleSubmit}>
                {/* ... Vos champs de formulaire (input pour name, email, subject, textarea pour message) ... */}
                {/* Assurez-vous que les attributs 'name' correspondent aux clés de formData */}
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                {/* ... autres champs ... */}
                <textarea name="message" value={formData.message} onChange={handleChange} required></textarea>
                <button type="submit">Envoyer</button>
                {status && <p>{status}</p>}
            </form>
        );
    };

    export default Contact;
    ```

## 7. Fonctionnalité Mot de Passe Oublié

**Objectif :** Permettre aux utilisateurs de réinitialiser leur mot de passe via email.

**Étapes et Code :**

1.  **Backend : Mettre à jour le modèle User (`backend/src/models/usersModel.js`)**

    - Ajouter des champs pour le token de réinitialisation et sa date d'expiration.

    ```javascript
    // usersModel.js (extrait)
    const userSchema = new mongoose.Schema(
      {
        // ... autres champs
        resetPasswordToken: String,
        resetPasswordExpires: Date,
      },
      { timestamps: true }
    );
    // ... reste du modèle
    ```

2.  **Backend : Modifier le service d'email (`backend/src/services/emailService.js`)**

    - Ajouter une fonction pour envoyer l'email de réinitialisation.

    ```javascript
    // emailService.js (ajout)
    const sendPasswordResetEmail = async (userEmail, token) => {
        const resetUrl = `http://localhost:4200/reset-password/${token}`; // URL Frontend
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: userEmail,
            subject: 'Réinitialisation de votre mot de passe',
            text: `Vous recevez cet email car vous (ou quelqu'un d'autre) avez demandé la réinitialisation du mot de passe de votre compte.\n\n` +
                  `Veuillez cliquer sur le lien suivant, ou collez-le dans votre navigateur pour compléter le processus :\n\n` +
                  `${resetUrl}\n\n` +
                  `Si vous n'avez pas demandé cela, veuillez ignorer cet email et votre mot de passe restera inchangé.\n`
        };
        // ... try/catch similaire à sendContactEmail
        try {
            await transporter.sendMail(mailOptions);
            console.log('Email de réinitialisation envoyé avec succès');
        } catch (error) {
            console.error('Erreur lors de l'envoi de l'email de réinitialisation:', error);
            throw new Error('Échec de l'envoi de l'email');
        }
    };
    // N'oubliez pas d'exporter la nouvelle fonction
    module.exports = { sendContactEmail, sendPasswordResetEmail };
    ```

3.  **Backend : Mettre à jour le contrôleur User (`backend/src/controllers/userController.js`)**

    - Ajouter les fonctions `forgotPassword` et `resetPassword`.
    - Importer `crypto` pour générer le token.

    ```javascript
    // userController.js (extrait)
    const User = require("../models/usersModel");
    const crypto = require("crypto");
    const { sendPasswordResetEmail } = require("../services/emailService");
    const bcrypt = require("bcryptjs"); // Assurez-vous que bcrypt est importé

    // ... autres fonctions

    const forgotPassword = async (req, res) => {
      const { email } = req.body;
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return res
            .status(404)
            .json({ message: "Aucun utilisateur trouvé avec cet email." });
        }

        // Générer le token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // Définir le token et l'expiration sur l'utilisateur
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 heure

        await user.save();

        // Envoyer l'email
        await sendPasswordResetEmail(user.email, resetToken);

        res.status(200).json({ message: "Email de réinitialisation envoyé." });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message: "Erreur serveur lors de la demande de réinitialisation.",
        });
      }
    };

    const resetPassword = async (req, res) => {
      const { token } = req.params;
      const { password } = req.body;

      try {
        const user = await User.findOne({
          resetPasswordToken: token,
          resetPasswordExpires: { $gt: Date.now() }, // Vérifier que le token n'a pas expiré
        });

        if (!user) {
          return res.status(400).json({ message: "Token invalide ou expiré." });
        }

        // Hasher le nouveau mot de passe
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res
          .status(200)
          .json({ message: "Mot de passe réinitialisé avec succès." });
      } catch (error) {
        console.error(error);
        res.status(500).json({
          message:
            "Erreur serveur lors de la réinitialisation du mot de passe.",
        });
      }
    };

    // Exporter les nouvelles fonctions
    module.exports = {
      // ... autres exports
      forgotPassword,
      resetPassword,
    };
    ```

4.  **Backend : Mettre à jour les routes User (`backend/src/routes/userRoutes.js`)**

    - Ajouter les routes pour `forgot-password` et `reset-password`.

    ```javascript
    // userRoutes.js (extrait)
    const {
      // ... autres imports du controller
      forgotPassword,
      resetPassword,
    } = require("../controllers/userController");

    // ... autres routes

    router.post("/forgot-password", forgotPassword);
    router.post("/reset-password/:token", resetPassword);

    // ... module.exports = router;
    ```

5.  **Frontend : Créer la page ForgotPassword (`frontend/src/pages/ForgotPassword/ForgotPassword.jsx`)** (Nouveau fichier)

    - Formulaire simple avec un champ email et un bouton.
    - Appelle l'API `/api/forgot-password`.

    ```jsx
    // ForgotPassword.jsx (exemple simple)
    import React, { useState } from "react";
    import axios from "axios";

    const ForgotPassword = () => {
      const [email, setEmail] = useState("");
      const [message, setMessage] = useState("");

      const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Envoi de la demande...");
        try {
          const response = await axios.post(
            "http://localhost:4000/api/forgot-password",
            { email }
          );
          setMessage(response.data.message);
        } catch (error) {
          setMessage(
            error.response?.data?.message || "Erreur lors de la demande."
          );
        }
      };

      return (
        <div>
          <h2>Mot de passe oublié</h2>
          <form onSubmit={handleSubmit}>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Envoyer l'email de réinitialisation</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      );
    };

    export default ForgotPassword;
    ```

6.  **Frontend : Créer la page ResetPassword (`frontend/src/pages/ResetPassword/ResetPassword.jsx`)** (Nouveau fichier)

    - Récupérer le token depuis l'URL (`useParams` de `react-router-dom`).
    - Formulaire avec champ nouveau mot de passe et confirmation.
    - Appelle l'API `/api/reset-password/:token`.

    ```jsx
    // ResetPassword.jsx (exemple simple)
    import React, { useState } from "react";
    import axios from "axios";
    import { useParams, useNavigate } from "react-router-dom";

    const ResetPassword = () => {
      const { token } = useParams();
      const navigate = useNavigate();
      const [password, setPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");
      const [message, setMessage] = useState("");

      const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          setMessage("Les mots de passe ne correspondent pas.");
          return;
        }
        setMessage("Réinitialisation en cours...");
        try {
          const response = await axios.post(
            `http://localhost:4000/api/reset-password/${token}`,
            { password }
          );
          setMessage(response.data.message + " Vous allez être redirigé...");
          setTimeout(() => navigate("/login"), 3000); // Rediriger vers login
        } catch (error) {
          setMessage(
            error.response?.data?.message ||
              "Erreur lors de la réinitialisation."
          );
        }
      };

      return (
        <div>
          <h2>Réinitialiser le mot de passe</h2>
          <form onSubmit={handleSubmit}>
            <label>Nouveau mot de passe:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Confirmer le mot de passe:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit">Réinitialiser</button>
          </form>
          {message && <p>{message}</p>}
        </div>
      );
    };

    export default ResetPassword;
    ```

7.  **Frontend : Ajouter les routes dans `App.jsx`**

    - Importer les nouvelles pages.
    - Ajouter les `<Route>` correspondantes.

    ```jsx
    // App.jsx (extrait)
    import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
    import ResetPassword from "./pages/ResetPassword/ResetPassword";
    // ... autres imports

    function App() {
      return (
        <Router>
          {/* ... autres routes ... */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* ... autres routes ... */}
        </Router>
      );
    }
    ```

**Important :**

- Ce code est une base. Il faudra l'adapter à votre structure existante, style CSS, gestion d'état globale (si utilisée), etc.
- **Sécurité :** Assurez-vous que la configuration de votre serveur d'envoi d'emails (Gmail dans l'exemple) est sécurisée. Pour Gmail, il faudra peut-être activer "l'accès aux applications moins sécurisées" ou utiliser un "mot de passe d'application" si l'authentification à 2 facteurs est activée.
- **Tests :** Testez minutieusement ces fonctionnalités.
- **Redémarrage :** N'oubliez pas de redémarrer votre serveur backend (`docker-compose restart backend` ou `docker-compose up -d --build backend`) après les modifications backend.
