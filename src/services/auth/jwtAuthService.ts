/**
 * @license
 * GRAM-DISHA — JWT Authentication & Session Token Service
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Cryptographically simulated RS256 JWT Token issuer, decoder, and session validator
 * with LGD administrative claims and Truth-First profile verification.
 */

import { UserProfile, UserRole, LocationContext } from '../../types';

export interface JWTSessionPayload {
  sub: string;             // Unique User ID
  email: string;           // Google Account Email
  name: string;            // Full Name
  picture?: string;        // Avatar URL
  role: UserRole;          // Platform RBAC Role
  profileStatus: 'EXISTING_USER' | 'NEW_USER';
  iss: string;             // "https://auth.gram-disha.ergon.gov.in"
  aud: string;             // "gram-disha-sih-2026"
  iat: number;             // Issued At (Epoch seconds)
  exp: number;             // Expires At (Epoch seconds)
  jti: string;             // JWT Unique ID
  lgdScope: {
    state: string;
    district: string;
    block?: string;
    verified: boolean;
  };
}

export interface DecodedJWT {
  rawToken: string;
  header: {
    alg: 'RS256';
    typ: 'JWT';
    kid: string;
  };
  payload: JWTSessionPayload;
  signature: string;
  isValid: boolean;
  issuedAtFormatted: string;
  expiresAtFormatted: string;
}

const TOKEN_STORAGE_KEY = 'gram_disha_jwt_token';
const USER_STORAGE_KEY = 'gram_disha_user_session';
const PROFILES_DB_KEY = 'gram_disha_registered_profiles';

// Pre-seeded Demo Profiles
export const SEED_EXISTING_USER: UserProfile = {
  id: 'usr_rajesh_ergon_01',
  email: 'rajesh.verma@gmail.com',
  fullName: 'Rajesh Kumar Verma',
  role: 'ENTREPRENEUR',
  location: {
    state: 'Maharashtra',
    district: 'Yavatmal',
    block: 'Pusad',
    gramPanchayat: 'Shendurjana',
    villageOrLocality: 'Shendurjana Khurd',
    pincode: '445204',
    isRural: true,
    opportunityRadiusKm: 10,
    coordinates: {
      latitude: 19.9048,
      longitude: 77.5684
    }
  },
  demographics: {
    category: 'OBC',
    gender: 'MALE',
    ageGroup: '26-35',
    educationLevel: 'HIGHER_SECONDARY',
    occupation: 'Agro-Entrepreneur & Pulse Processor',
    priorExperienceYears: 4,
    annualHouseholdIncome: 220000,
    householdMembersCount: 5,
  },
  createdAt: '2026-01-15T10:00:00.000Z',
  updatedAt: '2026-03-01T12:00:00.000Z',
};

export const SEED_NEW_USER_TEMPLATE: Partial<UserProfile> = {
  id: 'usr_new_entrepreneur',
  email: 'priya.sundaram@gmail.com',
  fullName: 'Priya Sundaram',
  role: 'ENTREPRENEUR',
  demographics: {
    category: 'WOMEN',
    gender: 'FEMALE',
    ageGroup: '26-35',
    educationLevel: 'GRADUATE',
    occupation: 'Prospective Micro-Enterprise Founder',
    priorExperienceYears: 2,
    annualHouseholdIncome: 180000,
    householdMembersCount: 4,
  }
};

/**
 * Base64Url encoder/decoder helper
 */
function base64UrlEncode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(escape(atob(base64)));
}

/**
 * Pseudo-crypto signature generator for demonstration
 */
function generateSignature(headerB64: string, payloadB64: string): string {
  const secretKey = 'SIH_2026_TEAM_ERGON_GRAM_DISHA_RSA256_PRIVATE_KEY_ROOT';
  let hash = 0;
  const input = `${headerB64}.${payloadB64}.${secretKey}`;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0') + 'b4f8c92ae4715f013d8e9c20a45e7f61';
  return base64UrlEncode(hex);
}

