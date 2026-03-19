
const textInput = document.getElementById('textInput');
const checkBtn = document.getElementById('checkBtn');
const resultDiv = document.getElementById('result');

// Función para limpiar el texto 
function cleanText(str) {
    // Convertir a minúsculas
    let cleaned = str.toLowerCase();
    
    // Eliminar acentos 
    cleaned = cleaned.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Eliminar caracteres no alfanuméricos 
    cleaned = cleaned.replace(/[^a-z0-9]/g, '');
    
    return cleaned;
}

// Función que verifica si una cadena es palíndromo
function isPalindrome(str) {
    const cleaned = cleanText(str);
    if (cleaned.length === 0) return false;
    
    // Comparar con su reverso
    const reversed = cleaned.split('').reverse().join('');
    return cleaned === reversed;
}

// Función para mostrar el resultado en el DOM
function showResult() {
    const text = textInput.value;
    
    if (text.trim() === '') {
        resultDiv.textContent = 'Por favor, ingresa una palabra o frase.';
        resultDiv.classList.remove('palindrome', 'not-palindrome');
        return;
    }
    
    const palindrome = isPalindrome(text);
    
    if (palindrome) {
        resultDiv.textContent = `"${text}" ¡SÍ es un palíndromo!`;
        resultDiv.classList.add('palindrome');
        resultDiv.classList.remove('not-palindrome');
    } else {
        resultDiv.textContent = `"${text}" NO es un palíndromo.`;
        resultDiv.classList.add('not-palindrome');
        resultDiv.classList.remove('palindrome');
    }
}

// Evento al hacer clic en el botón
checkBtn.addEventListener('click', showResult);

// Opcional: permitir presionar Enter en el input para comprobar
textInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        showResult();
    }
});

// Inicializar el resultado 
resultDiv.textContent = 'Esperando entrada...';