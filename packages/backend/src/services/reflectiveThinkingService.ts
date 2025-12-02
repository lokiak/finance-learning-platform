import { prisma } from '../index';
import {
  ProblematicSituation,
  ReflectiveThinkingProcess,
  ReflectiveHypothesis,
  HabitsOfMind,
  LanguageActivity,
  ReflectionGuidance,
} from '@finance-platform/shared';

export class ReflectiveThinkingService {
  /**
   * Generate problematic situation for a module (Step 1: Felt Difficulty)
   */
  static async generateProblematicSituation(
    userId: string,
    moduleId: string
  ): Promise<ProblematicSituation> {
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });

    if (!module) {
      throw new Error('Module not found');
    }

    // Get user's financial profile for personalization
    const userProfile = await prisma.userProfile.findUnique({
      where: { user_id: userId },
    });

    // Generate problematic situation based on module type
    // This is rule-based - in a real implementation, these would be stored in module content
    const problematicSituations: Record<string, ProblematicSituation> = {
      // Example for budgeting module
      'budgeting': {
        trigger: {
          type: 'contradiction',
          context: 'User wants to save but spends more than earns',
          user_relevance: 'high',
        },
        problem_statement: `You want to save $500/month, but after tracking expenses, you're spending $200 more than you earn. This contradicts your goal.`,
        prior_beliefs: [
          {
            assumption: 'I thought I was spending less than I earn',
            challenge: 'The numbers show otherwise. Let\'s investigate why.',
          },
        ],
        reflection_prompt: 'How does this situation make you feel? What surprises or confuses you?',
      },
      // Default problematic situation
      'default': {
        trigger: {
          type: 'real_world_problem',
          context: `Understanding ${module.title} requires applying concepts to your personal situation`,
          user_relevance: 'high',
        },
        problem_statement: `How does ${module.title} apply to your current financial situation? What challenges do you face?`,
        prior_beliefs: [
          {
            assumption: 'This concept might not apply to me',
            challenge: 'Let\'s explore how it connects to your goals and situation.',
          },
        ],
        reflection_prompt: 'What questions do you have about this topic? What seems unclear?',
      },
    };

    // Select problematic situation based on module title or use default
    const situationKey = module.title.toLowerCase().includes('budget') ? 'budgeting' : 'default';
    return problematicSituations[situationKey];
  }

  /**
   * Start reflective thinking process for a module
   */
  static async startReflectionProcess(
    userId: string,
    moduleId: string,
    sectionId?: string
  ): Promise<ReflectiveThinkingProcess> {
    const problematicSituation = await this.generateProblematicSituation(userId, moduleId);

    const process = await prisma.reflectiveThinkingProcess.create({
      data: {
        user_id: userId,
        module_id: moduleId,
        section_id: sectionId,
        problematic_situation: problematicSituation as any,
        current_step: 1,
        completed: false,
        user_hypotheses: [],
        problem_definition_complete: false,
        real_world_applied: false,
      },
    });

    return process as any;
  }

  /**
   * Update reflection step (Step 2: Problem Definition)
   */
  static async updateProblemDefinition(
    processId: string,
    userId: string,
    data: {
      user_articulation: string;
      clarification_answers?: Record<string, boolean>;
    }
  ): Promise<ReflectiveThinkingProcess> {
    const process = await prisma.reflectiveThinkingProcess.findUnique({
      where: { id: processId },
    });

    if (!process || process.user_id !== userId) {
      throw new Error('Process not found or access denied');
    }

    // Refine problem statement based on user articulation
    const refinedProblem = data.user_articulation;

    const updated = await prisma.reflectiveThinkingProcess.update({
      where: { id: processId },
      data: {
        initial_problem: data.user_articulation,
        refined_problem: refinedProblem,
        problem_definition_complete: true,
        current_step: 3, // Move to hypothesis generation
      },
    });

    return updated as any;
  }

  /**
   * Generate hypotheses (Step 3: Hypothesis Generation)
   */
  static async generateHypotheses(
    processId: string,
    userId: string,
    userHypotheses: string[]
  ): Promise<{ hypotheses: ReflectiveHypothesis[]; alternative_perspectives: string[] }> {
    const process = await prisma.reflectiveThinkingProcess.findUnique({
      where: { id: processId },
    });

    if (!process || process.user_id !== userId) {
      throw new Error('Process not found or access denied');
    }

    // Create hypothesis records
    const hypotheses = await Promise.all(
      userHypotheses.map(async (hypothesisText) => {
        return await prisma.reflectiveHypothesis.create({
          data: {
            process_id: processId,
            user_id: userId,
            hypothesis_text: hypothesisText,
            source: 'user',
            status: 'generated',
          },
        });
      })
    );

    // Generate alternative perspectives (rule-based)
    const alternativePerspectives = [
      'What if you focused on one aspect at a time?',
      'What if you started smaller and built up?',
      'What if you considered the long-term implications?',
    ];

    // Update process with hypotheses
    await prisma.reflectiveThinkingProcess.update({
      where: { id: processId },
      data: {
        user_hypotheses: userHypotheses,
        alternative_hypotheses: alternativePerspectives,
        current_step: 4, // Move to reasoning
      },
    });

    return {
      hypotheses: hypotheses as any,
      alternative_perspectives: alternativePerspectives,
    };
  }

  /**
   * Evaluate a hypothesis (Step 4: Reasoning)
   */
  static async evaluateHypothesis(
    processId: string,
    hypothesisId: string,
    userId: string,
    data: {
      feasibility_score: number;
      impact_score: number;
      sustainability_score: number;
      supporting_evidence?: string[];
      opposing_evidence?: string[];
      consequences_if_true?: string[];
      consequences_if_false?: string[];
    }
  ): Promise<ReflectiveHypothesis> {
    const hypothesis = await prisma.reflectiveHypothesis.findUnique({
      where: { id: hypothesisId },
    });

    if (!hypothesis || hypothesis.user_id !== userId || hypothesis.process_id !== processId) {
      throw new Error('Hypothesis not found or access denied');
    }

    const overallScore = (data.feasibility_score + data.impact_score + data.sustainability_score) / 3;

    const updated = await prisma.reflectiveHypothesis.update({
      where: { id: hypothesisId },
      data: {
        feasibility_score: data.feasibility_score,
        impact_score: data.impact_score,
        sustainability_score: data.sustainability_score,
        supporting_evidence: data.supporting_evidence || [],
        opposing_evidence: data.opposing_evidence || [],
        consequences_if_true: data.consequences_if_true || [],
        consequences_if_false: data.consequences_if_false || [],
        status: 'evaluated',
      },
    });

    // Update process with reasoning data
    await prisma.reflectiveThinkingProcess.update({
      where: { id: processId },
      data: {
        evidence_gathered: [
          {
            source: 'user_evaluation',
            relevance: 'Direct assessment of hypothesis',
            supports_hypothesis: overallScore > 6 ? 'yes' : 'partial',
          },
        ],
        consequence_analysis: [
          {
            hypothesis: hypothesis.hypothesis_text,
            if_true: data.consequences_if_true || [],
            if_false: data.consequences_if_false || [],
            uncertainty: [],
          },
        ],
      },
    });

    return updated as any;
  }

  /**
   * Test hypothesis (Step 5: Testing)
   */
  static async testHypothesis(
    processId: string,
    userId: string,
    data: {
      selected_hypothesis_id: string;
      action_plan: string;
      calculator_used?: string;
      calculator_results?: any;
      real_world_applied: boolean;
      test_results?: {
        worked: boolean;
        challenges?: string[];
        insights?: string[];
      };
      reflection_on_results: string;
    }
  ): Promise<ReflectiveThinkingProcess> {
    const process = await prisma.reflectiveThinkingProcess.findUnique({
      where: { id: processId },
    });

    if (!process || process.user_id !== userId) {
      throw new Error('Process not found or access denied');
    }

    // Mark hypothesis as tested
    await prisma.reflectiveHypothesis.update({
      where: { id: data.selected_hypothesis_id },
      data: {
        status: 'tested',
        selected_for_testing: true,
      },
    });

    // Complete the reflection process
    const updated = await prisma.reflectiveThinkingProcess.update({
      where: { id: processId },
      data: {
        selected_hypothesis: data.selected_hypothesis_id,
        action_plan: data.action_plan,
        calculator_used: data.calculator_used,
        real_world_applied: data.real_world_applied,
        test_results: data.test_results || {},
        reflection_on_results: data.reflection_on_results,
        current_step: 5,
        completed: true,
        completed_at: new Date(),
      },
    });

    return updated as any;
  }

  /**
   * Get reflection guidance for current step
   */
  static async getReflectionGuidance(
    processId: string,
    step: number
  ): Promise<ReflectionGuidance> {
    const guidanceByStep: Record<number, ReflectionGuidance> = {
      1: {
        step: 1,
        guidance: 'Take a moment to reflect on this problematic situation. What\'s the core problem here?',
        prompts: [
          'What surprises you about this situation?',
          'What confuses you?',
          'What contradicts your prior beliefs?',
        ],
        required: true,
        next_step: 2,
      },
      2: {
        step: 2,
        guidance: 'Great! Now let\'s refine your understanding of the problem.',
        prompts: [
          'Is it that you\'re earning too little?',
          'Is it that you\'re spending too much?',
          'Is it that your expectations are unrealistic?',
          'Is it a combination?',
        ],
        required: true,
        next_step: 3,
      },
      3: {
        step: 3,
        guidance: 'Now let\'s brainstorm possible solutions. Generate at least 3 hypotheses.',
        prompts: [
          'What are possible solutions?',
          'What alternatives have you considered?',
          'What if you tried a different approach?',
        ],
        required: true,
        next_step: 4,
      },
      4: {
        step: 4,
        guidance: 'Evaluate each hypothesis by considering feasibility, impact, and sustainability.',
        prompts: [
          'What evidence supports this hypothesis?',
          'What are the consequences if this is true?',
          'What are the consequences if this is false?',
        ],
        required: true,
        next_step: 5,
      },
      5: {
        step: 5,
        guidance: 'Now test your selected hypothesis through action. Use calculators, apply to real-world scenarios, and reflect on results.',
        prompts: [
          'How did testing change your understanding?',
          'What worked? What didn\'t?',
          'What would you do differently?',
        ],
        required: true,
      },
    };

    return guidanceByStep[step] || {
      step,
      guidance: 'Continue with the reflection process.',
      required: false,
    };
  }

  /**
   * Assess habits of mind for a module
   */
  static async assessHabitsOfMind(
    userId: string,
    moduleId: string,
    assessmentData: {
      considers_alternatives?: boolean;
      questions_assumptions?: boolean;
      explores_solutions?: boolean;
      considers_consequences?: boolean;
      takes_ownership?: boolean;
      applies_personally?: boolean;
      engagement_level?: number;
      curiosity_demonstrated?: boolean;
      attention_sustained?: boolean;
    }
  ): Promise<HabitsOfMind> {
    // Calculate scores based on indicators
    const openMindednessScore = [
      assessmentData.considers_alternatives,
      assessmentData.questions_assumptions,
      assessmentData.explores_solutions,
    ].filter(Boolean).length * 33.33;

    const responsibilityScore = [
      assessmentData.considers_consequences,
      assessmentData.takes_ownership,
      assessmentData.applies_personally,
    ].filter(Boolean).length * 33.33;

    const wholeHeartednessScore = Math.min(100, (assessmentData.engagement_level || 0) * 10 +
      (assessmentData.curiosity_demonstrated ? 20 : 0) +
      (assessmentData.attention_sustained ? 20 : 0));

    const habits = await prisma.habitsOfMind.create({
      data: {
        user_id: userId,
        module_id: moduleId,
        open_mindedness_score: openMindednessScore,
        considers_alternatives: assessmentData.considers_alternatives || false,
        questions_assumptions: assessmentData.questions_assumptions || false,
        explores_solutions: assessmentData.explores_solutions || false,
        responsibility_score: responsibilityScore,
        considers_consequences: assessmentData.considers_consequences || false,
        takes_ownership: assessmentData.takes_ownership || false,
        applies_personally: assessmentData.applies_personally || false,
        whole_heartedness_score: wholeHeartednessScore,
        engagement_level: assessmentData.engagement_level || 0,
        curiosity_demonstrated: assessmentData.curiosity_demonstrated || false,
        attention_sustained: assessmentData.attention_sustained || false,
        assessment_type: 'module',
      },
    });

    return habits as any;
  }

  /**
   * Evaluate language activity
   */
  static async evaluateLanguageActivity(
    userId: string,
    moduleId: string,
    data: {
      section_id?: string;
      activity_type: 'articulation' | 'hypothesis_writing' | 'reflection' | 'concept_mapping' | 'explanation';
      user_response: string;
      required_elements: {
        use_own_words: boolean;
        provide_examples: boolean;
        explain_reasoning: boolean;
        connect_to_experience: boolean;
      };
    }
  ): Promise<LanguageActivity> {
    // Simple rule-based assessment
    const wordCount = data.user_response.split(/\s+/).length;
    const elementsCompleted = {
      use_own_words: data.required_elements.use_own_words && wordCount > 20,
      provide_examples: data.required_elements.provide_examples && data.user_response.includes('example') || data.user_response.includes('for instance'),
      explain_reasoning: data.required_elements.explain_reasoning && (data.user_response.includes('because') || data.user_response.includes('reason')),
      connect_to_experience: data.required_elements.connect_to_experience && (data.user_response.includes('I') || data.user_response.includes('my')),
    };

    const completedCount = Object.values(elementsCompleted).filter(Boolean).length;
    const requiredCount = Object.values(data.required_elements).filter(Boolean).length;
    const completenessScore = requiredCount > 0 ? (completedCount / requiredCount) * 100 : 0;
    const clarityScore = wordCount > 50 ? 80 : wordCount > 30 ? 60 : 40;
    const overallScore = (completenessScore + clarityScore) / 2;

    const activity = await prisma.languageActivity.create({
      data: {
        user_id: userId,
        module_id: moduleId,
        section_id: data.section_id,
        activity_type: data.activity_type,
        user_response: data.user_response,
        required_elements: data.required_elements as any,
        elements_completed: elementsCompleted as any,
        clarity_score: clarityScore,
        completeness_score: completenessScore,
        overall_score: overallScore,
        feedback_provided: true,
        feedback_content: overallScore > 70
          ? 'Excellent articulation! You clearly explained the concept.'
          : 'Good start! Consider adding more detail and examples.',
      },
    });

    return activity as any;
  }

  /**
   * Get reflection process status
   */
  static async getProcessStatus(processId: string, userId: string): Promise<ReflectiveThinkingProcess> {
    const process = await prisma.reflectiveThinkingProcess.findUnique({
      where: { id: processId },
      include: {
        hypotheses: true,
      },
    });

    if (!process || process.user_id !== userId) {
      throw new Error('Process not found or access denied');
    }

    return process as any;
  }
}

