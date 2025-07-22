// Global data storage
let monsters = [];
let combinations = [];

// DOM Elements
const input1 = document.getElementById('monster1-input');
const input2 = document.getElementById('monster2-input');
const suggestions1 = document.getElementById('suggestions1');
const suggestions2 = document.getElementById('suggestions2');
const resultsDiv = document.getElementById('results');

// Selected monsters (by name)
let selectedMonster1 = null;
let selectedMonster2 = null;

// Load monster data from JSON file
async function loadData() {
  try {
    const response = await fetch('data/monsters.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    
    const jsonData = await response.json();
    monsters = jsonData.monsters;
    combinations = jsonData.combinations;

    // Initialize event listeners after data loads
    input1.addEventListener('input', () => showSuggestions(input1, suggestions1));
    input2.addEventListener('input', () => showSuggestions(input2, suggestions2));

  } catch (error) {
    console.error("Failed to load monster data:", error);
    resultsDiv.innerHTML = `
      <p style="color: red;">
        ❌ Could not load game data. Check console or try again later.
      </p>`;
  }
}

// Show autocomplete suggestions, excluding already-selected monster
function showSuggestions(input, suggestionsList) {
  const query = input.value.trim().toLowerCase();
  suggestionsList.innerHTML = '';

  if (!query) return;

  // Determine which monster is taken by the other input
  const excludedMonster = input === input1 ? selectedMonster2 : selectedMonster1;

  const filtered = monsters.filter(monster => {
    const matchesQuery = monster.name.toLowerCase().includes(query);
    const notExcluded = monster.name !== excludedMonster;
    return matchesQuery && notExcluded;
  });

  filtered.forEach(monster => {
    const li = document.createElement('li');
    li.textContent = monster.name;
    li.addEventListener('click', () => {
      const chosenName = monster.name;
    
      if (input === input1) {
        // Prevent selecting the same as monster2
        if (chosenName === selectedMonster2) return;
    
        selectedMonster1 = chosenName;
        input1.value = chosenName;
      } else {
        // Prevent selecting the same as monster1
        if (chosenName === selectedMonster1) return;
    
        selectedMonster2 = chosenName;
        input2.value = chosenName;
      }
    
      // Clear suggestion lists
      suggestions1.innerHTML = '';
      suggestions2.innerHTML = '';
    
      // Re-render suggestions for both inputs (to reflect updated exclusions)
      showSuggestions(input1, suggestions1);
      showSuggestions(input2, suggestions2);
    });
    }

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (e.target !== input1 && !suggestions1.contains(e.target)) {
    suggestions1.innerHTML = '';
  }
  if (e.target !== input2 && !suggestions2.contains(e.target)) {
    suggestions2.innerHTML = '';
  }
});

// Clear selection when input is emptied
input1.addEventListener('blur', () => {
  if (!input1.value.trim()) {
    selectedMonster1 = null;
    showSuggestions(input2, suggestions2);
  }
});
input2.addEventListener('blur', () => {
  if (!input2.value.trim()) {
    selectedMonster2 = null;
    showSuggestions(input1, suggestions1);
  }
});

// Calculate breeding result
function calculateBreeding() {
  const p1 = input1.value.trim();
  const p2 = input2.value.trim();

  resultsDiv.innerHTML = '';

  if (!p1 || !p2) {
    resultsDiv.innerHTML = '<p>Please select two different monsters.</p>';
    return;
  }

  // Validate that both are valid monsters
  const validNames = monsters.map(m => m.name);
  if (!validNames.includes(p1)) {
    resultsDiv.innerHTML = `<p>⚠️ Unknown monster: <strong>${p1}</strong></p>`;
    return;
  }
  if (!validNames.includes(p2)) {
    resultsDiv.innerHTML = `<p>⚠️ Unknown monster: <strong>${p2}</strong></p>`;
    return;
  }

  resultsDiv.innerHTML = `<p>Breeding <strong>${p1}</strong> + <strong>${p2}</strong>...</p>`;

  // Find matching combinations (order doesn't matter)
  const possible = combinations.filter(
    combo =>
      (combo.parent1 === p1 && combo.parent2 === p2) ||
      (combo.parent1 === p2 && combo.parent2 === p1)
  );

  if (possible.length === 0) {
    resultsDiv.innerHTML += `<p>No known offspring from this combination.</p>`;
    return;
  }

  possible.forEach(combo => {
    const monsterData = monsters.find(m => m.name === combo.result);
    if (!monsterData) {
      resultsDiv.innerHTML += `<p>Error: Missing data for "${combo.result}".</p>`;
      return;
    }

    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <h3>${combo.result}</h3>
      <p><strong>Class:</strong> ${monsterData.class || 'Unknown'}</p>
      <p><strong>Elements:</strong> ${monsterData.elements.join(', ')}</p>
      <p><strong>Breeding Time:</strong> ${monsterData.breeding_time || 'Unknown'}</p>
      <p><strong>Available on:</strong> ${monsterData.islands.join(', ')}</p>
    `;
    resultsDiv.appendChild(card);
  });
}

// Load data when page finishes loading
window.addEventListener('DOMContentLoaded', loadData);
