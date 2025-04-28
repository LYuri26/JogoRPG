# 🏰 RPG Combat - Sistema de Combate Tático por Turnos

_Batalhas épicas esperam por você!_

Um sistema completo de combate estratégico entre 15 classes únicas, com mecânicas profundas de gerenciamento de recursos, habilidades especiais e penalidades táticas. Perfeito para duelos PvP ou integração em sistemas RPG mais complexos.

## 🌟 Recursos Principais

- **15 classes** totalmente distintas com identidades únicas
- **Sistema dual de recursos** (Stamina para físicos, Mana para mágicos)
- **50+ habilidades especiais** com trade-offs estratégicos
- **Combate baseado em D20** com críticos e falhas
- **Interface intuitiva** com feedback visual claro
- **Arquitetura modular** para fácil expansão
- **Sistema de penalidades** que adiciona profundidade tática

## 🎮 Como Jogar

### 📜 Fluxo Básico do Jogo

1. **Seleção de Personagens**: Escolha entre 15 classes únicas
2. **Combate por Turnos**: Sistema alternado de ataques e defesas
3. **Gerenciamento de Recursos**: Stamina/Mana limitados para habilidades
4. **Vitória**: Reduza a vida do oponente a zero

# 🛡️ Classes do Jogo

## 🏆 Classes do Jogo - Especificações Completas

### Visão Geral por Categorias

| Categoria   | Classes Incluídas              | Características Principais         | Melhor Contra    |
| ----------- | ------------------------------ | ---------------------------------- | ---------------- |
| Tanques     | Guerreiro, Paladino, Cavaleiro | Alta vida e armadura               | Ataques físicos  |
| Dano Físico | Bárbaro, Assassino, Gladiador  | Dano bruto e habilidades ofensivas | Classes frágeis  |
| Mágicos     | Mago, Feiticeiro, Druida       | Dano mágico e efeitos especiais    | Tanques          |
| Ágeis       | Ladino, Arqueiro, Caçador      | Alta esquiva e precisão            | Alvos lentos     |
| Versáteis   | Monge, Mercenário, Samurai     | Combinações balanceadas            | Vários oponentes |

### Tabela Completa de Atributos

| Classe         | Vida | Dano | Armadura | Esquiva | Peso | Recurso | Habilidade Especial         | Custo  | Penalidade/Condição                            |
| -------------- | ---- | ---- | -------- | ------- | ---- | ------- | --------------------------- | ------ | ---------------------------------------------- |
| **Guerreiro**  | 32   | 3    | 4        | 2       | 4    | 6 Stam  | Golpe Brutal (+1D8)         | 2 Stam | -1 Armadura próximo turno                      |
| **Ladino**     | 26   | 2    | 2        | 5       | 1    | 6 Stam  | Ataque Furtivo (+1D10)      | 3 Stam | CD: 2 turnos                                   |
| **Mago**       | 20   | 4    | 1        | 4       | 2    | 6 Mana  | Bola de Fogo (+1D12)        | 3 Mana | -2 Esquiva próximo turno                       |
| **Paladino**   | 36   | 3    | 4        | 2       | 3    | 6 Stam  | Ira Sagrada (+1D8)          | 2 Stam | Sofre 2 de dano                                |
| **Bárbaro**    | 34   | 4    | 3        | 2       | 3    | 6 Stam  | Fúria Primordial (+1D12)    | 6 Stam | ≤15 Vida, 1x/combate                           |
| **Arqueiro**   | 26   | 3    | 2        | 4       | 1    | 6 Stam  | Tiro Certeiro (+1D8)        | 2 Stam | -1 Esquiva próximo turno                       |
| **Monge**      | 30   | 3    | 3        | 5       | 0    | 6 Stam  | Golpe Interior (+1D8)       | 2 Stam | -1 Armadura após uso                           |
| **Cavaleiro**  | 35   | 3    | 5        | 2       | 4    | 6 Stam  | Investida de Ferro (+1D8)   | 3 Stam | -1 Esquiva próximo turno                       |
| **Assassino**  | 25   | 4    | 2        | 4       | 1    | 6 Stam  | Execução Silenciosa (+1D10) | 3 Stam | Requer D20 ≥16                                 |
| **Druida**     | 30   | 3    | 3        | 3       | 2    | 6 Mana  | Espinhos Naturais (+1D8)    | 3 Mana | Máx. 2 usos, causa 1 auto-dano                 |
| **Gladiador**  | 34   | 4    | 4        | 2       | 3    | 6 Stam  | Força Impiedosa (+1D8)      | 2 Stam | Máx. 3 usos, perde próximo turno               |
| **Caçador**    | 27   | 3    | 3        | 4       | 2    | 6 Stam  | Disparo Selvagem (+1D12)    | 3 Stam | CD: 5 turnos                                   |
| **Mercenário** | 30   | 3    | 4        | 3       | 3    | 6 Stam  | Retaliação Precisa (+1D10)  | 2 Stam | >30% Vida, máx. 3 usos                         |
| **Feiticeiro** | 20   | 4    | 1        | 4       | 2    | 8 Mana  | Explosão Arcana (+1D12)     | 3 Mana | Perde 50% Vida, não usa com 1 HP               |
| **Samurai**    | 30   | 4    | 4        | 3       | 3    | 6 Stam  | Espírito Afiado (+1D10)     | 3 Stam | Não usou habilidade no turno anterior, máx. 2x |

