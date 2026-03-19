// Obtener elementos del DOM
const emailInput = document.getElementById('emailInput');
const statusIcon = document.getElementById('statusIcon');
const messageDiv = document.getElementById('message');

// Expresión regular para validar email 
//permite: usuario@dominio.extension, con subdominios, extensiones de 2 a 6 letras
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,6}$/;

// Función de validación
function validateEmail(email) {
    return emailRegex.test(email);
}

// Función para actualizar la interfaz según la validación
function updateUI() {
    const email = emailInput.value;
    const isValid = validateEmail(email);
    
    // Limpiar clases previas
    emailInput.classList.remove('valid', 'invalid');
    messageDiv.classList.remove('valid', 'invalid');
    
    if (email === '') {
   
        statusIcon.textContent = '⏳';
        messageDiv.textContent = 'Esperando correo...';
        return;
    }
    
    if (isValid) {
        // Válido
        emailInput.classList.add('valid');
        messageDiv.classList.add('valid');
        statusIcon.textContent = '✅';
        messageDiv.textContent = '¡Correo electrónico válido!';
    } else {
        // Inválido
        emailInput.classList.add('invalid');
        messageDiv.classList.add('invalid');
        statusIcon.textContent = '❌';
        
        // Mensaje de error específico 
        if (email.includes('@')) {
            if (email.split('@').length > 2) {
                messageDiv.textContent = 'Error: No puede haber más de un @';
            } else if (!email.includes('.')) {
                messageDiv.textContent = 'Error: El dominio debe incluir un punto (.)';
            } else {
                messageDiv.textContent = 'Error: Formato de correo no válido';
            }
        } else {
            messageDiv.textContent = 'Error: Falta el símbolo @';
        }
    }
}

// Escuchar eventos en el input
emailInput.addEventListener('input', updateUI); // Mientras escribe
emailInput.addEventListener('blur', updateUI);  // Cuando pierde el foco

// Inicializar mensaje
messageDiv.textContent = 'Esperando correo...';