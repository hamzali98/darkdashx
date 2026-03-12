import { Component, DestroyRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnalyticsCard } from "@app/shared/components/analytics-card/analytics-card";
import { AmCharts } from "./components/am-charts/am-charts";
import { UsersAmChart } from "./components/users-am-chart/users-am-chart";
import { DonutChart } from "./components/donut-chart/donut-chart";
import { BubbleChart } from "./components/bubble-chart/bubble-chart";
import { MapChart } from "./components/map-chart/map-chart";
import { User } from '../users/interface/user';
import { product } from './products/interface/product-interface';
import { DataError } from "@app/shared/components/data-error/data-error";
import { TooltipDirective } from "@app/shared/directive/tooltip/tooltip";
import { ChartService } from './services/chart-service';
import { AuthService } from '@app/core/auth/services/auth-service';
import { DataFetchService } from '@app/shared/services/data/data-fetch-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TickAnimationService } from '@app/shared/services/tick-animation/tick-animation-service';

@Component({
  selector: 'app-dashboard',
  imports: [AnalyticsCard, AmCharts, DonutChart, BubbleChart, MapChart, DataError, TranslateModule, UsersAmChart, TooltipDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  username = signal<string>('Guest');

  usersData = signal<User[]>([]);
  productsData = signal<product[]>([]);

  private amCharts = viewChild(AmCharts);
  private donutChart = viewChild(DonutChart);
  private bubbleChart = viewChild(BubbleChart);
  private usersAmChart = viewChild(UsersAmChart);

  private destroyRef = inject(DestroyRef);
  private authservice = inject(AuthService);
  private chartService = inject(ChartService);
  private dataFetchService = inject(DataFetchService);
  private tickAnimationService = inject(TickAnimationService);
  private translateService = inject(TranslateService);

  constructor() { }

  ngOnInit(): void {
    const user = this.authservice.getUser();
    this.username.set(user?.username ?? 'Guest');

    this.dataFetchService.sharedUserData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(users => {
        this.usersData.set(users);
      });

    this.dataFetchService.sharedProductData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(products => {
        this.productsData.set(products);
      });
  }

  getReports() {
    const pChartData = this.chartService.buildProductChartData(this.productsData());
    const uChartData = this.chartService.buildUserChartData(this.usersData());
    const donutData = this.chartService.buildUserStatusDonutData(this.usersData());
    const bubbleData = this.chartService.buildCompanyBubbleData(this.productsData());

    const pChartTitle = this.translateService.instant("Products by Category");
    const uChartTitle = this.translateService.instant("Users by Company");
    const donutTitle = this.translateService.instant("Users Activity");
    const bubbleTitle = this.translateService.instant("Products by Pricing");

    this.tickAnimationService.show(this.translateService.instant('EXPORT_SUCCESS'), 3000);

    setTimeout(() => {

      // Product chart data — keys are 'category', 'productCount', 'totalStock', 'averageStock'
      this.chartService.exportJsonToExcel(pChartData, pChartTitle, [
        { key: 'category', label: this.translateService.instant('Category') },
        { key: 'productCount', label: this.translateService.instant('Products') },
        { key: 'totalStock', label: this.translateService.instant('Total Stock') },
        { key: 'averageStock', label: this.translateService.instant('Average Stock') }
      ]);

      // User chart data — keys are 'team', 'totalUsers', 'activeUsers', 'inactiveUsers'
      this.chartService.exportJsonToExcel(uChartData, uChartTitle, [
        { key: 'team', label: this.translateService.instant('Team') },
        { key: 'totalUsers', label: this.translateService.instant('Total Users') },
        { key: 'activeUsers', label: this.translateService.instant('Active Users') },
        { key: 'inactiveUsers', label: this.translateService.instant('Inactive Users') }
      ]);

      this.chartService.exportJsonToExcel(donutData, donutTitle, [
        { key: 'category', label: this.translateService.instant('Category') },
        { key: 'value', label: this.translateService.instant('Value') }
      ]);

      // Bubble data — keys are 'company', 'avgPrice', 'totalStock', 'productCount'
      this.chartService.exportJsonToExcel(bubbleData, bubbleTitle, [
        { key: 'company', label: this.translateService.instant('Company') },
        { key: 'avgPrice', label: this.translateService.instant('Avg Price') },
        { key: 'totalStock', label: this.translateService.instant('Total Stock') },
        { key: 'productCount', label: this.translateService.instant('Products') }
      ]);
    }, 1500);
  }

  getCharts() {
    this.tickAnimationService.show(this.translateService.instant('EXPORT_SUCCESS'), 3000);

    setTimeout(() => {
      this.amCharts()?.downloadChart();
      this.donutChart()?.downloadChart();
      this.bubbleChart()?.downloadChart();
      this.usersAmChart()?.downloadChart();
    }, 2000);
  }

}
