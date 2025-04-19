// Dados dos personagens com base na tabela
const characterData = {
  Guerreiro: {
    title: "Guerreiro",
    name: "Vegeta",
    life: 30,
    damage: 3,
    armor: 5,
    dodge: 2,
    weight: 4,
    stamina: 6,
    specialDice: "D8 extra no ataque",
    cost: "2 Stamina",
    penalty: "-1 defesa no turno seguinte",
  },
  Ladino: {
    title: "Ladino",
    name: "Mulher Gato",
    life: 25,
    damage: 2,
    armor: 2,
    dodge: 5,
    weight: 1,
    stamina: 6,
    specialDice: "D10 extra no ataque (se não foi atacado)",
    cost: "3 Stamina",
    penalty: "Só pode ser usado 2 vezes no jogo",
  },
  Mago: {
    title: "Mago",
    name: "Patolino",
    life: 20,
    damage: 4,
    armor: 1,
    dodge: 3,
    weight: 2,
    stamina: 9,
    specialDice: "D12 extra no ataque",
    cost: "3 Mana",
    penalty: "-1 esquiva no turno seguinte",
  },
  Paladino: {
    title: "Paladino",
    name: "Garen",
    life: 35,
    damage: 3,
    armor: 4,
    dodge: 3,
    weight: 3,
    stamina: 6,
    specialDice: "D8 extra na defesa",
    cost: "2 Stamina",
    penalty: "-2 no próximo ataque",
  },
  Barbaro: {
    title: "Barbaro",
    name: "Konan",
    life: 35,
    damage: 4,
    armor: 3,
    dodge: 3,
    weight: 3,
    stamina: 6,
    specialDice: "D10 extra no ataque (se vida < 15)",
    cost: "6 Stamina",
    penalty: "Só pode ser usado uma vez por combate",
  },
  Arqueiro: {
    title: "Arqueiro",
    name: "Legolas",
    life: 25,
    damage: 3,
    armor: 2,
    dodge: 4,
    weight: 1,
    stamina: 6,
    specialDice: "D8 extra no ataque",
    cost: "2 Stamina",
    penalty: "-1 esquiva no turno seguinte",
  },
  Monge: {
    title: "Monge",
    name: "Liu Kang",
    life: 30,
    damage: 2,
    armor: 3,
    dodge: 5,
    weight: 0,
    stamina: 6,
    specialDice: "D6 extra ao esquivar",
    cost: "2 Stamina",
    penalty: "-1 dano no próximo ataque",
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
    specialDice: "Ignora um ataque fraco/médio",
    cost: "3 Stamina",
    penalty: "Não pode atacar no turno seguinte",
  },
  Assassino: {
    title: "Assassino",
    name: "Vetor",
    life: 25,
    damage: 4,
    armor: 2,
    dodge: 4,
    weight: 1,
    stamina: 6,
    specialDice: "D12 extra no ataque (se D20 for 20)",
    cost: "3 Stamina",
    penalty: "Custa 3 Stamina adicionais se falhar",
  },
  Druida: {
    title: "Druida",
    name: "Branca de Neve",
    life: 30,
    damage: 3,
    armor: 3,
    dodge: 3,
    weight: 2,
    stamina: 9,
    specialDice: "D8 extra para recuperar vida",
    cost: "3 Mana",
    penalty: "Só pode ser usado 3 vezes por combate",
  },
  Gladiador: {
    title: "Gladiador",
    name: "Maximus",
    life: 35,
    damage: 4,
    armor: 4,
    dodge: 2,
    weight: 3,
    stamina: 6,
    specialDice: "D6 extra para reduzir dano recebido",
    cost: "2 Stamina",
    penalty: "Não pode usar outra habilidade no próximo turno",
  },
  Cacador: {
    title: "Cacador",
    name: "Hisoka",
    life: 25,
    damage: 3,
    armor: 3,
    dodge: 4,
    weight: 2,
    stamina: 6,
    specialDice: "Oponente rola D12 em vez de D20 para esquiva",
    cost: "3 Stamina",
    penalty: "Só pode ser usado a cada 3 turnos",
  },
  Mercenario: {
    title: "Mercenario",
    name: "Lady Deadpool",
    life: 30,
    damage: 3,
    armor: 4,
    dodge: 3,
    weight: 3,
    stamina: 6,
    specialDice: "D6 extra no contra-ataque (se esquivar)",
    cost: "2 Stamina",
    penalty: "-1 esquiva no turno seguinte",
  },
  Feiticeiro: {
    title: "Feiticeiro",
    name: "Harry Potter",
    life: 20,
    damage: 4,
    armor: 1,
    dodge: 3,
    weight: 2,
    stamina: 9,
    specialDice: "D20 extra no ataque",
    cost: "3 Mana",
    penalty: "Reduz 2 de vida ao usar",
  },
  Samurai: {
    title: "Samurai",
    name: "Kenshin Himura",
    life: 30,
    damage: 4,
    armor: 4,
    dodge: 3,
    weight: 3,
    stamina: 6,
    specialDice:
      "D10 extra no ataque (se não usou habilidade no turno anterior)",
    cost: "3 Stamina",
    penalty: "Só pode ser usado 2 vezes por combate",
  },
};

