import { AfterViewInit, Component, inject, Inject, Input, NgZone, OnChanges, OnDestroy, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import { User } from '@app/features/users/interface/user';
import { product } from '../../products/interface/product-interface';

import { TranslationService } from '@app/core/services/translate.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users-am-chart',
  imports: [],
  templateUrl: './users-am-chart.html',
  styleUrl: './users-am-chart.css',
})
export class UsersAmChart implements OnInit, OnChanges, OnDestroy {

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
      if (this.userChartData) {
        this.prepareBarChart();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && this.userChartData) {
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
    const data = this.getData();
    const isRTL = this.isRtl;
    const maxValue = this.getDataMax();

    const totalUsersSeriesName = isRTL ? 'کل صارفین' : 'Total Users';
    const activeUsersSeriesName = isRTL ? 'فعال صارفین' : 'Active Users';
    const inactiveUsersSeriesName = isRTL ? 'غیر فعال صارفین' : 'Inactive Users';

    // Chart code goes in here
    this.browserOnly(() => {
      let root = am5.Root.new("amchartdiv");
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
          renderer: am5xy.AxisRendererY.new(root, {}),
          min: 0,
          max: maxValue,
          strictMinMax: true
        })
      );

      yAxis.get("renderer").labels.template.setAll({
        rotation: 0,
        centerY: am5.p50,
        centerX: am5.p50,
        paddingTop: 10,
        textAlign: "center",
        fontSize: '12px',
        fontFamily: isRTL ? "JameelNoori" : '',
        direction: isRTL ? "rtl" : "ltr",
        oversizedBehavior: "wrap",
        maxWidth: 100
      });

