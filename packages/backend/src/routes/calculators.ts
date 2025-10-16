import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../index';
import { CALCULATOR_TYPES } from '@finance-platform/shared';

const router = Router();
router.use(authenticate);

// GET /api/calculators
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const calculatorTypes = Object.values(CALCULATOR_TYPES).map(type => ({
      type,
      name: type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    }));
    res.json({ calculators: calculatorTypes });
  })
);

// POST /api/calculators/:calculatorType
router.post(
  '/:calculatorType',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { calculator_name, input_data, module_id } = req.body;

    // TODO: Implement calculator computation logic
    const output_data = { result: 'computed' };

    const calculator = await prisma.calculatorData.create({
      data: {
        user_id: req.user!.userId,
        calculator_type: req.params.calculatorType,
        calculator_name,
        input_data,
        output_data,
        module_id: module_id || null,
      },
    });

    res.status(201).json({ calculator_data: calculator, output_data });
  })
);

// GET /api/calculators/saved
router.get(
  '/saved',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { calculator_type } = req.query;

    const calculators = await prisma.calculatorData.findMany({
      where: {
        user_id: req.user!.userId,
        ...(calculator_type && { calculator_type: calculator_type as string }),
      },
      orderBy: { created_at: 'desc' },
    });

    res.json({ saved_calculators: calculators });
  })
);

// GET /api/calculators/:calculatorId
router.get(
  '/:calculatorId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const calculator = await prisma.calculatorData.findFirst({
      where: {
        id: req.params.calculatorId,
        user_id: req.user!.userId,
      },
    });

    if (!calculator) {
      res.status(404).json({ error: { code: 'CALCULATOR_NOT_FOUND', message: 'Calculator not found' } });
      return;
    }

    res.json({ calculator_data: calculator });
  })
);

// PUT /api/calculators/:calculatorId
router.put(
  '/:calculatorId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { input_data } = req.body;

    // TODO: Recompute output
    const output_data = { result: 'recomputed' };

    const calculator = await prisma.calculatorData.update({
      where: { id: req.params.calculatorId },
      data: {
        input_data,
        output_data,
      },
    });

    res.json({ calculator_data: calculator, output_data });
  })
);

// DELETE /api/calculators/:calculatorId
router.delete(
  '/:calculatorId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    await prisma.calculatorData.delete({
      where: { id: req.params.calculatorId },
    });

    res.json({ success: true });
  })
);

export default router;
