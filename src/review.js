import { random, shuffle } from './utils'

export class Review {
    #scheduler
    #current
    #questions
    #length

    constructor(scheduler) {
        this.#scheduler = scheduler
        this.#questions = generateQuestions(scheduler.getCards())
        this.#length = this.#questions.length
    }

    getNext() {
        this.#current = this.#questions.shift()
        return this.#current
    }

    answer(value) {
        const current = this.#current
        const correct = current.card.checkAnswer(value, current.isFrontSide)

        if (correct) {
            this.#current.card.answer(correct)
            this.#scheduler.update(this.#current.card)
        } else {
            // Push card to the back of the queue
            this.#questions.push(this.#current)
            if (!this.#current.errored) {
                // Only mark card as errored once per review session
                this.#current.errored = true
                this.#current.card.answer(correct)
            }
        }

        return correct
    }

    get length() {
        return this.#length
    }

    get done() {
        return this.length - this.#questions.length + (this.#current ? -1 : 0)
    }
}

// Generate 2 questions per card, one for each side
function generateQuestions(cards) {
    return shuffle(cards.map(card => {
        let frontSide = random(card.frontSide)
        let backSide = random(card.backSide)

        return [{
            side: frontSide,
            isFrontSide: true,
            errored: false,
            card
        }, {
            side: backSide,
            isFrontSide: false,
            errored: false,
            card
        }]
    }).flat())
}