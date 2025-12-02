import React, { useEffect } from 'react';
import { usePredictiveWellnessStore } from '@/stores/predictiveWellnessStore';

interface PredictiveWellnessPanelProps {
  moduleId?: string;
}

export const PredictiveWellnessPanel: React.FC<PredictiveWellnessPanelProps> = ({
  moduleId,
}) => {
  const {
    stressPrediction,
    optimalTime,
    engagementPrediction,
    isLoading,
    error,
    predictStress,
    detectOptimalTime,
    predictEngagement,
  } = usePredictiveWellnessStore();

  useEffect(() => {
    if (moduleId) {
      predictStress(moduleId);
    }
    detectOptimalTime();
    predictEngagement();
  }, [moduleId, predictStress, detectOptimalTime, predictEngagement]);

  if (isLoading) {
    return (
      <div className="p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-600">Analyzing your wellness...</p>
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
      {stressPrediction && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Stress Prediction</h3>
          <div className="flex items-center gap-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  stressPrediction.predicted_stress_level > 7
                    ? 'bg-red-600'
                    : stressPrediction.predicted_stress_level > 5
                    ? 'bg-yellow-600'
                    : 'bg-green-600'
                }`}
                style={{ width: `${stressPrediction.predicted_stress_level * 10}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">
              {stressPrediction.predicted_stress_level}/10
            </span>
          </div>
          {stressPrediction.recommendations.suggest_break && (
            <p className="text-xs text-yellow-600 mt-1">Consider taking a break</p>
          )}
        </div>
      )}
      {optimalTime && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Learning Readiness</h3>
          <p className="text-sm text-gray-600 capitalize">{optimalTime.current_readiness}</p>
          <p className="text-xs text-gray-500 mt-1">
            {optimalTime.recommendations.suggested_activity}
          </p>
        </div>
      )}
      {engagementPrediction && engagementPrediction.drop_off_risk !== 'low' && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">Engagement Alert</h3>
          <p className="text-sm text-yellow-600 capitalize">
            {engagementPrediction.drop_off_risk} risk of drop-off
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {engagementPrediction.interventions.encouragement}
          </p>
        </div>
      )}
    </div>
  );
};

