const electron = require('electron')
const ipc = electron.ipcRenderer

window.onload = () => new App()

class App {

    private readonly content: HTMLDivElement
    private readonly arena: Arena.Arena

    private readonly generationInput: HTMLInputElement
    private readonly productionInput: HTMLInputElement
    private readonly refreshInput: HTMLInputElement

    private readonly generationDiv: HTMLDivElement

    constructor () {
        this.content = <HTMLDivElement> document.getElementById('content')
        this.arena = new Arena.Arena(this.content.clientHeight)
        this.content.appendChild(this.arena.canvas)

        this.generationInput = <HTMLInputElement> document.getElementById('generation-input')
        this.productionInput = <HTMLInputElement> document.getElementById('production-interval-input')
        this.refreshInput = <HTMLInputElement> document.getElementById('refresh-interval-input')

        this.generationDiv = <HTMLDivElement> document.getElementById('generation-number')

        this.initButtons()
        this.initSliders()

        this.initIpc()

        ipc.send('app-ready')
    }

    private initButtons(): void {
        const startButton = <HTMLButtonElement> document.getElementById('start-button')
        startButton.onclick = () => ipc.send('game-start', this.gameConfig())

        const resetButton = <HTMLButtonElement> document.getElementById('reset-button')
        resetButton.onclick = () => ipc.send('game-reset', this.gameConfig())
    }

    private gameConfig(): GameConfig {
        return {
            lastGeneration: Number(this.generationInput.value),
            productionInterval: Number(this.productionInput.value),
            refreshInterval: Number(this.refreshInput.value)
        }
    }

    private initSliders(): void {
        const productionShow = <HTMLDivElement> document.getElementById('production-interval-show')
        const refreshShow = <HTMLDivElement> document.getElementById('refresh-interval-show')

        App.updateShow(this.productionInput, productionShow)
        this.productionInput.oninput = () => App.updateShow(this.productionInput, productionShow)

        App.updateShow(this.refreshInput, refreshShow)
        this.refreshInput.oninput = () => App.updateShow(this.refreshInput, refreshShow)
    }

    private static updateShow(input: HTMLInputElement, show: HTMLDivElement): void {
        show.innerHTML = input.value
    }

    private initIpc(): void {
        ipc.on('new-generation', (event: any, gameStatus: GameStatus) => {
            this.arena.redraw(gameStatus.generation)
            this.generationDiv.innerHTML = gameStatus.n.toString()
        })
    }
}

interface GameConfig {
    readonly lastGeneration: number,
    readonly productionInterval: number,
    readonly refreshInterval: number
}

interface GameStatus {
    readonly generation: Arena.Cell[],
    readonly n: number
  }  
