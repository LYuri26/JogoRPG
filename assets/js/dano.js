/**
 * DANO.JS - Sistema completo de cálculo de dano e habilidades
 * Versão corrigida e aprimorada
 */

window.DanoSystem = {
  // Configurações completas de todas as classes
  ClassConfig: {
    Guerreiro: {
      dice: "D8",
      cost: 2,
      resource: "staminaMana",
      effect: function (attacker) {
        DanoSystem.registerPenalty(
          attacker.playerId || (attacker === window.player1Character ? 1 : 2),
          "defesa",
          1
        );
      },
      modifier: null,
      conditions: [],
      description: "Golpe Poderoso: reduz a defesa do alvo em 1 ponto",
    },
    Ladino: {
      dice: "D10",
      cost: 3,
      resource: "staminaMana",
      condition: (char) => !char.foiAtacado,
      effect: (attacker) => {
        attacker.usosRestantes = (attacker.usosRestantes || 0) - 1;
      },
      modifier: (damage) => damage * 2,
      maxUses: 2,
      conditions: [
        {
          condicao: (char) => char.foiAtacado,
          mensagem: "Ladino não pode usar Ataque Sorrateiro após ser atacado!",
        },
        {
          condicao: (char) => (char.usosRestantes || 0) <= 0,
          mensagem: "Ataque Sorrateiro só pode ser usado a cada 2 turnos!",
        },
      ],
      description: "Ataque Sorrateiro: causa dano dobrado se não foi atacado",
    },
    Bárbaro: {
      dice: "D10",
      cost: 3,
      resource: "staminaMana",
      condition: (char) => char.vida < 15,
      effect: (attacker) => {
        attacker.usosRestantes = (attacker.usosRestantes || 0) - 1;
      },
      modifier: (damage) => Math.floor(damage * 1.5),
      maxUses: 1,
      conditions: [
        {
          condicao: (char) => char.vida >= 15,
          mensagem:
            "Bárbaro só pode usar Fúria quando a vida está abaixo de 15!",
        },
        {
          condicao: (char) => (char.usosRestantes || 0) <= 0,
          mensagem: "Fúria só pode ser usada uma vez por combate!",
        },
      ],
      description: "Fúria: aumenta dano em 50% quando com vida baixa",
    },
    Mago: {
      dice: "D12",
      cost: 3,
      resource: "staminaMana",
      effect: function (attacker) {
        DanoSystem.registerPenalty(
          attacker.playerId || (attacker === window.player1Character ? 1 : 2),
          "esquiva",
          1
        );
      },
      modifier: null,
      conditions: [],
      description: "Feitiço Arcano: reduz esquiva do alvo em 1 ponto",
    },
    Paladino: {
      dice: "D8",
      cost: 2,
      resource: "staminaMana",
      effect: null,
      modifier: null,
      conditions: [],
      description: "Golpe Divino: ataque básico com custo reduzido",
    },
    Arqueiro: {
      dice: "D8",
      cost: 2,
      resource: "staminaMana",
      effect: null,
      modifier: null,
      conditions: [],
      description: "Tiro Preciso: chance aumentada de acerto crítico",
    },
    Monge: {
      dice: "D6",
      cost: 2,
      resource: "staminaMana",
      effect: null,
      modifier: null,
      conditions: [],
      description: "Golpe Rápido: ataque básico de baixo custo",
    },
    Cavaleiro: {
      dice: "D8",
      cost: 3,
      resource: "staminaMana",
      effect: null,
      modifier: null,
      conditions: [],
      description: "Investida: ataque com chance de atordoar",
    },
    Assassino: {
      dice: "D12",
      cost: 3,
      resource: "staminaMana",
      effect: null,
      modifier: null,
      maxUses: 3,
      conditions: [],
      description: "Golpe Mortal: dano alto com usos limitados",
    },
    Druida: {
      dice: "D8",
      cost: 3,
      resource: "staminaMana",
      effect: null,
      modifier: null,
      maxUses: 3,
      conditions: [],
      description: "Força da Natureza: cura após o ataque",
    },
    Gladiador: {
      dice: "D6",
      cost: 2,
      resource: "staminaMana",
      effect: null,
      modifier: null,
      conditions: [],
      description: "Golpe Giratório: atinge múltiplos alvos",
    },
    Caçador: {
      dice: "D12",
      cost: 3,
      resource: "staminaMana",
      effect: null,
      modifier: null,
      conditions: [],
      description: "Tiro Certeiro: ignora parte da armadura",
    },
    Mercenário: {
      dice: "D6",
      cost: 2,
      resource: "staminaMana",
      effect: null,
      modifier: null,
      conditions: [],
      description: "Ataque Duplo: chance de atacar duas vezes",
    },
    Feiticeiro: {
      dice: "D20",
      cost: 3,
      resource: "staminaMana",
      effect: null,
      modifier: null,
      conditions: [],
      description: "Bola de Fogo: dano alto mas imprevisível",
    },
    Samurai: {
      dice: "D10",
      cost: 3,
      resource: "staminaMana",
      effect: (attacker) => {
        attacker.usosRestantes = (attacker.usosRestantes || 0) - 1;
      },
      modifier: null,
      maxUses: 2,
      conditions: [
        {
          condicao: (char) => (char.usosRestantes || 0) <= 0,
          mensagem: "Foco Perfeito só pode ser usado 2 vezes por combate!",
        },
      ],
      description: "Foco Perfeito: ignora completamente a defesa do alvo",
    },
  },

  // Penalidades ativas
  Penalties: {
    player1: { defesa: 0, esquiva: 0, dano: 0 },
    player2: { defesa: 0, esquiva: 0, dano: 0 },
  },

  /**
   * Converte dano para número
   */
  parseDanoBase: function (dano) {
    if (typeof dano === "number") return dano;
    if (typeof dano === "string") {
      const num = parseInt(dano.replace(/\D/g, ""));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  },

  /**
   * Calcula o dano total de um ataque
   */
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

    // 1. Verificar esquiva com penalidades
    const esquivaTotal = Math.max(
      0,
      defensor.esquiva -
        (this.Penalties[`player${jogador === 1 ? 2 : 1}`].esquiva || 0)
    );
    if (Math.random() < esquivaTotal / 100) {
      this.logAction(`${defensor.nome} esquivou do ataque!`);
      return 0;
    }

    // 2. Calcular dano base
    const danoBase = this.parseDanoBase(atacante.danoBase);
    const bonusDado = parseInt(resultado) || 0;
    const armadura = Math.max(
      0,
      this.parseDanoBase(defensor.armadura) -
        (this.Penalties[`player${jogador === 1 ? 2 : 1}`].defesa || 0)
    );

    // 3. Cálculo inicial
    let danoTotal = Math.max(1, danoBase + bonusDado - armadura);

    // 4. Verificar crítico
    const faces = parseInt(tipoDado.substring(1));
    if (resultado === faces) {
      danoTotal = Math.floor(danoTotal * 1.5);
      this.logAction(`${atacante.nome} acertou um golpe crítico!`);
    }

    // 5. Aplicar modificadores de classe
    if (tipoDado === config.dice && config.modifier) {
      danoTotal = config.modifier(danoTotal);
    }

    // 6. Aplicar penalidades de dano
    danoTotal += this.Penalties[`player${jogador === 1 ? 2 : 1}`].dano || 0;

    return Math.max(0, danoTotal);
  },

  /**
   * Verifica restrições especiais de habilidades
   */
  verificarRestricoes: function (jogador, tipoDado) {
    const personagem =
      jogador === 1 ? window.player1Character : window.player2Character;
    if (!personagem) return false;

    const config = this.ClassConfig[personagem.classe] || {};

    // Verifica se é um ataque especial
    if (tipoDado === config.dice) {
      // Verifica todas as condições
      for (const condicao of config.conditions || []) {
        if (condicao.condicao(personagem)) {
          this.showAlert(condicao.mensagem);
          return false;
        }
      }

      // Verifica usos restantes
      if (config.maxUses && (personagem.usosRestantes || 0) <= 0) {
        this.showAlert(
          `Habilidade já foi usada o máximo de ${config.maxUses} vezes!`
        );
        return false;
      }
    }

    return true;
  },

  /**
   * Aplica custo de habilidade e verifica recursos
   */
  aplicarCustoHabilidade: function (jogador, tipoDado) {
    const personagem =
      jogador === 1 ? window.player1Character : window.player2Character;
    if (!personagem) return false;

    const config = this.ClassConfig[personagem.classe] || {};

    // Verifica se é um ataque especial
    if (tipoDado === config.dice) {
      if ((personagem[config.resource] || 0) < config.cost) {
        this.showAlert("Recursos insuficientes para usar esta habilidade!");
        return false;
      }

      // Deduz recursos
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

  /**
   * Aplica efeitos pós-habilidade
   */
  aplicarEfeitosPosHabilidade: function (jogador, tipoDado) {
    const personagem =
      jogador === 1 ? window.player1Character : window.player2Character;
    if (!personagem) return;

    const config = this.ClassConfig[personagem.classe] || {};

    // Verifica se é um ataque especial
    if (tipoDado === config.dice && config.effect) {
      try {
        config.effect(personagem);
      } catch (e) {
        console.error("Erro ao aplicar efeito da habilidade:", e);
      }
    }

    // Marca que foi atacado para efeitos como do Ladino
    personagem.foiAtacado = true;
  },

  /**
   * Registra uma penalidade
   */
  registerPenalty: function (playerId, type, value) {
    const numJogador =
      typeof playerId === "number" ? playerId : playerId === "player1" ? 1 : 2;

    if (!this.Penalties[`player${numJogador}`]) {
      this.Penalties[`player${numJogador}`] = {
        defesa: 0,
        esquiva: 0,
        dano: 0,
      };
    }

    if (typeof this.Penalties[`player${numJogador}`][type] === "number") {
      this.Penalties[`player${numJogador}`][type] += value;
    }

    // Atualiza a interface
    if (window.atualizarPenalidadesInterface) {
      atualizarPenalidadesInterface(numJogador);
    }
  },

  /**
   * Adiciona mensagem ao log de batalha
   */
  logAction: function (message) {
    console.log(message); // Log no console para depuração
    const logElement = document.getElementById("logBatalha");
    if (logElement) {
      const newLog = document.createElement("p");
      newLog.textContent = message;
      logElement.appendChild(newLog);
      logElement.scrollTop = logElement.scrollHeight;
    }
  },

  /**
   * Mostra um alerta
   */
  showAlert: function (message) {
    console.warn(message);
    if (window.showCustomAlert) {
      window.showCustomAlert(message);
    } else {
      alert(message);
    }
  },

  /**
   * Reseta todas as penalidades
   */
  resetPenalties: function () {
    this.Penalties.player1 = { defesa: 0, esquiva: 0, dano: 0 };
    this.Penalties.player2 = { defesa: 0, esquiva: 0, dano: 0 };

    if (window.atualizarPenalidadesInterface) {
      atualizarPenalidadesInterface(1);
      atualizarPenalidadesInterface(2);
    }
  },

  /**
   * Obtém informações da habilidade de uma classe
   */
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
