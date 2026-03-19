//Clase Empleado 
class Empleado {
    constructor(id, firstName, lastName, email, phone, salary, birthdate, photo = '') {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.salary = salary;
        this.birthdate = birthdate;
        this.photo = photo || 'https://via.placeholder.com/300x200?text=Sin+foto';
    }
    
    // obtener nombre completo
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    
    //  formatear salario
    get formattedSalary() {
        return new Intl.NumberFormat('es-US', { style: 'currency', currency: 'USD' }).format(this.salary);
    }
    
    // formatear fecha de nacimiento
    get formattedBirthdate() {
        const date = new Date(this.birthdate);
        return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    }
}

//Gestor de Empleados 
class EmpleadosManager {
    constructor() {
        this.empleados = this.cargarDeLocalStorage();
    }
    
    // Generar nuevo ID
    generarId() {
        return this.empleados.length > 0 ? Math.max(...this.empleados.map(e => e.id)) + 1 : 1;
    }
    
    // Agregar empleado
    agregarEmpleado(empleado) {
        this.empleados.push(empleado);
        this.guardarEnLocalStorage();
    }
    
    // Eliminar empleado por ID
    eliminarEmpleado(id) {
        this.empleados = this.empleados.filter(e => e.id !== id);
        this.guardarEnLocalStorage();
    }
    
    // Obtener todos los empleados
    obtenerTodos() {
        return this.empleados;
    }
    
    // Guardar en localStorage
    guardarEnLocalStorage() {
        localStorage.setItem('empleados', JSON.stringify(this.empleados));
    }
    
    // Cargar desde localStorage
    cargarDeLocalStorage() {
        const datos = localStorage.getItem('empleados');
        if (datos) {
            const objetos = JSON.parse(datos);
            // Reconstruir como instancias de Empleado
            return objetos.map(e => new Empleado(
                e.id, e.firstName, e.lastName, e.email, e.phone, e.salary, e.birthdate, e.photo
            ));
        }
        // Datos de ejemplo si no hay nada
        return [
            new Empleado(1, 'Juan', 'Pérez', 'juan.perez@email.com', '555-1234', 35000, '1990-05-15', 'https://randomuser.me/api/portraits/men/1.jpg'),
            new Empleado(2, 'María', 'García', 'maria.garcia@email.com', '555-5678', 42000, '1985-10-20', 'https://randomuser.me/api/portraits/women/2.jpg'),
            new Empleado(3, 'Carlos', 'López', 'carlos.lopez@email.com', '555-9012', 28000, '1995-02-10', '')
        ];
    }
}

//Inicialización 
const manager = new EmpleadosManager();
const employeesListDiv = document.getElementById('employeesList');
const employeeForm = document.getElementById('employeeForm');

// Elementos del formulario
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const salaryInput = document.getElementById('salary');
const birthdateInput = document.getElementById('birthdate');
const photoInput = document.getElementById('photo');

// Funciones de renderizado
function renderEmpleados() {
    const empleados = manager.obtenerTodos();
    
    if (empleados.length === 0) {
        employeesListDiv.innerHTML = '<div class="no-employees">No hay empleados registrados. Agrega uno nuevo.</div>';
        return;
    }
    
    let html = '';
    empleados.forEach(emp => {
        html += `
            <div class="employee-card" data-id="${emp.id}">
                <img class="employee-photo" src="${emp.photo}" alt="Foto de ${emp.fullName}" onerror="this.src='https://via.placeholder.com/300x200?text=Error+foto'">
                <div class="employee-info">
                    <div class="employee-name">${emp.fullName}</div>
                    <div class="employee-detail">
                        <i>📧</i>
                        <span>${emp.email}</span>
                    </div>
                    <div class="employee-detail">
                        <i>📞</i>
                        <span>${emp.phone}</span>
                    </div>
                    <div class="employee-detail">
                        <i>💰</i>
                        <span>${emp.formattedSalary}</span>
                    </div>
                    <div class="employee-detail">
                        <i>🎂</i>
                        <span>${emp.formattedBirthdate}</span>
                    </div>
                </div>
                <div class="employee-actions">
                    <button class="delete-btn" onclick="eliminarEmpleado(${emp.id})">Eliminar</button>
                </div>
            </div>
        `;
    });
    
    employeesListDiv.innerHTML = html;
}

// Funciones CRUD 
function agregarEmpleado(event) {
    event.preventDefault();
    
    // Obtener valores
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const salary = parseFloat(salaryInput.value);
    const birthdate = birthdateInput.value;
    const photo = photoInput.value.trim();
    
    // Validaciones básicas
    if (!firstName || !lastName || !email || !phone || isNaN(salary) || !birthdate) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }
    
    // Validar email simple
    if (!email.includes('@') || !email.includes('.')) {
        alert('Ingresa un email válido.');
        return;
    }
    
    // Validar teléfono (solo números, guiones, espacios, etc. - aceptamos cualquier cosa por simplicidad)
    
    // Crear empleado
    const nuevoId = manager.generarId();
    const empleado = new Empleado(nuevoId, firstName, lastName, email, phone, salary, birthdate, photo);
    
    manager.agregarEmpleado(empleado);
    
    // Limpiar formulario
    employeeForm.reset();
    
    // Actualizar vista
    renderEmpleados();
}

function eliminarEmpleado(id) {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
        manager.eliminarEmpleado(id);
        renderEmpleados();
    }
}

// Hacer accesible la función eliminar desde el HTML (por el onclick)
window.eliminarEmpleado = eliminarEmpleado;

// Eventos
employeeForm.addEventListener('submit', agregarEmpleado);

// Inicializar vista 
renderEmpleados();