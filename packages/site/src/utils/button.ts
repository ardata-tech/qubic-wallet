import type { Snap } from '../types';
import { isLocalSnap } from './snap';

export const shouldDisplayReconnectButton = (installedSnap: Snap | null): boolean | unknown =>
  installedSnap && isLocalSnap(installedSnap?.id);
