/**
 * Sistema Principal do Jogo
 *
 * Responsável por:
 * - Inicializar o jogo
 * - Gerenciar o fluxo de turnos
 * - Atualizar a interface
 * - Controlar eventos do jogo
 */

class Jogo {
  constructor() {
    this.personagensCarregados = false;
    this.player1Character = null;
    this.player2Character = null;
    this.init();
  }

  /**
   * Inicializa o jogo
   */
  init() {
    document.addEventListener("DOMContentLoaded", () => {
      this.inicializarTooltips();
      this.carregarPersonagens();
      this.configurarEventos();
    });
  }

  /**
   * Inicializa os tooltips do Bootstrap
   */
  inicializarTooltips() {
    const tooltipTriggerList = [
      ...document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    ];
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  /**
   * Carrega os personagens salvos
   */
  carregarPersonagens() {
    if (this.personagensCarregados) return;

    try {
      const player1Data = this.parseCharacterData(
        localStorage.getItem("player1Character")
      );
      const player2Data = this.parseCharacterData(
        localStorage.getItem("player2Character")
      );
      const player1Name =
        localStorage.getItem("player1Name")?.trim() || "Jogador 1";
      const player2Name =
        localStorage.getItem("player2Name")?.trim() || "Jogador 2";

      // Garante valores numéricos válidos
      const ensureNumber = (value, defaultValue) =>
        isNaN(parseInt(value)) ? defaultValue : parseInt(value);

      this.player1Character = {
        classe: player1Data?.title || "Guerreiro",
        nome: player1Data?.name || player1Name,
        vida: ensureNumber(player1Data?.life, 30),
        vidaMaxima: ensureNumber(player1Data?.life, 30),
        danoBase: ensureNumber(player1Data?.damage, 3),
        armadura: ensureNumber(player1Data?.armor, 3),
        esquiva: ensureNumber(player1Data?.dodge, 2),
        stamina: ensureNumber(player1Data?.stamina, 6),
        staminaMax: ensureNumber(player1Data?.stamina, 6),
        dadoEspecial: player1Data?.specialDice || "D6",
        custoHabilidade: ensureNumber(player1Data?.cost, 2),
        playerId: "player1",
      };

      this.player2Character = {
        classe: player2Data?.title || "Ladino",
        nome: player2Data?.name || player2Name,
        vida: ensureNumber(player2Data?.life, 30),
        vidaMaxima: ensureNumber(player2Data?.life, 30),
        danoBase: ensureNumber(player2Data?.damage, 3),
        armadura: ensureNumber(player2Data?.armor, 3),
        esquiva: ensureNumber(player2Data?.dodge, 2),
        stamina: ensureNumber(player2Data?.stamina, 6),
        staminaMax: ensureNumber(player2Data?.stamina, 6),
        dadoEspecial: player2Data?.specialDice || "D6",
        custoHabilidade: ensureNumber(player2Data?.cost, 2),
        playerId: "player2",
      };

      // Atualiza a interface imediatamente
      this.atualizarInterface();
      this.personagensCarregados = true;
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar os personagens! Redirecionando...");
      window.location.href = "../index.html";
    }
  }

  /**
   * Parse dos dados do personagem
   */
  parseCharacterData(data) {
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error("Erro ao parsear dados do personagem:", e);
      return { title: data }; // Fallback for string data
    }
  }

  /**
   * Cria um objeto de personagem padronizado
   */
  criarPersonagem(data, nome, playerId) {
    const defaults = {
      life: 30,
      damage: 3,
      armor: 3,
      dodge: 3,
      stamina: 6,
      specialDice: "D6",
      cost: 2,
      penalty: null,
    };

    const personagem = {
      classe: data.title || "Guerreiro",
      nome: data.name || nome,
      vida: data.life || defaults.life,
      vidaMaxima: data.life || defaults.life,
      danoBase: data.damage || defaults.damage,
      armadura: data.armor || defaults.armor,
      esquiva: data.dodge || defaults.dodge,
      stamina: data.stamina || defaults.stamina,
      staminaMax: data.stamina || defaults.stamina,
      dadoEspecial: data.specialDice || defaults.specialDice,
      custoHabilidade: data.cost || defaults.cost,
      penalidade: data.penalty || defaults.penalty,
      playerId: playerId,
      foiAtacado: false,
    };

    // Propriedades específicas por classe
    if (personagem.classe === "Ladino") {
      personagem.usosHabilidade = 2;
    }

    return personagem;
  }

