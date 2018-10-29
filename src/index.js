import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { observable, reaction, autorun, configure, runInAction } from "mobx";

import "./styles.css";

configure({ enforceActions: "always" });

const state = observable({
  count: 0,
  setCount: value => runInAction(() => (state.count = value))
});

function useLens(lens) {
  const [value, setValue] = useState(lens.get());
  useEffect(() => reaction(lens.get, setValue), []);
  return [value, lens.set];
}

const countLens = state => ({
  get: () => state.count,
  set: state.setCount
});

function HookTest({ state }) {
  const [count, setCount] = useLens(countLens(state));

  return (
    <div>
      <h1>HookTest {count}</h1>
      <button onClick={() => setCount(count + 1)}>Inc</button>
    </div>
  );
}

autorun(() => console.log(state.count));

const createList = length => Array.from(new Array(length)).map((_, i) => i);

function App() {
  const [hooksCount, setHooksCount] = useState(2);

  return (
    <>
      {createList(hooksCount).map(i => <HookTest key={i} state={state} />)}
      <button onClick={() => setHooksCount(hooksCount + 1)}>+</button>
      <button onClick={() => setHooksCount(Math.max(0, hooksCount - 1))}>
        -
      </button>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
