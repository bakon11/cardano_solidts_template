import Carousel from "./Carousel";
import { Box, Typography, Button, useTheme } from "@suid/material";
import { sectionSx, headingSx } from "../common/sectionLayout";
export const CarouselDisplay = () => {
	return (
		<Box sx={sectionSx}>
			<Typography variant="h3" component="h2" sx={headingSx}>
				Services
			</Typography>
			<Carousel baseWidth={1200} autoplay={true} autoplayDelay={3000} pauseOnHover={true} loop={true} round={false} />
		</Box>
	);
};
