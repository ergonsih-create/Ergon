/**
 * @license
 * GRAM-DISHA — MySQL Database Connectivity & CRUD Utility Module
 * Team ERGON — Smart India Hackathon 2026
 * 
 * High-performance, connection-pooled client using mysql2/promise.
 * Connects securely to a MySQL instance using environment variables.
 */

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

// Mappings for table entities to match /database/schema.sql
export interface DBUser {
  user_id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  role?: string;
  social_category?: string;
  gender?: string;
  annual_income?: number;
  lgd_code?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DBEnterpriseProject {
  project_id: string;
  user_id: string;
  business_title: string;
  activity_type: string;
  target_capacity?: string;
  estimated_project_cost: number;
  promoter_capital: number;
  lgd_code?: string;
  created_at?: string;
  updated_at?: string;
}

// Private connection pool instance
let pool: mysql.Pool | null = null;

/**
 * Initializes the database connection pool using environment variables.
 * Leverages safe defaults for zero-config container environments.
 */
export function getDbPool(): mysql.Pool {
  if (!pool) {
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = Number(process.env.DB_PORT || 3306);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'gram_disha_db';

    console.log(`[MySQL] Creating connection pool for ${user}@${host}:${port}/${database}...`);
    
    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000
    });
  }
  return pool;
}

/**
 * Validates connection capability and runs quick healthcheck.
 */
export async function testDbConnection(): Promise<boolean> {
  try {
    const dbPool = getDbPool();
    const connection = await dbPool.getConnection();
    console.log('[MySQL] Connection healthcheck passed successfully.');
    connection.release();
    return true;
  } catch (err: any) {
    console.error('[MySQL] Database connection failure:', err.message || err);
    return false;
  }
}

// ==========================================
// 1. USER PROFILE CRUD OPERATIONS
// ==========================================

