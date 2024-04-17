import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import { Button, Divider, Header, Segment } from 'semantic-ui-react';
import { FieldItem } from '../../utils/types';
import { FIRST_FIELD_CHIP_REQUIRE, SECOND_FIELD_CHIP_REQUIRE } from '../../utils/constants';
import styles from './styles.module.scss';
import Chips from '../Chip/Chips';
import TicketHeader from './TicketHeader';

interface TicketProps {
    getFirstField: () => FieldItem[]
    getSecondField: () => FieldItem[]
    getFirstFieldSelectedCount: () => number
    getSecondFieldSelectedCount: () => number
    toggleFirstFieldActive: (value: number) => void
    toggleSecondFieldActive: (value: number) => void
    sendResult: () => void
}

function Ticket(props: TicketProps) {
    const {
        getFirstField,
        getSecondField,
        getFirstFieldSelectedCount,
        getSecondFieldSelectedCount,
        toggleFirstFieldActive,
        toggleSecondFieldActive,
        sendResult,
    } = props;

    const firstSelected = getFirstFieldSelectedCount();
    const secondSelected = getSecondFieldSelectedCount();

    const onShowResultClick = useCallback(() => {
        sendResult();
    }, [sendResult]);

    return (
        <Segment
            padded
            className={styles.ticket}
        >
            <Header
                content="Билет 1"
            />
            <TicketHeader
                withProgress
                fieldNumber={1}
                requireCount={FIRST_FIELD_CHIP_REQUIRE}
                selectedCount={firstSelected}
            />
            <Divider />
            <Chips
                getField={getFirstField}
                toggleChipActive={toggleFirstFieldActive}
            />
            <Divider />
            <TicketHeader
                withProgress={false}
                fieldNumber={2}
                requireCount={SECOND_FIELD_CHIP_REQUIRE}
                selectedCount={secondSelected}
            />
            <Chips
                getField={getSecondField}
                toggleChipActive={toggleSecondFieldActive}
            />
            <div className={styles.ticket_button_wrapper}>
                <Button
                    basic
                    content="Показать результат"
                    disabled={(firstSelected > FIRST_FIELD_CHIP_REQUIRE) || (secondSelected > SECOND_FIELD_CHIP_REQUIRE)}
                    onClick={onShowResultClick}
                />
            </div>
        </Segment>
    )
}

export default observer(Ticket);
