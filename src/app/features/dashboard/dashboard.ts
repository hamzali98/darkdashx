import { Component, inject, OnInit, signal } from '@angular/core';
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

@Component({
  selector: 'app-dashboard',
  imports: [AnalyticsCard, AmCharts, DonutChart, BubbleChart, MapChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  user_name = signal('John');
  productURL = environment.PRODUCTS_URL;
  userURL = environment.USER_URL;

  userData!: User[];
  productData!: product[];

  httpService = inject(Httpservice);
  loaderService = inject(Loaderservice);

  ngOnInit(): void {
    this.loaderService.showLoader();
    this.getUserData();
    this.getProductData();
    this.loaderService.hideLoader();
  }

  getUserData() {
    // this.loaderService.showLoader();
    this.httpService.getApi(this.userURL).pipe(
      finalize(() => {
        // this.loaderService.hideLoader();
      })
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.userData = res.body;
      },
      error: (err) => {
        console.log(err);
        // this.loaderService.hideLoader();

      }
    });
  }

  getProductData() {
    // this.loaderService.showLoader();
    this.httpService.getApi(this.productURL).pipe(
      finalize(() => {
        // this.loaderService.hideLoader();
      })
    ).subscribe({
      next: (res) => {
        console.log(res);
        this.productData = res.body;
      },
      error: (err) => {
        console.log(err);
        // this.loaderService.hideLoader();

      }
    })
  }

}
