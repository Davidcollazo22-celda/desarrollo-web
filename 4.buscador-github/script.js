// Elementos del DOM
const usernameInput = document.getElementById('usernameInput');
const searchBtn = document.getElementById('searchBtn');
const loadingDiv = document.getElementById('loading');
const profileDiv = document.getElementById('profile');
const errorDiv = document.getElementById('error');
const avatar = document.getElementById('avatar');
const nameEl = document.getElementById('name');
const bioEl = document.getElementById('bio');
const statsEl = document.getElementById('stats');
const profileLink = document.getElementById('profileLink');
const reposDiv = document.getElementById('repos');

// Función para mostrar/ocultar elementos
function showLoading() {
    loadingDiv.classList.remove('hidden');
    profileDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
}

function hideLoading() {
    loadingDiv.classList.add('hidden');
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    profileDiv.classList.add('hidden');
}

function showProfile(userData, reposData) {
    profileDiv.classList.remove('hidden');
    errorDiv.classList.add('hidden');
    
    // Datos del perfil
    avatar.src = userData.avatar_url;
    nameEl.textContent = userData.name || userData.login;
    bioEl.textContent = userData.bio || 'Sin biografía';
    statsEl.textContent = `📦 Repositorios: ${userData.public_repos} | 👥 Seguidores: ${userData.followers} | 👤 Siguiendo: ${userData.following}`;
    profileLink.href = userData.html_url;
    
    // Repositorios
    reposDiv.innerHTML = '';
    if (reposData.length === 0) {
        reposDiv.innerHTML = '<p>No hay repositorios públicos.</p>';
    } else {
        reposData.slice(0, 10).forEach(repo => { // Mostrar solo los 10 primeros
            const repoCard = document.createElement('div');
            repoCard.className = 'repo-card';
            repoCard.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || 'Sin descripción'}</p>
                <div class="repo-stats">
                    <span>⭐ ${repo.stargazers_count}</span>
                    <span>🍴 ${repo.forks_count}</span>
                    <span>📅 ${new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
            `;
            reposDiv.appendChild(repoCard);
        });
    }
}


async function searchUser() {
    const username = usernameInput.value.trim();
    
    if (username === '') {
        showError('Por favor, ingresa un nombre de usuario.');
        return;
    }
    
    showLoading();
    
    try {
        // Petición a la API de usuario
        const userResponse = await fetch(`https://api.github.com/users/${username}`);
        
        if (!userResponse.ok) {
            if (userResponse.status === 404) {
                throw new Error('Usuario no encontrado.');
            } else {
                throw new Error('Error en la petición. Inténtalo de nuevo.');
            }
        }
        
        const userData = await userResponse.json();
        
        // Petición a la API de repositorios
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
        const reposData = await reposResponse.json();
        
        hideLoading();
        showProfile(userData, reposData);
        
    } catch (error) {
        hideLoading();
        showError(error.message);
    }
}

// Eventos
searchBtn.addEventListener('click', searchUser);
usernameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchUser();
    }
});