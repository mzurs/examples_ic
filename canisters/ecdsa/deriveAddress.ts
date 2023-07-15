import { $update } from "azle";
import { Keccak } from "sha3";

function textEncoding(str: string) {
    if (typeof str !== "string") {
      throw new TypeError("passed argument must be of tye string");
    }
    var binstr = decodeURIComponent(encodeURIComponent(str)),
      arr = new Uint8Array(binstr.length);
    const split = binstr.split("");
    for (let i = 0; i < split.length; i++) {
      arr[i] = split[i].charCodeAt(0);
    }
    return arr;
  }
  $update;
  export function address(pK: string): string {
    const buf=new  Buffer(pK,'hex')
  
    // const publicKey = Buffer.from(pK,'hex')
    // console.log("publicKey",publicKey)
    // console.log("\n")
    
    // const pKConvert=publicKeyConvert(buf,true)
    // console.log("pKConvert",pKConvert)
    // console.log("\n")
    
    // const pKConvertBuffer=Buffer.from(pKConvert)
  //   const indexToRemove = 1;
  // const before = pKConvertBuffer.subarray(0, -64);
  // const after = pKConvertBuffer.subarray(indexToRemove + 1);
  // const newBuffer = Buffer.concat([before, after]);
    
    // console.log("pKConvertBuffer",pKConvertBuffer)
    // console.log("\n")
    
    // const hash1 = createKeccakHash('keccak256').update(pKConvertBuffer).digest()
    // console.log("hash1",hash1)
    // console.log("\n")
    
    // const hash2=new Keccak(256)
    // hash2.update(pKConvertBuffer)
    // console.log(hash2)
  
  // const digest=(hash2.digest()).toString('hex')
    // const address1=digest.slice(-40)
    // console.log("address1",address1)
    // console.log("\n")
    return "address1"
    }
  


    function calcCheckSum(
        checkSumHashReference: string,
        nonCheckSumAddress: string
      ): string {
        let result = "";
      
        for (let i = 0; i < 40; i++) {
          const inputDigit = checkSumHashReference[i];
          const referenceDigit = nonCheckSumAddress[i];
      
          if (parseInt(inputDigit, 16) > 7) {
            result += referenceDigit.toUpperCase();
          } else {
            result += referenceDigit.toLowerCase();
          }
        }
        return "0x" + result;
      }
      
      $update;
      export function getETHAddress(pubKey: string): string {
        const hash = new Keccak(256);
        hash.update(pubKey);
        const hashOutput = hash.digest({ format: "hex" });
        hash.reset();
      
        return calcCheckSum(
          hash
            .update(hashOutput.slice(-40).toLowerCase(), "utf8")
            .digest({ format: "hex" }),
          hashOutput.slice(-40)
        );
      }