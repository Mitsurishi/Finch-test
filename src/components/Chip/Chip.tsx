import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import { Button, ButtonProps } from 'semantic-ui-react';
import styles from './styles.module.scss';

interface ChipProps {
    value: number
    isActive: boolean
    onClick: (value: number) => void
}

function Chip(props: ChipProps) {
    const { value, isActive, onClick } = props;

    const clickHandler = useCallback((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, data: ButtonProps) => {
        if (typeof data.content === 'number') {
            onClick(data.content);
        }
    }, [onClick]);

    return (
        <Button
            color="pink"
            className={styles.chip}
            basic={!isActive}
            content={value}
            active={isActive}
            onClick={clickHandler}
        />
    )
}


export default observer(Chip);
