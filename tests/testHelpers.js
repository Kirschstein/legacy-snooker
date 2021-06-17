export class ShotBuilder {

    #playerName = '';
    #hit = '';
    #potted = [];

    constructor(playerName) {
        this.#playerName = playerName;
    }

    /**
     * returns a ShotBuilder (call .shot() to return the shot object)
     * by default the shot will assume the player hit and potted no balls
     * @param playerName
     * @returns {ShotBuilder}
     */

    static forPlayer(playerName) {
        return new ShotBuilder(playerName);
    }

    /**
     * Shortcut for a legal red-ball pot
     * @param playerName
     * @returns {{hitFirst: string, pottedBalls: *[], player: string}}
     */
    static potRed(playerName) {
        return this.potColour(playerName, 'red');
    }

    /**
     * Shortcut for a legal colour-ball pot
     * @param playerName
     * @returns {{hitFirst: string, pottedBalls: *[], player: string}}
     */
    static potColour(playerName, colour) {
        return new ShotBuilder(playerName)
            .hits(colour)
            .pots(colour)
            .shot();
    }

    /**
     * hits specifies the first ball the player hit with the cueball
     * @returns {ShotBuilder}
     */
    hits(ball) {
        this.#hit = ball;
        return this;
    }

    /**
     * pots is an ordered array of balls that the player potted
     *
     * Calling this method multiple times will add to the balls potted by the player for this shot.
     * You may pass in an array of balls or list of balls as arguments
     * @returns {ShotBuilder}
     */
    pots() {
        if (Array.isArray(arguments[0])) {
            this.#potted = [...this.#potted, ...arguments[0]];
        } else {
            this.#potted = [...this.#potted, ...arguments];
        }

        return this;
    }

    /**
     * Build the shot object used by the production code
     * @returns {{hitFirst: string, pottedBalls: *[], player: string}}
     */
    shot() {
        return {
            player: this.#playerName,
            pottedBalls: this.#potted,
            hitFirst: this.#hit,
        }
    }
}

export class PlayerActor {
    #playerName;
    #snookerGame;

    constructor(playerName, snookerGame) {
        this.#playerName = playerName;
        this.#snookerGame = snookerGame;
    }

    pots(colour) {
        this.#snookerGame.record(ShotBuilder.forPlayer(this.#playerName).hits(colour).pots(colour).shot());
    }

    missesRed() {
        this.#snookerGame.record(ShotBuilder.forPlayer(this.#playerName).hits('red').shot());
    }
}