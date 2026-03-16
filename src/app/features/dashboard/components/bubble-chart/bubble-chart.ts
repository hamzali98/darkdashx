
import { AfterViewInit, Component, ElementRef, Input, ViewChild, Inject, PLATFORM_ID, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";

import { User } from '@app/features/users/interface/user';
import { product } from '../../products/interface/product-interface';
import { TranslationService } from '@app/core/services/translate.service';
import { ChartService } from '../../services/chart-service';

@Component({
  selector: 'app-bubble-chart',
  imports: [],
  templateUrl: './bubble-chart.html',
  styleUrl: './bubble-chart.css',
})
export class BubbleChart implements OnInit, OnChanges, OnDestroy {

  isRtl: boolean;

  private root!: am5.Root;
  private exporting!: am5plugins_exporting.Exporting;;

  private languageSubscription?: Subscription;

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
      if (this.productChartData && this.productChartData.length > 0) {
        this.prepareBubbleChart();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.productChartData && this.productChartData.length > 0) {
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

  downloadChart() {
    this.exporting.download("png"); // or "jpg", "svg", "pdf"
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
    const data = this.chartService.buildCompanyBubbleData(this.productChartData);
    const isRTL = this.isRtl;

    // Chart code goes in here
    this.browserOnly(() => {
      this.root = am5.Root.new("bubblediv");
      this.root.interfaceColors.set("text", am5.color("#FFF"));
      this.root.setThemes([am5themes_Animated.new(this.root)]);
      this.exporting = am5plugins_exporting.Exporting.new(this.root, {
        // filePrefix: "Bubble-Chart", // name of the downloaded file
        filePrefix: `${this.translationService.instant('Bubble-Chart')}-${new Date().toISOString().slice(0, 10)}`,

        // ── PNG/JPG settings ──
        pngOptions: {
          quality: 1,          // 0-1
          maintainPixelRatio: true
        },
      });

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
    const avgPriceLabel = this.translationService.instant('Avg Price');
    const stockLabel = this.translationService.instant('STOCK');
    const productsLabel = this.translationService.instant('PRODUCTS');
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