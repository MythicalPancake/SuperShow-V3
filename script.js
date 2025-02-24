document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const navTabs = document.querySelectorAll(".nav-tab");
  const pages = document.querySelectorAll(".page");
  const scanCardButton = document.getElementById("scanCard");
  const manualInputButton = document.getElementById("manualInput");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const collectionGrid = document.getElementById("collectionGrid");
  const sortNumber = document.getElementById("sortNumber");
  const sortCompetitor = document.getElementById("sortCompetitor");
  const sortEntrance = document.getElementById("sortEntrance");
  const toggleRemoveButton = document.getElementById("toggleRemoveMode");
  const createDeckButton = document.getElementById("createDeck");
  const deckList = document.getElementById("deckList");

  // Data storage
  let collection = [];
  let decks = [];
  let removeMode = false;
  
  // Card database: each card object can be customized here.
  // You can specify if a card is sorted by number, competitor, or entrance by
  // assigning appropriate values to these fields.
  let cardDatabase = [
    // In this example, the card "Fire Dragon" is primarily associated with a number.
    { name: "Fire Dragon", number: 5, competitor: "", entrance: "", image: "fire_dragon.jpg" },
    // "Water Serpent" is associated with a competitor (e.g., a team name or sponsor).
    { name: "Water Serpent", number: null, competitor: "Alpha", entrance: "", image: "water_serpent.jpg" },
    // "Earth Golem" is associated with an entrance (perhaps indicating a special zone).
    { name: "Earth Golem", number: null, competitor: "", entrance: "Main", image: "earth_golem.jpg" }
  ];

  // Navigation: show one page at a time.
  function showPage(target) {
    pages.forEach(page => page.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  }
  navTabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const target = e.target.getAttribute("data-tab");
      showPage(target);
    });
  });

  // Home page functions
  scanCardButton.addEventListener("click", () => {
    alert("Scanning feature not implemented yet.");
  });
  manualInputButton.addEventListener("click", () => {
    const cardName = prompt("Enter card name:");
    const cardNumber = prompt("Enter card number (or leave blank if not applicable):");
    const cardCompetitor = prompt("Enter competitor (or leave blank if not applicable):") || "";
    const cardEntrance = prompt("Enter entrance (or leave blank if not applicable):") || "";
    const cardImage = prompt("Enter image URL (or leave blank for default):") || "placeholder.jpg";
    
    // You can decide what fields are required based on your data model.
    if (cardName && (cardNumber || cardCompetitor || cardEntrance)) {
      const card = {
        name: cardName,
        // Convert cardNumber to a number if provided; otherwise, keep it null.
        number: cardNumber ? parseInt(cardNumber) : null,
        competitor: cardCompetitor,
        entrance: cardEntrance,
        image: cardImage
      };
      collection.push(card);
      displayCollection();
    } else {
      alert("Invalid input. Please enter a valid card name and at least one category value.");
    }
  });

  // Toggle Remove Mode on Collection page
  toggleRemoveButton.addEventListener("click", () => {
    removeMode = !removeMode;
    toggleRemoveButton.textContent = removeMode ? "Disable Remove Mode" : "Enable Remove Mode";
    displayCollection();
  });

  // Search functionality
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    searchResults.innerHTML = "";
    const filteredCards = cardDatabase.filter(card =>
      card.name.toLowerCase().includes(query)
    );
    filteredCards.forEach(card => {
      const cardEl = createCardElement(card, "search");
      searchResults.appendChild(cardEl);
    });
  });

  // Display collection with sorting
  function displayCollection() {
    collectionGrid.innerHTML = "";
    let filtered = collection.slice();
    
    const selectedNumber = sortNumber.value;
    const competitorText = sortCompetitor.value.toLowerCase().trim();
    const entranceText = sortEntrance.value.toLowerCase().trim();
    
    if (selectedNumber !== "all") {
      filtered = filtered.filter(card => card.number == selectedNumber);
    }
    if (competitorText !== "") {
      filtered = filtered.filter(card =>
        card.competitor.toLowerCase().includes(competitorText)
      );
    }
    if (entranceText !== "") {
      filtered = filtered.filter(card =>
        card.entrance.toLowerCase().includes(entranceText)
      );
    }
    
    filtered.forEach(card => {
      const cardEl = createCardElement(card, "collection");
      collectionGrid.appendChild(cardEl);
    });
  }

  // Create card element for "search" and "collection" contexts.
  function createCardElement(card, context) {
    const el = document.createElement("div");
    el.classList.add("card");
    el.innerHTML = `
      <img src="${card.image}" alt="${card.name}" class="card-image">
      <strong>${card.name}</strong>
    `;
    if (context === "search") {
      const btn = document.createElement("button");
      btn.textContent = "Add to Collection";
      btn.addEventListener("click", () => {
        collection.push(card);
        displayCollection();
      });
      el.appendChild(btn);
    } else if (context === "collection") {
      if (removeMode) {
        const btn = document.createElement("button");
        btn.textContent = "Remove from Collection";
        btn.addEventListener("click", () => {
          const idx = collection.findIndex(c => c === card);
          if (idx > -1) {
            collection.splice(idx, 1);
            displayCollection();
          }
        });
        el.appendChild(btn);
      } else {
        const btn = document.createElement("button");
        btn.textContent = "Add to Deck";
        btn.addEventListener("click", () => {
          addToDeck(card);
        });
        el.appendChild(btn);
      }
    }
    return el;
  }

  // Function to add a card to a deck (from collection or search)
  function addToDeck(card) {
    if (decks.length === 0) {
      alert("No decks available. Create one first.");
      return;
    }
    const deckName = prompt("Enter the deck name to add this card:");
    if (!deckName) return;
    const deck = decks.find(d => d.name.toLowerCase() === deckName.toLowerCase());
    if (deck) {
      deck.cards.push(card);
      displayDecks();
    } else {
      alert("Deck not found.");
    }
  }

  // Function to remove a card from a deck
  function removeCardFromDeck(deck, cardIndex) {
    deck.cards.splice(cardIndex, 1);
    displayDecks();
  }

  // Function to add a card from the collection to a specific deck (from deck page)
  function addCardToDeck(deck) {
    const cardName = prompt("Enter the name of the card from your collection to add to this deck:");
    if (!cardName) return;
    const card = collection.find(c => c.name.toLowerCase() === cardName.toLowerCase());
    if (card) {
      deck.cards.push(card);
      displayDecks();
    } else {
      alert("Card not found in your collection.");
    }
  }

  // Deck functionality: Create a new deck.
  createDeckButton.addEventListener("click", () => {
    const deckName = prompt("Enter deck name:");
    if (deckName) {
      decks.push({ name: deckName, cards: [], loaded: false });
      displayDecks();
    }
  });

  // Display decks with Load/Hide toggle, Remove Deck, and card removal within deck.
  function displayDecks() {
    deckList.innerHTML = "";
    decks.forEach((deck, deckIndex) => {
      const deckEl = document.createElement("div");
      deckEl.classList.add("deck");
      
      // Deck header with deck name, toggle button, and remove deck button.
      const header = document.createElement("div");
      header.innerHTML = `<strong>${deck.name}</strong>`;
      
      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = deck.loaded ? "Hide Deck" : "Load Deck";
      toggleBtn.addEventListener("click", () => {
        deck.loaded = !deck.loaded;
        displayDecks();
      });
      header.appendChild(toggleBtn);
      
      const removeDeckBtn = document.createElement("button");
      removeDeckBtn.textContent = "Remove Deck";
      removeDeckBtn.addEventListener("click", () => {
        decks.splice(deckIndex, 1);
        displayDecks();
      });
      header.appendChild(removeDeckBtn);
      
      deckEl.appendChild(header);
      
      // If deck is loaded, show its cards and an "Add Card from Collection" button.
      if (deck.loaded) {
        const addCardBtn = document.createElement("button");
        addCardBtn.textContent = "Add Card from Collection";
        addCardBtn.addEventListener("click", () => addCardToDeck(deck));
        deckEl.appendChild(addCardBtn);
        
        const cardsContainer = document.createElement("div");
        cardsContainer.classList.add("deck-cards", "grid-container");
        
        deck.cards.forEach((card, cardIndex) => {
          const cardEl = document.createElement("div");
          cardEl.classList.add("card");
          cardEl.innerHTML = `
            <img src="${card.image}" alt="${card.name}" class="card-image">
            <strong>${card.name}</strong>
          `;
          const removeBtn = document.createElement("button");
          removeBtn.textContent = "Remove from Deck";
          removeBtn.addEventListener("click", () => {
            removeCardFromDeck(deck, cardIndex);
          });
          cardEl.appendChild(removeBtn);
          cardsContainer.appendChild(cardEl);
        });
        deckEl.appendChild(cardsContainer);
      }
      
      deckList.appendChild(deckEl);
    });
  }

  // Sorting event listeners for Collection page
  sortNumber.addEventListener("change", displayCollection);
  sortCompetitor.addEventListener("input", displayCollection);
  sortEntrance.addEventListener("input", displayCollection);
});
