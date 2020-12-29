export class Card {
    #timestamp
    #wrongAnswersCount
    #stage
    #enabled

    constructor() {
        this.reset()
    }

    fromJSON(json) {
        this.#timestamp = json.timestamp
        this.#wrongAnswersCount = json.wrongAnswersCount
        this.#stage = json.stage
        this.#enabled = json.enabled
    }
    
    toJSON() {
        return {
            timestamp: this.#timestamp,
            wrongAnswersCount: this.#wrongAnswersCount,
            stage: this.#stage,
            enabled: this.#enabled
        }
    }

    answer(correct) {
        if (!correct) this.#wrongAnswersCount++
    }

    reset() {
        this.#timestamp = -1
        this.#wrongAnswersCount = 0
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

    get wrongAnswersCount() {
        return this.#wrongAnswersCount
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