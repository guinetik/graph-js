/**
 * FamilyOperations - Operations for adding family members
 *
 * Handles all add operations for family tree
 *
 * @class
 */

import { FAMILY_GROUPS, GENDER, getRelationshipLabel } from './FamilyConstants.js';

/**
 * Helper function to normalize link source/target to ID
 * @param {string|Object} source - Source node ID or object
 * @returns {string} Normalized source ID
 */
function normalizeLinkId(source) {
  return typeof source === 'string' ? source : (source?.id || String(source));
}

/**
 * FamilyOperations - Operations for adding family members
 *
 * @class
 */
export class FamilyOperations {
  /**
   * Creates a new FamilyOperations instance
   *
   * @param {Object} graphManager - Graph manager instance
   * @param {Function} getGraphInstance - Function that returns the graph instance
   * @param {FamilyValidation} validation - Validation instance
   * @param {Function} saveFamily - Function to save family tree
   */
  constructor(graphManager, getGraphInstance, validation, saveFamily) {
    this.graphManager = graphManager;
    this.getGraphInstance = getGraphInstance;
    this.validation = validation;
    this.saveFamily = saveFamily;
  }

  /**
   * Helper method to add a node with relationship label, gender, and avatar
   *
   * @param {Array} neighborIds - IDs of nodes to connect to
   * @param {string} nodeId - Node ID
   * @param {number} group - Group number
   * @param {string} [gender] - Gender (GENDER.MALE, GENDER.FEMALE, GENDER.OTHER)
   * @param {string} [avatar] - Avatar emoji
   * @param {string} [customRelationship] - Optional custom relationship label (overrides default)
   * @returns {Object} The newly created node
   */
  addNodeWithRelationship(neighborIds, nodeId, group, gender = null, avatar = null, customRelationship = null) {
    const relationship = customRelationship || getRelationshipLabel(group, gender);

    // Get graph instance BEFORE adding node so we can access it immediately after
    const graphInstance = this.getGraphInstance();

    // Add the node - handle both sync (addNodeIncremental) and async (addNode wrapper) cases
    const addNodeResult = this.graphManager.addNode(neighborIds, nodeId, group, true);

    // If it's a Promise (async wrapper), handle it
    if (addNodeResult && typeof addNodeResult.then === 'function') {
      return addNodeResult.then(newNode => {
        this._setNodeProperties(newNode, relationship, gender, avatar, graphInstance);
        return newNode;
      });
    }

    // Synchronous case (direct call to addNodeIncremental)
    const newNode = addNodeResult;
    this._setNodeProperties(newNode, relationship, gender, avatar, graphInstance);
    return newNode;
  }

  /**
   * Set relationship, gender, and avatar properties on a node
   * @private
   */
  _setNodeProperties(newNode, relationship, gender, avatar, graphInstance) {
    this._setNodeProperty(newNode, 'relationship', relationship, graphInstance);
    if (gender) {
      this._setNodeProperty(newNode, 'gender', gender, graphInstance);
    }
    if (avatar) {
      this._setNodeProperty(newNode, 'avatar', avatar, graphInstance);
    }

    // Also use requestAnimationFrame as a fallback to ensure properties are set after D3 renders
    requestAnimationFrame(() => {
      if (graphInstance?.data) {
        const nodeInData = graphInstance.data.nodes.find(n => n.id === newNode.id);
        if (nodeInData) {
          if (!nodeInData.relationship) nodeInData.relationship = relationship;
          if (gender && !nodeInData.gender) nodeInData.gender = gender;
          if (avatar && !nodeInData.avatar) nodeInData.avatar = avatar;

          // Update visual element if in avatars mode
          if (avatar && graphInstance.options?.renderMode === 'avatars') {
            this._updateNodeAvatarElement(newNode.id, avatar, graphInstance);
          }
        }
      }
    });
  }

