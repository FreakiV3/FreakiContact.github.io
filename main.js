const firebaseConfig = {
  apiKey: "AIzaSyDJG_SyLEOFJLQVWaKbOKy-on3axEiRwZo",
  authDomain: "utopian-spring-378808.firebaseapp.com",
  databaseURL: "https://utopian-spring-378808-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "utopian-spring-378808",
  storageBucket: "utopian-spring-378808.appspot.com",
  messagingSenderId: "8495813117",
  appId: "1:8495813117:web:9dc5b7c89fd23996128994"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

var whurl = "https://discord.com/api/webhooks/1139166261134241824/cXJOTyO_HZ83msBSQJaYEfl8Mbp6S0n4QHb508Ymps975xjLougR709H515HnsH_bOHG"; // Remplacez par l'URL de votre WebHook Discord
var pseudo = "";
var logoUrl = "";
var lastMessageTime = 0; // Pour éviter les spams
var spamInterval = 3000; // Temps minimum entre les messages (en millisecondes)
var bannedWords = [
    "Bélître", "Puterelle", "Butor", "Cuistre", "Faquin", "Orchidoclaste", "Faraud",
    "Fesse-mathieu", "Nodocéphale", "Alburostre", "Forban", "Foutriquet", "Fripon",
    "Ganache", "Fot-en-cul", "Gaupe", "Godiche", "Gougnafier", "Houlier", "Gourgandine",
    "Jean-Foutre", "Malappris", "Malotru", "Maraud", "Maroufle", "Mufle", "Olibrius",
    "Ostrogoth", "Paltoquet", "Pignouf", "Pisse-Froid", "Pourceau", "Ribaud", "Sagouin",
    "gueule", "Casse-couilles", "Abruti", "Con", "conne", "Tocard", "Pute", "Salope",
    "Enculer", "Negro", "Negre"
];

var emotPanelOpen = false; // Variable pour suivre l'état du panneau des émoticônes
var users = []; // Liste des utilisateurs connectés

var messageSound = new Audio("SoundPopup/message.mp3");
var errorSound = new Audio("SoundPopup/error.mp3");

function startChat() {
    pseudo = document.getElementById("pseudoInput").value;
    logoUrl = document.getElementById("logoUrlInput").value;

    if (pseudo.trim() !== "") {
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("chatContainer").style.display = "block";
        addUserToList(pseudo, logoUrl);
        updateUsersList();

        // Ajoutez ceci pour enlever l'utilisateur lorsqu'il quitte la page
        window.addEventListener("beforeunload", removeUserOnUnload);
    }
}


function receiveMessage(username, content) {
    const chatBox = document.getElementById("chatBox");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "received");
    messageDiv.innerHTML = `<span class="username">${username}:</span> ${content}`;
    chatBox.appendChild(messageDiv);

    playMessageSound(); // Jouer le son de notification
}

function playMessageSound() {
    messageSound.play();
}

function playErrorSound() {
    errorSound.play();
}

function addUserToList(username, logoUrl) {
    users.push({ username, logoUrl });
    updateUsersList();
}

function removeUserFromList(username) {
    users = users.filter(user => user.username !== username);
    updateUsersList();
}

function updateUsersList() {
    const usersList = document.getElementById("usersList");
    usersList.innerHTML = "";
    users.forEach(user => {
        const userDiv = document.createElement("div");
        userDiv.classList.add("user");
        userDiv.innerHTML = `<img src="${user.logoUrl}" alt="${user.username}">${user.username}`;
        usersList.appendChild(userDiv);
    });
}

function updateUserLogo(username, newLogoUrl) {
    const user = users.find(user => user.username === username);
    if (user) {
        user.logoUrl = newLogoUrl;
        updateUsersList();
    }
}

function updateUsersList() {
    const usersList = document.getElementById("usersList");
    usersList.innerHTML = "";
    users.forEach(user => {
        const userDiv = document.createElement("div");
        userDiv.classList.add("user");
        userDiv.innerHTML = `<img src="${user.logoUrl}" alt="${user.username}">${user.username}`;
        usersList.appendChild(userDiv);
    });
}

