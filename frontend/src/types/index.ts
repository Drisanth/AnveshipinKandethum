export interface Team {
  teamId: string;
  teamName: string;
  currentRound: number;
  currentStep: number;
}

export interface Round {
  roundNumber: number;
  clueType: 'text' | 'image';
  clueContent: string;
  currentStep: {
    stepNumber: number;
    inputType: 'code' | 'text';
    additionalClue?: string;
    additionalClueType?: 'text' | 'image';
    isCompleted: boolean;
  };
  totalSteps: number;
  isRoundComplete: boolean;
}

export interface ValidationResponse {
  success: boolean;
  message: string;
  nextClue?: string;
  nextClueType?: 'text' | 'image';
  isLastStep?: boolean;
  canProceed?: boolean;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  team?: Team;
  admin?: {
    username: string;
    role: string;
  };
  message: string;
}

export interface Progress {
  teamId: string;
  teamName: string;
  currentRound: number;
  currentStep: number;
  totalAttempts: number;
  completedSteps: Array<{
    roundNumber: number;
    stepNumber: number;
    completedAt: string;
  }>;
  lastActivity: string;
}

export interface AdminTeam {
  teamId: string;
  teamName: string;
  currentRound: number;
  currentStep: number;
  totalAttempts: number;
  lastActivity: string;
}

export interface ValidationStep {
  stepNumber: number;
  inputType: 'code' | 'text';
  acceptedAnswers: string[];
  additionalClue?: string;
  additionalClueType?: 'text' | 'image';
}

export interface TeamRoundData {
  teamId: string;
  roundNumber: number;
  clueType: 'text' | 'image';
  clueContent: string;
  validationSteps: ValidationStep[];
  hint: string;
  isActive: boolean;
}