  /**
   * Update the avatar text element for a specific node
   * @private
   */
  _updateNodeAvatarElement(nodeId, avatar, graphInstance) {
    if (!graphInstance?.nodeGroup) return;

    // Find and update the text element for this node
    graphInstance.nodeGroup
      .selectAll('text')
      .filter(d => d.id === nodeId)
      .text(avatar);
  }

  /**
   * Set a property on a node and ensure it's on the correct object reference
   * @private
   */
  _setNodeProperty(newNode, propertyName, propertyValue, graphInstance) {
    if (!newNode) return;

    // Set property immediately on the returned node
    newNode[propertyName] = propertyValue;

    // Also ensure it's set on the node in the graph instance data array
    // This is the actual object D3 uses for rendering and event handlers
    if (graphInstance?.data) {
      // Find the node in the data array - this is what D3 event handlers read from
      let nodeInData = graphInstance.data.nodes.find(n => n.id === newNode.id);

      if (nodeInData) {
        // Set on the node in the array (this is what D3 event handlers read from)
        nodeInData[propertyName] = propertyValue;

        // They should be the same reference, but if not, sync both
        if (nodeInData !== newNode) {
          newNode[propertyName] = propertyValue;
        }
      } else {
        // Node not in array yet - use requestAnimationFrame to set it after rendering
        requestAnimationFrame(() => {
          if (graphInstance?.data) {
            const nodeInData = graphInstance.data.nodes.find(n => n.id === newNode.id);
            if (nodeInData) {
              nodeInData[propertyName] = propertyValue;
            }
          }
        });
      }
    }
  }

  /**
   * Set relationship property on a node and ensure it's on the correct object reference
   * @private
   */
  _setRelationshipOnNode(newNode, relationship, graphInstance) {
    this._setNodeProperty(newNode, 'relationship', relationship, graphInstance);

    // Also use requestAnimationFrame as a fallback to ensure it's set after D3 renders
    requestAnimationFrame(() => {
        if (graphInstance?.data) {
          const nodeInData = graphInstance.data.nodes.find(n => n.id === newNode.id);
          if (nodeInData && !nodeInData.relationship) {
            nodeInData.relationship = relationship;
          }
        }
      });
  }

  /**
   * Add parents (Mother and/or Father)
   *
   * @param {string} motherName - Mother name
   * @param {string} fatherName - Father name
   * @param {string} [motherAvatar] - Mother avatar emoji (optional)
   * @param {string} [fatherAvatar] - Father avatar emoji (optional)
   * @returns {Object} {success: boolean, message?: string}
   */
  addParents(motherName, fatherName, motherAvatar = null, fatherAvatar = null) {
    const validation = this.validation.canAddParents();
    if (!validation.canAdd) {
      return { success: false, message: validation.message };
    }

    // At least one parent name is required
    if (!motherName?.trim() && !fatherName?.trim()) {
      return { success: false, message: 'At least one parent name is required' };
    }

    const remainingSlots = validation.remainingSlots;
    const graphInstance = this.getGraphInstance();
    if (!graphInstance) {
      return { success: false, message: 'Graph not initialized' };
    }

    // Add mother if name provided and slot available
    let motherId = null;
    if (motherName?.trim() && remainingSlots >= 1) {
      const mother = this.addNodeWithRelationship(
        ['YOU'],
        motherName.trim(),
        FAMILY_GROUPS.PARENT,
        GENDER.FEMALE,
        motherAvatar?.trim() || null
      );
      motherId = mother?.id || motherName.trim();
    }

    // Add father if name provided and slot available
    let fatherId = null;
    const fatherSlotAvailable = motherId ? remainingSlots >= 2 : remainingSlots >= 1;
    if (fatherName?.trim() && fatherSlotAvailable) {
      const father = this.addNodeWithRelationship(
        ['YOU'],
        fatherName.trim(),
        FAMILY_GROUPS.PARENT,
        GENDER.MALE,
        fatherAvatar?.trim() || null
      );
      fatherId = father?.id || fatherName.trim();
    } else if (fatherName?.trim() && !fatherSlotAvailable) {
      return {
        success: true,
        message: 'Only one parent slot available. Added only the mother.'
      };
    }

    // Connect parents to each other (they're partners/spouses)
    // This creates a triangle: Mother <-> Father, Mother -> YOU, Father -> YOU
    if (motherId && fatherId && this.graphManager.addLink) {
      // Use requestAnimationFrame to ensure nodes are fully added first
      requestAnimationFrame(() => {
        const linkAdded = this.graphManager.addLink(motherId, fatherId);
        if (linkAdded) {
          this.saveFamily(); // Save again after adding the link
        }
      });
    } else {
      this.saveFamily();
    }
    return { success: true };
  }

