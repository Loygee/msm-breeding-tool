let monsters = [];
let combinations = [];

// Load data from JSON file
async function loadData() {
  try {
    const response = await fetch('data/monsters.json');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const jsonData = await response.json();
    
    monsters = jsonData.monsters;
    combinations = jsonData.combinations;

    populateDropdowns();
  } catch (error) {
    console.error("Failed to load data:", error);
    document.getElementById('results').innerHTML = 
      `<p style="color: red;">Error loading monster data. Check console.</p>`;
  }
}

// Populate dropdowns after data loads
function populateDropdowns() {
  const select1 = document.getElementById('parent1');
  const select2 = document.getElementById('parent2');

  // Clear defaults/loading options
  select1.innerHTML = '<option value="">Select Monster</option>';
  select2.innerHTML = '<option value="">Select Monster</option>';

  monsters.forEach(monster => {
    const option1 = document.createElement('option');
    option1.value = monster.name;
    option1.textContent = monster.name;
    select1.appendChild(option1);

    const option2 = document.createElement('option');
    option2.value = monster.name;
    option2.textContent = monster.name;
    select2.appendChild(option2);
  });
}

// Calculate breeding results
function calculateBreeding() {
  const p1 = document.getElementById('parent1').value;
  const p2 = document.getElementById('parent2').value;
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Clear previous

  if (!p1 || !p2) {
    resultsDiv.innerHTML = `<p>Please select two monsters.</p>`;
    return;
  }

  resultsDiv.innerHTML = `<p>Breeding <strong>${p1}</strong> + <strong>${p2}</strong>...</p>`;

  // Find all valid results (order doesn't matter)
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
    if (!monsterData) return;

    const card = document.createElement('div');
    card.className = 'result-card';
    card.innerHTML = `
      <h3>${combo.result}</h3>
      <p><strong>Elements:</strong> ${monsterData.elements.join(', ')}</p>
      <p><strong>Breeding Time:</strong> ${monsterData.breeding_time || 'Unknown'}</p>
    `;
    resultsDiv.appendChild(card);
  });
}

// Load data when page finishes loading
window.addEventListener('DOMContentLoaded', loadData);
