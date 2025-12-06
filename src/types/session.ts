export type HealthStatus = 'healthy' | 'at-risk' | 'critical';
export type RiskLevel = 'low' | 'medium' | 'high';
export type TimelineAlignment = 'ahead' | 'on-track' | 'behind';

export interface ProjectSession {
  id: string;
  project_id: string | null;
  calendly_event_id: string | null;
  scheduled_at: string;
  completed_at: string | null;
  
  // Form data
  progress_reported: number;
  blockers: string | null;
  needs_review: string | null;
  changes_since_last: string | null;
  target_milestone: string | null;
  
  // Analysis
  health_status: HealthStatus | null;
  risk_level: RiskLevel | null;
  timeline_alignment: TimelineAlignment | null;
  delay_analysis: string | null;
  recommendations: string[] | null;
  suggested_focus: string | null;
  action_plan: string[] | null;
  adjusted_end_date: string | null;
  
  // Summary
  session_summary: string | null;
  next_milestone: string | null;
  
  created_at: string;
  updated_at: string;
}

export interface CreateSessionInput {
  project_id: string;
  progress_reported: number;
  blockers?: string;
  needs_review?: string;
  changes_since_last?: string;
  target_milestone?: string;
}
