import { Component } from 'solid-js';
import { Container, Grid, Box } from '@suid/material';
import { RedVeilDisplay } from '../components/RedVeil/RedVeilDisplay';
import { ScrollStackServices } from '../components/ScrollStack/ScrollStackServices';
import { CardSwapDisplay } from '../components/CardSwap/CardSwapDisplay';
import { ProfileCardsDisplay } from '../components/ProfileCards/ProfileCardsDisplay';
import { RollingGalleryDisplay } from '../components/RollingGallery/RollingGalleryDisplay';
import { CarouselDisplay } from '../components/Carousel/CarouselDisplay';
import { DisplayChromaGrid } from '../components/ChromaGrid/ChromaGridDisplay';
import { MagicBentoDisplay } from '../components/MagicBento/MagicBentoDisplay';
import  Footer  from '../components/Footer/Footer';
interface HomeProps {
  themeMode: () => 'dark' | 'light';
  setThemeMode: (mode: 'dark' | 'light') => void;
}

const Home: Component<HomeProps> = (props) => {
  return (
	<>
	  	{/*<Header themeMode={props.themeMode} setThemeMode={props.setThemeMode} />*/}
		<Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
			<RedVeilDisplay />
			<CardSwapDisplay />
			<MagicBentoDisplay />			  
			{<CarouselDisplay />}
			{<RollingGalleryDisplay />}
			<DisplayChromaGrid />
			<Footer />
			
		</Box>
	</>
  );
};

export default Home;