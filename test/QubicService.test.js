import { generateKeyPair, generateKeyPairFromPrivateKey } from '../src/QubicService';
import Qubic from '@ardata-tech/qubic-js';
import { getBIP44AddressKeyDeriver } from '@metamask/key-tree';

jest.mock('@metamask/key-tree', () => ({
  getBIP44AddressKeyDeriver: jest.fn(),
}));

jest.mock('@ardata-tech/qubic-js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      utils: {
        hexToBase26: jest.fn((hex) => `base26-${hex}`),
      },
      identity: {
        createIdPackage: jest.fn(async (seed) => ({
          publicId: `publicId-${seed}`,
        })),
        createIdPackageFromPrivateKey: jest.fn(async (privateKey) => ({
          publicId: `publicId-${privateKey}`,
        })),
      },
    };
  });
});

describe('QubicService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('generateKeyPair generates a key pair', async () => {
    const mockDeriveAccountAddress = jest.fn(async (index) => ({
      privateKey: `privateKey-${index}`,
    }));
    getBIP44AddressKeyDeriver.mockResolvedValue(mockDeriveAccountAddress);

    const result = await generateKeyPair(0);

    expect(result).toEqual({
      privateKey: 'base26-privateKey-0',
      publicId: 'publicId-undefined',
    });
    expect(Qubic).toHaveBeenCalledTimes(1);
    expect(mockDeriveAccountAddress).toHaveBeenCalledWith(0);
  });

  test('generateKeyPairFromPrivateKey generates a key pair from a private key', async () => {
    const result = await generateKeyPairFromPrivateKey('testPrivateKey');

    expect(result).toEqual({
      privateKey: 'base26-testPrivateKey',
      publicId: 'publicId-testPrivateKey',
    });
    expect(Qubic).toHaveBeenCalledTimes(1);
  });
});
