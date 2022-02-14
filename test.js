function longFunction() {
  let result = 0;
  let zeroes = 9;
  for (let i = 0; i < Math.pow(10, zeroes); i++) {
    result += i;
  }
  return result;
}

console.log(longFunction());
console.log('hey!');
