import test from 'ava'
import { Card } from '../src/card'
import { Scheduler } from '../src/scheduler'
import { Review } from '../src/review'

const cards = [
    new Card('Bonjour', 'Hello'),
    new Card('Bonjour', 'Hello')
]

const scheduler = new Scheduler({
    computeStage: function(card) {
        let errorFactor = Math.ceil(card.wrongAnswersCount * 0.5)
        let stage = card.stage - errorFactor
        return stage
    },
    cards,
    stages: [{
        name: 'beginner',
        interval: 0
    }, {
        name: 'intermediate',
        interval: 1000
    }, {
        name: 'advanced',
        interval: 100 * 1000
    }]
})

function resetCards() {
    cards.forEach(card => {
        card.reset()
        card.enable()
    })
}

test.beforeEach(resetCards)

test('Should return no cards (none are enabled)', assert => {
    cards.forEach(card => card.reset())
    assert.is(scheduler.getCards().length, 0)
})

test('Should return enabled cards', assert => {
    cards.forEach(card => card.enable())
    assert.true(scheduler.getCards().length === cards.length)
})

test('Should set up review properly', assert => {
    let review = new Review(scheduler)
    let current = review.getNext()
    
    assert.is(review.length, 4, 'Should have 4 reviews')
    assert.is(review.done, 0, 'Should have 0 done reviews')
    assert.truthy(current, 'Should have a current card')
})

test('Should not finish reviews with wrong answers', assert => {
    let review = new Review(scheduler)
    let current = review.getNext()

    let i = 0
    while (current) {
        review.answer('some wrong answer')
        current = review.getNext()

        if (i++ > 4) {
            assert.pass('Wrong answers push cards back')
            assert.is(review.done, 0, 'No review has been done')
            break
        }
    }
})
test('Should progress through review based on answer', assert => {
    let review = new Review(scheduler)
    let current = review.getNext()

    while (current) {
        let result = review.answer(current.isFrontSide ? 'bonjour' : 'hello')
        assert.true(result, 'Good answer passed')
        current = review.getNext()
    }
    assert.is(review.done, review.length, 'All reviews are done')
})

test.todo('Test timeline feature')
test.todo('Test scheduler feature (timestamp, stage)')