  /**
   * Add sibling
   *
   * @param {string} name - Sibling name
   * @param {string} gender - Gender (GENDER.MALE, GENDER.FEMALE, GENDER.OTHER)
   * @param {string} [avatar] - Avatar emoji (optional)
   * @returns {Object} {success: boolean, message?: string}
   */
  addSibling(name, gender, avatar = null) {
    if (!name?.trim()) {
      return { success: false, message: 'Sibling name is required' };
    }

    if (!gender) {
      return { success: false, message: 'Gender is required' };
    }

    const graphInstance = this.getGraphInstance();
    if (!graphInstance?.data) {
      return { success: false, message: 'Graph not initialized' };
    }

    // Find parents of 'YOU' - siblings should connect through shared parents
    const links = graphInstance.data.links;
    const parentIds = links
      .filter(link => {
        const sourceId = normalizeLinkId(link.source);
        const targetId = normalizeLinkId(link.target);
        return (sourceId === 'YOU' || targetId === 'YOU');
      })
      .map(link => {
        const sourceId = normalizeLinkId(link.source);
        const targetId = normalizeLinkId(link.target);
        return sourceId === 'YOU' ? targetId : sourceId;
      })
      .map(parentId => {
        const parent = graphInstance.data.nodes.find(n => n.id === parentId);
        return parent && parent.group === FAMILY_GROUPS.PARENT ? parentId : null;
      })
      .filter(id => id !== null);

    // Find all existing siblings (including YOU)
    const existingSiblings = graphInstance.data.nodes.filter(
      n => n.group === FAMILY_GROUPS.SIBLING || n.id === 'YOU'
    ).map(n => n.id);

    // Combine: connect to parents (if any) AND to all existing siblings
    const connectToIds = [];

    // Add parents if they exist
    if (parentIds.length > 0) {
      connectToIds.push(...parentIds);
    } else {
      // If no parents, connect to YOU as fallback
      connectToIds.push('YOU');
    }

    // Add all existing siblings (will include YOU if no parents)
    // This ensures the new sibling connects to all existing siblings
    existingSiblings.forEach(siblingId => {
      if (!connectToIds.includes(siblingId)) {
        connectToIds.push(siblingId);
      }
    });

    // Add the new sibling node - this will create links to parents AND all existing siblings
    const newSibling = this.addNodeWithRelationship(
      connectToIds,
      name.trim(),
      FAMILY_GROUPS.SIBLING,
      gender,
      avatar?.trim() || null
    );

    if (!newSibling) {
      return { success: false, message: 'Failed to add sibling' };
    }

    // Now ensure all existing siblings are also connected to the new sibling
    // (addNode created links FROM new sibling TO existing siblings, but we need bidirectional)
    // Actually, since links are undirected in D3, we're good - but let's be explicit
    const newSiblingId = newSibling.id || name.trim();

    // Connect all existing siblings to the new sibling (for explicit bidirectional links)
    // Note: addNode already created links to connectToIds, so links exist
    // But we'll add them explicitly to ensure they're there (addLink checks for duplicates)
    if (this.graphManager.addLink) {
      existingSiblings.forEach(siblingId => {
        if (siblingId !== newSiblingId) {
          // Use requestAnimationFrame to ensure node is fully added first
          requestAnimationFrame(() => {
            this.graphManager.addLink(newSiblingId, siblingId, true);
          });
        }
      });
    }

    this.saveFamily();
    return { success: true };
  }

