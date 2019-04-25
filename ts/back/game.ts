import { Cell, ArenaMatrix } from './cell'
import { Observable, interval } from 'rxjs'
import { take, map, delay } from 'rxjs/operators'

export class Game {

    public static readonly ARENA_SIZE = 50;
    private _arena: ArenaMatrix = Game.emptyArena()
    public get arena(): ArenaMatrix { return this._arena }

    public cells(): Cell[] {
        const cells: Cell[] = []
        let i = 1
        this.forEachCell((x: number, y: number ) => {
            if (this.arena[x][y])
                cells.push(new Cell(x, y))
        })
        return cells
    }

    private _generation = 0;
    public get generation(): number { return this._generation }

    private readonly initial: Cell[] = [
        new Cell(0, 1), new Cell(1, 2), new Cell(2, 0), new Cell(2, 1), new Cell(2, 2)
    ]

    constructor(private lastGeneration: number, private interval: number = 0) {
        this.init()
    }

    private init(): void {
        let offset = Game.ARENA_SIZE / 2
        for(let cell of this.initial) this.reviveCell(cell.x + offset, cell.y + offset)
    }

    public start(): Observable<Cell[]> {
        console.log('game start')
        return interval(this.interval)
                .pipe(
                    take(this.lastGeneration), 
                    map(() => this.nextGeneration())
                )
    }

    private nextGeneration(): Cell[] {
        let old = this.copyArena() //this.arena.slice()
        this.matureCells(old)
        this._generation++;
        return this.cells()
    }

    private matureCells(old: ArenaMatrix) {
        for(let x = 0; x < Game.ARENA_SIZE; x++) { 
            for(let y = 0; y < Game.ARENA_SIZE; y++)
                this.matureCell(x, y, old)
        }
    }

    private matureCell(x: number, y: number, old: ArenaMatrix): void {
        const neighbours = Game.countNeighbours(x, y, old)
        if (old[x][y]) { 
            if (neighbours < 2 || neighbours > 3) this.killCell(x, y) 
        }
        else {
            if (neighbours == 3) this.reviveCell(x, y)
        }
    }

    private static countNeighbours(x: number, y: number, old: ArenaMatrix): number {
        let neighbours = 0
        for (let i = x-1; i <= x+1; i++) if(i >= 0 && i < Game.ARENA_SIZE) 
            for (let j = y-1; j <= y+1; j++) if(j >= 0 && j < Game.ARENA_SIZE)
                if (!(x == i && y == j)) if (old[i][j]) neighbours++
    
        return neighbours
    }

    private reviveCell(x: number, y: number): void {
        this.arena[x][y] = true
    }

    private killCell(x: number, y: number): void {
        this.arena[x][y] = false
    }

    private static emptyArena(): ArenaMatrix {
        let arena: ArenaMatrix = [[]]
        for(let i = 0; i < Game.ARENA_SIZE; i++) { 
            arena.push([])
            for(let j = 0; j < Game.ARENA_SIZE; j++)
                arena[i].push(false)
        }
        return arena
    }

    private copyArena(): ArenaMatrix {
        let arena: ArenaMatrix = [[]]
        for(let i = 0; i < Game.ARENA_SIZE; i++) { 
            arena.push([])
            for(let j = 0; j < Game.ARENA_SIZE; j++)
                arena[i].push(this.arena[i][j])
        }
        return arena
    }

    private forEachCell(fun: (x: number, y: number) => void): void {
        for(let x = 0; x < Game.ARENA_SIZE; x++) { 
            for(let y = 0; y < Game.ARENA_SIZE; y++)
                fun(x, y)
        }
    } 
}

/*
initial

0 1
1 2
2 0
2 1
2 2

*/