// Definir PenalidadesAtivas globalmente
window.PenalidadesAtivas = {
  player1: { defesa: 0, esquiva: 0, dano: 0 },
  player2: { defesa: 0, esquiva: 0, dano: 0 },
};

window.DanoSystem = {
  // Configurações completas de todas as classes conforme tabela
  ClassConfig: {
    Guerreiro: {
      dice: "D8",
      cost: 2,
      resource: "staminaMana",
      effect: function (attacker) {
        DanoSystem.registerPenalty(attacker.playerId, "defesa", 1);
      },
      description: "Golpe Brutal: +1D8 no ataque",
      conditions: [],
    },
    Ladino: {
      dice: "D10",
      cost: 3,
      resource: "staminaMana",
      effect: function (attacker) {
        attacker.nextAvailableTurn = GerenciadorTurnos.estado.turnoAtual + 2;
      },
      description: "Ataque Furtivo: +1D10 no ataque",
      conditions: [
        {
          condicao: (char) =>
            char.nextAvailableTurn > GerenciadorTurnos.estado.turnoAtual,
          mensagem: "Ataque Furtivo só pode ser usado a cada 2 turnos!",
        },
      ],
    },
    Mago: {
      dice: "D12",
      cost: 3,
      resource: "mana",
      effect: function (attacker) {
        DanoSystem.registerPenalty(attacker.playerId, "esquiva", 2);
      },
      description: "Bola de Fogo: +1D12 no ataque",
      conditions: [],
    },
    Paladino: {
      dice: "D8",
      cost: 2,
      resource: "staminaMana",
      effect: function (attacker) {
        attacker.vida = Math.max(1, attacker.vida - 2);
        atualizarInterfacePersonagem(
          attacker.playerId === "player1" ? 1 : 2,
          attacker
        );
      },
      description: "Ira Sagrada: +1D8 no ataque",
      conditions: [],
    },
    Bárbaro: {
      dice: "D12",
      cost: 6,
      resource: "staminaMana",
      effect: function (attacker) {
        attacker.usedThisCombat = true;
      },
      description: "Fúria Primordial: +1D12 no ataque (se vida ≤15)",
      conditions: [
        {
          condicao: (char) => char.vida > 15,
          mensagem: "Fúria só pode ser usada com vida ≤15!",
        },
        {
          condicao: (char) => char.usedThisCombat,
          mensagem: "Fúria só pode ser usada 1x por combate!",
        },
      ],
    },
    Arqueiro: {
      dice: "D8",
      cost: 2,
      resource: "staminaMana",
      effect: function (attacker) {
        DanoSystem.registerPenalty(attacker.playerId, "esquiva", 1);
      },
      description: "Tiro Certeiro: +1D8 no ataque",
      conditions: [],
    },
    Monge: {
      dice: "D8",
      cost: 2,
      resource: "staminaMana",
      effect: function (attacker) {
        DanoSystem.registerPenalty(attacker.playerId, "defesa", 1);
      },
      description: "Golpe Interior: +1D8 no ataque",
      conditions: [],
    },
    Cavaleiro: {
      dice: "D8",
      cost: 3,
      resource: "staminaMana",
      effect: function (attacker) {
        DanoSystem.registerPenalty(attacker.playerId, "esquiva", 1);
      },
      description: "Investida de Ferro: +1D8 no ataque",
      conditions: [],
    },
    Assassino: {
      dice: "D10",
      cost: 3,
      resource: "staminaMana",
      effect: null,
      description: "Execução Silenciosa: +1D10 no ataque se tirar ≥16 no D20",
      conditions: [
        {
          condicao: (char) => DadosManager.dadosRolados[char.playerId].d20 < 16,
          mensagem: "Execução Silenciosa requer D20 ≥16!",
        },
      ],
    },
    Druida: {
      dice: "D8",
      cost: 3,
      resource: "mana",
      effect: function (attacker) {
        attacker.vida = Math.max(1, attacker.vida - 1);
        attacker.usesThisCombat = (attacker.usesThisCombat || 0) + 1;
        atualizarInterfacePersonagem(
          attacker.playerId === "player1" ? 1 : 2,
          attacker
        );
      },
      description: "Espinhos Naturais: +1D8 no ataque",
      conditions: [
        {
          condicao: (char) => (char.usesThisCombat || 0) >= 2,
          mensagem: "Espinhos Naturais só pode ser usado 2x por combate!",
        },
      ],
    },
    Gladiador: {
      dice: "D8",
      cost: 2,
      resource: "staminaMana",
      effect: function (attacker) {
        attacker.penaltyActive = true;
        attacker.usesThisCombat = (attacker.usesThisCombat || 0) + 1;
      },
      description: "Força Impiedosa: +1D8 no ataque",
      conditions: [
        {
          condicao: (char) => (char.usesThisCombat || 0) >= 3,
          mensagem: "Força Impiedosa só pode ser usado 3x por combate!",
        },
      ],
    },
    Caçador: {
      dice: "D12",
      cost: 3,
      resource: "staminaMana",
      effect: function (attacker) {
        attacker.nextAvailableTurn = GerenciadorTurnos.estado.turnoAtual + 5;
      },
      description: "Disparo Selvagem: +1D12 no ataque",
      conditions: [
        {
          condicao: (char) =>
            char.nextAvailableTurn > GerenciadorTurnos.estado.turnoAtual,
          mensagem: "Disparo Selvagem só pode ser usado a cada 5 turnos!",
        },
      ],
    },
    Mercenário: {
      dice: "D10",
      cost: 2,
      resource: "staminaMana",
      effect: function (attacker) {
        attacker.usesThisCombat = (attacker.usesThisCombat || 0) + 1;
      },
      description:
        "Retaliação Precisa: +1D10 no ataque após esquiva bem-sucedida",
      conditions: [
        {
          condicao: (char) => char.vida <= char.vidaMaxima * 0.3,
          mensagem: "Retaliação Precisa requer vida >30%!",
        },
        {
          condicao: (char) => (char.usesThisCombat || 0) >= 3,
          mensagem: "Retaliação Precisa só pode ser usado 3x por combate!",
        },
      ],
    },
    Feiticeiro: {
      dice: "D12",
      cost: 3,
      resource: "mana",
      effect: function (attacker) {
        attacker.vida = Math.max(1, Math.floor(attacker.vida / 2));
        atualizarInterfacePersonagem(
          attacker.playerId === "player1" ? 1 : 2,
          attacker
        );
      },
      description: "Explosão Arcana: +1D12 no ataque",
      conditions: [
        {
          condicao: (char) => char.vida <= 1,
          mensagem: "Explosão Arcana não pode ser usada com 1 de vida!",
        },
      ],
    },
    Samurai: {
      dice: "D10",
      cost: 3,
      resource: "staminaMana",
      effect: function (attacker) {
        attacker.usedAbilityLastTurn = true;
        attacker.usesThisCombat = (attacker.usesThisCombat || 0) + 1;
      },
      description:
        "Espírito Afiado: +1D10 no ataque (se não usou habilidade no turno anterior)",
      conditions: [
        {
          condicao: (char) => char.usedAbilityLastTurn,
          mensagem:
            "Espírito Afiado não pode ser usado em turnos consecutivos!",
        },
        {
          condicao: (char) => (char.usesThisCombat || 0) >= 2,
          mensagem: "Espírito Afiado só pode ser usado 2x por combate!",
        },
      ],
    },
  },

  // Métodos auxiliares (manter os mesmos do código anterior)
  parseDanoBase: function (dano) {
    if (typeof dano === "number") return dano;
    if (typeof dano === "string") {
      const num = parseInt(dano.replace(/\D/g, ""));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  },

  calcularDano: function (jogador, tipoDado, resultado) {
    const atacante =
      jogador === 1 ? window.player1Character : window.player2Character;
    const defensor =
      jogador === 1 ? window.player2Character : window.player1Character;

    if (!atacante || !defensor) {
      console.error("Personagens não definidos!");
      return 0;
    }

    const config = this.ClassConfig[atacante.classe] || {};

    // Verificar esquiva com penalidades
    const esquivaTotal = Math.max(
      0,
      defensor.esquiva -
        (PenalidadesAtivas[`player${jogador === 1 ? 2 : 1}`].esquiva || 0)
    );
    if (Math.random() < esquivaTotal / 100) {
      this.logAction(`${defensor.nome} esquivou do ataque!`);
      return 0;
    }

    // Calcular dano base
    const danoBase = this.parseDanoBase(atacante.danoBase);
    const bonusDado = parseInt(resultado) || 0;
    const armadura = Math.max(
      0,
      this.parseDanoBase(defensor.armadura) -
        (PenalidadesAtivas[`player${jogador === 1 ? 2 : 1}`].defesa || 0)
    );

    let danoTotal = Math.max(1, danoBase + bonusDado - armadura);

    // Verificar crítico
    const faces = parseInt(tipoDado.substring(1));
    if (resultado === faces) {
      danoTotal = Math.floor(danoTotal * 1.5);
      this.logAction(`${atacante.nome} acertou um golpe crítico!`);
    }

    // Aplicar penalidades de dano
    danoTotal += PenalidadesAtivas[`player${jogador === 1 ? 2 : 1}`].dano || 0;

    return Math.max(0, danoTotal);
  },

  verificarRestricoes: function (jogador, tipoDado) {
    const personagem =
      jogador === 1 ? window.player1Character : window.player2Character;
    if (!personagem) return false;

    const config = this.ClassConfig[personagem.classe] || {};

    if (tipoDado === config.dice) {
      for (const condicao of config.conditions || []) {
        if (condicao.condicao(personagem)) {
          this.showAlert(condicao.mensagem);
          return false;
        }
      }
    }

    return true;
  },

  aplicarCustoHabilidade: function (jogador, tipoDado) {
    const personagem =
      jogador === 1 ? window.player1Character : window.player2Character;
    if (!personagem) return false;

    const config = this.ClassConfig[personagem.classe] || {};

    if (tipoDado === config.dice) {
      if ((personagem[config.resource] || 0) < config.cost) {
        this.showAlert("Recursos insuficientes para usar esta habilidade!");
        return false;
      }

      personagem[config.resource] =
        (personagem[config.resource] || 0) - config.cost;
      const staminaElement = document.getElementById(`player${jogador}Stamina`);
      if (staminaElement) {
        staminaElement.textContent = `${personagem[config.resource]}/${
          personagem.staminaManaMax
        }`;
      }
    }

    return true;
  },

  aplicarEfeitosPosHabilidade: function (jogador, tipoDado) {
    const personagem =
      jogador === 1 ? window.player1Character : window.player2Character;
    if (!personagem) return;

    const config = this.ClassConfig[personagem.classe] || {};

    if (tipoDado === config.dice && config.effect) {
      try {
        config.effect(personagem);
      } catch (e) {
        console.error("Erro ao aplicar efeito da habilidade:", e);
      }
    }

    personagem.foiAtacado = true;
  },

  registerPenalty: function (playerId, type, value) {
    const targetPlayer =
      typeof playerId === "number"
        ? playerId === 1
          ? "player1"
          : "player2"
        : playerId;

    if (
      PenalidadesAtivas[targetPlayer] &&
      typeof PenalidadesAtivas[targetPlayer][type] === "number"
    ) {
      PenalidadesAtivas[targetPlayer][type] += value;
    }

    if (window.atualizarPenalidadesInterface) {
      const numJogador = targetPlayer === "player1" ? 1 : 2;
      atualizarPenalidadesInterface(numJogador);
    }
  },

  logAction: function (message) {
    console.log(message);
    const logElement = document.getElementById("logBatalha");
    if (logElement) {
      const newLog = document.createElement("p");
      newLog.textContent = message;
      logElement.appendChild(newLog);
      logElement.scrollTop = logElement.scrollHeight;
    }
  },

  showAlert: function (message) {
    console.warn(message);
    if (window.showCustomAlert) {
      window.showCustomAlert(message);
    } else {
      alert(message);
    }
  },

  resetPenalties: function () {
    PenalidadesAtivas.player1 = { defesa: 0, esquiva: 0, dano: 0 };
    PenalidadesAtivas.player2 = { defesa: 0, esquiva: 0, dano: 0 };

    if (window.atualizarPenalidadesInterface) {
      atualizarPenalidadesInterface(1);
      atualizarPenalidadesInterface(2);
    }
  },

  getAbilityInfo: function (className) {
    const config = this.ClassConfig[className] || {};
    return {
      dice: config.dice,
      cost: config.cost,
      description: config.description || "Ataque básico",
      maxUses: config.maxUses,
    };
  },
};

// Inicializa o sistema de dano
document.addEventListener("DOMContentLoaded", function () {
  if (!window.DanoSystem) {
    window.DanoSystem = DanoSystem;
  }
});