  /**
   * Add grandparents
   *
   * @param {string} parentId - Parent node ID
   * @param {string} grandparent1Name - First grandparent name
   * @param {string} [grandparent2Name] - Second grandparent name (optional)
   * @returns {Object} {success: boolean, message?: string}
   */
  addGrandparents(parentId, grandmotherName, grandfatherName, grandmotherAvatar = null, grandfatherAvatar = null) {
    if (!this.graphManager?.hasNode || !this.graphManager.hasNode(parentId)) {
      return { success: false, message: 'Parent not found' };
    }

    const validation = this.validation.canAddGrandparents(parentId);
    if (!validation.canAdd) {
      return { success: false, message: validation.message };
    }

    // At least one grandparent name is required
    if (!grandmotherName?.trim() && !grandfatherName?.trim()) {
      return { success: false, message: 'At least one grandparent name is required' };
    }

    const remainingSlots = validation.remainingSlots;
    const graphInstance = this.getGraphInstance();
    if (!graphInstance) {
      return { success: false, message: 'Graph not initialized' };
    }

    // Add grandmother if name provided and slot available
    let grandmotherId = null;
    if (grandmotherName?.trim() && remainingSlots >= 1) {
      const grandmother = this.addNodeWithRelationship(
        [parentId],
        grandmotherName.trim(),
        FAMILY_GROUPS.GRANDPARENT,
        GENDER.FEMALE,
        grandmotherAvatar?.trim() || null
      );
      grandmotherId = grandmother?.id || grandmotherName.trim();
    }

    // Add grandfather if name provided and slot available
    let grandfatherId = null;
    const grandfatherSlotAvailable = grandmotherId ? remainingSlots >= 2 : remainingSlots >= 1;
    if (grandfatherName?.trim() && grandfatherSlotAvailable) {
      const grandfather = this.addNodeWithRelationship(
        [parentId],
        grandfatherName.trim(),
        FAMILY_GROUPS.GRANDPARENT,
        GENDER.MALE,
        grandfatherAvatar?.trim() || null
      );
      grandfatherId = grandfather?.id || grandfatherName.trim();
    } else if (grandfatherName?.trim() && !grandfatherSlotAvailable) {
      return {
        success: true,
        message: 'Only one grandparent slot available for this parent. Added only the grandmother.'
      };
    }

    // Connect grandparents to each other (they're partners/spouses)
    // This creates a triangle: Grandmother <-> Grandfather, Grandmother -> Parent, Grandfather -> Parent
    if (grandmotherId && grandfatherId && this.graphManager.addLink) {
      // Use requestAnimationFrame to ensure nodes are fully added first
      requestAnimationFrame(() => {
        const linkAdded = this.graphManager.addLink(grandmotherId, grandfatherId);
        if (linkAdded) {
          this.saveFamily(); // Save again after adding the link
        }
      });
    } else {
      this.saveFamily();
    }
    return { success: true };
  }