  /**
   * Configura os eventos do jogo
   */
  configurarEventos() {
    const tiposDado = ["D6", "D8", "D10", "D12"];

    for (let jogador of [1, 2]) {
      tiposDado.forEach((dado) => {
        const botao = document.getElementById(`player${jogador}${dado}Btn`);
        if (botao) {
          botao.addEventListener("click", () =>
            this.finalizarAtaque(jogador, dado)
          );
        }
      });
    }
  }

  /**
   * Finaliza um ataque
   */
  finalizarAtaque(jogador, dado) {
    const personagem =
      jogador === 1 ? this.player1Character : this.player2Character;
    if (!personagem) return;

    const resultado = DadosManager.rolarDado(dado, jogador);
    const dano = DanoSystem.calcularDano(jogador, dado, resultado);
    this.processarDano(jogador === 1 ? 2 : 1, dano);

    this.atualizarInterface();

    // Adicionar esta linha para finalizar o turno após o ataque
    GerenciadorTurnos.finalizarTurno();
  }

  /**
   * Processa o dano recebido
   */
  processarDano(jogador, dano) {
    const personagem =
      jogador === 1 ? this.player1Character : this.player2Character;
    if (!personagem) return;

    personagem.vida = Math.max(0, personagem.vida - dano);
    personagem.foiAtacado = true;

    if (personagem.vida <= 0) {
      this.finalizarJogo(jogador);
    }
  }

  /**
   * Atualiza toda a interface
   */
  atualizarInterface() {
    this.atualizarPersonagem("player1", this.player1Character);
    this.atualizarPersonagem("player2", this.player2Character);
  }

  /**
   * Atualiza a interface de um personagem específico
   */
  atualizarPersonagem(playerId, personagem) {
    if (!personagem) return;

    const safeUpdate = (idSuffix, value) => {
      const element = document.getElementById(`${playerId}-${idSuffix}`);
      if (element) element.textContent = value;
    };

    safeUpdate("nome", personagem.nome);
    safeUpdate("vida", personagem.vida);
    safeUpdate("stamina", `${personagem.stamina}/${personagem.staminaMax}`);

    // Atualiza barra de vida
    this.atualizarBarraVida(playerId, personagem.vida, personagem.vidaMaxima);

    // Atualiza botões de habilidade
    if (window.ResourceManager) {
      ResourceManager.updateAbilityButtons(personagem);
    }
  }

  /**
   * Atualiza a barra de vida visual
   */
  atualizarBarraVida(playerId, vidaAtual, vidaMaxima) {
    const porcentagem = (vidaAtual / vidaMaxima) * 100;
    const barra = document.getElementById(`${playerId}-health-bar`);

    if (barra) {
      barra.style.width = `${porcentagem}%`;
      barra.className = `health-bar ${this.getHealthBarClass(porcentagem)}`;
    }
  }

  /**
   * Retorna a classe CSS baseada na porcentagem de vida
   */
  getHealthBarClass(porcentagem) {
    if (porcentagem < 20) return "critical";
    if (porcentagem < 50) return "warning";
    return "healthy";
  }

  /**
   * Finaliza o jogo
   */
  finalizarJogo(jogadorPerdedor) {
    const vencedor =
      jogadorPerdedor === 1 ? this.player2Character : this.player1Character;
    const mensagem = vencedor
      ? `Fim de jogo! ${vencedor.nome} venceu!`
      : "Fim de jogo!";

    alert(mensagem);
    window.location.reload();
  }

  /**
   * Avança para o próximo turno
   */
  proximoTurno() {
    if (!this.player1Character || !this.player2Character) return;

    // Atualiza estados dos personagens
    [this.player1Character, this.player2Character].forEach((char) => {
      if (char.foiAtacado) char.foiAtacado = false;

      // Recupera stamina
      if (char.playerId === `player${ConfigJogo.jogadorAtivo}`) {
        char.stamina = Math.min(char.stamina + 2, char.staminaMax);
      }
    });

    // Aplica penalidades
    if (window.PenaltySystem) {
      PenaltySystem.applyPenalties();
    }

    // Avança turno
    if (window.ConfigJogo) {
      ConfigJogo.proximoTurno();
    }
    if (window.DadosManager) {
      DadosManager.resetarDados();
    }

    this.atualizarInterface();
  }
}

// Inicializa o jogo quando o arquivo é carregado
window.jogo = new Jogo();
