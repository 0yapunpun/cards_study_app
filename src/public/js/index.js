let currrentDeck = null;
let currentCard = null;
let currentCards = null;

const loadDecksList = async () => {
  try {
    const rawResponse = await fetch('/deck/get');
    const response = await rawResponse.json();

    if (response.success) {
      let el = '';

      for (let i = 0; i < response.data.length; i++) {
        if (!response.data[i].name) {
          continue;
        }
        el += `
          <li class=''>
            <a href="#" class="elementListMenu">
              <span class="menu-text listMenu" data-id="${response.data[i]._id}">${response.data[i].name}</span>
            </a>
          </li>
        `;
      }

      document.querySelector('#cDecksList').innerHTML = el;
    }
  } catch (error) {
    console.log(error);
  }
};

const getDeckInfo = async (id) => {
  try {
    const RawResponse = await fetch('/deck/getDeck', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id }),
    });
    const response = await RawResponse.json();

    if (response.success) {
      document.querySelector('#deckContainer').style.display = 'block';
      document.querySelector('#messageSelectDeck').style.display = 'none';

      document.querySelector('#selectedDeckName').innerHTML = response.data[0].name;
      document.querySelector('#amountCards').innerHTML = response.data[0].cards.length;

      currentCards = response.data[0].cards;
      printCardsList(currentCards);
    }
  } catch (error) {
    console.log(error);
  }
};

