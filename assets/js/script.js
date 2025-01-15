const charactersSection = document.getElementById('characters');
const planetsSection = document.getElementById('planets');
const filmsSection = document.getElementById('films');
const sections = [charactersSection, planetsSection, filmsSection];
const searchInput = document.getElementById('search');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const climateFilter = document.getElementById('climate-filter');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const crawlContent = document.getElementById('crawl-content');
const filmPrevButton = document.getElementById('film-prev');
const filmNextButton = document.getElementById('film-next');
let currentPage = 1;
let currentFilmPage = 1;
let currentSearchTerm = '';
let currentClimateFilter = '';
let allPlanets = [];
let filmNextUrl = null;
let filmPrevUrl = null;

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
        updatePaginationButtons(data, 'characters');
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

// Function to fetch all planets from SWAPI
const fetchAllPlanets = async (page = 1, planets = []) => {
    try {
        let url = `https://swapi.py4e.com/api/planets/?page=${page}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        planets = planets.concat(data.results);
        if (data.next) {
            return fetchAllPlanets(page + 1, planets);
        } else {
            return planets;
        }
    } catch (error) {
        console.error('Error fetching planets:', error);
        return planets;
    }
};

// Function to display planets
const displayPlanets = (planets) => {
    const planetList = document.getElementById('planet-list');
    planetList.innerHTML = '';
    planets.forEach(planet => {
        const planetDiv = document.createElement('div');
        planetDiv.classList.add('planet');
        planetDiv.innerHTML = `
            <h3>${planet.name}</h3>
            <p>Population: ${planet.population}</p>
            <p>Climate: ${planet.climate}</p>
            <p>Terrain: ${planet.terrain}</p>
        `;
        planetList.appendChild(planetDiv);
    });
    console.log('Displayed planets:', planets); // Debugging line
};

// Function to fetch films from SWAPI
const fetchFilms = async (url = 'https://swapi.py4e.com/api/films/') => {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched films:', data.results); // Debugging line
        filmNextUrl = data.next;
        filmPrevUrl = data.previous;
        displayFilms(data.results);
        updatePaginationButtons(data, 'films');
    } catch (error) {
        console.error('Error fetching films:', error);
    }
};

// Function to display films
const displayFilms = (films) => {
    const filmList = document.getElementById('film-list');
    filmList.innerHTML = '';
    films.forEach(film => {
        const filmDiv = document.createElement('div');
        filmDiv.classList.add('film');
        filmDiv.innerHTML = `
            <h3>${film.title}</h3>
            <p>Release Date: ${film.release_date}</p>
            <button class="view-crawl" data-crawl="${film.opening_crawl}">View Opening Crawl</button>
        `;
        filmList.appendChild(filmDiv);
    });

    // Add event listeners to view crawl buttons
    document.querySelectorAll('.view-crawl').forEach(button => {
        button.addEventListener('click', (e) => {
            const crawlText = e.target.getAttribute('data-crawl');
            crawlContent.textContent = crawlText;
            modal.style.display = 'block';
        });
    });

    console.log('Displayed films:', films); // Debugging line
};

// Function to update pagination buttons
const updatePaginationButtons = (data, type) => {
    if (type === 'characters') {
        prevButton.disabled = !data.previous;
        nextButton.disabled = !data.next;
    } else if (type === 'films') {
        filmPrevButton.disabled = !data.previous;
        filmNextButton.disabled = !data.next;
    }
};

// Function to show a section and hide others
const showSection = (section) => {
    sections.forEach(sec => sec.style.display = 'none');
    if (section) {
        section.style.display = 'block';
    }
};

// Function to update active navigation link
const updateActiveNavLink = (activeLink) => {
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
};

// Function to populate climate filter dropdown
const populateClimateFilter = (planets) => {
    const climates = new Set();
    planets.forEach(planet => {
        planet.climate.split(', ').forEach(climate => climates.add(climate));
    });
    climateFilter.innerHTML = '<option value="">All Climates</option>';
    climates.forEach(climate => {
        const option = document.createElement('option');
        option.value = climate;
        option.textContent = climate.charAt(0).toUpperCase() + climate.slice(1);
        climateFilter.appendChild(option);
    });
};

// Event listeners for navigation links
document.querySelector('a[href="#characters"]').addEventListener('click', (e) => {
    e.preventDefault();
    showSection(charactersSection);
    fetchCharacters(currentPage, currentSearchTerm);
    updateActiveNavLink(e.target);
});

document.querySelector('a[href="#planets"]').addEventListener('click', async (e) => {
    e.preventDefault();
    showSection(planetsSection);
    allPlanets = await fetchAllPlanets();
    displayPlanets(allPlanets);
    populateClimateFilter(allPlanets);
    updateActiveNavLink(e.target);
});

document.querySelector('a[href="#films"]').addEventListener('click', (e) => {
    e.preventDefault();
    showSection(filmsSection);
    fetchFilms();
    updateActiveNavLink(e.target);
});

// Event listener for search input
searchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value;
    fetchCharacters(1, currentSearchTerm);
});

// Event listener for climate filter
climateFilter.addEventListener('change', (e) => {
    currentClimateFilter = e.target.value;
    const filteredPlanets = allPlanets.filter(planet => 
        currentClimateFilter === '' || planet.climate.includes(currentClimateFilter)
    );
    displayPlanets(filteredPlanets);
});

// Event listeners for pagination buttons
const handlePagination = (type, direction) => {
    if (type === 'characters') {
        if (direction === 'prev' && currentPage > 1) {
            currentPage--;
            fetchCharacters(currentPage, currentSearchTerm);
        } else if (direction === 'next') {
            currentPage++;
            fetchCharacters(currentPage, currentSearchTerm);
        }
    } else if (type === 'films') {
        if (direction === 'prev' && filmPrevUrl) {
            fetchFilms(filmPrevUrl);
        } else if (direction === 'next' && filmNextUrl) {
            fetchFilms(filmNextUrl);
        }
    }
};

prevButton.addEventListener('click', () => handlePagination('characters', 'prev'));
nextButton.addEventListener('click', () => handlePagination('characters', 'next'));
filmPrevButton.addEventListener('click', () => handlePagination('films', 'prev'));
filmNextButton.addEventListener('click', () => handlePagination('films', 'next'));

// Event listener for closing modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Event listener for clicking outside the modal
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Initially show characters section and fetch characters
showSection(charactersSection);
fetchCharacters();
updateActiveNavLink(document.querySelector('a[href="#characters"]'));