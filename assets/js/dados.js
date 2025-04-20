// Objeto para armazenar os dados rolados
const DadosManager = {
  dadosRolados: {
    player1: { d20: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
    player2: { d20: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
  },

  // Função para rolar qualquer tipo de dado
  rolarDado: function (tipoDado, jogador) {
    const faces = parseInt(tipoDado.replace("D", ""));
    const resultado = Math.floor(Math.random() * faces) + 1;

    // Garante que o resultado seja um número válido
    this.dadosRolados[`player${jogador}`][tipoDado.toLowerCase()] =
      resultado || 0;

    // Atualiza a interface
    const elemento = document.getElementById(`player${jogador}${tipoDado}`);
    if (elemento) {
      elemento.textContent = resultado;
    }

    return resultado;
  },

  // Atualiza a interface com os resultados dos dados
  atualizarInterfaceDados: function (jogador, tipoDado, resultado) {
    const elemento = document.getElementById(`player${jogador}${tipoDado}`);
    if (elemento) {
      elemento.textContent = resultado;
    }
  },

  // Reseta todos os dados
  resetarDados: function () {
    this.dadosRolados = {
      player1: { d20: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
      player2: { d20: 0, d6: 0, d8: 0, d10: 0, d12: 0 },
    };

    // Desabilita todos os botões de dados
    this.desabilitarTodosDados();

    // Reseta os valores exibidos
    document
      .querySelectorAll(
        '[id^="player"][id$="D20"], [id^="player"][id$="D6"], [id^="player"][id$="D8"], [id^="player"][id$="D10"], [id^="player"][id$="D12"]'
      )
      .forEach((el) => {
        el.textContent = "0";
      });
  },

  // Desabilita todos os dados
  desabilitarTodosDados: function () {
    document.querySelectorAll(".dice-button").forEach((btn) => {
      btn.disabled = true;
    });
  },

  // Habilita um dado específico para um jogador
  habilitarDado: function (jogador, tipoDado) {
    const btn = document.getElementById(`player${jogador}${tipoDado}Btn`);
    if (btn) btn.disabled = false;
  },

  // Habilita apenas o D20 de um jogador
  habilitarD20: function (jogador) {
    this.desabilitarTodosDados();
    this.habilitarDado(jogador, "D20");
  },

  // Habilita os dados de ataque baseado na classe do personagem
  habilitarDadosAtaque: function (jogador) {
    this.desabilitarTodosDados();

    // Habilita apenas os dados de ataque (D6, D8, D10, D12)
    const dadosAtaque = ["D6", "D8", "D10", "D12"];
    const personagem =
      jogador === 1 ? window.player1Character : window.player2Character;

    if (personagem) {
      dadosAtaque.forEach((dado) => {
        // Habilita D6 para todos como ataque básico
        if (dado === "D6") {
          this.habilitarDado(jogador, dado);
        }
        // Habilita dado especial da classe
        if (dado === (DanoSystem.ClassConfig[personagem.classe]?.dice || "")) {
          this.habilitarDado(jogador, dado);
        }
      });
    }
  },

  // Configura os eventos dos botões de dados
  configurarEventosDados: function () {
    document.getElementById("player1D20Btn").addEventListener("click", () => {
      if (typeof GerenciadorTurnos.rolarD20 === "function") {
        GerenciadorTurnos.rolarD20(1);
      }
    });

    document.getElementById("player2D20Btn").addEventListener("click", () => {
      if (typeof GerenciadorTurnos.rolarD20 === "function") {
        GerenciadorTurnos.rolarD20(2);
      }
    });

    // Configura eventos para dados de ataque
    ["D6", "D8", "D10", "D12"].forEach((dado) => {
      for (let jogador of [1, 2]) {
        const btn = document.getElementById(`player${jogador}${dado}Btn`);
        if (btn) {
          btn.addEventListener("click", () => {
            if (typeof finalizarAtaque === "function") {
              finalizarAtaque(jogador, dado);
            }
          });
        }
      }
    });
  },
};

// Inicializa os eventos quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", function () {
  DadosManager.configurarEventosDados();
});
