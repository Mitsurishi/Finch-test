import React, { useMemo } from 'react';
import { observer } from 'mobx-react';
import LotteryAppStore from './LotteryAppStore';
import Ticket from '../components/Ticket/Ticket';
import {
  Dimmer,
  Loader,
  Message,
  Segment,
} from 'semantic-ui-react';
import {
  FIRST_FIELD_CHIP_COUNT,
  FIRST_FIELD_CHIP_REQUIRE,
  FIRST_WINNING_CONDITION,
  SECOND_FIELD_CHIP_COUNT,
  SECOND_FIELD_CHIP_REQUIRE,
  SECOND_WINNING_CONDITION,
} from '../utils/constants';
import styles from './styles.module.scss';

function LotteryApp() {
  const store = useMemo(() => new LotteryAppStore({
    firstFieldCount: FIRST_FIELD_CHIP_COUNT,
    secondFieldCount: SECOND_FIELD_CHIP_COUNT,
    firstFieldRequire: FIRST_FIELD_CHIP_REQUIRE,
    secondFieldRequire: SECOND_FIELD_CHIP_REQUIRE,
    firstWinningCondition: FIRST_WINNING_CONDITION,
    secondWinningCondition: SECOND_WINNING_CONDITION,
  }), [])

  const {
    getFirstField,
    getSecondField,
    getFirstFieldSelectedCount,
    getSecondFieldSelectedCount,
    getLoadingState,
    getIsTicketWon,
    getGameState,
    toggleFirstFieldActive,
    toggleSecondFieldActive,
    sendResult,
    selectRandom,
    validateWin,
    restartGame,
  } = store;

  const loadingState = getLoadingState();

  return (
    <Segment
      compact
      inverted
      color="violet"
      className={styles.container}
    >
      {loadingState.error && !loadingState.loading
        && (
          <Message
            error
            content={loadingState.message}
          />
        )}
      {!loadingState.error && !loadingState.loading && loadingState.message.length > 0
        && (
          <Message
            success
            content={loadingState.message}
          />
        )}
      <Ticket
        getFirstField={getFirstField}
        getSecondField={getSecondField}
        getFirstFieldSelectedCount={getFirstFieldSelectedCount}
        getSecondFieldSelectedCount={getSecondFieldSelectedCount}
        getIsTicketWon={getIsTicketWon}
        getGameState={getGameState}
        toggleFirstFieldActive={toggleFirstFieldActive}
        toggleSecondFieldActive={toggleSecondFieldActive}
        sendResult={sendResult}
        selectRandom={selectRandom}
        validateWin={validateWin}
        restartGame={restartGame}
      />
      <Dimmer active={loadingState.loading} inverted>
        <Loader inverted>Загрузка</Loader>
      </Dimmer>
    </Segment>
  );
}

export default observer(LotteryApp);
