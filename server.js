const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = 3000;

app.post('/api/receive-message', (req, res) => {
    const content = req.body.content; // Supposant que le contenu soit envoyé dans le corps de la requête

    // Traitez le contenu comme nécessaire, par exemple en le sauvegardant dans une base de données

    res.json({ success: true }); // Renvoie une réponse au bot Discord
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
