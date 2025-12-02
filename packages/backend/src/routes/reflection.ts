import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { ReflectiveThinkingService } from '../services/reflectiveThinkingService';

const router = Router();
router.use(authenticate);

// POST /api/reflection/start
router.post(
  '/start',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { module_id, section_id } = req.body;

    if (!module_id) {
      return res.status(400).json({
        error: { code: 'MISSING_PARAMS', message: 'module_id is required' },
      });
    }

    const process = await ReflectiveThinkingService.startReflectionProcess(
      req.user!.userId,
      module_id,
      section_id
    );

    const guidance = await ReflectiveThinkingService.getReflectionGuidance(process.id, 1);

    res.json({
      process_id: process.id,
      step_1: {
        problematic_situation: process.problematic_situation,
      },
      current_step: process.current_step,
      guidance: guidance.guidance,
    });
  })
);

// PUT /api/reflection/:processId/step/:stepNumber
router.put(
  '/:processId/step/:stepNumber',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { processId, stepNumber } = req.params;
    const step = parseInt(stepNumber);

    if (step === 2) {
      // Problem Definition
      const { user_articulation, clarification_answers } = req.body;

      const updated = await ReflectiveThinkingService.updateProblemDefinition(
        processId,
        req.user!.userId,
        {
          user_articulation,
          clarification_answers,
        }
      );

      const guidance = await ReflectiveThinkingService.getReflectionGuidance(processId, 3);

      res.json({
        process_id: processId,
        step_completed: 2,
        refined_problem: updated.refined_problem,
        next_step: 3,
        guidance: guidance.guidance,
      });
    } else {
      res.status(400).json({
        error: { code: 'INVALID_STEP', message: 'This endpoint only handles step 2' },
      });
    }
  })
);

// POST /api/reflection/:processId/hypotheses
router.post(
  '/:processId/hypotheses',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { processId } = req.params;
    const { user_hypotheses } = req.body;

    if (!user_hypotheses || !Array.isArray(user_hypotheses) || user_hypotheses.length === 0) {
      return res.status(400).json({
        error: { code: 'MISSING_PARAMS', message: 'user_hypotheses array is required' },
      });
    }

    const result = await ReflectiveThinkingService.generateHypotheses(
      processId,
      req.user!.userId,
      user_hypotheses
    );

    const guidance = await ReflectiveThinkingService.getReflectionGuidance(processId, 4);

    res.json({
      hypotheses: result.hypotheses,
      alternative_perspectives: result.alternative_perspectives,
      comparison_framework: {
        criteria: ['feasibility', 'impact', 'sustainability'],
        next_step: 'Evaluate each hypothesis',
      },
      guidance: guidance.guidance,
    });
  })
);

// POST /api/reflection/:processId/hypotheses/:hypothesisId/evaluate
router.post(
  '/:processId/hypotheses/:hypothesisId/evaluate',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { processId, hypothesisId } = req.params;
    const {
      feasibility_score,
      impact_score,
      sustainability_score,
      supporting_evidence,
      opposing_evidence,
      consequences_if_true,
      consequences_if_false,
    } = req.body;

    const evaluation = await ReflectiveThinkingService.evaluateHypothesis(
      processId,
      hypothesisId,
      req.user!.userId,
      {
        feasibility_score,
        impact_score,
        sustainability_score,
        supporting_evidence,
        opposing_evidence,
        consequences_if_true,
        consequences_if_false,
      }
    );

    const overallScore = (
      (evaluation.feasibility_score || 0) +
      (evaluation.impact_score || 0) +
      (evaluation.sustainability_score || 0)
    ) / 3;

    const guidance = await ReflectiveThinkingService.getReflectionGuidance(processId, 5);

    res.json({
      hypothesis_id: hypothesisId,
      evaluation: {
        feasibility: evaluation.feasibility_score,
        impact: evaluation.impact_score,
        sustainability: evaluation.sustainability_score,
        overall_score: overallScore,
      },
      recommendation: overallScore > 6
        ? 'Strong hypothesis. Consider testing this approach.'
        : 'Consider exploring alternatives or modifying this hypothesis.',
      next_steps: 'Test this hypothesis or explore alternatives',
      guidance: guidance.guidance,
    });
  })
);

