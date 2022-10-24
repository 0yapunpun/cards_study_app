let currrentDeck = null;
let currentCard = null;
let currentCards = null;
let currentCardsSorted = null;

const loadDecksList = async () => {
  try {
    const rawResponse = await fetch('/deck/get');
    const response = await rawResponse.json();

    if (response.success) {
      let el = '';

      for (let i = 0; i < response.data.length; i++) {
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
  }
};

const printCardsList = (data) => {
  let el = '';
  for (let i = 0; i < data.length; i++) {
    el += `
      <tr id='${data[i]._id}'>
        <td class="text-center">${data[i].question}</td>
        <td class="d-flex justify-content-center">
          <button class="btn btn-sm btn-primary mx-2 btnEditCard d-flex align-items-center" data-toggle="modal" data-target="#modalFormEditCard">
            <span class="material-symbols-outlined mx-1" style="font-size: 13px"> edit </span>
            Editar
          </button>
          <button class="btn btn-sm btn-danger btnDeleteCard d-flex align-items-center">
            <span class="material-symbols-outlined mx-1" style="font-size: 13px"> delete </span>
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
    console.log(error);
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
    console.log(error);
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

const startStudySession = async () => {
  if (currentCards.length == 0) {
    return alert('No hay tarjetas para estudiar');
  }

  currentCardsSorted = JSON.parse(JSON.stringify(currentCards));

  //Organizar lista, mostrar tarjetas con estado mas bajo primero. Mostrar tarjetas nuevas de ultimo
  currentCardsSorted.sort((a, b) => parseFloat(a.state) - parseFloat(b.state));

  currentCard = currentCardsSorted[0]._id;

  printInfoCard(currentCardsSorted[0]);

  document.querySelector('#totalCardCounter').innerHTML = currentCardsSorted.length;
  $('#modalStudySession').modal('show');
};

const setStateCard = async (stateCase) => {
  let valueState = 0;
  let currentCardSorted = currentCardsSorted.find((card) => card._id == currentCard);

  switch (stateCase) {
    case 'good':
      valueState = +1;
      currentCardSorted.isStated = 'good';
      break;
    case 'bad':
      valueState = -0.5;
      currentCardSorted.isStated = 'bad';
      break;
    case 'usual':
      valueState = +0.5;
      currentCardSorted.isStated = 'usual';
      break;
  }

  try {
    const rawResponse = await fetch('/deck/card/state', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idDeck: currrentDeck,
        idCard: currentCard,
        state: valueState,
      }),
    });
    const response = await rawResponse.json();
  } catch (error) {
    console.log(error);
  }
};

const printInfoCard = (card) => {
  document.querySelector('#studyCardFront').innerHTML = card.question;
  document.querySelector('#studyCardBack').innerHTML = card.answer;

  if (card.hasOwnProperty('isStated')) {
    switch (card.isStated) {
      case 'good':
        document.querySelector('#upThumbBtn').classList.add('upThumbBtnActive');
        break;
      case 'bad':
        document.querySelector('#downThumbBtn').classList.add('downThumbBtnActive');
        break;
      case 'usual':
        document.querySelector('#upHand').classList.add('upHandActive');
        break;
    }

    const buttons = document.querySelectorAll('.handBtn');
    buttons.forEach((e) => {
      e.classList.add('inactiveHandsButtons');
    });
  }
};

const passCard = async (state) => {
  let currentCardIndex = currentCardsSorted.map((object) => object._id).indexOf(currentCard);

  if (state == 'next') {
    currentCardIndex = currentCardIndex + 1;
  } else {
    currentCardIndex = currentCardIndex - 1;
  }

  if (currentCardIndex == 0) {
    document.querySelector('#iconLeftModal').style.display = 'none';
  } else {
    document.querySelector('#iconLeftModal').style.display = 'block';
  }

  if (currentCardIndex == currentCardsSorted.length - 1) {
    document.querySelector('#iconRightModal').style.display = 'none';
    document.querySelector('#btnEndSessionModal').style.display = 'block';
  } else {
    document.querySelector('#iconRightModal').style.display = 'block';
    document.querySelector('#btnEndSessionModal').style.display = 'none';
  }

  document.querySelector('#currentCardCounter').innerHTML = currentCardIndex + 1;

  currentCard = currentCardsSorted[currentCardIndex]._id;

  disableHandButtons(false);
  printInfoCard(currentCardsSorted[currentCardIndex]);
};

const disableHandButtons = (block) => {
  const buttons = document.querySelectorAll('.handBtn');

  if (block) {
    buttons.forEach((e) => {
      e.classList.add('inactiveHandsButtons');
    });
  } else {
    buttons.forEach((e) => {
      e.classList.remove('inactiveHandsButtons');
    });

    document.querySelector('#upThumbBtn').classList.remove('upThumbBtnActive');
    document.querySelector('#upHand').classList.remove('upHandActive');
    document.querySelector('#downThumbBtn').classList.remove('downThumbBtnActive');
  }
};

const endStudySession = () => {
  $('#modalStudySession').modal('hide');
  document.querySelector('#iconRightModal').style.display = 'block';
  document.querySelector('#btnEndSessionModal').style.display = 'none';
  document.querySelector('#currentCardCounter').innerHTML = 1;

  currentCardsSorted = [];
};

const hideIconsCard = (hide) => {
  let icons = document.querySelectorAll('.hideIcon');

  if (hide) {
    icons.forEach((e) => {
      e.style.display = 'none';
    });
  } else {
    icons.forEach((e) => {
      e.style.display = 'block';
    });
  }
};

const passAnimationCard = () => {
  document.querySelector('#animationCard').classList.add('animatedElement');
  document.querySelector('#animationCard').classList.add('slideAnimationcardRight');

  setTimeout(() => {
    document.querySelector('#animationCard').style.display = 'none';
    document.querySelector('#animationCard').classList.remove('animatedElement');
    document.querySelector('#animationCard').classList.remove('slideAnimationcardRight');
    document.querySelector('#animationCard').style.left = '0%';
    document.querySelector('#animationCard').style.display = 'block';
    // document.querySelector('#animationCard').classList.add('slideAnimationcardLeft');
  }, 500);
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

document.querySelector('#btnStudySession').addEventListener('click', function () {
  startStudySession();
});

// Control modal state
let returnCardState = true;
document.querySelector('#showResponseCard').addEventListener('click', function () {
  returnCardState = true;
  hideIconsCard(true);
  document.querySelector('#animationCard').classList.toggle('card_is-flipped');
  setTimeout(() => {
    if (!returnCardState) return;
    hideIconsCard(false);
    document.querySelector('#animationCard').classList.toggle('card_is-flipped');
  }, 3000);
});

document.querySelector('.card__face--back').addEventListener('click', function () {
  returnCardState = false;
  hideIconsCard(false);
  document.querySelector('#animationCard').classList.toggle('card_is-flipped');
});

document.querySelector('#iconLeftModal').addEventListener('click', function () {
  passCard('prev');
});

document.querySelector('#iconRightModal').addEventListener('click', function () {
  passCard('next');
});

document.querySelector('#iconCloseCardModal').addEventListener('click', function () {
  endStudySession();
});

document.querySelector('#btnEndSession').addEventListener('click', function () {
  endStudySession();
});

document.querySelector('#downThumbBtn').addEventListener('click', function () {
  setStateCard('bad');
  this.classList.add('downThumbBtn');
  disableHandButtons(true);
});

document.querySelector('#upHand').addEventListener('click', function () {
  setStateCard('usual');
  this.classList.add('upHandActive');
  disableHandButtons(true);
});

document.querySelector('#upThumbBtn').addEventListener('click', function () {
  setStateCard('good');
  this.classList.add('upThumbBtnActive');
  disableHandButtons(true);
});

// Tooltips
tippy('#downThumbBtn', {
  content: 'Mal',
});

tippy('#upHand', {
  content: 'Bien',
});

tippy('#upThumbBtn', {
  content: 'Perfecto',
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
  // $('#modalStudySession').modal('show');
};
