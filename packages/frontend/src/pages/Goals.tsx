import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useUIStore } from '@/stores/uiStore';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import Badge from '@/components/shared/Badge';
import ProgressBar from '@/components/shared/ProgressBar';
import { Goal, CreateGoalRequest } from '@finance-platform/shared';

export default function Goals() {
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: () => api.getGoals(),
  });

  const createGoalMutation = useMutation({
    mutationFn: (data: CreateGoalRequest) => api.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      addNotification({
        type: 'success',
        message: 'Goal created successfully!',
      });
      setIsCreateModalOpen(false);
    },
  });

  const updateGoalMutation = useMutation({
    mutationFn: ({ goalId, data }: { goalId: string; data: Partial<CreateGoalRequest> }) =>
      api.updateGoal(goalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      addNotification({
        type: 'success',
        message: 'Goal updated successfully!',
      });
      setEditingGoal(null);
    },
  });

  const deleteGoalMutation = useMutation({
    mutationFn: (goalId: string) => api.deleteGoal(goalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      addNotification({
        type: 'success',
        message: 'Goal deleted successfully!',
      });
    },
  });

  const goals = data?.goals || [];
  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" size="sm">Completed</Badge>;
      case 'active':
        return <Badge variant="info" size="sm">Active</Badge>;
      case 'paused':
        return <Badge variant="default" size="sm">Paused</Badge>;
      case 'abandoned':
        return <Badge variant="danger" size="sm">Abandoned</Badge>;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'savings':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
        );
      case 'debt':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
        );
      case 'retirement':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        );
      case 'investment':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-primary-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-secondary-600">Loading goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Financial Goals</h1>
          <p className="text-secondary-600">
            Track your progress toward your financial objectives
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Goal
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{activeGoals.length}</p>
              <p className="text-sm text-secondary-600">Active Goals</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-success-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">{completedGoals.length}</p>
              <p className="text-sm text-secondary-600">Completed Goals</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-warning-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-secondary-900">
                $
                {activeGoals
                  .reduce((sum, g) => sum + (g.target_amount || 0), 0)
                  .toLocaleString()}
              </p>
              <p className="text-sm text-secondary-600">Total Target Amount</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-secondary-900">Active Goals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeGoals.map((goal) => (
              <Card key={goal.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 mb-1">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-secondary-600">{goal.description}</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(goal.status)}
                </div>

                {goal.target_amount && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-secondary-700">Progress</span>
                      <span className="text-sm text-secondary-600">
                        ${(goal.current_amount || 0).toLocaleString()} / $
                        {goal.target_amount.toLocaleString()}
                      </span>
                    </div>
                    <ProgressBar
                      value={Math.round(((goal.current_amount || 0) / goal.target_amount) * 100)}
                    />
                  </div>
                )}

                {goal.target_date && (
                  <div className="flex items-center text-sm text-secondary-600 mb-4">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Target: {new Date(goal.target_date).toLocaleDateString()}
                  </div>
                )}

                <div className="flex items-center space-x-2 pt-3 border-t border-secondary-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingGoal(goal)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this goal?')) {
                        deleteGoalMutation.mutate(goal.id);
                      }
                    }}
                    isLoading={deleteGoalMutation.isPending}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-secondary-900">Completed Goals</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="opacity-75">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center text-success-600">
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-secondary-900 mb-1">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-sm text-secondary-600">{goal.description}</p>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(goal.status)}
                </div>

                {goal.target_amount && (
                  <div className="text-sm text-secondary-600">
                    Achieved: ${goal.target_amount.toLocaleString()}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {goals.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">No goals yet</h3>
            <p className="text-secondary-600 mb-6">
              Start your financial journey by setting your first goal
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>Create Your First Goal</Button>
          </div>
        </Card>
      )}

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingGoal) && (
        <GoalModal
          goal={editingGoal}
          isOpen={isCreateModalOpen || !!editingGoal}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingGoal(null);
          }}
          onSubmit={(data) => {
            if (editingGoal) {
              updateGoalMutation.mutate({ goalId: editingGoal.id, data });
            } else {
              createGoalMutation.mutate(data);
            }
          }}
          isLoading={createGoalMutation.isPending || updateGoalMutation.isPending}
        />
      )}
    </div>
  );
}

interface GoalModalProps {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGoalRequest) => void;
  isLoading: boolean;
}

function GoalModal({ goal, isOpen, onClose, onSubmit, isLoading }: GoalModalProps) {
  const [formData, setFormData] = useState<CreateGoalRequest>({
    title: goal?.title || '',
    description: goal?.description || '',
    category: goal?.category || 'savings',
    target_amount: goal?.target_amount || undefined,
    current_amount: goal?.current_amount || undefined,
    target_date: goal?.target_date ? new Date(goal.target_date).toISOString().split('T')[0] : '',
    status: goal?.status || 'active',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-secondary-900">
              {goal ? 'Edit Goal' : 'Create New Goal'}
            </h2>
            <button
              onClick={onClose}
              className="text-secondary-400 hover:text-secondary-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Goal Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="e.g., Emergency Fund"
            />

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Optional description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="savings">Savings</option>
                <option value="debt">Debt Payoff</option>
                <option value="investment">Investment</option>
                <option value="retirement">Retirement</option>
                <option value="other">Other</option>
              </select>
            </div>

            <Input
              label="Target Amount"
              type="number"
              value={formData.target_amount || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  target_amount: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="e.g., 10000"
            />

            <Input
              label="Current Amount"
              type="number"
              value={formData.current_amount || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  current_amount: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="e.g., 2500"
            />

            <Input
              label="Target Date"
              type="date"
              value={formData.target_date || ''}
              onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
            />

            {goal && (
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                  <option value="abandoned">Abandoned</option>
                </select>
              </div>
            )}

            <div className="flex items-center space-x-3 pt-4">
              <Button type="submit" isLoading={isLoading} className="flex-1">
                {goal ? 'Update Goal' : 'Create Goal'}
              </Button>
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
