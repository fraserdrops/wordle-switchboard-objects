import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { inspect } from "@xstate/inspect";
import { useInterpret } from "@xstate/react";
import { createContext } from "react";
import { ActorRefFrom, interpret, StateFrom } from "xstate";
import { AppComponent } from "./machines/AppMachine";
import StatsMachine from "./machines/StatsMachine";

inspect({
  url: "https://statecharts.io/inspect",
  iframe: false,
});

export const AppModel = interpret(AppComponent, { devTools: true }).start();
interface ActorContextType {
  statsActorRef: ActorRefFrom<typeof StatsMachine>;
  appActorRef: ActorRefFrom<typeof AppComponent>;
}

export const ActorContext = createContext(
  // Typed this way to avoid TS errors,
  // looks odd I know
  {} as ActorContextType
);

const makeSelectActorRef = (key: string) => (state: StateFrom<typeof AppComponent>) => {
  return state.children[key];
};

export const ViewActorProvider = (props: { children: React.ReactNode }) => {
  const appActorRef = useInterpret(AppComponent);
  const statsActorRef = useInterpret(StatsMachine);

  return (
    <ActorContext.Provider value={{ statsActorRef, appActorRef: AppModel }}>
      {props.children}
    </ActorContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
  <ViewActorProvider>
    <App />
  </ViewActorProvider>
  // </React.StrictMode>
);
