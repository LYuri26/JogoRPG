// Variáveis globais para controle do estado da batalha
let jogoPausado = false;
let avisoExibido = false;

// Objeto para armazenar penalidades ativas
const PenalidadesAtivas = {
  player1: { defesa: 0, esquiva: 0, dano: 0 },
  player2: { defesa: 0, esquiva: 0, dano: 0 },
};

function parseDanoBase(dano) {
  if (typeof dano === "number") return dano;
  if (typeof dano === "string") {
    const num = parseInt(dano.replace(/\D/g, ""));
    return isNaN(num) ? 0 : num;
  }
  return 0;
}

function aplicarPenalidades(jogador) {
  const personagem =
    jogador === 1 ? window.player1Character : window.player2Character;
  const penalidades = PenalidadesAtivas[`player${jogador}`];

  // Aplica penalidades aos valores base
  const armaduraBase = personagem.armaduraBase || personagem.armadura;
  const esquivaBase = personagem.esquivaBase || personagem.esquiva;
  const danoBase = personagem.danoBaseBase || personagem.danoBase;

  personagem.armadura = Math.max(0, armaduraBase - penalidades.defesa);
  personagem.esquiva = Math.max(0, esquivaBase - penalidades.esquiva);
  personagem.danoBase = Math.max(1, danoBase - penalidades.dano);

  // Atualiza a interface
  atualizarPenalidadesInterface(jogador);

  // Limpa penalidades para o próximo turno
  PenalidadesAtivas[`player${jogador}`] = { defesa: 0, esquiva: 0, dano: 0 };
  // Atualiza stamina na interface
  document.getElementById(
    `player${jogador}Stamina`
  ).textContent = `${personagem.staminaMana}/${personagem.staminaManaMax}`;
}

function atualizarPenalidadesInterface(jogador) {
  const penalidades = PenalidadesAtivas[`player${jogador}`];

  // Atualiza os valores com penalidades
  document.getElementById(`player${jogador}Armadura`).textContent = (
    jogador === 1 ? window.player1Character : window.player2Character
  ).armadura;

  document.getElementById(`player${jogador}Esquiva`).textContent = (
    jogador === 1 ? window.player1Character : window.player2Character
  ).esquiva;

  document.getElementById(`player${jogador}Dano`).textContent = (
    jogador === 1 ? window.player1Character : window.player2Character
  ).danoBase;

  // Mostra as penalidades aplicadas
  const armaduraPenalidade = document.getElementById(
    `player${jogador}ArmaduraPenalidade`
  );
  const esquivaPenalidade = document.getElementById(
    `player${jogador}EsquivaPenalidade`
  );

  if (penalidades.defesa > 0) {
    armaduraPenalidade.textContent = `-${penalidades.defesa}`;
    armaduraPenalidade.style.display = "inline";
  } else {
    armaduraPenalidade.style.display = "none";
  }

  if (penalidades.esquiva > 0) {
    esquivaPenalidade.textContent = `-${penalidades.esquiva}`;
    esquivaPenalidade.style.display = "inline";
  } else {
    esquivaPenalidade.style.display = "none";
  }

  // Atualiza a mensagem de penalidade ativa
  const penalidadeAtiva = document.getElementById(
    `player${jogador}PenalidadeAtiva`
  );
  if (
    penalidades.defesa > 0 ||
    penalidades.esquiva > 0 ||
    penalidades.dano > 0
  ) {
    let mensagens = [];
    if (penalidades.defesa > 0) mensagens.push(`Defesa -${penalidades.defesa}`);
    if (penalidades.esquiva > 0)
      mensagens.push(`Esquiva -${penalidades.esquiva}`);
    if (penalidades.dano > 0) mensagens.push(`Dano -${penalidades.dano}`);

    penalidadeAtiva.textContent = mensagens.join(", ");
  } else {
    penalidadeAtiva.textContent = "Nenhuma";
  }
}

function registrarPenalidade(jogador, tipo, valor) {
  PenalidadesAtivas[`player${jogador}`][tipo] += valor;
}

function verificarRestricoesEspeciais(jogador, tipoDado) {
  const personagem =
    jogador === 1 ? window.player1Character : window.player2Character;

  switch (personagem.classe) {
    case "Ladino":
      if (tipoDado === "D10" && personagem.foiAtacado) {
        alert("Ladino não pode usar Ataque Sorrateiro após ser atacado!");
        return false;
      }
      if (tipoDado === "D10" && personagem.usosRestantes <= 0) {
        alert("Ataque Sorrateiro só pode ser usado a cada 2 turnos!");
        return false;
      }
      break;

    case "Bárbaro":
      if (tipoDado === "D10" && personagem.vida >= 15) {
        alert("Bárbaro só pode usar Fúria quando a vida está abaixo de 15!");
        return false;
      }
      if (tipoDado === "D10" && personagem.usosRestantes <= 0) {
        alert("Fúria só pode ser usada uma vez por combate!");
        return false;
      }
      break;

    case "Samurai":
      if (tipoDado === "D10" && personagem.usosRestantes <= 0) {
        alert("Foco Perfeito só pode ser usado 2 vezes por combate!");
        return false;
      }
      break;

    // Adicione outras classes conforme necessário
  }

  return true;
}

