import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { useUIStore } from '@/stores/uiStore';
import Card from '@/components/shared/Card';
import Button from '@/components/shared/Button';
import ProgressBar from '@/components/shared/ProgressBar';
import Badge from '@/components/shared/Badge';

export default function ModuleView() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addNotification } = useUIStore();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['module', moduleId],
    queryFn: () => api.getModule(moduleId!),
    enabled: !!moduleId,
  });

  const startModuleMutation = useMutation({
    mutationFn: () => api.startModule(moduleId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module', moduleId] });
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const completeSectionMutation = useMutation({
    mutationFn: (sectionId: string) => api.completeSection(sectionId),
    onSuccess: () => {
      addNotification({
        type: 'success',
        message: 'Section completed!',
      });
      queryClient.invalidateQueries({ queryKey: ['module', moduleId] });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: (data: { progress_percentage: number; time_spent_minutes: number }) =>
      api.updateModuleProgress(moduleId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['module', moduleId] });
      queryClient.invalidateQueries({ queryKey: ['modules'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['progress-summary'] });
    },
  });

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
          <p className="text-secondary-600">Loading module...</p>
        </div>
      </div>
    );
  }

  if (!data?.module) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600 mb-4">Module not found</p>
        <Link to="/modules">
          <Button>Back to Modules</Button>
        </Link>
      </div>
    );
  }

  const { module, progress } = data;
  const sections = module.content || [];
  const currentSection = sections[currentSectionIndex];
  const totalSections = sections.length;

  const handleStart = async () => {
    await startModuleMutation.mutateAsync();
    addNotification({
      type: 'success',
      message: 'Module started! Good luck!',
    });
  };

  const handleCompleteSection = async () => {
    if (currentSection) {
      await completeSectionMutation.mutateAsync(currentSection.id);
    }
  };

  const handleNext = async () => {
    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);

      // Update progress
      const newProgress = Math.round(((currentSectionIndex + 2) / totalSections) * 100);
      await updateProgressMutation.mutateAsync({
        progress_percentage: newProgress,
        time_spent_minutes: (progress?.time_spent_minutes || 0) + 5, // Estimate 5 min per section
      });
    } else {
      // Complete module
      await updateProgressMutation.mutateAsync({
        progress_percentage: 100,
        time_spent_minutes: (progress?.time_spent_minutes || 0) + 5,
      });

      addNotification({
        type: 'success',
        message: 'Module completed! Great job!',
        duration: 7000,
      });

      navigate('/modules');
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  const renderContent = () => {
    if (!currentSection) return null;

    const contentData = currentSection.content_data as any;

    switch (currentSection.content_type) {
      case 'text':
        return (
          <div className="prose max-w-none">
            <div className="text-secondary-700 whitespace-pre-wrap">{contentData.body}</div>
            {contentData.key_takeaways && contentData.key_takeaways.length > 0 && (
              <div className="mt-6 p-4 bg-primary-50 border-l-4 border-primary-500 rounded">
                <h4 className="font-semibold text-secondary-900 mb-2">Key Takeaways:</h4>
                <ul className="space-y-1">
                  {contentData.key_takeaways.map((takeaway: string, index: number) => (
                    <li key={index} className="text-sm text-secondary-700">{takeaway}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'interactive':
        return (
          <div>
            <div className="prose max-w-none mb-6">
              <div className="text-secondary-700 whitespace-pre-wrap">{contentData.body}</div>
            </div>
            {contentData.instructions && (
              <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                <h4 className="font-semibold text-secondary-900 mb-2">Instructions:</h4>
                <p className="text-sm text-secondary-700">{contentData.instructions}</p>
              </div>
            )}
          </div>
        );

      case 'calculator':
        return (
          <div>
            <div className="prose max-w-none mb-6">
              <p className="text-secondary-700">
                This section includes an interactive calculator to help you apply what you've learned.
              </p>
            </div>
            {contentData.instructions && (
              <div className="p-4 bg-success-50 border border-success-200 rounded-lg mb-4">
                <h4 className="font-semibold text-secondary-900 mb-2">Instructions:</h4>
                <p className="text-sm text-secondary-700">{contentData.instructions}</p>
              </div>
            )}
            <div className="mt-4">
              <Link to="/calculators">
                <Button variant="primary">Open Calculator</Button>
              </Link>
            </div>
          </div>
        );

      case 'ai_prompt':
        return (
          <div>
            <div className="prose max-w-none mb-6">
              <p className="text-secondary-700">
                Use AI assistance to deepen your understanding of this concept.
              </p>
            </div>
            {contentData.prompt_template && (
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <h4 className="font-semibold text-secondary-900 mb-2">Suggested Prompt:</h4>
                <p className="text-sm text-secondary-700">{contentData.prompt_template}</p>
              </div>
            )}
          </div>
        );

      default:
        return <p className="text-secondary-600">Content type not supported yet.</p>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/modules"
          className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-4"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Modules
        </Link>

        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">{module.title}</h1>
            <p className="text-secondary-600">{module.description}</p>
          </div>
          <Badge
            variant={
              progress?.status === 'completed'
                ? 'success'
                : progress?.status === 'in_progress'
                ? 'info'
                : 'default'
            }
          >
            {progress?.status === 'completed'
              ? 'Completed'
              : progress?.status === 'in_progress'
              ? 'In Progress'
              : 'Not Started'}
          </Badge>
        </div>

        {progress && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-secondary-700">Module Progress</span>
              <span className="text-sm text-secondary-600">{progress.progress_percentage}%</span>
            </div>
            <ProgressBar value={progress.progress_percentage} />
          </div>
        )}
      </div>

      {/* Module Not Started */}
      {!progress || progress.status === 'not_started' ? (
        <Card>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">Ready to start?</h3>
            <p className="text-secondary-600 mb-6">
              This module has {totalSections} section{totalSections !== 1 ? 's' : ''} and takes approximately {module.estimated_duration} minutes.
            </p>
            <Button
              size="lg"
              onClick={handleStart}
              isLoading={startModuleMutation.isPending}
            >
              Start Module
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {/* Section Navigation */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-secondary-900">
                Section {currentSectionIndex + 1} of {totalSections}
              </h2>
              <span className="text-sm text-secondary-600">
                {currentSection?.section_title}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => setCurrentSectionIndex(index)}
                  className={`
                    h-2 rounded-full transition-colors
                    ${index <= currentSectionIndex
                      ? 'bg-primary-600'
                      : 'bg-secondary-200'
                    }
                    ${index === currentSectionIndex ? 'ring-2 ring-primary-300' : ''}
                  `}
                  title={`Section ${index + 1}: ${section.section_title}`}
                />
              ))}
            </div>
          </Card>

          {/* Content */}
          <Card>
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                {currentSection?.section_title}
              </h3>
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="info" size="sm">
                  {currentSection?.content_type.replace('_', ' ')}
                </Badge>
                <span className="text-sm text-secondary-500">
                  Section {currentSectionIndex + 1}
                </span>
              </div>
            </div>

            <div className="mb-8">{renderContent()}</div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-secondary-200">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSectionIndex === 0}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>

              <div className="flex items-center space-x-3">
                <Button
                  variant="secondary"
                  onClick={handleCompleteSection}
                  isLoading={completeSectionMutation.isPending}
                >
                  Mark as Complete
                </Button>
                <Button
                  onClick={handleNext}
                  isLoading={updateProgressMutation.isPending}
                >
                  {currentSectionIndex === totalSections - 1 ? (
                    <>
                      Complete Module
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  ) : (
                    <>
                      Next Section
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
