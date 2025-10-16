import { z } from 'zod';

// Compound Growth Calculator
export const compoundGrowthSchema = z.object({
  principal: z.number().min(0, 'Principal must be non-negative'),
  monthly_contribution: z.number().min(0, 'Monthly contribution must be non-negative'),
  annual_rate: z.number().min(0, 'Rate must be non-negative').max(100, 'Rate cannot exceed 100%'),
  years: z.number().min(1, 'Years must be at least 1').max(100, 'Years cannot exceed 100'),
});

// Financial Snapshot
export const assetItemSchema = z.object({
  name: z.string().min(1, 'Asset name is required'),
  value: z.number().min(0, 'Asset value must be non-negative'),
  category: z.enum(['cash', 'investment', 'property', 'other']),
});

export const liabilityItemSchema = z.object({
  name: z.string().min(1, 'Liability name is required'),
  amount: z.number().min(0, 'Liability amount must be non-negative'),
  category: z.enum(['credit_card', 'student_loan', 'mortgage', 'other']),
});

export const financialSnapshotSchema = z.object({
  assets: z.array(assetItemSchema),
  liabilities: z.array(liabilityItemSchema),
});

// Budget Tracker
export const expenseItemSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.number().min(0, 'Amount must be non-negative'),
  is_fixed: z.boolean(),
});

export const budgetTrackerSchema = z.object({
  monthly_income: z.number().min(0, 'Income must be non-negative'),
  expenses: z.array(expenseItemSchema),
});

// Debt Payoff Calculator
export const debtItemSchema = z.object({
  name: z.string().min(1, 'Debt name is required'),
  balance: z.number().min(0, 'Balance must be non-negative'),
  apr: z.number().min(0, 'APR must be non-negative').max(100, 'APR cannot exceed 100%'),
  minimum_payment: z.number().min(0, 'Minimum payment must be non-negative'),
});

export const debtPayoffSchema = z.object({
  debts: z.array(debtItemSchema).min(1, 'At least one debt is required'),
  monthly_payment: z.number().min(0, 'Monthly payment must be non-negative'),
  strategy: z.enum(['avalanche', 'snowball']),
});

// Emergency Fund Calculator
export const emergencyFundSchema = z.object({
  monthly_expenses: z.number().min(0, 'Monthly expenses must be non-negative'),
  target_months: z.number().min(1, 'Target months must be at least 1').max(24, 'Target months cannot exceed 24'),
  current_saved: z.number().min(0, 'Current saved must be non-negative'),
  monthly_contribution: z.number().min(0, 'Monthly contribution must be non-negative'),
});

// Investment Growth Calculator
export const investmentGrowthSchema = z.object({
  initial_investment: z.number().min(0, 'Initial investment must be non-negative'),
  monthly_contribution: z.number().min(0, 'Monthly contribution must be non-negative'),
  expected_return: z.number().min(0, 'Expected return must be non-negative').max(100, 'Expected return cannot exceed 100%'),
  years: z.number().min(1, 'Years must be at least 1').max(100, 'Years cannot exceed 100'),
  inflation_rate: z.number().min(0, 'Inflation rate must be non-negative').max(50, 'Inflation rate cannot exceed 50%'),
});

// Mortgage Calculator
export const mortgageSchema = z.object({
  home_price: z.number().min(1, 'Home price must be greater than 0'),
  down_payment: z.number().min(0, 'Down payment must be non-negative'),
  loan_term_years: z.number().min(1, 'Loan term must be at least 1 year').max(50, 'Loan term cannot exceed 50 years'),
  interest_rate: z.number().min(0, 'Interest rate must be non-negative').max(30, 'Interest rate cannot exceed 30%'),
  property_tax_annual: z.number().min(0, 'Property tax must be non-negative'),
  insurance_annual: z.number().min(0, 'Insurance must be non-negative'),
  hoa_monthly: z.number().min(0, 'HOA fee must be non-negative'),
});

// Retirement Calculator
export const retirementSchema = z.object({
  current_age: z.number().min(18, 'Age must be at least 18').max(100, 'Age cannot exceed 100'),
  retirement_age: z.number().min(50, 'Retirement age must be at least 50').max(100, 'Retirement age cannot exceed 100'),
  current_savings: z.number().min(0, 'Current savings must be non-negative'),
  monthly_contribution: z.number().min(0, 'Monthly contribution must be non-negative'),
  expected_return: z.number().min(0, 'Expected return must be non-negative').max(50, 'Expected return cannot exceed 50%'),
  annual_expenses_in_retirement: z.number().min(0, 'Annual expenses must be non-negative'),
  years_in_retirement: z.number().min(1, 'Years in retirement must be at least 1').max(50, 'Years in retirement cannot exceed 50'),
}).refine(data => data.retirement_age > data.current_age, {
  message: 'Retirement age must be greater than current age',
  path: ['retirement_age'],
});

// Generic Calculator Save
export const saveCalculatorSchema = z.object({
  calculator_type: z.string().min(1, 'Calculator type is required'),
  calculator_name: z.string().min(1, 'Calculator name is required').max(255, 'Name is too long'),
  input_data: z.record(z.any()),
  module_id: z.string().uuid().optional(),
});

export const updateCalculatorSchema = z.object({
  input_data: z.record(z.any()),
});

export type CompoundGrowthInput = z.infer<typeof compoundGrowthSchema>;
export type FinancialSnapshotInput = z.infer<typeof financialSnapshotSchema>;
export type BudgetTrackerInput = z.infer<typeof budgetTrackerSchema>;
export type DebtPayoffInput = z.infer<typeof debtPayoffSchema>;
export type EmergencyFundInput = z.infer<typeof emergencyFundSchema>;
export type InvestmentGrowthInput = z.infer<typeof investmentGrowthSchema>;
export type MortgageInput = z.infer<typeof mortgageSchema>;
export type RetirementInput = z.infer<typeof retirementSchema>;
export type SaveCalculatorInput = z.infer<typeof saveCalculatorSchema>;
export type UpdateCalculatorInput = z.infer<typeof updateCalculatorSchema>;
