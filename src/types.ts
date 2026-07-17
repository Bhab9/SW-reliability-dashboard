/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum DefectType {
  RUNTIME_ERROR = "Run-time Error",
  MISRA_VIOLATION = "MISRA Violation",
  SECURITY_VULNERABILITY = "Security Vulnerability",
  LOGIC_ERROR = "Logic Error",
}

export enum Severity {
  CRITICAL = "Critical",
  HIGH = "High",
  MEDIUM = "Medium",
  LOW = "Low",
}

export enum DefectStatus {
  OPEN = "Open",
  IN_REVIEW = "In Review",
  RESOLVED = "Resolved",
  CLOSED = "Closed",
}

export interface Defect {
  id: string;
  projectId: string;
  type: DefectType;
  severity: Severity;
  module: string;
  filePath: string;
  lineNumber: number;
  codeSnippet: string;
  description: string;
  aiAnalysis?: string;
  aiSuggestion?: string;
  status: DefectStatus;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  version: string;
  createdAt: string;
  description: string;
}

export interface AnalysisResponse {
  analysis: string;
  suggestion: string;
}
