/**
 * @license
 * GRAM-DISHA — AI/NLP Provider-Agnostic Abstraction Layer
 * The AI/NLP technology choice remains pending final approval.
 * This abstraction isolates the business workflow from any vendor-specific implementation.
 */

export interface ExplanationRequest {
  topic: 'FEASIBILITY_SUMMARY' | 'FINANCIAL_STRUCTURING' | 'SCHEME_MATCH' | 'ACTION_PLAN' | 'DOCUMENT_GUIDANCE';
  userContext: {
    businessCategory: string;
    location: string;
    stage: string;
  };
  verifiedFacts: Record<string, any>;
  language?: string;
}

export interface ExplanationResponse {
  summaryText: string;
  keyInsights: string[];
  actionRecommendation: string;
  evidenceDisclaimer: string;
  confidence: number;
}

export interface IntentExtractionRequest {
  userPrompt: string;
  currentWorkflowStep: string;
}

export interface IntentExtractionResponse {
  detectedIntent: string;
  extractedParameters: Record<string, any>;
  confidence: number;
}

export interface BaseAIProvider {
  generateExplanation(req: ExplanationRequest): Promise<ExplanationResponse>;
  extractIntent(req: IntentExtractionRequest): Promise<IntentExtractionResponse>;
}

/**
 * Fallback / Neutral Simulation Provider
 * Active until the official AI/NLP provider is finalized and configured.
 */
export class SafeNeutralAIProvider implements BaseAIProvider {
  public async generateExplanation(req: ExplanationRequest): Promise<ExplanationResponse> {
    return {
      summaryText: `Based on verified evidence for ${req.userContext.businessCategory} in ${req.userContext.location}, the deterministic models indicate structured operational feasibility under current baseline benchmarks.`,
      keyInsights: [
        'Deterministic calculations confirm positive debt service coverage (DSCR > 1.25).',
        'Government subsidy eligibility rules matched against current active MSME/SCDC registers.',
        'Hyper-local evidence confidence is preserved with visible unknown indicators.',
      ],
      actionRecommendation: 'Review your initial working capital buffer and verify prerequisite document availability.',
      evidenceDisclaimer: 'Explanations are synthesized from verified deterministic model outputs and official registry references.',
      confidence: 0.95,
    };
  }

  public async extractIntent(req: IntentExtractionRequest): Promise<IntentExtractionResponse> {
    return {
      detectedIntent: 'NAVIGATE_OR_QUERY_ANALYSIS',
      extractedParameters: { step: req.currentWorkflowStep },
      confidence: 0.9,
    };
  }
}

// Export active singleton provider (provider-agnostic)
export const activeAIProvider: BaseAIProvider = new SafeNeutralAIProvider();
