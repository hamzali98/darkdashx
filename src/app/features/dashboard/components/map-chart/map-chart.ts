// import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, NgZone } from '@angular/core';
// import { isPlatformBrowser } from '@angular/common';
// import * as am5 from "@amcharts/amcharts5";
// import * as am5map from "@amcharts/amcharts5/map";
// import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
// // Import geodata
// import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

// @Component({
//   selector: 'app-map-chart',
//   imports: [],
//   templateUrl: './map-chart.html',
//   styleUrl: './map-chart.css',
// })
// export class MapChart implements AfterViewInit, OnDestroy {

// private root!: am5.Root;

//   constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) { }

//   ngAfterViewInit(): void {
//     this.browserOnly(() => {
//       this.createChart();
//     });
//   }

//   browserOnly(f: () => void) {
//     if (isPlatformBrowser(this.platformId)) {
//       this.zone.runOutsideAngular(() => {
//         f();
//       });
//     }
//   }

//   createChart() {
//     // 1️⃣ Create root
//     this.root = am5.Root.new("mapchartdiv");
//     this.root.interfaceColors.set("text", am5.color("#fff"));
//     this.root.interfaceColors.set("primaryButton", am5.color("#cb3cff"));
//     this.root.interfaceColors.set("primaryButtonHover", am5.color("#aeb9e1"));
//     this.root.interfaceColors.set("primaryButtonDown", am5.color("#00c2ff"));
//     this.root.setThemes([am5themes_Animated.new(this.root)]);

//     // 2️⃣ Create map chart
//     const chart = this.root.container.children.push(
//       am5map.MapChart.new(this.root, {
//         panX: "rotateX",
//         panY: "translateY",
//         wheelY: "zoom", // allow zooming with mouse wheel
//         projection: am5map.geoNaturalEarth1()
//       })
//     );

//     // 3️⃣ Create polygon series
//     const polygonSeries = chart.series.push(
//       am5map.MapPolygonSeries.new(this.root, {
//         geoJSON: am5geodata_worldLow,
//         exclude: ["AQ"]
//       })
//     );

//     // 4️⃣ Set default polygon template
//     const polygonTemplate = polygonSeries.mapPolygons.template;
//     polygonTemplate.setAll({
//       tooltipText: "{name}",   // show country name
//       interactive: true,
//       fill: am5.color("#cb3cff"),
//       stroke: am5.color(0xffffff),
//       strokeWidth: 1
//     });

//     // 5️⃣ Hover state
//     polygonTemplate.states.create("hover", {
//       fill: am5.color("#00c2ff")
//     });

//     // 6️⃣ Click event
//     polygonTemplate.events.on("click", (ev) => {
//       const dataItem : any = ev.target.dataItem;
//       if (dataItem) {
//         const countryName = dataItem.dataContext.name;
//         // console.log("Clicked country:", countryName);
//         alert(`You clicked on ${countryName}`);
//       }
//     });

//     // 7️⃣ Zoom controls (optional)
//     chart.set("zoomControl", am5map.ZoomControl.new(this.root, {}));
//   }

//   ngOnDestroy(): void {
//     this.root?.dispose();
//   }
// }