  /**
   * Add uncle/aunt
   *
   * @param {string} parentId - Parent node ID
   * @param {string} name - Uncle/aunt name
   * @param {string} gender - Gender (GENDER.MALE, GENDER.FEMALE, GENDER.OTHER)
   * @param {string} [avatar] - Avatar emoji (optional)
   * @returns {Object} {success: boolean, message?: string}
   */
  addUncleAunt(parentId, name, gender, avatar = null) {
    if (!this.graphManager?.hasNode || !this.graphManager.hasNode(parentId)) {
      return { success: false, message: 'Parent not found' };
    }

    if (!name?.trim()) {
      return { success: false, message: 'Uncle/aunt name is required' };
    }

    if (!gender) {
      return { success: false, message: 'Gender is required' };
    }

    const graphInstance = this.getGraphInstance();
    if (!graphInstance?.data) {
      return { success: false, message: 'Graph not initialized' };
    }

    // Find grandparents of the parent (they are also parents of the uncle/aunt)
    const links = graphInstance.data.links;
    const grandparentIds = links
      .filter(link => {
        const sourceId = normalizeLinkId(link.source);
        const targetId = normalizeLinkId(link.target);
        return targetId === parentId;
      })
      .map(link => {
        const sourceId = normalizeLinkId(link.source);
        return graphInstance.data.nodes.find(n => n.id === sourceId);
      })
      .filter(node => node && node.group === FAMILY_GROUPS.GRANDPARENT)
      .map(node => node.id);

    // Find ALL existing uncles/aunts who share the same grandparents (they are siblings)
    // These are the parent's siblings
    const existingUnclesAunts = [];
    if (grandparentIds.length > 0) {
      // Find all nodes that are children of these grandparents
      const childrenOfGrandparents = links
        .filter(link => {
          const sourceId = normalizeLinkId(link.source);
          return grandparentIds.includes(sourceId);
        })
        .map(link => {
          const targetId = normalizeLinkId(link.target);
          return graphInstance.data.nodes.find(n => n.id === targetId);
        })
        .filter(node => node && (node.group === FAMILY_GROUPS.PARENT || node.group === FAMILY_GROUPS.UNCLE_AUNT))
        .map(node => node.id);

      existingUnclesAunts.push(...childrenOfGrandparents);
    } else {
      // If no grandparents, just connect to the parent as a sibling
      existingUnclesAunts.push(parentId);
    }

    // Remove duplicates
    const uniqueUnclesAunts = [...new Set(existingUnclesAunts)];

    // Combine: connect to grandparents (if any) AND to all existing uncles/aunts (including the parent)
    const connectToIds = [...grandparentIds, ...uniqueUnclesAunts];

    // Add the uncle/aunt node - connected to grandparents and all siblings
    const newUncleAunt = this.addNodeWithRelationship(
      connectToIds,
      name.trim(),
      FAMILY_GROUPS.UNCLE_AUNT,
      gender,
      avatar?.trim() || null
    );

    if (!newUncleAunt) {
      return { success: false, message: 'Failed to add uncle/aunt' };
    }

    // Now ensure all existing uncles/aunts are connected to the new uncle/aunt
    // (for explicit bidirectional links, similar to addSibling)
    const newUncleAuntId = newUncleAunt.id || name.trim();

    if (this.graphManager.addLink) {
      uniqueUnclesAunts.forEach(siblingId => {
        if (siblingId !== newUncleAuntId) {
          // Use requestAnimationFrame to ensure node is fully added first
          requestAnimationFrame(() => {
            this.graphManager.addLink(newUncleAuntId, siblingId, true);
          });
        }
      });
    }

    this.saveFamily();
    return { success: true };
  }

