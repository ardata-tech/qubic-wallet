import type { Snap } from '../types';
import { isLocalSnap, isNpmSnap } from './snap';

export const shouldDisplayReconnectButton = (installedSnap: Snap | null): boolean | unknown =>
  installedSnap && (isLocalSnap(installedSnap?.id) || isNpmSnap(installedSnap?.id));
