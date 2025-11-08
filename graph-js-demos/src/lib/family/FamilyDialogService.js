/**
 * FamilyDialogService - Dialog configuration and action mapping for family tree
 *
 * Handles dialog field configuration and maps dialog actions to controller methods
 *
 * @class
 */

import { FAMILY_GROUPS, GENDER, GENDER_EMOJI } from './FamilyConstants.js';

/**
 * Get gender field options for radio buttons
 * @param {Function} t - Translation function
 * @returns {Array} Gender options with emoji and text
 */
function getGenderOptions(t) {
  return [
    { value: GENDER.MALE, emoji: GENDER_EMOJI[GENDER.MALE], text: t('family.dialogs.genderOptions.male') },
    { value: GENDER.FEMALE, emoji: GENDER_EMOJI[GENDER.FEMALE], text: t('family.dialogs.genderOptions.female') },
    { value: GENDER.OTHER, emoji: GENDER_EMOJI[GENDER.OTHER], text: t('family.dialogs.genderOptions.other') }
  ];
}

/**
 * Dialog action types enum
 * @enum {string}
 */
export const DIALOG_ACTIONS = {
  ADD_PARENTS: 'addParents',
  ADD_SIBLING: 'addSibling',
  ADD_GRANDPARENTS: 'addGrandparents',
  ADD_UNCLE_AUNT: 'addUncleAunt',
  ADD_COUSIN: 'addCousin',
  ADD_CHILD: 'addChild',
  ADD_NIECE_NEPHEW: 'addNieceNephew',
  ADD_PARTNER: 'addPartner'
};

/**
 * FamilyDialogService - Service for managing family tree dialogs
 *
 * @class
 */
export class FamilyDialogService {
  /**
   * Creates a new FamilyDialogService instance
   *
   * @param {Function} getGraphInstance - Function that returns the graph instance
   * @param {FamilyValidation} validation - Validation instance
   * @param {Function} [t] - Translation function (optional, defaults to identity function)
   */
  constructor(getGraphInstance, validation, t = (key) => key) {
    this.getGraphInstance = getGraphInstance;
    this.validation = validation;
    /**
     * Translation function for i18n support
     * @type {Function}
     */
    this.t = t;
  }

  /**
   * Get dialog configuration for adding parents
   *
   * @returns {Object|null} {title: string, fields: Array, action: string} or null if validation fails
   */
  getAddParentsDialog() {
    // Validate: can only add parents if we have fewer than 2
    const validation = this.validation.canAddParents();
    if (validation && !validation.canAdd) {
      return null; // Validation failed - will be handled by caller
    }

    return {
      title: this.t('family.dialogs.addParents'),
      fields: [
        { label: this.t('family.dialogs.fields.motherName'), type: 'text', required: false },
        { label: this.t('family.dialogs.fields.motherAvatar'), type: 'emoji', required: false, placeholder: this.t('family.dialogs.placeholders.mother') },
        { label: this.t('family.dialogs.fields.fatherName'), type: 'text', required: false },
        { label: this.t('family.dialogs.fields.fatherAvatar'), type: 'emoji', required: false, placeholder: this.t('family.dialogs.placeholders.father') }
      ],
      action: DIALOG_ACTIONS.ADD_PARENTS
    };
  }

  /**
   * Get dialog configuration for adding sibling
   *
   * @returns {Object} {title: string, fields: Array, action: string}
   */
  getAddSiblingDialog() {
    return {
      title: this.t('family.dialogs.addSibling'),
      fields: [
        { label: this.t('family.dialogs.fields.siblingName'), type: 'text', required: true },
        { label: this.t('family.dialogs.fields.gender'), type: 'radio', options: getGenderOptions(this.t), required: true },
        { label: this.t('family.dialogs.fields.avatar'), type: 'emoji', required: false, placeholder: this.t('family.dialogs.placeholders.avatar') }
      ],
      action: DIALOG_ACTIONS.ADD_SIBLING
    };
  }

