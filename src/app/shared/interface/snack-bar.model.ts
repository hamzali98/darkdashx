// src/app/shared/snackbar/snackbar.model.ts

export type SnackbarType = 'success' | 'error' | 'warning' | 'general';

export interface SnackbarData {
  message: string;
  type: SnackbarType;
  duration?: number; // Optional duration in milliseconds
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'; // Custom positions
}