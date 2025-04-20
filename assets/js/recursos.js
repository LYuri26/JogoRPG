window.ResourceManager = {
  updateResources: function (character) {
    if (!character || !character.playerId) return;

    const staminaElement = document.getElementById(
      `${character.playerId}-stamina`
    );
    if (staminaElement) {
      staminaElement.textContent = `${character.stamina}/${character.staminaMax}`;
    }

    this.updateAbilityButtons(character);
  },

  updateAbilityButtons: function (character) {
    if (!character || !character.playerId) return;

    const buttons = document.querySelectorAll(
      `#${character.playerId}-abilities button, #${character.playerId}-dice-container .special`
    );
    buttons.forEach((button) => {
      if (
        character.specialAbility &&
        button.textContent.includes(character.specialAbility)
      ) {
        button.disabled =
          character.stamina < character.cost ||
          (character.penalty?.max &&
            character.usedThisCombat >= character.penalty.max);
      }
    });
  },

  resetCombat: function (character) {
    if (character && character.resetCombat) {
      character.resetCombat();
    }
    this.updateResources(character);
  },

  resetTurn: function (character) {
    if (character && character.resetTurn) {
      character.resetTurn();
    }
    this.updateResources(character);
  },
};