  /**
   * Get dialog configuration for adding grandparents
   *
   * @returns {Object} {title: string, fields: Array}
   */
  getAddGrandparentsDialog() {
    const graphInstance = this.getGraphInstance();
    if (!graphInstance?.data) {
      return null;
    }

    const parents = graphInstance.data.nodes.filter(n => n.group === FAMILY_GROUPS.PARENT);
    if (parents.length === 0) {
      return null; // Will be handled by validation
    }

    const parentOptions = parents.map(p => ({ 
      value: p.id, 
      text: this.t('family.dropdownOptions.parentSideTemplate').replace('{name}', p.id)
    }));

    return {
      title: this.t('family.dialogs.addGrandparents'),
      fields: [
        { label: this.t('family.dialogs.fields.parentsSide'), type: 'select', options: parentOptions, required: true },
        { label: this.t('family.dialogs.fields.grandmotherName'), type: 'text', required: false },
        { label: this.t('family.dialogs.fields.grandmotherAvatar'), type: 'emoji', required: false, placeholder: this.t('family.dialogs.placeholders.grandmother') },
        { label: this.t('family.dialogs.fields.grandfatherName'), type: 'text', required: false },
        { label: this.t('family.dialogs.fields.grandfatherAvatar'), type: 'emoji', required: false, placeholder: this.t('family.dialogs.placeholders.grandfather') }
      ],
      action: DIALOG_ACTIONS.ADD_GRANDPARENTS
    };
  }

  /**
   * Get dialog configuration for adding uncle/aunt
   *
   * @returns {Object} {title: string, fields: Array}
   */
  getAddUncleAuntDialog() {
    const graphInstance = this.getGraphInstance();
    if (!graphInstance?.data) {
      return null;
    }

    const parents = graphInstance.data.nodes.filter(n => n.group === FAMILY_GROUPS.PARENT);
    if (parents.length === 0) {
      return null; // Will be handled by validation
    }

    const parentOptions = parents.map(p => ({ 
      value: p.id, 
      text: this.t('family.dropdownOptions.parentSideTemplate').replace('{name}', p.id)
    }));

    return {
      title: this.t('family.dialogs.addUncleAunt'),
      fields: [
        { label: this.t('family.dialogs.fields.parentsSide'), type: 'select', options: parentOptions, required: true },
        { label: this.t('family.dialogs.fields.name'), type: 'text', required: true },
        { label: this.t('family.dialogs.fields.gender'), type: 'radio', options: getGenderOptions(this.t), required: true },
        { label: this.t('family.dialogs.fields.avatar'), type: 'emoji', required: false, placeholder: this.t('family.dialogs.placeholders.avatar') }
      ],
      action: DIALOG_ACTIONS.ADD_UNCLE_AUNT
    };
  }

  /**
   * Get dialog configuration for adding cousin
   *
   * @returns {Object} {title: string, fields: Array}
   */
  getAddCousinDialog() {
    const graphInstance = this.getGraphInstance();
    if (!graphInstance?.data) {
      return null;
    }

    const unclesAunts = graphInstance.data.nodes.filter(n => n.group === FAMILY_GROUPS.UNCLE_AUNT);
    if (unclesAunts.length === 0) {
      return null; // Will be handled by validation
    }

    const uncleAuntOptions = unclesAunts.map(u => ({ 
      value: u.id, 
      text: this.t('family.dropdownOptions.uncleAuntChildTemplate').replace('{name}', u.id)
    }));

    return {
      title: this.t('family.dialogs.addCousin'),
      fields: [
        { label: this.t('family.dialogs.fields.uncleAuntField'), type: 'select', options: uncleAuntOptions, required: true },
        { label: this.t('family.dialogs.fields.name'), type: 'text', required: true },
        { label: this.t('family.dialogs.fields.gender'), type: 'radio', options: getGenderOptions(this.t), required: true },
        { label: this.t('family.dialogs.fields.avatar'), type: 'emoji', required: false, placeholder: this.t('family.dialogs.placeholders.avatar') }
      ],
      action: DIALOG_ACTIONS.ADD_COUSIN
    };
  }

