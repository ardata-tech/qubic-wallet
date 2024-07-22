export function assertInput(path) {
  if (!path) {
    throw {
      code: -32000,
      message: 'Invalid input.'
    };
  }
}

export function assertAllStrings(input) {
  if (!Array.isArray(input) || !input.every((item) => typeof item === 'string')) {
    throw {
      code: -32000,
      message: 'Invalid input.'
    };
  }
}

export function assertIsArray(input) {
  if (!Array.isArray(input)) {
    throw {
      code: -32000,
      message: 'Invalid input.'
    };
  }
}

export function assertIsString(input) {
  if (typeof input !== 'string') {
    throw {
      code: -32000,
      message: 'Invalid input.'
    };
  }
}

export function assertIsBoolean(input) {
  if (typeof input !== 'boolean') {
    throw {
      code: -32000,
      message: 'Invalid input.'
    };
  }
}

export function assertIsInt(input) {
  if (!Number.isInteger(input)) {
    throw {
      code: -32000,
      message: 'Invalid input.'
    };
  }
}

export function assertConfirmation(confirmed) {
  if (!confirmed) {
    throw {
      code: 4001,
      message: 'User rejected the request.'
    };
  }
}

// Define the alphabet for the base26 encoding
const alphabet = 'abcdefghijklmnopqrstuvwxyz'

export const hexToBase26 = (hexString) => {
  // Convert the hex string to a BigInt
  const num = BigInt(hexString)

  let result = ''

  // Convert to base26
  let n = num
  while (n > 0) {
    const remainder = n % BigInt(alphabet.length)
    result = alphabet[Number(remainder)] + result
    n = n / BigInt(alphabet.length)
  }

  return result
}

export const base26ToHex = (base26String) => {
  let num = BigInt(0)

  for (let i = 0; i < base26String.length; i++) {
    num *= BigInt(26)
    // @ts-ignore
    num += BigInt(alphabet.indexOf(base26String[i]))
  }

  return '0x' + num.toString(16);
}

export const base26 = {
  hexToBase26,
  base26ToHex,
}
