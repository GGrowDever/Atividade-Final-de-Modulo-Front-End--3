const charactersList = document.getElementById('charactersContainer');
const searchByName = document.getElementById('searchByName');

const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');

let response;
let allPages = [];
let allCharacters = [];
const charactersPerPage = 6;
let currentPage = 1;
let isLoading = false;

async function loadCharacters(page = 1, name = '', species, gender, status) {
	try {
		isLoading = true;
		const params = {
			page,
			name,
			species,
			gender,
			status,
		};
		response = await api.get('/character', { params });
		allCharacters = allCharacters.concat(response.data.results);
		allPages = chunkArray(allCharacters, charactersPerPage);
		displayCharacters();
	} catch (error) {
		console.log('Error loading characters', error);
	} finally {
		isLoading = false;
	}
}

function chunkArray(array, size) {
	const chunked_arr = [];
	let index = 0;
	while (index < array.length) {
		chunked_arr.push(array.slice(index, size + index));
		index += size;
	}
	return chunked_arr;
}

function displayCharacters() {
	const charactersToDisplay = allPages[currentPage - 1];
	const start = (currentPage - 1) * charactersPerPage;
	const end = start + charactersPerPage;

	charactersList.innerHTML = '';

	charactersToDisplay.forEach((character) => {
		const characterCard = document.createElement('div');
		characterCard.classList.add('card', 'mb-3', 'd-flex', 'flex-row');
		characterCard.style.width = '28rem';
		const characterImage = document.createElement('img');
		characterImage.classList.add('card-img-left', 'img-fluid');
		characterImage.style.height = '200px'; // Define a altura da imagem
		characterImage.style.objectFit = 'cover';
		characterImage.src = character.image;
		const cardBody = document.createElement('div');
		cardBody.classList.add('card-body');
		const characterName = document.createElement('h5');
		characterName.classList.add('card-title');
		characterName.textContent = character.name;
		const characterSpecie = document.createElement('p');
		characterSpecie.classList.add('card-text');
		characterSpecie.textContent = character.species;
		const characterGender = document.createElement('p');
		characterGender.classList.add('card-text');
		characterGender.textContent = character.gender;
		const characterStatus = document.createElement('p');
		characterStatus.classList.add('card-text');
		characterStatus.textContent = character.status;

		cardBody.appendChild(characterName);
		cardBody.appendChild(characterSpecie);
		cardBody.appendChild(characterGender);
		cardBody.appendChild(characterStatus);

		characterCard.appendChild(characterImage);
		characterCard.appendChild(cardBody);

		charactersList.appendChild(characterCard);
	});
	prevPage.disabled = currentPage === 1;
	nextPage.disabled = end >= allCharacters.length;
}

prevPage.addEventListener('click', () => {
	if (currentPage > 1) {
		currentPage--;
		displayCharacters();
	}
});

nextPage.addEventListener('click', () => {
	if (currentPage * charactersPerPage < allCharacters.length) {
		currentPage++;
		displayCharacters();
	}
});

loadCharacters();
searchByName.addEventListener('input', () => {
	currentPage = 1;
	loadCharacters(currentPage, searchByName.value);
});

nextPage.addEventListener('click', () => {
	if (currentPage < response.data.info.pages && !isLoading) {
		currentPage++;
		loadCharacters(currentPage);
	}
});

prevPage.addEventListener('click', () => {
	if (currentPage > 1 && !isLoading) {
		currentPage--;
		loadCharacters(currentPage);
	}
});
