import { Component } from "solid-js";
import { Typography, Container, Grid } from "@suid/material";
import Header from "../components/Header/Header";
import HomeCard1 from "../components/HomeCards/HomeCard1";
import HomeCard2 from "../components/HomeCards/HomeCard2";
import HomeCard3 from "../components/HomeCards/HomeCard3";
interface HomeProps {
  themeMode: () => "dark" | "light";
  setThemeMode: (mode: "dark" | "light") => void;
}

const Home: Component<HomeProps> = (props) => {
  return (
    <>
      <Header themeMode={props.themeMode} setThemeMode={props.setThemeMode} />
      <Container sx={{ padding: "20px" }}>
        <Typography variant="h4" gutterBottom>
          SolidTs started template for Cardano Dapps
        </Typography>
        <Typography variant="body1">
          Easy themeing and design with @suid/material
        </Typography>
        <Typography variant="body1">
          Cardano wallet connector included.
        </Typography>
        <Grid container spacing={4} sx={{ marginTop: "20px" }}>
          <Grid item xs={12} md={6}>
            <HomeCard1 />
          </Grid>
          <Grid item xs={12} md={6}>
            <HomeCard2 />
          </Grid>
          <Grid item xs={12} md={12}>
            <HomeCard3 />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Home;
