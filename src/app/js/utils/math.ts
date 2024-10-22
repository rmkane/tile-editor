import { NumberPair } from "../../types";

/**
 * Returns the quotient and remainder as a tuple.
 */
function divmod(n: number, m: number): NumberPair {
  return [Math.floor(n / m), n % m];
}

export { divmod };
