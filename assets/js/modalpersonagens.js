// Dados completos dos personagens atualizados conforme a tabela
const characterData = {
  Guerreiro: {
    title: "Guerreiro",
    name: "Vegeta",
    life: 32,
    damage: 3,
    armor: 4,
    dodge: 2,
    weight: 4,
    stamina: 6,
    specialDice: "Golpe Brutal: +1D8 no ataque",
    cost: "2 Stamina",
    penalty: "-1 Armadura no próximo turno",
  },
  Ladino: {
    title: "Ladino",
    name: "Mulher Gato",
    life: 26,
    damage: 2,
    armor: 2,
    dodge: 5,
    weight: 1,
    stamina: 6,
    specialDice: "Ataque Furtivo: +1D10 no ataque",
    cost: "3 Stamina",
    penalty: "Só pode usar a cada 2 turnos",
  },
  Mago: {
    title: "Mago",
    name: "Patolino",
    life: 20,
    damage: 4,
    armor: 1,
    dodge: 4,
    weight: 2,
    stamina: 6,
    specialDice: "Bola de Fogo: +1D12 no ataque",
    cost: "3 Mana",
    penalty: "-2 Esquiva no próximo turno",
  },
  Paladino: {
    title: "Paladino",
    name: "Garen",
    life: 36,
    damage: 3,
    armor: 4,
    dodge: 2,
    weight: 3,
    stamina: 6,
    specialDice: "Ira Sagrada: +1D8 no ataque",
    cost: "2 Stamina",
    penalty: "Sofre 2 de dano direto após o uso",
  },
  Barbaro: {
    title: "Bárbaro",
    name: "Konan",
    life: 34,
    damage: 4,
    armor: 3,
    dodge: 2,
    weight: 3,
    stamina: 6,
    specialDice: "Fúria Primordial: +1D12 no ataque (se vida ≤15)",
    cost: "6 Stamina",
    penalty: "Só pode usar uma vez por combate",
  },
  Arqueiro: {
    title: "Arqueiro",
    name: "Legolas",
    life: 26,
    damage: 3,
    armor: 2,
    dodge: 4,
    weight: 1,
    stamina: 6,
    specialDice: "Tiro Certeiro: +1D8 no ataque",
    cost: "2 Stamina",
    penalty: "-1 Esquiva no próximo turno",
  },
  Monge: {
    title: "Monge",
    name: "Liu Kang",
    life: 30,
    damage: 3,
    armor: 3,
    dodge: 5,
    weight: 0,
    stamina: 6,
    specialDice: "Golpe Interior: +1D8 no ataque",
    cost: "2 Stamina",
    penalty: "-1 Armadura após o uso",
  },
  Cavaleiro: {
    title: "Cavaleiro",
    name: "Seiya",
    life: 35,
    damage: 3,
    armor: 5,
    dodge: 2,
    weight: 4,
    stamina: 6,
    specialDice: "Investida de Ferro: +1D8 no ataque",
    cost: "3 Stamina",
    penalty: "-1 Esquiva no próximo turno",
  },
  Assassino: {
    title: "Assassino",
    name: "Ezio",
    life: 25,
    damage: 4,
    armor: 2,
    dodge: 4,
    weight: 1,
    stamina: 6,
    specialDice: "Execução Silenciosa: +1D10 no ataque (se D20 ≥16)",
    cost: "3 Stamina",
    penalty: "Só ativa com D20 ≥16",
  },
  Druida: {
    title: "Druida",
    name: "Malfurion",
    life: 30,
    damage: 3,
    armor: 3,
    dodge: 3,
    weight: 2,
    stamina: 6,
    specialDice: "Espinhos Naturais: +1D8 no ataque",
    cost: "3 Mana",
    penalty: "Máx. 2 usos por combate. Causa 1 de dano ao usuário",
  },
  Gladiador: {
    title: "Gladiador",
    name: "Maximus",
    life: 34,
    damage: 4,
    armor: 4,
    dodge: 2,
    weight: 3,
    stamina: 6,
    specialDice: "Força Impiedosa: +1D8 no ataque",
    cost: "2 Stamina",
    penalty: "Máx. 3 vezes por combate. Fica indisponível no próximo turno",
  },
  Cacador: {
    title: "Caçador",
    name: "Hisoka",
    life: 27,
    damage: 3,
    armor: 3,
    dodge: 4,
    weight: 2,
    stamina: 6,
    specialDice: "Disparo Selvagem: +1D12 no ataque",
    cost: "3 Stamina",
    penalty: "Só pode usar a cada 5 turnos",
  },
  Mercenario: {
    title: "Mercenário",
    name: "Deadpool",
    life: 30,
    damage: 3,
    armor: 4,
    dodge: 3,
    weight: 3,
    stamina: 6,
    specialDice:
      "Retaliação Precisa: +1D10 no ataque após esquiva bem-sucedida",
    cost: "2 Stamina",
    penalty: "Só se tiver >30% da Vida. Máx. 3 usos por combate",
  },
  Feiticeiro: {
    title: "Feiticeiro",
    name: "Dr. Estranho",
    life: 20,
    damage: 4,
    armor: 1,
    dodge: 3,
    weight: 2,
    stamina: 6,
    specialDice: "Explosão Arcana: +1D12 no ataque",
    cost: "3 Mana",
    penalty: "Perde 50% da Vida atual. Não pode usar com 1 de Vida",
  },
  Samurai: {
    title: "Samurai",
    name: "Kenshin",
    life: 30,
    damage: 4,
    armor: 4,
    dodge: 3,
    weight: 3,
    stamina: 6,
    specialDice:
      "Espírito Afiado: +1D10 no ataque (se não usou habilidade no turno anterior)",
    cost: "3 Stamina",
    penalty: "Só pode usar 2 vezes por combate",
  },
};

// Função para abrir o modal e carregar os dados do personagem
function openModal(character) {
  document.getElementById(
    "characterImage"
  ).src = `./assets/images/${character.toLowerCase()}.jpeg`;

  if (characterData[character]) {
    const char = characterData[character];

    document.getElementById("characterTitle").textContent = char.title;
    document.getElementById("characterLife").textContent = char.life;
    document.getElementById("characterDamage").textContent = char.damage;
    document.getElementById("characterArmor").textContent = char.armor;
    document.getElementById("characterDodge").textContent = char.dodge;
    document.getElementById("characterWeight").textContent = char.weight;
    document.getElementById("characterStamina").textContent = char.stamina;
    document.getElementById("characterSkill").textContent = char.specialDice;
    document.getElementById("characterCost").textContent = char.cost;
    document.getElementById("characterPenalty").textContent = char.penalty;

    var modal = new bootstrap.Modal(document.getElementById("characterModal"));
    modal.show();
  } else {
    console.error("Personagem não encontrado: " + character);
  }
}

// Função para fechar o modal
function closeModal() {
  var modal = bootstrap.Modal.getInstance(
    document.getElementById("characterModal")
  );
  modal.hide();
}
