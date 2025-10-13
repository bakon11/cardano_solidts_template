import CardSwap, { Card } from "./CardSwap";
import { Box, Typography } from "@suid/material";
import { sectionSx, headingSx } from "../common/sectionLayout";

interface Project {
	title: string;
	description: string;
	thumb: string;
	compact?: boolean;
}

const projects: Project[] = [
	{
		title: "Buildooor",
		description: "Transaction crafter for Cardano smart workflows.",
		thumb: "https://avatars.githubusercontent.com/u/130439564?s=64",
	},
	{
		title: "Babel Fees",
		description: "Protocol for flexible multi‑asset fee payments.",
		thumb: "https://avatars.githubusercontent.com/u/130439564?s=64",
	},
	{
		title: "Gerolamo",
		description: "Bringing Decentralization to the maximum the Node of Nodes.",
		thumb: "https://avatars.githubusercontent.com/u/130439564?s=64",
	},
];

export const CardSwapDisplay = () => {
	return (
		<Box sx={sectionSx}>
			<Typography variant="h3" component="h2" sx={headingSx}>
				Projects
			</Typography>
			<CardSwap cardDistance={30} verticalDistance={40} delay={4000} pauseOnHover={true}>
				{projects.map((p) => (
					<Card
						data-compact="true"
						style={{
							// Remove any spacing/push from default card layout
							display: "flex",
							"flex-direction": "column",
							"justify-content": "flex-start",
							"align-items": "flex-start",
							padding: "12px 14px 14px",
							"row-gap": "0", // neutralize possible gap
							gap: "0",
							"min-height": "unset",
							
						}}
					>
						<div
							style={{
								display: "flex",
								"align-items": "center",
								gap: "8px",
								margin: 0,
							}}
						>
							<img
								src={p.thumb}
								alt={p.title}
								style={{
									width: "30px",
									height: "30px",
									"border-radius": "6px",
									"object-fit": "cover",
									"box-shadow": "0 0 0 1px rgba(255,255,255,0.15)",
								}}
							/>
							<Typography
								variant="h6"
								component="h3"
								sx={{
									fontWeight: 600,
									margin: 0,
									fontSize: "1rem",
									lineHeight: 1.15,
								}}
							>
								{p.title}
							</Typography>
						</div>
						<div
							style={{
								width: "100%",
								height: "1px",
								background: "linear-gradient(90deg,rgba(255,255,255,0.08),rgba(255,255,255,0.4),rgba(255,255,255,0.08))",
								margin: "4px 0 4px",
							}}
						/>
						<p
							style={{
								margin: 0,
								"font-size": ".85rem",
								"line-height": 1.2,
								opacity: 0.85,
								"max-width": "420px",
							}}
						>
							{p.description}
						</p>
					</Card>
				))}
			</CardSwap>
		</Box>
	);
};

export default CardSwapDisplay;
