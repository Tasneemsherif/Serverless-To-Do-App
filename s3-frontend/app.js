const API_BASE = 'https://cn7xqp5305.execute-api.us-east-1.amazonaws.com/prod';

const modal = document.getElementById('modal');
const backdrop = document.getElementById('modal-backdrop');
const openBtn = document.getElementById('open-modal');
const cancelBtn = document.getElementById('cancel-btn');
const form = document.getElementById('todo-form');
const todosList = document.getElementById('todos');

const loader = document.getElementById('loader');
const errorState = document.getElementById('error-state');
const retryBtn = document.getElementById('retry-btn');

const filterSelect = document.getElementById('filter-select');
const searchInput = document.getElementById('search-input');

const toastContainer = document.getElementById('toast-container');

let allTodos = []; // store fetched todos

// ----------------- Modal controls -----------------
openBtn.onclick = () => {
  modal.classList.remove('hidden');
  backdrop.classList.remove('hidden');
};
const closeModal = () => {
  form.reset();
  modal.classList.add('hidden');
  backdrop.classList.add('hidden');
};
cancelBtn.onclick = closeModal;
backdrop.onclick = closeModal;

// ----------------- Toast / Notification -----------------
function showToast(message, type = 'info', duration = 3000) {
  // type: 'info', 'success', 'error'
  const colors = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    error: 'bg-red-500'
  };
  const toast = document.createElement('div');
  toast.className = `text-white px-4 py-2 rounded shadow ${colors[type] || colors.info} opacity-0 transform translate-y-2 transition-all`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
  });

  // Remove after duration
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-2');
    toast.addEventListener('transitionend', () => {
      toast.remove();
    });
  }, duration);
}

// ----------------- Fetch & render -----------------
async function fetchTodos() {
  const url = `${API_BASE}/items`;
  console.log('🔄 fetchTodos -> GET', url);
  showLoader();
  hideError();
  try {
    const res = await fetch(url);
    console.log('← fetchTodos response status:', res.status, res.statusText);
    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.error(`❌ fetchTodos failed: HTTP ${res.status}`, errText);
      throw new Error(`Load error ${res.status}: ${errText || res.statusText}`);
    }
    const text = await res.text();
    console.log('fetchTodos response text:', text);
    let data;
    try {
      data = text ? JSON.parse(text) : [];
    } catch (e) {
      console.warn('Could not parse JSON, text was:', text);
      data = [];
    }
    // unwrap if needed:
    if (data.Items && Array.isArray(data.Items)) {
      data = data.Items;
    }
    if (!Array.isArray(data)) {
      console.warn('Unexpected data shape, expected array, got:', data);
      data = [];
    }
    console.log('Fetched tasks:', data);
    data.forEach(t => {
      console.log(`  Task id=${t.id}, title="${t.title}", status="${t.status}"`);
    });
    allTodos = data;
    renderFilteredTodos();
  } catch (e) {
    console.error('⚠️ fetchTodos exception:', e);
    showError();
    showToast(`Failed to load tasks: ${e.message}`, 'error', 5000);
  } finally {
    hideLoader();
  }
}

function showLoader() {
  loader.classList.remove('hidden');
  todosList.classList.add('hidden');
  errorState.classList.add('hidden');
}
function hideLoader() {
  loader.classList.add('hidden');
  todosList.classList.remove('hidden');
}
function showError() {
  errorState.classList.remove('hidden');
  todosList.classList.add('hidden');
}
function hideError() {
  errorState.classList.add('hidden');
  todosList.classList.remove('hidden');
}

function renderFilteredTodos() {
  const filter = filterSelect.value; // 'all', 'pending', 'done'
  const searchTerm = searchInput.value.trim().toLowerCase();
  let filtered = allTodos.filter(t => {
    // Normalize status for filtering:
    const statusRaw = t.status;
    let statusNorm = '';
    if (typeof statusRaw === 'string') {
      statusNorm = statusRaw.trim().toLowerCase();
    } else if (typeof statusRaw === 'boolean') {
      statusNorm = statusRaw ? 'done' : 'pending';
    } else {
      statusNorm = ''; // treat unknown as pending
    }
    if (filter === 'pending' && statusNorm === 'pending') return false;
    if (filter === 'done' && statusNorm !== 'done') return false;
    return true;
  });
  if (searchTerm) {
    filtered = filtered.filter(t => (t.title || '').toLowerCase().includes(searchTerm));
  }
  render(filtered);
}

