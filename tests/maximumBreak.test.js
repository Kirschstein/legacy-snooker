// noinspection DuplicatedCode
import {SnookerScorer} from '../SnookerScorer.js';
import {PlayerActor, ShotBuilder} from './testHelpers.js';

it('getting a maximum break', () => {
    const subject = new SnookerScorer('Alice', 'Bob');
    const alice = new PlayerActor('Alice', subject);

    const times = 15;

    for (let i =0; i < times; i++) {
        alice.pots('red');
        alice.pots('black');
    }

    alice.pots('yellow')
    alice.pots('green')
    alice.pots('brown')
    alice.pots('blue')
    alice.pots('pink')

    const result = subject.record(
        ShotBuilder
            .forPlayer('Alice')
            .hits('black')
            .pots('black')
            .shot());

    expect(result).toEqual({
        nextPlayer: 'Alice',
        isFoul: false,
        breakScore: (8 * times) + 2 + 3 + 4 + 5 + 6 + 7,
        winner: 'Alice'
    });

    expect(subject.getTotalScore('Alice')).toBe((8 * times) + 2 + 3 + 4 + 5 + 6 + 7);
});