export class JWTAuthService {
  /**
   * Generates a signed JWT for a given profile
   */
  static generateJWT(
    email: string,
    name: string,
    profileStatus: 'EXISTING_USER' | 'NEW_USER',
    role: UserRole = 'ENTREPRENEUR',
    location?: LocationContext
  ): string {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 86400 * 7; // 7 days validity

    const header = {
      alg: 'RS256' as const,
      typ: 'JWT' as const,
      kid: 'gram-disha-auth-key-2026-v1'
    };

    const payload: JWTSessionPayload = {
      sub: `usr_${Math.abs(email.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0)).toString(16)}`,
      email,
      name,
      role,
      profileStatus,
      iss: 'https://auth.gram-disha.ergon.gov.in',
      aud: 'gram-disha-sih-2026',
      iat: now,
      exp,
      jti: `jti_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      lgdScope: {
        state: location?.state || (profileStatus === 'EXISTING_USER' ? 'Maharashtra' : 'UNKNOWN'),
        district: location?.district || (profileStatus === 'EXISTING_USER' ? 'Yavatmal' : 'UNKNOWN'),
        block: location?.block,
        verified: profileStatus === 'EXISTING_USER'
      }
    };

    const headerB64 = base64UrlEncode(JSON.stringify(header));
    const payloadB64 = base64UrlEncode(JSON.stringify(payload));
    const signature = generateSignature(headerB64, payloadB64);

    return `${headerB64}.${payloadB64}.${signature}`;
  }

  /**
   * Decodes and validates a raw JWT token string
   */
  static decodeToken(token: string): DecodedJWT | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload: JWTSessionPayload = JSON.parse(base64UrlDecode(parts[1]));
      const signature = parts[2];

      const expectedSig = generateSignature(parts[0], parts[1]);
      const now = Math.floor(Date.now() / 1000);
      const isExpired = payload.exp < now;
      const isValid = signature === expectedSig && !isExpired;

      return {
        rawToken: token,
        header,
        payload,
        signature,
        isValid,
        issuedAtFormatted: new Date(payload.iat * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        expiresAtFormatted: new Date(payload.exp * 1000).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      };
    } catch (e) {
      console.error('Failed to decode JWT:', e);
      return null;
    }
  }

  /**
   * Gets current stored JWT token from localStorage
   */
  static getStoredToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  /**
   * Sets token and persists in localStorage
   */
  static setStoredToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  /**
   * Clears token and session
   */
  static clearSession(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }

  /**
   * Checks if a profile exists in the registered database or localStorage
   */
  static checkProfileStatus(email: string): { exists: boolean; profile: UserProfile | null } {
    try {
      // 1. Check custom registered database
      const dbRaw = localStorage.getItem(PROFILES_DB_KEY);
      if (dbRaw) {
        const db: Record<string, UserProfile> = JSON.parse(dbRaw);
        if (db[email]) {
          return { exists: true, profile: db[email] };
        }
      }

      // 2. Check hardcoded existing demo users
      if (email.toLowerCase() === SEED_EXISTING_USER.email.toLowerCase() || email.toLowerCase() === 'ergonsih@gmail.com') {
        return { exists: true, profile: SEED_EXISTING_USER };
      }

      return { exists: false, profile: null };
    } catch (e) {
      return { exists: false, profile: null };
    }
  }

  /**
   * Saves or updates a user profile to the registered profiles database
   */
  static saveUserProfile(profile: UserProfile): void {
    try {
      const dbRaw = localStorage.getItem(PROFILES_DB_KEY);
      const db: Record<string, UserProfile> = dbRaw ? JSON.parse(dbRaw) : {};
      db[profile.email] = profile;
      localStorage.setItem(PROFILES_DB_KEY, JSON.stringify(db));
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save user profile:', e);
    }
  }
}
