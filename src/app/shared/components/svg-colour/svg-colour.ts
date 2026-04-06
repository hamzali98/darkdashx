import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-svg-colour',
  imports: [NgClass],
  templateUrl: './svg-colour.html',
  styleUrl: './svg-colour.css',
})
export class SvgColour {

  @Input({ required: true }) svgSize: string = 'size-4';
  @Input({ required: true }) svgColor!: string;
  @Input({ required: true }) svgPath!: string;
}
