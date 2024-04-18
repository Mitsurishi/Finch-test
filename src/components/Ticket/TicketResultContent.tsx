import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { Button, Header } from 'semantic-ui-react';
import styles from './styles.module.scss';

interface TicketResultContentProps {
    getIsTicketWon: () => boolean
    restartGame: () => void
}

function TicketResultContent(props: TicketResultContentProps) {
    const { getIsTicketWon, restartGame } = props;

    const isTicketWon = getIsTicketWon();

    const onRestartGameClick = useCallback(() => {
        restartGame();
    }, [restartGame]);

    return (
        <div className={styles.ticket_result_wrapper}>
            <div>
                <Header
                    content="Билет 1"
                />
                <div>
                    {isTicketWon ? "Вы победили, поздравляем! За это вы получаете абсолютно ничего! Вот это да!" : "Вы проиграли! Не может быть! :("}
                </div>
            </div>
            <div className={styles.ticket_button_wrapper}>
                <Button
                    basic
                    icon="redo"
                    content="Попробовать снова"
                    onClick={onRestartGameClick}
                />
            </div>
        </div>
    )
}

export default observer(TicketResultContent);
