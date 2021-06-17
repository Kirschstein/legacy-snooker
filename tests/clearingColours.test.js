// noinspection DuplicatedCode
import {SnookerScorer} from '../SnookerScorer.js';
import {PlayerActor, ShotBuilder} from './testHelpers.js';

describe('after clearing all the red balls', () => {

    let subject = new SnookerScorer('Alice', 'Bob');
    let alice = new PlayerActor('Alice', subject);
    let bob = new PlayerActor('Bob', subject);

    beforeEach(() => {
        subject = new SnookerScorer('Alice', 'Bob');
        alice = new PlayerActor('Alice', subject);
        bob = new PlayerActor('Bob', subject);

        for (let i=0; i < 15; i++){
            alice.pots('red');
            alice.pots('black');
        }
    })

    it('the yellow must be potted first', () => {
        const result = subject.record(ShotBuilder
                .forPlayer('Alice')
                .hits('yellow')
                .pots('yellow')
                .shot());

        expect(result).toEqual({
            nextPlayer: 'Alice',
            isFoul: false,
            breakScore: (8 * 15) + 2
        });

        expect(subject.getTotalScore('Alice')).toBe((8 * 15) + 2);
    });

    it('if Alice misses the yellow, it is on for Bob', () =>{
        subject.record(ShotBuilder
                .forPlayer('Alice')
                .hits('yellow')
                .shot());

        const result = subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('yellow')
            .pots('yellow')
            .shot());

        expect(result).toEqual({
            nextPlayer: 'Bob',
            isFoul: false,
            breakScore: 2
        });

        expect(subject.getTotalScore('Bob')).toBe(2);
    });


    it('The green must be potted after the yellow', () =>{
        subject.record(ShotBuilder
                .forPlayer('Alice')
                .hits('yellow')
                .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('yellow')
            .pots('yellow')
            .shot());

        const result = subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('green')
            .pots('green')
            .shot());

        expect(result).toEqual({
            nextPlayer: 'Bob',
            isFoul: false,
            breakScore: 5
        });

        expect(subject.getTotalScore('Bob')).toBe(5);
    });

    it('The green can be potted by Alice if Bob misses it', () =>{
        subject.record(ShotBuilder
            .forPlayer('Alice')
            .hits('yellow')
            .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('yellow')
            .pots('yellow')
            .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('green')
            .shot());

        const result = subject.record(ShotBuilder
            .forPlayer('Alice')
            .hits('green')
            .pots('green')
            .shot());

        expect(result).toEqual({
            nextPlayer: 'Alice',
            isFoul: false,
            breakScore: 3
        });

        expect(subject.getTotalScore('Alice')).toBe(120 + 3);
    });

    it('The brown must be potted after the green', () =>{
        subject.record(ShotBuilder
                .forPlayer('Alice')
                .hits('yellow')
                .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('yellow')
            .pots('yellow')
            .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('green')
            .pots('green')
            .shot());

        const result = subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('brown')
            .pots('brown')
            .shot());

        expect(result).toEqual({
            nextPlayer: 'Bob',
            isFoul: false,
            breakScore: 5 + 4
        });

        expect(subject.getTotalScore('Bob')).toBe(5 + 4);
    });

    it('The blue must be potted after the brown', () =>{
        subject.record(ShotBuilder
                .forPlayer('Alice')
                .hits('yellow')
                .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('yellow')
            .pots('yellow')
            .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('green')
            .pots('green')
            .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('brown')
            .pots('brown')
            .shot());

        const result = subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('blue')
            .pots('blue')
            .shot());

        expect(result).toEqual({
            nextPlayer: 'Bob',
            isFoul: false,
            breakScore: 9 + 5
        });

        expect(subject.getTotalScore('Bob')).toBe(9 + 5);
    });

    it('The pink must be potted after the blue', () =>{
        subject.record(ShotBuilder
                .forPlayer('Alice')
                .hits('yellow')
                .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('yellow')
            .pots('yellow')
            .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('green')
            .pots('green')
            .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('brown')
            .pots('brown')
            .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('blue')
            .pots('blue')
            .shot());

        const result = subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('pink')
            .pots('pink')
            .shot());

        expect(result).toEqual({
            nextPlayer: 'Bob',
            isFoul: false,
            breakScore: 14 + 6
        });

        expect(subject.getTotalScore('Bob')).toBe(14 + 6);
    });

    it('The black must be potted after the pink', () =>{
        subject.record(ShotBuilder
                .forPlayer('Alice')
                .hits('yellow')
                .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('yellow')
            .pots('yellow')
            .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('green')
            .pots('green')
            .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('brown')
            .pots('brown')
            .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('blue')
            .pots('blue')
            .shot());

        subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('pink')
            .pots('pink')
            .shot());

        const result = subject.record(ShotBuilder
            .forPlayer('Bob')
            .hits('black')
            .pots('black')
            .shot());

        expect(result).toEqual({
            nextPlayer: 'Bob',
            isFoul: false,
            breakScore: 20 + 7,
            winner: 'Alice'
        });

        expect(subject.getTotalScore('Bob')).toBe(20 + 7);
    });
});