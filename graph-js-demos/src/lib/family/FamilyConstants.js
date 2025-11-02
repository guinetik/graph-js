/**
 * Family relationship group constants
 */
export const FAMILY_GROUPS = {
  YOU: 1,
  PARENT: 2,
  SIBLING: 3,
  UNCLE_AUNT: 4,
  COUSIN: 5,
  GRANDPARENT: 6,
  NIECE_NEPHEW: 7,
  CHILD: 8,
  PARTNER: 9
};

/**
 * Gender constants
 */
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other'
};

/**
 * Gender emoji mapping
 */
export const GENDER_EMOJI = {
  [GENDER.MALE]: '🧔‍♂️',
  [GENDER.FEMALE]: '👱‍♀️',
  [GENDER.OTHER]: '🏳️‍⚧️'
};

/**
 * Group color mapping
 */
export const GROUP_COLORS = {
  [FAMILY_GROUPS.YOU]: '#6366f1',           // Indigo
  [FAMILY_GROUPS.PARENT]: '#ec4899',        // Pink
  [FAMILY_GROUPS.SIBLING]: '#3b82f6',       // Blue
  [FAMILY_GROUPS.UNCLE_AUNT]: '#f97316',    // Orange
  [FAMILY_GROUPS.COUSIN]: '#a855f7',        // Purple
  [FAMILY_GROUPS.GRANDPARENT]: '#b45309',   // Amber dark
  [FAMILY_GROUPS.NIECE_NEPHEW]: '#06b6d4',  // Cyan
  [FAMILY_GROUPS.CHILD]: '#14b8a6',         // Teal
  [FAMILY_GROUPS.PARTNER]: '#f43f5e'        // Rose
};

/**
 * Get relationship label for a group
 * @param {number} group - Family group constant
 * @param {string} [genderHint] - Optional hint for gender-specific terms (GENDER.MALE, GENDER.FEMALE, GENDER.OTHER)
 * @returns {string} Human-readable relationship label
 */
export function getRelationshipLabel(group, genderHint = null) {
  // For 'other' gender, use masculine form as default (per user request)
  const isFemale = genderHint === GENDER.FEMALE;
  const isMale = genderHint === GENDER.MALE || genderHint === GENDER.OTHER;

  switch (group) {
    case FAMILY_GROUPS.YOU:
      return 'You';
    case FAMILY_GROUPS.PARENT:
      return isFemale ? 'Mother' : isMale ? 'Father' : 'Parent';
    case FAMILY_GROUPS.SIBLING:
      return isFemale ? 'Sister' : isMale ? 'Brother' : 'Sibling';
    case FAMILY_GROUPS.UNCLE_AUNT:
      return isFemale ? 'Aunt' : isMale ? 'Uncle' : 'Uncle/Aunt';
    case FAMILY_GROUPS.COUSIN:
      return 'Cousin';
    case FAMILY_GROUPS.GRANDPARENT:
      return isFemale ? 'Grandmother' : isMale ? 'Grandfather' : 'Grandparent';
    case FAMILY_GROUPS.NIECE_NEPHEW:
      return isFemale ? 'Niece' : isMale ? 'Nephew' : 'Niece/Nephew';
    case FAMILY_GROUPS.CHILD:
      return isFemale ? 'Daughter' : isMale ? 'Son' : 'Child';
    case FAMILY_GROUPS.PARTNER:
      return isFemale ? 'Wife' : isMale ? 'Husband' : 'Partner/Spouse';
    default:
      return 'Relative';
  }
}

/**
 * Initial family tree data (just YOU)
 */
export const INITIAL_DATA = {
  nodes: [
    { id: 'YOU', group: FAMILY_GROUPS.YOU, relationship: 'You' }
  ],
  links: []
};

/**
 * Storage key for family tree data
 */
export const STORAGE_KEY = 'familyTree';

