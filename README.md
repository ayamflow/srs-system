SRS System
===

A (naive) javascript Spaced Repetition System (SRS).
See more about SRS [on Wikipedia](https://en.wikipedia.org/wiki/Spaced_repetition). It basically quizzes you more about things you forget, and less about things you know.

## Usage

You will need to create an instance of `Scheduler` to compute your cards.

You can use this locally with your filesystem, or synchronize with any DB using `scheduler.toJSON` and `.fromJSON`.

```js
import { Schedule, Card } from 'srs-system'

let scheduler = new Scheduler({
    compute: function(card, intervals) {
        let now = Date.now()
        let errorFactor = Math.ceil(card.wrongAnswersCount * 0.5)
        card.stage = card.stage - errorFactor
        card.stage = Math.max(card.stage, intervals.length - 1)
        card.timestamp = now + intervals[card.stage].interval
    },

    intervals: [{
        name: 'newbie',
        delay: 0 
    }, {
        name: 'advanced beginner',
        delay: 4 * 60 * 60 * 1000 // 4 hours
    }, {
        name: 'intermediate',
        delay: 24 * 60 * 60 * 1000 // 1 day
    }, {
        name: 'advanced',
        delay: 2 * 24 * 60 * 60 * 1000 // 2 days
    }, {
        name: 'expert',
        delay: 7 * 24 * 60 * 60 * 1000 // 1 week
    }]

    // In real life, cards would be associated to a question and a set of answers
    cards: new Array(100).fill(null).map(val => new Card())
})

let cards = scheduler.getReviews()

cards.forEach(card => {
    // You have to implement question/answer logic yourself!
    // But let the card know how it went:
    card.correct() // or card.wrong()

    // let the scheduler know this card has changed
    scheduler.update(card)
})

let timeline = scheduler.getTimeline()
// 2d array of cards ordered by day/hour
```

## API

### Scheduler
#### Methods
- `getCards()` Return all cards ready for review right now
- `getTimeline(start = now, end = -1)` Return a timeline (day/hour) of upcoming reviews between <start> and <end> timestamps.
- `update(card)` update a given card interval, after its been answered
- `toJSON()` Return a JSON representation of all the cards. Used for saving state into a DB or filesystem.
- `fromJSON(json)` Import previously saved cards from JSON data. Used for restoring state from a DB or filesystem.

### Card
#### Methods
- `correct()` Mark current card as answered correctly
- `wrong()` Mark current card as answered wrong
- `reset()` Reset all properties of this card
- `enable()` Mark a card as enabled so that it will be processed. By default, card are disabled so that you can implement custom logic for unlocking new cards.

#### Properties
- stage (get/set)
- timestamp (get/set)
- wrongAnswersCount (get)
- unlocked (get)

## Roadmap
- Allow to skip a card / wrap up session
- Make sure it's possible to implement supermemo & other popular algorithms

## License
MIT