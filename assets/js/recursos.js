window.ResourceManager = {
  updateResources: function (character) {
    if (!character || !character.playerId) return;

    // Atualiza stamina/mana
    const staminaElement = document.getElementById(
      `${character.playerId}-stamina`
    );
    if (staminaElement) {
      staminaElement.textContent = `${character.staminaMana}/${character.staminaManaMax}`;
    }

    // Atualiza usos restantes se aplicável
    if (character.usosRestantes !== undefined) {
      const usesElement = document.getElementById(`${character.playerId}-uses`);
      if (usesElement) {
        usesElement.textContent = character.usosRestantes;
      }
    }

    this.updateAbilityButtons(character);
  },

  updateAbilityButtons: function (character) {
    if (!character || !character.playerId) return;

    const config = DanoSystem.ClassConfig[character.classe] || {};
    const specialDice = config.dice || "D6";
    const buttons = document.querySelectorAll(
      `#${character.playerId}-dice-container button`
    );

    buttons.forEach((button) => {
      const diceType = button.id
        .replace(`${character.playerId}`, "")
        .replace("Btn", "");

      // Verifica se é um ataque especial
      if (diceType === specialDice) {
        const canUse = this.canUseSpecialAbility(character, config);
        button.disabled = !canUse;
        button.title = canUse
          ? config.description || "Habilidade especial"
          : this.getRestrictionMessage(character, config);
      } else {
        // Ataque básico - sempre disponível se tiver recursos
        button.disabled = character.staminaMana < 1;
      }
    });
  },

  canUseSpecialAbility: function (character, config) {
    // Verifica recursos
    if (character.staminaMana < (config.cost || 0)) return false;

    // Verifica condições específicas
    if (config.condition && !config.condition(character)) return false;

    // Verifica usos restantes
    if (config.maxUses && (character.usosRestantes || 0) <= 0) return false;

    // Verifica penalidades ativas
    if (character.penaltyActive) return false;

    return true;
  },

  getRestrictionMessage: function (character, config) {
    if (character.staminaMana < (config.cost || 0)) {
      return "Recursos insuficientes!";
    }

    for (const cond of config.conditions || []) {
      if (cond.condicao(character)) {
        return cond.mensagem;
      }
    }

    if (config.maxUses && (character.usosRestantes || 0) <= 0) {
      return `Máximo de ${config.maxUses} usos atingido!`;
    }

    return "Habilidade não disponível";
  },

  applyAbilityCost: function (character) {
    const config = DanoSystem.ClassConfig[character.classe] || {};
    if (config.cost) {
      character.staminaMana = Math.max(0, character.staminaMana - config.cost);
    }

    if (config.maxUses && character.usosRestantes !== undefined) {
      character.usosRestantes = Math.max(0, character.usosRestantes - 1);
    }

    this.updateResources(character);
  },

  resetCombat: function (character) {
    if (character && character.resetCombat) {
      character.resetCombat();
    }

    // Reseta usos por combate
    const config = DanoSystem.ClassConfig[character.classe] || {};
    if (config.maxUses) {
      character.usosRestantes = config.maxUses;
    }

    this.updateResources(character);
  },

  resetTurn: function (character) {
    if (character && character.resetTurn) {
      character.resetTurn();
    }

    // Recupera stamina/mana
    character.staminaMana = Math.min(
      character.staminaMana + 2,
      character.staminaManaMax
    );

    this.updateResources(character);
  },
};
