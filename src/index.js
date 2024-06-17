import Player from "./components/player/player";

const gameController = (p1, p2) => {
    const Player1 = p1;
    const Player2 = p2;
    const rows = Player1.board.rows;
    const columns = Player1.board.columns;

    const placeShip = (player, length, coord, rotated) => { 
        if (length <= 0) return;
        const ship = player.placeShip(length, coord, rotated);
        if (!ship) console.log("Cannot place ship");
        return ship;
    }

    const attackPlayer = (player, [x, y]) => {
        // Return if the attack has already been made
        const attackedPlayer = player;
        const hit = attackedPlayer.attack([x, y]);
        // if it is not a hit return
        if (!hit) return;

        if (hit) { // hit is the hit ship
            console.log(`${player.name} hit a ship`);
            // Check if the ship is sunk
            if (hit.isSunk()) console.log("ship is sunk");
            return hit
        };

        return false;
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
        attackPlayer,
        getOccupiedCoordinates,
        getSuccessfulShots,
        getMissedShots,
    }

}

const screenUpdater = () => {
    
    const Player1 = Player("Szabi");
    const Player2 = Player("Magdi");
    const game = gameController(Player1, Player2);
    const rows = game.rows;
    const columns = game.columns;
    let shipLength = 2; // Default length
    let isRotated = true; // Default rotation   

    // Test attacking
    setTimeout(() => game.attackPlayer(Player1, [0, 0]), 5000);
    setTimeout(() => game.attackPlayer(Player1, [1, 0]), 8000);
    
    let currentPlayer = Player1;
    let isPlacingShip = false;

    // Create the two boards
    const container1 = document.querySelector(".container1");
    const container2 = document.querySelector(".container2");
    const player1Cells = createBoard(container1);
    const player2Cells = createBoard(container2);
    
    // Add event listeners to the containers
    container1.addEventListener("click", containerEventHandler);
    container2.addEventListener("click", containerEventHandler);

    function containerEventHandler(event){
        if (event.currentTarget === container1 && currentPlayer !== Player1) return;
        if (event.currentTarget === container2 && currentPlayer !== Player2) return;
        if (isPlacingShip) return;
        const cell = event.target;
        if (!cell.dataset.row) return;

        isPlacingShip = true;
        const row = (+cell.dataset.row);
        const column = (+cell.dataset.column);
        const ship = placeShip(currentPlayer, shipLength, [row, column], isRotated);
        
        isPlacingShip = false;
        
    }

    function setShipLength(length) {
        shipLength = length;
    }
    
    function setShipRotation(rotation) {
        isRotated = rotation;
    }

    function placeShip(player, length, coord, rotated) {
        const ship = game.placeShip(player, length, coord, rotated);
        if (!ship) return;
      
        const shipCoordinates = ship.coordinates;
        const cells = player === Player1 ? player1Cells : player2Cells;
        
        const placedCells = shipCoordinates.map(([row, column]) => {
          return cells.find(cell => 
            cell.dataset.row == row && cell.dataset.column == column
          );
        });
      
        placedCells.forEach(element => {
          if (element) element.classList.add("ship");
        });
        return ship;
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












