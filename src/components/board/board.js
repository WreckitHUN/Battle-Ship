import Ship from "../ship/ship";

function Board(){
  const rows = 10;
  const columns = 10;
  let missedShots = [];
  let successfulShots = [];
  let placedShips = [];
  // All coordinates of the ships
  let occupiedCoordinates = new Map();
  // Cannot place ships on these coordinates
  let forbiddenCoordinates = new Array();

  const canPlaceShip = ([x, y], length, rotated) => {
    for(let i = 0; i < length; i++){
      const coordX = rotated ? x + i : x;
      const coordY = rotated ? y : y + i;
      const coord = [coordX, coordY];
      // If any coordinate is forbidden, return without placing the ship
      if (containsArray(forbiddenCoordinates, coord) || coordX > rows - 1 || coordY > columns - 1) {
        return false;
      }
    }
    return true;
  }

  const placeShip = ([x, y], length, rotated = false) => {
      // Check if any part of the ship is in forbiddenCoordinates
      if (!canPlaceShip([x, y], length, rotated)) {return false};
      
      const ship = Ship(length);
      ship.coordinates = [];
      // if rotated === false then it is HORIZONTAL-- else VERTICAL|
      ship.rotated = rotated;
      placedShips.push(ship);

      // Create the coordinates of the ship
      for(let i = 0; i < ship.length; i++){
          const coordX = rotated ? x + i : x;
          const coordY = rotated ? y : y + i;
          const coord = [coordX, coordY];
          ship.coordinates.push(coord);
          occupiedCoordinates.set(`${coordX},${coordY}`, ship);
          // For each coordinates add the adjacent one to the forbiddenCoordinates
          for(let dx = -1; dx <= 1; dx++){
            for(let dy = -1; dy <= 1; dy++){
              let adjCoord = [coordX + dx, coordY + dy]
              // Check the bounds (OUT OF BOUNDS)
              if(adjCoord[0] < 0 || adjCoord[0] > rows - 1 || adjCoord[1] < 0 || adjCoord[1] > columns - 1)
                continue;
              // Check if it is already in the array
              if(containsArray(forbiddenCoordinates, adjCoord))
                continue;
              // Otherwise put it inside forbiddenCoordinates
              forbiddenCoordinates.push(adjCoord);
            }
          }
      }
      console.log(`Ship is placed from [${ship.coordinates[0][0]}, ${ship.coordinates[0][1]}] to [${ship.coordinates[length - 1][0]}, ${ship.coordinates[length - 1][1]}]`);
      return ship;
  }

  const receiveAttack = ([x, y]) => {
    // Attack has been made
    if (containsArray(successfulShots, [x, y])) {console.log("Attack has been made"); return false};
    const key = `${x},${y}`;
    // It is a successful hit
    if (occupiedCoordinates.has(key)){
      const ship = occupiedCoordinates.get(key);
      ship.hit();
      successfulShots.push([x, y]);
      // If the ship is sunk check if all the ships is sunk then return its value
      if (ship.isSunk()) {
        return allShipsSunk();
      };
    }else {
      missedShots.push([x, y]);
      return false;
    }
  }

  const allShipsSunk = () => {
      return placedShips.every(ship => ship.isSunk());
  }

  const getMissedShots = () => {return missedShots};
  const getOccupiedCoordinates = () => {return occupiedCoordinates};
  const getSuccessfulShots = () => {return successfulShots};


  function containsArray(haystack, needle) {
    return haystack.some(coord => coord.every((val, index) => val === needle[index]));
  }

  return {
    rows,
    columns,
    placeShip,
    receiveAttack,
    allShipsSunk,
    getMissedShots,
    getOccupiedCoordinates,
    getSuccessfulShots,
  }
}

export default Board;