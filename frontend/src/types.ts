export interface Scenario {
  id: number;
  holeCards: string[];
  flop: string[];
  turn: string;
  pot: number;
  bet: number;
  turnBet: number;
}

export interface AttemptResult {
  id: number;
  street: "flop" | "turn";
  decision: "fold" | "call";
  estimatedEq: number;
  requiredEq: number;
  correct: boolean;
  explanation: string[];
}

export interface Stats {
  total: number;
  correct: number;
  accuracy: number;
  breakdown: {
    shouldCall: { total: number; correct: number };
    shouldFold: { total: number; correct: number };
  };
  recent: RecentAttempt[];
}

export interface RecentAttempt {
  id: number;
  decision: string;
  estimatedEq: number;
  requiredEq: number;
  correct: boolean;
  scenario: {
    holeCards: string[];
    flop: string[];
    pot: number;
    bet: number;
  };
  createdAt: string;
}
