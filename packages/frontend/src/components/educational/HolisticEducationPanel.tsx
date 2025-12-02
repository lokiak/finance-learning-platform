import React, { useEffect } from 'react';
import { api } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';

interface HolisticEducationPanelProps {
  moduleId: string;
}

export const HolisticEducationPanel: React.FC<HolisticEducationPanelProps> = ({
  moduleId,
}) => {
  const { user } = useAuthStore();
  const [emotionalState, setEmotionalState] = React.useState<any>(null);
  const [realWorldApp, setRealWorldApp] = React.useState<any>(null);
  const [connections, setConnections] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const [emotional, realWorld, moduleConnections] = await Promise.all([
          api.getEmotionalState(moduleId),
          api.getRealWorldApplication(moduleId),
          api.getModuleConnections(moduleId),
        ]);
        setEmotionalState(emotional);
        setRealWorldApp(realWorld);
        setConnections(moduleConnections);
      } catch (err: any) {
        setError(err.response?.data?.error?.message || 'Failed to load holistic data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [moduleId, user]);

  if (isLoading) {
    return (
      <div className="p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-600">Loading holistic insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
      {emotionalState && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Learning Readiness</h3>
          <div className="space-y-1">
            <p className="text-xs text-gray-600">
              Mood: {emotionalState.current_mood}/5 | Stress: {emotionalState.stress_level}/10
            </p>
            <p className="text-xs text-gray-500 capitalize">
              Readiness: {emotionalState.learning_readiness}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              Pacing: {emotionalState.adaptations.content_pacing}
            </p>
          </div>
        </div>
      )}
      {realWorldApp && realWorldApp.action_items && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Action Items</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            {realWorldApp.action_items.immediate.slice(0, 2).map((item: string, idx: number) => (
              <li key={idx} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {connections && connections.related_concepts && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Module Connections</h3>
          <div className="text-xs text-gray-600 space-y-1">
            {connections.related_concepts.prerequisite.length > 0 && (
              <p>
                Prerequisites: {connections.related_concepts.prerequisite.length} module(s)
              </p>
            )}
            {connections.related_concepts.builds_on.length > 0 && (
              <p>Builds on: {connections.related_concepts.builds_on.length} module(s)</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