// POST /api/reflection/:processId/test
router.post(
  '/:processId/test',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { processId } = req.params;
    const {
      selected_hypothesis_id,
      action_plan,
      calculator_used,
      calculator_results,
      real_world_applied,
      test_results,
      reflection_on_results,
    } = req.body;

    if (!selected_hypothesis_id || !action_plan || !reflection_on_results) {
      return res.status(400).json({
        error: {
          code: 'MISSING_PARAMS',
          message: 'selected_hypothesis_id, action_plan, and reflection_on_results are required',
        },
      });
    }

    const completed = await ReflectiveThinkingService.testHypothesis(
      processId,
      req.user!.userId,
      {
        selected_hypothesis_id,
        action_plan,
        calculator_used,
        calculator_results,
        real_world_applied: real_world_applied || false,
        test_results,
        reflection_on_results,
      }
    );

    res.json({
      process_id: processId,
      step_completed: 5,
      process_complete: completed.completed,
      final_reflection: {
        problem_solved: true,
        solution: completed.action_plan,
        lessons_learned: test_results?.insights || [],
        next_actions: ['Implement the solution', 'Track results', 'Adjust as needed'],
      },
      mastery_achieved: true,
    });
  })
);

// GET /api/reflection/:processId
router.get(
  '/:processId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { processId } = req.params;

    const process = await ReflectiveThinkingService.getProcessStatus(processId, req.user!.userId);
    const guidance = await ReflectiveThinkingService.getReflectionGuidance(
      processId,
      process.current_step
    );

    res.json({
      process_id: processId,
      module_id: process.module_id,
      current_step: process.current_step,
      completed: process.completed,
      steps: {
        step_1: {
          completed: process.current_step > 1,
          problematic_situation: process.problematic_situation,
          user_reaction: process.user_reaction,
        },
        step_2: {
          completed: process.problem_definition_complete,
          refined_problem: process.refined_problem,
        },
        step_3: {
          completed: process.current_step > 3,
          in_progress: process.current_step === 3,
          hypotheses_generated: process.user_hypotheses?.length || 0,
          hypotheses_evaluated: 0, // Would need to query hypotheses table
        },
        step_4: {
          completed: process.current_step > 4,
          in_progress: process.current_step === 4,
        },
        step_5: {
          completed: process.completed,
          in_progress: process.current_step === 5 && !process.completed,
        },
      },
      guidance: guidance.guidance,
    });
  })
);

// GET /api/reflection/habits-of-mind
router.get(
  '/habits-of-mind',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { module_id } = req.query;

    // This would typically fetch existing habits assessment
    // For now, return a placeholder structure
    res.json({
      message: 'Habits of mind assessment endpoint. Use POST to create assessment.',
      module_id: module_id || null,
    });
  })
);

// POST /api/reflection/habits-of-mind
router.post(
  '/habits-of-mind',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { module_id, ...assessmentData } = req.body;

    if (!module_id) {
      return res.status(400).json({
        error: { code: 'MISSING_PARAMS', message: 'module_id is required' },
      });
    }

    const habits = await ReflectiveThinkingService.assessHabitsOfMind(
      req.user!.userId,
      module_id,
      assessmentData
    );

    res.json({
      open_mindedness: {
        score: habits.open_mindedness_score,
        indicators: {
          considers_alternatives: habits.considers_alternatives,
          questions_assumptions: habits.questions_assumptions,
          explores_solutions: habits.explores_solutions,
        },
      },
      responsibility: {
        score: habits.responsibility_score,
        indicators: {
          considers_consequences: habits.considers_consequences,
          takes_ownership: habits.takes_ownership,
          applies_personally: habits.applies_personally,
        },
      },
      whole_heartedness: {
        score: habits.whole_heartedness_score,
        indicators: {
          engagement_level: habits.engagement_level,
          curiosity_demonstrated: habits.curiosity_demonstrated,
          attention_sustained: habits.attention_sustained,
        },
      },
      overall_score:
        (habits.open_mindedness_score +
          habits.responsibility_score +
          habits.whole_heartedness_score) /
        3,
    });
  })
);

// POST /api/reflection/language-activity
router.post(
  '/language-activity',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const {
      module_id,
      section_id,
      activity_type,
      user_response,
      required_elements,
    } = req.body;

    if (!module_id || !activity_type || !user_response || !required_elements) {
      return res.status(400).json({
        error: {
          code: 'MISSING_PARAMS',
          message: 'module_id, activity_type, user_response, and required_elements are required',
        },
      });
    }

    const activity = await ReflectiveThinkingService.evaluateLanguageActivity(
      req.user!.userId,
      module_id,
      {
        section_id,
        activity_type,
        user_response,
        required_elements,
      }
    );

    res.json({
      activity_id: activity.id,
      assessment: {
        clarity_score: activity.clarity_score,
        completeness_score: activity.completeness_score,
        reasoning_quality: activity.reasoning_quality,
        overall_score: activity.overall_score,
      },
      feedback: activity.feedback_content,
      elements_completed: activity.elements_completed,
    });
  })
);

export default router;

