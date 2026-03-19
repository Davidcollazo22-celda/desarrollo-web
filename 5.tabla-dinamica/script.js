// Datos iniciales 
let items = [
    { id: 1, name: 'iPhone 13', category: 'Electrónica', year: 2021 },
    { id: 2, name: 'El Quijote', category: 'Libro', year: 1605 },
    { id: 3, name: 'Camiseta algodón', category: 'Ropa', year: 2023 },
    { id: 4, name: 'Sartén antiadherente', category: 'Hogar', year: 2022 },
    { id: 5, name: 'LEGO Star Wars', category: 'Juguete', year: 2020 }
];


let sortColumn = 'name';
let sortDirection = 'asc'; 

// Variable para controlar edición
let editingId = null;

const tableBody = document.getElementById('tableBody');
const filterInput = document.getElementById('filterInput');
const itemForm = document.getElementById('itemForm');
const itemId = document.getElementById('itemId');
const nameInput = document.getElementById('name');
const categorySelect = document.getElementById('category');
const yearInput = document.getElementById('year');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formTitle = document.getElementById('formTitle');
const headers = document.querySelectorAll('th[data-sort]');

// Funciones de renderizado 
function renderTable() {
    // Obtener filtro
    const filterText = filterInput.value.toLowerCase();
    
    // Filtrar items
    let filteredItems = items.filter(item => {
        return item.name.toLowerCase().includes(filterText) ||
               item.category.toLowerCase().includes(filterText) ||
               item.year.toString().includes(filterText);
    });
    
    // Ordenar
    filteredItems.sort((a, b) => {
        let valA = a[sortColumn];
        let valB = b[sortColumn];
        
        // Si es año, comparar numéricamente
        if (sortColumn === 'year') {
            valA = Number(valA);
            valB = Number(valB);
        } else {
            valA = valA.toLowerCase();
            valB = valB.toLowerCase();
        }
        
        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });
    
    // HTML
    let html = '';
    filteredItems.forEach(item => {
        html += `
            <tr>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.year}</td>
                <td>
                    <button class="edit-btn" onclick="editItem(${item.id})">Editar</button>
                    <button class="delete-btn" onclick="deleteItem(${item.id})">Eliminar</button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
    
    // Actualizar 
    updateSortIndicators();
}

function updateSortIndicators() {
    headers.forEach(header => {
        header.classList.remove('asc', 'desc');
        if (header.dataset.sort === sortColumn) {
            header.classList.add(sortDirection);
        }
    });
}

//  Funciones CRUD 
function addItem(name, category, year) {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    items.push({ id: newId, name, category, year: Number(year) });
    renderTable();
    resetForm();
}

function updateItem(id, name, category, year) {
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
        items[index] = { ...items[index], name, category, year: Number(year) };
    }
    renderTable();
    resetForm();
}

function deleteItem(id) {
    if (confirm('¿Estás seguro de eliminar este elemento?')) {
        items = items.filter(item => item.id !== id);
        renderTable();
        if (editingId === id) resetForm(); // Si estábamos editando ese, cancelar
    }
}

// Función para editar 
window.editItem = function(id) {
    const item = items.find(i => i.id === id);
    if (item) {
        editingId = id;
        itemId.value = id;
        nameInput.value = item.name;
        categorySelect.value = item.category;
        yearInput.value = item.year;
        submitBtn.textContent = 'Actualizar';
        formTitle.textContent = 'Editar elemento';
        cancelBtn.style.display = 'inline-block';
    }
};

// Resetear formulario
function resetForm() {
    editingId = null;
    itemId.value = '';
    nameInput.value = '';
    categorySelect.value = '';
    yearInput.value = '';
    submitBtn.textContent = 'Agregar';
    formTitle.textContent = 'Agregar nuevo elemento';
    cancelBtn.style.display = 'none';
}

//  Eventos 
// Formulario submit
itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = nameInput.value.trim();
    const category = categorySelect.value;
    const year = yearInput.value.trim();
    
    if (!name || !category || !year) {
        alert('Todos los campos son obligatorios');
        return;
    }
    
    if (editingId) {
        updateItem(editingId, name, category, year);
    } else {
        addItem(name, category, year);
    }
});

// Botón cancelar
cancelBtn.addEventListener('click', resetForm);

// Filtro en tiempo real
filterInput.addEventListener('input', renderTable);

// Ordenamiento al hacer clic en encabezados
headers.forEach(header => {
    header.addEventListener('click', () => {
        const column = header.dataset.sort;
        if (column === sortColumn) {
            
            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            sortColumn = column;
            sortDirection = 'asc';
        }
        renderTable();
    });
});

// Inicializar
renderTable();
resetForm(); // Asegurar que el botón cancelar esté oculto inicialmente