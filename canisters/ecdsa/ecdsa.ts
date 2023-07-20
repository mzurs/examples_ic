import { $update, Record, Result, Opt, match, ic, $query } from "azle";
import { managementCanister } from "azle/canisters/management";
import { toHexString } from "@dfinity/candid";
import { Keccak } from "sha3";
import RLP from "rlp";
import encodeUtf8 from "encode-utf8";

$update;
export async function publicKey(): Promise<
  Result<Record<{ publicKey: string }>, string>
> {
  const caller = ic.caller().toUint8Array();
  const canisterCaller = ic.id().toUint8Array();
  const publicKeyResult = await managementCanister
    .ecdsa_public_key({
      canister_id: Opt.Some(ic.id()),
      derivation_path: [canisterCaller,caller],
      key_id: { curve: { secp256k1: null }, name: "dfx_test_key" },
    })
    .call();

  return match(publicKeyResult, {
    Ok: (ecdsaPublicKeyResult) => ({
      Ok: {
        publicKey: toHexString(ecdsaPublicKeyResult.public_key),
      },
    }),
    Err: (err) => ({ Err: err }),
  });
}

function messageHashBlob(): Uint8Array {
  const hash = new Keccak(256);
  const message = JSON.stringify({
    to: "0xac03bb73b6a9e108530aff4df5077c2b3d481e5a",
    gasLimit: "21000",
    maxFeePerGas: "300",
    maxPriorityFeePerGas: "10",
    nonce: "0",
    value: "10000000000",
  });
  hash.update(
    "e0018504a817c800825208881234567890abcdef880de0b6b3a764000080808080"
  );

  return Uint8Array.from(hash.digest());
}

$update;
export async function sign(): Promise<
  Result<Record<{ signature: string }>, string>
> {
  // const messageHash = messageHashBlob();
  const obj = {
    nonce: "0x02",
    gasPrice: "0x58848944858",
    gasLimit: "0x30000",
    to: "0xBE33a42b20274691C9AAA28f5E2533d16Ad7bc72",
    value: "0x55c", // 1 ETH in wei
    data: "0x4869206D79206E616D65206973205A6F68616962",
    v: "0x1c",
    r: 0,
    s: 0,
  };

  const list = [
    obj.nonce,
    obj.gasPrice,
    obj.gasLimit,
    obj.to,
    obj.value,
    obj.data,
    // obj.v,
    // obj.r,
    // obj.s,
  ];
  const en = RLP.encode(list);
  const hash = new Keccak(256);
  hash.update(toHexString(en));
  const messageHash = hash.digest();

  if (messageHash.length !== 32) {
    ic.trap("messageHash must be 32 bytes");
  }

  const caller = ic.caller().toUint8Array();

  const signatureResult = await managementCanister
    .sign_with_ecdsa({
      message_hash: messageHash,
      derivation_path: [caller],
      key_id: { curve: { secp256k1: null }, name: "dfx_test_key" },
    })
    .cycles(10_000_000_000n)
    .call();

  return match(signatureResult, {
    Ok: (signWithEcdsaResult) => ({
      Ok: {
        signature: toHexString(signWithEcdsaResult.signature),
      },
    }),
    Err: (err) => ({ Err: err }),
  });
}

$query;
export function encodeRlp(): string {
  const obj = {
    nonce: "0x02",
    gasPrice: "0x58848944858",
    gasLimit: "0x30000",
    to: "0xBE33a42b20274691C9AAA28f5E2533d16Ad7bc72",
    value: "0x55c", // 1 ETH in wei
    data: "0x4869206D79206E616D65206973205A6F68616962",
    v: "0x1c",
    r: 0,
    s: 0,
  };

  const list = [
    obj.nonce,
    obj.gasPrice,
    obj.gasLimit,
    obj.to,
    obj.value,
    obj.data,
  ];
  const en = RLP.encode(list);
  const hash = new Keccak(256);
  hash.update(toHexString(en));
  const messageHash = hash.digest({ format: "hex" });
  return messageHash; // toHexString(en);
}
