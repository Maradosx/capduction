/**
 * Plain constants shared between server actions and client components.
 * Must NOT have `'use server'` directive so non-async exports are allowed.
 */
export const PROJECT_COLORS = [
  '#FF8FB5', '#B58FFF', '#5DD5DA', '#FFE5A0', '#FFD0B5', '#D6F5E5',
] as const;

export type ProjectColor = (typeof PROJECT_COLORS)[number];
