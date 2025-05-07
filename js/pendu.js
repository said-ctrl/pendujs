// Importation du dictionnaire
import { words } from './dico.js';

let motOriginal;
let motSecret;
let motAffiche;
let tentativesRestantes;
let lettresDevinees = [];

const boutonRejouer = document.getElementById('rejouer');

// Fonction pour enlever les accents d'un mot (garde espaces et tirets)
function enleverAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Fonction d'initialisation du jeu
function commencerJeu() {
    motOriginal = words[Math.floor(Math.random() * words.length)];
    motSecret = enleverAccents(motOriginal); // utilisé pour la logique

    console.log("Mot sélectionné :", motOriginal);

    motAffiche = motOriginal.split('').map(char => {
       // Remplacer toutes les lettres par un underscore sauf les espaces et tirets
       return (char === ' ' || char === '-') ? ' ' : '_';
    });

    tentativesRestantes = 9;
    lettresDevinees = [];

    document.getElementById('board').textContent = motAffiche.join(' ');
    document.getElementById('message').textContent = `Vous avez ${tentativesRestantes} tentatives restantes.`;
    document.getElementById('image-pendu').src = './images/0.png';
    boutonRejouer.classList.add('hidden');

    afficherClavier();
}

// Génère le clavier avec Tailwind
function afficherClavier() {
    const alphabet = "abcdefghijklmnopqrstuvwxyz".split('');
    const keyboardDiv = document.getElementById('keyboard');
    keyboardDiv.innerHTML = '';

    alphabet.forEach(letter => {
        const button = document.createElement('button');
        button.textContent = letter;
        button.className = 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 m-1 rounded uppercase';
        button.onclick = () => testerLettre(letter);
        keyboardDiv.appendChild(button);
    });
}

// Gère les clics sur les lettres
function testerLettre(letter) {
    letter = enleverAccents(letter);

    if (lettresDevinees.includes(letter)) return;
    lettresDevinees.push(letter);

    let trouve = false;

    for (let i = 0; i < motSecret.length; i++) {
        if (motSecret[i] === letter) {
            motAffiche[i] = motOriginal[i]; // réinsère la lettre d'origine (avec accent si besoin)
            trouve = true;
        }
    }

const board = document.getElementById('board');
board.innerHTML = '';
motAffiche.forEach(char => {
    const span = document.createElement('span');
    span.textContent = char;
    span.className = 'inline-block mx-1 text-2xl';
    board.appendChild(span);
})

    if (trouve) {
        if (motAffiche.join('') === motOriginal) {
            document.getElementById('message').textContent = 'Félicitations, vous avez gagné ! 🎉';
            document.getElementById('image-pendu').src = './images/win.png';
            désactiverClavier();
            boutonRejouer.classList.remove('hidden');
        }
    } else {
        tentativesRestantes--;
        document.getElementById('message').textContent = `Il vous reste ${tentativesRestantes} tentatives.`;
        document.getElementById('image-pendu').src = `./images/${9 - tentativesRestantes}.png`;

        if (tentativesRestantes === 0) {
            document.getElementById('message').textContent = `Vous avez perdu ! Le mot était "${motOriginal}".`;
            désactiverClavier();
            boutonRejouer.classList.remove('hidden');
        }
    }
}

// Désactive les boutons du clavier
function désactiverClavier() {
    const buttons = document.querySelectorAll('#keyboard button');
    buttons.forEach(button => {
        button.disabled = true;
        button.classList.add('opacity-50', 'cursor-not-allowed');
    });
}

// Bouton rejouer
boutonRejouer.addEventListener('click', () => {
    boutonRejouer.classList.add('hidden');
    commencerJeu();
});

// Démarrage initial du jeu
commencerJeu();
