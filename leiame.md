# 📜 Desafio: Sistema de Combate Baseado em Turnos

## 🎯 Objetivo

Criar um jogo de combate tático onde dois jogadores escolhem classes distintas e batalham por turnos usando rolagens de dados e habilidades especiais.

---

## 📌 Regras do Jogo

### 🎲 Fluxo do Turno
1️⃣ **Jogador Atacante** escolhe se vai usar uma Habilidade Especial (gasta Stamina/Mana antes de rolar o D20).  
2️⃣ **Jogador Defensor** escolhe se vai usar uma Habilidade Especial (gasta Stamina/Mana antes de rolar o D20 de esquiva).  
3️⃣ **Atacante** rola um D20 para determinar a força do ataque.  
4️⃣ **Defensor** rola um D20 para tentar esquivar.  
5️⃣ **Comparação das rolagens:**
- Se o defensor obtiver um número maior ou igual ao atacante, esquiva com sucesso.
- Se o atacante vencer, o dano é rolado com um D6 e somado ao bônus da classe. O dano final é reduzido pelo valor da esquiva e armadura do defensor.
6️⃣ Registrar os danos e continuar o combate até que um jogador fique sem vida.

---

### 📢 Regras das Habilidades

✅ **As habilidades só podem ser ativadas antes da rolagem de dados!**  
✅ Se uma habilidade for de **ataque**, deve ser usada antes de rolar o D20 de ataque.  
✅ Se for de **defesa**, deve ser usada antes de rolar o D20 de esquiva.  
✅ O gasto de **Stamina/Mana** ocorre imediatamente ao declarar a habilidade.  
✅ **Habilidades com limite por combate** continuam com as mesmas restrições.

---

## 🛡️ Tabela de Classes e Atributos

| **Classe**     | **Vida** | **Dano Base** | **Armadura** | **Esquiva** | **Peso** | **Stamina/Mana** | **Habilidade Especial**           | **Custo** | **Penalidade**                          |
|----------------|----------|---------------|--------------|-------------|----------|------------------|------------------------------------|-----------|-----------------------------------------|
| Guerreiro      | 30       | 3             | 5            | 2           | 4        | 6                | Força Brutal: Rola um D8 extra no ataque. | 2 Stamina | -1 defesa no turno seguinte.            |
| Ladino         | 25       | 2             | 2            | 5           | 1        | 6                | Ataque Sorrateiro: Se não foi atacado no turno anterior, rola um D10 extra. | 3 Stamina | Só pode ser usado a cada 2 turnos.      |
| Mago           | 20       | 4             | 1            | 3           | 2        | 9                | Bola de Fogo: Pode rolar um D12 no ataque. | 3 Mana    | -1 esquiva no turno seguinte.           |
| Paladino       | 35       | 3             | 4            | 3           | 3        | 6                | Proteção Divina: Rola um D8 extra na defesa. | 2 Stamina | -2 no próximo ataque.                   |
| Bárbaro        | 35       | 4             | 3            | 3           | 3        | 6                | Fúria: Quando a vida cair abaixo de 15, rola um D10 extra no ataque. | 3 Stamina | Só pode ser usado uma vez por combate.  |
| Arqueiro       | 25       | 3             | 2            | 4           | 1        | 6                | Tiro Preciso: Rola um D8 extra no ataque. | 2 Stamina | -1 esquiva no turno seguinte.           |
| Monge          | 30       | 2             | 3            | 5           | 0        | 6                | Reflexos Aguçados: Rola um D6 extra ao esquivar. | 2 Stamina | -1 dano no próximo ataque.              |
| Cavaleiro      | 35       | 3             | 5            | 2           | 4        | 6                | Defesa Absoluta: Ignora um ataque fraco ou médio. | 3 Stamina | Não pode atacar no turno seguinte.      |
| Assassino      | 25       | 4             | 2            | 4           | 1        | 6                | Golpe Mortal: Se tirar 20 no D20 de ataque, rola um D12 extra. | 3 Stamina | Custa 2 Stamina adicionais se falhar.   |
| Druida         | 30       | 3             | 3            | 3           | 2        | 9                | Cura Natural: Rola um D8 e recupera vida. | 3 Mana    | Só pode ser usado 3 vezes por combate.  |
| Gladiador      | 35       | 4             | 4            | 2           | 3        | 6                | Resistência Extrema: Rola um D6 extra para reduzir dano recebido. | 2 Stamina | Não pode usar outra habilidade no próximo turno. |
| Caçador        | 25       | 3             | 3            | 4           | 2        | 6                | Armadilha Oculta: O inimigo rola um D12 em vez do D20 para esquiva. | 3 Stamina | Só pode ser usado a cada 3 turnos.      |
| Mercenário     | 30       | 3             | 4            | 3           | 3        | 6                | Golpe Oportunista: Se esquivar, pode contra-atacar com um D6 extra. | 2 Stamina | -1 esquiva no turno seguinte.           |
| Feiticeiro     | 20       | 4             | 1            | 3           | 2        | 9                | Explosão Arcana: Rola um D20 para ataque. | 3 Mana    | Reduz 2 de vida ao usar.                |
| Samurai        | 30       | 4             | 4            | 3           | 3        | 6                | Foco Perfeito: Se não usou habilidade no turno anterior, rola um D10 extra. | 3 Stamina | Só pode ser usado 2 vezes por combate.  |

---

## 🌳 Nova Árvore de Diretórios

```
/rpg-combat-system
│
├── /assets
│   ├── /images         # Imagens do projeto (se necessário)
│   └── /fonts          # Fontes personalizadas, se necessário
│
├── /css
│   ├── style.css       # Arquivo principal de estilo CSS
│   ├── /classes
│   │   ├── guerreiro.css
│   │   ├── ladino.css
│   │   ├── mago.css
│   │   ├── paladino.css
│   │   ├── barbaro.css
│   │   ├── arqueiro.css
│   │   ├── monge.css
│   │   ├── cavaleiro.css
│   │   ├── assassino.css
│   │   ├── druida.css
│   │   ├── gladiador.css
│   │   ├── caçador.css
│   │   ├── mercenario.css
│   │   ├── feiticeiro.css
│   │   └── samurai.css
│   └── modal.css       # Estilos para o modal de cada personagem
│
├── /js
│   ├── data.js         # Lógica de dados e cálculos (rolagens, habilidades, etc)
│   ├── guerreiro.js    # Funções específicas do Guerreiro
│   ├── ladino.js       # Funções específicas do Ladino
│   ├── mago.js         # Funções específicas do Mago
│   ├── paladino.js     # Funções específicas do Paladino
│   ├── barbaro.js      # Funções específicas do Bárbaro
│   ├── arqueiro.js     # Funções específicas do Arqueiro
│   ├── monge.js        # Funções específicas do Monge
│   ├── cavaleiro.js    # Funções específicas do Cavaleiro
│   ├── assassino.js    # Funções específicas do Assassino
│   ├── druida.js       # Funções específicas do Druida
│   ├── gladiador.js    # Funções específicas do Gladiador
│   ├── cacador.js      # Funções específicas do Caçador
│   ├── mercenario.js   # Funções específicas do Mercenário
│   ├── feiticeiro.js   # Funções específicas do Feiticeiro
│   └── samurai.js      # Funções específicas do Samurai
│
├── /index.html         # Arquivo principal HTML
└── /README.md          # Documentação do projeto
```