  /**
   * Get dialog configuration for adding child
   *
   * @returns {Object} {title: string, fields: Array}
   */
  getAddChildDialog() {
    const eligibleParents = this.validation.getEligibleParents();
    if (eligibleParents.length === 0) {
      return null; // Will be handled by validation
    }

    const parentOptions = eligibleParents.map(node => {
      let relationship = '';
      switch (node.group) {
        case FAMILY_GROUPS.YOU:
          relationship = this.t('family.dropdownOptions.yourChild');
          break;
        case FAMILY_GROUPS.SIBLING:
          relationship = this.t('family.dropdownOptions.nieceNephewTemplate').replace('{name}', node.id);
          break;
        case FAMILY_GROUPS.COUSIN:
          relationship = this.t('family.dropdownOptions.cousinChildTemplate').replace('{name}', node.id);
          break;
        case FAMILY_GROUPS.CHILD:
          relationship = this.t('family.dropdownOptions.grandchildTemplate').replace('{name}', node.id);
          break;
        case FAMILY_GROUPS.NIECE_NEPHEW:
          relationship = this.t('family.dropdownOptions.childTemplate').replace('{name}', node.id);
          break;
        case FAMILY_GROUPS.PARTNER:
          relationship = this.t('family.dropdownOptions.childTemplate').replace('{name}', node.id);
          break;
        default:
          relationship = this.t('family.dropdownOptions.childTemplate').replace('{name}', node.id);
      }
      return { value: node.id, text: relationship };
    });

    return {
      title: this.t('family.dialogs.addChild'),
      fields: [
        { label: this.t('family.dialogs.fields.parent'), type: 'select', options: parentOptions, required: true },
        { label: this.t('family.dialogs.fields.name'), type: 'text', required: true },
        { label: this.t('family.dialogs.fields.gender'), type: 'radio', options: getGenderOptions(this.t), required: true },
        { label: this.t('family.dialogs.fields.avatar'), type: 'emoji', required: false, placeholder: this.t('family.dialogs.placeholders.avatar') }
      ],
      action: DIALOG_ACTIONS.ADD_CHILD
    };
  }

  /**
   * Get dialog configuration for adding niece/nephew
   *
   * @returns {Object} {title: string, fields: Array}
   */
  getAddNieceNephewDialog() {
    const graphInstance = this.getGraphInstance();
    if (!graphInstance?.data) {
      return null;
    }

    const siblings = graphInstance.data.nodes.filter(n => n.group === FAMILY_GROUPS.SIBLING);
    if (siblings.length === 0) {
      return null; // Will be handled by validation
    }

    const siblingOptions = siblings.map(s => ({ 
      value: s.id, 
      text: this.t('family.dropdownOptions.siblingChildTemplate').replace('{name}', s.id)
    }));

    return {
      title: this.t('family.dialogs.addNieceNephew'),
      fields: [
        { label: this.t('family.dialogs.fields.sibling'), type: 'select', options: siblingOptions, required: true },
        { label: this.t('family.dialogs.fields.name'), type: 'text', required: true },
        { label: this.t('family.dialogs.fields.gender'), type: 'radio', options: getGenderOptions(this.t), required: true },
        { label: this.t('family.dialogs.fields.avatar'), type: 'emoji', required: false, placeholder: this.t('family.dialogs.placeholders.avatar') }
      ],
      action: DIALOG_ACTIONS.ADD_NIECE_NEPHEW
    };
  }

  /**
   * Get dialog configuration for adding partner
   *
   * @returns {Object} {title: string, fields: Array}
   */
  getAddPartnerDialog() {
    const eligibleForPartner = this.validation.getEligibleForPartner();
    if (eligibleForPartner.length === 0) {
      return null; // Will be handled by validation
    }

    const partnerOptions = eligibleForPartner.map(node => {
      let relationship = '';
      switch (node.group) {
        case FAMILY_GROUPS.YOU:
          relationship = this.t('family.operations.relationships.yourPartner');
          break;
        case FAMILY_GROUPS.SIBLING:
          relationship = this.t('family.dropdownOptions.siblingPartnerTemplate').replace('{name}', node.id);
          break;
        case FAMILY_GROUPS.COUSIN:
          relationship = this.t('family.dropdownOptions.partnerTemplate').replace('{name}', node.id);
          break;
        case FAMILY_GROUPS.UNCLE_AUNT:
          relationship = this.t('family.dropdownOptions.partnerTemplate').replace('{name}', node.id);
          break;
        case FAMILY_GROUPS.NIECE_NEPHEW:
          relationship = this.t('family.dropdownOptions.partnerTemplate').replace('{name}', node.id);
          break;
        case FAMILY_GROUPS.CHILD:
          relationship = this.t('family.dropdownOptions.childPartnerTemplate').replace('{name}', node.id);
          break;
        default:
          relationship = this.t('family.dropdownOptions.partnerTemplate').replace('{name}', node.id);
      }
      return { value: node.id, text: relationship };
    });

    return {
      title: this.t('family.dialogs.addPartner'),
      fields: [
        { label: this.t('family.dialogs.fields.partnerOf'), type: 'select', options: partnerOptions, required: true },
        { label: this.t('family.dialogs.fields.name'), type: 'text', required: true },
        { label: this.t('family.dialogs.fields.gender'), type: 'radio', options: getGenderOptions(this.t), required: true },
        { label: this.t('family.dialogs.fields.avatar'), type: 'emoji', required: false, placeholder: this.t('family.dialogs.placeholders.avatar') }
      ],
      action: DIALOG_ACTIONS.ADD_PARTNER
    };
  }

