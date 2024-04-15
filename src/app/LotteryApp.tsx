import React from 'react';
import './App.css';
import { observer } from 'mobx-react';
import LotteryAppStore from './LotteryAppStore';

function LotteryApp() {
  const store = new LotteryAppStore();

  const {
    getFirstField,
    getSecondField,
    toggleFirstFieldValue,
    toggleSecondFieldValue,
  } = store;

  const firstField = getFirstField();
  const secondField = getSecondField();

  return (
    <div>
    </div>
  );
}

export default observer(LotteryApp);
