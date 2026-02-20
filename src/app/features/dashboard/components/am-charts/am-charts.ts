import { AfterViewInit, Component, inject, Inject, Input, NgZone, OnChanges, OnDestroy, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";


import { User } from '@app/features/users/interface/user';
import { product } from '../../products/interface/product-interface';

import { TranslationService } from '@app/core/services/translate.service';
import { Subscription } from 'rxjs';
import { ChartService } from '../../services/chart-service';

@Component({
  selector: 'app-am-charts',
  imports: [],
  templateUrl: './am-charts.html',
  styleUrl: './am-charts.css',
})
export class AmCharts implements OnInit, OnChanges, OnDestroy {

  isRtl: boolean;

  private root!: am5.Root;
  private exporting!: am5plugins_exporting.Exporting;;

  private languageSubscription?: Subscription;

  @Input() userChartData!: User[];
  @Input() productChartData!: product[];

  translationService = inject(TranslationService);
  chartService = inject(ChartService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) {

    this.isRtl = this.translationService.getCurrentLanguage() === 'ur';

  }

  ngOnInit(): void {
    // Subscribe to language changes
    this.languageSubscription = this.translationService.currentLang$.subscribe(lang => {
      this.isRtl = lang === 'ur';

      // Redraw chart if data is available
      if (this.productChartData && this.userChartData) {
        this.prepareBarChart();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && this.productChartData && this.userChartData) {
      // console.log(this.userChartData);
      // console.log(this.productChartData);
      this.prepareBarChart();
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

  downloadChart() {
    this.exporting.download("png"); // or "jpg", "svg", "pdf"
  }

  prepareBarChart() {
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

    const data = this.chartService.buildProductChartData(this.productChartData, this.isRtl);
    const isRTL = this.isRtl;
    const maxValue = this.getDataMax();

    console.log("chart max value", maxValue);

    const productsSeriesName = isRTL ? 'مصنوعات' : 'Products';
    const stockSeriesName = isRTL ? 'سٹاک' : 'Stock';
    const stockAveragename = isRTL ? 'اوسط اسٹاک' : 'Average Stock';


    // Chart code goes in here
    this.browserOnly(() => {

      let root = am5.Root.new("chartdiv");
      root.setThemes([am5themes_Animated.new(root)]);
      this.exporting = am5plugins_exporting.Exporting.new(root, {
        filePrefix: "Product-Chart", // name of the downloaded file
      });

      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panY: false,
          layout: root.verticalLayout
        })
      );


      // Create Y-axis
      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          // maxDeviation: 0.3,
          renderer: am5xy.AxisRendererY.new(root, {}),
          min: 0,  // Start from 0
          max: maxValue, // Fixed maximum value
          strictMinMax: true // Enforce these limits strictly

        })
      );

      yAxis.get("renderer").labels.template.setAll({
        // textAlign: "center",
        // fontFamily: isRTL ? "JameelNoori" : "",
        rotation: 0,
        centerY: am5.p50,
        centerX: am5.p50,
        paddingTop: 10,
        textAlign: "center",
        fontSize: '10px',
        fontFamily: isRTL ? "JameelNoori" : '',
        direction: isRTL ? "rtl" : "ltr",
        oversizedBehavior: "wrap",
        maxWidth: 100
      })

      // Create X-Axis with RTL support
      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 30,
            cellStartLocation: 0.1,
            cellEndLocation: 0.9
          }),
          categoryField: "category"
        })
      );

      // Configure label properties for RTL
      xAxis.get("renderer").labels.template.setAll({
        rotation: 0,
        centerY: am5.p50,
        centerX: am5.p50,
        paddingTop: 10,
        textAlign: "center",
        fontSize: isRTL ? '16px' : '10px',
        fontFamily: isRTL ? "JameelNoori" : '',
        direction: isRTL ? "rtl" : "ltr",
        oversizedBehavior: "wrap",
        maxWidth: 100
      });

      xAxis.data.setAll(data);

      // Create series
      let series1 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: productsSeriesName,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "productCount",
          categoryXField: "category",
          fill: am5.color("#cb3cff"),
        })
      );

      let series2 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: stockSeriesName,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "totalStock",
          categoryXField: "category",
          fill: am5.color("#00c2ff"),
        })
      );

      let series3 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: stockAveragename,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "averageStock",
          categoryXField: "category",
          fill: am5.color("#32CD32"),
        })
      );

      series1.data.setAll(data);
      series2.data.setAll(data);
      series3.data.setAll(data);
      // Configure series1 with dynamic tooltip positioning
      series1 = this.createChartTooltip(series1, root, productsSeriesName, "#cb3cff");

      // Same for series2
      series2 = this.createChartTooltip(series2, root, stockSeriesName, "#00c2ff");

      series3 = this.createChartTooltip(series3, root, stockAveragename, "#32CD32");

      // Add legend
      let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: root.horizontalLayout
      }));

      legend.labels.template.setAll({
        fontFamily: isRTL ? 'JameelNoori' : '',
        // textAlign: isRTL ? "right" : "left",
        // direction: isRTL ? "rtl" : "ltr",
        marginLeft: isRTL ? -25 : 5,
        // marginRight: isRTL ? 10 : 0
      });

      legend.data.setAll(chart.series.values);

      // Add cursor
      // chart.set("cursor", am5xy.XYCursor.new(root, {
      // }));

      root.interfaceColors.set("text", am5.color("#fff"));
      this.root = root;
    });
  }

  // // chart data preparation function
  // getData() {
  //   const categoryMap: Record<string, { count: number; stock: number }> = {};

  //   this.productChartData.forEach(p => {
  //     const category = p.basic_info.product_category;

  //     if (!categoryMap[category]) {
  //       categoryMap[category] = { count: 0, stock: 0 };
  //     }

  //     categoryMap[category].count += 1;
  //     categoryMap[category].stock += p.detail_info.product_stock;
  //   });

  //   // Translation map for categories
  //   const categoryTranslations: Record<string, string> = {
  //     'cosmetics': this.isRtl ? 'کاسمیٹکس' : 'Cosmetics',
  //     'note book': this.isRtl ? 'نوٹ بک' : 'Note Book',
  //     'accessories': this.isRtl ? 'پرزے' : 'Accessories',
  //     'network': this.isRtl ? 'نیٹ ورک' : 'Network',
  //     'digital': this.isRtl ? 'ڈیجیٹل' : 'Digital',
  //     'telecomunication': this.isRtl ? 'ٹیلی کمیونیکیشن' : 'Telecomunication',
  //     'light': this.isRtl ? 'روشنی' : 'Light'
  //   };

  //   // Helper function to translate category
  //   const translateCategory = (category: string): string => {
  //     return categoryTranslations[category] || category; // Fallback to original if not found
  //   };

  //   const data = Object.keys(categoryMap).map(category => ({
  //     category: translateCategory(category),
  //     productCount: categoryMap[category].count,
  //     totalStock: categoryMap[category].stock,
  //     averageStock: Math.ceil(categoryMap[category].stock / categoryMap[category].count)
  //   }));

  //   console.log('Prepared chart data:', data);
  //   return data;
  // }

  // // // function to calculate the maximum value for Y-axis scaling
  // // getDataMax(): number {

  // //   // Calculate the maximum value from both productCount and totalStock
  // //   const data = this.getData();
  // //   const maxProductCount = Math.max(...data.map(item => item.productCount));
  // //   const maxStock = Math.max(...data.map(item => item.totalStock));
  // //   const maxValue = Math.max(maxProductCount, maxStock);

  // //   // Set Y-axis max with some padding
  // //   // Option 1: Round up to nearest 10
  // //   let yAxisMax = Math.ceil(maxValue / 10) * 10;

  // //   // Ensure minimum of 10
  // //   if (yAxisMax < 10) yAxisMax = 10;

  // //   return yAxisMax;
  // // }

  // function to calculate the maximum value for Y-axis scaling
  getDataMax(): number {
    // Calculate the maximum value from both productCount and totalStock
    const data = this.chartService.buildProductChartData(this.productChartData, this.isRtl);
    const maxProductCount = Math.max(...data.map(item => item.productCount));
    const maxStock = Math.max(...data.map(item => item.totalStock));
    const maxAverage = Math.max(...data.map(item => item.averageStock));
    const maxValue = Math.max(maxProductCount, maxStock, maxAverage);

    // Add 15% padding for better spacing
    const paddedValue = maxValue * 1.15;

    // Round up to nearest 10
    let yAxisMax = Math.ceil(paddedValue / 10) * 10;

    // Ensure minimum of 10
    if (yAxisMax < 10) yAxisMax = 10;

    return yAxisMax;
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  createChartTooltip(series: any, root: any, seriesName: string, color: string) {
    // Configure series1 with dynamic tooltip positioning
    series.columns.template.setAll({
      strokeWidth: 2,
      width: 15,
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "vertical", // Allows tooltip to flip automatically
        getFillFromSprite: false,
        labelText: "",
        autoTextColor: false,
        background: am5.RoundedRectangle.new(root, {
          fill: am5.color(color),
          strokeWidth: 1,
          shadowColor: am5.color("#000"),
          shadowBlur: 8,
          shadowOffsetX: 0,
          shadowOffsetY: 2,
        }),
      }),
      // Custom HTML for tooltip content
      tooltipHTML: this.getToolTipHtml(seriesName),
      cornerRadiusTL: 5,
      cornerRadiusTR: 5
    });

    series.set("tooltip", am5.Tooltip.new(root, {
      pointerOrientation: "vertical", // Allows tooltip to flip automatically
      getFillFromSprite: false,
      labelText: "",
      autoTextColor: false
    }));

    return series;
  }

  // function to generate custom HTML for tooltips
  getToolTipHtml(seriesName: string) {
    const fontSize = this.isRtl ? '16px' : '14px';
    return `
          <div style="font-weight: bold; color: #fff; text-align: center; margin-bottom: 8px; font-size: ${fontSize};">{categoryX}</div>
          <div style="color: #fff; font-size: 13px;">
            <span style="color: #fff; text-align: center; font-weight: 600;">${seriesName} :</span> {valueY}
          </div>`;
  }

}
