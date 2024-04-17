import React from 'react'
import { observer } from 'mobx-react';
import { FieldItem } from '../../utils/types'
import Chip from './Chip';

interface ChipsProps {
    getField: () => FieldItem[]
    toggleChipActive: (value: number) => void
}

function Chips(props: ChipsProps) {
    const { getField, toggleChipActive } = props;

    const field = getField();

    return (
        <div>
            {field.map((el) => (
                <Chip
                    key={el.value}
                    value={el.value}
                    isActive={el.isActive}
                    onClick={toggleChipActive}
                />
            ))}
        </div>
    )
}

export default observer(Chips);
