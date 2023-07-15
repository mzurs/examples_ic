const secp256k1=require('secp256k1');
const createKeccakHash = require('keccak')
const { toChecksumAddress } = require('ethereum-checksum-address')
const pK='0376698beebe8ee5c74d8cc50ab84ac301ee8f10af6f28d0ffd6adf4d6d3b9b762'

const publicKey = Buffer.from(pK,'hex')
console.log("publicKey",publicKey)
console.log("\n")

const arr=['03','76','69','8b','ee','be','8e','e5','c7','4d','8c','c5','0a','b8','4a','c3','01','ee','8f','10','af','6f','28','d0','ff','d6','ad','f4','d6','d3','b9','b7','62']
const typedArray=new Uint8Array(arr);
const publicKey1=new Buffer(typedArray)
console.log(publicKey1)

const pKConvert=secp256k1.publicKeyConvert(publicKey,false)
console.log("pKConvert",pKConvert)
console.log("\n")



const pKConvertBuffer=Buffer.from(pKConvert).subarray(1)
console.log("pKConvertBuffer",pKConvertBuffer)
console.log("\n")

const hash1 = createKeccakHash('keccak256').update(pKConvertBuffer).digest()
console.log("hash1",hash1)
console.log("\n")

const address1=toChecksumAddress(hash1.slice(-20).toString('hex'))
console.log("address1",address1)
console.log("\n")


// const pK = '0376698beebe8ee5c74d8cc50ab84ac301ee8f10af6f28d0ffd6adf4d6d3b9b762';

// // Convert hexadecimal string to Uint8Array
// const publicKeyBytes = new Uint8Array(pK.length / 2);
// for (let i = 0; i < pK.length; i += 2) {
//   publicKeyBytes[i / 2] = parseInt(pK.substr(i, 2), 16);
// }
// console.log("publicKey", publicKeyBytes);
// console.log("\n");

// // publicKeyConvert operation (assuming you have a custom implementation)
// const pKConvert = secp256k1.publicKeyConvert(publicKeyBytes, false);
// console.log("pKConvert", pKConvert);
// console.log("\n");

// // Convert pKConvert to Uint8Array and remove the first byte
// const pKConvertBuffer = pKConvert.subarray(1);
// console.log("pKConvertBuffer", pKConvertBuffer);
// console.log("\n");

// // Calculate the hash using a hashing algorithm (e.g., Keccak256)
// const hash1 = createKeccakHash('keccak256').update(pKConvertBuffer).digest();
// console.log("hash1", hash1);
// console.log("\n");

// // Convert the last 20 bytes of the hash to a checksum address
// const address1 = toChecksumAddress(Array.from(hash1.slice(-20), byte => byte.toString(16).padStart(2, '0')).join(''));
// console.log("address1", address1);
// console.log("\n");