  /**
   * Add cousin
   *
   * @param {string} uncleAuntId - Uncle/aunt node ID
   * @param {string} name - Cousin name
   * @param {string} gender - Gender (GENDER.MALE, GENDER.FEMALE, GENDER.OTHER)
   * @param {string} [avatar] - Avatar emoji (optional)
   * @returns {Object} {success: boolean, message?: string}
   */
  addCousin(uncleAuntId, name, gender, avatar = null) {
    if (!this.graphManager?.hasNode || !this.graphManager.hasNode(uncleAuntId)) {
      return { success: false, message: 'Uncle/aunt not found' };
    }

    if (!gender) {
      return { success: false, message: 'Gender is required' };
    }

    if (!name?.trim()) {
      return { success: false, message: 'Cousin name is required' };
    }

    const graphInstance = this.getGraphInstance();
    if (!graphInstance?.data) {
      return { success: false, message: 'Graph not initialized' };
    }

    // Find partner of the uncle/aunt (if any) - cousins should connect to both parents
    // Use partnerOf property to get the correct partner
    const partner = graphInstance.data.nodes.find(node =>
      node.group === FAMILY_GROUPS.PARTNER && node.partnerOf === uncleAuntId
    );

    // Find all existing cousins who are children of this uncle/aunt (siblings of the new cousin)
    const links = graphInstance.data.links;
    const existingCousins = graphInstance.data.nodes.filter(node => {
      if (node.group !== FAMILY_GROUPS.COUSIN) return false;

      // Check if this cousin is connected to the uncle/aunt or their partner
      const isConnectedToUncleAunt = links.some(link => {
        const sourceId = normalizeLinkId(link.source);
        const targetId = normalizeLinkId(link.target);
        return (sourceId === node.id && targetId === uncleAuntId) ||
               (targetId === node.id && sourceId === uncleAuntId);
      });

      if (partner) {
        const isConnectedToPartner = links.some(link => {
          const sourceId = normalizeLinkId(link.source);
          const targetId = normalizeLinkId(link.target);
          return (sourceId === node.id && targetId === partner.id) ||
                 (targetId === node.id && sourceId === partner.id);
        });
        return isConnectedToUncleAunt || isConnectedToPartner;
      }

      return isConnectedToUncleAunt;
    }).map(n => n.id);

    // Connect to uncle/aunt AND partner (if partner exists) AND all existing cousins
    const connectToIds = [uncleAuntId];
    if (partner) {
      connectToIds.push(partner.id);
    }

    // Add all existing cousin siblings
    existingCousins.forEach(cousinId => {
      if (!connectToIds.includes(cousinId)) {
        connectToIds.push(cousinId);
      }
    });

    const newCousin = this.addNodeWithRelationship(
      connectToIds,
      name.trim(),
      FAMILY_GROUPS.COUSIN,
      gender,
      avatar?.trim() || null
    );

    if (!newCousin) {
      return { success: false, message: 'Failed to add cousin' };
    }

    // Connect all existing cousins to the new cousin (for explicit bidirectional links)
    const newCousinId = newCousin.id || name.trim();
    if (this.graphManager.addLink) {
      existingCousins.forEach(cousinId => {
        if (cousinId !== newCousinId) {
          requestAnimationFrame(() => {
            this.graphManager.addLink(newCousinId, cousinId, true);
          });
        }
      });
    }

    this.saveFamily();
    return { success: true };
  }

  /**
   * Add child
   *
   * @param {string} parentId - Parent node ID
   * @param {string} name - Child name
   * @param {string} gender - Gender (GENDER.MALE, GENDER.FEMALE, GENDER.OTHER)
   * @param {string} [avatar] - Avatar emoji (optional)
   * @returns {Object} {success: boolean, message?: string}
   */
  addChild(parentId, name, gender, avatar = null) {
    if (!this.graphManager?.hasNode || !this.graphManager.hasNode(parentId)) {
      return { success: false, message: 'Parent not found' };
    }

    if (!name?.trim()) {
      return { success: false, message: 'Child name is required' };
    }

    if (!gender) {
      return { success: false, message: 'Gender is required' };
    }

    // Get parent node to determine child group
    const graphInstance = this.getGraphInstance();
    if (!graphInstance?.data) {
      return { success: false, message: 'Graph not initialized' };
    }

    const parent = graphInstance.data.nodes.find(n => n.id === parentId);
    if (!parent) {
      return { success: false, message: 'Parent not found' };
    }

    let childGroup = FAMILY_GROUPS.CHILD;

    // Determine child group based on parent
    if (parent.group === FAMILY_GROUPS.YOU || parent.group === FAMILY_GROUPS.PARTNER) {
      childGroup = FAMILY_GROUPS.CHILD;
    } else if (parent.group === FAMILY_GROUPS.SIBLING) {
      childGroup = FAMILY_GROUPS.NIECE_NEPHEW;
    } else {
      childGroup = FAMILY_GROUPS.CHILD;
    }

    // Find partner of the parent (if any) - children should connect to both parents
    // Use partnerOf property to avoid finding parent's parent's partner
    const partner = graphInstance.data.nodes.find(node =>
      node.group === FAMILY_GROUPS.PARTNER && node.partnerOf === parentId
    );

    // Find all existing children of this parent (siblings of the new child)
    const links = graphInstance.data.links;
    const existingChildren = graphInstance.data.nodes.filter(node => {
      if (node.group !== childGroup) return false;

      // Check if this child is connected to the parent or their partner
      const isConnectedToParent = links.some(link => {
        const sourceId = normalizeLinkId(link.source);
        const targetId = normalizeLinkId(link.target);
        return (sourceId === node.id && targetId === parentId) ||
               (targetId === node.id && sourceId === parentId);
      });

      if (partner) {
        const isConnectedToPartner = links.some(link => {
          const sourceId = normalizeLinkId(link.source);
          const targetId = normalizeLinkId(link.target);
          return (sourceId === node.id && targetId === partner.id) ||
                 (targetId === node.id && sourceId === partner.id);
        });
        return isConnectedToParent || isConnectedToPartner;
      }

      return isConnectedToParent;
    }).map(n => n.id);

    // Connect to parent AND partner (if partner exists) AND all existing children
    const connectToIds = [parentId];
    if (partner) {
      connectToIds.push(partner.id);
    }

    // Add all existing child siblings
    existingChildren.forEach(childId => {
      if (!connectToIds.includes(childId)) {
        connectToIds.push(childId);
      }
    });

    const newChild = this.addNodeWithRelationship(
      connectToIds,
      name.trim(),
      childGroup,
      gender,
      avatar?.trim() || null
    );

    if (!newChild) {
      return { success: false, message: 'Failed to add child' };
    }

    // Connect all existing children to the new child (for explicit bidirectional links)
    const newChildId = newChild.id || name.trim();
    if (this.graphManager.addLink) {
      existingChildren.forEach(childId => {
        if (childId !== newChildId) {
          requestAnimationFrame(() => {
            this.graphManager.addLink(newChildId, childId, true);
          });
        }
      });
    }

    this.saveFamily();
    return { success: true };
  }

