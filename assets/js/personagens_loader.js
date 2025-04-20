// personagens_loader.js
const personagens = [
  "Guerreiro",
  "Ladino",
  "Mago",
  "Paladino",
  "Barbaro",
  "Arqueiro",
  "Monge",
  "Cavaleiro",
  "Assassino",
  "Druida",
  "Gladiador",
  "Cacador",
  "Mercenario",
  "Feiticeiro",
  "Samurai",
];

// Define characterData como propriedade global do window
window.characterData = {};

function carregarPersonagens() {
  personagens.forEach(function (personagem) {
    const script = document.createElement("script");
    script.src = `./assets/js/personagens/${personagem.toLowerCase()}.js`;
    script.onload = function () {
      window.characterData[personagem] = window[personagem.toLowerCase()];
      console.log("Personagem carregado:", personagem);
    };
    script.onerror = function () {
      console.error("Erro ao carregar personagem:", personagem);
    };
    document.head.appendChild(script);
  });
}

document.addEventListener("DOMContentLoaded", carregarPersonagens);