### 🔍 Legenda dos Atributos

- **CD**: Tempo de recarga em turnos
- **Stam**: Stamina (recursos físicos)
- **Mana**: Recursos mágicos
- **Auto-dano**: Dano sofrido pelo usuário
- **1x/combate**: Pode ser usado apenas uma vez por combate

### 🎯 Dicas de Combinação

1. **Tanque + Mágico**: Paladino protege o Mago enquanto ele causa dano massivo
2. **Ágil + Dano Físico**: Ladino distrai enquanto o Bárbaro ataca
3. **Versáteis**: Samurai e Monge são adaptáveis a várias situações

> 💡 Todas as classes foram meticulosamente balanceadas para garantir combates justos e estratégicos. As penalidades são parte fundamental do equilíbrio!

## 🛡️ Tabela de Classes e Atributos

Cada classe possui um conjunto fixo de atributos e uma habilidade especial que pode virar o jogo. Use com estratégia — o custo sempre cobra a fatura!

| **Classe**     | **Vida** | **Dano** | **Armadura** | **Esquiva** | **Peso** | **Recursos** | **Habilidade Especial**                                           | **Custo** | **Condição / Penalidade**                                             |
| -------------- | -------- | -------- | ------------ | ----------- | -------- | ------------ | ----------------------------------------------------------------- | --------- | --------------------------------------------------------------------- |
| **Guerreiro**  | 32       | 3        | 4            | 2           | 4        | 6 Stamina    | **Golpe Brutal**: +1D8 no ataque                                  | 2 Stamina | -1 Armadura no próximo turno                                          |
| **Ladino**     | 26       | 2        | 2            | 5           | 1        | 6 Stamina    | **Ataque Furtivo**: +1D10 no ataque                               | 3 Stamina | Só pode usar a cada 2 turnos                                          |
| **Mago**       | 20       | 4        | 1            | 4           | 2        | 6 Mana       | **Bola de Fogo**: +1D12 no ataque                                 | 3 Mana    | -2 Esquiva no próximo turno                                           |
| **Paladino**   | 36       | 3        | 4            | 2           | 3        | 6 Stamina    | **Ira Sagrada**: +1D8 no ataque                                   | 2 Stamina | Sofre 2 de dano direto após o uso                                     |
| **Bárbaro**    | 34       | 4        | 3            | 2           | 3        | 6 Stamina    | **Fúria Primordial**: +1D12 no ataque                             | 6 Stamina | Só se tiver ≤15 Vida. Usável 1x por combate                           |
| **Arqueiro**   | 26       | 3        | 2            | 4           | 1        | 6 Stamina    | **Tiro Certeiro**: +1D8 no ataque                                 | 2 Stamina | -1 Esquiva no próximo turno                                           |
| **Monge**      | 30       | 3        | 3            | 5           | 0        | 6 Stamina    | **Golpe Interior**: +1D8 no ataque                                | 2 Stamina | -1 Armadura após o uso                                                |
| **Cavaleiro**  | 35       | 3        | 5            | 2           | 4        | 6 Stamina    | **Investida de Ferro**: +1D8 ataque                               | 3 Stamina | -1 Esquiva no próximo turno                                           |
| **Assassino**  | 25       | 4        | 2            | 4           | 1        | 6 Stamina    | **Execução Silenciosa**: +1D10 no ataque se tirar ≥16 no D20      | 3 Stamina | Só ativa com D20 ≥16                                                  |
| **Druida**     | 30       | 3        | 3            | 3           | 2        | 6 Mana       | **Espinhos Naturais**: +1D8 no ataque                             | 3 Mana    | Máx. 2 usos por combate. Causa 1 de dano ao usuário                   |
| **Gladiador**  | 34       | 4        | 4            | 2           | 3        | 6 Stamina    | **Força Impiedosa**: +1D8 no ataque                               | 2 Stamina | Máx. 3 vezes por combate. Fica indisponível no próximo turno          |
| **Caçador**    | 27       | 3        | 3            | 4           | 2        | 6 Stamina    | **Disparo Selvagem**: +1D12 ataque                                | 3 Stamina | Só pode usar a cada 5 turnos                                          |
| **Mercenário** | 30       | 3        | 4            | 3           | 3        | 6 Stamina    | **Retaliação Precisa**: +1D10 no ataque após esquiva bem-sucedida | 2 Stamina | Só se tiver >30% da Vida. Máx. 3 usos por combate                     |
| **Feiticeiro** | 20       | 4        | 1            | 4           | 2        | 8 Mana       | **Explosão Arcana**: +1D12 ataque                                 | 3 Mana    | Perde 50% da Vida atual. Não pode usar com 1 de Vida                  |
| **Samurai**    | 30       | 4        | 4            | 3           | 3        | 6 Stamina    | **Espírito Afiado**: +1D10 ataque                                 | 3 Stamina | Só se não usou habilidade no turno anterior. Máx. 2 vezes por combate |

