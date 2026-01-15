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
import { AuthService } from '@app/core/auth/services/auth-service';
import { SnackBarService } from '@app/shared/services/snackbar/snack-bar-service';
import { DataError } from "@app/shared/components/data-error/data-error";

@Component({
  selector: 'app-dashboard',
  imports: [AnalyticsCard, AmCharts, DonutChart, BubbleChart, MapChart, DataError],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  productURL = environment.PRODUCTS_URL;
  userURL = environment.USER_URL;

  userData!: User[];
  productData!: product[];

  httpService = inject(Httpservice);
  authservice = inject(AuthService);
  loaderService = inject(Loaderservice);
  snackService = inject(SnackBarService);

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
        this.snackService.error("Server Error!", 2000, 'top-left');

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
        this.snackService.error("Server Error!", 2000, 'top-left');
      }
    })
  }

}
