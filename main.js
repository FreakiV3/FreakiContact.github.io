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
const auth = firebase.auth();
const database = firebase.database();


var whurl = "https://discord.com/api/webhooks/1139263975163428925/-gORpO2pEFDTEtjYdd5Xzrxiw-66JK_RVvwyK-0uo7zBqPuz3lcN_OxDUqPEr42sVETB"; // Remplacez par l'URL de votre WebHook Discord
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

        const userRef = database.ref("users/" + pseudo);
        userRef.set({ logoUrl });
    }
}

function receiveMessage(username, content) {
    const chatBox = document.getElementById("chatBox");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    if (username === pseudo) {
        messageDiv.classList.add("sent");
        messageDiv.innerHTML = `<span class="username">${username}:</span> ${content}`;
    } else {
        messageDiv.classList.add("received");
        messageDiv.innerHTML = `<span class="username">${username}:</span> ${content}`;
    }

    chatBox.appendChild(messageDiv);

    updateUserActivity(username);
    playMessageSound();
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
            playMessageSound();
        } else {
            alert("Please wait before sending another message.");
            playErrorSound();
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

    const messagesRef = database.ref("messages");
    messagesRef.on("child_added", (snapshot) => {
        const message = snapshot.val();
        const { username, content } = message;
        receiveMessage(username, content);
    });
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
    const msg = {
        content: content,
        username: username,
        avatar_url: logoUrl,
    };

    fetch(whurl + "?wait=true", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(msg),
    });

    const messagesRef = database.ref("messages");
    messagesRef.push({ username: username, content: content });
}

function addUserToList(username, logoUrl) {
    users.push({ username, logoUrl, lastActive: Date.now() });
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
function logout() {
    firebase.auth().signOut()
        .then(() => {
            // Déconnexion réussie
            const userIndex = users.findIndex(user => user.username === pseudo);
            if (userIndex !== -1) {
                users.splice(userIndex, 1);
                updateUsersList();
                // Supprime l'utilisateur de la base de données Firebase
                const currentUserRef = database.ref("users/" + pseudo);
                currentUserRef.remove();
            }
            // Affiche l'écran de connexion à nouveau
            document.getElementById("loginContainer").style.display = "block";
            document.getElementById("chatContainer").style.display = "none";
        })
        .catch(error => {
            console.error("Erreur lors de la déconnexion :", error);
        });
}
function updateUserActivity(username) {
    const user = users.find(user => user.username === username);
    if (user) {
        user.lastActive = Date.now();
    }
}

function removeInactiveUsers() {
    const currentTime = Date.now();
    const inactiveUsers = users.filter(user => (currentTime - user.lastActive) > 600000); // 600000 ms = 10 minutes

    if (inactiveUsers.length > 0) {
        users = users.filter(user => !inactiveUsers.includes(user));
        updateUsersList();
    }
}
setInterval(removeInactiveUsers, 600000);