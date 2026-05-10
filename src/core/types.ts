export type IssueSeverity = 'info' | 'warning' | 'error';

export type Issue = {
  gate: string;
  severity: IssueSeverity;
  title: string;
  detail: string;
};

export type EvidenceRecord = {
  path: string;
  exists: boolean;
  details?: Record<string, unknown>;
};

export type ScanReport = {
  targetPath: string;
  generatedAt: string;
  summary: {
    issueCount: number;
    failedGates: string[];
  };
  issues: Issue[];
  evidence: EvidenceRecord[];
};
