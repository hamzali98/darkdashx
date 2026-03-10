// unsaved-changes.guard.ts
import { CanDeactivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { FormService } from '@app/features/dashboard/products/products-add/service/form-service';
import { DialogService } from '../services/dialog-service/dialog';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

export const unsavedChangesGuard: CanDeactivateFn<unknown> = () => {
  const dialogService = inject(DialogService);
  const translateModule = inject(TranslateService);
  const productFormService = inject(FormService);

  if (!productFormService.hasUnsavedChanges() && productFormService.isInvalid()) {
    return true; // ✅ No changes — let navigation proceed immediately
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
        productFormService.resetForm(); // ✅ Clean up if user confirms leave
      }
      return confirmed; // true = allow navigation, false = block it
    })
  );
};