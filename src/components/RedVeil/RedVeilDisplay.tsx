import { Box, Typography, Button, useTheme } from "@suid/material";
import { RedVeil } from "./RedVeil";
import CircularText from "../CircularText/CircularText";
import Shuffle from "../Shuffle/Shuffle";

export const RedVeilDisplay = () => {
	const Text = () => {
		return <Typography variant="h2" style={{ color: "#FF0000", "text-align": "center" }}></Typography>;
	};

	return (
		<>
			<Box
				sx={{
					// background: '#161616',
					padding: "0 20px",
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					width: "100%",
					margin: "0 auto",
					//borderRadius: '46px',
					minHeight: "1200px",
					position: "relative",
					overflow: "hidden",
					// border: "1px #FF0000 solid",
				}}
			>
				<CircularText text=" HARMONIC LABORATORIES" onHover="pause" spinDuration={30} className="custom-class" />
				<RedVeil />
				<img
					src="https://www.harmoniclabs.tech/assets/logo/HarmonicLogoRedStrokeTransparentBg.svg"
					alt="Harmonic Labs Logo"
					style={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						"max-width": "800px", // Adjust size as needed
						"max-height": "800px",
						"pointer-events": "none", // Prevent interaction
						border: "1px #FF0000 solid",
						"border-radius": "100%",
						background: "rgba(0, 0, 0, 1)",
					}}
				/>
			</Box>
		</>
	);
};
