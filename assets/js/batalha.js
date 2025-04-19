// Variáveis globais para controle do estado da batalha
let jogoPausado = false;
let avisoExibido = false;

function parseDanoBase(dano) {
  // Extrai número de strings como "2 Stamina"
  const num = parseInt(dano.toString().replace(/\D/g, ""));
  return isNaN(num) ? 0 : num;
}

/**
 * Inicia a fase de batalha após a disputa do D20
 * @param {number} atacanteNum - Número do jogador atacante (1 ou 2)
 * @param {number} defensorNum - Número do jogador defensor (1 ou 2)
 */
function iniciarBatalha(atacanteNum, defensorNum) {
  if (jogoPausado) return;

  const atacante =
    atacanteNum === 1 ? window.player1Character : window.player2Character;
  const defensor =
    defensorNum === 1 ? window.player1Character : window.player2Character;

  if (!atacante || !defensor) {
    console.error("Personagens não encontrados para a batalha");
    return;
  }

  console.log(`Iniciando batalha com Jogador ${atacanteNum} atacando`);

  // Exibe a mensagem no HTML
  document.getElementById(
    "resultadoTurno"
  ).textContent = `Jogador ${atacanteNum} (${atacante.nome}) pode atacar!`;
  document.getElementById(
    "mensagemBatalha"
  ).textContent = `Escolha seu ataque contra Jogador ${defensorNum} (${defensor.nome})`;

  // Habilita os botões de ataque conforme a classe
  habilitarAtaques(atacanteNum, atacante.classe);
}

/**
 * Habilita os botões de ataque conforme a classe do personagem
 * @param {number} jogador - Número do jogador (1 ou 2)
 * @param {string} classe - Classe do personagem (Guerreiro, Ladino, Mago)
 */
function habilitarAtaques(jogador, classe) {
  // Desabilita todos os botões primeiro
  document
    .querySelectorAll(`#player${jogador} button.dice-button`)
    .forEach((btn) => {
      btn.disabled = true;
    });

  // Habilita D6 (ataque básico) para todos
  const btnD6 = document.getElementById(`player${jogador}D6Btn`);
  if (btnD6) btnD6.disabled = false;

  // Habilita dados especiais conforme classe
  switch (classe) {
    case "Guerreiro":
      document.getElementById(`player${jogador}D8Btn`).disabled = false;
      break;
    case "Ladino":
      document.getElementById(`player${jogador}D10Btn`).disabled = false;
      break;
    case "Mago":
      document.getElementById(`player${jogador}D12Btn`).disabled = false;
      break;
  }
}

/**
 * Finaliza um ataque, calcula dano e aplica ao defensor
 * @param {number} jogador - Número do jogador atacante (1 ou 2)
 * @param {string} tipoDado - Tipo de dado usado no ataque (D6, D8, D10, D12)
 */
function finalizarAtaque(jogador, tipoDado) {
  if (jogoPausado) return;

  // Pausa o jogo para evitar múltiplos ataques
  jogoPausado = true;

  // Rola o dado
  const faces = parseInt(tipoDado.replace("D", ""));
  const resultado = Math.floor(Math.random() * faces) + 1;

  // Atualiza a interface com o resultado
  document.getElementById(`player${jogador}${tipoDado}`).textContent =
    resultado;

  // Calcula o dano
  const dano = calcularDano(jogador, tipoDado, resultado);

  // Aplica o dano ao defensor
  const defensorNum = jogador === 1 ? 2 : 1;
  aplicarDano(defensorNum, dano);

  // Exibe o aviso de dano (apenas uma vez por turno)
  if (!avisoExibido) {
    avisoExibido = true;
    const defensor =
      defensorNum === 1 ? window.player1Character : window.player2Character;

    setTimeout(() => {
      alert(`${defensor.nome} sofreu ${dano} de dano!`);
      // Finaliza o turno após o alerta
      GerenciadorTurnos.finalizarTurno();
      jogoPausado = false;
      avisoExibido = false;
    }, 500);
  }
}

/**
 * Calcula o dano total do ataque
 * @param {number} jogador - Número do jogador atacante (1 ou 2)
 * @param {string} tipoDado - Tipo de dado usado no ataque
 * @param {number} resultado - Resultado do dado rolado
 * @returns {number} Dano total após cálculos
 */
