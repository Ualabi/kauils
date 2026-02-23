// Controls the size of the hash by the length of the password
export const simplehash = (password: string) => {
  let totalhash = (53*password.length)%95;
  for (const char of password) {
    totalhash = (totalhash << 5) - totalhash + char.charCodeAt(0);
    totalhash |= 0; // Convert to 32bit integer
  }
  let currhash = totalhash;
  let hashedString = '';
  for (const char of password) {
    currhash = (currhash << 5) - currhash + char.charCodeAt(0);
    currhash |= 0; // Convert to 32bit integer
    hashedString += String.fromCharCode(Math.abs(currhash) % 95 + 32); // Printable ASCII range
  }
  console.log(hashedString);
  return hashedString;
};

// console.log(' '===String.fromCharCode(32))
// console.log('~'===String.fromCharCode(126))

// console.log(simplehash("0"));
// console.log(simplehash("1"));
// console.log(simplehash("12"));
// console.log(simplehash("asd"));
// console.log(simplehash("a123"));
// console.log(simplehash("example"));
// console.log(simplehash("examplx"));
// console.log(simplehash("examplepassword"));