function aplicarCustoHabilidade(jogador, tipoDado) {
  const personagem =
    jogador === 1 ? window.player1Character : window.player2Character;
  let custo = 0;

  // Define o custo baseado na classe e tipo de dado
  switch (personagem.classe) {
    case "Guerreiro":
      if (tipoDado === "D8") custo = 2;
      break;
    case "Ladino":
      if (tipoDado === "D10") custo = 3;
      break;
    case "Mago":
      if (tipoDado === "D12") custo = 3;
      break;
    case "Paladino":
      if (tipoDado === "D8") custo = 2;
      break;
    case "Bárbaro":
      if (tipoDado === "D10") custo = 3;
      break;
    case "Arqueiro":
      if (tipoDado === "D8") custo = 2;
      break;
    case "Monge":
      if (tipoDado === "D6") custo = 2;
      break;
    case "Cavaleiro":
      if (tipoDado === "D8") custo = 3;
      break;
    case "Assassino":
      if (tipoDado === "D12") custo = 3;
      break;
    case "Druida":
      if (tipoDado === "D8") custo = 3;
      break;
    case "Gladiador":
      if (tipoDado === "D6") custo = 2;
      break;
    case "Caçador":
      if (tipoDado === "D12") custo = 3;
      break;
    case "Mercenário":
      if (tipoDado === "D6") custo = 2;
      break;
    case "Feiticeiro":
      if (tipoDado === "D20") custo = 3;
      break;
    case "Samurai":
      if (tipoDado === "D10") custo = 3;
      break;
  }

  if (personagem.staminaMana < custo) {
    alert("Recursos insuficientes para usar esta habilidade!");
    return false;
  }

  personagem.staminaMana -= custo;

  // Atualiza a interface
  document.getElementById(
    `player${jogador}Stamina`
  ).textContent = `${personagem.staminaMana}/${personagem.staminaManaMax}`;

  return true;
}

function aplicarEfeitosPosHabilidade(jogador, tipoDado) {
  const personagem =
    jogador === 1 ? window.player1Character : window.player2Character;

  switch (personagem.classe) {
    case "Guerreiro":
      if (tipoDado === "D8") registrarPenalidade(jogador, "defesa", 1);
      break;
    case "Ladino":
      if (tipoDado === "D10") personagem.usosRestantes--;
      break;
    case "Mago":
      if (tipoDado === "D12") registrarPenalidade(jogador, "esquiva", 1);
      break;
    // Adicione outras classes conforme a tabela
  }
}

