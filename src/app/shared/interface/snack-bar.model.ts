
export type SnackbarType = 'success' | 'error' | 'warning' | 'general';

export interface SnackbarData {
  message: string;
  type: SnackbarType;
  duration?: number; 
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}