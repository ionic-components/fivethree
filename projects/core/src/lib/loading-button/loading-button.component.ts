import { Component, OnInit, ViewChild, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import { LoadingProgressBarComponent } from '../loading-progress-bar/loading-progress-bar.component';

@Component({
  selector: 'fiv-loading-button',
  templateUrl: './loading-button.component.html',
  styleUrls: ['./loading-button.component.scss']
})
export class LoadingButtonComponent implements OnInit {

  loading = false;

  @ViewChild('progress') progress: LoadingProgressBarComponent;
  @Input() color = 'light';
  @Input() expand = 'block';
  @Input() fill = 'solid';
  @Input() size = 'default';
  @Input() shape;

  @HostBinding('class.button-disabled')
  @Input()
  disabled = false;

  @Input() verticalAlign: 'top' | 'bottom' = 'top';

  @Input() type: 'submit' | 'reset' | 'button' = 'button';

  @Output() fivRefresh: EventEmitter<LoadingButtonComponent> = new EventEmitter();
  @Output() fivRefreshComplete: EventEmitter<LoadingButtonComponent> = new EventEmitter();
  @Output() fivButtonClick: EventEmitter<LoadingButtonComponent> = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  toggleSpinner() {
    this.loading = !this.loading;
    this.progress.toggleSpinner();
    this.fivRefresh.emit(this);
  }

  load() {
    this.loading = true;
    this.progress.load();
  }

  unload() {
    this.loading = false;
    this.progress.unload();
  }

  complete() {
    if (this.loading) {
      this.progress.complete({});
    }
  }

  onComplete(isComplete: boolean) {
    console.log('on complete', isComplete);
    this.loading = false;
    this.fivRefreshComplete.emit(this);
  }

  onClick() {
    this.fivButtonClick.emit(this);
  }

}
