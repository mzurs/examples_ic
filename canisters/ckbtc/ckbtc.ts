import {
  ic,
  match,
  nat,
  nat8,
  Opt,
  Principal,
  $query,
  Record,
  text,
  Tuple,
  $update,
  Variant,
  Vec,
  blob,
  $init,
} from "azle";
import {
  ICRCAccount,
  ICRC,
  ICRCTransferArgs, 
  ICRCTransferError,
  ICRCValue,
} from "azle/canisters/icrc";
import {
  binaryAddressFromPrincipal,
  hexAddressFromPrincipal,
} from "azle/canisters/ledger/address";

let CKBTC_PRINCIPAL:Principal;

const icrc = new ICRC(Principal.fromText("bkyz2-fmaaa-aaaaa-qaaaq-cai"));
$init;
export function init(_CKBTC_PRINCIPAL: string): void {

  CKBTC_PRINCIPAL =Principal.fromText( _CKBTC_PRINCIPAL);

}
$query;
export async function icrc1_metadata(): Promise<Vec<Tuple<[text, ICRCValue]>>> {
  const result = await icrc.icrc1_metadata().call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$query;
export async function icrc1_name(): Promise<text> {
  const result = await icrc.icrc1_name().call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$query;
export async function icrc1_symbol(): Promise<text> {
  const result = await icrc.icrc1_symbol().call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$query;
export async function icrc1_decimals(): Promise<nat8> {
  const result = await icrc.icrc1_decimals().call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$query;
export async function icrc1_fee(): Promise<nat> {
  const result = await icrc.icrc1_fee().call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$query;
export async function icrc1_total_supply(): Promise<nat> {
  const result = await icrc.icrc1_total_supply().call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$query;
export async function icrc1_minting_account(): Promise<Opt<ICRCAccount>> {
  const result = await icrc.icrc1_minting_account().call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$query;
export async function icrc1_balance_of(account: ICRCAccount): Promise<nat> {
  const result = await icrc.icrc1_balance_of(account).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$update;
export async function icrc1_transfer(
  amount: nat
): Promise<Variant<{ Ok: nat; Err: ICRCTransferError }>> {
  const args: ICRCTransferArgs = {
    from_subaccount: Opt.None,
    to: {
      owner: ic.id(),
      subaccount: Opt.Some(binaryAddressFromPrincipal(ic.id(), 0)),
    },
    amount: amount,
    fee: Opt.None,
    memo: Opt.None,
    created_at_time: Opt.None,
  };
  const result = await icrc.icrc1_transfer(args).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$query;
export async function icrc1_supported_standards(): Promise<
  Vec<Record<{ name: text; url: text }>>
> {
  const result = await icrc.icrc1_supported_standards().call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$update;
export async function transfer(
  acc: Principal
): Promise<Variant<{ Ok: nat; Err: ICRCTransferError }>> {
  const args: ICRCTransferArgs = {
    from_subaccount: Opt.Some(binaryAddressFromPrincipal(ic.id(), 0)),
    to: {
      owner: acc,
      subaccount: Opt.None,
    },
    amount: 100n,
    fee: Opt.None,
    memo: Opt.None,
    created_at_time: Opt.None,
  };
  const result = await icrc.icrc1_transfer(args).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$query;
export async function canisterBalance(): Promise<nat> {
  const to = {
    owner: ic.id(),
    subaccount: Opt.Some(binaryAddressFromPrincipal(ic.id(), 0)),
  };
  const result = await icrc.icrc1_balance_of(to).call();

  return match(result, {
    Ok: (ok) => ok,
    Err: (err) => ic.trap(err),
  });
}

$query;
export function canisterSubAccount(): blob {
  return binaryAddressFromPrincipal(ic.id(), 0);
}
