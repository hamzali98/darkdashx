import {
  Component,
  AfterViewInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';

interface DotConfig {
  lineId: string;       // matches id="lineN" in the SVG
  dotColor: string;     // sharp core color
  glowColor: string;    // halo color
  duration: number;     // ms for one full traversal
  delay: number;        // ms before starting
  filterId: string;     // which glow filter to use
}
@Component({
  selector: 'app-auth-design-style-elements2',
  imports: [],
  templateUrl: './auth-design-style-elements2.html',
  styleUrl: './auth-design-style-elements2.css',
})

// export class AuthDesignStyleElements2 { }
export class AuthDesignStyleElements2 implements AfterViewInit, OnDestroy {

  // export class AuthBgComponent implements AfterViewInit, OnDestroy {

  @ViewChild('svgEl', { static: true }) svgEl!: ElementRef<SVGSVGElement>;
  @ViewChild('dotsLayer', { static: true }) dotsLayer!: ElementRef<SVGGElement>;

  private readonly SVG_NS = 'http://www.w3.org/2000/svg';
  private rafIds: number[] = [];

  /**
   * Each entry maps to one of the 8 <path id="lineN"> elements.
   * dotColor  = the sharp bright center dot
   * glowColor = the blurred halo behind it
   * filterId  = references a <filter> in the SVG <defs>
   */
  private readonly configs: DotConfig[] = [
    { lineId: 'line0', dotColor: 'var(--color-primary)', glowColor: 'color-mix(in srgb, var(--color-primary), white 20%)', duration: 5000, delay: 0, filterId: 'dotGlowPurple' },
    { lineId: 'line1', dotColor: 'var(--color-primary)', glowColor: 'color-mix(in srgb, var(--color-primary), white 20%)', duration: 7000, delay: 1500, filterId: 'dotGlowPurple' },
    { lineId: 'line2', dotColor: 'var(--color-primary)', glowColor: 'color-mix(in srgb, var(--color-primary), white 20%)', duration: 6000, delay: 800, filterId: 'dotGlowPurple' },
    { lineId: 'line3', dotColor: 'var(--color-secondary2)', glowColor: 'color-mix(in srgb, var(--color-secondary2), white 20%)', duration: 8000, delay: 2200, filterId: 'dotGlowOrange' },
    { lineId: 'line4', dotColor: 'var(--color-secondary)', glowColor: 'color-mix(in srgb, var(--color-secondary), white 20%)', duration: 5500, delay: 300, filterId: 'dotGlowPink' },
    { lineId: 'line5', dotColor: 'var(--color-secondary2)', glowColor: 'color-mix(in srgb, var(--color-secondary2), white 20%)', duration: 7500, delay: 3000, filterId: 'dotGlowOrange' },
    { lineId: 'line6', dotColor: 'var(--color-secondary2)', glowColor: 'color-mix(in srgb, var(--color-secondary2), white 20%)', duration: 6500, delay: 1000, filterId: 'dotGlowOrange' },
    { lineId: 'line7', dotColor: 'var(--color-secondary2)', glowColor: 'color-mix(in srgb, var(--color-secondary2), white 20%)', duration: 9000, delay: 2000, filterId: 'dotGlowOrange' },
  ];
  //   --color-primary
  // --color-secondary2
  // --color-secondary
  // private readonly configs: DotConfig[] = [
  //   { lineId: 'line0', dotColor: '#7F00FF', glowColor: '#B770FF', duration: 5000, delay: 0,    filterId: 'dotGlowPurple' },
  //   { lineId: 'line1', dotColor: '#7F00FF', glowColor: '#B770FF', duration: 7000, delay: 1500, filterId: 'dotGlowPurple' },
  //   { lineId: 'line2', dotColor: '#7F00FF', glowColor: '#B770FF', duration: 6000, delay: 800,  filterId: 'dotGlowPurple' },
  //   { lineId: 'line3', dotColor: '#FB9C2D', glowColor: '#FFCE94', duration: 8000, delay: 2200, filterId: 'dotGlowOrange' },
  //   { lineId: 'line4', dotColor: '#FF77EA', glowColor: '#AA1BB6', duration: 5500, delay: 300,  filterId: 'dotGlowPink'   },
  //   { lineId: 'line5', dotColor: '#FB9C2D', glowColor: '#FFCE94', duration: 7500, delay: 3000, filterId: 'dotGlowOrange' },
  //   { lineId: 'line6', dotColor: '#FB9C2D', glowColor: '#FFCE94', duration: 6500, delay: 1000, filterId: 'dotGlowOrange' },
  //   { lineId: 'line7', dotColor: '#FB9C2D', glowColor: '#FFCE94', duration: 9000, delay: 2000, filterId: 'dotGlowOrange' },
  // ];

  ngAfterViewInit(): void {
    this.configs.forEach(cfg => this.spawnDot(cfg));
  }

  private spawnDot(cfg: DotConfig): void {
    const svg = this.svgEl.nativeElement;
    const layer = this.dotsLayer.nativeElement;

    // Get the visible line path — dot travels along this exact geometry
    const pathEl = svg.getElementById(cfg.lineId) as SVGPathElement | null;
    if (!pathEl) {
      console.warn(`[AuthBg] path not found: #${cfg.lineId}`);
      return;
    }

    const totalLen = pathEl.getTotalLength();

    // ── Glow halo (blurred ellipse rotated along tangent) ──
    const glow = document.createElementNS(this.SVG_NS, 'ellipse') as SVGEllipseElement;
    glow.setAttribute('rx', '3');
    glow.setAttribute('ry', '7');
    glow.setAttribute('fill', cfg.glowColor);
    glow.setAttribute('filter', `url(#${cfg.filterId})`);
    glow.setAttribute('opacity', '0');

    // ── Sharp core dot ──
    const dot = document.createElementNS(this.SVG_NS, 'circle') as SVGCircleElement;
    dot.setAttribute('r', '2.8');
    dot.setAttribute('fill', cfg.dotColor);
    dot.setAttribute('opacity', '0');

    layer.appendChild(glow);
    layer.appendChild(dot);

    let startTime: number | null = null;
    let launched = false;

    const tick = (ts: number): void => {
      // Respect the initial delay before starting
      if (!launched) {
        if (startTime === null) startTime = ts;
        if (ts - startTime < cfg.delay) {
          this.rafIds.push(requestAnimationFrame(tick));
          return;
        }
        launched = true;
        startTime = ts; // reset so elapsed counts from launch
      }

      const elapsed = (ts - startTime!) % cfg.duration;
      const progress = elapsed / cfg.duration;           // 0 → 1
      const dist = progress * totalLen;

      // Current position
      const pt = pathEl.getPointAtLength(dist);

      // Look-ahead point for tangent angle (clamp to path end)
      const pt2 = pathEl.getPointAtLength(Math.min(dist + 3, totalLen));
      const angleDeg = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI);

      // Position glow ellipse and rotate it along the tangent
      glow.setAttribute('cx', String(pt.x));
      glow.setAttribute('cy', String(pt.y));
      glow.setAttribute('transform', `rotate(${angleDeg},${pt.x},${pt.y})`);

      // Position core dot
      dot.setAttribute('cx', String(pt.x));
      dot.setAttribute('cy', String(pt.y));

      // Fade in at start, fade out near end
      const opacity =
        progress < 0.04 ? progress / 0.04 :
          progress > 0.90 ? (1 - progress) / 0.10 :
            1;

      glow.setAttribute('opacity', String((opacity * 0.9).toFixed(3)));
      dot.setAttribute('opacity', String(opacity.toFixed(3)));

      this.rafIds.push(requestAnimationFrame(tick));
    };

    this.rafIds.push(requestAnimationFrame(tick));
  }

  ngOnDestroy(): void {
    this.rafIds.forEach(id => cancelAnimationFrame(id));
    this.rafIds = [];
  }
}