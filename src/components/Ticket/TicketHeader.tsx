import React from 'react';
import { observer } from 'mobx-react';
import { Header, Icon, Progress } from 'semantic-ui-react';
import styles from './styles.module.scss';

interface TicketHeaderProps {
    withProgress: boolean
    fieldNumber: number
    requireCount: number
    selectedCount: number
}

function TicketHeader(props: TicketHeaderProps) {
    const {
        fieldNumber,
        withProgress,
        requireCount,
        selectedCount,
    } = props;

    return (
        <>
            {selectedCount > requireCount
                && (
                    <Header
                        size="small"
                        color="red"
                        content="Уберите лишние числа."
                    />
                )}
            <div className={styles.ticket_subheader_wrapper}>
                <Header
                    size="small"
                    className={styles.field_header}
                    content={(
                        <>
                            Поле {fieldNumber}
                            {selectedCount !== requireCount
                                && (
                                    <span>
                                        Отметьте {requireCount} чисел.
                                    </span>
                                )}
                        </>
                    )}
                />
                {selectedCount === requireCount
                    && (
                        <Icon
                            name="check"
                            color="green"
                            className={styles.ticket_done_icon}
                        />
                    )}
            </div>
            {withProgress && (selectedCount < requireCount)
                && (
                    <Progress
                        progress="ratio"
                        color="violet"
                        className={styles.progress}
                        value={selectedCount}
                        total={requireCount}
                    />
                )
            }
        </>
    )
}


export default observer(TicketHeader);
