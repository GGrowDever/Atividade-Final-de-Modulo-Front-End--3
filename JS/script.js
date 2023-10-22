const charactersList = document.getElementById('charactersContainer');
const searchByName = document.getElementById('searchByName');

const prevPage = document.getElementById('prevPage');
const nextPage = document.getElementById('nextPage');

let response;
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

		prevPage.disabled = true;
		nextPage.disabled = true;

		charactersList.innerHTML = '';

		response.data.results.forEach(async (character) => {
			const characterCard = document.createElement('div');
			characterCard.classList.add('card', 'mb-3', 'd-flex', 'flex-row-reverse');
			characterCard.style.width = '33rem';
			characterCard.style.height = '205px';

			const characterImage = document.createElement('img');
			characterImage.classList.add('card-img-left', 'img-fluid');
			characterImage.style.height = '200px';
			characterImage.style.objectFit = 'cover';
			characterImage.src = character.image;

			const cardBody = document.createElement('div');
			cardBody.classList.add('card-body', 'text-white');
			cardBody.style.backgroundColor = 'rgb(53 67 56)';

			const characterName = document.createElement('h4');
			characterName.classList.add('card-title');
			characterName.textContent = character.name;

			const characterStatus = document.createElement('span');
			characterStatus.classList.add('card-text');

			const statusDot = document.createElement('span');
			statusDot.classList.add('me-2', 'rounded-circle', 'd-inline-block');
			statusDot.style.width = '10px';
			statusDot.style.height = '10px';

			const characterSpecie = document.createElement('span');
			characterSpecie.classList.add('card-text');
			characterSpecie.textContent = character.species;

			const locationResponse = await api.get(character.location.url.replace('https://rickandmortyapi.com/api', ''));
			const locationName = locationResponse.data.name;

			const episodeUrl = character.episode[character.episode.length - 1];
			const episodeResponse = await api.get(episodeUrl.replace('https://rickandmortyapi.com/api', ''));
			const episodeName = episodeResponse.data.name;

			const characterLocation = document.createElement('p');
			characterLocation.classList.add('card-text', 'mt-2', 'text-white');
			characterLocation.innerHTML =
				'<span class="text-secondary"><strong>Última Localização Conhecida:</strong></span><br> <strong>' +
				locationName +
				'</strong>';

			const characterEpisode = document.createElement('p');
			characterEpisode.classList.add('card-text', 'text-white');
			characterEpisode.innerHTML =
				'<span class="text-secondary"><strong>Visto a última vez em:</strong></span><br> <strong>' +
				episodeName +
				'</strong>';

			if (character.status.toLowerCase() === 'alive') {
				statusDot.classList.add('bg-success');
			} else if (character.status.toLowerCase() === 'dead') {
				statusDot.classList.add('bg-danger');
			} else {
				statusDot.classList.add('bg-secondary');
			}

			characterStatus.appendChild(statusDot);

			const statusText = document.createTextNode(character.status + ' - ');

			charactersList.appendChild(characterCard);
			characterCard.appendChild(cardBody);
			characterCard.appendChild(characterImage);
			cardBody.appendChild(characterName);
			characterStatus.appendChild(statusText);
			cardBody.appendChild(characterStatus);
			cardBody.appendChild(characterSpecie);
			cardBody.appendChild(characterLocation);
			cardBody.appendChild(characterEpisode);

			characterCard.addEventListener('click', () => {
				document.getElementById('characterModalTitle').textContent = character.name;
				document.getElementById('characterModalBody').innerHTML = `
				<div style="display: flex;">
						<img src="${character.image}" alt="${character.name}" style="border-radius: 5px"><br>
						<div style="flex: 2; margin-left: 20px; display: flex; flex-direction: column; justify-content: center">
                              <p><strong>Status:</strong> ${character.status}</p>
                              <p><strong>Espécie:</strong> ${character.species}</p>
                              <p><strong>Gender:</strong> ${character.gender}</p>
                              <p><strong>Localização:</strong> ${locationName}</p>
                              <p><strong>Último episódio:</strong> ${episodeName}</p>
						</div>
						</div>
                              `;
				var myModal = new bootstrap.Modal(document.getElementById('characterModal'));
				myModal.show();
			});
		});
		prevPage.disabled = !response.data.info.prev;
		nextPage.disabled = !response.data.info.next;
	} catch (error) {
		console.log('Error loading characters', error);
	} finally {
		isLoading = false;
	}
}

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
const titleText = 'API do Rick and Morty';
const titleElement = document.getElementById('title');

for (let i = 0; i < titleText.length; i++) {
	const letter = document.createElement('span');
	letter.textContent = titleText[i];
	letter.className = 'letter';
	letter.style.animationDelay = `${i * 0.2}s`;
	titleElement.appendChild(letter);
}
axios
	.get('https://rickandmortyapi.com/api/character')
	.then(function (response) {
		const characters = response.data.info.count;

		document.querySelector('#characters').textContent = 'PERSONAGENS: ' + characters;
	})
	.catch(function (error) {
		console.log(error);
	});

axios
	.get('https://rickandmortyapi.com/api/location')
	.then(function (response) {
		const locations = response.data.info.count;
		document.querySelector('#locations').textContent = 'LOCALIZAÇÕES: ' + locations;
	})
	.catch(function (error) {
		console.log(error);
	});

axios
	.get('https://rickandmortyapi.com/api/episode')
	.then(function (response) {
		const episodes = response.data.info.count;
		document.querySelector('#episodes').textContent = 'EPISÓDIOS: ' + episodes;
	})
	.catch(function (error) {
		console.log(error);
	});
