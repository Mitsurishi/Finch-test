import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import LotteryAppStore from './LotteryAppStore';
import Ticket from '../components/Ticket/Ticket';
import { Dimmer, Loader, Message, Segment } from 'semantic-ui-react';
import styles from './styles.module.scss';
import { FIRST_FIELD_CHIP_COUNT, SECOND_FIELD_CHIP_COUNT } from '../utils/constants';

function LotteryApp() {
  const store = useMemo(() => new LotteryAppStore({
    firstFieldCount: FIRST_FIELD_CHIP_COUNT,
    secondFieldCount: SECOND_FIELD_CHIP_COUNT,
  }), [])

  const {
    getFirstField,
    getSecondField,
    getFirstFieldSelectedCount,
    getSecondFieldSelectedCount,
    getLoadingState,
    toggleFirstFieldActive,
    toggleSecondFieldActive,
    sendResult,
  } = store;

  const loadingState = getLoadingState();

  return (
    <Segment
      compact
      inverted
      color="violet"
      className={styles.container}
    >
      {loadingState.error
        && (
          <Message
            error
            content={typeof loadingState.error === 'boolean' ? "Неизвестная ошибка" : loadingState.error}
          />
        )}
      <Ticket
        getFirstField={getFirstField}
        getSecondField={getSecondField}
        getFirstFieldSelectedCount={getFirstFieldSelectedCount}
        getSecondFieldSelectedCount={getSecondFieldSelectedCount}
        toggleFirstFieldActive={toggleFirstFieldActive}
        toggleSecondFieldActive={toggleSecondFieldActive}
        sendResult={sendResult}
      />
      <Dimmer active={loadingState.loading} inverted>
        <Loader inverted>Загрузка</Loader>
      </Dimmer>
    </Segment>
  );
}

export default observer(LotteryApp);
