import {Component, OnInit, ViewChild} from '@angular/core';
import {BoardComponent} from "../board/board.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public showBoard = false;
  public wsUrl = 'ws://localhost:8080';
  private ws: WebSocket | any;

  @ViewChild(BoardComponent)
  private boardComponent: BoardComponent | any;

  constructor() { }

  ngOnInit(): void {
  }

  start() {
    this.showBoard = true;
    this.connect();

  }

  reset() {
    this.stop();
    setTimeout(() => {
      this.start();
    }, 0);
  }

  stop() {
    this.showBoard = false;
  }

  connect() {
    if(!this.ws || (this.ws.readyState !== this.ws.OPEN && this.ws.readyState !== this.ws.CONNECTING)) {
      this.ws = new WebSocket(this.wsUrl);
      this.ws.onopen = () => {
        this.ws.onmessage = (event: any) => {
          if(this.boardComponent) {
            this.boardComponent.changeDirection(Number(event.data));
          }
        };
        this.boardComponent.ws = this.ws;
      };
    } else {
      setTimeout(() => {
        this.ws.onmessage = (event: any) => {
          if(this.boardComponent) {
            this.boardComponent.changeDirection(Number(event.data));
          }
        };
        this.boardComponent.ws = this.ws;
      }, 0);
    }
  }

}
