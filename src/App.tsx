import { blue, red } from "@mui/material/colors";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useActor, useSelector } from "@xstate/react";
import React, { useEffect } from "react";
import "./App.css";
import Grid from "./components/Grid";
import HeaderBar from "./components/HeaderBar";
import HelpDialog from "./components/HelpDialog";
import Keyboard from "./components/Keyboard";
import SettingsDialog from "./components/SettingsDialog";
import StatsDialog from "./components/StatsDialog";
import { AppSelectors } from "./machines/AppMachine";
import { ActorContext } from "./main";

function App() {
  console.log("ALL SELECTORS", AppSelectors);

  const actorContext = React.useContext(ActorContext);
  const [appState, appSend] = useActor(actorContext.appActorRef);

  const darkMode = useSelector(actorContext.appActorRef, AppSelectors.darkMode);
  const highContrastMode = useSelector(actorContext.appActorRef, AppSelectors.highContrast);
  const openDialog = useSelector(actorContext.appActorRef, AppSelectors.dialog);

  const handleOpenDialog = (dialog: "stats" | "help" | "settings") => {
    appSend({ type: "OPEN_DIALOG", dialog });
  };

  const handleCloseDialog = () => {
    appSend({ type: "CLOSE_DIALOG" });
  };

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      appSend({ type: "KEYPRESS", key: e.key, origin: "" });
      // actorContext.appActorRef.send({ type: "KEYPRESS", key: e.key, origin: "" });
    };
    window.addEventListener("keydown", keyHandler);
    return () => {
      window.removeEventListener("keydown", keyHandler);
    };
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-contrast", highContrastMode ? "high" : "normal");
  }, [highContrastMode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: highContrastMode ? red : blue,
        },
      }),
    [darkMode, highContrastMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <HeaderBar {...{ handleOpenDialog }} />
        <div
          style={{
            width: "100%",
            height: "calc(100vh - var(--header-bar-height) - 1px)",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            maxWidth: 500,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: "1",
              margin: "0 auto",
              width: "min(350px, 100vw)",
            }}
          >
            <div style={{ width: "95%" }}>
              <Grid />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto",
              width: "min(500px, 95vw)",
              marginBottom: 10,
            }}
          >
            <Keyboard />
          </div>
        </div>
        <HelpDialog open={openDialog === "help"} onClose={handleCloseDialog} />
        <StatsDialog open={openDialog === "stats"} onClose={handleCloseDialog} />
        <SettingsDialog open={openDialog === "settings"} onClose={handleCloseDialog} />
      </div>
    </ThemeProvider>
  );
}

export default App;
