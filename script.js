// Global data storage
let monsters = [];
let combinations = [];

// DOM Elements (set globally)
let input1, input2, suggestions1, suggestions2, resultsDiv;

// Selected monsters
let selectedMonster1 = null;
let selectedMonster2 = null;

// On page load
window.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded");

  // Re-get elements after DOM is ready
  input1 = document.getElementById('monster1-input');
  input2 = document.getElementById('monster2-input');
  suggestions1 = document.getElementById('suggestions1');
  suggestions2 = document.getElementById('suggestions2');
  resultsDiv = document.getElementById('results');

  // Verify elements exist
  if (!input1 || !input2 || !suggestions1 || !suggestions2 || !resultsDiv) {
    console.error("Missing required DOM elements:", { input1, input2, suggestions1, suggestions2, resultsDiv });
    return;
  }

  console.log("All elements found, loading data...");
  loadData();
});

async function loadData() {
  try {
    const response = await fetch('data/monsters.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    
    const jsonData = await response.json();
    monsters = jsonData.monsters;
    combinations = jsonData.combinations;

    console.log("✅ Data loaded:", monsters.length, "monsters");

    // Now attach event listeners
    input1.addEventListener('input', () => {
      console.log("Input 1 changed:", input1.value);
      showSuggestions(input1, suggestions1);
    });

    input2.addEventListener('input', () => {
      console.log("Input 2 changed:", input2.value);
      showSuggestions(input2, suggestions2);
    });

  } catch (error) {
    console.error("🔴 Failed to load monster ", error);
    if (resultsDiv) {
      resultsDiv.innerHTML = `
        <p style="color: red;">
          ❌ Could not load game data. Is <code>data/monsters.json</code> missing?
        </p>`;
    }
  }
}

function showSuggestions(input, suggestionsList) {
  console.log("🔍 showSuggestions triggered:", input.value);

  const query = input.value.trim().toLowerCase();
  suggestionsList.innerHTML = '';

  if (!query) return;

  const excludedMonster = input === input1 ? selectedMonster2 : selectedMonster1;

  const filtered = monsters.filter(monster => {
    const matchesQuery = monster.name.toLowerCase().includes(query);
    const notExcluded = monster.name !== excludedMonster;
    return matchesQuery && notExcluded;
  });

  console.log("Filtered suggestions:", filtered);

  filtered.forEach(monster => {
    const li = document.createElement('li');
    li.textContent = monster.name;
    li.addEventListener('click', () => {
      const chosenName = monster.name;
      if (input === input1 && chosenName === selectedMonster2) return;
      if (input === input2 && chosenName === selectedMonster1) return;

      if (input === input1) {
        selectedMonster1 = chosenName;
        input1.value = chosenName;
      } else {
        selectedMonster2 = chosenName;
        input2.value = chosenName;
      }

      suggestions1.innerHTML = '';
      suggestions2.innerHTML = '';

      showSuggestions(input1, suggestions1);
      showSuggestions(input2, suggestions2);
    });
    suggestionsList.appendChild(li);
  });
}

// Hide suggestions when clicking elsewhere
document.addEventListener('click', (e) => {
  if (e.target !== input1 && !suggestions1?.contains(e.target)) suggestions1?.innerHTML = '';
  if (e.target !== input2 && !suggestions2?.contains(e.target)) suggestions2?.innerHTML = '';
});

// Clear selection on blur
input1?.addEventListener('blur', () => {
  if (input1 && !input1.value.trim()) {
    selectedMonster1 = null;
    showSuggestions(input2, suggestions2);
  }
});
input2?.addEventListener('blur', () => {
  if (input2 && !input2.value.trim()) {
    selectedMonster2 = null;
    showSuggestions(input1, suggestions1);
  }
});

function calculateBreeding() {
  // ... keep your existing logic
}
