import { PrismaClient, PromptCategory, TriggerType } from '@prisma/client';

const prisma = new PrismaClient();

const modules = [
  // PHASE 1: Foundations
  {
    phase_number: 1,
    module_number: 1,
    title: 'Your Money Story',
    description: 'Understand your relationship with money and create your financial vision statement',
    estimated_duration: 45,
    order_index: 1,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'Understanding Your Money Mindset',
        content_type: 'text' as const,
        content_data: {
          body: 'Your relationship with money shapes every financial decision you make. Let\'s explore where your money beliefs come from.',
          key_takeaways: [
            'Money mindset is shaped by family, culture, and experiences',
            'Identifying limiting beliefs is the first step to change',
            'A positive money mindset enables better financial decisions'
          ]
        },
        order_index: 1
      },
      {
        section_number: 2,
        section_title: 'Create Your Financial Vision',
        content_type: 'interactive' as const,
        content_data: {
          body: 'Write a financial vision statement that describes where you want to be in 5-10 years.',
          instructions: 'Consider: Where do you want to live? What kind of work do you want to do? What does financial freedom mean to you?'
        },
        order_index: 2
      }
    ]
  },
  {
    phase_number: 1,
    module_number: 2,
    title: 'Financial Snapshot',
    description: 'Assess your current financial position and calculate your net worth',
    estimated_duration: 60,
    order_index: 2,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'Understanding Net Worth',
        content_type: 'text' as const,
        content_data: {
          body: 'Net worth is the total value of everything you own (assets) minus everything you owe (liabilities).',
          key_takeaways: [
            'Net worth = Assets - Liabilities',
            'Track net worth quarterly to measure progress',
            'Starting point doesn\'t matter, trajectory does'
          ]
        },
        order_index: 1
      },
      {
        section_number: 2,
        section_title: 'Calculate Your Net Worth',
        content_type: 'calculator' as const,
        content_data: {
          calculator_type: 'financial_snapshot',
          instructions: 'List all your assets (cash, investments, property) and liabilities (debts, loans)'
        },
        order_index: 2
      }
    ]
  },
  {
    phase_number: 1,
    module_number: 3,
    title: 'Budgeting Fundamentals',
    description: 'Master the art of tracking income and expenses to take control of your cash flow',
    estimated_duration: 90,
    order_index: 3,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'Why Budgeting Matters',
        content_type: 'text' as const,
        content_data: {
          body: 'A budget is simply a plan for your money. It tells your money where to go instead of wondering where it went.',
          key_takeaways: [
            'Budgets provide clarity and control',
            'Track spending for 30 days before setting budget',
            '50/30/20 rule: 50% needs, 30% wants, 20% savings'
          ]
        },
        order_index: 1
      },
      {
        section_number: 2,
        section_title: 'Create Your First Budget',
        content_type: 'calculator' as const,
        content_data: {
          calculator_type: 'budget_tracker',
          instructions: 'Input your monthly income and categorize your expenses'
        },
        order_index: 2
      }
    ]
  },
  {
    phase_number: 1,
    module_number: 4,
    title: 'Debt Strategy',
    description: 'Understand different types of debt and create a payoff plan',
    estimated_duration: 75,
    order_index: 4,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'Good Debt vs Bad Debt',
        content_type: 'text' as const,
        content_data: {
          body: 'Not all debt is created equal. Understanding the difference helps you prioritize payoff strategies.',
          key_takeaways: [
            'High-interest debt (credit cards) should be eliminated first',
            'Avalanche method: Pay highest interest first',
            'Snowball method: Pay smallest balance first for motivation'
          ]
        },
        order_index: 1
      },
      {
        section_number: 2,
        section_title: 'Create Your Debt Payoff Plan',
        content_type: 'calculator' as const,
        content_data: {
          calculator_type: 'debt_payoff',
          instructions: 'List all debts with balances, interest rates, and minimum payments'
        },
        order_index: 2
      }
    ]
  },
  {
    phase_number: 1,
    module_number: 5,
    title: 'Emergency Fund Essentials',
    description: 'Build your financial safety net to protect against unexpected expenses',
    estimated_duration: 60,
    order_index: 5,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'Why You Need an Emergency Fund',
        content_type: 'text' as const,
        content_data: {
          body: 'An emergency fund is your financial buffer that keeps you from going into debt when unexpected expenses arise.',
          key_takeaways: [
            'Start with $1,000 as a mini emergency fund',
            'Build to 3-6 months of expenses',
            'Keep in high-yield savings account'
          ]
        },
        order_index: 1
      },
      {
        section_number: 2,
        section_title: 'Calculate Your Emergency Fund Goal',
        content_type: 'calculator' as const,
        content_data: {
          calculator_type: 'emergency_fund',
          instructions: 'Determine your monthly expenses and target months of coverage'
        },
        order_index: 2
      }
    ]
  },

  // PHASE 2: Building Wealth
  {
    phase_number: 2,
    module_number: 6,
    title: 'Investment Foundations',
    description: 'Learn the basics of investing, compound growth, and time value of money',
    estimated_duration: 90,
    order_index: 6,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'The Power of Compound Interest',
        content_type: 'text' as const,
        content_data: {
          body: 'Compound interest is earning interest on your interest. It\'s the most powerful force in building wealth.',
          key_takeaways: [
            'Time in market beats timing the market',
            'Start early, even with small amounts',
            'Consistency matters more than large sums'
          ]
        },
        order_index: 1
      },
      {
        section_number: 2,
        section_title: 'See Compound Growth in Action',
        content_type: 'calculator' as const,
        content_data: {
          calculator_type: 'compound_growth',
          instructions: 'Input your starting amount, monthly contribution, and expected return'
        },
        order_index: 2
      }
    ]
  },
  {
    phase_number: 2,
    module_number: 7,
    title: 'Investment Accounts',
    description: 'Understand different investment account types and tax advantages',
    estimated_duration: 75,
    order_index: 7,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'Types of Investment Accounts',
        content_type: 'text' as const,
        content_data: {
          body: 'Different account types offer different tax advantages. Choosing the right accounts can save thousands.',
          key_takeaways: [
            '401(k): Pre-tax contributions, employer match',
            'Roth IRA: After-tax contributions, tax-free growth',
            'Taxable brokerage: Flexibility, no contribution limits'
          ]
        },
        order_index: 1
      }
    ]
  },
  {
    phase_number: 2,
    module_number: 8,
    title: 'Building Your Portfolio',
    description: 'Learn about asset allocation, diversification, and risk management',
    estimated_duration: 90,
    order_index: 8,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'Asset Allocation Basics',
        content_type: 'text' as const,
        content_data: {
          body: 'Asset allocation is how you divide investments between stocks, bonds, and other assets.',
          key_takeaways: [
            'Diversification reduces risk',
            'Age affects risk tolerance',
            'Rebalance annually'
          ]
        },
        order_index: 1
      },
      {
        section_number: 2,
        section_title: 'Calculate Investment Growth',
        content_type: 'calculator' as const,
        content_data: {
          calculator_type: 'investment_growth',
          instructions: 'Project your portfolio growth with different return rates'
        },
        order_index: 2
      }
    ]
  },
  {
    phase_number: 2,
    module_number: 9,
    title: 'Index Funds & ETFs',
    description: 'Discover low-cost index investing and passive investment strategies',
    estimated_duration: 60,
    order_index: 9,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'Why Index Funds Win',
        content_type: 'text' as const,
        content_data: {
          body: 'Index funds provide instant diversification at low cost, consistently outperforming actively managed funds.',
          key_takeaways: [
            'Lower fees mean higher returns',
            'Diversification reduces risk',
            'Passive investing beats active for most investors'
          ]
        },
        order_index: 1
      }
    ]
  },

  // PHASE 3: Building Assets & Major Goals
  {
    phase_number: 3,
    module_number: 10,
    title: 'Home Ownership Planning',
    description: 'Understand the true costs of home ownership and when it makes sense',
    estimated_duration: 90,
    order_index: 10,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'Rent vs Buy Analysis',
        content_type: 'text' as const,
        content_data: {
          body: 'Home ownership isn\'t always the best financial decision. Let\'s look at the true costs.',
          key_takeaways: [
            'Consider opportunity cost of down payment',
            'Factor in maintenance, taxes, insurance',
            'Plan to stay 5+ years for buying to make sense'
          ]
        },
        order_index: 1
      }
    ]
  },
  {
    phase_number: 3,
    module_number: 11,
    title: 'Mortgage Mastery',
    description: 'Learn about different mortgage types, rates, and the true cost of borrowing',
    estimated_duration: 75,
    order_index: 11,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'Understanding Mortgages',
        content_type: 'text' as const,
        content_data: {
          body: 'A mortgage is likely the largest debt you\'ll ever have. Understanding it fully is crucial.',
          key_takeaways: [
            '15-year vs 30-year: trade monthly payment for total interest',
            'Interest rate matters: even 0.5% difference is significant',
            '20% down payment avoids PMI'
          ]
        },
        order_index: 1
      },
      {
        section_number: 2,
        section_title: 'Calculate Mortgage Payment',
        content_type: 'calculator' as const,
        content_data: {
          calculator_type: 'mortgage',
          instructions: 'Input home price, down payment, interest rate, and loan term'
        },
        order_index: 2
      }
    ]
  },
  {
    phase_number: 3,
    module_number: 12,
    title: 'Building Home Equity',
    description: 'Strategies for accelerating mortgage payoff and building wealth through real estate',
    estimated_duration: 60,
    order_index: 12,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'Equity Building Strategies',
        content_type: 'text' as const,
        content_data: {
          body: 'Home equity builds through principal payments and appreciation. You can accelerate both.',
          key_takeaways: [
            'Extra payments go directly to principal',
            'Bi-weekly payments = 1 extra payment per year',
            'Balance equity building with investing'
          ]
        },
        order_index: 1
      }
    ]
  },
  {
    phase_number: 3,
    module_number: 13,
    title: 'Major Life Goals',
    description: 'Plan for multiple financial goals simultaneously using priority frameworks',
    estimated_duration: 75,
    order_index: 13,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'Prioritizing Multiple Goals',
        content_type: 'text' as const,
        content_data: {
          body: 'You can\'t do everything at once. Learn to prioritize what matters most.',
          key_takeaways: [
            'Emergency fund comes first',
            'Employer match is free money',
            'Balance debt payoff with investing'
          ]
        },
        order_index: 1
      }
    ]
  },

  // PHASE 4: Long-Term Mastery
  {
    phase_number: 4,
    module_number: 14,
    title: 'Retirement Planning Deep Dive',
    description: 'Master retirement calculations, withdrawal strategies, and long-term planning',
    estimated_duration: 90,
    order_index: 14,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'How Much Do You Need?',
        content_type: 'text' as const,
        content_data: {
          body: 'Retirement planning starts with knowing your target number. Let\'s calculate it.',
          key_takeaways: [
            '25x annual expenses is a common target',
            '4% withdrawal rate historically sustainable',
            'Account for inflation and healthcare costs'
          ]
        },
        order_index: 1
      },
      {
        section_number: 2,
        section_title: 'Calculate Retirement Needs',
        content_type: 'calculator' as const,
        content_data: {
          calculator_type: 'retirement_planning',
          instructions: 'Input age, savings, contributions, and retirement expenses'
        },
        order_index: 2
      }
    ]
  },
  {
    phase_number: 4,
    module_number: 15,
    title: 'Advanced Tax Optimization',
    description: 'Strategies for minimizing taxes and maximizing after-tax returns',
    estimated_duration: 75,
    order_index: 15,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'Tax-Efficient Investing',
        content_type: 'text' as const,
        content_data: {
          body: 'Where you hold investments matters as much as what you invest in.',
          key_takeaways: [
            'Tax-loss harvesting reduces taxable income',
            'Asset location: bonds in tax-advantaged accounts',
            'Roth conversions in low-income years'
          ]
        },
        order_index: 1
      }
    ]
  },
  {
    phase_number: 4,
    module_number: 16,
    title: 'Estate Planning Basics',
    description: 'Protect your wealth and ensure your wishes are carried out',
    estimated_duration: 60,
    order_index: 16,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'Essential Estate Documents',
        content_type: 'text' as const,
        content_data: {
          body: 'Estate planning isn\'t just for the wealthy. Everyone needs these basic documents.',
          key_takeaways: [
            'Will: distributes assets after death',
            'Power of attorney: financial decisions if incapacitated',
            'Healthcare directive: medical wishes'
          ]
        },
        order_index: 1
      }
    ]
  },
  {
    phase_number: 4,
    module_number: 17,
    title: 'Financial Independence',
    description: 'Strategies for achieving financial independence and optional early retirement',
    estimated_duration: 90,
    order_index: 17,
    prerequisites: [],
    content: [
      {
        section_number: 1,
        section_title: 'The FIRE Movement',
        content_type: 'text' as const,
        content_data: {
          body: 'Financial Independence, Retire Early (FIRE) is about having choices, not necessarily quitting work.',
          key_takeaways: [
            'High savings rate is the key',
            'Reduce expenses to accelerate timeline',
            'Financial independence = freedom to choose'
          ]
        },
        order_index: 1
      }
    ]
  }
];

