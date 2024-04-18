import React from 'react';
import { observer } from 'mobx-react';
import { Segment } from 'semantic-ui-react';
import { FieldItem, GameState } from '../../utils/types';
import TicketGameContent from './TicketGameContent';
import styles from './styles.module.scss';
import TicketResultContent from './TicketResultContent';

interface TicketProps {
    getFirstField: () => FieldItem[]
    getSecondField: () => FieldItem[]
    getFirstFieldSelectedCount: () => number
    getSecondFieldSelectedCount: () => number
    getIsTicketWon: () => boolean
    getGameState: () => GameState
    toggleFirstFieldActive: (value: number) => void
    toggleSecondFieldActive: (value: number) => void
    sendResult: () => void
    selectRandom: () => void
    validateWin: () => void
    restartGame: () => void
}

function Ticket(props: TicketProps) {
    const {
        getFirstField,
        getSecondField,
        getFirstFieldSelectedCount,
        getSecondFieldSelectedCount,
        getIsTicketWon,
        getGameState,
        toggleFirstFieldActive,
        toggleSecondFieldActive,
        sendResult,
        selectRandom,
        validateWin,
        restartGame,
    } = props;

    const gameState = getGameState();

    return (
        <Segment
            padded
            className={styles.ticket}
        >
            {gameState === 'inProgress'
                && (
                    <TicketGameContent
                        getFirstField={getFirstField}
                        getSecondField={getSecondField}
                        getFirstFieldSelectedCount={getFirstFieldSelectedCount}
                        getSecondFieldSelectedCount={getSecondFieldSelectedCount}
                        toggleFirstFieldActive={toggleFirstFieldActive}
                        toggleSecondFieldActive={toggleSecondFieldActive}
                        sendResult={sendResult}
                        selectRandom={selectRandom}
                        validateWin={validateWin}
                    />
                )}
            {gameState === 'over'
                && (
                    <TicketResultContent
                        getIsTicketWon={getIsTicketWon}
                        restartGame={restartGame}
                    />
                )
            }
        </Segment>
    )
}

export default observer(Ticket);
