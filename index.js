/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for(const game of games){
        // create a new div element, which will become the game card
        const theGameCard = document.createElement('div');
        // add the class game-card to the list
        theGameCard.classList.add('game-card');

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        theGameCard.innerHTML = `
        <img src=" ${game.img}" alt="${game.name}" width="100%" height="auto" />
        <h3>${game.name}</h3>
        <p>${game.description}</p>
        <p>Backers: ${game.backers}</p>
        `;
        // append the game to the games-container
        gamesContainer.appendChild(theGameCard);
    }
}
//<p>Pledged: $${game.pledged.toLocaleString()}</p>
// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON);

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById('num-contributions');
// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((total, game) => total + game.backers, 0);
// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `
<p>${totalContributions.toLocaleString()}</p>
`;
// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById('total-raised');
const totalRaised = GAMES_JSON.reduce((total, game) => total + game.pledged, 0);
// set inner HTML using template literal
raisedCard.innerHTML = `
<p>$${totalRaised.toLocaleString()}</p>
`;
// grab number of games card and set its inner HTML
const gamesCard = document.getElementById('num-games');
gamesCard.innerHTML = `
<p>${GAMES_JSON.length}</p>
`;
/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const notMetGoal = GAMES_JSON.filter(game => game.pledged < game.goal);

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(notMetGoal);
    console.log(notMetGoal);
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const metGoal = GAMES_JSON.filter(game => game.pledged >= game.goal);

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(metGoal);
    console.log(metGoal);
}
// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON);
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener("click", filterUnfundedOnly);
fundedBtn.addEventListener("click", filterFundedOnly);
allBtn.addEventListener("click", showAllGames);

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal).length;
// create a string that explains the number of unfunded games using the ternary operator
const displayStr = `A total of $${totalRaised.toLocaleString()} has been raised for ${GAMES_JSON.length}. Currently,  ${unfundedGames} game${unfundedGames === 1 ? "" : "s"} remain unfunded. We need your help to fund these amazing games!`;

// create a new DOM element containing the template string and append it to the description container
const element = document.createElement("p");
element.textContent = displayStr;
descriptionContainer.appendChild(element);
/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame] = sortedGames;
// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameElem = document.createElement("p");
firstGameElem.textContent = `${firstGame.name}`;
firstGameContainer.appendChild(firstGameElem);

// do the same for the runner up item
const secondGameElem = document.createElement("p");
secondGameElem.textContent = `${secondGame.name}`;
secondGameContainer.appendChild(secondGameElem);

/************************************************************************************
 * What if a user discovers the site and wants to search 
 * for a specific game they have heard of?
 * 
 * Search bar
 */

const theInput = document.getElementById("search");
const theSearch = document.getElementById("search-results");

theInput.addEventListener("input", () => {
    const searchedGame = theInput.value.toLowerCase();

    if(searchedGame === ""){
        theSearch.innerHTML = "";
        return;
    }

    const matchedSearch = GAMES_JSON.filter(game => {
        const notCaseSensitive = game.name.toLowerCase();
        return notCaseSensitive.includes(searchedGame) && notCaseSensitive.startsWith(searchedGame);
    });

    theSearch.innerHTML = "";

    matchedSearch.forEach(game => {
        const result = document.createElement("a");
        result.href = "#top-games";
        document.body.appendChild(result);
        result.textContent = game.name;
        theSearch.appendChild(result);
        result.classList.add("the-result");
    });
});

