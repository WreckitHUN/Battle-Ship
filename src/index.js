import Player from "./components/player/player";

const gameController = (p1, p2) => {
    const Player1 = p1;
    const Player2 = p2;
    const rows = Player1.board.rows;
    const columns = Player1.board.columns;

    const placeShip = (player, length, coord, rotated) => { 
        const ship = player.placeShip(length, coord, rotated);
        return ship;
    }

    const attackPlayer = (player, [x, y]) => {
        const attackedPlayer = player === Player1 ? Player2 : Player1;
        const isLost = attackedPlayer.attack([x, y]);

        if (isLost) {
            console.log(`${player.name} won the game`);
            return true
        };
    }

    const getOccupiedCoordinates = (player) => {
        return occupiedCoordinates1 = ([...player.getOccupiedCoordinates().keys()]).map((element) => element.split(",").map(Number));
    }

    const getSuccessfulShots = (player) => {
        return player.getSuccessfulShots;
    }

    const getMissedShots = (player) => {
        return player.getMissedShots;
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

    let currentPlayer = Player1;

    // Create the two boards
    const container1 = document.querySelector(".container1");
    const container2 = document.querySelector(".container2");
    const player1Cells = createBoard(container1);
    const player2Cells = createBoard(container2);
    

    placeShip(currentPlayer, 2);
    placeShip(currentPlayer, 2);
    placeShip(currentPlayer, 2);
    placeShip(currentPlayer, 2);
    placeShip(currentPlayer, 4);
    placeShip(currentPlayer, 4);
    placeShip(currentPlayer, 3);
    placeShip(currentPlayer, 3);
    placeShip(currentPlayer, 5);
    placeShip(currentPlayer, 5);


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
      
        togglePlayer();

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












