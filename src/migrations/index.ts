import * as migration_20260618_042013_initial from './20260618_042013_initial';
import * as migration_20260618_043950_drafts from './20260618_043950_drafts';

export const migrations = [
  {
    up: migration_20260618_042013_initial.up,
    down: migration_20260618_042013_initial.down,
    name: '20260618_042013_initial',
  },
  {
    up: migration_20260618_043950_drafts.up,
    down: migration_20260618_043950_drafts.down,
    name: '20260618_043950_drafts'
  },
];