## 🎲 Sistema de Dados

### Dados Utilizados

| Dado | Uso Principal              | Crítico | Falha Crítica |
| ---- | -------------------------- | ------- | ------------- |
| D20  | Ataque/Esquiva             | 20      | 1             |
| D6   | Dano base                  | 6       | 1             |
| D8   | Habilidades básicas        | 8       | 1             |
| D10  | Habilidades intermediárias | 10      | 1             |
| D12  | Habilidades poderosas      | 12      | 1             |

### Fórmulas de Combate

```math
Dano Total = (D6 + Dano Base + Dado Habilidade) - (Armadura - Penalidades)
Chance de Acerto = (D20 Atacante) > (D20 Defensor + Bônus Esquiva)
```

## 📂 Estrutura do Projeto

```
JogoRPG/
├── assets/
│   ├── css/
│   │   ├── jogo.css
│   │   ├── regras.css
│   │   └── style.css
│   ├── images/
│   │   ├── arqueiro.jpeg
│   │   ├── assassino.jpeg
│   │   ├── barbaro.jpeg
│   │   ├── cacador.jpeg
│   │   ├── cavaleiro.jpeg
│   │   ├── druida.jpeg
│   │   ├── feiticeiro.jpeg
│   │   ├── gladiador.jpeg
│   │   ├── guerreiro.jpeg
│   │   ├── ladino.jpeg
│   │   ├── mago.jpeg
│   │   ├── mercenario.jpeg
│   │   ├── monge.jpeg
│   │   ├── paladino.jpeg
│   │   └── samurai.jpeg
│   └── js/
│       ├── personagens/
│       │   ├── arqueiro.js
│       │   ├── assassino.js
│       │   ├── barbaro.js
│       │   ├── cacador.js
│       │   ├── cavaleiro.js
│       │   ├── druida.js
│       │   ├── feiticeiro.js
│       │   ├── gladiador.js
│       │   ├── guerreiro.js
│       │   ├── ladino.js
│       │   ├── mago.js
│       │   ├── mercenario.js
│       │   ├── monge.js
│       │   ├── paladino.js
│       │   └── samurai.js
│       ├── combate.js
│       ├── habilidades.js
│       ├── interface.js
│       ├── jogo.js
│       ├── modalpersonagens.js
│       ├── personagens_loader.js
│       ├── regras.js
│       └── selecao.js
├── .gitattributes
├── index.html
├── jogo.html
├── leiame.md
└── regras.html
```

