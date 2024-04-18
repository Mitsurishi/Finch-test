import React, { useCallback, useMemo } from 'react';
import {
    Button,
    Divider,
    Header,
    Icon,
} from 'semantic-ui-react';
import TicketHeader from './TicketHeader';
import Chips from '../Chip/Chips';
import styles from './styles.module.scss';
import { FIRST_FIELD_CHIP_REQUIRE, SECOND_FIELD_CHIP_REQUIRE } from '../../utils/constants';
import { FieldItem } from '../../utils/types';
import { observer } from 'mobx-react';

interface TicketGameContentProps {
    getFirstField: () => FieldItem[]
    getSecondField: () => FieldItem[]
    getFirstFieldSelectedCount: () => number
    getSecondFieldSelectedCount: () => number
    toggleFirstFieldActive: (value: number) => void
    toggleSecondFieldActive: (value: number) => void
    sendResult: () => void
    selectRandom: () => void
    validateWin: () => void
}

function TicketGameContent(props: TicketGameContentProps) {
    const {
        getFirstField,
        getSecondField,
        getFirstFieldSelectedCount,
        getSecondFieldSelectedCount,
        toggleFirstFieldActive,
        toggleSecondFieldActive,
        sendResult,
        selectRandom,
        validateWin,
    } = props;

    const firstSelected = getFirstFieldSelectedCount();
    const secondSelected = getSecondFieldSelectedCount();

    const isFieldsValid = useMemo(() => (firstSelected === FIRST_FIELD_CHIP_REQUIRE)
        && (secondSelected === SECOND_FIELD_CHIP_REQUIRE), [firstSelected, secondSelected]);

    const onShowResultClick = useCallback(() => {
        validateWin();
        sendResult();
    }, [sendResult, validateWin]);

    const onSelectRandomClick = useCallback(() => {
        selectRandom();
    }, [selectRandom]);

    return (
        <>
            <div className={styles.ticket_main_header}>
                <Header
                    content="Билет 1"
                />
                <Icon
                    color="black"
                    name="magic"
                    className={styles.ticket_magic_icon}
                    onClick={onSelectRandomClick}
                />
            </div>
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
                    disabled={!isFieldsValid}
                    onClick={onShowResultClick}
                />
            </div>
        </>
    )
}

export default observer(TicketGameContent);
