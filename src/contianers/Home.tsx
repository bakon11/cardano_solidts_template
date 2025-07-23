import { Component } from 'solid-js';
import { Container, Grid, Box } from '@suid/material';
import Header from '../components/Header/Header';
import HeroSection from '../components/HeroSection';
import FeatureCardsSection from '../components/FeatureCardsSection';
import StatisticsSection from '../components/StatisticsSection';
import CTAButtonsSection from '../components/CTAButtonsSection';
import HeroBannerSection from '../components/HeroBannerSection';
import TopPerformersSection from '../components/TopPerformersSection';
import AnnouncementBanner from '../components/AnnouncementBanner';
import Footer from '../components/Footer';

interface HomeProps {
  themeMode: () => 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
}

const Home: Component<HomeProps> = (props) => {
  return (
    <>
      <Header themeMode={props.themeMode} setThemeMode={props.setThemeMode} />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/*<AnnouncementBanner />*/}
        <HeroSection />
        <FeatureCardsSection />
        {/*<StatisticsSection />*/}
        {/*<CTAButtonsSection />*/}
        <HeroBannerSection />
        <TopPerformersSection />
        <Footer />
      </Box>
    </>
  );
};

export default Home;