  /**
   * Add niece/nephew
   *
   * @param {string} siblingId - Sibling node ID
   * @param {string} name - Niece/nephew name
   * @param {string} gender - Gender (GENDER.MALE, GENDER.FEMALE, GENDER.OTHER)
   * @param {string} [avatar] - Avatar emoji (optional)
   * @returns {Object} {success: boolean, message?: string}
   */
  addNieceNephew(siblingId, name, gender, avatar = null) {
    if (!this.graphManager?.hasNode || !this.graphManager.hasNode(siblingId)) {
      return { success: false, message: 'Sibling not found' };
    }

    if (!name?.trim()) {
      return { success: false, message: 'Niece/nephew name is required' };
    }

    if (!gender) {
      return { success: false, message: 'Gender is required' };
    }

    const graphInstance = this.getGraphInstance();
    if (!graphInstance?.data) {
      return { success: false, message: 'Graph not initialized' };
    }

    // Find partner of the sibling (if any) - nieces/nephews should connect to both parents
    // Use partnerOf property to get the correct partner
    const partner = graphInstance.data.nodes.find(node =>
      node.group === FAMILY_GROUPS.PARTNER && node.partnerOf === siblingId
    );

    // Find all existing nieces/nephews who are children of this sibling (siblings of the new niece/nephew)
    const links = graphInstance.data.links;
    const existingNiecesNephews = graphInstance.data.nodes.filter(node => {
      if (node.group !== FAMILY_GROUPS.NIECE_NEPHEW) return false;

      // Check if this niece/nephew is connected to the sibling or their partner
      const isConnectedToSibling = links.some(link => {
        const sourceId = normalizeLinkId(link.source);
        const targetId = normalizeLinkId(link.target);
        return (sourceId === node.id && targetId === siblingId) ||
               (targetId === node.id && sourceId === siblingId);
      });

      if (partner) {
        const isConnectedToPartner = links.some(link => {
          const sourceId = normalizeLinkId(link.source);
          const targetId = normalizeLinkId(link.target);
          return (sourceId === node.id && targetId === partner.id) ||
                 (targetId === node.id && sourceId === partner.id);
        });
        return isConnectedToSibling || isConnectedToPartner;
      }

      return isConnectedToSibling;
    }).map(n => n.id);

    // Connect to sibling AND partner (if partner exists) AND all existing nieces/nephews
    const connectToIds = [siblingId];
    if (partner) {
      connectToIds.push(partner.id);
    }

    // Add all existing niece/nephew siblings
    existingNiecesNephews.forEach(nieceNephewId => {
      if (!connectToIds.includes(nieceNephewId)) {
        connectToIds.push(nieceNephewId);
      }
    });

    const newNieceNephew = this.addNodeWithRelationship(
      connectToIds,
      name.trim(),
      FAMILY_GROUPS.NIECE_NEPHEW,
      gender,
      avatar?.trim() || null
    );

    if (!newNieceNephew) {
      return { success: false, message: 'Failed to add niece/nephew' };
    }

    // Connect all existing nieces/nephews to the new one (for explicit bidirectional links)
    const newNieceNephewId = newNieceNephew.id || name.trim();
    if (this.graphManager.addLink) {
      existingNiecesNephews.forEach(nieceNephewId => {
        if (nieceNephewId !== newNieceNephewId) {
          requestAnimationFrame(() => {
            this.graphManager.addLink(newNieceNephewId, nieceNephewId, true);
          });
        }
      });
    }

    this.saveFamily();
    return { success: true };
  }

