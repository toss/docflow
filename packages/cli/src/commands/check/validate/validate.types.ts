type ValidationErrorType = "missing_public" | "missing_param" | "unused_param" | "missing_returns" | "invalid_returns";

export interface ValidationError {
  type: ValidationErrorType;
  target: string;
  message?: string;
}

export interface ValidationResult {
  errors: ValidationError[];
  isValid: boolean;
}
