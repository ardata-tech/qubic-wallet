import { generateKeyPair } from './privateKey';

// Mocking external dependencies
jest.mock('@metamask/key-tree', () => ({
  getBIP44AddressKeyDeriver: jest.fn().mockResolvedValue(() => ({
    privateKey: 'mockedPrivateKey',
  })),
}));

jest.mock('qubic-ts-library/dist/qubicHelper', () => ({
  QubicHelper: jest.fn().mockImplementation(() => ({
    createIdPackage: jest.fn().mockResolvedValue({ publicId: 'mockedPublicId' }),
  })),
}));

jest.mock('./utils', () => ({
  hexToBase26: jest.fn().mockReturnValue('mockedBase26Key'),
}));

global.snap = {
  request: jest.fn().mockResolvedValue('mockedBip44Node'),
};

describe('generateKeyPair', () => {
  it('should generate a key pair successfully', async () => {
    const result = await generateKeyPair(0);
    expect(result).toEqual({
      privateKey: 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmockedBase26Key',
      publicId: 'mockedPublicId',
    });
  });

  it('should handle different accountIndex values', async () => {
    const result = await generateKeyPair(1);
    expect(result).toEqual({
      privateKey: 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzmockedBase26Key',
      publicId: 'mockedPublicId',
    });
  });

  it('should handle errors from snap request', async () => {
    global.snap.request.mockRejectedValueOnce(new Error('snap error'));
    await expect(generateKeyPair(0)).rejects.toThrow('snap error');
  });
});
