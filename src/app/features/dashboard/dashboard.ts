import { Component, DestroyRef, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AnalyticsCard } from "@app/shared/components/analytics-card/analytics-card";
import { AmCharts } from "./components/am-charts/am-charts";
import { UsersAmChart } from "./components/users-am-chart/users-am-chart";
import { DonutChart } from "./components/donut-chart/donut-chart";
import { BubbleChart } from "./components/bubble-chart/bubble-chart";
import { MapChart } from "./components/map-chart/map-chart";
import { environment } from '@environments/environment.development';
import { User } from '../users/interface/user';
import { product } from './products/interface/product-interface';
import { DataError } from "@app/shared/components/data-error/data-error";
import { TooltipDirective } from "@app/shared/directive/tooltip/tooltip";
import { ChartService } from './services/chart-service';
import { AuthService } from '@app/core/auth/services/auth-service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { TranslationService } from '@app/core/services/translate.service';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { DataFetchService } from '@app/shared/services/data/data-fetch-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [AnalyticsCard, AmCharts, DonutChart, BubbleChart, MapChart, DataError, TranslateModule, UsersAmChart, TooltipDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

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
  private translationService = inject(TranslationService);

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

  get isRTL(): boolean {
    return this.translationService.getCurrentLanguage() === 'ur';
  }

  getReports() {
    const isRTL = this.translationService.getCurrentLanguage() === 'ur' ? true : false;
    console.log("getting files")
    const pChartData = this.chartService.buildProductChartData(this.productsData(), isRTL);
    const uChartData = this.chartService.buildUserChartData(this.usersData(), isRTL);
    const donutData = this.chartService.buildUserStatusDonutData(this.usersData(), isRTL);
    const bubbleData = this.chartService.buildCompanyBubbleData(this.productsData(), isRTL);

    const pChartTitle = isRTL ? "زمرہ کے لحاظ سے مصنوعات" : "Products by Category";
    const uChartTitle = isRTL ? "کمپنی کے مطابق صارفین" : "Users by Company";
    const donutTitle = isRTL ? "صارفین کی سرگرمی" : "Users Activity";
    const bubbleTitle = isRTL ? "قیمتوں کے مطابق مصنوعات" : "Products by Pricing";


    // Product chart data — keys are 'category', 'productCount', 'totalStock', 'averageStock'
    this.chartService.exportJsonToExcel(pChartData, pChartTitle, [
      { key: 'category', label: isRTL ? 'زمرہ' : 'Category' },
      { key: 'productCount', label: isRTL ? 'مصنوعات' : 'Products' },
      { key: 'totalStock', label: isRTL ? 'کل اسٹاک' : 'Total Stock' },
      { key: 'averageStock', label: isRTL ? 'اوسط اسٹاک' : 'Average Stock' }
    ]);


    // User chart data — keys are 'team', 'totalUsers', 'activeUsers', 'inactiveUsers'
    this.chartService.exportJsonToExcel(uChartData, uChartTitle, [
      { key: 'team', label: isRTL ? 'ٹیم' : 'Team' },
      { key: 'totalUsers', label: isRTL ? 'کل صارفین' : 'Total Users' },
      { key: 'activeUsers', label: isRTL ? 'فعال صارفین' : 'Active Users' },
      { key: 'inactiveUsers', label: isRTL ? 'غیر فعال' : 'Inactive Users' }
    ]);

    this.chartService.exportJsonToExcel(donutData, donutTitle, [
      { key: 'category', label: isRTL ? 'زمرہ' : 'Category' },
      { key: 'value', label: isRTL ? 'قدر' : 'Value' }
    ]);

    // Bubble data — keys are 'company', 'avgPrice', 'totalStock', 'productCount'
    this.chartService.exportJsonToExcel(bubbleData, bubbleTitle, [
      { key: 'company', label: isRTL ? 'کمپنی' : 'Company' },
      { key: 'avgPrice', label: isRTL ? 'اوسط قیمت' : 'Avg Price' },
      { key: 'totalStock', label: isRTL ? 'کل اسٹاک' : 'Total Stock' },
      { key: 'productCount', label: isRTL ? 'مصنوعات' : 'Products' }
    ]);
  }

  getCharts() {
    this.amCharts()?.downloadChart();
    this.donutChart()?.downloadChart();
    this.bubbleChart()?.downloadChart();
    this.usersAmChart()?.downloadChart();
  }

}
