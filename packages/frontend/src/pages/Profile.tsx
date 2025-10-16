import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import { UpdateProfileRequest } from '@finance-platform/shared';

export default function Profile() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { addNotification } = useUIStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({});

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => api.getProfile(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) => api.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      addNotification({
        type: 'success',
        message: 'Profile updated successfully!',
      });
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (data?.profile) {
      setFormData({
        age: data.profile.age ?? undefined,
        current_income: data.profile.current_income ?? undefined,
        financial_goals: data.profile.financial_goals,
        risk_tolerance: data.profile.risk_tolerance ?? undefined,
        has_debt: data.profile.has_debt,
        has_emergency_fund: data.profile.has_emergency_fund,
      });
    }
  }, [data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
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
          <p className="text-secondary-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  const profile = data?.profile;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Your Profile</h1>
        <p className="text-secondary-600">Manage your account information and financial preferences</p>
      </div>

      {/* Account Information */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-secondary-900">Account Information</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-secondary-900">{user?.name}</p>
              <p className="text-sm text-secondary-600">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-600 mb-1">Member since</p>
              <p className="font-semibold text-secondary-900">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div className="p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-600 mb-1">Last login</p>
              <p className="font-semibold text-secondary-900">
                {user?.last_login ? new Date(user.last_login).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Financial Profile */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-secondary-900">Financial Profile</h2>
          {!isEditing && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Age"
              type="number"
              value={formData.age || ''}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : undefined })
              }
              placeholder="Enter your age"
            />

            <Input
              label="Current Annual Income"
              type="number"
              value={formData.current_income || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  current_income: e.target.value ? parseFloat(e.target.value) : undefined,
                })
              }
              placeholder="e.g., 75000"
            />

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Financial Goals
              </label>
              <textarea
                value={formData.financial_goals?.join('\n') || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    financial_goals: e.target.value.split('\n').filter((g) => g.trim()),
                  })
                }
                rows={4}
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter each goal on a new line"
              />
              <p className="text-xs text-secondary-500 mt-1">Enter one goal per line</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Risk Tolerance
              </label>
              <select
                value={formData.risk_tolerance || ''}
                onChange={(e) =>
                  setFormData({ ...formData, risk_tolerance: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select your risk tolerance</option>
                <option value="conservative">Conservative - I prefer low-risk investments</option>
                <option value="moderate">Moderate - I'm comfortable with some risk</option>
                <option value="aggressive">Aggressive - I'm comfortable with high risk</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.has_debt || false}
                  onChange={(e) => setFormData({ ...formData, has_debt: e.target.checked })}
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-secondary-700">I currently have debt</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.has_emergency_fund || false}
                  onChange={(e) =>
                    setFormData({ ...formData, has_emergency_fund: e.target.checked })
                  }
                  className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <span className="ml-2 text-sm text-secondary-700">
                  I have an emergency fund (3-6 months expenses)
                </span>
              </label>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <Button type="submit" isLoading={updateProfileMutation.isPending}>
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  if (profile) {
                    setFormData({
                      age: profile.age ?? undefined,
                      current_income: profile.current_income ?? undefined,
                      financial_goals: profile.financial_goals,
                      risk_tolerance: profile.risk_tolerance ?? undefined,
                      has_debt: profile.has_debt,
                      has_emergency_fund: profile.has_emergency_fund,
                    });
                  }
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-secondary-600 mb-1">Age</p>
                <p className="font-semibold text-secondary-900">
                  {profile?.age ? `${profile.age} years old` : 'Not specified'}
                </p>
              </div>

              <div>
                <p className="text-sm text-secondary-600 mb-1">Annual Income</p>
                <p className="font-semibold text-secondary-900">
                  {profile?.current_income
                    ? `$${profile.current_income.toLocaleString()}`
                    : 'Not specified'}
                </p>
              </div>

              <div>
                <p className="text-sm text-secondary-600 mb-1">Risk Tolerance</p>
                <p className="font-semibold text-secondary-900 capitalize">
                  {profile?.risk_tolerance || 'Not specified'}
                </p>
              </div>

              <div>
                <p className="text-sm text-secondary-600 mb-1">Financial Status</p>
                <div className="flex flex-wrap gap-2">
                  {profile?.has_debt && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                      Has Debt
                    </span>
                  )}
                  {profile?.has_emergency_fund && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                      Has Emergency Fund
                    </span>
                  )}
                  {!profile?.has_debt && !profile?.has_emergency_fund && (
                    <span className="text-secondary-900">Not specified</span>
                  )}
                </div>
              </div>
            </div>

            {profile?.financial_goals && profile.financial_goals.length > 0 && (
              <div>
                <p className="text-sm text-secondary-600 mb-2">Financial Goals</p>
                <ul className="space-y-2">
                  {profile.financial_goals.map((goal: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <svg
                        className="w-5 h-5 text-primary-600 mr-2 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-secondary-900">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Profile Completion */}
      {profile && (
        <Card>
          <h2 className="text-xl font-bold text-secondary-900 mb-4">Profile Completion</h2>
          <div className="space-y-3">
            <ProfileCheckItem
              completed={!!profile.age}
              label="Age"
              description="Add your age for personalized recommendations"
            />
            <ProfileCheckItem
              completed={!!profile.current_income}
              label="Income"
              description="Add your annual income for better financial planning"
            />
            <ProfileCheckItem
              completed={!!profile.risk_tolerance}
              label="Risk Tolerance"
              description="Define your investment risk tolerance"
            />
            <ProfileCheckItem
              completed={profile.financial_goals && profile.financial_goals.length > 0}
              label="Financial Goals"
              description="Set your financial objectives"
            />
          </div>

          {!user?.profile_completed && (
            <div className="mt-6 p-4 bg-primary-50 border-l-4 border-primary-500 rounded">
              <p className="text-sm text-secondary-700">
                Complete your profile to get personalized learning recommendations and better
                financial insights!
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Danger Zone */}
      <Card className="border-danger-200">
        <h2 className="text-xl font-bold text-danger-600 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div className="flex items-start justify-between p-4 border border-danger-200 rounded-lg">
            <div>
              <h3 className="font-semibold text-secondary-900 mb-1">Delete Account</h3>
              <p className="text-sm text-secondary-600">
                Permanently delete your account and all associated data. This action cannot be
                undone.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                alert(
                  'Account deletion is not implemented in this demo. In a production app, this would permanently delete your account.'
                );
              }}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface ProfileCheckItemProps {
  completed: boolean;
  label: string;
  description: string;
}

function ProfileCheckItem({ completed, label, description }: ProfileCheckItemProps) {
  return (
    <div className="flex items-start">
      <div
        className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
          completed ? 'bg-success-100' : 'bg-secondary-200'
        }`}
      >
        {completed ? (
          <svg className="w-3 h-3 text-success-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <div className="w-2 h-2 bg-secondary-400 rounded-full"></div>
        )}
      </div>
      <div>
        <p className={`font-medium ${completed ? 'text-secondary-900' : 'text-secondary-600'}`}>
          {label}
        </p>
        <p className="text-sm text-secondary-500">{description}</p>
      </div>
    </div>
  );
}
