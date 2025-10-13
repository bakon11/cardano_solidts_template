import { Component } from "solid-js";
import { Box, Grid, Typography, useTheme } from "@suid/material";
// import AnnouncementBanner from '../AnnouncementBanner/AnnouncementBanner';
import { GravityLightTextSvg } from "./GravityLightTextSvg";
import { GravityDarkTextSvg } from "./GravityDarkTextSvg";

const Footer: Component = () => {
	const theme = useTheme();
	const columns = [
		{
			title: "Platform",
			links: ["Launch App", "Trade", "Poools", "Stake"],
		},
		{ title: "Resources", links: ["Docs", "Analytics", "Token", "Blog"] },
		{ title: "Company", links: ["About", "Careers", "Contact"] },
	];

	return (
		<Box
			sx={{
				backgroundColor: theme.palette.background.paper,
				// padding: '40px 20px',
				marginTop: "auto",
				borderTopLeftRadius: "26px",
				borderTopRightRadius: "26px",
				// width: '100%',
			}}
		>
			<Box sx={{ width: "70%", margin: "0 auto" }}>{/*<AnnouncementBanner />*/}</Box>
			<Box sx={{}}>
				<Grid container spacing={4} sx={{ width: "80%", margin: "0 auto", marginLeft: "15%" }}>
					<Grid item xs={12} sm={6} md={3}>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: "10px",
							}}
						>
							<img
								src="https://www.harmoniclabs.tech/assets/logo/HarmonicLogoRedStrokeTransparentBg.svg"
								alt="Harmonic Labs Logo"
								style={{
									"max-width": "50px", // Adjust size as needed
									"max-height": "50px",
									"pointer-events": "none", // Prevent interaction
									border: "1px #FF0000 solid",
									"border-radius": "100%",
									background: "rgba(0, 0, 0, 1)",
								}}
							/>
						</Box>
						<Typography variant="body2" color="textSecondary">
							Build your Project Today.
						</Typography>
					</Grid>
					{columns.map((column, index) => (
						<Grid item xs={12} sm={6} md={3}>
							<Typography variant="h6" gutterBottom>
								{column.title}
							</Typography>
							{column.links.map((link, linkIndex) => (
								<Typography
									variant="body2"
									sx={{
										marginBottom: "10px",
										padding: "10px 5px",
									}}
								>
									{link}
								</Typography>
							))}
						</Grid>
					))}
				</Grid>
			</Box>

			{/*
        <Box sx={{ width: "80%", margin: "0 auto", background: "transparent" }}>
            { theme.palette.mode === "light" ? <GravityLightTextSvg /> : <GravityDarkTextSvg />  }
        </Box>
        */}
		</Box>
	);
};

export default Footer;