const createDeck = async () => {
  let credentials = {
    name: document.querySelector('#inputNewDeckName').value,
  };

  try {
    const rawResponse = await fetch('/deck/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const response = await rawResponse.json();

    $('#modalFormNewMazo').modal('hide');
    document.querySelector('#inputNewDeckName').value = '';
    loadDecksList();
  } catch (error) {
    console.log('Error idk');
  }
};

const deleteDeck = async () => {
  if (!confirm('¿Está seguro de eliminar este Mazo?')) return;

  try {
    const rawResponse = await fetch('/deck/delete/' + currrentDeck);
    const response = await rawResponse.json();

    document.querySelector('#deckContainer').style.display = 'none';
    document.querySelector('#messageSelectDeck').style.display = 'block';

    loadDecksList();
  } catch (error) {
    console.log('Error idk');
  }
};

const editDeck = async () => {
  let data = {
    id: currrentDeck,
    name: document.querySelector('#inputNewDeckName').value.trim(),
  };

  try {
    const rawResponse = await fetch('/deck/edit', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const response = await rawResponse.json();

    $('#modalFormNewMazo').modal('hide');
    loadDecksList();
    getDeckInfo(currrentDeck);
  } catch (error) {
    console.log('Error idk');
  }
};

const editDeckModal = async () => {
  document.querySelector('#btnDeckForm').click();
  document.querySelector('#inputNewDeckName').value =
    document.querySelector('#selectedDeckName').innerHTML;

  document.querySelector('#btnNewDeckName').style.display = 'none';
  document.querySelector('#btnEditDeckCall').style.display = 'block';
};

const createCard = async () => {
  let data = {
    idDeck: currrentDeck,
    question: document.querySelector('#inputNewCardQuestion').value.trim(),
    answer: document.querySelector('#inputNewCardAnswer').value.trim(),
  };

  try {
    const rawResponse = await fetch('/deck/card/create', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const response = await rawResponse.json();

    document.querySelector('#inputNewCardQuestion').value = '';
    document.querySelector('#inputNewCardAnswer').value = '';
    document.querySelector('#btnCloseNewCardModal').click();

    getDeckInfo(currrentDeck);
  } catch (error) {
    console.log('Error idk');
  }
};

const printCardsList = (data) => {
  let el = '';
  for (let i = 0; i < data.length; i++) {
    el += `
      <tr id='${data[i]._id}'>
        <td class="text-center">${data[i].question}</td>
        <td class="d-flex justify-content-center">
          <button class="btn btn-sm btn-primary btnSeeCard d-flex align-items-center" data-toggle="modal" data-target="#modalFormSeeCard">
            <span class="material-symbols-outlined" style="font-size: 13px"> delete </span>
            Ver
          </button>

          <button class="btn btn-sm btn-warning mx-2 btnEditCard d-flex align-items-center" data-toggle="modal" data-target="#modalFormEditCard">
            <span class="material-symbols-outlined" style="font-size: 13px"> edit </span>
            Editar
          </button>

          <button class="btn btn-sm btn-danger btnDeleteCard d-flex align-items-center">
            <span class="material-symbols-outlined" style="font-size: 13px"> delete </span>
            Eliminar
          </button>
        </td>
      </tr>
    `;
  }
  document.querySelector('#tBodyCardList').innerHTML = el;
};

const seeCard = (cardId) => {
  let card = currentCards.find((card) => card._id == cardId);

  if (card) {
    document.querySelector('#seeCardQuestion').value = card.question;
    document.querySelector('#seeCardAnswer').value = card.answer;

    document.querySelector('#btnCloseCardsListModal').click();
  }
};

const deleteCard = async (idDeck, idCard) => {
  if (!confirm('¿Está seguro de eliminar esta tarjeta?')) return;

  try {
    const rawResponse = await fetch(`/deck/card/delete/${idDeck}/${idCard}`);
    const response = await rawResponse.json();

    if (response.success) {
      getDeckInfo(currrentDeck);
    }
  } catch (error) {
    console.log('Error idk');
  }
};

const editCard = async () => {
  let data = {
    idDeck: currrentDeck,
    idCard: currentCard,
    question: document.querySelector('#inputEditCardQuestion').value.trim(),
    answer: document.querySelector('#inputEditCardAnswer').value.trim(),
  };

  try {
    const rawResponse = await fetch('/deck/card/edit', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const response = await rawResponse.json();

    document.querySelector('#btnCloseEditCardModal').click();
    document.querySelector('#btnOpenCardsLst').click();
    getDeckInfo(currrentDeck);
  } catch (error) {
    console.log('Error idk');
  }
};

const editCardModal = async (cardId) => {
  currentCard = cardId;
  let card = currentCards.find((card) => card._id == currentCard);

  if (card) {
    document.querySelector('#inputEditCardQuestion').value = card.question;
    document.querySelector('#inputEditCardAnswer').value = card.answer;

    document.querySelector('#btnCloseCardsListModal').click();
  }
};

// Events dinamic elements
document.addEventListener('click', async (e) => {
  try {
    // event select menu
    let btnMenu = document.querySelector('.listMenu');
    if (e.target.classList.contains('listMenu') || btnMenu.contains(e.target)) {
      let id = e.target.getAttribute('data-id');
      currrentDeck = id;
      getDeckInfo(id);
    }

    // event select see card
    let btnSeeCard = document.querySelector('.btnSeeCard');
    if (e.target.classList.contains('btnSeeCard') || btnSeeCard.contains(e.target)) {
      let cardId = e.target.closest('tr').id;
      seeCard(cardId);
    }

    // event edit edit card
    let btnEditCard = document.querySelector('.btnEditCard');
    if (e.target.classList.contains('btnEditCard') || btnEditCard.contains(e.target)) {
      let cardId = e.target.closest('tr').id;
      editCardModal(cardId);
    }

    // event edit delete card
    let btnDeleteCard = document.querySelector('.btnDeleteCard');
    if (e.target.classList.contains('btnDeleteCard') || btnDeleteCard.contains(e.target)) {
      let cardId = e.target.closest('tr').id;
      deleteCard(currrentDeck, cardId);
    }
  } catch (error) {
    // Events for elements that don't exist yet
  }
});

document.querySelector('#btnDeckForm').addEventListener('click', function () {
  document.querySelector('#btnNewDeckName').style.display = 'block';
  document.querySelector('#btnEditDeckCall').style.display = 'none';
});

document.querySelector('#btnEditDeck').addEventListener('click', function () {
  editDeckModal();
});

document.querySelector('#btnEditDeckCall').addEventListener('click', function () {
  editDeck();
});

document.querySelector('#btnDeleteDeck').addEventListener('click', function () {
  deleteDeck();
});

document.querySelector('#btnNewDeckName').addEventListener('click', function () {
  createDeck();
});

document.querySelector('#btnNewCard').addEventListener('click', function () {
  createCard();
});

document.querySelector('#btnEditCard').addEventListener('click', function () {
  editCard();
});

document.querySelector('#animationCard').addEventListener('click', function () {
  document.querySelector('#animationCard').classList.toggle('flipCard');
});

// it didn't want to use JQ :c
$('#modalFormSeeCard').on('hidden.bs.modal', function () {
  document.querySelector('#btnOpenCardsLst').click();
});

$('#modalFormEditCard').on('hidden.bs.modal', function () {
  document.querySelector('#btnOpenCardsLst').click();
});

window.onload = function () {
  loadDecksList();
};
