import { useState } from 'react';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Badge from '@/components/shared/Badge';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

type CalculatorType =
  | 'compound-growth'
  | 'budget'
  | 'debt-payoff'
  | 'emergency-fund'
  | 'retirement'
  | 'mortgage'
  | null;

export default function Calculators() {
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorType>(null);

  const calculators = [
    {
      id: 'compound-growth' as const,
      title: 'Compound Growth Calculator',
      description: 'See how your investments can grow over time with compound interest',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: 'primary',
    },
    {
      id: 'budget' as const,
      title: 'Budget Planner',
      description: 'Create and manage your monthly budget with the 50/30/20 rule',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: 'success',
    },
    {
      id: 'debt-payoff' as const,
      title: 'Debt Payoff Calculator',
      description: 'Plan your debt repayment strategy and see when you'll be debt-free',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path
            fillRule="evenodd"
            d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: 'warning',
    },
    {
      id: 'emergency-fund' as const,
      title: 'Emergency Fund Calculator',
      description: 'Calculate how much you need in your emergency fund',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: 'info',
    },
    {
      id: 'retirement' as const,
      title: 'Retirement Planner',
      description: 'Plan for your retirement and calculate how much you need to save',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: 'primary',
    },
    {
      id: 'mortgage' as const,
      title: 'Mortgage Calculator',
      description: 'Calculate your monthly mortgage payments and total interest',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      ),
      color: 'danger',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Financial Calculators</h1>
        <p className="text-secondary-600">
          Use our interactive calculators to plan your financial future
        </p>
      </div>

      {!selectedCalculator ? (
        /* Calculator Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {calculators.map((calc) => (
            <Card key={calc.id} hover>
              <div className="flex flex-col h-full">
                <div
                  className={`w-12 h-12 bg-${calc.color}-100 rounded-lg flex items-center justify-center text-${calc.color}-600 mb-4`}
                >
                  {calc.icon}
                </div>
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">{calc.title}</h3>
                <p className="text-sm text-secondary-600 mb-4 flex-1">{calc.description}</p>
                <Button
                  onClick={() => setSelectedCalculator(calc.id)}
                  variant="outline"
                  className="w-full"
                >
                  Open Calculator
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Calculator View */
        <div>
          <button
            onClick={() => setSelectedCalculator(null)}
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Calculators
          </button>

          {selectedCalculator === 'compound-growth' && <CompoundGrowthCalculator />}
          {selectedCalculator === 'budget' && <BudgetCalculator />}
          {selectedCalculator === 'debt-payoff' && <DebtPayoffCalculator />}
          {selectedCalculator === 'emergency-fund' && <EmergencyFundCalculator />}
          {selectedCalculator === 'retirement' && <RetirementCalculator />}
          {selectedCalculator === 'mortgage' && <MortgageCalculator />}
        </div>
      )}
    </div>
  );
}

