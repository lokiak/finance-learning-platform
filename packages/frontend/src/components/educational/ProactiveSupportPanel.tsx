import React from 'react';
import { useProactiveSupportStore } from '@/stores/proactiveSupportStore';

interface ProactiveSupportPanelProps {
  moduleId: string;
  sectionId?: string;
}

export const ProactiveSupportPanel: React.FC<ProactiveSupportPanelProps> = ({
  moduleId,
  sectionId,
}) => {
  const {
    activeHints,
    breakSuggestion,
    recentEncouragements,
    isLoading,
    error,
    suggestBreak,
  } = useProactiveSupportStore();

  const handleBreakSuggestion = () => {
    suggestBreak();
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-3">
      {recentEncouragements.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Encouragement</h3>
          <p className="text-sm text-gray-600">{recentEncouragements[0].message.content}</p>
        </div>
      )}
      {activeHints.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Hint</h3>
          <p className="text-sm text-gray-600">{activeHints[activeHints.length - 1].hint.content}</p>
        </div>
      )}
      {breakSuggestion && (
        <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">Break Suggestion</h3>
          <p className="text-sm text-yellow-700">
            Consider taking a {breakSuggestion.suggestion.break_type} break (
            {breakSuggestion.suggestion.duration} minutes)
          </p>
          <ul className="text-xs text-yellow-600 mt-2 list-disc list-inside">
            {breakSuggestion.suggestion.activities.map((activity, idx) => (
              <li key={idx}>{activity}</li>
            ))}
          </ul>
        </div>
      )}
      {!breakSuggestion && (
        <button
          onClick={handleBreakSuggestion}
          disabled={isLoading}
          className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
        >
          Check if I need a break
        </button>
      )}
    </div>
  );
};

