import * as migration_20260618_042013_initial from './20260618_042013_initial';

export const migrations = [
  {
    up: migration_20260618_042013_initial.up,
    down: migration_20260618_042013_initial.down,
    name: '20260618_042013_initial'
  },
];
