import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { animate, style, transition, trigger, AnimationBuilder } from '@angular/animations';
import { LoadingService } from '../loading/loading.service';
import { timer, Observable } from 'rxjs';
import { timeInterval, pluck, take } from 'rxjs/operators';

@Component({
  selector: 'fiv-loading-progress-bar',
  templateUrl: './loading-progress-bar.component.html',
  styleUrls: ['./loading-progress-bar.component.scss'],
  animations: [
    trigger('progressAnim', [
      transition('void => *', [
        style({ height: '0px' }),
        animate('250ms ease-out')
      ]),
      transition('* => void', [
        animate('299ms ease-in', style({ height: '0px' }))
      ])
    ]),
    trigger('progressAnimLinear', [
      transition('void => *', [
        style({ height: '0px' }),
        animate('65ms ease-out')
      ]),
      transition('* => void', [
        animate('299ms ease-in', style({ height: '0px' }))
      ])
    ]),
    trigger('fillAnim', [
      transition('void => *', [
        style({ left: '-5%', width: '5%' }),
        animate('850ms ease-out', style({ left: '0%', width: '100%' }))
      ]),
    ])
  ]
})
export class LoadingProgressBarComponent implements OnInit, OnDestroy {

  loading = false;
  @Input() global = false;
  @Input() isComplete = false;
  progress = 0;
  @Input() verticalAlign: 'top' | 'bottom' = 'top';
  @Output() fivComplete: EventEmitter<any> = new EventEmitter<any>();
  @Output() fivDoneShrinking: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() fivRefresh: EventEmitter<LoadingProgressBarComponent> = new EventEmitter<LoadingProgressBarComponent>();

  @ViewChild('bar') bar: ElementRef;
  @ViewChild('linear') linear: ElementRef;

  param: any;

  constructor(public loadingService: LoadingService, private builder: AnimationBuilder) {
  }

  ngOnInit() {
    if (this.global) {
      this.loadingService.completeChange.subscribe(isComplete => {
        if (isComplete) {
          this.complete(null);
        }
      });
    }
  }

  ngOnDestroy() {
    if (this.global) {
      this.loadingService.completeChange.unsubscribe();
    }
  }

  toggleSpinner() {
    this.loading = !this.loading;
  }

  load() {
    this.loading = true;
    this.fivRefresh.emit(this);
  }

  unload() {
    this.loading = false;
    if (this.isComplete) {
      this.isComplete = false;
    }
  }

  complete(param: any) {
    console.log('set complete');
    this.param = param;
    this.isComplete = true;
    console.log(this.isComplete);
  }

  fillAnimationComplete(isComplete: boolean) {
    if (isComplete) {
      console.log('fill animation complete', isComplete);
      this.fivComplete.emit(this.param);
      this.isComplete = false;
      this.param = null;
      if (this.global) {
        this.loadingService.unload();
      } else {
        this.unload();
      }
    }
  }

  setProgress(progress) {
    if (progress < 0) {
      this.progress = 0;
      return;
    }
    if (progress > 100) {
      this.progress = 100;
      return;
    }
    this.progress = progress;
    console.log('set progress', progress);

  }

  incrementBy(progress) {
    this.setProgress(progress + this.progress);
  }

  decrementBy(progress) {
    this.setProgress(progress + this.progress);
  }

  fillIn(ms: number) {
    // first define a reusable animation
    const myAnimation = this.builder.build([
      style({ width: this.progress }),
      animate(ms, style({ width: '100%' }))
    ]);

    // use the returned factory object to create a player
    const player = myAnimation.create(this.linear.nativeElement);

    player.play();
    const t = timer(0, ms / (100))
      .subscribe(() => {
        if (this.progress >= 100) {
          return t.unsubscribe();
        }
        this.progress++;
        console.log('current progress', this.progress);
      });
    player.onDone(() => {
      this.fivComplete.emit(true);
      this.progress = 100;
      player.destroy();
    });
  }

  shrinkIn(ms: number) {
    // first define a reusable animation
    this.progress = 100;
    const myAnimation = this.builder.build([
      style({ width: `${this.progress}%` }),
      animate(ms, style({ width: 0 }))
    ]);

    // use the returned factory object to create a player
    const player = myAnimation.create(this.linear.nativeElement);

    const t = timer(0, ms / (100))
      .subscribe(() => {
        if (this.progress <= 0) {
          return t.unsubscribe();
        }
        this.progress--;
        console.log('current progress', this.progress);
      });

    player.play();
    player.onDone(() => {
      this.fivDoneShrinking.emit(true);
      this.progress = 0;
      player.destroy();
    });
  }

}
