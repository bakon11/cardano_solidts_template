import { Box, Typography } from "@suid/material";
import { sectionSx, headingSx } from "../common/sectionLayout";
import { ScrollStackServices } from "./ScrollStackServices";

export const ScrollStackServicesDisplay = () => (
	<Box sx={sectionSx}>
		<Typography variant="h3" component="h2" sx={headingSx}>
			Services
		</Typography>
		<ScrollStackServices />
	</Box>
);