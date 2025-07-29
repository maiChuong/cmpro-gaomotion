/**
 * Defines the structure for a single rig option.
 */
export interface RigOption {
  value: string;
  label: string;
}

export const rigOptions: RigOption[] = [
  { value: 'human_metarig', label: 'Human (Meta-Rig)' },
  { value: 'cat_metarig', label: 'Cat (Meta-Rig)' },
  { value: 'wolf_metarig', label: 'Wolf (Meta-Rig)' },
  { value: 'horse_metarig', label: 'Horse (Meta-Rig)' },
];

