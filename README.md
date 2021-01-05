SRS System
===

A dependency-free javascript Spaced Repetition System (SRS).

See more about SRS [on Wikipedia](https://en.wikipedia.org/wiki/Spaced_repetition).

Often used for memorizing a new language's vocabulary, it's a learning system based on cards, where the ones that you fail to remember are asked more often than the ones you remember.
Cards have 2 sides, usually the meaning (in your native tongue), and the word in the learned language on the other side.


It includes 3 classes:
- `Card` which represents a "learnable item", which can be inherited to override validation.
- `Scheduler` which manages when a card has to be reviewed.
- `Review` which is a series of questions asking both sides of each card provided.

> :warning: this package is in alpha version - the API and classes are still being defined.

## Usage

```js
import { Schedule, Card, Review } from 'srs-system'

// Create the scheduler which determines when cards are ready to be reviewed
const scheduler = new Scheduler({
    computeStage: function(card) {
        let errorFactor = Math.ceil(card.wrongAnswersCount * 0.5)
        let stage = card.stage - errorFactor
        return stage
    },

    stages: [{
        name: 'newbie',
        interval: 0 
    }, {
        name: 'advanced beginner',
        interval: 4 * 60 * 60 * 1000 // 4 hours
    }, {
        name: 'intermediate',
        interval: 24 * 60 * 60 * 1000 // 1 day
    }, {
        name: 'advanced',
        interval: 2 * 24 * 60 * 60 * 1000 // 2 days
    }, {
        name: 'expert',
        interval: 7 * 24 * 60 * 60 * 1000 // 1 week
    }]

    // In real life, cards would be associated to a question and a set of answers
    cards: [
	    new Card('Bonjour', 'Hello'),
        new Card('Merci', ['Thanks', 'Thank you'])
    ]
})

// Create a review, a sequence of questions to check your knowledge
// Passing a wrong answer will push the card to the back of the review queue.
// Passing a correct answer will remove the card from the queue.
scheduler.cards.forEach(card => card.enable())
let review = new Review(scheduler)
let current = review.getNext()
while(current) {
    console.log(card.side) // Question to be answered
    review.answer(value) // 'bonjour'
    console.log(`Reviewed ${review.done} / ${review.length}`)
    current = review.getNext()
}
console.log('Review session completed!') // The review is over when all cards have been answered properly

// You can query the scheduler to know when cards are going to be reviewed
// Cards answered correctly will be reviewed later than the one answered wrongly
let timeline = scheduler.getTimeline()
// 2d array of cards ordered by day/hour as: [dayIndex][hourIndex]

```

## API

### Scheduler
#### Constructor
- new Scheduler(options)
    - `options.computeStage(card)` function used to return the new `stage` value for a card after its review. The stage indicates how that specific card is known - 1 is the lowest (not known)
    - `cards`: array of `Card`
    - `intervals`: ordered array of object with a `.interval` property defining the time before the next review for each `stage`, in milliseconds.
#### Methods
- `getCards()` Return all cards ready for review right now
- `getTimeline(start = now, end = -1)` Return a timeline (day/hour) of upcoming reviews between <start> and <end> timestamps, up to a week ahead.
- `update(card)` update a given card interval, after its been answered
- `toJSON()` Return a JSON representation of all the cards. Used for saving state into a DB or filesystem.
- `fromJSON(json)` Import previously saved cards from JSON data. Used for restoring state from a DB or filesystem.

#### Properties
- `cards`: array of `Card` classes

### Card
Represents a learnable item. It has 2 sides, a "frontSide" and "backSide" which are usually a question/answer couple.
#### Constructor
- new Card(frontSide, backSide)
	- `frontSide` a string or array of strings representing the value of the front side of the card
	- `backSide` a string or array of strings representing the value of the back side of the card
#### Methods
- `answer(true/false)` Answer the card with correct (true) or incorrect (false) answer
- `checkAnswer(value, isFrontSide)` Checks if the answer value is correct for that side of the card
- `reset()` Reset all properties of this card
- `enable()` Mark a card as enabled so that it will be processed. By default, card are disabled so that you can implement custom logic for unlocking new cards.
- `checkFrontSide(value)` Logic for determining if an answer matches the card front side. Inherit the class to override.
- `checkBackSide(value)` Logic for determining if an answer matches the card front side. Inherit the class to override.

#### Properties
- `stage` (get/set) index of the current interval for this card
- `timestamp` (get/set) next timestamp for the card to be reviewed
- `rightAnswersCount` (get) The number of time the card has been answered correctly
- `wrongAnswersCount` (get) The number of time the card has been answered wrongly
- `enabled` (get) true if the card is enabled, false otherwise

### Review
A sequence of questions testing each side of the cards ready for review.
#### Constructor
new Review(scheduler)
	- `scheduler` an instance of a Scheduler
#### Methods
- `getNext()` returns the next question, if any.
	This is an object such as: 
    ```js
    {
    	side: <values from card.frontSide or card.backSide>,
        isFrontSide: true/false,
        errored: false,
        card: <instance of Card>
    }
	```
- `answer(value)` answer the current card (with `Card.answer(value)`), updates the review queue and internally call `scheduler.update(card)` if needed.

#### Properties
- `length` the number of question in the review - by default, twice as much as available cards (1 question per card side).
- `done` the number of questions successfully answered.


## Roadmap
- Make sure it's possible to implement supermemo & other popular algorithms

## License
MIT