const journalPrompts = [
  // Money Mindset Prompts
  { prompt_text: 'What are three beliefs about money that you learned growing up?', category: PromptCategory.money_mindset, trigger_type: TriggerType.onboarding, uses_name: false, uses_goal_data: false, priority: 10 },
  { prompt_text: 'What does financial freedom mean to you personally?', category: PromptCategory.money_mindset, trigger_type: TriggerType.onboarding, uses_name: false, uses_goal_data: false, priority: 9 },
  { prompt_text: 'Describe your relationship with money in three words. Why did you choose those words?', category: PromptCategory.money_mindset, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'What money decision are you most proud of? What made it successful?', category: PromptCategory.money_mindset, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'When do you feel most anxious about money? What triggers that anxiety?', category: PromptCategory.money_mindset, trigger_type: TriggerType.mood_low, uses_name: false, uses_goal_data: false, priority: 8 },
  { prompt_text: 'What would you do differently with money if you had no fear?', category: PromptCategory.money_mindset, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 4 },
  { prompt_text: 'How has your relationship with money changed in the past year?', category: PromptCategory.money_mindset, trigger_type: TriggerType.time_based, uses_name: false, uses_goal_data: false, priority: 6 },
  { prompt_text: 'What money habit would you like to break? What would replace it?', category: PromptCategory.money_mindset, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'Who has positively influenced your financial thinking? What did they teach you?', category: PromptCategory.money_mindset, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 4 },
  { prompt_text: 'What money belief served you in the past but no longer serves you now?', category: PromptCategory.money_mindset, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 4 },

  // Goal Setting Prompts
  { prompt_text: 'Fast forward 5 years. You\'ve achieved your financial goals. Describe a typical day in your life.', category: PromptCategory.goal_setting, trigger_type: TriggerType.goal_created, uses_name: false, uses_goal_data: true, priority: 10 },
  { prompt_text: 'Why is this goal important to you right now?', category: PromptCategory.goal_setting, trigger_type: TriggerType.goal_created, uses_name: false, uses_goal_data: true, priority: 9 },
  { prompt_text: 'What will achieving this goal make possible for you?', category: PromptCategory.goal_setting, trigger_type: TriggerType.goal_created, uses_name: false, uses_goal_data: true, priority: 8 },
  { prompt_text: 'What obstacles might prevent you from reaching this goal? How will you overcome them?', category: PromptCategory.goal_setting, trigger_type: TriggerType.goal_created, uses_name: false, uses_goal_data: true, priority: 7 },
  { prompt_text: 'Break down your big goal into 3-5 smaller milestones. What\'s the first step?', category: PromptCategory.goal_setting, trigger_type: TriggerType.goal_created, uses_name: false, uses_goal_data: true, priority: 8 },
  { prompt_text: 'Who can support you in achieving this goal? How will you ask for their support?', category: PromptCategory.goal_setting, trigger_type: TriggerType.goal_created, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'What sacrifices or trade-offs will this goal require? Are you willing to make them?', category: PromptCategory.goal_setting, trigger_type: TriggerType.goal_created, uses_name: false, uses_goal_data: true, priority: 6 },
  { prompt_text: 'If you achieve only 50% of this goal, what would that look like? Would that still be valuable?', category: PromptCategory.goal_setting, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: true, priority: 4 },
  { prompt_text: 'What new skills or knowledge do you need to achieve this goal?', category: PromptCategory.goal_setting, trigger_type: TriggerType.goal_created, uses_name: false, uses_goal_data: true, priority: 6 },
  { prompt_text: 'How will you celebrate when you reach this goal?', category: PromptCategory.goal_setting, trigger_type: TriggerType.goal_created, uses_name: false, uses_goal_data: true, priority: 7 },

  // Challenges Prompts
  { prompt_text: 'What financial challenge are you facing right now? What have you already tried?', category: PromptCategory.challenges, trigger_type: TriggerType.mood_low, uses_name: false, uses_goal_data: false, priority: 9 },
  { prompt_text: 'Describe a financial setback you experienced. What did you learn from it?', category: PromptCategory.challenges, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'What money mistake do you keep making? Why do you think that pattern continues?', category: PromptCategory.challenges, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 6 },
  { prompt_text: 'If a friend faced your current financial challenge, what advice would you give them?', category: PromptCategory.challenges, trigger_type: TriggerType.mood_low, uses_name: false, uses_goal_data: false, priority: 7 },
  { prompt_text: 'What\'s one small thing you could do today to feel more in control of your finances?', category: PromptCategory.challenges, trigger_type: TriggerType.mood_low, uses_name: false, uses_goal_data: false, priority: 8 },
  { prompt_text: 'When you overcome your current financial challenge, what will be possible?', category: PromptCategory.challenges, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'What support or resources could help you with this challenge?', category: PromptCategory.challenges, trigger_type: TriggerType.mood_low, uses_name: false, uses_goal_data: false, priority: 6 },
  { prompt_text: 'How have you successfully overcome financial challenges in the past?', category: PromptCategory.challenges, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'What would "good enough" progress look like on this challenge?', category: PromptCategory.challenges, trigger_type: TriggerType.mood_low, uses_name: false, uses_goal_data: false, priority: 6 },
  { prompt_text: 'What\'s the worst that could happen? What\'s the best that could happen?', category: PromptCategory.challenges, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 4 },

  // Gratitude Prompts
  { prompt_text: 'What are you grateful for financially today, even if it\'s small?', category: PromptCategory.gratitude, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 7 },
  { prompt_text: 'What financial resource or opportunity do you have now that you didn\'t have a year ago?', category: PromptCategory.gratitude, trigger_type: TriggerType.time_based, uses_name: false, uses_goal_data: false, priority: 6 },
  { prompt_text: 'Who has helped you financially or taught you about money? How can you thank them?', category: PromptCategory.gratitude, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'What bill or expense are you grateful you can afford?', category: PromptCategory.gratitude, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'What money decision from your past self are you thankful for today?', category: PromptCategory.gratitude, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 6 },
  { prompt_text: 'What abundance exists in your life beyond money?', category: PromptCategory.gratitude, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 4 },
  { prompt_text: 'How has learning about finance improved your life?', category: PromptCategory.gratitude, trigger_type: TriggerType.module_complete, uses_name: false, uses_goal_data: false, priority: 7 },
  { prompt_text: 'What financial freedom, even if small, do you already have?', category: PromptCategory.gratitude, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'What low-cost or free thing brought you joy this week?', category: PromptCategory.gratitude, trigger_type: TriggerType.time_based, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'How have your financial challenges made you stronger or wiser?', category: PromptCategory.gratitude, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 4 },

  // Future Vision Prompts
  { prompt_text: 'Imagine your ideal financial life 10 years from now. Describe it in vivid detail.', category: PromptCategory.future_vision, trigger_type: TriggerType.onboarding, uses_name: false, uses_goal_data: false, priority: 9 },
  { prompt_text: 'What does "enough" money mean to you? How will you know when you have enough?', category: PromptCategory.future_vision, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 6 },
  { prompt_text: 'If money was no object, how would you spend your time?', category: PromptCategory.future_vision, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'What legacy do you want to leave through your financial decisions?', category: PromptCategory.future_vision, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 4 },
  { prompt_text: 'Fast forward to retirement. What do you want to remember about your financial journey?', category: PromptCategory.future_vision, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'What financial security would allow you to take your biggest career risk?', category: PromptCategory.future_vision, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 4 },
  { prompt_text: 'Describe your dream home. What makes it perfect for you?', category: PromptCategory.future_vision, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'If you achieved financial independence, what would your typical week look like?', category: PromptCategory.future_vision, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 6 },
  { prompt_text: 'What experiences do you want to have in the next 5 years? How will you fund them?', category: PromptCategory.future_vision, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'How do you want to support causes or people you care about financially?', category: PromptCategory.future_vision, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 4 },

  // Reflection Prompts
  { prompt_text: 'What surprised you most in this module?', category: PromptCategory.reflection, trigger_type: TriggerType.module_complete, uses_name: false, uses_goal_data: false, priority: 10 },
  { prompt_text: 'What\'s your biggest takeaway from this module? How will you apply it?', category: PromptCategory.reflection, trigger_type: TriggerType.module_complete, uses_name: false, uses_goal_data: false, priority: 10 },
  { prompt_text: 'What questions do you still have after completing this module?', category: PromptCategory.reflection, trigger_type: TriggerType.module_complete, uses_name: false, uses_goal_data: false, priority: 8 },
  { prompt_text: 'Reflect on your progress this week. What are you proud of?', category: PromptCategory.reflection, trigger_type: TriggerType.streak, uses_name: false, uses_goal_data: false, priority: 9 },
  { prompt_text: 'What financial habit have you developed or strengthened recently?', category: PromptCategory.reflection, trigger_type: TriggerType.time_based, uses_name: false, uses_goal_data: false, priority: 6 },
  { prompt_text: 'How has your financial confidence changed since you started this journey?', category: PromptCategory.reflection, trigger_type: TriggerType.time_based, uses_name: false, uses_goal_data: false, priority: 7 },
  { prompt_text: 'What would you tell your past self about money?', category: PromptCategory.reflection, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 5 },
  { prompt_text: 'What money decision are you currently wrestling with? What are the pros and cons?', category: PromptCategory.reflection, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 6 },
  { prompt_text: 'How do you feel about your finances right now? What\'s driving that feeling?', category: PromptCategory.reflection, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 6 },
  { prompt_text: 'What financial concept finally "clicked" for you? Why did it click?', category: PromptCategory.reflection, trigger_type: TriggerType.module_complete, uses_name: false, uses_goal_data: false, priority: 7 },

  // Celebration Prompts
  { prompt_text: 'You\'ve reached a milestone! What does this achievement mean to you?', category: PromptCategory.celebration, trigger_type: TriggerType.goal_milestone, uses_name: false, uses_goal_data: true, priority: 10 },
  { prompt_text: 'Celebrate this win! How did you make this happen?', category: PromptCategory.celebration, trigger_type: TriggerType.goal_milestone, uses_name: false, uses_goal_data: true, priority: 9 },
  { prompt_text: 'What small financial win can you celebrate today?', category: PromptCategory.celebration, trigger_type: TriggerType.random, uses_name: false, uses_goal_data: false, priority: 6 },
  { prompt_text: 'You\'ve completed a module! What will you do differently because of what you learned?', category: PromptCategory.celebration, trigger_type: TriggerType.module_complete, uses_name: false, uses_goal_data: false, priority: 9 },
  { prompt_text: 'You\'re on a streak! What\'s motivating you to keep going?', category: PromptCategory.celebration, trigger_type: TriggerType.streak, uses_name: false, uses_goal_data: false, priority: 8 },
  { prompt_text: 'How will you celebrate this financial milestone? You\'ve earned it!', category: PromptCategory.celebration, trigger_type: TriggerType.goal_milestone, uses_name: false, uses_goal_data: true, priority: 8 },
  { prompt_text: 'What does this progress tell you about yourself?', category: PromptCategory.celebration, trigger_type: TriggerType.streak, uses_name: false, uses_goal_data: false, priority: 7 },
  { prompt_text: 'Who would be proud of you for this achievement? How would they celebrate with you?', category: PromptCategory.celebration, trigger_type: TriggerType.goal_milestone, uses_name: false, uses_goal_data: false, priority: 6 },
  { prompt_text: 'What obstacle did you overcome to get here? How does it feel?', category: PromptCategory.celebration, trigger_type: TriggerType.goal_milestone, uses_name: false, uses_goal_data: true, priority: 7 },
  { prompt_text: 'Looking back at where you started, how far have you come?', category: PromptCategory.celebration, trigger_type: TriggerType.streak, uses_name: false, uses_goal_data: false, priority: 7 },
];

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  console.log('Clearing existing module data...');
  await prisma.moduleContent.deleteMany();
  await prisma.module.deleteMany();

  console.log('Clearing existing journal prompts...');
  await prisma.journalPrompt.deleteMany();

  // Create modules and content
  for (const moduleData of modules) {
    const { content, ...moduleInfo } = moduleData;

    console.log(`Creating module: ${moduleInfo.title}`);

    const module = await prisma.module.create({
      data: moduleInfo,
    });

    // Create content sections
    for (const contentSection of content) {
      await prisma.moduleContent.create({
        data: {
          ...contentSection,
          module_id: module.id,
        },
      });
    }
  }

  // Create journal prompts
  console.log('Seeding journal prompts...');
  for (const promptData of journalPrompts) {
    await prisma.journalPrompt.create({
      data: {
        ...promptData,
        is_active: true,
      },
    });
  }

  console.log('Seed completed successfully!');
  console.log(`Created ${modules.length} modules with content`);
  console.log(`Created ${journalPrompts.length} journal prompts`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
