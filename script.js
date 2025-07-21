// Load JSON data
const jsonData = JSON.parse(document.getElementById('monster-data').textContent);
const monsters = jsonData.monsters;
const combinations = jsonData.combinations;

// Populate dropdowns
const select1 = document.getElementById('parent1');
const select2 = document.getElementById('parent2');

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

// Calculate breeding results
function calculateBreeding() {
  const p1 = select1.value;
  const p2 = select2.value;
  const resultsDiv = document.getElementById('results');
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