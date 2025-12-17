import { AfterViewInit, Component, Inject, Input, NgZone, OnChanges, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";

import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { User } from '@app/features/users/interface/user';
import { product } from '../../products/interface/product-interface';

@Component({
  selector: 'app-donut-chart',
  imports: [],
  templateUrl: './donut-chart.html',
  styleUrl: './donut-chart.css',
})
export class DonutChart implements OnChanges {

  private root!: am5.Root;

  @Input() userChartData!: User[];
  @Input() productChartData!: product[];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.userChartData && this.productChartData) {
      console.log(this.userChartData);
      console.log(this.productChartData);
      this.prepareDonutChart();
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

  buildUserStatusDonutData(users: User[]) {
    const online = this.userChartData.filter(u => u.status === true).length;
    const offline = this.userChartData.filter(u => u.status === false).length;

    return [
      { category: 'Online', value: online },
      { category: 'Offline', value: offline }
    ];
  }
  prepareDonutChart() {
    const donutdata = this.buildUserStatusDonutData(this.userChartData);

    this.browserOnly(() => {
      // Create root and chart
      let root = am5.Root.new("donutdiv");
      let chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
          radius: am5.percent(95),
          innerRadius: am5.percent(50),
        })
      );

      // Define data
      // let data = [{
      //   country: "France",
      //   sales: 100000,
      // }, {
      //   country: "Spain",
      //   sales: 160000,

      // }, {
      //   country: "United Kingdom",
      //   sales: 80000
      // }];

      // Create series
      let series = chart.series.push(
        am5percent.PieSeries.new(root, {
          name: "Status",
          valueField: "value",
          categoryField: "category",
          alignLabels: false
        })
      );
      series.labels.template.set("forceHidden", true);

      series.get("colors")?.set("colors", [
        am5.color("#cb3cff"),
        am5.color("#00c2ff"),
        am5.color("#67b7dc"),
        am5.color("#0a1330"),
        am5.color("#14CA74"),
        am5.color("#FF5A65"),
      ]);

      series.data.setAll(donutdata);

      // Add legend
      let legend = chart.children.push(am5.Legend.new(root, {
        // centerX: am5.percent(50),
        // x: am5.percent(50),
        // layout: root.horizontalLayout
      }));

      legend.data.setAll(series.dataItems);

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
