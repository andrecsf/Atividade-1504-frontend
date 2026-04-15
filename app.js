const API_URL = 'https://atividade-1504-backend.onrender.com/api/movies';

const form = document.getElementById('entry-form');
const entryId = document.getElementById('entry-id');
const title = document.getElementById('title');
const year = document.getElementById('year');
const director = document.getElementById('director');
const rating = document.getElementById('rating');
const description = document.getElementById('description');
const entriesList = document.getElementById('entries-list');
const message = document.getElementById('message');
const cancelEdit = document.getElementById('cancel-edit');
const formTitle = document.getElementById('form-title');
const reloadBtn = document.getElementById('reload-btn');

function showMessage(text) {
  message.textContent = text;
}

function clearForm() {
  form.reset();
  entryId.value = '';
  formTitle.textContent = 'Novo registro';
  cancelEdit.classList.add('hidden');
}

function formatDate(date) {
  return new Date(date).toLocaleString('pt-BR');
}

async function loadEntries() {
  const response = await fetch(API_URL);
  const entries = await response.json();

  if (!entries.length) {
    entriesList.innerHTML = '<p>Nenhum registro encontrado.</p>';
    return;
  }

  entriesList.innerHTML = entries.map(entry => `
    <div class="entry-item">
      <h3>${entry.title} (${entry.year})</h3>
      <p><strong>Diretor:</strong> ${entry.director}</p>
      <p><strong>Nota:</strong> ${entry.rating}/10</p>
      <p>${entry.description}</p>
      <small>Registrado em: ${formatDate(entry.createdAt)}</small>
      <div class="entry-buttons">
        <button onclick="editEntry('${entry._id}')">Editar</button>
        <button onclick="deleteEntry('${entry._id}')">Excluir</button>
      </div>
    </div>
  `).join('');
}

async function saveEntry(data) {
  const id = entryId.value;
  const url = id ? `${API_URL}/${id}` : API_URL;
  const method = id ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

window.editEntry = async function (id) {
  const response = await fetch(`${API_URL}/${id}`);
  const entry = await response.json();

  entryId.value = entry._id;
  title.value = entry.title;
  year.value = entry.year;
  director.value = entry.director;
  rating.value = entry.rating;
  description.value = entry.description;

  formTitle.textContent = 'Editar registro';
  cancelEdit.classList.remove('hidden');
  showMessage('Editando registro.');
};

window.deleteEntry = async function (id) {
  if (!confirm('Deseja excluir este registro?')) return;

  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  showMessage('Registro excluído.');
  loadEntries();
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    title: title.value,
    year: Number(year.value),
    director: director.value,
    rating: Number(rating.value),
    description: description.value
  };

  await saveEntry(data);
  showMessage(entryId.value ? 'Registro atualizado.' : 'Registro criado.');
  clearForm();
  loadEntries();
});

cancelEdit.addEventListener('click', () => {
  clearForm();
  showMessage('Edição cancelada.');
});

reloadBtn.addEventListener('click', loadEntries);

clearForm();
loadEntries();