function calcularDano(jogador, tipoDado, resultado) {
  const atacante =
    jogador === 1 ? window.player1Character : window.player2Character;
  const defensor =
    jogador === 1 ? window.player2Character : window.player1Character;

  // Converte danoBase para número se necessário
  const danoBase =
    typeof atacante.danoBase === "number"
      ? atacante.danoBase
      : parseDanoBase(atacante.danoBase);

  let dano = danoBase + resultado;

  // Aplica bônus de classe
  if (tipoDado === "D8" && atacante.classe === "Guerreiro") {
    dano += 2;
  } else if (tipoDado === "D10" && atacante.classe === "Ladino") {
    dano += 3;
  } else if (tipoDado === "D12" && atacante.classe === "Mago") {
    dano += 4;
  }

  // Reduz pela armadura (garante que é número)
  const armadura =
    typeof defensor.armadura === "number"
      ? defensor.armadura
      : parseDanoBase(defensor.armadura);

  dano = Math.max(1, dano - armadura);

  // Verifica esquiva
  const esquiva =
    typeof defensor.esquiva === "number"
      ? defensor.esquiva
      : parseDanoBase(defensor.esquiva);

  if (Math.random() < esquiva / 10) {
    dano = 0;
    document.getElementById("mensagemBatalha").textContent += " (ESQUIVOU!)";
  }

  return dano;
}

/**
 * Aplica o dano ao defensor e atualiza a interface
 * @param {number} defensorNum - Número do jogador defensor (1 ou 2)
 * @param {number} dano - Quantidade de dano a ser aplicada
 */
function aplicarDano(defensorNum, dano) {
  const defensor =
    defensorNum === 1 ? window.player1Character : window.player2Character;
  const vidaAtual = parseInt(
    document.getElementById(`player${defensorNum}Vida`).textContent
  );
  const novaVida = Math.max(0, vidaAtual - dano);

  // Atualiza a vida na interface
  document.getElementById(`player${defensorNum}Vida`).textContent = novaVida;
  defensor.vida = novaVida;

  // Atualiza a barra de vida visual
  atualizarBarraVida(defensorNum, novaVida, defensor.vidaMaxima);

  // Exibe mensagem do resultado
  document.getElementById("mensagemBatalha").innerHTML = `<p>Jogador ${
    defensorNum === 1 ? 2 : 1
  } causou ${dano} de dano! Vida restante: ${novaVida}</p>`;

  // Verifica se o jogo terminou
  verificarFimDeJogo();
}

/**
 * Atualiza a barra de vida visual do jogador
 * @param {number} jogador - Número do jogador (1 ou 2)
 * @param {number} vidaAtual - Vida atual do jogador
 * @param {number} vidaMaxima - Vida máxima do jogador
 */
function atualizarBarraVida(jogador, vidaAtual, vidaMaxima) {
  const porcentagemVida = (vidaAtual / vidaMaxima) * 100;
  const barraVida = document.getElementById(`player${jogador}HealthBar`);

  if (barraVida) {
    barraVida.style.width = `${porcentagemVida}%`;

    // Muda a cor conforme a vida diminui
    if (porcentagemVida < 20) {
      barraVida.classList.remove("bg-success", "bg-warning");
      barraVida.classList.add("bg-danger");
    } else if (porcentagemVida < 50) {
      barraVida.classList.remove("bg-success", "bg-danger");
      barraVida.classList.add("bg-warning");
    } else {
      barraVida.classList.remove("bg-warning", "bg-danger");
      barraVida.classList.add("bg-success");
    }
  }
}

/**
 * Verifica se o jogo terminou (algum jogador com vida <= 0)
 */
function verificarFimDeJogo() {
  const vidaJ1 =
    parseInt(document.getElementById("player1Vida").textContent) || 0;
  const vidaJ2 =
    parseInt(document.getElementById("player2Vida").textContent) || 0;

  if (vidaJ1 <= 0 || vidaJ2 <= 0) {
    const vencedor = vidaJ1 > 0 ? "Jogador 1" : "Jogador 2";

    // Atualiza a mensagem de fim de jogo
    document.getElementById(
      "mensagemBatalha"
    ).innerHTML = `<h3 class="text-center">Fim de Jogo! ${vencedor} venceu!</h3>`;
    document.getElementById("resultadoTurno").textContent =
      "Partida encerrada! Recarregue a página para jogar novamente.";

    // Desabilita todos os botões
    document.querySelectorAll("button").forEach((btn) => {
      btn.disabled = true;
    });

    return true;
  }
  return false;
}

// Configura os eventos de ataque quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  // Configura eventos para todos os botões de ataque
  const dados = ["D6", "D8", "D10", "D12"];

  for (let jogador of [1, 2]) {
    for (let dado of dados) {
      const btn = document.getElementById(`player${jogador}${dado}Btn`);
      if (btn) {
        btn.addEventListener("click", () => finalizarAtaque(jogador, dado));
      }
    }
  }
});
