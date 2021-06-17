import {PlayerActor, ShotBuilder} from "./testHelpers";
import {SnookerScorer} from "../SnookerScorer";

describe('on a red ball', () => {
    let subject;

    beforeEach(() => {
        subject = new SnookerScorer('Alice', 'Bob');
    })

    it('is a foul if they fail to hit a ball', () => {
        const result = subject.record(ShotBuilder
            .forPlayer('Alice')
            .shot());

        expect(result).toEqual({
            nextPlayer: 'Bob',
            isFoul: true,
            breakScore: 0
        });
    });

    it('after failing to hit a red ball, the turn passes to their opponent', () => {
        subject.record(ShotBuilder
            .forPlayer('Alice')
            .shot());

        const result = subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('red')
            .pots('red')
            .shot());

        expect(result).toEqual({
            nextPlayer: 'Bob',
            isFoul: false,
            breakScore: 1
        });
    });

    describe('is a foul if they hit a coloured ball before the red', () => {

        const colours = ['yellow', 'green', 'brown', 'blue', 'pink', 'black'];

        colours.forEach(ball => {
            it(`e.g, ${ball}`, () => {

                subject = new SnookerScorer('Alice', 'Bob');

                const result = subject.record(ShotBuilder
                    .forPlayer('Alice')
                    .hits(ball)
                    .shot());

                expect(result).toEqual({
                    nextPlayer: 'Bob',
                    isFoul: true,
                    breakScore: 0
                });
            });
        })
    });

    describe('is a foul if they pot any coloured ball ', () => {

        const colours = ['yellow', 'green', 'brown', 'blue', 'pink', 'black'];

        colours.forEach(ball => {
            it(`e.g, ${ball} first`, () => {

                subject = new SnookerScorer('Alice', 'Bob');

                const result = subject.record(ShotBuilder
                    .forPlayer('Alice')
                    .hits('red')
                    .pots(ball)
                    .pots('red')
                    .shot());

                expect(result).toEqual({
                    nextPlayer: 'Bob',
                    isFoul: true,
                    breakScore: 0
                });
            });

            it(`e.g, ${ball} second`, () => {

                subject = new SnookerScorer('Alice', 'Bob');

                const result = subject.record(ShotBuilder
                    .forPlayer('Alice')
                    .hits('red')
                    .pots('red')
                    .pots(ball)
                    .shot());

                expect(result).toEqual({
                    nextPlayer: 'Bob',
                    isFoul: true,
                    breakScore: 0
                });
            });

            it(`e.g, ${ball} third`, () => {

                subject = new SnookerScorer('Alice', 'Bob');

                const result = subject.record(ShotBuilder
                    .forPlayer('Alice')
                    .hits('red')
                    .pots('red')
                    .pots('red')
                    .pots(ball)
                    .shot());

                expect(result).toEqual({
                    nextPlayer: 'Bob',
                    isFoul: true,
                    breakScore: 0
                });
            });

        })
    })

    describe('is a foul if they pot the white ball', () => {
        it('as the first ball', () => {
            const result = subject.record(ShotBuilder
                .forPlayer('Alice')
                .hits('red')
                .pots('white')
                .pots('red')
                .shot());

            expect(result).toEqual({
                nextPlayer: 'Bob',
                isFoul: true,
                breakScore: 0
            });
        });

        it('as the second ball', () => {
            const result = subject.record(ShotBuilder
                .forPlayer('Alice')
                .hits('red')
                .pots('red')
                .pots('white')
                .shot());

            expect(result).toEqual({
                nextPlayer: 'Bob',
                isFoul: true,
                breakScore: 0
            });
        });

        it('as the only ball', () => {
            const result = subject.record(ShotBuilder
                .forPlayer('Alice')
                .hits('red')
                .pots('white')
                .shot());

            expect(result).toEqual({
                nextPlayer: 'Bob',
                isFoul: true,
                breakScore: 0
            });
        });

    })
});

describe('on a colour, potting a different colour to the one you hit first is a foul, a minimum of 4', () =>{
    const colours = {
        green: 4,
        brown: 4,
        blue: 5,
        pink: 6,
        black: 7
    }

    for (const [colour, points] of Object.entries(colours)) {
        it(`is a foul of ${points} for potting the ${colour} after hitting the yellow`, () => {
            let subject = new SnookerScorer('Alice', 'Bob');

            subject.record(ShotBuilder
                .forPlayer('Alice')
                .hits('red')
                .pots('red')
                .shot());

            subject.record(ShotBuilder
                .forPlayer('Alice')
                .hits('yellow')
                .pots(colour)
                .shot());

            expect(subject.getTotalScore('Bob')).toBe(points);
        });
    }
});