function render(todos) {
  todosList.innerHTML = '';
  if (!todos.length) {
    todosList.innerHTML = `
      <li class="col-span-full text-center text-gray-500">
        ${allTodos.length === 0 ? 'No tasks yet. Click “New Task” to get started!' : 'No matching tasks.'}
      </li>
    `;
    return;
  }

  todos.forEach(t => {
    // Normalize status for rendering:
    const statusRaw = t.status;
    let statusNorm = '';
    if (typeof statusRaw === 'string') {
      statusNorm = statusRaw.trim().toLowerCase();
    } else if (typeof statusRaw === 'boolean') {
      statusNorm = statusRaw ? 'done' : 'pending';
    } else {
      statusNorm = ''; // treat unknown as pending
    }
    const done = (statusNorm === 'done');
    console.log(`Rendering task id=${t.id}: raw status="${statusRaw}", normalized="${statusNorm}", done=${done}`);

    const card = document.createElement('li');
    card.className = `
      relative bg-white rounded-2xl shadow hover:shadow-lg transition p-6 flex flex-col
      ${done ? 'opacity-60 border border-green-400' : ''}
    `;

    // Format due date in local-friendly way
    let dueText = '—';
    if (t.dueDate) {
      try {
        const d = new Date(t.dueDate);
        if (!isNaN(d)) {
          dueText = d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        } else {
          dueText = t.dueDate;
        }
      } catch {
        dueText = t.dueDate;
      }
    }

    card.innerHTML = `
      <h3 class="text-lg font-bold ${done ? 'line-through text-gray-600' : 'text-gray-800'}">
        ${escapeHTML(t.title)}
      </h3>
      <p class="text-sm text-gray-500 mt-2">Due: ${escapeHTML(dueText)}</p>
      <div class="mt-auto flex justify-between items-center">
        <button class="flex items-center gap-1 text-sm px-3 py-1 rounded-full focus:outline-none
          ${done ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'}">
          <svg class="h-4 w-4"><use href="${done ? '#icon-undo' : '#icon-check-circle'}"/></svg>
          ${done ? 'Undo' : 'Done'}
        </button>
        <button class="text-red-500 hover:text-red-700 focus:outline-none">
          <svg class="h-5 w-5"><use href="#icon-trash"/></svg>
        </button>
      </div>
    `;

    // Actions
    const actionBtn = card.querySelector('button:nth-child(1)');
    actionBtn.onclick = async () => {
      actionBtn.disabled = true;
      // Determine new status: if currently done, undo to pending; otherwise mark done.
      const newStatus = done ? 'pending' : 'done';
      console.log(`Updating task id=${t.id} from status="${statusRaw}" to "${newStatus}"`);
      try {
        await updateTodo(t.id, { status: newStatus });
        showToast(done ? 'Task marked pending.' : 'Task completed!', 'success');
      } catch (e) {
        console.error('Update failed', e);
        showToast('Failed to update task.', 'error');
      } finally {
        actionBtn.disabled = false;
      }
    };

    const deleteBtn = card.querySelector('button:nth-child(2)');
    deleteBtn.onclick = () => {
      const ok = confirm('Are you sure you want to delete this task?');
      if (!ok) return;
      deleteBtn.disabled = true;
      deleteTodo(t.id)
        .then(() => {
          showToast('Task deleted.', 'success');
        })
        .catch(e => {
          console.error('Delete failed', e);
          showToast('Failed to delete task.', 'error');
        })
        .finally(() => {
          deleteBtn.disabled = false;
        });
    };

    todosList.append(card);
  });
}

// Escape helper
function escapeHTML(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

// ----------------- Form submit -----------------
form.onsubmit = async e => {
  e.preventDefault();
  const title = form.title.value.trim();
  const dueDate = form.dueDate.value;
  if (!title) return;

  const addBtn = document.getElementById('add-btn');
  addBtn.disabled = true;

  const url = `${API_BASE}/items`;
  console.log('➡️ Adding task. POST to', url, { title, dueDate });

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, dueDate })
    });
    console.log('⬅️ Add response status:', res.status, res.ok);

    let text = '';
    try {
      text = await res.text();
    } catch (e) {
      console.warn('Could not read response text:', e);
    }
    console.log('Add response text:', text);

    if (!res.ok) {
      console.error(`Add task failed: HTTP ${res.status}`, text);
      throw new Error(`Add error ${res.status}: ${text || res.statusText}`);
    }

    showToast('Task added!', 'success');
    closeModal();

    // Refresh list separately so GET errors don’t mask POST success
    fetchTodos().catch(err => {
      console.error('Error fetching todos after add:', err);
      showToast(`Task added but failed to refresh list: ${err.message}`, 'error', 5000);
    });
  } catch (e) {
    console.error('🔥 Add failed exception:', e);
    showToast(`Failed to add task: ${e.message}`, 'error', 5000);
  } finally {
    addBtn.disabled = false;
  }
};

// ----------------- Update -----------------
async function updateTodo(id, patch) {
  const url = `${API_BASE}/items/${id}`;
  console.log('➡️ updateTodo PUT to', url, patch);
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  console.log('⬅️ updateTodo response status:', res.status, res.ok);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error(`Update todo failed: HTTP ${res.status}`, text);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  // Refresh list
  await fetchTodos();
}

// ----------------- Delete -----------------
async function deleteTodo(id) {
  const url = `${API_BASE}/items/${id}`;
  console.log('➡️ deleteTodo DELETE to', url);
  const res = await fetch(url, { method: 'DELETE' });
  console.log('⬅️ deleteTodo response status:', res.status, res.ok);
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    console.error(`Delete todo failed: HTTP ${res.status}`, text);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  await fetchTodos();
}

// ----------------- Filters & Search events -----------------
filterSelect.onchange = () => renderFilteredTodos();
searchInput.oninput = () => {
  renderFilteredTodos();
};

// Retry button
retryBtn.onclick = fetchTodos;

// ----------------- Initial load -----------------
window.addEventListener('load', fetchTodos);
