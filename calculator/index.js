const calculator = require("./calculator");

const args = process.argv.slice(2);

console.log(calculator.sum(args));
console.log(calculator.average(args));