import { Component, HostListener, OnInit, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent implements OnInit {
  gridcols: WritableSignal<number> = signal(2);

  ngOnInit(): void {
    this.updateGridCols();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateGridCols();
  }

  updateGridCols(): void {
    const width: number = window.innerWidth;
    this.gridcols.set(width >= 1024 ? 4 : width >= 768 ? 3 : width >= 640 ? 2 : 1);
  }
}