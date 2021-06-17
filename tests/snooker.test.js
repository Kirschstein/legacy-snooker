// noinspection DuplicatedCode
import {SnookerScorer} from '../SnookerScorer.js';
import {PlayerActor, ShotBuilder} from './testHelpers.js';

describe('first shot', () => {
    let subject;

    beforeEach(() => {
        subject = new SnookerScorer('Alice', 'Bob');
    })

    it('scores 1 point they pot a red', () => {
        const result = subject.record(ShotBuilder
            .forPlayer('Alice')
            .hits('red')
            .pots('red')
            .shot()
        );

        expect(result).toEqual({
            nextPlayer: 'Alice',
            isFoul: false,
            breakScore: 1
        });
    });

    it('scores no points and passes to the next player if they hit a red but do not pot it', () => {
        const result = subject.record(ShotBuilder
            .forPlayer('Alice')
            .hits('red')
            .shot()
        );

        expect(result).toEqual({
            nextPlayer: 'Bob',
            isFoul: false,
            breakScore: 0
        });
    });

    it('scores 2 points if they pot two red balls', () => {
        const potTwoReds = ShotBuilder
            .forPlayer('Alice')
            .hits('red')
            .pots('red', 'red')
            .shot();

        const result = subject.record(potTwoReds);

        expect(result).toEqual({
            nextPlayer: 'Alice',
            isFoul: false,
            breakScore: 2
        });
    })
});

describe('after potting a red ball', () => {

    let subject;

    beforeEach(() => {
        subject = new SnookerScorer('Alice', 'Bob');
        subject.record(ShotBuilder.potRed('Alice'));
    })

    it('potting another red ball is a foul', () => {
        const result = subject.record(ShotBuilder.potRed('Alice'));

        expect(result).toEqual({
            nextPlayer: 'Bob',
            isFoul: true,
            breakScore: 1
        });
    });

    it ('missing a colour ends their break', () => {
        const result = subject.record(ShotBuilder.forPlayer('Alice').hits('black').shot());

        expect(result).toEqual({
            nextPlayer: 'Bob',
            isFoul: false,
            breakScore: 1
        });
    });

    it ('allows their opponent to score', () => {
        subject.record(ShotBuilder.forPlayer('Alice').hits('black').shot());

        const result = subject.record(ShotBuilder.forPlayer('Bob').hits('red').pots('red').shot());

        expect(result).toEqual({
            nextPlayer: 'Bob',
            isFoul: false,
            breakScore: 1
        });
    });

    describe('potting a colour is worth...', () => {
        const colourScores = {
            yellow: 2,
            green: 3,
            brown: 4,
            blue: 5,
            pink: 6,
            black: 7
        };

        for (const [colour, points] of Object.entries(colourScores)) {
            it(`${points} for ${colour}`, () => {
                const result = subject.record(
                    ShotBuilder.forPlayer('Alice')
                        .hits(colour)
                        .pots(colour)
                        .shot());

                expect(result).toEqual({
                    nextPlayer: 'Alice',
                    isFoul: false,
                    breakScore: 1 + points
                });
            });
        }
    });


});

describe('break scores are added to total scores', () => {
    let subject;

    beforeEach(() => {
        subject = new SnookerScorer('Alice', 'Bob');
        subject.record(ShotBuilder.potRed('Alice'));
        subject.record(ShotBuilder.potColour('Alice', 'yellow'));
        subject.record(ShotBuilder.forPlayer('Alice').hits('red').shot());
        subject.record(ShotBuilder.forPlayer('Bob').hits('red').shot());
    })

    it('has a total score of 0 for Bob who has scored nothing', () => {
        expect(subject.getTotalScore('Bob')).toBe(0);
    });

    it('has a total score for Alice before her next shot', () => {
       expect(subject.getTotalScore('Alice')).toBe(3);
    });

    it('has the value of the break added to the score for Alice', () => {
        subject.record(ShotBuilder.potRed('Alice'));
        expect(subject.getTotalScore('Alice')).toBe(4);
    });
});

describe('some example games', () => {
    it('a game', () => {
        const subject = new SnookerScorer('Alice', 'Bob');
        const alice = new PlayerActor('Alice', subject);
        const bob = new PlayerActor('Bob', subject);

        alice.pots('red');
        alice.pots('black');
        alice.missesRed();
        bob.pots('red');
        bob.pots('blue');
        bob.missesRed();

        alice.pots('red');

        expect(subject.getTotalScore('Alice')).toBe(9);
        expect(subject.getTotalScore('Bob')).toBe(6);
        expect(subject.getCurrentPlayer()).toBe('Alice');
    });

    it('a game with some fouls', () => {
        const subject = new SnookerScorer('Alice', 'Bob');
        const alice = new PlayerActor('Alice', subject);
        const bob = new PlayerActor('Bob', subject);

        alice.pots('red');
        alice.pots('red');

        bob.pots('red');
        bob.pots('red');

        alice.pots('red');
        alice.pots('red');

        expect(subject.getTotalScore('Bob')).toBe(1 + 4 + 4);
        expect(subject.getTotalScore('Alice')).toBe(1 + 1 + 4);
        expect(subject.getCurrentPlayer()).toBe('Bob');
    });
});

