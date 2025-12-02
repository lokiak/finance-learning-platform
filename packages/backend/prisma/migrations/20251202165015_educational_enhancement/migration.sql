-- CreateEnum
CREATE TYPE "ReflectionRequired" AS ENUM ('full', 'hybrid', 'none');

-- AlterTable
ALTER TABLE "modules" ADD COLUMN     "reflection_required" "ReflectionRequired" NOT NULL DEFAULT 'none';

-- AlterTable
ALTER TABLE "user_progress" ADD COLUMN     "adaptive_path_taken" VARCHAR(50),
ADD COLUMN     "average_time_per_section" INTEGER,
ADD COLUMN     "engagement_score" DECIMAL(5,2),
ADD COLUMN     "error_rate" DECIMAL(5,2),
ADD COLUMN     "learning_style_detected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mastery_level" DECIMAL(5,2),
ADD COLUMN     "readiness_score" DECIMAL(5,2);

-- CreateTable
CREATE TABLE "learning_performance" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "section_id" TEXT,
    "concept_id" TEXT,
    "time_spent_seconds" INTEGER NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "assessment_score" DECIMAL(5,2),
    "error_count" INTEGER NOT NULL DEFAULT 0,
    "error_patterns" JSONB,
    "completion_status" TEXT NOT NULL,
    "notes_taken" BOOLEAN NOT NULL DEFAULT false,
    "content_reviewed" INTEGER NOT NULL DEFAULT 0,
    "interactive_engaged" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_performance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_style" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "visual_preference" INTEGER NOT NULL DEFAULT 50,
    "textual_preference" INTEGER NOT NULL DEFAULT 50,
    "interactive_preference" INTEGER NOT NULL DEFAULT 50,
    "pace_preference" VARCHAR(20) NOT NULL DEFAULT 'moderate',
    "preferred_time_of_day" VARCHAR(50),
    "average_session_length" INTEGER,
    "review_frequency" VARCHAR(20) NOT NULL DEFAULT 'medium',
    "detection_method" VARCHAR(20) NOT NULL DEFAULT 'behavioral',
    "confidence" DECIMAL(3,2) NOT NULL DEFAULT 0.5,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concept_mastery" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "concept_id" TEXT NOT NULL,
    "mastery_level" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "assessment_history" JSONB NOT NULL,
    "last_assessed" TIMESTAMP(3),
    "next_review_date" TIMESTAMP(3),
    "spaced_interval_days" INTEGER NOT NULL DEFAULT 1,
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(50) NOT NULL DEFAULT 'not_started',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "concept_mastery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stress_predictions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "module_id" TEXT,
    "predicted_stress_level" INTEGER NOT NULL,
    "confidence" DECIMAL(3,2) NOT NULL,
    "factors" JSONB NOT NULL,
    "actual_stress_level" INTEGER,
    "prediction_accuracy" DECIMAL(3,2),
    "recommendations" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stress_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_interventions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "intervention_type" VARCHAR(50) NOT NULL,
    "module_id" TEXT,
    "section_id" TEXT,
    "trigger_reason" VARCHAR(255) NOT NULL,
    "trigger_conditions" JSONB NOT NULL,
    "content" JSONB NOT NULL,
    "displayed" BOOLEAN NOT NULL DEFAULT false,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "user_response" VARCHAR(50),
    "outcome" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "displayed_at" TIMESTAMP(3),
    "acknowledged_at" TIMESTAMP(3),

    CONSTRAINT "learning_interventions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module_readiness" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "prerequisite_status" JSONB NOT NULL,
    "emotional_readiness" VARCHAR(50) NOT NULL,
    "time_available" INTEGER,
    "can_proceed" BOOLEAN NOT NULL,
    "recommendations" JSONB NOT NULL,
    "optimal_timing" VARCHAR(255),
    "assessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "module_readiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reflective_thinking_process" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "section_id" TEXT,
    "problematic_situation" JSONB NOT NULL,
    "user_reaction" VARCHAR(50),
    "engagement_level" INTEGER,
    "initial_problem" TEXT,
    "refined_problem" TEXT,
    "problem_definition_complete" BOOLEAN NOT NULL DEFAULT false,
    "user_hypotheses" JSONB NOT NULL,
    "alternative_hypotheses" JSONB,
    "selected_hypothesis" TEXT,
    "evidence_gathered" JSONB,
    "consequence_analysis" JSONB,
    "logical_reasoning" TEXT,
    "action_plan" TEXT,
    "calculator_used" VARCHAR(100),
    "real_world_applied" BOOLEAN NOT NULL DEFAULT false,
    "test_results" JSONB,
    "reflection_on_results" TEXT,
    "current_step" INTEGER NOT NULL DEFAULT 1,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "reflective_thinking_process_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reflective_hypothesis" (
    "id" TEXT NOT NULL,
    "process_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "hypothesis_text" TEXT NOT NULL,
    "source" VARCHAR(20) NOT NULL DEFAULT 'user',
    "feasibility_score" INTEGER,
    "impact_score" INTEGER,
    "sustainability_score" INTEGER,
    "supporting_evidence" JSONB,
    "opposing_evidence" JSONB,
    "consequences_if_true" JSONB,
    "consequences_if_false" JSONB,
    "status" VARCHAR(50) NOT NULL DEFAULT 'generated',
    "selected_for_testing" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reflective_hypothesis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "habits_of_mind" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "module_id" TEXT,
    "open_mindedness_score" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "considers_alternatives" BOOLEAN NOT NULL DEFAULT false,
    "questions_assumptions" BOOLEAN NOT NULL DEFAULT false,
    "explores_solutions" BOOLEAN NOT NULL DEFAULT false,
    "responsibility_score" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "considers_consequences" BOOLEAN NOT NULL DEFAULT false,
    "takes_ownership" BOOLEAN NOT NULL DEFAULT false,
    "applies_personally" BOOLEAN NOT NULL DEFAULT false,
    "whole_heartedness_score" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "engagement_level" INTEGER NOT NULL DEFAULT 0,
    "curiosity_demonstrated" BOOLEAN NOT NULL DEFAULT false,
    "attention_sustained" BOOLEAN NOT NULL DEFAULT false,
    "assessment_type" VARCHAR(50) NOT NULL,
    "activity_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "habits_of_mind_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "language_activities" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "module_id" TEXT NOT NULL,
    "section_id" TEXT,
    "activity_type" VARCHAR(50) NOT NULL,
    "user_response" TEXT NOT NULL,
    "required_elements" JSONB NOT NULL,
    "elements_completed" JSONB NOT NULL,
    "clarity_score" DECIMAL(5,2),
    "completeness_score" DECIMAL(5,2),
    "reasoning_quality" DECIMAL(5,2),
    "overall_score" DECIMAL(5,2),
    "feedback_provided" BOOLEAN NOT NULL DEFAULT false,
    "feedback_content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "language_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "learning_performance_user_id_module_id_idx" ON "learning_performance"("user_id", "module_id");

-- CreateIndex
CREATE INDEX "learning_performance_user_id_created_at_idx" ON "learning_performance"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "learning_performance_concept_id_idx" ON "learning_performance"("concept_id");

-- CreateIndex
CREATE UNIQUE INDEX "learning_style_user_id_key" ON "learning_style"("user_id");

-- CreateIndex
CREATE INDEX "concept_mastery_user_id_status_idx" ON "concept_mastery"("user_id", "status");

-- CreateIndex
CREATE INDEX "concept_mastery_next_review_date_idx" ON "concept_mastery"("next_review_date");

-- CreateIndex
CREATE UNIQUE INDEX "concept_mastery_user_id_concept_id_key" ON "concept_mastery"("user_id", "concept_id");

-- CreateIndex
CREATE INDEX "stress_predictions_user_id_created_at_idx" ON "stress_predictions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "learning_interventions_user_id_created_at_idx" ON "learning_interventions"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "learning_interventions_intervention_type_idx" ON "learning_interventions"("intervention_type");

-- CreateIndex
CREATE INDEX "module_readiness_user_id_can_proceed_idx" ON "module_readiness"("user_id", "can_proceed");

-- CreateIndex
CREATE UNIQUE INDEX "module_readiness_user_id_module_id_key" ON "module_readiness"("user_id", "module_id");

-- CreateIndex
CREATE INDEX "reflective_thinking_process_user_id_module_id_idx" ON "reflective_thinking_process"("user_id", "module_id");

-- CreateIndex
CREATE INDEX "reflective_thinking_process_user_id_current_step_idx" ON "reflective_thinking_process"("user_id", "current_step");

-- CreateIndex
CREATE INDEX "reflective_thinking_process_completed_idx" ON "reflective_thinking_process"("completed");

-- CreateIndex
CREATE INDEX "reflective_hypothesis_process_id_idx" ON "reflective_hypothesis"("process_id");

-- CreateIndex
CREATE INDEX "reflective_hypothesis_user_id_status_idx" ON "reflective_hypothesis"("user_id", "status");

-- CreateIndex
CREATE INDEX "habits_of_mind_user_id_module_id_idx" ON "habits_of_mind"("user_id", "module_id");

-- CreateIndex
CREATE INDEX "habits_of_mind_user_id_created_at_idx" ON "habits_of_mind"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "language_activities_user_id_module_id_idx" ON "language_activities"("user_id", "module_id");

-- CreateIndex
CREATE INDEX "language_activities_activity_type_idx" ON "language_activities"("activity_type");

-- CreateIndex
CREATE INDEX "language_activities_created_at_idx" ON "language_activities"("created_at");

-- CreateIndex
CREATE INDEX "modules_reflection_required_idx" ON "modules"("reflection_required");

-- AddForeignKey
ALTER TABLE "learning_performance" ADD CONSTRAINT "learning_performance_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_performance" ADD CONSTRAINT "learning_performance_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_style" ADD CONSTRAINT "learning_style_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "concept_mastery" ADD CONSTRAINT "concept_mastery_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stress_predictions" ADD CONSTRAINT "stress_predictions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stress_predictions" ADD CONSTRAINT "stress_predictions_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_interventions" ADD CONSTRAINT "learning_interventions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_interventions" ADD CONSTRAINT "learning_interventions_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_readiness" ADD CONSTRAINT "module_readiness_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_readiness" ADD CONSTRAINT "module_readiness_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflective_thinking_process" ADD CONSTRAINT "reflective_thinking_process_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflective_thinking_process" ADD CONSTRAINT "reflective_thinking_process_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflective_hypothesis" ADD CONSTRAINT "reflective_hypothesis_process_id_fkey" FOREIGN KEY ("process_id") REFERENCES "reflective_thinking_process"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reflective_hypothesis" ADD CONSTRAINT "reflective_hypothesis_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habits_of_mind" ADD CONSTRAINT "habits_of_mind_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "habits_of_mind" ADD CONSTRAINT "habits_of_mind_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "language_activities" ADD CONSTRAINT "language_activities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "language_activities" ADD CONSTRAINT "language_activities_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