  /**
   * Get validation error message for a specific action
   * Used when dialog returns null to get appropriate error message
   *
   * @param {string} actionType - One of DIALOG_ACTIONS
   * @returns {string} Error message
   */
  getValidationMessage(actionType) {
    const graphInstance = this.getGraphInstance();

    switch (actionType) {
      case DIALOG_ACTIONS.ADD_PARENTS: {
        const validation = this.validation.canAddParents();
        return validation?.message || 'Cannot add more parents (maximum 2)';
      }
      case DIALOG_ACTIONS.ADD_GRANDPARENTS: {
        const parents = graphInstance?.data?.nodes.filter(n => n.group === FAMILY_GROUPS.PARENT);
        return parents?.length === 0 ? 'You must add parents first before adding grandparents' : 'No parents available';
      }
      case DIALOG_ACTIONS.ADD_UNCLE_AUNT: {
        const parents = graphInstance?.data?.nodes.filter(n => n.group === FAMILY_GROUPS.PARENT);
        return parents?.length === 0 ? 'You must add parents first before adding uncles/aunts' : 'No parents available';
      }
      case DIALOG_ACTIONS.ADD_COUSIN: {
        const unclesAunts = graphInstance?.data?.nodes.filter(n => n.group === FAMILY_GROUPS.UNCLE_AUNT);
        return unclesAunts?.length === 0 ? 'You must add uncles/aunts first before adding cousins' : 'No uncles/aunts available';
      }
      case DIALOG_ACTIONS.ADD_CHILD: {
        return 'No eligible parents available to have children';
      }
      case DIALOG_ACTIONS.ADD_NIECE_NEPHEW: {
        const siblings = graphInstance?.data?.nodes.filter(n => n.group === FAMILY_GROUPS.SIBLING);
        return siblings?.length === 0 ? 'You must add siblings first before adding nieces/nephews' : 'No siblings available';
      }
      case DIALOG_ACTIONS.ADD_PARTNER: {
        return 'No eligible people available for partners (they may already have partners)';
      }
      default:
        return 'Operation cannot be performed';
    }
  }

  /**
   * Execute a dialog action with values
   *
   * @param {string} action - Action name (from DIALOG_ACTIONS enum)
   * @param {Array} values - Dialog field values
   * @param {FamilyOperations} operations - Operations instance
   * @returns {Object} {success: boolean, message?: string}
   */
  executeAction(action, values, operations) {
    switch (action) {
      case DIALOG_ACTIONS.ADD_PARENTS:
        // values: [motherName, motherAvatar, fatherName, fatherAvatar]
        return operations.addParents(values[0], values[2], values[1], values[3]);
      case DIALOG_ACTIONS.ADD_SIBLING:
        // values: [name, gender, avatar]
        return operations.addSibling(values[0], values[1], values[2]);
      case DIALOG_ACTIONS.ADD_GRANDPARENTS:
        // values: [parentSide, grandmotherName, grandmotherAvatar, grandfatherName, grandfatherAvatar]
        return operations.addGrandparents(values[0], values[1], values[3], values[2], values[4]);
      case DIALOG_ACTIONS.ADD_UNCLE_AUNT:
        // values: [parentSide, name, gender, avatar]
        return operations.addUncleAunt(values[0], values[1], values[2], values[3]);
      case DIALOG_ACTIONS.ADD_COUSIN:
        // values: [uncleAuntId, name, gender, avatar]
        return operations.addCousin(values[0], values[1], values[2], values[3]);
      case DIALOG_ACTIONS.ADD_CHILD:
        // values: [parentId, name, gender, avatar]
        return operations.addChild(values[0], values[1], values[2], values[3]);
      case DIALOG_ACTIONS.ADD_NIECE_NEPHEW:
        // values: [siblingId, name, gender, avatar]
        return operations.addNieceNephew(values[0], values[1], values[2], values[3]);
      case DIALOG_ACTIONS.ADD_PARTNER:
        // values: [personId, name, gender, avatar]
        return operations.addPartner(values[0], values[1], values[2], values[3]);
      default:
        return { success: false, message: `Unknown action: ${action}` };
    }
  }
}

