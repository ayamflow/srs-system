import { } from './card'

export class Scheduler {
    constructor(options = {}) {
        if (!options.compute) throw new Error('A `compute` method must be provided')
        if (!options.intervals) throw new Error('An array of `intervals` must be provided')

        this.cards = options.cards || []
        this.compute = options.compute
    }

    // return cards available for review right now
    getCards() {
        let now = Date.now()
        return this.cards.filter(card => {
            return card.enabled && card.timestamp < now
        })
    }

    // return timeline of future reviews between <start> and <end> date timestamps
    getTimeline(start = Date.now(), end = -1) {
        let cards = this.cards.filter(card => {
            if (end > -1) {
                return card.enabled && card.timestamp >= start && card.timestamp <= end
            }
            return card.enabled && card.timestamp >= start
        })
        cards.sort((a, b) => {
            return b.timestamp < a.timestamp
        })
        let timeline = {}
        cards.forEach(card => {
            let day = 1// figure out day
            let hour = 1// figure out full hour when available

            timeline[day] = timeline[day] || []
            timeline[day][hour] = timeline[day][hour] || []
            timeline[day][hour].push(card)
        })
    }

    update(card) {
        this.compute(card, this.intervals)
    }

    toJSON() {
        return {
            cards: this.cards.map(card => card.toJSON()),
            intervals: this.intervals,
            scheduler: JSON.stringify(this.updateCard.toString())
        }
    }

    fromJSON(json) {
        this.cards = json.cards.map(data => {
            let card = new Card()
            card.fromJSON(data)
        })
        this.intervals = json.intervals
        this.updateCard = JSON.parse()
    }
}