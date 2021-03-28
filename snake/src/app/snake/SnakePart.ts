export class SnakePart {

  constructor(x: number, y: number, prev: SnakePart | null = null) {
    this.x = x;
    this.y = y;
    this.prev = prev;
    if(prev) {
      prev.next = this;
    }
    this.next = null;
  }

  public prev: SnakePart | null;
  public next: SnakePart | null;
  public x: number;
  public y: number;
}