      // Create X-Axis with RTL support
      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 30,
            cellStartLocation: 0.1,
            cellEndLocation: 0.9
          }),
          categoryField: "team"
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

      // Create series 1 - Total Users
      let series1 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: totalUsersSeriesName,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "totalUsers",
          categoryXField: "team",
          fill: am5.color("#cb3cff"),
        })
      );

      // Create series 2 - Active Users
      let series2 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: activeUsersSeriesName,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "activeUsers",
          categoryXField: "team",
          fill: am5.color("#00c2ff"),
        })
      );

      // Create series 3 - Inactive Users
      let series3 = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: inactiveUsersSeriesName,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "inactiveUsers",
          categoryXField: "team",
          fill: am5.color("#32CD32"),
        })
      );

      series1.data.setAll(data);
      series2.data.setAll(data);
      series3.data.setAll(data);

      // Configure tooltips for each series
      series1 = this.createChartTooltip(series1, root, totalUsersSeriesName, "#cb3cff");
      series2 = this.createChartTooltip(series2, root, activeUsersSeriesName, "#00c2ff");
      series3 = this.createChartTooltip(series3, root, inactiveUsersSeriesName, "#32CD32");

      // Add legend
      let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: root.horizontalLayout
      }));

      legend.labels.template.setAll({
        fontFamily: isRTL ? 'JameelNoori' : '',
        marginLeft: isRTL ? -25 : 5,
      });

      legend.data.setAll(chart.series.values);

      root.interfaceColors.set("text", am5.color("#fff"));
      this.root = root;
    });
  }

  // chart data preparation function
  getData() {
    const teamMap: Record<string, { total: number; active: number; inactive: number }> = {};

    this.userChartData.forEach(user => {
      const teamName = user.team_info.team_name;

      if (!teamMap[teamName]) {
        teamMap[teamName] = { total: 0, active: 0, inactive: 0 };
      }

      teamMap[teamName].total += 1;

      if (user.status === true) {
        teamMap[teamName].active += 1;
      } else {
        teamMap[teamName].inactive += 1;
      }
    });

    // Translation map for teams
    const teamTranslations: Record<string, string> = {
      'spotify': this.isRtl ? 'سپوٹیفائی' : 'Spotify',
      'twitter': this.isRtl ? 'ٹویٹر' : 'Twitter',
      'reddit': this.isRtl ? 'ریڈٹ' : 'Reddit',
      'google': this.isRtl ? 'گوگل' : 'Google',
      'pinterest': this.isRtl ? 'پنٹیرسٹ' : 'Pinterest',
      'facebook': this.isRtl ? 'فیس بک' : 'Facebook',
      'linkedin': this.isRtl ? 'لنکڈ' : 'Linkedin',
      'youtube': this.isRtl ? 'یوٹیوب' : 'Youtube',
    };

    // Helper function to translate team
    const translateTeam = (team: string): string => {
      return teamTranslations[team.toLowerCase()] || team;
    };

    const data = Object.keys(teamMap).map(team => ({
      team: translateTeam(team),
      totalUsers: teamMap[team].total,
      activeUsers: teamMap[team].active,
      inactiveUsers: teamMap[team].inactive
    }));

    console.log('Prepared chart data:', data);
    return data;
  }

  //   // function to calculate the maximum value for Y-axis scaling
  // getDataMax(): number {
  //   const data = this.getData();
  //   const maxTotal = Math.max(...data.map(item => item.totalUsers));
  //   const maxActive = Math.max(...data.map(item => item.activeUsers));
  //   const maxInactive = Math.max(...data.map(item => item.inactiveUsers));
  //   const maxValue = Math.max(maxTotal, maxActive, maxInactive);

  //   // Round up to nearest 10 and add padding
  //   let yAxisMax = Math.ceil(maxValue / 10) * 10;

  //   // If the rounded value equals max value, add more padding
  //   if (yAxisMax <= maxValue) {
  //     yAxisMax += 10;
  //   }

  //   // Ensure minimum of 10
  //   if (yAxisMax < 10) yAxisMax = 10;

  //   return yAxisMax;
  // }

  // function to calculate the maximum value for Y-axis scaling
  getDataMax(): number {
    const data = this.getData();
    const maxTotal = Math.max(...data.map(item => item.totalUsers));
    const maxActive = Math.max(...data.map(item => item.activeUsers));
    const maxInactive = Math.max(...data.map(item => item.inactiveUsers));
    const maxValue = Math.max(maxTotal, maxActive, maxInactive);

    // Add 10% padding to the max value
    const paddedValue = maxValue * 1.1;

    // Round up to nearest 10
    let yAxisMax = Math.ceil(paddedValue / 10) * 10;

    // Ensure minimum of 10
    if (yAxisMax < 10) yAxisMax = 10;

    return yAxisMax;
  }

  // padding approach
  // getDataMax(): number {
  //   const data = this.getData();
  //   const maxTotal = Math.max(...data.map(item => item.totalUsers));
  //   const maxActive = Math.max(...data.map(item => item.activeUsers));
  //   const maxInactive = Math.max(...data.map(item => item.inactiveUsers));
  //   const maxValue = Math.max(maxTotal, maxActive, maxInactive);

  //   // Add 15% padding for better spacing
  //   const paddedValue = maxValue * 1.15;

  //   // Round up to nearest 10
  //   let yAxisMax = Math.ceil(paddedValue / 10) * 10;

  //   // Ensure minimum of 10
  //   if (yAxisMax < 10) yAxisMax = 10;

  //   return yAxisMax;
  // }

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  createChartTooltip(series: any, root: any, seriesName: string, color: string) {
    series.columns.template.setAll({
      strokeWidth: 2,
      width: 20,
      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "vertical",
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
      tooltipHTML: this.getToolTipHtml(seriesName),
      cornerRadiusTL: 5,
      cornerRadiusTR: 5
    });

    series.set("tooltip", am5.Tooltip.new(root, {
      pointerOrientation: "vertical",
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
        <span style="color: #fff; text-align: center; font-weight: 600;">${seriesName}:</span> {valueY}
      </div>`;
  }
}
