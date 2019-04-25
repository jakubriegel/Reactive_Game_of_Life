namespace Arena {
    export class Arena{
    
        private _canvas: HTMLCanvasElement
        get canvas(): HTMLCanvasElement { return this._canvas }
        private context: CanvasRenderingContext2D
    
        private static readonly tileNumber: number = 50
        private tileWidth: number
        private static readonly BORDER = .04
        private border: number
        private cellWidth: number
    
        public constructor(private height: number){
            this._canvas = document.createElement('canvas')
            this.canvas.width = height
            this.canvas.height = height
            this.canvas.style.margin = '0 auto'
            this.canvas.style.display = 'block'
            this.context = this.canvas.getContext('2d')!
    
            this.tileWidth = height / Arena.tileNumber
            this.border = Arena.BORDER * this.tileWidth
            this.cellWidth = this.tileWidth - 2 * this.border
        }
    
        public redraw(cells: Cell[]): void {
            this.context.fillStyle = 'black'
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height) 
            this.context.fillStyle = 'white'
            for(const c of cells) this.drawCell(c.x, c.y) 
        }

        public drawCell(x: number, y: number): void {
            const X = x * this.tileWidth + this.border
            const Y = y * this.tileWidth + this.border
            this.context.fillRect(X, Y, this.cellWidth, this.cellWidth) 
        }
    }

    export interface Cell {
        x: number,
        y: number
    }
}
