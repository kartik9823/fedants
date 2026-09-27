import { CONFIG } from '../constants/config';

export interface Reward {
  position: number;
  label: string;
  amount: number;
  icon?: string;
}

export interface Judge {
  name: string;
  title?: string;
  experience?: string;
  photoUrl?: string;
  introVideoUrl?: string;
}

export interface Competition {
  _id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  type?: string;
  entryFee: number;
  prizePool: number;
  maxParticipants: number;
  currentParticipants: number;
  registrationStart: string;
  registrationEnd: string;
  competitionStart: string;
  competitionEnd: string;
  resultDate?: string;
  status: string;
  judge?: Judge;
  rewards?: Reward[];
  winners?: any[];
  winnersGetCertificate?: boolean;
  refundPolicy?: string;
  rulesAndEligibility?: string;
  judgeParameters?: string;
  computedState?: CompetitionState;
}

export type UserState = 'NOT_REGISTERED' | 'REGISTERED';
export type CompetitionState =
  | 'REGISTRATION_OPEN'
  | 'REGISTRATION_CLOSED'
  | 'FULL'
  | 'COMPLETED'
  | 'UPCOMING'
  | 'CANCELLED';

export interface Submission {
  submissionUrl?: string;
  submissionName?: string;
  submittedAt?: string;
}

export interface CompetitionResponse {
  success: boolean;
  competition: Competition & { computedState: CompetitionState };
  userState: UserState;
  submission?: Submission | null;
}

const fetchWithTimeout = (url: string, opts: RequestInit = {}) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);
  return fetch(url, { ...opts, signal: controller.signal })
    .finally(() => clearTimeout(timer));
};

export const api = {
  getCompetition: async (id: string): Promise<CompetitionResponse> => {
    const res = await fetchWithTimeout(`${CONFIG.BASE_URL}/api/competitions/${id}`, {
      headers: { 'x-user-id': CONFIG.DEMO_USER_ID },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  register: async (id: string) => {
    const res = await fetchWithTimeout(
      `${CONFIG.BASE_URL}/api/competitions/${id}/register`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': CONFIG.DEMO_USER_ID,
        },
        body: JSON.stringify({ userId: CONFIG.DEMO_USER_ID }),
      }
    );
    const data = await res.json();
    if (!res.ok) throw Object.assign(new Error(data.message || 'Registration failed'), { code: data.error });
    return data;
  },

  unregister: async (id: string) => {
    const res = await fetchWithTimeout(
      `${CONFIG.BASE_URL}/api/competitions/${id}/unregister`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': CONFIG.DEMO_USER_ID,
        },
        body: JSON.stringify({ userId: CONFIG.DEMO_USER_ID }),
      }
    );
    const data = await res.json();
    if (!res.ok) throw Object.assign(new Error(data.message || 'Unregistration failed'), { code: data.error });
    return data;
  },

  submit: async (id: string, submissionData: { submissionUrl?: string; submissionName?: string }) => {
    const res = await fetchWithTimeout(
      `${CONFIG.BASE_URL}/api/competitions/${id}/submit`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': CONFIG.DEMO_USER_ID,
        },
        body: JSON.stringify({ userId: CONFIG.DEMO_USER_ID, ...submissionData }),
      }
    );
    const data = await res.json();
    if (!res.ok) throw Object.assign(new Error(data.message || 'Submission failed'), { code: data.error });
    return data;
  },
};
