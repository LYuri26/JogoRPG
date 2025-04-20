// Variáveis globais para controle do estado da batalha
let jogoPausado = false;
let avisoExibido = false;

// Objeto para armazenar penalidades ativas
// Add this at the beginning of classes.js
const PenalidadesAtivas = {
  player1: { defesa: 0, esquiva: 0, dano: 0 },
  player2: { defesa: 0, esquiva: 0, dano: 0 },
};

// ========== FUNÇÕES DE BATALHA ==========
function aplicarDano(defensorNum, dano) {
  const defensor =
    defensorNum === 1 ? window.player1Character : window.player2Character;
  defensor.foiAtacado = true;

  const vidaAtual = parseInt(
    document.getElementById(`player${defensorNum}Vida`).textContent
  );
  const novaVida = dano > 0 ? Math.max(0, vidaAtual - dano) : vidaAtual;

  // Atualizar valores
  document.getElementById(`player${defensorNum}Vida`).textContent = novaVida;
  defensor.vida = novaVida;
  atualizarBarraVida(defensorNum, novaVida, defensor.vidaMaxima);

  // Mensagem de batalha
  const mensagem =
    dano > 0
      ? `Jogador ${
          defensorNum === 1 ? 2 : 1
        } causou ${dano} de dano! Vida restante: ${novaVida}`
      : `${defensor.nome} esquivou do ataque!`;

  document.getElementById("mensagemBatalha").innerHTML = `<p>${mensagem}</p>`;
  verificarFimDeJogo();
}

function atualizarBarraVida(jogador, vidaAtual, vidaMaxima) {
  const porcentagemVida = (vidaAtual / vidaMaxima) * 100;
  const barraVida = document.getElementById(`player${jogador}HealthBar`);

  if (!barraVida) return;

  barraVida.style.width = `${porcentagemVida}%`;

  // Atualizar classe de cor
  const classes = ["bg-success", "bg-warning", "bg-danger"];
  let novaClasse = "bg-success";

  if (porcentagemVida < 20) novaClasse = "bg-danger";
  else if (porcentagemVida < 50) novaClasse = "bg-warning";

  barraVida.classList.remove(...classes);
  barraVida.classList.add(novaClasse);
}

function verificarFimDeJogo() {
  const vidaJ1 =
    parseInt(document.getElementById("player1Vida").textContent) || 0;
  const vidaJ2 =
    parseInt(document.getElementById("player2Vida").textContent) || 0;

  if (vidaJ1 <= 0 || vidaJ2 <= 0) {
    const vencedor =
      vidaJ1 > 0 ? window.player1Character.nome : window.player2Character.nome;

    document.getElementById(
      "mensagemBatalha"
    ).innerHTML = `<h3 class="text-center">Fim de Jogo! ${vencedor} venceu!</h3>`;
    document.getElementById("resultadoTurno").textContent =
      "Partida encerrada! Recarregue a página para jogar novamente.";

    // Desabilitar todos os botões
    document.querySelectorAll("button").forEach((btn) => (btn.disabled = true));
    return true;
  }
  return false;
}

function adicionarLogBatalha(mensagem) {
  const logElement = document.getElementById("logBatalha");
  if (logElement) {
    const novoLog = document.createElement("p");
    novoLog.textContent = mensagem;
    logElement.appendChild(novoLog);
    logElement.scrollTop = logElement.scrollHeight;
  }
}

function finalizarTurno() {
  // Resetar estado de "foiAtacado"
  window.player1Character.foiAtacado = false;
  window.player2Character.foiAtacado = false;

  // Recarregar usos do Ladino se necessário
  [window.player1Character, window.player2Character].forEach((personagem) => {
    if (personagem.classe === "Ladino" && personagem.usosRestantes === 0) {
      personagem.usosRestantes = 2;
    }
  });

  // Recarregar stamina/mana parcialmente
  [window.player1Character, window.player2Character].forEach((personagem) => {
    personagem.staminaMana = Math.min(
      personagem.staminaMana + 2,
      personagem.staminaManaMax
    );
    const jogador = personagem === window.player1Character ? 1 : 2;
    document.getElementById(
      `player${jogador}Stamina`
    ).textContent = `${personagem.staminaMana}/${personagem.staminaManaMax}`;
  });
}

function finalizarAtaque(jogador, tipoDado) {
  if (jogoPausado) return;
  if (!window.DanoSystem) {
    console.error("DanoSystem not available!");
    return;
  }

  if (!DanoSystem.verificarRestricoes(jogador, tipoDado)) return;
  if (!DanoSystem.aplicarCustoHabilidade(jogador, tipoDado)) return;

  jogoPausado = true;

  // Rolar o dado
  const resultado = DadosManager.rolarDado(tipoDado, jogador);

  // Calcular e aplicar dano
  const dano = DanoSystem.calcularDano(jogador, tipoDado, resultado);
  DanoSystem.aplicarEfeitosPosHabilidade(jogador, tipoDado);

  const defensorNum = jogador === 1 ? 2 : 1;
  aplicarDano(defensorNum, dano);

  setTimeout(() => {
    if (dano > 0) {
      DanoSystem.logAction(
        `${window[`player${jogador}Character`].nome} causou ${dano} de dano!`
      );
    }

    // Chamar o finalizador de turno do GerenciadorTurnos
    if (window.GerenciadorTurnos) {
      GerenciadorTurnos.finalizarTurno();
    } else {
      finalizarTurno();
    }

    jogoPausado = false;
  }, 500);
}

// ========== INICIALIZAÇÃO ==========
document.addEventListener("DOMContentLoaded", function () {
  // Configurar eventos de ataque
  const dados = ["D6", "D8", "D10", "D12"];

  for (let jogador of [1, 2]) {
    for (let dado of dados) {
      const btn = document.getElementById(`player${jogador}${dado}Btn`);
      if (btn) {
        btn.addEventListener("click", () => finalizarAtaque(jogador, dado));
      }
    }
  }

  // Inicializar personagens
  window.Personagens.inicializarPersonagem(
    "player1",
    window.player1Character.nome
  );
  window.Personagens.inicializarPersonagem(
    "player2",
    window.player2Character.nome
  );
});
