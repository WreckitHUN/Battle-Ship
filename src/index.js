import Player from "./components/player/player";

const gameController = (p1, p2) => {
    const Player1 = p1;
    const Player2 = p2;
    const rows = Player1.board.rows;
    const columns = Player1.board.columns;

    const placeShip = (player, length, coord, rotated) => { 
        if (length <= 0) return;
        const ship = player.placeShip(length, coord, rotated);
        if (!ship) console.log(`Cannot place ship on [${coord[0]}, ${coord[1]}]`);
        return ship;
    }

    const clearBoard = () => {
        player.clearBoard();
    }

    const attackPlayer = (player, [x, y]) => {
        const {hit, ship, message} = player.attack([x, y]);
        return {hit, ship, message};
    }

    function containsArray(haystack, needle) {
        return haystack.some(coord => coord.every((val, index) => val === needle[index]));
      }

    const getOccupiedCoordinates = (player) => {
        return ([...player.getOccupiedCoordinates().keys()]).map((element) => element.split(",").map(Number));
    }

    const getSuccessfulShots = (player) => {
        return player.getSuccessfulShots();
    }

    const getMissedShots = (player) => {
        return player.getMissedShots();
    }

    return {
        rows,
        columns,
        placeShip,
        clearBoard,
        attackPlayer,
        getOccupiedCoordinates,
        getSuccessfulShots,
        getMissedShots,
    }

}

