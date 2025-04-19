// dano.js - Complete corrected version with accurate damage and dodge calculations

// Helper function to parse damage values
function parseDanoBase(dano) {
  if (typeof dano === "number") return dano;
  if (typeof dano === "string") return parseInt(dano.replace(/\D/g, "")) || 0;
  return 0;
}

// Function to register penalties
function registrarPenalidade(jogador, tipo, valor) {
  if (!window.PenalidadesAtivas) {
    window.PenalidadesAtivas = {
      player1: { defesa: 0, esquiva: 0, dano: 0 },
      player2: { defesa: 0, esquiva: 0, dano: 0 },
    };
  }
  window.PenalidadesAtivas[`player${jogador}`][tipo] += valor;
}

// Function to update health bar
function atualizarBarraVida(jogador, vidaAtual, vidaMaxima) {
  const porcentagemVida = (vidaAtual / vidaMaxima) * 100;
  const barraVida = document.getElementById(`player${jogador}HealthBar`);

  if (barraVida) {
    barraVida.style.width = `${porcentagemVida}%`;

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

// Function to add battle log messages
function adicionarLogBatalha(mensagem) {
  const logElement = document.getElementById("logBatalha");
  if (logElement) {
    const novoLog = document.createElement("p");
    novoLog.textContent = mensagem;
    logElement.appendChild(novoLog);
    logElement.scrollTop = logElement.scrollHeight;
  }
}

// Main damage calculation function
function calcularDano(jogador, tipoDado, resultado) {
  const atacante =
    jogador === 1 ? window.player1Character : window.player2Character;
  const defensor =
    jogador === 1 ? window.player2Character : window.player1Character;

  // Get base values
  const danoBase = parseDanoBase(atacante.danoBase);
  const armaduraDefensor = parseDanoBase(defensor.armadura);
  const esquivaDefensor = parseDanoBase(defensor.esquiva);

  let danoTotal = danoBase + resultado;
  let mensagemExtra = "";
  let bloqueado = false;

  // Apply class-specific abilities
  switch (atacante.classe) {
    case "Guerreiro":
      if (tipoDado === "D8") {
        if (atacante.staminaMana >= 2) {
          danoTotal += 2;
          mensagemExtra = " (Golpe Poderoso +2)";
          registrarPenalidade(jogador, "defesa", 1);
          atacante.staminaMana -= 2;
        } else {
          bloqueado = true;
          alert("Stamina insuficiente para Golpe Poderoso!");
        }
      }
      break;

    case "Ladino":
      if (tipoDado === "D10") {
        if (atacante.foiAtacado) {
          alert("Ataque Sorrateiro bloqueado: Você foi atacado este turno!");
          bloqueado = true;
        } else if (atacante.usosRestantes <= 0) {
          alert("Ataque Sorrateiro bloqueado: Recarregue por 1 turno!");
          bloqueado = true;
        } else if (atacante.staminaMana < 3) {
          alert("Stamina insuficiente para Ataque Sorrateiro!");
          bloqueado = true;
        } else {
          danoTotal += 3;
          mensagemExtra = " (Ataque Sorrateiro +3)";
          atacante.usosRestantes--;
          atacante.staminaMana -= 3;
        }
      }
      break;

    case "Bárbaro":
      if (tipoDado === "D10") {
        if (atacante.vida >= 15) {
          alert("Fúria bloqueada: Vida deve estar abaixo de 15!");
          bloqueado = true;
        } else if (atacante.usosRestantes <= 0) {
          alert("Fúria bloqueada: Já usou neste combate!");
          bloqueado = true;
        } else if (atacante.staminaMana < 3) {
          alert("Stamina insuficiente para Fúria!");
          bloqueado = true;
        } else {
          danoTotal += 4;
          mensagemExtra = " (Fúria +4)";
          atacante.usosRestantes--;
          atacante.staminaMana -= 3;
        }
      }
      break;

    case "Mago":
      if (tipoDado === "D12") {
        if (atacante.staminaMana < 3) {
          alert("Mana insuficiente para Bola de Fogo!");
          bloqueado = true;
        } else {
          danoTotal += 4;
          mensagemExtra = " (Bola de Fogo +4)";
          registrarPenalidade(jogador, "esquiva", 1);
          atacante.staminaMana -= 3;
        }
      }
      break;

    case "Assassino":
      if (
        tipoDado === "D12" &&
        window.DadosManager?.dadosRolados[`player${jogador}`]?.d20 === 20
      ) {
        if (atacante.staminaMana < 3) {
          alert("Stamina insuficiente para Golpe Mortal!");
          bloqueado = true;
        } else {
          danoTotal += 5;
          mensagemExtra = " (Golpe Mortal +5)";
          atacante.staminaMana -= 3;
        }
      }
      break;

    case "Samurai":
      if (tipoDado === "D10") {
        if (atacante.usosRestantes <= 0) {
          alert("Foco Perfeito bloqueado: Máximo 2 usos por combate!");
          bloqueado = true;
        } else if (atacante.staminaMana < 3) {
          alert("Stamina insuficiente para Foco Perfeito!");
          bloqueado = true;
        } else {
          danoTotal += 3;
          mensagemExtra = " (Foco Perfeito +3)";
          atacante.usosRestantes--;
          atacante.staminaMana -= 3;
        }
      }
      break;

    case "Paladino":
      if (tipoDado === "D8") {
        if (atacante.staminaMana < 2) {
          alert("Stamina insuficiente para Proteção Divina!");
          bloqueado = true;
        } else {
          danoTotal += 2;
          mensagemExtra = " (Proteção Divina +2)";
          registrarPenalidade(jogador, "dano", 2);
          atacante.staminaMana -= 2;
        }
      }
      break;

    case "Arqueiro":
      if (tipoDado === "D8") {
        if (atacante.staminaMana < 2) {
          alert("Stamina insuficiente para Tiro Preciso!");
          bloqueado = true;
        } else {
          danoTotal += 2;
          mensagemExtra = " (Tiro Preciso +2)";
          registrarPenalidade(jogador, "esquiva", 1);
          atacante.staminaMana -= 2;
        }
      }
      break;

    case "Druida":
      if (tipoDado === "D8") {
        if (atacante.staminaMana < 3) {
          alert("Mana insuficiente para Cura Natural!");
          bloqueado = true;
        } else {
          const cura = Math.floor(resultado / 2) + 2;
          atacante.vida = Math.min(atacante.vidaMaxima, atacante.vida + cura);
          document.getElementById(`player${jogador}Vida`).textContent =
            atacante.vida;
          atualizarBarraVida(jogador, atacante.vida, atacante.vidaMaxima);
          mensagemExtra = ` (Cura Natural +${cura})`;
          adicionarLogBatalha(`${atacante.nome} curou ${cura} de vida!`);
          atacante.staminaMana -= 3;
          return 0;
        }
      }
      break;
  }

  if (bloqueado) return 0;

  // Dodge check - NEW SYSTEM
  if (danoTotal <= esquivaDefensor) {
    mensagemExtra += ` (ESQUIVOU! ${danoTotal} ≤ ${esquivaDefensor})`;
    atacante.foiAtacado = true;

    // Mercenary counter-attack
    if (defensor.classe === "Mercenário" && defensor.staminaMana >= 2) {
      defensor.staminaMana -= 2;
      const contraAtaque = Math.max(
        1,
        Math.floor(Math.random() * 6) +
          1 +
          parseDanoBase(defensor.danoBase) -
          parseDanoBase(atacante.armadura)
      );
      mensagemExtra += ` | ${defensor.nome} contra-ataca: ${contraAtaque} de dano!`;
      adicionarLogBatalha(
        `${atacante.nome} usou ${tipoDado} (${resultado})${mensagemExtra}`
      );
      return -contraAtaque;
    }

    adicionarLogBatalha(
      `${atacante.nome} usou ${tipoDado} (${resultado})${mensagemExtra}`
    );
    return 0;
  }

  // Calculate final damage if not dodged
  const danoFinal = Math.max(1, danoTotal - armaduraDefensor);
  mensagemExtra += ` [${danoBase}+${resultado}-${armaduraDefensor}=${danoFinal}]`;

  // Update stamina display
  document.getElementById(
    `player${jogador}Stamina`
  ).textContent = `${atacante.staminaMana}/${atacante.staminaManaMax}`;

  adicionarLogBatalha(
    `${atacante.nome} usou ${tipoDado} (${resultado})${mensagemExtra}`
  );
  return danoFinal;
}

// Export the main function for use in other files
if (typeof module !== "undefined" && module.exports) {
  module.exports = { calcularDano };
} else {
  window.calcularDano = calcularDano;
}
