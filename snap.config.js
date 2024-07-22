import { resolve } from 'path'

const config = {
  bundler: 'webpack',
  input: resolve(__dirname, 'src/index.js'),
  server: {
    port: 8080,
  },
  polyfills: {
    buffer: true,
  },
}

export default config
