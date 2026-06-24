import * as migration_20260618_042013_initial from './20260618_042013_initial';
import * as migration_20260618_043950_drafts from './20260618_043950_drafts';
import * as migration_20260624_053618_add_subjects from './20260624_053618_add_subjects';

export const migrations = [
  {
    up: migration_20260618_042013_initial.up,
    down: migration_20260618_042013_initial.down,
    name: '20260618_042013_initial',
  },
  {
    up: migration_20260618_043950_drafts.up,
    down: migration_20260618_043950_drafts.down,
    name: '20260618_043950_drafts',
  },
  {
    up: migration_20260624_053618_add_subjects.up,
    down: migration_20260624_053618_add_subjects.down,
    name: '20260624_053618_add_subjects'
  },
];
