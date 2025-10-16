import { Router, Response } from 'express';
import { asyncHandler } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { prisma } from '../index';

const router = Router();
router.use(authenticate);

// POST /api/ai/chat
router.post(
  '/chat',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { message, conversation_id, module_id, context } = req.body;

    // Create or update conversation
    let conversation;
    if (conversation_id) {
      conversation = await prisma.aIConversation.findUnique({
        where: { id: conversation_id },
      });

      if (conversation) {
        const messages = conversation.messages as any[];
        messages.push({
          role: 'user',
          content: message,
          timestamp: new Date(),
        });

        // TODO: Implement actual AI response
        const aiResponse = 'This is a placeholder AI response. Real AI integration coming soon.';

        messages.push({
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date(),
        });

        conversation = await prisma.aIConversation.update({
          where: { id: conversation_id },
          data: { messages },
        });

        res.json({ response: aiResponse, conversation_id: conversation.id });
        return;
      }
    }

    // Create new conversation
    const messages = [
      {
        role: 'user',
        content: message,
        timestamp: new Date(),
      },
      {
        role: 'assistant',
        content: 'This is a placeholder AI response. Real AI integration coming soon.',
        timestamp: new Date(),
      },
    ];

    conversation = await prisma.aIConversation.create({
      data: {
        user_id: req.user!.userId,
        module_id: module_id || null,
        conversation_context: context || null,
        messages,
      },
    });

    res.json({
      response: 'This is a placeholder AI response. Real AI integration coming soon.',
      conversation_id: conversation.id,
    });
  })
);

// GET /api/ai/conversations
router.get(
  '/conversations',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const conversations = await prisma.aIConversation.findMany({
      where: { user_id: req.user!.userId },
      orderBy: { updated_at: 'desc' },
      take: 20,
    });

    res.json({ conversations });
  })
);

// GET /api/ai/prompt-templates
router.get(
  '/prompt-templates',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    // TODO: Implement prompt templates from database or config
    const templates = [
      {
        id: '1',
        module_id: null,
        title: 'Explain a concept',
        prompt: 'Can you explain {concept} in simple terms?',
        category: 'general',
      },
      {
        id: '2',
        module_id: null,
        title: 'Check my logic',
        prompt: 'I\'m thinking about {decision}. Can you help me think through this?',
        category: 'decision',
      },
    ];

    res.json({ templates });
  })
);

export default router;