function sendMessage() {
    const content = document.getElementById("messageInput").value;
    if (content.trim() !== "") {
        const currentTime = new Date().getTime();
        if (currentTime - lastMessageTime >= spamInterval) {
            lastMessageTime = currentTime;

            const censoredContent = censorMessage(content);
            sendSiteMessage(pseudo, censoredContent);
            document.getElementById("messageInput").value = "";
            playMessageSound(); // Jouer le son de notification
        } else {
            alert("Please wait before sending another message.");
            playErrorSound(); // Jouer le son d'erreur
        }
    }
}

function toggleEmotPanel() {
    const emotPanel = document.getElementById("emotPanel");
    emotPanelOpen = !emotPanelOpen;
    if (emotPanelOpen) {
        emotPanel.style.display = "block";
    } else {
        emotPanel.style.display = "none";
    }
}

function insertEmot(emotCode) {
    const messageInput = document.getElementById("messageInput");
    const currentContent = messageInput.value;
    messageInput.value = currentContent + " " + emotCode + " ";
    const emotPanel = document.getElementById("emotPanel");
    emotPanel.style.display = "none";
}

function toggleSettingsMenu() {
    const settingsMenu = document.getElementById("settingsMenu");
    settingsMenu.classList.toggle("active");
}

function closeSettingsMenu() {
    const settingsMenu = document.getElementById("settingsMenu");
    settingsMenu.classList.remove("active");
}

function changeBackground(backgroundUrl) {
    document.body.style.backgroundImage = `url(${backgroundUrl})`;
    closeSettingsMenu();
}

function loadEmotIcons() {
    const emotPanel = document.getElementById("emotPanel");
    emotPanel.innerHTML = "";

    const emotList = [
        "jellpog", "hollow", "flushedpoint", "chocolasmug",
        "blushpensiveconcern", "aqualewd", "PinguHM", "PP_PeppaBlocked",
        "PP_GeorgeBall", "PP_GeorgeDragon", "Freaki", "2487pleadingseal",
        "1013moneyz"
    ];

    emotList.forEach(emot => {
        const img = document.createElement("img");
        img.src = `Emot/${emot}.png`;
        img.alt = emot;
        img.addEventListener("click", () => insertEmot(`:${emot}:`));
        emotPanel.appendChild(img);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadEmotIcons();
});

function censorMessage(message) {
    const words = message.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (bannedWords.includes(words[i].toLowerCase())) {
            words[i] = "*".repeat(words[i].length);
        }
    }
    return words.join(" ");
}

function sendSiteMessage(username, content) {
    const chatBox = document.getElementById("chatBox");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "sent");
    messageDiv.innerHTML = `<span class="username">${username}:</span> ${content}`;
    chatBox.appendChild(messageDiv);

    const msg = {
        content: content,
        username: username,
        avatar_url: logoUrl, // Ajoutez cette ligne pour spécifier l'URL de la photo de profil
    };

    fetch(whurl + "?wait=true", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(msg),
    });
}
function addUserToList(username, logoUrl) {
    users.push({ username, logoUrl });
}

function updateUserLogo(username, newLogoUrl) {
    const user = users.find(user => user.username === username);
    if (user) {
        user.logoUrl = newLogoUrl;
        updateUsersList();
    }
}
document.addEventListener("DOMContentLoaded", () => {
    loadEmotIcons();
    
    const usersRef = database.ref("users");
    usersRef.on("child_added", (snapshot) => {
        const username = snapshot.key;
        const logoUrl = snapshot.val().logoUrl;
        if (!users.some(user => user.username === username)) {
            addUserToList(username, logoUrl);
            updateUsersList();
        }
    });

    usersRef.on("child_removed", (snapshot) => {
        const username = snapshot.key;
        users = users.filter(user => user.username !== username);
        updateUsersList();
    });

    usersRef.on("child_changed", (snapshot) => {
        const username = snapshot.key;
        const newLogoUrl = snapshot.val().logoUrl;
        updateUserLogo(username, newLogoUrl);
    });
});

function removeUserOnUnload() {
    if (pseudo !== "") {
        const userIndex = users.findIndex(user => user.username === pseudo);
        if (userIndex !== -1) {
            users.splice(userIndex, 1);
            updateUsersList();
        }
    }
}

window.addEventListener("beforeunload", removeUserOnUnload);
