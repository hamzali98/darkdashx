import { AfterViewInit, Component, ElementRef, Input, ViewChild, Inject, PLATFORM_ID, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { User } from '@app/features/users/interface/user';
import { product } from '../../products/interface/product-interface';

@Component({
  selector: 'app-bubble-chart',
  imports: [],
  templateUrl: './bubble-chart.html',
  styleUrl: './bubble-chart.css',
})
export class BubbleChart implements OnChanges {

  private root!: am5.Root;

  @Input() userChartData!: User[];
  @Input() productChartData!: product[];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.userChartData && this.productChartData) {
      // console.log(this.userChartData);
      // console.log(this.productChartData);
      // this.prepareDonutChart();
      this.createChart();
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


  createChart() {
    const data = this.buildCompanyBubbleData(this.productChartData);

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

    // X Axis (Avg Price)
    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererX.new(this.root, {}),
        tooltip: am5.Tooltip.new(this.root, {})
      })
    );

    // Y Axis (Total Stock)
    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(this.root, {
        renderer: am5xy.AxisRendererY.new(this.root, {}),
        tooltip: am5.Tooltip.new(this.root, {})
      })
    );

    // LineSeries used as Bubble series
    const series = chart.series.push(
      am5xy.LineSeries.new(this.root, {
        xAxis,
        yAxis,
        valueXField: "avgPrice",
        valueYField: "totalStock",
        tooltip: am5.Tooltip.new(this.root, {
          labelText:
            "Company: {company}\nAvg Price: {avgPrice}\nStock: {totalStock}\nProducts: {productCount}"
        })
      })
    );

    // IMPORTANT: Hide the line
    series.strokes.template.set("visible", false);

    // 1️⃣ Create circle template (REQUIRED for heatRules)
    const circleTemplate = am5.Template.new<am5.Circle>({
      fillOpacity: 0.8,
      fill: am5.color("#cb3cff"),
      strokeOpacity: 0
    });

    // 2️⃣ Add ONE bullet using the template
    series.bullets.push(() =>
      am5.Bullet.new(this.root, {
        sprite: am5.Circle.new(this.root, {}, circleTemplate)
      })
    );

    // 3️⃣ Heat rule controls bubble size
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
  }

  ngOnDestroy() {
    this.root?.dispose();
  }

}
