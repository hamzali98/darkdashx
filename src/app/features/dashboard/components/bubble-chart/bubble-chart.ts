// import { AfterViewInit, Component, ElementRef, Input, ViewChild, Inject, PLATFORM_ID, NgZone, OnChanges, SimpleChanges } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import * as am5 from "@amcharts/amcharts5";
// import * as am5xy from "@amcharts/amcharts5/xy";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
// import { User } from '@app/features/users/interface/user';
// import { product } from '../../products/interface/product-interface';

// @Component({
//   selector: 'app-bubble-chart',
//   imports: [],
//   templateUrl: './bubble-chart.html',
//   styleUrl: './bubble-chart.css',
// })
// export class BubbleChart implements OnChanges {

//   private root!: am5.Root;

//   @Input() userChartData!: User[];
//   @Input() productChartData!: product[];

//   constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) { }

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes && this.userChartData && this.productChartData) {
//       // console.log(this.userChartData);
//       // console.log(this.productChartData);
//       // this.prepareDonutChart();
//       this.createChart();
//     }
//   }

//   // Run the function only in the browser
//   browserOnly(f: () => void) {
//     if (isPlatformBrowser(this.platformId)) {
//       this.zone.runOutsideAngular(() => {
//         f();
//       });
//     }
//   }

//   buildCompanyBubbleData(products: product[]) {
//     const map: Record<string, {
//       totalPrice: number;
//       totalStock: number;
//       count: number;
//     }> = {};

//     products.forEach(p => {
//       const company = p.basic_info.product_company;

//       if (!map[company]) {
//         map[company] = {
//           totalPrice: 0,
//           totalStock: 0,
//           count: 0
//         };
//       }

//       map[company].totalPrice += Number(p.basic_info.product_price);
//       map[company].totalStock += Number(p.detail_info.product_stock);
//       map[company].count += 1;
//     });

//     return Object.keys(map).map(company => ({
//       company,
//       avgPrice: +(map[company].totalPrice / map[company].count).toFixed(2),
//       totalStock: map[company].totalStock,
//       productCount: map[company].count
//     }));
//   }


//   createChart() {
//     const data = this.buildCompanyBubbleData(this.productChartData);

//     this.root = am5.Root.new("bubblediv");
//     this.root.interfaceColors.set("text", am5.color("#FFF"));
//     this.root.setThemes([am5themes_Animated.new(this.root)]);

//     const chart = this.root.container.children.push(
//       am5xy.XYChart.new(this.root, {
//         panX: true,
//         panY: true,
//         wheelX: "zoomX",
//         wheelY: "zoomY"
//       })
//     );

//     // X Axis (Avg Price)
//     const xAxis = chart.xAxes.push(
//       am5xy.ValueAxis.new(this.root, {
//         renderer: am5xy.AxisRendererX.new(this.root, {}),
//         tooltip: am5.Tooltip.new(this.root, {})
//       })
//     );

//     // Y Axis (Total Stock)
//     const yAxis = chart.yAxes.push(
//       am5xy.ValueAxis.new(this.root, {
//         renderer: am5xy.AxisRendererY.new(this.root, {}),
//         tooltip: am5.Tooltip.new(this.root, {})
//       })
//     );

//     // LineSeries used as Bubble series
//     const series = chart.series.push(
//       am5xy.LineSeries.new(this.root, {
//         xAxis,
//         yAxis,
//         valueXField: "avgPrice",
//         valueYField: "totalStock",
//         fill: am5.color("#cb3cff"),
//         tooltip: am5.Tooltip.new(this.root, {
//           labelText:
//             "Company: {company}\nAvg Price: {avgPrice}\nStock: {totalStock}\nProducts: {productCount}"
//         })
//       })
//     );

//     // IMPORTANT: Hide the line
//     series.strokes.template.set("visible", false);

//     // 1️⃣ Create circle template (REQUIRED for heatRules)
//     const circleTemplate = am5.Template.new<am5.Circle>({
//       fillOpacity: 0.8,
//       fill: am5.color("#cb3cff"),
//       strokeOpacity: 0
//     });

//     // 2️⃣ Add ONE bullet using the template
//     series.bullets.push(() =>
//       am5.Bullet.new(this.root, {
//         sprite: am5.Circle.new(this.root, {}, circleTemplate)
//       })
//     );

//     // 3️⃣ Heat rule controls bubble size
//     series.set("heatRules", [{
//       target: circleTemplate,
//       dataField: "productCount",
//       key: "radius",
//       min: 10,
//       max: 50,
//     }]);

//     series.data.setAll(data);


//     // Cursor
//     chart.set("cursor", am5xy.XYCursor.new(this.root, {
//       xAxis,
//       yAxis
//     }));
//   }

//   ngOnDestroy() {
//     this.root?.dispose();
//   }

// }

import { AfterViewInit, Component, ElementRef, Input, ViewChild, Inject, PLATFORM_ID, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { User } from '@app/features/users/interface/user';
import { product } from '../../products/interface/product-interface';
import { TranslationService } from '@app/core/services/translate.service';

@Component({
  selector: 'app-bubble-chart',
  imports: [],
  templateUrl: './bubble-chart.html',
  styleUrl: './bubble-chart.css',
})
export class BubbleChart implements OnInit, OnChanges, OnDestroy {

  isRtl: boolean;

  private root!: am5.Root;
  private languageSubscription?: Subscription;

  @Input() userChartData!: User[];
  @Input() productChartData!: product[];

  translationService = inject(TranslationService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) {
    this.isRtl = this.translationService.getCurrentLanguage() === 'ur';
  }

  ngOnInit(): void {
    // Subscribe to language changes
    this.languageSubscription = this.translationService.currentLang$.subscribe(lang => {
      this.isRtl = lang === 'ur';

      // Redraw chart if data is available
      if (this.productChartData && this.userChartData) {
        this.prepareBubbleChart();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.userChartData && this.productChartData) {
      this.prepareBubbleChart();
    }
  }

  ngOnDestroy() {
    // Clean up
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }

    if (this.root) {
      this.root.dispose();
    }

    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }

  prepareBubbleChart() {
    // Dispose existing chart before creating new one
    if (this.root) {
      this.root.dispose();
    }

    // Create new chart with updated language
    this.zone.runOutsideAngular(() => {
      this.createChart();
    });
  }

  createChart() {
    const data = this.buildCompanyBubbleData(this.productChartData);
    const isRTL = this.isRtl;

    // Chart code goes in here
    this.browserOnly(() => {
      this.root = am5.Root.new("bubblediv");
      this.root.interfaceColors.set("text", am5.color("#FFF"));
      this.root.setThemes([am5themes_Animated.new(this.root)]);

      const chart = this.root.container.children.push(
        am5xy.XYChart.new(this.root, {
          panX: true,
          panY: true,
          wheelX: "zoomX",
          wheelY: "zoomY"
        })
      );

      // Translation labels for axes
      const avgPriceLabel = isRTL ? 'اوسط قیمت' : 'Avg Price';
      const totalStockLabel = isRTL ? 'کل اسٹاک' : 'Total Stock';

      // X Axis (Avg Price)
      const xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(this.root, {
          renderer: am5xy.AxisRendererX.new(this.root, {}),
          tooltip: am5.Tooltip.new(this.root, {})
        })
      );

      // Configure X-axis labels for RTL
      xAxis.get("renderer").labels.template.setAll({
        direction: isRTL ? "rtl" : "ltr",
        textAlign: "center",
        fontFamily: isRTL ? "JameelNoori" : '',

      });

      // Y Axis (Total Stock)
      const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(this.root, {
          renderer: am5xy.AxisRendererY.new(this.root, {}),
          tooltip: am5.Tooltip.new(this.root, {})
        })
      );

      // Configure Y-axis labels for RTL
      yAxis.get("renderer").labels.template.setAll({
        direction: isRTL ? "rtl" : "ltr",
        textAlign: isRTL ? "right" : "left",
        fontFamily: isRTL ? "JameelNoori" : '',

      });

      // LineSeries used as Bubble series
      const series = chart.series.push(
        am5xy.LineSeries.new(this.root, {
          xAxis,
          yAxis,
          valueXField: "avgPrice",
          valueYField: "totalStock",
          fill: am5.color("#cb3cff")
        })
      );

      // IMPORTANT: Hide the line
      series.strokes.template.set("visible", false);

      // Create circle template (REQUIRED for heatRules)
      const circleTemplate = am5.Template.new<am5.Circle>({
        fillOpacity: 0.8,
        fill: am5.color("#cb3cff"),
        strokeOpacity: 0,
        tooltip: am5.Tooltip.new(this.root, {
          pointerOrientation: "vertical",
          getFillFromSprite: false,
          labelText: "",
          autoTextColor: false,
          background: am5.RoundedRectangle.new(this.root, {
            fill: am5.color("#cb3cff"),
            strokeWidth: 1,
            shadowColor: am5.color("#000"),
            shadowBlur: 8,
            shadowOffsetX: 0,
            shadowOffsetY: 2,
          }),
        }),
        tooltipHTML: this.getToolTipHtml()
      });

      // Add ONE bullet using the template
      series.bullets.push(() =>
        am5.Bullet.new(this.root, {
          sprite: am5.Circle.new(this.root, {}, circleTemplate)
        })
      );

      // Heat rule controls bubble size
      series.set("heatRules", [{
        target: circleTemplate,
        dataField: "productCount",
        key: "radius",
        min: 10,
        max: 50,
      }]);

      series.data.setAll(data);

      // Cursor
      chart.set("cursor", am5xy.XYCursor.new(this.root, {
        xAxis,
        yAxis
      }));

      this.root = this.root;
    });
  }

  // Build chart data with translations
  buildCompanyBubbleData(products: product[]) {
    const map: Record<string, {
      totalPrice: number;
      totalStock: number;
      count: number;
    }> = {};

    products.forEach(p => {
      const company = p.basic_info.product_company;

      if (!map[company]) {
        map[company] = {
          totalPrice: 0,
          totalStock: 0,
          count: 0
        };
      }

      map[company].totalPrice += Number(p.basic_info.product_price);
      map[company].totalStock += Number(p.detail_info.product_stock);
      map[company].count += 1;
    });

    return Object.keys(map).map(company => ({
      company,
      avgPrice: +(map[company].totalPrice / map[company].count).toFixed(2),
      totalStock: map[company].totalStock,
      productCount: map[company].count
    }));
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  // Function to generate custom HTML for tooltips
  getToolTipHtml() {
    const fontSize = this.isRtl ? '16px' : '14px';
    const companyLabel = this.isRtl ? 'کمپنی' : 'Company';
    const avgPriceLabel = this.isRtl ? 'اوسط قیمت' : 'Avg Price';
    const stockLabel = this.isRtl ? 'اسٹاک' : 'Stock';
    const productsLabel = this.isRtl ? 'مصنوعات' : 'Products';
    const direction = this.isRtl ? 'rtl' : 'ltr';

    return `
      <div style="direction: ${direction}; padding: 4px 0;">
        <div style="font-weight: bold; color: #fff; text-align: center; margin-bottom: 8px; font-size: ${fontSize};">{company}</div>
        <div style="color: #fff; font-size: 13px; text-align: ${this.isRtl ? 'right' : 'left'};">
          <div style="margin-bottom: 4px;">
            <span style="font-weight: 600;">${avgPriceLabel}:</span> {avgPrice}
          </div>
          <div style="margin-bottom: 4px;">
            <span style="font-weight: 600;">${stockLabel}:</span> {totalStock}
          </div>
          <div>
            <span style="font-weight: 600;">${productsLabel}:</span> {productCount}
          </div>
        </div>
      </div>
    `;
  }
}