  /**
   * Add partner/spouse
   *
   * @param {string} personId - Person node ID
   * @param {string} partnerName - Partner name
   * @param {string} gender - Gender (GENDER.MALE, GENDER.FEMALE, GENDER.OTHER)
   * @param {string} [avatar] - Avatar emoji (optional)
   * @returns {Object} {success: boolean, message?: string}
   */
  addPartner(personId, partnerName, gender, avatar = null) {
    if (!this.graphManager?.hasNode || !this.graphManager.hasNode(personId)) {
      return { success: false, message: 'Person not found' };
    }

    if (!partnerName?.trim()) {
      return { success: false, message: 'Partner name is required' };
    }

    if (!gender) {
      return { success: false, message: 'Gender is required' };
    }

    // Check if person already has a partner
    if (this.validation.hasPartner(personId)) {
      return { success: false, message: `${personId} already has a partner!` };
    }

    // Determine contextual relationship label based on who the partner belongs to
    const graphInstance = this.getGraphInstance();
    let customRelationship = null;
    if (graphInstance?.data) {
      const person = graphInstance.data.nodes.find(n => n.id === personId);
      if (person) {
        const personRelationship = person.relationship || getRelationshipLabel(person.group);
        // Create contextual relationship label
        if (personRelationship === 'You') {
          customRelationship = 'Your Partner/Spouse';
        } else {
          customRelationship = `${personRelationship}'s Partner`;
        }
      }
    }

    // Add partner node
    const partnerNode = this.addNodeWithRelationship(
      [personId],
      partnerName.trim(),
      FAMILY_GROUPS.PARTNER,
      gender,
      avatar?.trim() || null,
      customRelationship
    );

    // Set partnerOf property - handle both sync and async cases
    const setPartnerOf = (node) => {
      this._setNodeProperty(node, 'partnerOf', personId, graphInstance);

      // Use requestAnimationFrame to ensure property is fully propagated before saving
      requestAnimationFrame(() => {
        // Double-check the property is set on the node in the data array
        if (graphInstance?.data) {
          const nodeInData = graphInstance.data.nodes.find(n => n.id === node.id);
          if (nodeInData) {
            nodeInData.partnerOf = personId;
          }
        }
        // Save after ensuring property is set
        this.saveFamily();
      });
    };

    // Check if addNodeWithRelationship returned a Promise
    if (partnerNode && typeof partnerNode.then === 'function') {
      // Async case - wait for node to be added
      partnerNode.then(node => {
        setPartnerOf(node);
      });
    } else {
      // Sync case - set immediately
      setPartnerOf(partnerNode);
    }

    return { success: true };
  }
}

