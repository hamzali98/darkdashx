import { Component, inject, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import { AnalyticsCard } from "@app/shared/components/analytics-card/analytics-card";
import { AmCharts } from "./components/am-charts/am-charts";
import { User } from '../users/interface/user';
import { product } from './products/interface/product-interface';
import { Httpservice } from '@app/shared/services/httpservice/httpservice';
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
import { BehaviorSubject } from 'rxjs';
import { Loaderservice } from '@app/shared/services/loader/loaderservice';
import { DataFetchService } from '@app/shared/services/data/data-fetch-service';

@Component({
  selector: 'app-dashboard',
  imports: [AnalyticsCard, AmCharts, DonutChart, BubbleChart, MapChart, DataError, TranslateModule, UsersAmChart, TooltipDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {

  userURL = environment.USER_URL;
  productURL = environment.PRODUCTS_URL;

  usersData = signal<User[]>([]);
  productsData = signal<product[]>([]);

  private donutChart = viewChild(DonutChart);
  private productChart = viewChild(AmCharts);
  private bubbleChart = viewChild(BubbleChart);
  private userChart = viewChild(UsersAmChart);

  private authservice = inject(AuthService);
  private chartService = inject(ChartService);
  private loaderService = inject(Loaderservice);
  private snackService = inject(SnackBarService);
  private translationService = inject(TranslationService);
  private dataFetchService = inject(DataFetchService);

  constructor() { }

  ngOnInit(): void {
    if (this.loaderService.isVisible$) {
      this.loaderService.hideLoader();
    } else {
      this.loaderService.showLoader();
    }
  }

  ngAfterViewInit(): void {
    this.getUsersDataFromService();
  }

  ngOnDestroy(): void {
  }

  get username() {
    return this.authservice.getUser()?.username ?? "Guest";
  }

  get isRTL(): boolean {
    return this.translationService.getCurrentLanguage() === 'ur';
  }

  getUsersDataFromService() {
    if(!this.loaderService.isVisible$){
      this.loaderService.showLoader();
    }
    this.dataFetchService.sharedUserData().subscribe({
      next: (res) => {
        // if (!res || res.length === 0) {
        //   this.snackService.error(this.isRTL ? "کوئی ڈیٹا نہیں ملا!" : "No data found", 2000, 'top-right');
        // }
        this.usersData.set(res);
        this.getProductsDataFromService();
        if(this.loaderService.isVisible$){
          this.loaderService.hideLoader();
        }
        // this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے لیا گیا!" : "Data fetched successfully!", 2000, 'top-right');
      },
      error: (err) => {
        if(this.loaderService.isVisible$){
          this.loaderService.hideLoader();
        }
        this.snackService.error(this.isRTL ? "سرور کی خرابی!" : "Server Error!", 2000, 'top-right');
      }
    })
  }

  getProductsDataFromService() {
    if(!this.loaderService.isVisible$){
      this.loaderService.showLoader();
    }
    this.dataFetchService.sharedProductData().subscribe({
      next: (res) => {
        // if (!res || res.length === 0) {
        //   this.snackService.error(this.isRTL ? "کوئی ڈیٹا نہیں ملا!" : "No data found", 2000, 'top-right');
        // }
        this.productsData.set(res);
        if(this.loaderService.isVisible$){
          this.loaderService.hideLoader();
        }
        this.snackService.success(this.isRTL ? "ڈیٹا کامیابی سے لیا گیا!" : "Data fetched successfully!", 2000, 'top-right');
      },
      error: (err) => {
        if(this.loaderService.isVisible$){
          this.loaderService.hideLoader();
        }
        this.snackService.error(this.isRTL ? "سرور کی خرابی!" : "Server Error!", 2000, 'top-right');
      }
    })
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
    this.donutChart()?.downloadChart();
    this.bubbleChart()?.downloadChart();
    this.productChart()?.downloadChart();
    this.userChart()?.downloadChart();
  }

}
