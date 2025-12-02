import React from 'react';
import { useAdaptiveLearningStore } from '@/stores/adaptiveLearningStore';

interface AdaptiveLearningPanelProps {
  moduleId: string;
  sectionId?: string;
}

export const AdaptiveLearningPanel: React.FC<AdaptiveLearningPanelProps> = ({
  moduleId,
  sectionId,
}) => {
  const {
    learningStyle,
    mastery,
    adaptedContent,
    isLoading,
    error,
  } = useAdaptiveLearningStore();

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-600">Analyzing your learning...</p>
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
    <div className="p-4 bg-gray-50 rounded-lg space-y-3">
      {learningStyle && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Learning Style</h3>
          <p className="text-sm text-gray-600 capitalize">{learningStyle.primary_style}</p>
        </div>
      )}
      {mastery && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Mastery Level</h3>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${mastery.mastery_level * 10}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{Math.round(mastery.mastery_level * 10)}%</p>
        </div>
      )}
      {adaptedContent && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Content Adaptation</h3>
          <p className="text-sm text-gray-600">{adaptedContent.adaptation_reason}</p>
        </div>
      )}
    </div>
  );
};

