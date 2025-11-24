/**
 * Permission Manager (New 2025)
 * Manages dashboard and block-level permissions
 */

import {
  DashboardPermission,
  BlockPermission,
  PermissionEntity,
  PermissionLevel,
  PermissionScope,
  SharingMode,
} from '../types';

/**
 * Dashboard Permission Builder
 */
export class DashboardPermissionBuilder {
  private permission: Partial<DashboardPermission> = {
    scope: PermissionScope.DASHBOARD,
    entities: [],
  };

  /**
   * Set sharing mode
   */
  sharingMode(mode: SharingMode): this {
    this.permission.sharingMode = mode;
    return this;
  }

  /**
   * Make dashboard private
   */
  private(): this {
    return this.sharingMode(SharingMode.PRIVATE);
  }

  /**
   * Make dashboard public
   */
  public(): this {
    return this.sharingMode(SharingMode.PUBLIC);
  }

  /**
   * Share via link
   */
  shareViaLink(password?: string): this {
    this.permission.sharingMode = SharingMode.LINK;
    this.permission.publicLinkEnabled = true;
    if (password) {
      this.permission.publicLinkPassword = password;
    }
    return this;
  }

  /**
   * Share with team
   */
  shareWithTeam(): this {
    return this.sharingMode(SharingMode.TEAM);
  }

  /**
   * Share with specific users
   */
  shareWithUsers(): this {
    return this.sharingMode(SharingMode.SPECIFIC_USERS);
  }

  /**
   * Add permission entity
   */
  addEntity(entity: PermissionEntity): this {
    if (!this.permission.entities) {
      this.permission.entities = [];
    }
    this.permission.entities.push(entity);
    return this;
  }

  /**
   * Add user with permission level
   */
  addUser(userId: string, level: PermissionLevel): this {
    return this.addEntity({
      type: 'user',
      id: userId,
      level,
    });
  }

  /**
   * Add team with permission level
   */
  addTeam(teamId: string, level: PermissionLevel): this {
    return this.addEntity({
      type: 'team',
      id: teamId,
      level,
    });
  }

  /**
   * Add department with permission level
   */
  addDepartment(deptId: string, level: PermissionLevel): this {
    return this.addEntity({
      type: 'department',
      id: deptId,
      level,
    });
  }

  /**
   * Allow comments
   */
  allowComments(allow: boolean): this {
    this.permission.allowComments = allow;
    return this;
  }

  /**
   * Allow export
   */
  allowExport(allow: boolean): this {
    this.permission.allowExport = allow;
    return this;
  }

  /**
   * Allow sharing
   */
  allowShare(allow: boolean): this {
    this.permission.allowShare = allow;
    return this;
  }

  /**
   * Enable public link
   */
  enablePublicLink(enabled: boolean, password?: string): this {
    this.permission.publicLinkEnabled = enabled;
    if (password) {
      this.permission.publicLinkPassword = password;
    }
    return this;
  }

  /**
   * Set expiration date
   */
  expiresAt(date: Date): this {
    this.permission.expiresAt = date;
    return this;
  }

  /**
   * Set expiration in days from now
   */
  expiresInDays(days: number): this {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    return this.expiresAt(expirationDate);
  }

  /**
   * Build the permission config
   */
  build(): DashboardPermission {
    if (!this.permission.sharingMode) {
      throw new Error('Sharing mode is required');
    }

    return this.permission as DashboardPermission;
  }
}

/**
 * Block Permission Builder
 */
export class BlockPermissionBuilder {
  private permission: Partial<BlockPermission> = {
    entities: [],
  };

  /**
   * Set block ID
   */
  blockId(id: string): this {
    this.permission.blockId = id;
    return this;
  }

  /**
   * Add permission entity
   */
  addEntity(entity: PermissionEntity): this {
    if (!this.permission.entities) {
      this.permission.entities = [];
    }
    this.permission.entities.push(entity);
    return this;
  }

  /**
   * Add user with permission level
   */
  addUser(userId: string, level: PermissionLevel): this {
    return this.addEntity({
      type: 'user',
      id: userId,
      level,
    });
  }

  /**
   * Add team with permission level
   */
  addTeam(teamId: string, level: PermissionLevel): this {
    return this.addEntity({
      type: 'team',
      id: teamId,
      level,
    });
  }

  /**
   * Add department with permission level
   */
  addDepartment(deptId: string, level: PermissionLevel): this {
    return this.addEntity({
      type: 'department',
      id: deptId,
      level,
    });
  }

  /**
   * Inherit permissions from dashboard
   */
  inheritFromDashboard(inherit: boolean): this {
    this.permission.inheritFromDashboard = inherit;
    return this;
  }

  /**
   * Build the permission config
   */
  build(): BlockPermission {
    if (!this.permission.blockId) {
      throw new Error('Block ID is required');
    }

    return this.permission as BlockPermission;
  }
}

/**
 * Permission Helper Functions
 */
export class PermissionHelper {
  /**
   * Check if user has required permission level
   */
  static hasPermission(
    userLevel: PermissionLevel,
    requiredLevel: PermissionLevel
  ): boolean {
    const levels = [
      PermissionLevel.NONE,
      PermissionLevel.COMMENT,
      PermissionLevel.VIEW,
      PermissionLevel.EDIT,
      PermissionLevel.ADMIN,
      PermissionLevel.OWNER,
    ];

    const userIndex = levels.indexOf(userLevel);
    const requiredIndex = levels.indexOf(requiredLevel);

    return userIndex >= requiredIndex;
  }

  /**
   * Get highest permission level from multiple entities
   */
  static getHighestLevel(levels: PermissionLevel[]): PermissionLevel {
    const levelOrder = [
      PermissionLevel.OWNER,
      PermissionLevel.ADMIN,
      PermissionLevel.EDIT,
      PermissionLevel.VIEW,
      PermissionLevel.COMMENT,
      PermissionLevel.NONE,
    ];

    for (const level of levelOrder) {
      if (levels.includes(level)) {
        return level;
      }
    }

    return PermissionLevel.NONE;
  }

  /**
   * Check if permission has expired
   */
  static isExpired(permission: DashboardPermission): boolean {
    if (!permission.expiresAt) {
      return false;
    }

    return new Date() > permission.expiresAt;
  }

  /**
   * Validate permission configuration
   */
  static validate(permission: DashboardPermission): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!permission.sharingMode) {
      errors.push('Sharing mode is required');
    }

    if (
      permission.sharingMode === SharingMode.SPECIFIC_USERS &&
      (!permission.entities || permission.entities.length === 0)
    ) {
      errors.push('At least one entity is required for specific user sharing');
    }

    if (permission.publicLinkEnabled && permission.publicLinkPassword) {
      if (permission.publicLinkPassword.length < 6) {
        errors.push('Public link password must be at least 6 characters');
      }
    }

    if (permission.expiresAt && permission.expiresAt < new Date()) {
      errors.push('Expiration date cannot be in the past');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
