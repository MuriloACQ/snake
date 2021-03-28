import {SnakePart} from './SnakePart';
import {SnakeDirections} from './SnakeDirections';

export class Snake {

  public boardId : number;
  public head : SnakePart;
  public tail : SnakePart;
  public length: number;
  public direction: string;

  constructor(x: number, y: number, boardId: number = 1) {
    this.boardId = boardId;
    this.head = new SnakePart(x, y);
    this.tail = this.head;
    this.length = 1;
    this.direction = SnakeDirections.UP;
  }

  enlarge(boardRef: number[][], x: number, y: number) {
    this.tail = new SnakePart(x, y, this.tail);
    this.move(boardRef, x, y);
    this.length++;
  }

  move(boardRef: number[][],x: number, y: number, part: SnakePart = this.head) {
    let prevX = part.x;
    let prevY = part.y;
    part.x = x;
    part.y = y;
    boardRef[prevX][prevY] = 0;
    boardRef[x][y] = 1;
    if(part.next) {
      this.move(boardRef, prevX, prevY, part.next);
    }
  }

  getFirstAvailableDirections(boardRef: number[][]): string[] {
    //y = 0 blocks UP direction
    //y = board.length - 1 blocks DOWN direction
    //x = 0 blocks LEFT direction
    //x = board[0].length - 1 blocks RIGHT direction
    const directions: string[] = [];
    if(this.head.y !== 0) {
      directions.push(SnakeDirections.UP);
    }
    if(this.head.y !== boardRef.length -1) {
      directions.push(SnakeDirections.DOWN);
    }
    if(this.head.x !== 0) {
      directions.push(SnakeDirections.LEFT);
    }
    if(this.head.x !== boardRef[0].length - 1) {
      directions.push(SnakeDirections.RIGHT);
    }
    return directions;
  }

  getNextPosition(): any {
    //if direction UP -> decrease Y
    //if direction DOWN -> increase Y
    //if direction LEFT -> decrease X
    //if direction RIGHT -> increase X
    let newPosition = Object.assign({}, this.head);
    switch (this.direction) {
      case SnakeDirections.UP:
        newPosition.x--;
        break;
      case SnakeDirections.DOWN:
        newPosition.x++;
        break;
      case SnakeDirections.LEFT:
        newPosition.y--;
        break;
      case SnakeDirections.RIGHT:
        newPosition.y++;
        break
    }
    return newPosition;
  }

  changeDirection(direction: string) {
    this.direction = direction;
  }

  changeDirectionToUp(avoidBackDirection: boolean = false) {
    if(!avoidBackDirection || this.length == 1 || this.direction !== SnakeDirections.DOWN) {
      this.changeDirection(SnakeDirections.UP);
    }
  }

  changeDirectionToDown(avoidBackDirection: boolean = false) {
    if(!avoidBackDirection || this.length == 1 || this.direction !== SnakeDirections.UP) {
      this.changeDirection(SnakeDirections.DOWN);
    }
  }

  changeDirectionToRight(avoidBackDirection: boolean = false) {
    if(!avoidBackDirection || this.length == 1 || this.direction !== SnakeDirections.LEFT) {
      this.changeDirection(SnakeDirections.RIGHT);
    }
  }

  changeDirectionToLeft(avoidBackDirection: boolean = false) {
    if(!avoidBackDirection || this.length == 1 || this.direction !== SnakeDirections.RIGHT) {
      this.changeDirection(SnakeDirections.LEFT);
    }
  }

}

