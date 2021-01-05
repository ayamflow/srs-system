import { toArray } from './utils'

export class Card {
    #timestamp
    #wrongAnswersCount
    #rightAnswersCount
    #stage
    #frontSide
    #backSide
    #enabled

    constructor(frontSide, backSide) {
        this.#frontSide = toArray(frontSide)
        this.#backSide = toArray(backSide)
        this.reset()
    }

    fromJSON(json) {
        this.#frontSide = json.frontSide
        this.#backSide = json.backSide
        this.#rightAnswersCount = json.rightAnswersCount
        this.#wrongAnswersCount = json.wrongAnswersCount
        this.#timestamp = json.timestamp
        this.#stage = json.stage
        this.#enabled = json.enabled
    }
    
    toJSON() {
        return {
            frontSide: this.#frontSide,
            backSide: this.#backSide,
            rightAnswersCount: this.#rightAnswersCount,
            wrongAnswersCount: this.#wrongAnswersCount,
            timestamp: this.#timestamp,
            stage: this.#stage,
            enabled: this.#enabled
        }
    }

    answer(correct) {
        if (correct) this.#rightAnswersCount++
        else this.#wrongAnswersCount++
    }

    reset() {
        this.#timestamp = -1
        this.#wrongAnswersCount = 0
        this.#rightAnswersCount = 0
        this.#stage = 0
        this.#enabled = false
    }

    enable() {
        this.reset()
        this.#stage = 1
        this.#enabled = true
    }

    set stage(value) {
        this.#stage = value
    }

    get stage() {
        return this.#stage
    }

    get frontSide() {
        return this.#frontSide
    }
    
    get backSide() {
        return this.#backSide
    }

    get wrongAnswersCount() {
        return this.#wrongAnswersCount
    }
    
    get rightAnswersCount() {
        return this.#rightAnswersCount
    }
    
    set timestamp(value) {
        this.#timestamp = value
    }

    get timestamp() {
        return this.#timestamp
    }
    
    get enabled() {
        return this.#enabled
    }
}