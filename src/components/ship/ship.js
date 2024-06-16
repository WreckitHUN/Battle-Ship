function Ship(length) {
const _length = length;
let _hits = 0;
const hit = () => {
    _hits++;
};
const isSunk = () => {
    return length <= _hits;
}
return {
    length: _length,
    hit,
    isSunk,
};
}
export default Ship;

