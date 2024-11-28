import { onRpcRequest } from './index';
import { generateKeyPair } from './privateKey';
import { assertInput, assertConfirmation, assertIsString, assertIsInt, assertIsBoolean } from './utils';
import { renderGetPublicKey, renderSignTransaction } from './ui';
import { QubicHelper } from '@qubic-lib/qubic-ts-library/dist/qubicHelper';
import Crypto from '@qubic-lib/qubic-ts-library/dist/crypto';

jest.mock('./privateKey');
jest.mock('./utils');
jest.mock('./ui');
jest.mock('@qubic-lib/qubic-ts-library/dist/qubicHelper', () => {
  return {
    QubicHelper: jest.fn().mockImplementation(() => {
      return {
        DIGEST_LENGTH: 32,
        createIdPackage: jest.fn().mockResolvedValue({
          privateKey: 'mockPrivateKey',
          publicKey: 'mockPublicKey'
        })
      };
    })
  };
});
jest.mock('@qubic-lib/qubic-ts-library/dist/crypto', () => ({
  K12: jest.fn(),
  schnorrq: {
    sign: jest.fn()
  }
}));

global.snap = {
  request: jest.fn().mockResolvedValue({
    method: 'snap_getBip44Entropy',
    params: { coinType: 83293 }
  })
};

describe('onRpcRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return publicId for getPublicId method without mocking generateKeyPair', async () => {
    const mockPublicId = 'mockPublicId';
    generateKeyPair.mockResolvedValue({ publicId: mockPublicId });
    renderGetPublicKey.mockResolvedValue(true);
    assertIsBoolean.mockImplementation(() => {});

    const result = await onRpcRequest({
      request: { method: 'getPublicId', params: { accountIdx: 0, confirm: true } },
      origin: 'http://example.com'
    });

    expect(result).toBe(mockPublicId);
    expect(generateKeyPair).toHaveBeenCalledWith(0);
    expect(renderGetPublicKey).toHaveBeenCalled();
    expect(assertConfirmation).toHaveBeenCalledWith(true);
  });

  it('should return signed transaction for signTransaction method', async () => {
    const mockSignedTx = 'mockSignedTx';
    const mockPrivateKey = 'mockPrivateKey';
    const mockPublicKey = 'mockPublicKey';
    const mockDigest = new Uint8Array(32);
    generateKeyPair.mockResolvedValue({ privateKey: mockPrivateKey });
    renderSignTransaction.mockResolvedValue(true);
    assertInput.mockImplementation(() => {});
    assertIsString.mockImplementation(() => {});
    assertIsInt.mockImplementation(() => {});

    const qHelper = new QubicHelper();
    qHelper.DIGEST_LENGTH = 32;
    qHelper.createIdPackage = jest.fn().mockResolvedValue({ privateKey: mockPrivateKey, publicKey: mockPublicKey });

    const qCrypto = await Crypto;
    qCrypto.K12.mockImplementation(() => {});
    qCrypto.schnorrq.sign.mockReturnValue(new Uint8Array(mockSignedTx.split('').map(char => char.charCodeAt(0))));

    const result = await onRpcRequest({
      request: { method: 'signTransaction', params: { base64Tx: 'dGVzdA==', offset: 4, accountIdx: 0, confirm: true } },
      origin: 'http://example.com'
    });

    expect(result.signedTx).toBe(btoa(mockSignedTx));
    expect(generateKeyPair).toHaveBeenCalledWith(0);
    expect(renderSignTransaction).toHaveBeenCalled();
    expect(assertConfirmation).toHaveBeenCalledWith(true);
  });

  it('should throw an error for unsupported method', async () => {
    await expect(onRpcRequest({
      request: { method: 'unsupportedMethod' },
      origin: 'http://example.com'
    })).rejects.toEqual({
      code: 4200,
      message: 'The requested method is not supported.'
    });
  });
});