describe('fouling on a colour gives 4 points or the value of the colour if higher', () => {

    const colours = {
        blue: 5,
        pink: 6,
        black: 7
    }

    describe('hitting a colour instead of a red when it is the players first shot', () => {
        for (const [colour, points] of Object.entries(colours)) {
            it(`is a foul of ${points} for the ${colour}`, () => {
                let subject = new SnookerScorer('Alice', 'Bob');

                subject.record(ShotBuilder
                    .forPlayer('Alice')
                    .hits(colour)
                    .pots('red')
                    .shot());

                expect(subject.getTotalScore('Bob')).toBe(points);
            });
        }
    });

    describe('potting a colour worth more than 4 and going "in-off" with the white', () => {
        for (const [colour, points] of Object.entries(colours)) {
            it(`is a foul of ${points} for the ${colour}`, () => {
                let subject = new SnookerScorer('Alice', 'Bob');

                subject.record(ShotBuilder
                    .forPlayer('Alice')
                    .hits('red')
                    .pots('red')
                    .shot());

                subject.record(ShotBuilder
                        .forPlayer('Alice')
                        .hits(colour)
                        .pots(colour)
                        .pots('white')
                        .shot()
                    );

                expect(subject.getTotalScore('Bob')).toBe(points);
            });
        }
    })

    describe('potting more than one colour when a colour is "on"', () => {
        for (const [colour, points] of Object.entries(colours)) {
            it(`is a foul of ${points} for the ${colour}`, () => {
                let subject = new SnookerScorer('Alice', 'Bob');

                subject.record(ShotBuilder
                    .forPlayer('Alice')
                    .hits('red')
                    .pots('red')
                    .shot());

                subject.record(ShotBuilder
                    .forPlayer('Alice')
                    .hits('yellow')
                    .pots('yellow')
                    .pots(colour)
                    .shot());

                expect(subject.getTotalScore('Bob')).toBe(points);
            });
        }
    });

});

describe('potting the white ball gives four points to the opponent', () => {
    let subject;

    beforeEach(() => {
        subject = new SnookerScorer('Alice', 'Bob');
    })

    it('as the first player', () => {
        subject.record(ShotBuilder.potColour('Alice', 'white'));
        expect(subject.getTotalScore('Bob')).toBe(4);
    });

    it('as the second player', () => {
        subject.record(ShotBuilder.potColour('Alice', 'white'));
        subject.record(ShotBuilder.potColour('Bob', 'white'));
        expect(subject.getTotalScore('Alice')).toBe(4);
    });
});

describe('the minimum score for a foul increases if all other balls before the blue have been potted', () => {

    let subject = new SnookerScorer('Alice', 'Bob');
    let alice = new PlayerActor('Alice', subject);
    let bob = new PlayerActor('Bob', subject);

    beforeEach(() => {
        subject = new SnookerScorer('Alice', 'Bob');
        alice = new PlayerActor('Alice', subject);
        bob = new PlayerActor('Bob', subject);

        alice.missesRed();

        for (let i=0; i < 15; i++){
            bob.pots('red');
            bob.pots('black');
        }

        bob.pots('yellow');
        bob.pots('green');
        bob.pots('brown');
    });

    it('is 5 points for potting the white when on the blue', () => {
       const result = subject.record(ShotBuilder
           .forPlayer('Bob')
           .pots('white').shot());

        expect(result).toEqual({
            nextPlayer: 'Alice',
            isFoul: true,
            breakScore: (15 * 8) + 2 + 3 + 4
        });
        expect(subject.getTotalScore('Alice')).toBe(5);
    });

    it('is 6 points for potting the white when on the pink', () => {

       bob.pots('blue');

       const result = subject.record(ShotBuilder
           .forPlayer('Bob')
           .pots('white').shot());

        expect(result).toEqual({
            nextPlayer: 'Alice',
            isFoul: true,
            breakScore: (15 * 8) + 2 + 3 + 4 + 5
        });
        expect(subject.getTotalScore('Alice')).toBe(6);
    });

    it('is 7 points for potting the white when on the black', () => {

       bob.pots('blue');
       bob.pots('pink');

       const result = subject.record(ShotBuilder
           .forPlayer('Bob')
           .pots('white').shot());

        expect(result).toEqual({
            nextPlayer: 'Alice',
            isFoul: true,
            breakScore: (15 * 8) + 2 + 3 + 4 + 5 + 6
        });

        expect(subject.getTotalScore('Alice')).toBe(7);
    });

});


