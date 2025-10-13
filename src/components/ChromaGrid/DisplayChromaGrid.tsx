import ChromaGrid from "./ChromaGrid";
import { Box, Typography } from "@suid/material";
import { sectionSx, headingSx } from "../common/sectionLayout";

const items = [
	{
		title: "Michele",
		image: "https://pbs.twimg.com/profile_images/1943686258552647680/RnQgo5j7_400x400.jpg",
		subtitle: "Coder/Memer",
		handle: "@MicheleHarmonic",
		borderColor: "#3B82F6",
		gradient: "linear-gradient(145deg, #3B82F6, #000)",
		url: "https://x.com/MicheleHarmonic",
		onContactClick: () => {
			console.log("Contact clicked for Michele");
			alert("Contact clicked for Michele");
		},
	},
	{
		title: "Hari",
		image: "https://pbs.twimg.com/profile_images/1962792855811837952/S8rku6hu_400x400.jpg",
		subtitle: "Coder/Ranter",
		handle: "@hari_amoor",
		borderColor: "#10B981",
		gradient: "linear-gradient(180deg, #10B981, #000)",
		url: "https://x.com/hari_amoor",
	},
	{
		title: "Mike",
		image: "https://pbs.twimg.com/profile_images/1722046374261280768/bKzmCFxh_400x400.jpg",
		subtitle: "COder/Variable",
		handle: "@anothervariable",
		borderColor: "#10B981",
		gradient: "linear-gradient(180deg, #10B981, #000)",
		url: "https://x.com/anothervariable",
	},
];

export const DisplayChromaGrid = () => {
	return (
		<Box
			sx={{
				...sectionSx,
				"& .chroma-cards": {
					display: "grid",
					gridTemplateColumns: "repeat(auto-fit,minmax(240px,240px))",
					justifyContent: "center",
					gap: { xs: 2, sm: 3 },
					width: "100%",
					maxWidth: 880,
					mx: "auto",
					mt: 1,
				},
				"& .chroma-card": { minHeight: 300 },
			}}
		>
			<Typography variant="h3" component="h2" sx={headingSx}>
				The Team
			</Typography>
			<ChromaGrid items={items} radius={320} damping={0.45} fadeOut={0.6} ease="power3.out" columns={3} rows={2} />
		</Box>
	);
};
