import RollingGallery from "./RollingGallery";
import { Box, Typography } from "@suid/material";
import { sectionSx, headingSx } from "../common/sectionLayout";

export const RollingGalleryDisplay = () => {
	return (
		<Box sx={sectionSx}>
			<Typography variant="h3" component="h2" sx={headingSx}>
				The Team
			</Typography>
			<RollingGallery autoplay={true} pauseOnHover={false} />
		</Box>
	);
};
