import { AfterViewInit, Component, Inject, Input, NgZone, OnChanges, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { User } from '@app/features/users/interface/user';
import { product } from '../../products/interface/product-interface';

@Component({
  selector: 'app-am-charts',
  imports: [],
  templateUrl: './am-charts.html',
  styleUrl: './am-charts.css',
})
export class AmCharts implements OnChanges {

  private root!: am5.Root;

  @Input() userChartData!: User[];
  @Input() productChartData!: product[];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && this.productChartData && this.userChartData) {
      console.log(this.userChartData);
      console.log(this.productChartData);
      this.prepareBarChart();
    }
  }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }


  prepareBarChart() {
    const categoryMap: Record<string, { count: number; stock: string }> = {};

    this.productChartData.forEach(p => {
      const category = p.basic_info.product_category;

      if (!categoryMap[category]) {
        categoryMap[category] = { count: 0, stock: "0" };
      }

      categoryMap[category].count += 1;
      categoryMap[category].stock += p.detail_info.product_stock;
    });

    const data = Object.keys(categoryMap).map(category => ({
      category,
      productCount: categoryMap[category].count,
      totalStock: categoryMap[category].stock
    }));

    console.log("data : ", data);

    // Chart code goes in here
    this.browserOnly(() => {
      let root = am5.Root.new("chartdiv");

      root.setThemes([am5themes_Animated.new(root)]);

      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panY: false,
          layout: root.verticalLayout
        })
      );

      // Create Y-axis
      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {})
        })
      );

      // Create X-Axis
      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {}),
          categoryField: "category"
          
        })
      );
      xAxis.data.setAll(data);

      // Create series
      let series1 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Products",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "productCount",
          categoryXField: "category",
          fill: am5.color("#cb3cff"),
          tooltip: am5.Tooltip.new(root, {
            labelText: "{name}: {valueY}"
          })
        })
      );
      let series2 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: "Stock",
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "totalStock",
          categoryXField: "category",
          fill: am5.color("#00c2ff"),
          tooltip: am5.Tooltip.new(root, {
            labelText: "{name}: {valueY}"
          })
        })
      );

      series1.data.setAll(data);
      series2.data.setAll(data);

      series1.columns.template.setAll({
        strokeWidth: 2,
        width: 20,
        tooltipText: "{categoryX}\nProducts: {valueY}",
        tooltipY: 0,
        cornerRadiusTL: 5,
        cornerRadiusTR: 5
      });
      series2.columns.template.setAll({
        strokeWidth: 2,
        width: 20,
        tooltipText: "{categoryX}\nStock: {valueY}",
        tooltipY: 0,
        cornerRadiusTL: 5,
        cornerRadiusTR: 5
      });

      // Add legend
      let legend = chart.children.push(am5.Legend.new(root, {}));
      legend.data.setAll(chart.series.values);

      // Add cursor
      chart.set("cursor", am5xy.XYCursor.new(root, {}));

      root.interfaceColors.set("text" , am5.color("#fff"));
      this.root = root;
    });
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
