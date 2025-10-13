import MagicBento from "./MagicBento";
import { Box, Typography } from "@suid/material";
import { sectionSx, headingSx } from "../common/sectionLayout";
export const MagicBentoDisplay = () => {
	return (
		<>
			<Box sx={sectionSx}>
				<Typography variant="h3" component="h2" sx={headingSx}>
					Services
				</Typography>
				<MagicBento
					textAutoHide={true}
					enableStars={true}
					enableSpotlight={true}
					enableBorderGlow={true}
					enableTilt={true}
					enableMagnetism={true}
					clickEffect={true}
					spotlightRadius={300}
					particleCount={12}
					glowColor="132, 0, 255"
				/>
			</Box>
		</>
	);
};
