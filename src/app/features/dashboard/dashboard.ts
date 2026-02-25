import { Component, inject, OnInit, signal, viewChild } from '@angular/core';
import { AnalyticsCard } from "@app/shared/components/analytics-card/analytics-card";
import { AmCharts } from "./components/am-charts/am-charts";
import { User } from '../users/interface/user';
import { product } from './products/interface/product-interface';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { finalize } from 'rxjs';
import { DonutChart } from "./components/donut-chart/donut-chart";
import { BubbleChart } from "./components/bubble-chart/bubble-chart";
import { MapChart } from "./components/map-chart/map-chart";
import { environment } from '@environments/environment.development';
import { AuthService } from '@app/core/auth/services/auth-service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { DataError } from "@app/shared/components/data-error/data-error";
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService } from '@app/core/services/translate.service';
import { UsersAmChart } from "./components/users-am-chart/users-am-chart";
import { ChartService } from './services/chart-service';
import { TooltipDirective } from "@app/shared/directive/tooltip/tooltip";

@Component({
  selector: 'app-dashboard',
  imports: [AnalyticsCard, AmCharts, DonutChart, BubbleChart, MapChart, DataError, TranslateModule, UsersAmChart, TooltipDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  isRTL: boolean;

  productURL = environment.PRODUCTS_URL;
  userURL = environment.USER_URL;

  userData!: User[];
  productData!: product[];

  // @viewChild(DonutChart) donut! : DonutChart;

  private donutChart = viewChild(DonutChart);
  private productChart = viewChild(AmCharts);
  private bubbleChart = viewChild(BubbleChart);
  private userChart = viewChild(UsersAmChart);
  
  
  httpService = inject(Httpservice);
  authservice = inject(AuthService);
  loaderService = inject(Loaderservice);
  snackService = inject(SnackBarService);
  translationService = inject(TranslationService);
  chartService = inject(ChartService);

  constructor() {
    this.isRTL = this.translationService.getCurrentLanguage() === 'ur' ? true : false;
  }

  ngOnInit(): void {
    // this.loaderService.showLoader();
    this.getUserData();
    // this.getProductData();
    // this.loaderService.hideLoader();
  }

  get username() {
    return this.authservice.getUser()?.username ?? "Guest";
  }
  getUserData() {
    this.loaderService.showLoader();
    this.httpService.getApi(this.userURL).subscribe({
      next: (res) => {
        // console.log(res);
        this.userData = res.body;
        this.getProductData();
      },
      error: (err) => {
        // console.log(err);
        this.loaderService.hideLoader();
        this.snackService.error(this.isRTL ? "سرور کی خرابی!" : "Server Error!", 2000, 'top-left');

      }
    });
  }

  getProductData() {
    this.httpService.getApi(this.productURL).subscribe({
      next: (res) => {
        // console.log(res);
        this.productData = res.body;
        this.loaderService.hideLoader();
      },
      error: (err) => {
        // console.log(err);
        this.loaderService.hideLoader();
        this.snackService.error(this.isRTL ? "سرور کی خرابی!" : "Server Error!", 2000, 'top-left');
      }
    })
  }

  getReports() {
    const isRTL = this.translationService.getCurrentLanguage() === 'ur' ? true : false;
    console.log("getting files")
    const pChartData = this.chartService.buildProductChartData(this.productData, isRTL);
    const uChartData = this.chartService.buildUserChartData(this.userData, isRTL);
    const donutData = this.chartService.buildUserStatusDonutData(this.userData, isRTL);
    const bubbleData = this.chartService.buildCompanyBubbleData(this.productData, isRTL);

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

  getCharts(){
    this.donutChart()?.downloadChart();
    this.bubbleChart()?.downloadChart();
    this.productChart()?.downloadChart();
    this.userChart()?.downloadChart();
  }

}
