import {Component, HostListener, OnInit} from '@angular/core';
import {Snake} from '../snake/Snake';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  public ws : WebSocket | any;
  public status: string;
  public board : number[][];
  public snake : Snake;
  public food : any;
  public score : number = 0;
  public clockInterval : any = 150;
  private clockIntervalId: any;
  private avoidBackDirection: boolean = true;

  constructor() {
    this.status = 'starting';
    const width = 30;
    const height = 30;
    this.board = Array.from({ length: width });
    for (let i = 0; this.board.length > i; i++) {
      this.board[i] = Array.from({ length: height });
      this.board[i].fill(0);
    }
    this.snake = new Snake(0,0);
  }

  ngOnInit(): void {
    this.createSnake();
    this.createFood();
    this.startClock(this.clockInterval);
  }

  createSnake(): void {
    console.log('creating snake');
    const x = Math.floor(Math.random() * this.board.length);
    const y = Math.floor(Math.random() * this.board[0].length);
    this.board[x][y] = 1;
    this.snake = new Snake(x, y, 1);
    let availableDirections = this.snake.getFirstAvailableDirections(this.board);
    const adi = Math.floor(Math.random() * availableDirections.length);
    this.snake.direction = availableDirections[adi];
  }

  createFood(): void {
    const x = Math.floor(Math.random() * this.board.length);
    const y = Math.floor(Math.random() * this.board[0].length);
    if(this.board[x][y] !== this.snake.boardId) {
      this.board[x][y] = 2;
      this.food = {x, y};
    } else {
      console.log('fuuu.. you should not use recursive function here');
      this.createFood();
    }
  }

  startClock(interval: number) {
    this.status = 'running';
    this.clockIntervalId = setInterval(this.clock.bind(this), interval);
  }

  clock() {
    try {
      this.move();
      this.score += this.snake.length;
      if(this.ws) {
        if(this.ws.readyState !== this.ws.OPEN) {
          clearInterval(this.clockIntervalId);
          this.clockIntervalId = null;
          this.status = 'connection hangup';
        } else {
          this.ws.send(JSON.stringify({
            board: this.board,
            snakeBoardId: this.snake.boardId,
            snakeHead: {
              x: this.snake.head.x,
              y: this.snake.head.y
            },
            snakeDirection: this.snake.direction,
            score: this.score
          }));
        }
      }
    } catch (e) {
      clearInterval(this.clockIntervalId);
      this.clockIntervalId = null;
      this.status = 'game over';
    }
  }

  move() : void {
    let newPosition = this.snake.getNextPosition();
    const hasCollision = this.verifyCollision(newPosition);
    if(hasCollision) {
      throw 'Snake was dead by collision';
    }
    const hasFood = this.verifyFood(newPosition);
    if(hasFood) {
      this.snake.enlarge(this.board, newPosition.x, newPosition.y);
      this.board[newPosition.x][newPosition.y] = this.snake.boardId;
      this.createFood();
    } else {
      this.snake.move(this.board, newPosition.x, newPosition.y);
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) :void {
    this.changeDirection(event.keyCode);
  }

  changeDirection(code: number) {
    switch (code) {
      case 39:
        this.snake.changeDirectionToRight(this.avoidBackDirection);
        break;
      case 37:
        this.snake.changeDirectionToLeft(this.avoidBackDirection);
        break;
      case 38:
        this.snake.changeDirectionToUp(this.avoidBackDirection);
        break;
      case 40:
        this.snake.changeDirectionToDown(this.avoidBackDirection);
        break;
      case 13:
        if(this.clockIntervalId) {
          clearInterval(this.clockIntervalId);
          this.clockIntervalId = null;
          this.status = 'paused';
        } else {
          this.startClock(this.clockInterval);
        }
    }
  }

  verifyCollision(targetPosition: any) : boolean {
    //X out of bounds
    if (targetPosition.x >= this.board.length || targetPosition.x < 0) {
      return true;
    }
    //Y out of bounds
    if (targetPosition.y >= this.board[0].length || targetPosition.y < 0) {
      return true;
    }
    //Self collision
    return this.board[targetPosition.x][targetPosition.y] === this.snake.boardId;
  }

  verifyFood(targetPosition: any) {
    return this.board[targetPosition.x][targetPosition.y] === 2;
  }
}
