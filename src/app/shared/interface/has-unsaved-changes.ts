export interface HasUnsavedChanges {
    resetForm(): void,
    hasUnsavedChanges(): boolean,
    isValid(): boolean,
}