function finalizarAtaque(jogador, tipoDado) {
  if (jogoPausado) return;

  // Verifica requisitos antes de prosseguir
  if (!verificarRequisitosAtaque(jogador, tipoDado)) return;
  if (!aplicarCustoHabilidade(jogador, tipoDado)) return;

  jogoPausado = true;

  // Rola o dado
  const faces = parseInt(tipoDado.replace("D", ""));
  const resultado = Math.floor(Math.random() * faces) + 1;
  document.getElementById(`player${jogador}${tipoDado}`).textContent =
    resultado;

  // Calcula o dano
  const dano = Math.max(1, calcularDano(jogador, tipoDado, resultado));

  // Aplica efeitos pós-habilidade
  aplicarEfeitosPosHabilidade(jogador, tipoDado);

  // Aplica o dano
  const defensorNum = jogador === 1 ? 2 : 1;
  aplicarDano(defensorNum, dano);

  if (!avisoExibido) {
    avisoExibido = true;
    setTimeout(() => {
      if (dano > 0) {
        alert(
          `${
            window[`player${defensorNum}Character`].nome
          } sofreu ${dano} de dano!`
        );
      }
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

// Função para inicializar personagens com valores padrão
function inicializarPersonagem(personagem) {
  // Define usos restantes baseado na classe
  switch (personagem.classe) {
    case "Ladino":
      personagem.usosRestantes = 2; // Pode usar a cada 2 turnos
      personagem.foiAtacado = false;
      break;
    case "Bárbaro":
      personagem.usosRestantes = 1; // 1 uso por combate
      break;
    case "Samurai":
      personagem.usosRestantes = 2; // 2 usos por combate
      break;
    case "Assassino":
      personagem.usosRestantes = 3; // 3 críticos por combate
      break;
    case "Druida":
      personagem.usosRestantes = 3; // 3 curas por combate
      break;
  }

  // Inicializa atributos base para cálculo de penalidades
  personagem.armaduraBase = personagem.armadura;
  personagem.esquivaBase = personagem.esquiva;
  personagem.danoBaseBase = personagem.danoBase;

  // Inicializa stamina/mana se não existir
  personagem.staminaMana = personagem.staminaMana || 6;
  personagem.staminaManaMax = personagem.staminaManaMax || 6;
}

// Função para finalizar o turno com reset de estados
function finalizarTurno() {
  // Resetar estado de "foiAtacado" para o próximo turno
  window.player1Character.foiAtacado = false;
  window.player2Character.foiAtacado = false;

  // Recarregar usos do Ladino se necessário
  if (
    window.player1Character.classe === "Ladino" &&
    window.player1Character.usosRestantes === 0
  ) {
    window.player1Character.usosRestantes = 2;
  }
  if (
    window.player2Character.classe === "Ladino" &&
    window.player2Character.usosRestantes === 0
  ) {
    window.player2Character.usosRestantes = 2;
  }

  // Recarregar stamina/mana parcialmente
  window.player1Character.staminaMana = Math.min(
    window.player1Character.staminaMana + 2,
    window.player1Character.staminaManaMax
  );
  window.player2Character.staminaMana = Math.min(
    window.player2Character.staminaMana + 2,
    window.player2Character.staminaManaMax
  );

  // Atualizar interface
  document.getElementById(
    "player1Stamina"
  ).textContent = `${window.player1Character.staminaMana}/${window.player1Character.staminaManaMax}`;
  document.getElementById(
    "player2Stamina"
  ).textContent = `${window.player2Character.staminaMana}/${window.player2Character.staminaManaMax}`;
}

// Função para verificar requisitos antes do ataque
function verificarRequisitosAtaque(jogador, tipoDado) {
  const personagem =
    jogador === 1 ? window.player1Character : window.player2Character;

  switch (personagem.classe) {
    case "Ladino":
      if (tipoDado === "D10") {
        if (personagem.foiAtacado) {
          alert("Ladino não pode usar Ataque Sorrateiro após ser atacado!");
          return false;
        }
        if (personagem.usosRestantes <= 0) {
          alert("Ataque Sorrateiro só pode ser usado a cada 2 turnos!");
          return false;
        }
      }
      break;

    case "Bárbaro":
      if (tipoDado === "D10") {
        if (personagem.vida >= 15) {
          alert("Bárbaro só pode usar Fúria quando a vida está abaixo de 15!");
          return false;
        }
        if (personagem.usosRestantes <= 0) {
          alert("Fúria só pode ser usada uma vez por combate!");
          return false;
        }
      }
      break;

    // Adicione verificações para outras classes
  }

  return true;
}

// Função final de ataque (ajustada)
function finalizarAtaque(jogador, tipoDado) {
  if (jogoPausado) return;

  // Verifica requisitos antes de prosseguir
  if (!verificarRequisitosAtaque(jogador, tipoDado)) return;
  if (!aplicarCustoHabilidade(jogador, tipoDado)) return;

  jogoPausado = true;

  // Rola o dado
  const faces = parseInt(tipoDado.replace("D", ""));
  const resultado = Math.floor(Math.random() * faces) + 1;
  document.getElementById(`player${jogador}${tipoDado}`).textContent =
    resultado;

  // Calcula o dano
  const dano = calcularDano(jogador, tipoDado, resultado);

  // Aplica efeitos pós-habilidade
  aplicarEfeitosPosHabilidade(jogador, tipoDado);

  // Aplica o dano
  const defensorNum = jogador === 1 ? 2 : 1;
  aplicarDano(defensorNum, dano);

  if (!avisoExibido) {
    avisoExibido = true;
    setTimeout(() => {
      if (dano > 0) {
        alert(
          `${
            window[`player${defensorNum}Character`].nome
          } sofreu ${dano} de dano!`
        );
      }
      GerenciadorTurnos.finalizarTurno();
      jogoPausado = false;
      avisoExibido = false;
    }, 500);
  }
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

  // Aplica dano apenas se for positivo
  const novaVida = dano > 0 ? Math.max(0, vidaAtual - dano) : vidaAtual;

  // Atualiza a vida na interface
  document.getElementById(`player${defensorNum}Vida`).textContent = novaVida;
  defensor.vida = novaVida;

  // Atualiza a barra de vida visual
  atualizarBarraVida(defensorNum, novaVida, defensor.vidaMaxima);

  // Exibe mensagem do resultado
  if (dano > 0) {
    document.getElementById("mensagemBatalha").innerHTML = `<p>Jogador ${
      defensorNum === 1 ? 2 : 1
    } causou ${dano} de dano! Vida restante: ${novaVida}</p>`;
  } else {
    document.getElementById(
      "mensagemBatalha"
    ).innerHTML = `<p>${defensor.nome} esquivou do ataque!</p>`;
  }

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

function adicionarLogBatalha(mensagem) {
  const logElement = document.getElementById("logBatalha");
  if (logElement) {
    const novoLog = document.createElement("p");
    novoLog.textContent = mensagem;
    logElement.appendChild(novoLog);
    logElement.scrollTop = logElement.scrollHeight;
  }
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

inicializarPersonagem(window.player1Character);
inicializarPersonagem(window.player2Character);
