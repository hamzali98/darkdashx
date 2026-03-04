import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tick-animation',
  imports: [],
  templateUrl: './tick-animation.html',
  styleUrl: './tick-animation.scss',
})
export class TickAnimation {
  @Input() visible = false;
  @Input() message = 'Success';
  particles = Array(8);
}
