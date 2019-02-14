/* eslint-disable no-param-reassign,no-plusplus,no-undef,vars-on-top,no-var,block-scoped-var,one-var */
// exports.additive = function (key, prime) {
//   // key = key instanceof ArrayBuffer ? key : ArrayBuffer.from(key);
//   prime = prime === undefined ? 0xffffffff : prime;
//   for (var hash = key.length, i = 0; i < key.length; i++) {
//     hash += key.charCodeAt(i);
//   }
//   return (hash % prime);
// };
/* eslint-disable */
export function getStringHash(val) {
  // key = key instanceof Buffer ? key : new Buffer(key);
  var hash = 0;
  var len = val.length;
  for (var i = 0; i < len; i++) {
    hash <<= 1;
    if (hash < 0) {
      hash |= 1;
    }
    hash ^= val.charCodeAt(i);
  }
  var v = Math.abs(hash).toString();
  const diff = 10 - v.length;
  return (hash > 0 ? '0'.repeat(diff) : '1'.repeat(diff)) + v;
  // return hash;
}
