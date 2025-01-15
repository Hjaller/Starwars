const charactersSection = document.getElementById('characters');
const planetsSection = document.getElementById('planets');
const filmsSection = document.getElementById('films');
const sections = [charactersSection, planetsSection, filmsSection];
const searchInput = document.getElementById('search');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
let currentPage = 1;
let currentSearchTerm = '';

// Function to fetch characters from SWAPI
const fetchCharacters = async (page = 1, searchTerm = '') => {
    try {
        let url = `https://swapi.py4e.com/api/people/?page=${page}`;
        if (searchTerm) {
            url += `&search=${searchTerm}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched characters:', data.results); // Debugging line
        displayCharacters(data.results);
        updatePaginationButtons(data);
    } catch (error) {
        console.error('Error fetching characters:', error);
    }
};

// Function to display characters
const displayCharacters = (characters) => {
    const characterList = document.getElementById('character-list');
    characterList.innerHTML = '';
    characters.forEach(character => {
        const characterDiv = document.createElement('div');
        characterDiv.classList.add('character');
        characterDiv.innerHTML = `
            <h3>${character.name}</h3>
            <p>Height: ${character.height} cm</p>
            <p>Birth Year: ${character.birth_year}</p>
            <p>Gender: ${character.gender}</p>
        `;
        characterList.appendChild(characterDiv);
    });
    console.log('Displayed characters:', characters); // Debugging line
};

// Function to update pagination buttons
const updatePaginationButtons = (data) => {
    prevButton.disabled = !data.previous;
    nextButton.disabled = !data.next;
};

// Function to show a section and hide others
const showSection = (section) => {
    sections.forEach(sec => sec.style.display = 'none');
    if (section) {
        section.style.display = 'block';
    }
};

// Event listeners for navigation links
document.querySelector('a[href="#characters"]').addEventListener('click', (e) => {
    e.preventDefault();
    showSection(charactersSection);
    fetchCharacters(currentPage, currentSearchTerm);
});

document.querySelector('a[href="#planets"]').addEventListener('click', (e) => {
    e.preventDefault();
    showSection(planetsSection);
});

document.querySelector('a[href="#films"]').addEventListener('click', (e) => {
    e.preventDefault();
    showSection(filmsSection);
});

// Event listener for search input
searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value;
    fetchCharacters(1, currentSearchTerm);
});

// Event listeners for pagination buttons
prevButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchCharacters(currentPage, currentSearchTerm);
    }
});

nextButton.addEventListener('click', () => {
    currentPage++;
    fetchCharacters(currentPage, currentSearchTerm);
});

// Initially hide all sections
showSection(null);