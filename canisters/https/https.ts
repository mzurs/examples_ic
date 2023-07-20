import { ic, Manual, match, Opt, Principal, $query, $update } from "azle";
import {
  HttpResponse,
  HttpTransformArgs,
  managementCanister,
} from "azle/canisters/management";

$update;
export async function xkcd(): Promise<HttpResponse> {
  const httpResult = await managementCanister
    .http_request({
      url: `https://deces.matchid.io/deces/api/v1/search?firstName=Francois&lastName=Mitterrand&birthPostalCode=16200&deathDate=08/01/1996&fuzzy=false`,
      max_response_bytes: Opt.Some(20_000n),
      method: {
        get: null,
      },
      headers: [],
      body: Opt.None,
      transform: Opt.Some({
        function: [ic.id(), "xkcdTransform"],
        context: Uint8Array.from([]),
      }),
    })
    .cycles(50_000_000n)
    .call();

  return match(httpResult, {
    Ok: (httpResponse) => httpResponse,
    Err: (err) => ic.trap(err),
  });
}

// TODO the replica logs give some concerning output: https://forum.dfinity.org/t/fix-me-in-http-outcalls-call-raw/19435
$update;
export async function xkcdRaw(): Promise<Manual<HttpResponse>> {
  const httpResult = await ic.callRaw(
    Principal.fromText("aaaaa-aa"),
    "http_request",
    ic.candidEncode(`
            (
                record {
                    url = "https://xkcd.com/642/info.0.json";
                    max_response_bytes = 2_000 : nat64;
                    method = variant { get };
                    headers = vec {};
                    body = null;
                    transform = record { function = func "${ic
                      .id()
                      .toString()}".xkcdTransform; context = vec {} };
                }
            )
        `),
    50_000_000n
  );

  match(httpResult, {
    Ok: (httpResponse) => ic.replyRaw(httpResponse),
    Err: (err) => ic.trap(err),
  });
}

$query;
export function xkcdTransform(args: HttpTransformArgs): HttpResponse {
  return {
    ...args.response,
    headers: [],
  };
}
