import { AfterViewInit, Component, inject, Inject, Input, NgZone, OnChanges, OnDestroy, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

// amCharts imports
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { User } from '@app/features/users/interface/user';
import { product } from '../../products/interface/product-interface';
import { TranslationService } from '@app/core/services/translate.service';
import { ChartService } from '../../services/chart-service';

@Component({
  selector: 'app-donut-chart',
  imports: [],
  templateUrl: './donut-chart.html',
  styleUrl: './donut-chart.css',
})
export class DonutChart implements OnInit, OnChanges, OnDestroy {

  isRtl: boolean;

  private root!: am5.Root;
  // private exporting!: any;
  private exporting!: am5plugins_exporting.Exporting;;
  private languageSubscription?: Subscription;

  @Input() userChartData!: User[];

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
      if (this.userChartData && this.userChartData.length > 0) {
        this.prepareDonutChart();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.userChartData && this.userChartData.length > 0) {
      this.prepareDonutChart();
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

  prepareDonutChart() {
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
    const donutdata = this.chartService.buildUserStatusDonutData(this.userChartData);
    const isRTL = this.isRtl;

    // Chart code goes in here
    this.browserOnly(() => {
      // Create root and chart
      let root = am5.Root.new("donutdiv");
      root.interfaceColors.set("text", am5.color("#fff"));
      this.exporting = am5plugins_exporting.Exporting.new(root, {
        // filePrefix: "Donut-Chart", // name of the downloaded file
        filePrefix: `${this.translationService.instant('Donut-Chart')}-${new Date().toISOString().slice(0, 10)}`,

        // ── PNG/JPG settings ──
        pngOptions: {
          quality: 1,          // 0-1
          maintainPixelRatio: true
        },
      });

      let chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          layout: root.verticalLayout,
          radius: am5.percent(95),
          innerRadius: am5.percent(50),
        })
      );

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

      // Configure slices with custom tooltip
      series.slices.template.setAll({
        strokeWidth: 2,
        tooltip: am5.Tooltip.new(root, {
          pointerOrientation: "vertical",
          getFillFromSprite: false,
          labelText: "",
          autoTextColor: false,
          background: am5.RoundedRectangle.new(root, {
            fill: am5.color("#cb3cff"), // Will be overridden by slice color
            strokeWidth: 1,
            shadowColor: am5.color("#000"),
            shadowBlur: 8,
            shadowOffsetX: 0,
            shadowOffsetY: 2,
          }),
        }),
        tooltipHTML: this.getToolTipHtml(),
      });

      // Use adapter to dynamically set tooltip for each slice
      series.slices.template.adapters.add("tooltipHTML", (html, target) => {
        return html;
      });

      // Update tooltip background color for each slice
      series.slices.template.adapters.add("tooltip", (tooltip, target) => {
        if (tooltip) {
          const fill = target.get("fill");
          if (fill) {
            tooltip.get("background")?.set("fill", fill);
          }
        }
        return tooltip;
      });

      series.data.setAll(donutdata);

      // Add legend with RTL support
      let legend = chart.children.push(am5.Legend.new(root, {
      }));

      legend.labels.template.setAll({
        fontFamily: isRTL ? 'JameelNoori' : '',
        // direction: isRTL ? "ltr" : "rtl",
        marginLeft: isRTL ? 90 : 10,
        marginRight: isRTL ? 20 : 3,
      });

      legend.data.setAll(series.dataItems);

      this.root = root;
    });
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
    const valueLabel = this.translationService.instant('Count');
    

    return `
      <div style="font-weight: bold; color: #fff; text-align: center; margin-bottom: 8px; font-size: ${fontSize};">{category}</div>
      <div style="color: #fff; font-size: 13px; text-align: center;">
        <span style="color: #fff; font-weight: 600;">${valueLabel}:</span> {value}
      </div>
    `;
  }
}