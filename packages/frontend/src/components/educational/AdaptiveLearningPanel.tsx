import React from 'react';
import { useAdaptiveLearningStore } from '@/stores/adaptiveLearningStore';

interface AdaptiveLearningPanelProps {
  moduleId: string;
  sectionId?: string;
}

export const AdaptiveLearningPanel: React.FC<AdaptiveLearningPanelProps> = () => {
  const {
    learningStyle,
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
          <p className="text-sm text-gray-600 capitalize">Detected</p>
        </div>
      )}
    </div>
  );
};

