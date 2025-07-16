import { Component, createSignal, createMemo } from "solid-js";
import { Router, Route } from "@solidjs/router";
import { ThemeProvider, CssBaseline, Typography } from "@suid/material";
import { makePersisted } from "@solid-primitives/storage";

import { darkTheme, lightTheme } from "../theme";
import Home from "./Home";


const App: Component = () => {
  const [themeMode, setThemeMode] = makePersisted(
    createSignal<"dark" | "light">("dark"),
    {
      name: "themeMode",
    },
  );

  const theme = createMemo(() =>
    themeMode() === "dark" ? darkTheme : lightTheme,
  );

  function randomNumber(min:number, max:number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const STAR_COUNT = 12000;
  let result = "";
  for (let i = 0; i < STAR_COUNT; i++) {
    result += `${randomNumber(-50, 50)}vw ${randomNumber(-50, 50)}vh ${randomNumber(0, 1)}px ${randomNumber(0, 1)}px #fff,`;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div class="main">
        <Typography variant="h5">
          SolitTs
        </Typography>
      </div>
      <Router>
        <Route
          path="/"
          component={() => (
            <Home themeMode={themeMode} setThemeMode={setThemeMode} />
          )}
        />
      </Router>
    </ThemeProvider>
  );
};

export default App;
