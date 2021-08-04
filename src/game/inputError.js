class InputError extends Error {
    constructor(message) {
        super(message); // (1)
        this.name = "Invalid Input"; // (2)
    }
}

//const moveError = function(msg) { return new MoveError(msg)};
//let error = new MoveError("position is invalid");

module.exports = InputError;