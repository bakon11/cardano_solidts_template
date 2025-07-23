import { Component } from "solid-js";
import { AppBar, Toolbar, Typography, Button, Box } from "@suid/material";
import { A } from "@solidjs/router";
import { CardanoWalletConnect } from "../CardanoWalletConnect/CardanoWalletConnect";
import ThemeToggle from "./ThemeToggle";
import CTAButtonsSection from "../CTAButtonsSection";
interface HeaderProps {
  themeMode: () => "dark" | "light";
  setThemeMode: (mode: "dark" | "light") => void;
}

const Header: Component<HeaderProps> = (props) => {
  return (
    <AppBar position="static" color="default" sx={{ height: '8%'}}>
        <Toolbar sx={{ width: '70%', margin: "auto auto" }} >
             <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                Dapp
            </Typography>
            <CTAButtonsSection />
            <Box sx={{ display: "flex", gap: "10px" }}>
                <Button color="inherit" component={A} href="/">
                    Home
                </Button>	
                <CardanoWalletConnect />
                <ThemeToggle
                    themeMode={props.themeMode}
                    setThemeMode={props.setThemeMode}
                />
            </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
