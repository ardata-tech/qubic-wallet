/**
 * Check if a snap ID is a local snap ID.
 * @param snapId - The snap ID.
 * @returns True if it's a local Snap, or false otherwise.
 */
export const isLocalSnap = (snapId: string):boolean => snapId.startsWith('local:');

export const isNpmSnap = (snapId: string):boolean => snapId.startsWith('npm:');
