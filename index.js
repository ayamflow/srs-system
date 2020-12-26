export { Scheduler } from './src/scheduler'
export { Card } from './src/card'
export { HOUR, DAY, WEEK, MONTH } from './src/intervals'


engine
interval config: array of time interval for each rank
.cards: list of items ready to review

item
- .correct()/.wrong() method to set answer
- interval: prop to know which interval

scheduler => algorithm for time/ranks.
Leitner SRS

new_srs_stage = current_srs_stage - (incorrect_adjustment_count * srs_penalty_factor)
srs_penalty_factor = stage > 5 ? 2 : 1
incorrect_adjustment_count = ceil(incorrect * 0.5)

engine => config used

let scheduler = new Scheduler({
    intervals: [{
        name: 'apprentice1',
        delay: 0 
    }, {
        name: 'apprentice2',
        delay: 4 * HOURS
    }, {
        name: 'apprentice3',
        delay: 8 * HOURS
    }, {
        name: 'apprentice4',
        delay: 1 * DAY
    }, {
        name: 'guru1',
        delay: 2 * DAY
    }, {
        name: 'guru2',
        delay: 1 * WEEK
    }, {
        name: 'master',
        delay: 2 * WEEK
    }, {
        name: 'enlightened',
        delay: 1 * MONTH
    }, {
        name: 'burned',
        delay: 4 * MONTH
    }]
})

let cards = scheduler.getReviews()

cards.forEach(card => {
    card.correct() / card.wrong()
    scheduler.updateCard(card)
})