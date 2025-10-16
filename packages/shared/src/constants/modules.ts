export const PHASES = {
  PHASE_1: {
    number: 1,
    title: 'Foundations',
    description: 'Build your financial foundation with basic concepts and goal setting',
  },
  PHASE_2: {
    number: 2,
    title: 'Building Wealth',
    description: 'Learn investment strategies and wealth building techniques',
  },
  PHASE_3: {
    number: 3,
    title: 'Building Assets & Major Goals',
    description: 'Plan for major financial milestones like home ownership',
  },
  PHASE_4: {
    number: 4,
    title: 'Long-Term Mastery',
    description: 'Master long-term financial planning and retirement strategies',
  },
} as const;

export const CALCULATOR_TYPES = {
  COMPOUND_GROWTH: 'compound_growth',
  FINANCIAL_SNAPSHOT: 'financial_snapshot',
  BUDGET_TRACKER: 'budget_tracker',
  DEBT_PAYOFF: 'debt_payoff',
  EMERGENCY_FUND: 'emergency_fund',
  INVESTMENT_GROWTH: 'investment_growth',
  ACCOUNT_COMPARISON: 'account_comparison',
  PORTFOLIO_TRACKER: 'portfolio_tracker',
  INVESTMENT_DASHBOARD: 'investment_dashboard',
  HOME_OWNERSHIP_PLANNING: 'home_ownership_planning',
  MORTGAGE: 'mortgage',
  AMORTIZATION: 'amortization',
  EQUITY_GROWTH: 'equity_growth',
  MULTI_GOAL_PRIORITY: 'multi_goal_priority',
  RETIREMENT_PLANNING: 'retirement_planning',
  RETIREMENT_INCOME: 'retirement_income',
  PORTFOLIO_STRESS_TEST: 'portfolio_stress_test',
  TAX_OPTIMIZATION: 'tax_optimization',
} as const;

export const ACHIEVEMENT_TYPES = {
  MODULE_COMPLETE_PHASE_1: 'module_complete_phase_1',
  MODULE_COMPLETE_PHASE_2: 'module_complete_phase_2',
  MODULE_COMPLETE_PHASE_3: 'module_complete_phase_3',
  MODULE_COMPLETE_PHASE_4: 'module_complete_phase_4',
  FIRST_CALCULATOR: 'first_calculator',
  FIRST_BUDGET: 'first_budget',
  FIRST_GOAL: 'first_goal',
  SEVEN_DAY_STREAK: 'seven_day_streak',
  THIRTY_DAY_STREAK: 'thirty_day_streak',
  COMPLETE_PROFILE: 'complete_profile',
  FINANCIAL_SNAPSHOT: 'financial_snapshot',
} as const;

export const GOAL_TYPES = {
  EMERGENCY_FUND: 'emergency_fund',
  DEBT_PAYOFF: 'debt_payoff',
  HOME_DOWN_PAYMENT: 'home_down_payment',
  RETIREMENT: 'retirement',
  INVESTMENT: 'investment',
  CUSTOM: 'custom',
} as const;
