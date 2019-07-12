import { Component } from '@angular/core';

import { StreamState } from "../../interfaces/stream-state";
import { AudioService } from "../../services/audio.service";
import { CloudService } from "../../services/cloud.service";

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent {

  files: Array<any> = [];
  state: StreamState;
  currentFile: any = {};

  constructor(public audioService: AudioService,
              public cloudService: CloudService
  ) {
    cloudService.getFiles().subscribe(files => {
      this.files = files;
    });
    audioService.getState().subscribe(state => {
      this.state = state;
    })
  }

  isFirstPlaying() {
    return this.currentFile.index === 0;
  }

  isLastPlaying() {
    return this.currentFile.index === this.files.length - 1;
  }

  playStream(url) {
    this.audioService.playStream(url).subscribe(events => console.log(events));
  }

  openFile(file, index) {
    this.currentFile = {index, file};
    this.audioService.stop();
    this.playStream(file.url);
  }

  pause() {
    this.audioService.pause();
  }

  play() {
    this.audioService.play();
  }

  stop() {
    this.audioService.stop();
  }

  next() {
    const index = this.currentFile.index + 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  previous() {
    const index = this.currentFile.index - 1;
    const file = this.files[index];
    this.openFile(file, index);
  }

  onSliderChangeEnd(change) {
    this.audioService.seekTo(change.value);
  }
}
