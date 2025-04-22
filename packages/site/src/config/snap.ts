/**
 * The snap origin to use.
 * Will default to the locally hosted snap if no value is provided in the environment.
 *
 * You may be tempted to change this to the URL where your production snap is hosted, but please
 * don't. Instead, rename `.env.production.dist` to `.env.production` and set the production URL
 * there. Running `yarn build` will automatically use the production environment variables.
 */
export const defaultSnapOrigin =
  process.env.SNAP_ORIGIN ?? `local:http://localhost:8080`;

export const mode = 
  ['debug', 'release'].includes(process.env.MODE ?? "") ? process.env.MODE : 'debug';