export const UserProfileDb = {
  /**
   * Create a new user profile.
   */
  async create(user: DBUser): Promise<boolean> {
    const dbPool = getDbPool();
    const query = `
      INSERT INTO users (user_id, email, full_name, phone_number, role, social_category, gender, annual_income, lgd_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      user.user_id,
      user.email,
      user.full_name,
      user.phone_number || null,
      user.role || 'ENTREPRENEUR',
      user.social_category || 'GENERAL',
      user.gender || 'MALE',
      user.annual_income || 0.00,
      user.lgd_code || null
    ];

    try {
      await dbPool.execute(query, params);
      return true;
    } catch (err: any) {
      console.error(`[MySQL] Failed to create user ${user.user_id}:`, err);
      throw err;
    }
  },

  /**
   * Retrieve a user profile by ID.
   */
  async getById(userId: string): Promise<DBUser | null> {
    const dbPool = getDbPool();
    const query = `SELECT * FROM users WHERE user_id = ? LIMIT 1`;
    try {
      const [rows] = await dbPool.execute<mysql.RowDataPacket[]>(query, [userId]);
      if (rows.length === 0) return null;
      return rows[0] as DBUser;
    } catch (err: any) {
      console.error(`[MySQL] Failed to fetch user ${userId}:`, err);
      throw err;
    }
  },

  /**
   * Retrieve a user profile by Email.
   */
  async getByEmail(email: string): Promise<DBUser | null> {
    const dbPool = getDbPool();
    const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
    try {
      const [rows] = await dbPool.execute<mysql.RowDataPacket[]>(query, [email.trim().toLowerCase()]);
      if (rows.length === 0) return null;
      return rows[0] as DBUser;
    } catch (err: any) {
      console.error(`[MySQL] Failed to fetch user by email ${email}:`, err);
      throw err;
    }
  },

  /**
   * Update an existing user profile.
   */
  async update(userId: string, updates: Partial<Omit<DBUser, 'user_id' | 'email' | 'created_at'>>): Promise<boolean> {
    const dbPool = getDbPool();
    
    // Dynamically build SET statement to avoid overwriting un-provided fields
    const fields = Object.keys(updates);
    if (fields.length === 0) return false;

    const setClauses = fields.map(field => `\${field} = ?`).join(', ');
    const params = [...Object.values(updates), userId];

    const query = `UPDATE users SET \${setClauses} WHERE user_id = ?`;

    try {
      const [result] = await dbPool.execute<mysql.ResultSetHeader>(query, params);
      return result.affectedRows > 0;
    } catch (err: any) {
      console.error(`[MySQL] Failed to update user ${userId}:`, err);
      throw err;
    }
  },

  /**
   * Delete a user profile and trigger cascades.
   */
  async delete(userId: string): Promise<boolean> {
    const dbPool = getDbPool();
    const query = `DELETE FROM users WHERE user_id = ?`;
    try {
      const [result] = await dbPool.execute<mysql.ResultSetHeader>(query, [userId]);
      return result.affectedRows > 0;
    } catch (err: any) {
      console.error(`[MySQL] Failed to delete user ${userId}:`, err);
      throw err;
    }
  }
};

// ==========================================
// 2. ENTERPRISE PROJECT / BUSINESS DATA CRUD
// ==========================================

export const EnterpriseProjectDb = {
  /**
   * Create a new enterprise project profiles.
   */
  async create(project: DBEnterpriseProject): Promise<boolean> {
    const dbPool = getDbPool();
    const query = `
      INSERT INTO enterprise_projects (project_id, user_id, business_title, activity_type, target_capacity, estimated_project_cost, promoter_capital, lgd_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [
      project.project_id,
      project.user_id,
      project.business_title,
      project.activity_type,
      project.target_capacity || null,
      project.estimated_project_cost,
      project.promoter_capital,
      project.lgd_code || null
    ];

    try {
      await dbPool.execute(query, params);
      return true;
    } catch (err: any) {
      console.error(`[MySQL] Failed to create enterprise project ${project.project_id}:`, err);
      throw err;
    }
  },

  /**
   * Retrieve an enterprise profile by project ID.
   */
  async getById(projectId: string): Promise<DBEnterpriseProject | null> {
    const dbPool = getDbPool();
    const query = `SELECT * FROM enterprise_projects WHERE project_id = ? LIMIT 1`;
    try {
      const [rows] = await dbPool.execute<mysql.RowDataPacket[]>(query, [projectId]);
      if (rows.length === 0) return null;
      return rows[0] as DBEnterpriseProject;
    } catch (err: any) {
      console.error(`[MySQL] Failed to fetch project ${projectId}:`, err);
      throw err;
    }
  },

  /**
   * Retrieve all enterprise profiles for a specific owner/user.
   */
  async getByUserId(userId: string): Promise<DBEnterpriseProject[]> {
    const dbPool = getDbPool();
    const query = `SELECT * FROM enterprise_projects WHERE user_id = ? ORDER BY created_at DESC`;
    try {
      const [rows] = await dbPool.execute<mysql.RowDataPacket[]>(query, [userId]);
      return rows as DBEnterpriseProject[];
    } catch (err: any) {
      console.error(`[MySQL] Failed to fetch projects for user ${userId}:`, err);
      throw err;
    }
  },

  /**
   * Update an enterprise profile.
   */
  async update(projectId: string, updates: Partial<Omit<DBEnterpriseProject, 'project_id' | 'user_id' | 'created_at'>>): Promise<boolean> {
    const dbPool = getDbPool();
    
    const fields = Object.keys(updates);
    if (fields.length === 0) return false;

    const setClauses = fields.map(field => `\${field} = ?`).join(', ');
    const params = [...Object.values(updates), projectId];

    const query = `UPDATE enterprise_projects SET \${setClauses} WHERE project_id = ?`;

    try {
      const [result] = await dbPool.execute<mysql.ResultSetHeader>(query, params);
      return result.affectedRows > 0;
    } catch (err: any) {
      console.error(`[MySQL] Failed to update project ${projectId}:`, err);
      throw err;
    }
  },

  /**
   * Delete an enterprise profile.
   */
  async delete(projectId: string): Promise<boolean> {
    const dbPool = getDbPool();
    const query = `DELETE FROM enterprise_projects WHERE project_id = ?`;
    try {
      const [result] = await dbPool.execute<mysql.ResultSetHeader>(query, [projectId]);
      return result.affectedRows > 0;
    } catch (err: any) {
      console.error(`[MySQL] Failed to delete project ${projectId}:`, err);
      throw err;
    }
  }
};
