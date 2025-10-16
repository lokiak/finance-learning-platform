export interface CalculatorData {
  id: string;
  user_id: string;
  calculator_type: string;
  calculator_name: string;
  input_data: Record<string, any>;
  output_data: Record<string, any>;
  created_at: Date;
  updated_at: Date;
  module_id: string | null;
}

export interface SaveCalculatorRequest {
  calculator_type: string;
  calculator_name: string;
  input_data: Record<string, any>;
  module_id?: string;
}

export interface UpdateCalculatorRequest {
  input_data: Record<string, any>;
}

// Compound Growth Calculator
export interface CompoundGrowthInput {
  principal: number;
  monthly_contribution: number;
  annual_rate: number;
  years: number;
}

export interface CompoundGrowthOutput {
  final_amount: number;
  total_contributions: number;
  total_interest: number;
  yearly_breakdown: YearlyBreakdown[];
}

export interface YearlyBreakdown {
  year: number;
  balance: number;
  contributions: number;
  interest: number;
}

// Financial Snapshot Calculator
export interface FinancialSnapshotInput {
  assets: AssetItem[];
  liabilities: LiabilityItem[];
}

export interface AssetItem {
  name: string;
  value: number;
  category: 'cash' | 'investment' | 'property' | 'other';
}

export interface LiabilityItem {
  name: string;
  amount: number;
  category: 'credit_card' | 'student_loan' | 'mortgage' | 'other';
}

export interface FinancialSnapshotOutput {
  total_assets: number;
  total_liabilities: number;
  net_worth: number;
  assets_by_category: Record<string, number>;
  liabilities_by_category: Record<string, number>;
}

// Budget Tracker
export interface BudgetTrackerInput {
  monthly_income: number;
  expenses: ExpenseItem[];
}

export interface ExpenseItem {
  category: string;
  amount: number;
  is_fixed: boolean;
}

export interface BudgetTrackerOutput {
  total_expenses: number;
  remaining: number;
  savings_rate: number;
  expenses_by_category: Record<string, number>;
  fixed_vs_variable: {
    fixed: number;
    variable: number;
  };
}

// Debt Payoff Calculator
export interface DebtPayoffInput {
  debts: DebtItem[];
  monthly_payment: number;
  strategy: 'avalanche' | 'snowball';
}

export interface DebtItem {
  name: string;
  balance: number;
  apr: number;
  minimum_payment: number;
}

export interface DebtPayoffOutput {
  total_debt: number;
  payoff_months: number;
  total_interest: number;
  monthly_breakdown: DebtMonthlyBreakdown[];
  debt_order: string[];
}

export interface DebtMonthlyBreakdown {
  month: number;
  remaining_balance: number;
  principal_paid: number;
  interest_paid: number;
}

// Emergency Fund Calculator
export interface EmergencyFundInput {
  monthly_expenses: number;
  target_months: number;
  current_saved: number;
  monthly_contribution: number;
}

export interface EmergencyFundOutput {
  target_amount: number;
  remaining_to_save: number;
  months_to_goal: number;
  progress_percentage: number;
}

// Investment Growth Calculator
export interface InvestmentGrowthInput {
  initial_investment: number;
  monthly_contribution: number;
  expected_return: number;
  years: number;
  inflation_rate: number;
}

export interface InvestmentGrowthOutput {
  final_amount: number;
  real_value: number;
  total_contributions: number;
  total_returns: number;
  yearly_breakdown: InvestmentYearlyBreakdown[];
}

export interface InvestmentYearlyBreakdown {
  year: number;
  balance: number;
  real_value: number;
  contributions: number;
  returns: number;
}

// Mortgage Calculator
export interface MortgageInput {
  home_price: number;
  down_payment: number;
  loan_term_years: number;
  interest_rate: number;
  property_tax_annual: number;
  insurance_annual: number;
  hoa_monthly: number;
}

export interface MortgageOutput {
  loan_amount: number;
  monthly_payment: number;
  monthly_principal_interest: number;
  monthly_tax: number;
  monthly_insurance: number;
  total_interest: number;
  total_cost: number;
  amortization_schedule: AmortizationItem[];
}

export interface AmortizationItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

// Retirement Calculator
export interface RetirementInput {
  current_age: number;
  retirement_age: number;
  current_savings: number;
  monthly_contribution: number;
  expected_return: number;
  annual_expenses_in_retirement: number;
  years_in_retirement: number;
}

export interface RetirementOutput {
  projected_savings: number;
  required_savings: number;
  surplus_or_deficit: number;
  monthly_income_in_retirement: number;
  is_on_track: boolean;
  yearly_projection: RetirementYearlyProjection[];
}

export interface RetirementYearlyProjection {
  age: number;
  balance: number;
  contributions: number;
  growth: number;
  withdrawals: number;
}
