import { dayFromTime, hourFromTime } from './utils'

export class Scheduler {
    #stages
    #computeStage

    constructor(options = {}) {
        if (!options.computeStage) throw new Error('A `computeStage` method must be provided')
        if (!options.stages) throw new Error('An array of `stages` must be provided')
        options.stages.forEach(stage => {
            if (stage.interval == undefined) throw new Error('Each member of `stages` has to have a .interval property')
        })

        this.cards = options.cards || []
        this.#stages = options.stages
        this.#computeStage = options.computeStage
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
                end = Math.min(end, 7 * 24 * 60 * 60 * 1000)
                return card.enabled && card.timestamp >= start && card.timestamp <= end
            }
            return card.enabled && card.timestamp >= start
        })
        cards.sort((a, b) => {
            return b.timestamp < a.timestamp
        })
        let timeline = []
        cards.forEach(card => {
            let day = dayFromTime(card.timestamp)
            let hour = hourFromTime(card.timestamp)

            timeline[day] = timeline[day] || []
            timeline[day][hour] = timeline[day][hour] || []
            timeline[day][hour].push(card)
        })

        // Remove empty elements
        timeline.forEach((day, i) => {
            timeline[i] = day.filter(hour => hour != null)
        })
        timeline = timeline.filter(day => day != null)

        return timeline
    }

    update(card) {
        // use user-provided function to update card stage
        card.stage = this.#computeStage(card)
        // Clamp stage between stages length
        // and 1 (min stage)
        card.stage = Math.min(card.stage, this.#stages.length - 1)
        card.stage = Math.max(card.stage, 1)
        
        // set card next review time
        card.timestamp = Date.now() + this.#stages[card.stage].interval
    }

    toJSON() {
        return {
            cards: this.cards.map(card => card.toJSON())
        }
    }

    fromJSON(json) {
        this.cards = json.cards.map(data => {
            let card = new Card()
            card.fromJSON(data)
        })
    }
}