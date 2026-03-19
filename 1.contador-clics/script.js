
const mainCounter = document.getElementById('mainCounter');
const incrementBtn = document.getElementById('incrementBtn');
const decrementBtn = document.getElementById('decrementBtn');
const incrementClicksSpan = document.getElementById('incrementClicks');
const decrementClicksSpan = document.getElementById('decrementClicks');

// Variables de estado
let count = 0;               
let incrementCount = 0;       
let decrementCount = 0;      

// Función para actualizar 
function updateUI() {
    mainCounter.textContent = count;
    incrementClicksSpan.textContent = incrementCount;
    decrementClicksSpan.textContent = decrementCount;
}

// Función para incrementar
function increment() {
    count++;                         
    incrementCount++;                
    
    if (incrementCount === 10) {     
        incrementCount = 0;
    }
    
    updateUI();                       
}

// Función para decrementar
function decrement() {
    count--;                           
    decrementCount++;                  
    
    if (decrementCount === 10) {       
        decrementCount = 0;
    }
    
    updateUI();                         
}

// Asignar eventos a los botones
incrementBtn.addEventListener('click', increment);
decrementBtn.addEventListener('click', decrement);

// Inicializar la interfaz
updateUI();