const screenUpdater = () => {
    const Player1 = Player("Your");
    const Player2 = Player("AI");
    setPlaceState(Player1);
    setPlaceState(Player2);
    
    const game = gameController(Player1, Player2);
    const rows = game.rows;
    const columns = game.columns;
    let shipLength = 5; // Default length
    let isRotated = true; // Default rotation   
    
    let currentPlayer = Player1;
    let isPlacingShip = false;
    let isEnd = false;
    let isAgainstAI = true;

    // Create the two boards
    const container1 = document.querySelector(".container1");
    const container2 = document.querySelector(".container2");
    const player1Cells = createBoard(container1);
    const player2Cells = createBoard(container2);

    // Create UI elements
    const status = document.querySelector(".status");
    status.textContent = `${currentPlayer.name} turn to place ship`;
    const player1 = document.querySelector(".player1");
    const player2 = document.querySelector(".player2");
    // 1. Random ship placement button
    const randomButton1 = document.createElement("button");
    randomButton1.textContent = "Randomize";
    randomButton1.classList.add("btn");
    randomButton1.addEventListener("click", () => randomPlaceShip(Player1));
    player1.appendChild(randomButton1);

    const randomButton2 = document.createElement("button");
    randomButton2.textContent = "Randomize";
    randomButton2.classList.add("btn");
    randomButton2.addEventListener("click", () => randomPlaceShip(Player2));
    player2.appendChild(randomButton2);

    // 2. Play button to play against AI
    const playButton = document.querySelector(".play");
    playButton.addEventListener("click", playGameAI);

    // Add event listeners to the containers
    container1.addEventListener("click", containerEventHandler);
    container2.addEventListener("click", containerEventHandler);

    function containerEventHandler(event){
        // Return if GAME OVER 
        if (isEnd) return;
        // Return if not clicked on a cell
        const cell = event.target;
        if (!cell.dataset.row) return;
        // Get the clicked coordinates
        const row = (+cell.dataset.row);
        const column = (+cell.dataset.column);
        const coord = [row, column];
       
        if (currentPlayer.getPlaceState()){ // Ship placing state
            if (event.currentTarget === container1 && currentPlayer !== Player1) return;
            if (event.currentTarget === container2 && currentPlayer !== Player2) return;
            if (isPlacingShip) return;
            isPlacingShip = true;
            const availableShips = currentPlayer.getAvailableShips();
            if (availableShips <= 0) {
                status.textContent = "No more ship to place";
                return;
            };
            const ship = placeShip(currentPlayer, shipLength, coord, isRotated);
            isPlacingShip = false;
            if (!ship) {
                status.textContent = "Can't place ship there";
                return;
            }
            status.textContent = "Ship placed";
        } else

        if (currentPlayer.getAttackState()) { // Ship attacking state
            if (event.currentTarget === container1 && currentPlayer === Player1) return;
            if (event.currentTarget === container2 && currentPlayer === Player2) return;
            const attackedPlayer = currentPlayer === Player1 ? Player2 : Player1;
            const {hit, ship, message} = attackPlayer(attackedPlayer, coord);
            
            if (!hit && message === "Miss"){
                togglePlayer();
                if (isAgainstAI){
                    aiAttack(currentPlayer);
                    togglePlayer();
                }
           }
        }
    }

    function setShipLength(length) {
        shipLength = length;
    }
    
    function setShipRotation(rotation) {
        isRotated = rotation;
    }

    function setAttackState(player) {
        player.setAttackState(true);
        player.setPlaceState(false);
    }

    function setPlaceState(player) {
        player.setAttackState(false);
        player.setPlaceState(true);
    }

    function aiAttack(player){
        const attackedPlayer = player === Player1 ? Player2 : Player1;
        let _message = "Made";
        let _hit = true;
        while (_message === "Made" || _hit){
            const x = Math.floor(Math.random() * rows);
            const y = Math.floor(Math.random() * columns);
            const {hit, ship, message} = attackPlayer(attackedPlayer, [x, y]);
            _message = message;
            _hit = hit;
        }
    }


    function attackPlayer(player, [x, y]){
        const cells = player === Player1 ? player1Cells : player2Cells;
        const hitCell = cells.find((cell) => +cell.dataset.row === x && +cell.dataset.column === y);
        const {hit, ship, message} = game.attackPlayer(player, [x, y]);
        if (hit){
            // [x, y] is a successful hit
            hitCell.classList.add("hit");
            // Check if the ship is sunk
            if (ship.isSunk()) {
                console.log(`${player.name}'s ship been sunk`);
                // Also check if all the ships have been sunk GAME OVER
                if (player.hasLost()) {
                    isEnd = true;
                    console.log(`${player.name} lost the game`);
                }
            }
            console.log(message);
            return {hit, ship, message};
        } else if(message === "Miss") {
            // [x, y] is a miss
            hitCell.classList.add("miss");
            console.log(message);
            return {hit, ship, message};
        } else if (message === "Made"){
            // [x, y] is made earlier
            console.log(message);
            return {hit, ship, message};
        }
    }

    function playGameAI(){
        if (currentPlayer.getAvailableShips() !== 0) {
            status.textContent = `Place all your ship before playing`;
            return;
        };
        randomPlaceShip(currentPlayer === Player1 ? Player2 : Player1);
        setAttackState(Player1);
        setAttackState(Player2);
        status.textContent = `${currentPlayer.name} turn to attack`;
    }

    function playAgain(){
        clearBoard(Player1);
        clearBoard(Player2);
        isEnd = false;
    }

    function randomPlaceShip(player){
        clearBoard(player);
        placeShip(player, 2);
        placeShip(player, 3);
        placeShip(player, 3);
        placeShip(player, 4);
        placeShip(player, 5);
    }

    function placeShip(player, length, coord, rotated) {
        const ship = game.placeShip(player, length, coord, rotated);
        if (!ship) return;
        const shipCoordinates = ship.coordinates;
        const cells = player === Player1 ? player1Cells : player2Cells;
        
        const placedCells = shipCoordinates.map(([row, column]) => {
          return cells.find(cell => 
            +cell.dataset.row === row && +cell.dataset.column === column
          );
        });
      
        placedCells.forEach(element => {
          if (element) element.classList.add("ship");
        });
        return ship;
    }

    function clearBoard(player){
        player.clearBoard();
        isPlacingShip = false;
        const cells = player === Player1 ? player1Cells : player2Cells;
        cells.forEach((cell) => cell.classList.remove("ship", "hit", "miss"));
    }
      

    function togglePlayer(){
        currentPlayer = currentPlayer === Player1 ? Player2 : Player1;
    }
    
    function createBoard(container){
        const cells = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++){
                const cell = document.createElement("button");
                cell.classList.add("cell");
                cell.dataset.row = i;
                cell.dataset.column = j;
                container.appendChild(cell);
                cells.push(cell);
            }
            
        }
        return cells;
    }
    
}

screenUpdater();












