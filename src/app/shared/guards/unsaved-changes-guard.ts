// unsaved-changes.guard.ts
import { map } from 'rxjs/operators';
import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from '../services/dialog-service/dialog';
import { HasUnsavedChanges } from '../interface/has-unsaved-changes';

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  const dialogService = inject(DialogService);
  const translateModule = inject(TranslateService);

  if (!component.hasUnsavedChanges() && !component.isValid()) {
    return true;
  }

  // ✅ Return the Observable directly — Angular waits for it to emit
  return dialogService.open({
    actbtn: translateModule.instant('CONFIRM'),
    title: `⚠️ ${translateModule.instant('Confirmation Alert')}`,
    message: translateModule.instant('You have unsaved changes. Are you sure you want to leave?'),
    type: 'generic'
  }).pipe(
    map(confirmed => {
      if (confirmed) {
        component.resetForm(); // ✅ calls the right reset automatically
      }
      return confirmed; // true = allow navigation, false = block it
    })
  );
};