/**
 * @license
 * GRAM-DISHA — User Profile & Global Settings View (/profile, /settings)
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Manages user profile, demographic criteria for scheme matching,
 * 23 official Indian languages selection, notifications, and RS256 JWT security.
 */

import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Globe, 
  ShieldCheck, 
  Bell, 
  MapPin, 
  Save, 
  Check, 
  Key, 
  LogOut,
  Building,
  GraduationCap,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { SupportedLanguageCode, UserRole, LocationContext } from '../../types';
import { JWTAuthService } from '../../services/auth/jwtAuthService';
import { LGDLocationSelector } from '../common/LGDLocationSelector';

export const ProfileSettingsView: React.FC = () => {
  const { user, updateUserProfile, logout, activeBusiness } = useAuth();
  const { currentLanguage, setLanguage, availableLanguages } = useLanguage();

  const [activeTab, setActiveTab] = useState<'PROFILE' | 'LOCATION' | 'DEMOGRAPHICS' | 'LANGUAGE' | 'NOTIFICATIONS' | 'SECURITY'>('PROFILE');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Location State
  const [userLocation, setUserLocation] = useState<LocationContext>(user?.location || {
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    block: 'Coimbatore North',
    gramPanchayat: 'Somayampalayam Gram Panchayat',
    villageOrLocality: 'Somayampalayam Gaon',
    isRural: true,
    opportunityRadiusKm: 10
  });

  // Form State initialized from authenticated user
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState<UserRole>(user?.role || 'ENTREPRENEUR');

  const [category, setCategory] = useState(user?.demographics?.category || 'OBC');
  const [gender, setGender] = useState(user?.demographics?.gender || 'MALE');
  const [ageGroup, setAgeGroup] = useState(user?.demographics?.ageGroup || '26-35');
  const [educationLevel, setEducationLevel] = useState(user?.demographics?.educationLevel || 'HIGHER_SECONDARY');
  const [occupation, setOccupation] = useState(user?.demographics?.occupation || '');
  const [priorExperienceYears, setPriorExperienceYears] = useState(user?.demographics?.priorExperienceYears || 0);
  const [annualHouseholdIncome, setAnnualHouseholdIncome] = useState(user?.demographics?.annualHouseholdIncome || 0);

  // Notification toggles
  const [schemeAlerts, setSchemeAlerts] = useState(true);
  const [inventoryAlerts, setInventoryAlerts] = useState(true);
  const [financialReminders, setFinancialReminders] = useState(true);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName,
      email,
      role,
      demographics: {
        category,
        gender,
        ageGroup,
        educationLevel,
        occupation,
        priorExperienceYears: Number(priorExperienceYears),
        annualHouseholdIncome: Number(annualHouseholdIncome),
        householdMembersCount: user?.demographics?.householdMembersCount || 4
      }
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const rawToken = JWTAuthService.getStoredToken();
  const decodedJWT = rawToken ? JWTAuthService.decodeToken(rawToken) : null;

  return (
    <div id="profile_settings_root" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C8A96B]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#3B2F2A] text-[#FAF7F2] flex items-center justify-center shadow-xs">
              <User className="w-5 h-5 text-[#C8A96B]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-extrabold text-[#3B2F2A]">
              Profile & Enterprise Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#3B2F2A]/70 mt-1">
            Manage your entrepreneur demographics, language preference, and security credentials.
          </p>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#5A6B4F]/15 border border-[#5A6B4F]/40 text-xs font-bold text-[#5A6B4F] animate-in fade-in duration-200">
            <Check className="w-4 h-4 text-[#5A6B4F]" />
            <span>Profile Saved Successfully</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#C8A96B]/20 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'PROFILE', label: 'Basic Profile', icon: User },
          { id: 'LOCATION', label: 'LGD Location & Gaon', icon: MapPin },
          { id: 'DEMOGRAPHICS', label: 'Demographics & Schemes Criteria', icon: Users },
          { id: 'LANGUAGE', label: 'Language (23 Languages)', icon: Globe },
          { id: 'NOTIFICATIONS', label: 'Notification Preferences', icon: Bell },
          { id: 'SECURITY', label: 'JWT Session & Security', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#174C3A] text-[#FAF7F2] shadow-xs'
                  : 'text-[#3B2F2A]/70 hover:bg-[#F2E8D6]/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Basic Profile */}
      {activeTab === 'PROFILE' && (
        <form onSubmit={handleSaveProfile} className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-6 shadow-xs space-y-5 max-w-2xl">
          <div className="border-b border-[#C8A96B]/20 pb-3">
            <h2 className="text-sm font-bold text-[#3B2F2A]">Entrepreneur Account Information</h2>
            <p className="text-xs text-[#3B2F2A]/60 mt-0.5">Your official name and role for scheme and DPR documentation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">User Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              >
                <option value="ENTREPRENEUR">Entrepreneur / Business Aspirant</option>
                <option value="FIELD_FACILITATOR">Panchayat Field Facilitator (DIC / CSC)</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">Registered Location</label>
              <div className="px-3 py-2 rounded-xl border border-[#C8A96B]/20 bg-[#F2E8D6]/40 text-xs font-medium text-[#3B2F2A] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#B45B4A]" />
                <span>{user?.location.district || 'Location unverified'}, {user?.location.state || 'India'}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#174C3A] text-[#FAF7F2] text-xs font-bold hover:bg-[#174C3A]/90 transition-colors shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#C8A96B]" />
            <span>Save Profile</span>
          </button>
        </form>
      )}

      {/* Tab: LGD Location & Gaon */}
      {activeTab === 'LOCATION' && (
        <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-6 shadow-xs space-y-5 max-w-3xl">
          <div className="border-b border-[#C8A96B]/20 pb-3">
            <h2 className="text-sm font-bold text-[#3B2F2A]">Administrative Location & LGD Revenue Gaon</h2>
            <p className="text-xs text-[#3B2F2A]/60 mt-0.5">
              Select your State, District, Sub-District / Block / Taluka, Gram Panchayat / Local Body, and Village / Revenue Gaon.
            </p>
          </div>

          <LGDLocationSelector
            value={userLocation}
            onChange={(newLoc) => setUserLocation(newLoc)}
            showSubsidyPreview={true}
          />

          <div className="pt-3 border-t border-[#C8A96B]/20 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                updateUserProfile({ location: userLocation });
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#174C3A] text-[#FAF7F2] text-xs font-bold hover:bg-[#174C3A]/90 transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4 text-[#C8A96B]" />
              <span>Update Registered Location</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Demographics */}
      {activeTab === 'DEMOGRAPHICS' && (
        <form onSubmit={handleSaveProfile} className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-6 shadow-xs space-y-5 max-w-2xl">
          <div className="border-b border-[#C8A96B]/20 pb-3">
            <h2 className="text-sm font-bold text-[#3B2F2A]">Social & Demographic Criteria</h2>
            <p className="text-xs text-[#3B2F2A]/60 mt-0.5">
              Government schemes like PMEGP, PMFME, and Stand-Up India calculate official subsidy percentages (e.g. 25% to 35%) strictly based on social category, gender, and location.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">Social Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              >
                <option value="GENERAL">General</option>
                <option value="OBC">Other Backward Class (OBC)</option>
                <option value="SC">Scheduled Caste (SC)</option>
                <option value="ST">Scheduled Tribe (ST)</option>
                <option value="EWS">Economically Weaker Section (EWS)</option>
                <option value="MINORITY">Minority Community</option>
                <option value="WOMEN">Women Entrepreneur</option>
                <option value="EX_SERVICEMEN">Ex-Servicemen</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other / Non-Binary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">Age Group</label>
              <select
                value={ageGroup}
                onChange={(e) => setAgeGroup(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              >
                <option value="18-25">18 - 25 years (Youth / Start-up priority)</option>
                <option value="26-35">26 - 35 years</option>
                <option value="36-50">36 - 50 years</option>
                <option value="50+">50+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">Highest Education Level</label>
              <select
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              >
                <option value="PRIMARY">Primary School (8th Pass)</option>
                <option value="SECONDARY">Secondary (10th Pass)</option>
                <option value="HIGHER_SECONDARY">Higher Secondary (12th Pass)</option>
                <option value="VOCATIONAL_ITI">Vocational / ITI Diploma</option>
                <option value="GRADUATE">Graduate / Post-Graduate Degree</option>
                <option value="NONE">No Formal Schooling</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">Current Occupation</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="e.g. Farmer, Artisan, Daily Wage Worker"
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#3B2F2A] mb-1.5">Prior Business Experience (Years)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={priorExperienceYears}
                onChange={(e) => setPriorExperienceYears(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-[#C8A96B]/40 bg-[#FAF7F2] text-xs font-medium text-[#3B2F2A] focus:outline-none focus:ring-2 focus:ring-[#174C3A]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#174C3A] text-[#FAF7F2] text-xs font-bold hover:bg-[#174C3A]/90 transition-colors shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4 text-[#C8A96B]" />
            <span>Update Demographics</span>
          </button>
        </form>
      )}

      {/* Tab 3: 23 Official Indian Languages */}
      {activeTab === 'LANGUAGE' && (
        <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-6 shadow-xs space-y-4 max-w-3xl">
          <div className="border-b border-[#C8A96B]/20 pb-3">
            <h2 className="text-sm font-bold text-[#3B2F2A]">Eighth Schedule Languages (23 Official Indian Languages)</h2>
            <p className="text-xs text-[#3B2F2A]/60 mt-0.5">
              Select your preferred language. All interfaces, Disha AI advice, scheme descriptions, and reports will instantly translate into your chosen regional script.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {availableLanguages.map(lang => {
              const isSelected = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as SupportedLanguageCode)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'bg-[#174C3A] text-[#FAF7F2] border-[#174C3A] shadow-xs'
                      : 'bg-[#FAF7F2] border-[#C8A96B]/30 hover:bg-[#F2E8D6]/50 text-[#3B2F2A]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase ${isSelected ? 'text-[#C8A96B]' : 'text-[#3B2F2A]/60'}`}>
                      {lang.code}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#C8A96B]" />}
                  </div>
                  <div className="font-bold text-xs">{lang.nativeName}</div>
                  <div className={`text-[10px] ${isSelected ? 'text-[#FAF7F2]/80' : 'text-[#3B2F2A]/60'}`}>
                    {lang.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'NOTIFICATIONS' && (
        <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-6 shadow-xs space-y-4 max-w-2xl">
          <div className="border-b border-[#C8A96B]/20 pb-3">
            <h2 className="text-sm font-bold text-[#3B2F2A]">Notification & Alert Preferences</h2>
            <p className="text-xs text-[#3B2F2A]/60 mt-0.5">Choose which event categories trigger system notifications and Disha alerts.</p>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Government Scheme Guideline Updates', desc: 'Notify when notified central or state subsidy rules change.', state: schemeAlerts, set: setSchemeAlerts },
              { label: 'Inventory Reorder Level Alerts', desc: 'Alert when any raw material or stock item drops below minimum safety threshold.', state: inventoryAlerts, set: setInventoryAlerts },
              { label: 'Financial Obligation Reminders', desc: 'Alert for monthly working capital requirements and EMI schedules.', state: financialReminders, set: setFinancialReminders },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start justify-between gap-4 p-3.5 rounded-xl border border-[#C8A96B]/25 bg-[#F2E8D6]/20">
                <div>
                  <div className="text-xs font-bold text-[#3B2F2A]">{item.label}</div>
                  <div className="text-[11px] text-[#3B2F2A]/60 mt-0.5">{item.desc}</div>
                </div>
                <button
                  type="button"
                  onClick={() => item.set(!item.state)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                    item.state ? 'bg-[#174C3A]' : 'bg-[#D9D3C7]'
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${item.state ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Security */}
      {activeTab === 'SECURITY' && (
        <div className="bg-[#FAF7F2] border border-[#C8A96B]/30 rounded-2xl p-6 shadow-xs space-y-5 max-w-2xl">
          <div className="border-b border-[#C8A96B]/20 pb-3">
            <h2 className="text-sm font-bold text-[#3B2F2A]">Cryptographic RS256 JWT Authentication Session</h2>
            <p className="text-xs text-[#3B2F2A]/60 mt-0.5">Enterprise session tokens are signed with RS256 asymmetric keys.</p>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded-xl bg-[#3B2F2A] text-[#FAF7F2] space-y-1.5 overflow-x-auto">
              <div className="text-[10px] text-[#C8A96B] font-bold uppercase">Active Session Payload</div>
              <div>User ID: {user?.id || 'Anonymous'}</div>
              <div>Email: {user?.email || 'None'}</div>
              <div>Role: {user?.role || 'ENTREPRENEUR'}</div>
              <div>Algorithm: RS256 (Asymmetric Public/Private Key)</div>
              <div>Issued At: {decodedJWT?.payload ? new Date(decodedJWT.payload.iat * 1000).toLocaleString() : 'Active Session'}</div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#C8A96B]/20 flex items-center justify-between">
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B45B4A]/10 hover:bg-[#B45B4A]/20 border border-[#B45B4A]/30 text-[#B45B4A] text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Session</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
