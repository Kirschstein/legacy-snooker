export class SnookerScorer {
    #oneBall;

    #playerOneName;
    #playerOneScore;
    #playerTwoScore;
    #playerTwoName;

    #turns;
    #balls;
    #isPlayerOneTurn;
    #breakScore;

    #pottedReds;

    #yellowCleared;
    #greenCleared;
    #onBlue;
    #onPink;

    constructor(playerOneName, playerTwoName) {
        this.#playerOneName = playerOneName;
        this.#playerTwoName = playerTwoName;

        this.#playerOneScore = 0;
        this.#playerTwoScore = 0;

        this.#turns = 0;
        this.#pottedReds = 0;
        this.#breakScore = 0;
        this.#isPlayerOneTurn = true;
        this.#yellowCleared = false;
        this.#greenCleared = false;
        this.#onPink = false;

        this.#balls = ['red', 'yellow', 'green', 'brown', 'blue', 'pink', 'black'];
    }

    record(turn) {
        this.#turns++;

        let reds = this.#pottedReds === 15;

        turn.pottedBalls.forEach(ball => {
            if (ball === 'red') {
                this.#pottedReds++;
            }
        });

        if (this.#onBlue) {
            if (turn.pottedBalls.indexOf('white') > -1) {
                if (!this.#isPlayerOneTurn) {
                    this.#playerOneScore += 5;
                } else {
                    this.#playerTwoScore += 5;
                }
                return {
                    nextPlayer: !this.#isPlayerOneTurn ? this.#playerOneName : this.#playerTwoName,
                    isFoul: true,
                    breakScore: this.#breakScore
                }
            }
            if (turn.hitFirst === 'blue' && turn.pottedBalls.length === 1 && turn.pottedBalls[0] === 'blue') {
                if (this.#isPlayerOneTurn) {
                    this.#playerOneScore += 5;
                    this.#breakScore += 5;
                } else {
                    this.#playerTwoScore += 5;
                    this.#breakScore += 5;
                }
                this.#onBlue = false;
                this.#onPink = true;
                return {
                    nextPlayer: this.#isPlayerOneTurn ? this.#playerOneName : this.#playerTwoName,
                    isFoul: false,
                    breakScore: this.#breakScore
                }
            }
        }
        else {
            if (this.#onPink) {
                if (turn.pottedBalls.indexOf('white') > -1) {
                    if (this.#oneBall)
                    {
                        if (!this.#isPlayerOneTurn) {
                            this.#playerOneScore += 7;
                        } else {
                            this.#playerTwoScore += 7;
                        }
                        return {
                            nextPlayer: !this.#isPlayerOneTurn ? this.#playerOneName : this.#playerTwoName,
                            isFoul: true,
                            breakScore: this.#breakScore
                        }
                    }
                    else {
                        if (!this.#isPlayerOneTurn) {
                            this.#playerOneScore += 6;
                        } else {
                            this.#playerTwoScore += 6;
                        }
                        return {
                            nextPlayer: !this.#isPlayerOneTurn ? this.#playerOneName : this.#playerTwoName,
                            isFoul: true,
                            breakScore: this.#breakScore
                        }
                    }
                }
                else {
                    if (turn.pottedBalls.length === 1 && turn.pottedBalls[0] === 'pink' && turn.hitFirst === 'pink') {
                        if (this.#isPlayerOneTurn) {
                            this.#playerOneScore += 6;
                            this.#breakScore += 6;
                        } else {
                            this.#playerTwoScore += 6;
                            this.#breakScore += 6;
                        }
                        this.#oneBall = true;
                        return {
                            nextPlayer: !this.#isPlayerOneTurn ? this.#playerTwoName : this.#playerOneName,
                            isFoul: false,
                            breakScore: this.#breakScore
                        }
                    }
                    if (this.#oneBall) {
                        if (this.#isPlayerOneTurn) {
                            this.#playerOneScore += 7;
                            this.#breakScore += 7;
                        } else {
                            this.#playerTwoScore += 7;
                            this.#breakScore += 7;
                        }
                        return {
                            nextPlayer: !this.#isPlayerOneTurn ? this.#playerTwoName : this.#playerOneName,
                            isFoul: false,
                            breakScore: this.#breakScore,
                            winner: this.#playerOneScore > this.#playerTwoScore ? this.#playerOneName : this.#playerTwoName
                        }
                    }
                }
            }
            else if (reds && !this.#greenCleared && this.#yellowCleared) {
                if (turn.hitFirst === 'green') {
                    if (turn.pottedBalls.length === 1 && turn.pottedBalls[0] === 'green') {
                        if (this.#isPlayerOneTurn) {
                            this.#playerOneScore += 3;
                            this.#breakScore += 3;
                        } else {
                            this.#playerTwoScore += 3;
                            this.#breakScore += 3;
                        }
                        this.#greenCleared = true;
                        return {
                            nextPlayer: this.#isPlayerOneTurn ? this.#playerOneName : this.#playerTwoName,
                            isFoul: false,
                            breakScore: this.#breakScore
                        }
                    }
                }
            }
        }

        if (turn.hitFirst === '' || turn.hitFirst == null || turn.pottedBalls.indexOf('white') > -1) {
            this.#turns = 0;
            this.#isPlayerOneTurn = !this.#isPlayerOneTurn;
            if (this.#isPlayerOneTurn) {
                let penalty = 4;

                if (turn.pottedBalls.indexOf('blue') > -1) {
                    penalty = 5;
                }
                if (turn.pottedBalls.indexOf('pink') > -1) {
                    penalty = 6;
                }
                if (turn.pottedBalls.indexOf('black') > -1) {
                    penalty = 7;
                }

                this.#playerOneScore = this.#playerOneScore + penalty;
            } else {
                let penalty = 4;

                if (turn.pottedBalls.indexOf('blue') > -1) {
                    penalty = 5;
                }
                if (turn.pottedBalls.indexOf('pink') > -1) {
                    penalty = 6;
                }
                if (turn.pottedBalls.indexOf('black') > -1) {
                    penalty = 7;
                }

                this.#playerTwoScore = this.#playerTwoScore + penalty;
            }
            const breakScore = this.#breakScore;
            this.#breakScore = 0;
            return {
                nextPlayer: this.#isPlayerOneTurn ? this.#playerOneName : this.#playerTwoName,
                isFoul: true,
                breakScore: breakScore
            };
        }

        if (this.#greenCleared) {
            if (turn.hitFirst === 'brown' && turn.pottedBalls.length === 1 && turn.pottedBalls[0] === 'brown') {
                this.#onBlue = true;
                if (this.#isPlayerOneTurn) {
                    this.#playerOneScore += 4;
                    this.#breakScore += 4;
                } else {
                    this.#playerTwoScore += 4;
                    this.#breakScore += 4;
                }
                return {
                    nextPlayer: !this.#isPlayerOneTurn ? this.#playerTwoName : this.#playerOneName,
                    isFoul: false,
                    breakScore: this.#breakScore
                }
            }
        }


        if (turn.hitFirst !== 'red' && this.#turns % 2 === 1  && !reds) {
            this.#turns = 0;
            this.#isPlayerOneTurn = !this.#isPlayerOneTurn;
            if (this.#isPlayerOneTurn) {
                let penalty = 4;

                if (turn.hitFirst === 'blue') {
                    penalty = 5;
                }
                if (turn.hitFirst === 'pink') {
                    penalty = 6;
                }
                if (turn.hitFirst === 'black') {
                    penalty = 7;
                }

                this.#playerOneScore = this.#playerOneScore + penalty;
            } else {
                let penalty = 4;

                if (turn.hitFirst === 'blue') {
                    penalty = 5;
                }
                if (turn.hitFirst === 'pink') {
                    penalty = 6;
                }
                if (turn.hitFirst === 'black') {
                    penalty = 7;
                }

                this.#playerTwoScore = this.#playerTwoScore + penalty;
            }
            const breakScore = this.#breakScore;
            this.#breakScore = 0;
            return {
                nextPlayer: this.#playerTwoName,
                isFoul: true,
                breakScore: breakScore
            };
        }

        if (turn.pottedBalls.length === 0) {
            this.#turns = 0;
            this.#isPlayerOneTurn = !this.#isPlayerOneTurn;
            const breakScore = this.#breakScore;
            this.#breakScore = 0;
            return {
                nextPlayer: this.#isPlayerOneTurn ? this.#playerOneName : this.#playerTwoName,
                isFoul: false,
                breakScore: breakScore
            };
        }

        if (this.#turns % 2 === 0) {
            if (turn.hitFirst === 'red' && !reds) {
                this.#turns = 0;
                if (this.#isPlayerOneTurn) {
                    this.#playerTwoScore += 4;
                } else {
                    this.#playerOneScore = this.#playerOneScore + 4;
                }
                this.#isPlayerOneTurn = !this.#isPlayerOneTurn;
                return {
                    nextPlayer: this.#isPlayerOneTurn ? this.#playerOneName : this.#playerTwoName,
                    isFoul: true,
                    breakScore: 1
                };
            } else if (turn.pottedBalls.length > 1) {
                let penalty = 4;

                if (turn.pottedBalls.indexOf('blue') > -1) {
                    penalty = 5;
                }

                if (turn.pottedBalls.indexOf('pink') > -1) {
                    penalty = 6;
                }

                if (turn.pottedBalls.indexOf('black') > -1) {
                    penalty = 7;
                }

                if (this.#isPlayerOneTurn) {
                    this.#playerTwoScore = this.#playerTwoScore + penalty;
                } else {
                    this.#playerOneScore = this.#playerOneScore + penalty;
                }
                this.#isPlayerOneTurn = !this.#isPlayerOneTurn;


                return {
                    nextPlayer: this.#isPlayerOneTurn ? this.#playerOneName : this.#playerTwoName,
                    isFoul: true,
                    breakScore: 0
                };
            } else {
                for (let c=1 ; c < this.#balls.length; c++){
                    let penalty = 0;
                    if (turn.pottedBalls.indexOf(this.#balls[c]) > -1 && this.#balls[c] !== turn.hitFirst) {
                        penalty = c + 1;
                    }

                    if (penalty > 0) {
                        if (penalty < 4) {
                            penalty = 4;
                        }
                        if (this.#isPlayerOneTurn) {
                            this.#playerTwoScore = this.#playerTwoScore + penalty;
                        } else {
                            this.#playerOneScore = this.#playerOneScore + penalty;
                        }
                        this.#isPlayerOneTurn = !this.#isPlayerOneTurn;

                        return {
                            nextPlayer: this.#isPlayerOneTurn ? this.#playerOneName : this.#playerTwoName,
                            isFoul: true,
                            breakScore: 0
                        };
                    }
                }

                if (reds && turn.pottedBalls.length === 1 && turn.pottedBalls[0] === 'yellow') {
                    this.yellowCleared = true;
                    if (this.#isPlayerOneTurn) {
                        this.#playerOneScore += 2;
                    } else {
                        this.#playerTwoScore += 2;
                    }
                    return {
                        nextPlayer: this.#playerOneName,
                        isFoul: false,
                        breakScore: this.#playerOneScore
                    }
                }

                if (this.#isPlayerOneTurn) {
                    this.#playerOneScore += (this.#balls.indexOf(turn.pottedBalls[0]) + 1);
                    this.#breakScore += (this.#balls.indexOf(turn.pottedBalls[0]) + 1);
                } else {
                    this.#playerTwoScore += (this.#balls.indexOf(turn.pottedBalls[0]) + 1);
                    this.#breakScore += (this.#balls.indexOf(turn.pottedBalls[0]) + 1);
                }
                return {
                    nextPlayer: this.#playerOneName,
                    isFoul: false,
                    breakScore: this.#breakScore
                };
            }
        } else {
            if (reds && turn.pottedBalls.length === 1 && turn.pottedBalls[0] === 'yellow') {
                if (this.#isPlayerOneTurn) {
                    this.#playerOneScore += 2;
                    this.#breakScore += 2;
                } else {
                    this.#playerTwoScore += 2;
                    this.#breakScore += 2;
                }
                this.#yellowCleared = true;
                return {
                    nextPlayer: !this.#isPlayerOneTurn ? this.#playerTwoName : this.#playerOneName,
                    isFoul: false,
                    breakScore: this.#breakScore
                }
            }
            if (turn.pottedBalls.length > 1) {

                let pottedColour = false;

                for(let i=0; i < turn.pottedBalls.length; i++){
                    if (turn.pottedBalls[i] !== 'red') {
                        pottedColour = true;
                    }
                }

                if (pottedColour) {

                    let penalty = 4;

                    if (turn.pottedBalls.indexOf('blue') > -1) {
                        penalty = 5;
                    }

                    if (turn.pottedBalls.indexOf('pink') > -1) {
                        penalty = 6;
                    }

                    if (turn.pottedBalls.indexOf('black') > -1) {
                        penalty = 7;
                    }

                    if (this.#isPlayerOneTurn) {
                        this.#playerOneScore = this.#playerOneScore + penalty;
                    } else {
                        this.#playerTwoScore = this.#playerTwoScore + penalty;
                    }

                    this.#isPlayerOneTurn = !this.#isPlayerOneTurn;
                    const breakScore = this.#breakScore;
                    this.#breakScore = 0;

                    return {
                        nextPlayer: this.#playerTwoName,
                        isFoul: true,
                        breakScore: breakScore
                    };
                }
            }
            if (!reds) {
                if (this.#isPlayerOneTurn) {
                    this.#playerOneScore += turn.pottedBalls.length;
                    this.#breakScore += turn.pottedBalls.length;
                } else {
                    this.#playerTwoScore += turn.pottedBalls.length;
                    this.#breakScore += turn.pottedBalls.length;
                }
                return {
                    nextPlayer: this.#isPlayerOneTurn? this.#playerOneName : this.#playerTwoName,
                    isFoul: false,
                    breakScore: this.#breakScore
                }
            }
        }
    }

    getTotalScore(playerName) {
        if (playerName === this.#playerOneName) {
            return this.#playerOneScore;
        }

        return this.#playerTwoScore;
    }

    getCurrentPlayer() {
        return this.#isPlayerOneTurn ? this.#playerOneName : this.#playerTwoName;
    }
}