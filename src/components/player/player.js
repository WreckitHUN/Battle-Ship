import Board from "../board/board";

const Player = (name) => {
    const board = Board();

    let availableShips = 5;
    const getAvailableShips = () => availableShips;

    // State variables
    let placeState = true;
    let attackState = false;

    // Getter and Setter for placeState
    const getPlaceState = () => placeState;
    const setPlaceState = (newState) => {
        placeState = newState;
    };

    // Getter and Setter for attackState
    const getAttackState = () => attackState;
    const setAttackState = (newState) => {
        attackState = newState;
    };

    const attack = ([x, y]) => { // Returns false missed, returns ship hit
       const hit = board.receiveAttack([x, y]);
       console.log(hit);
       return hit;
    }

    const placeShip = (length, coord, rotated) => {
        let placedShip = false;
        if (coord){
            let x = coord[0];
            let y = coord[1];
            placedShip = board.placeShip([x, y], length, rotated);
            if (placedShip) availableShips--;
            return placedShip;
        }
        while (!placedShip) {
            const x = Math.floor(Math.random() * board.rows);
            const y = Math.floor(Math.random() * board.columns);
            rotated = Math.random() >= 0.5;
            placedShip = board.placeShip([x, y], length, rotated);
            if (placedShip) availableShips--;
        }
        return placedShip;
    }

    const clearBoard = () => {
        board.clearBoard();
        availableShips = 5;
    }

    const hasLost = () => {
        return board.allShipsSunk();
    }

    const getMissedShots = () => {
        return board.getMissedShots();
    }

    const getSuccessfulShots = () => {
        return board.getSuccessfulShots();
    }

    const getOccupiedCoordinates = () => {
        return board.getOccupiedCoordinates();
    }


    return {
        name,
        attack,
        placeShip,
        clearBoard,
        hasLost,
        getMissedShots,
        getSuccessfulShots,
        getOccupiedCoordinates,
        getPlaceState,
        setPlaceState,
        getAttackState,
        setAttackState,
        getAvailableShips,
        board,
    }
}

export default Player;
