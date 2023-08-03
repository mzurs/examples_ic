import {
  Duration,
  ic,
  TimerId,
  Tuple,
  $update,
  nat32,
  nat64,
  $query,
} from "azle";
let val: nat32 = 0;
let timerId: nat64;
$update;
export function setTimer(interval: Duration): Tuple<[TimerId, nat32]> {
  const functionTimerId = ic.setTimer(interval, callback);
  timerId = functionTimerId;
  const capturedValue = "🚩";

  //   const closureTimerId = ic.setTimerInterval(interval, () => {
  //     console.log(`closure called and captured value ${capturedValue}`);
  //   });

  return [functionTimerId, val];
}

function callback(): void {
  val = val + 1;
  console.log("callback called");
  ic.clearTimer(timerId);
  console.log("Timer Closed");
}
$query;
export function getVal(): nat32 {
  return val;
}