## 🏗️ Roadmap de Desenvolvimento

### Versão Atual (1.0)

- [x] Sistema básico de combate
- [x] 15 classes balanceadas
- [x] Interface responsiva
- [x] Sistema de rolagem de dados

### Próximas Atualizações

- [ ] Sistema de dano crítico ou falha crítica ( 2026)
- [ ] Alteração de habilidades e penalidades (2027)
- [ ] Integração multiplayer online (2028)

## 🧑‍💻 Como Contribuir

1. **Reporte Bugs**

   - Abra uma issue detalhando o problema
   - Inclua screenshots se possível

2. **Sugira Melhorias**

   - Proponha novas classes/mecânicas
   - Discuta balanceamento

3. **Desenvolva**

   ```bash
   # Clone o repositório
   git clone https://github.com/LYuri26/JogoRPG.git

   # Instale as dependências
   npm install

   # Faça suas modificações
   git checkout -b minha-feature

   # Envie as alterações
   git push origin minha-feature
   ```

## 📜 Licença

MIT License - Livre para uso e modificação, mantendo os créditos originais.

```
Copyright 2025 Lenon Yuri

Permissão é concedida, gratuitamente, a qualquer pessoa que obtenha uma cópia da aplicação web denominada RPG Combat e dos arquivos de documentação associados (o "Software"), para lidar com o Software sem restrições, incluindo, sem limitação, os direitos de:

    Usar o Software;

    Copiar o Software;

    Modificar o Software;

    Fundir o Software;

    Publicar o Software;

    Distribuir o Software;

    Sublicenciar o Software.

Venda e Lucro:

    É proibida a venda do Software ou de produtos derivados sem o repasse de 20% (vinte por cento) do lucro líquido obtido para o autor original, Lenon Yuri.

    A ausência do repasse constitui violação de direitos autorais e poderá ensejar medidas judiciais cabíveis.

Condições:

    O aviso de copyright acima e este aviso de permissão devem ser incluídos em todas as cópias ou partes substanciais do Software.

    O Software é fornecido "no estado em que se encontra" ("as is"), sem qualquer tipo de garantia, expressa ou implícita, incluindo, mas não se limitando às garantias de comercialização, adequação a um propósito específico e não violação.

    Em nenhuma hipótese os autores ou detentores dos direitos serão responsabilizados por quaisquer danos ou outras responsabilidades, seja em ação contratual, ilícito civil ou de outra forma, decorrente do uso ou da impossibilidade de uso do Software.
```

---

**Desenvolvido por Lenon Yuri**  
[🌐 Site Pessoal](https://lyuri26.github.io/Curriculo/) | [💻 GitHub](https://github.com/LYuri26)

_"O capitalismo falhou, falha e falhará."_

- João Carvalho