/* Compound Growth Calculator */
function CompoundGrowthCalculator() {
  const [inputs, setInputs] = useState({
    initialAmount: 10000,
    monthlyContribution: 500,
    annualReturn: 7,
    years: 30,
  });

  const calculateGrowth = () => {
    const data = [];
    const monthlyRate = inputs.annualReturn / 100 / 12;
    let balance = inputs.initialAmount;

    for (let year = 0; year <= inputs.years; year++) {
      const totalContributions = inputs.initialAmount + inputs.monthlyContribution * 12 * year;
      data.push({
        year,
        balance: Math.round(balance),
        contributions: Math.round(totalContributions),
      });

      for (let month = 0; month < 12; month++) {
        balance = balance * (1 + monthlyRate) + inputs.monthlyContribution;
      }
    }

    return data;
  };

  const data = calculateGrowth();
  const finalBalance = data[data.length - 1].balance;
  const totalContributions = data[data.length - 1].contributions;
  const totalGains = finalBalance - totalContributions;

  return (
    <Card>
      <h2 className="text-2xl font-bold text-secondary-900 mb-6">Compound Growth Calculator</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inputs */}
        <div className="space-y-4">
          <Input
            label="Initial Investment"
            type="number"
            value={inputs.initialAmount}
            onChange={(e) => setInputs({ ...inputs, initialAmount: parseFloat(e.target.value) })}
          />
          <Input
            label="Monthly Contribution"
            type="number"
            value={inputs.monthlyContribution}
            onChange={(e) =>
              setInputs({ ...inputs, monthlyContribution: parseFloat(e.target.value) })
            }
          />
          <Input
            label="Annual Return (%)"
            type="number"
            value={inputs.annualReturn}
            onChange={(e) => setInputs({ ...inputs, annualReturn: parseFloat(e.target.value) })}
            step="0.1"
          />
          <Input
            label="Investment Period (years)"
            type="number"
            value={inputs.years}
            onChange={(e) => setInputs({ ...inputs, years: parseInt(e.target.value) })}
          />

          {/* Results */}
          <div className="pt-4 space-y-3">
            <div className="p-4 bg-primary-50 rounded-lg">
              <p className="text-sm text-secondary-600 mb-1">Final Balance</p>
              <p className="text-2xl font-bold text-primary-600">
                ${finalBalance.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-600 mb-1">Total Contributions</p>
              <p className="text-xl font-semibold text-secondary-900">
                ${totalContributions.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-success-50 rounded-lg">
              <p className="text-sm text-secondary-600 mb-1">Total Gains</p>
              <p className="text-xl font-semibold text-success-600">
                ${totalGains.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Growth Over Time</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="balance" stroke="#4F46E5" name="Balance" strokeWidth={2} />
              <Line type="monotone" dataKey="contributions" stroke="#9CA3AF" name="Contributions" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

/* Budget Calculator */
function BudgetCalculator() {
  const [income, setIncome] = useState(5000);

  const needs = income * 0.5;
  const wants = income * 0.3;
  const savings = income * 0.2;

  const data = [
    { name: 'Needs (50%)', value: needs, color: '#EF4444' },
    { name: 'Wants (30%)', value: wants, color: '#F59E0B' },
    { name: 'Savings (20%)', value: savings, color: '#10B981' },
  ];

  return (
    <Card>
      <h2 className="text-2xl font-bold text-secondary-900 mb-6">Budget Planner (50/30/20 Rule)</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Input
            label="Monthly Income After Tax"
            type="number"
            value={income}
            onChange={(e) => setIncome(parseFloat(e.target.value))}
          />

          <div className="space-y-3">
            <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-sm font-medium text-secondary-900 mb-1">
                Needs (50%) - ${needs.toLocaleString()}
              </p>
              <p className="text-xs text-secondary-600">
                Housing, utilities, groceries, transportation, insurance, minimum debt payments
              </p>
            </div>

            <div className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded">
              <p className="text-sm font-medium text-secondary-900 mb-1">
                Wants (30%) - ${wants.toLocaleString()}
              </p>
              <p className="text-xs text-secondary-600">
                Dining out, entertainment, hobbies, subscriptions, shopping
              </p>
            </div>

            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
              <p className="text-sm font-medium text-secondary-900 mb-1">
                Savings & Debt (20%) - ${savings.toLocaleString()}
              </p>
              <p className="text-xs text-secondary-600">
                Emergency fund, retirement, investments, extra debt payments
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Budget Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}

/* Debt Payoff Calculator */
function DebtPayoffCalculator() {
  const [inputs, setInputs] = useState({
    balance: 10000,
    interestRate: 18,
    monthlyPayment: 300,
  });

  const calculatePayoff = () => {
    const monthlyRate = inputs.interestRate / 100 / 12;
    let balance = inputs.balance;
    let totalInterest = 0;
    let months = 0;

    while (balance > 0 && months < 600) {
      const interest = balance * monthlyRate;
      totalInterest += interest;
      balance = balance + interest - inputs.monthlyPayment;
      months++;
    }

    return { months, totalInterest, totalPaid: inputs.balance + totalInterest };
  };

  const result = calculatePayoff();

  return (
    <Card>
      <h2 className="text-2xl font-bold text-secondary-900 mb-6">Debt Payoff Calculator</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Input
            label="Total Debt Balance"
            type="number"
            value={inputs.balance}
            onChange={(e) => setInputs({ ...inputs, balance: parseFloat(e.target.value) })}
          />
          <Input
            label="Interest Rate (%)"
            type="number"
            value={inputs.interestRate}
            onChange={(e) => setInputs({ ...inputs, interestRate: parseFloat(e.target.value) })}
            step="0.1"
          />
          <Input
            label="Monthly Payment"
            type="number"
            value={inputs.monthlyPayment}
            onChange={(e) => setInputs({ ...inputs, monthlyPayment: parseFloat(e.target.value) })}
          />
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Time to Payoff</p>
            <p className="text-2xl font-bold text-primary-600">
              {Math.floor(result.months / 12)} years {result.months % 12} months
            </p>
          </div>
          <div className="p-4 bg-warning-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Total Interest Paid</p>
            <p className="text-xl font-semibold text-warning-600">
              ${result.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="p-4 bg-secondary-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Total Amount Paid</p>
            <p className="text-xl font-semibold text-secondary-900">
              ${result.totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>

          <div className="p-4 bg-info-50 border-l-4 border-info-500 rounded">
            <p className="text-sm font-semibold text-secondary-900 mb-1">Tip</p>
            <p className="text-xs text-secondary-600">
              Paying even $50 more per month can significantly reduce your payoff time and total
              interest!
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* Emergency Fund Calculator */
function EmergencyFundCalculator() {
  const [inputs, setInputs] = useState({
    monthlyExpenses: 3000,
    months: 6,
    currentSavings: 5000,
    monthlySavings: 500,
  });

  const targetAmount = inputs.monthlyExpenses * inputs.months;
  const remaining = Math.max(0, targetAmount - inputs.currentSavings);
  const monthsToGoal = remaining > 0 ? Math.ceil(remaining / inputs.monthlySavings) : 0;

  return (
    <Card>
      <h2 className="text-2xl font-bold text-secondary-900 mb-6">Emergency Fund Calculator</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Input
            label="Monthly Expenses"
            type="number"
            value={inputs.monthlyExpenses}
            onChange={(e) =>
              setInputs({ ...inputs, monthlyExpenses: parseFloat(e.target.value) })
            }
          />
          <Input
            label="Months of Expenses to Save"
            type="number"
            value={inputs.months}
            onChange={(e) => setInputs({ ...inputs, months: parseInt(e.target.value) })}
          />
          <Input
            label="Current Savings"
            type="number"
            value={inputs.currentSavings}
            onChange={(e) => setInputs({ ...inputs, currentSavings: parseFloat(e.target.value) })}
          />
          <Input
            label="Monthly Savings Amount"
            type="number"
            value={inputs.monthlySavings}
            onChange={(e) => setInputs({ ...inputs, monthlySavings: parseFloat(e.target.value) })}
          />
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Target Emergency Fund</p>
            <p className="text-2xl font-bold text-primary-600">${targetAmount.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-warning-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Amount Still Needed</p>
            <p className="text-xl font-semibold text-warning-600">${remaining.toLocaleString()}</p>
          </div>
          <div className="p-4 bg-success-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Time to Goal</p>
            <p className="text-xl font-semibold text-success-600">
              {monthsToGoal === 0
                ? 'Goal Reached!'
                : `${Math.floor(monthsToGoal / 12)} years ${monthsToGoal % 12} months`}
            </p>
          </div>

          <div className="p-4 bg-info-50 border-l-4 border-info-500 rounded">
            <p className="text-sm font-semibold text-secondary-900 mb-2">Recommended Amounts</p>
            <ul className="text-xs text-secondary-600 space-y-1">
              <li>• 3 months: Dual income household, stable job</li>
              <li>• 6 months: Single income household</li>
              <li>• 9-12 months: Self-employed, variable income</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* Retirement Calculator */
function RetirementCalculator() {
  const [inputs, setInputs] = useState({
    currentAge: 30,
    retirementAge: 65,
    currentSavings: 50000,
    monthlyContribution: 1000,
    annualReturn: 7,
    retirementSpending: 60000,
  });

  const yearsToRetirement = inputs.retirementAge - inputs.currentAge;
  const monthlyRate = inputs.annualReturn / 100 / 12;
  let balance = inputs.currentSavings;

  for (let month = 0; month < yearsToRetirement * 12; month++) {
    balance = balance * (1 + monthlyRate) + inputs.monthlyContribution;
  }

  const retirementBalance = Math.round(balance);
  const yearsOfRetirement = Math.floor(retirementBalance / inputs.retirementSpending);

  return (
    <Card>
      <h2 className="text-2xl font-bold text-secondary-900 mb-6">Retirement Planner</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Input
            label="Current Age"
            type="number"
            value={inputs.currentAge}
            onChange={(e) => setInputs({ ...inputs, currentAge: parseInt(e.target.value) })}
          />
          <Input
            label="Retirement Age"
            type="number"
            value={inputs.retirementAge}
            onChange={(e) => setInputs({ ...inputs, retirementAge: parseInt(e.target.value) })}
          />
          <Input
            label="Current Retirement Savings"
            type="number"
            value={inputs.currentSavings}
            onChange={(e) => setInputs({ ...inputs, currentSavings: parseFloat(e.target.value) })}
          />
          <Input
            label="Monthly Contribution"
            type="number"
            value={inputs.monthlyContribution}
            onChange={(e) =>
              setInputs({ ...inputs, monthlyContribution: parseFloat(e.target.value) })
            }
          />
          <Input
            label="Expected Annual Return (%)"
            type="number"
            value={inputs.annualReturn}
            onChange={(e) => setInputs({ ...inputs, annualReturn: parseFloat(e.target.value) })}
            step="0.1"
          />
          <Input
            label="Annual Retirement Spending"
            type="number"
            value={inputs.retirementSpending}
            onChange={(e) =>
              setInputs({ ...inputs, retirementSpending: parseFloat(e.target.value) })
            }
          />
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Projected Retirement Balance</p>
            <p className="text-2xl font-bold text-primary-600">
              ${retirementBalance.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-success-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Years Until Retirement</p>
            <p className="text-xl font-semibold text-success-600">{yearsToRetirement} years</p>
          </div>
          <div className="p-4 bg-info-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Estimated Years in Retirement</p>
            <p className="text-xl font-semibold text-info-600">{yearsOfRetirement} years</p>
          </div>

          <div className="p-4 bg-warning-50 border-l-4 border-warning-500 rounded">
            <p className="text-sm font-semibold text-secondary-900 mb-2">Note</p>
            <p className="text-xs text-secondary-600">
              This is a simplified calculation. Consider inflation, healthcare costs, and consult a
              financial advisor for comprehensive retirement planning.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

/* Mortgage Calculator */
function MortgageCalculator() {
  const [inputs, setInputs] = useState({
    homePrice: 300000,
    downPayment: 60000,
    interestRate: 6.5,
    loanTerm: 30,
  });

  const loanAmount = inputs.homePrice - inputs.downPayment;
  const monthlyRate = inputs.interestRate / 100 / 12;
  const numPayments = inputs.loanTerm * 12;
  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
  const totalPaid = monthlyPayment * numPayments;
  const totalInterest = totalPaid - loanAmount;

  return (
    <Card>
      <h2 className="text-2xl font-bold text-secondary-900 mb-6">Mortgage Calculator</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Input
            label="Home Price"
            type="number"
            value={inputs.homePrice}
            onChange={(e) => setInputs({ ...inputs, homePrice: parseFloat(e.target.value) })}
          />
          <Input
            label="Down Payment"
            type="number"
            value={inputs.downPayment}
            onChange={(e) => setInputs({ ...inputs, downPayment: parseFloat(e.target.value) })}
          />
          <Input
            label="Interest Rate (%)"
            type="number"
            value={inputs.interestRate}
            onChange={(e) => setInputs({ ...inputs, interestRate: parseFloat(e.target.value) })}
            step="0.1"
          />
          <Input
            label="Loan Term (years)"
            type="number"
            value={inputs.loanTerm}
            onChange={(e) => setInputs({ ...inputs, loanTerm: parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-primary-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Monthly Payment</p>
            <p className="text-2xl font-bold text-primary-600">
              ${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="p-4 bg-secondary-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Loan Amount</p>
            <p className="text-xl font-semibold text-secondary-900">
              ${loanAmount.toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-warning-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Total Interest Paid</p>
            <p className="text-xl font-semibold text-warning-600">
              ${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="p-4 bg-info-50 rounded-lg">
            <p className="text-sm text-secondary-600 mb-1">Total Amount Paid</p>
            <p className="text-xl font-semibold text-info-600">
              ${totalPaid.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
