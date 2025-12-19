import { Component, AfterViewInit, OnDestroy, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
// Import geodata
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";

@Component({
  selector: 'app-map-chart',
  imports: [],
  templateUrl: './map-chart.html',
  styleUrl: './map-chart.css',
})
export class MapChart implements AfterViewInit, OnDestroy {

private root!: am5.Root;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) { }

  ngAfterViewInit(): void {
    this.browserOnly(() => {
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
        wheelY: "zoom", // allow zooming with mouse wheel
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

    // 4️⃣ Set default polygon template
    const polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.setAll({
      tooltipText: "{name}",   // show country name
      interactive: true,
      fill: am5.color("#cb3cff"),
      stroke: am5.color(0xffffff),
      strokeWidth: 1
    });

    // 5️⃣ Hover state
    polygonTemplate.states.create("hover", {
      fill: am5.color("#00c2ff")
    });

    // 6️⃣ Click event
    polygonTemplate.events.on("click", (ev) => {
      const dataItem : any = ev.target.dataItem;
      if (dataItem) {
        const countryName = dataItem.dataContext.name;
        console.log("Clicked country:", countryName);
        alert(`You clicked on ${countryName}`);
      }
    });

    // 7️⃣ Zoom controls (optional)
    chart.set("zoomControl", am5map.ZoomControl.new(this.root, {}));
  }

  ngOnDestroy(): void {
    this.root?.dispose();
  }
}
