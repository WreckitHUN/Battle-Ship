import Board from "../board/board";

const Player = (name) => {
    const board = Board();

    const attack = ([x, y]) => { // Returns false (not yet lost), true (lost the game)
       return board.receiveAttack([x, y]);
    }

    const placeShip = (length, coord, rotated) => {
        let placed = false;
        if (coord){
            let x = coord[0];
            let y = coord[1];
            placed = board.placeShip([x, y], length, rotated);
            if (!placed) console.log("Cannot place ship");
            return placed;
        }
        while (!placed) {
            const x = Math.floor(Math.random() * board.rows);
            const y = Math.floor(Math.random() * board.columns);
            rotated = Math.random() >= 0.5;
            placed = board.placeShip([x, y], length, rotated);
        }
        return placed;
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
        hasLost,
        getMissedShots,
        getSuccessfulShots,
        getOccupiedCoordinates,
        board,
    }
}

export default Player;