// Função para abrir o modal e carregar os dados do personagem
function openModal(character) {
  document.getElementById(
    "characterImage"
  ).src = `./assets/images/${character.toLowerCase()}.jpeg`;
  // Verificar se o personagem existe na lista de dados
  if (characterData[character]) {
    // Atualiza as informações do modal com os dados do personagem selecionado
    document.getElementById("characterTitle").textContent =
      characterData[character].title; // Nome do personagem
    document.getElementById("characterLife").textContent =
      characterData[character].life; // Vida do personagem
    document.getElementById("characterDamage").textContent =
      characterData[character].damage; // Dano causado pelo personagem
    document.getElementById("characterArmor").textContent =
      characterData[character].armor; // Armadura do personagem
    document.getElementById("characterDodge").textContent =
      characterData[character].dodge; // Habilidade de esquiva do personagem
    document.getElementById("characterWeight").textContent =
      characterData[character].weight; // Peso do personagem
    document.getElementById("characterStamina").textContent =
      characterData[character].stamina; // Stamina do personagem
    document.getElementById("characterSkill").textContent =
      characterData[character].specialDice; // Habilidade especial do personagem (corrigido para specialDice)
    document.getElementById("characterCost").textContent =
      characterData[character].cost; // Custo da habilidade especial
    document.getElementById("characterPenalty").textContent =
      characterData[character].penalty; // Penalidade por usar a habilidade

    // Exibe o modal utilizando o método show() do Bootstrap
    var modal = new bootstrap.Modal(document.getElementById("characterModal"));
    modal.show();
  } else {
    // Se o personagem não existir, exibe um erro no console
    console.error("Personagem não encontrado: " + character);
  }
}

// Função para fechar o modal
function closeModal() {
  // Obtém a instância do modal do Bootstrap
  var modal = bootstrap.Modal.getInstance(
    document.getElementById("characterModal")
  );
  // Fecha o modal
  modal.hide();

  // Exemplo de como obter os personagens selecionados
  const urlParams = new URLSearchParams(window.location.search);
  const player1Character = urlParams.get("player1Character");
  const player2Character = urlParams.get("player2Character");

  // Carregar os arquivos JS dos personagens
  if (player1Character) {
    const script1 = document.createElement("script");
    script1.src = `./js/${player1Character}.js`;
    document.head.appendChild(script1);
  }

  if (player2Character) {
    const script2 = document.createElement("script");
    script2.src = `./js/${player2Character}.js`;
    document.head.appendChild(script2);
  }
}
