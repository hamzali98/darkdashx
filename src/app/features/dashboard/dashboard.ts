import { Component, signal } from '@angular/core';
import { AnalyticsCard } from "@app/shared/components/analytics-card/analytics-card";

@Component({
  selector: 'app-dashboard',
  imports: [AnalyticsCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  user_name = signal('John');

}