import { Component, AfterViewInit, OnDestroy, OnInit, Inject, PLATFORM_ID, NgZone, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
// Import geodata
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import { TranslationService } from '@app/core/services/translate.service';

@Component({
  selector: 'app-map-chart',
  imports: [],
  templateUrl: './map-chart.html',
  styleUrl: './map-chart.css',
})
export class MapChart implements OnInit, AfterViewInit, OnDestroy {

  isRtl: boolean;

  private root!: am5.Root;
  private languageSubscription?: Subscription;

  translationService = inject(TranslationService);

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) {
    this.isRtl = this.translationService.getCurrentLanguage() === 'ur';
  }

  ngOnInit(): void {
    // Subscribe to language changes
    this.languageSubscription = this.translationService.currentLang$.subscribe(lang => {
      this.isRtl = lang === 'ur';

      // Redraw chart if it exists
      if (this.root) {
        this.prepareMapChart();
      }
    });
  }

  ngAfterViewInit(): void {
    this.browserOnly(() => {
      this.prepareMapChart();
    });
  }

  ngOnDestroy(): void {
    // Clean up
    if (this.languageSubscription) {
      this.languageSubscription.unsubscribe();
    }

    if (this.root) {
      this.root.dispose();
    }

    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }

  prepareMapChart() {
    // Dispose existing chart before creating new one
    if (this.root) {
      this.root.dispose();
    }

    // Create new chart with updated language
    this.zone.runOutsideAngular(() => {
      this.createChart();
    });
  }

  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  createChart() {
    const isRTL = this.isRtl;

    this.browserOnly(() => {
      // 1️⃣ Create root
      this.root = am5.Root.new("mapchartdiv");
      this.root.interfaceColors.set("text", am5.color("#fff"));
      this.root.interfaceColors.set("primaryButton", am5.color("#cb3cff"));
      this.root.interfaceColors.set("primaryButtonHover", am5.color("#aeb9e1"));
      this.root.interfaceColors.set("primaryButtonDown", am5.color("#00c2ff"));
      this.root.setThemes([am5themes_Animated.new(this.root)]);

      // 2️⃣ Create map chart
      const chart = this.root.container.children.push(
        am5map.MapChart.new(this.root, {
          panX: "rotateX",
          panY: "translateY",
          wheelY: "zoom",
          projection: am5map.geoNaturalEarth1()
        })
      );

      // 3️⃣ Create polygon series
      const polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(this.root, {
          geoJSON: am5geodata_worldLow,
          exclude: ["AQ"]
        })
      );

      // 4️⃣ Set default polygon template with custom tooltip
      const polygonTemplate = polygonSeries.mapPolygons.template;
      polygonTemplate.setAll({
        interactive: true,
        fill: am5.color("#cb3cff"),
        stroke: am5.color(0xffffff),
        strokeWidth: 1,
        tooltipHTML: this.getToolTipHtml(),
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
        })
      });

      // 5️⃣ Hover state
      polygonTemplate.states.create("hover", {
        fill: am5.color("#00c2ff")
      });

      // 6️⃣ Click event with translated alert
      polygonTemplate.events.on("click", (ev) => {
        const dataItem: any = ev.target.dataItem;
        if (dataItem) {
          const countryName = dataItem.dataContext.name;
          const message = isRTL 
            ? `آپ نے ${countryName} پر کلک کیا` 
            : `You clicked on ${countryName}`;
          alert(message);
        }
      });

      // 7️⃣ Zoom controls
      const zoomControl = am5map.ZoomControl.new(this.root, {});
      chart.set("zoomControl", zoomControl);

      // Translate zoom control buttons (if needed)
      if (isRTL) {
        // You can customize zoom control appearance here if needed
        zoomControl.plusButton.setAll({
          // tooltipText: "زوم ان"
        });
        zoomControl.minusButton.setAll({
          // tooltipText: "زوم آؤٹ"
        });
      }
    });
  }

  // Function to generate custom HTML for tooltips
  getToolTipHtml() {
    const fontSize = this.isRtl ? '16px' : '14px';
    const countryLabel = this.isRtl ? 'ملک' : 'Country';
    const direction = this.isRtl ? 'rtl' : 'ltr';
    
    return `
      <div style="direction: ${direction}; padding: 8px;">
        <div style="font-weight: bold; color: #fff; text-align: center; font-size: ${fontSize};">
          {name}
        </div>
      </div>
    `;
  }

  // Optional: Method to translate country names
  private translateCountryName(countryName: string): string {
    // You can add a comprehensive translation map here
    const countryTranslations: Record<string, { en: string; ur: string }> = {
      'Pakistan': { en: 'Pakistan', ur: 'پاکستان' },
      'India': { en: 'India', ur: 'بھارت' },
      'China': { en: 'China', ur: 'چین' },
      'United States': { en: 'United States', ur: 'امریکہ' },
      'United Kingdom': { en: 'United Kingdom', ur: 'برطانیہ' },
      'Saudi Arabia': { en: 'Saudi Arabia', ur: 'سعودی عرب' },
      'United Arab Emirates': { en: 'United Arab Emirates', ur: 'متحدہ عرب امارات' },
      'Afghanistan': { en: 'Afghanistan', ur: 'افغانستان' },
      'Iran': { en: 'Iran', ur: 'ایران' },
      'Turkey': { en: 'Turkey', ur: 'ترکی' },
      'Egypt': { en: 'Egypt', ur: 'مصر' },
      'Iraq': { en: 'Iraq', ur: 'عراق' },
      'Bangladesh': { en: 'Bangladesh', ur: 'بنگلہ دیش' },
      'Indonesia': { en: 'Indonesia', ur: 'انڈونیشیا' },
      'Malaysia': { en: 'Malaysia', ur: 'ملائیشیا' },
      // Add more countries as needed
    };

    const lang = this.isRtl ? 'ur' : 'en';
    return countryTranslations[countryName]?.[lang] || countryName;
  }
}