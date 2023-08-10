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

function startChat() {
    pseudo = document.getElementById("pseudoInput").value;
    logoUrl = document.getElementById("logoUrlInput").value;

    if (pseudo.trim() !== "") {
        document.getElementById("loginContainer").style.display = "none";
        document.getElementById("chatContainer").style.display = "block";
    }
}

function receiveMessage(username, content) {
    const chatBox = document.getElementById("chatBox");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "received");
    messageDiv.innerHTML = `<span class="username">${username}:</span> ${content}`;
    chatBox.appendChild(messageDiv);
}

function sendSiteMessage(username, content) {
    const msg = {
        "content": content,
        "username": pseudo,
        "avatar_url": logoUrl
    };

    fetch(whurl + "?wait=true", {
        "method": "POST",
        "headers": {
            "content-type": "application/json"
        },
        "body": JSON.stringify(msg)
    });

    const chatBox = document.getElementById("chatBox");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "sent");
    messageDiv.innerHTML = `<span class="username">${pseudo}:</span> ${content}`;
    chatBox.appendChild(messageDiv);
}

document.getElementById("messageInput").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});

function censorMessage(message) {
    for (let word of bannedWords) {
        const regex = new RegExp(word, "gi");
        message = message.replace(regex, "*censored*");
    }
    return message;
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
        } else {
            alert("Please wait before sending another message.");
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