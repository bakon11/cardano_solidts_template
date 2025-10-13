import { Component, For } from "solid-js";
import ProfileCard from "./ProfileCard";
import { Box, Grid, Typography, Button, useTheme } from "@suid/material";
import { sectionSx, headingSx } from "../common/sectionLayout";

const teamMembers = [
	{
		name: "Michele",
		title: "Coder",
		handle: "michele",
		status: "Online",
		contactText: "Contact Me",
		avatarUrl: "/path/to/avatar.jpg",
		showUserInfo: true,
		enableTilt: false,
		enableMobileTilt: false,
		onContactClick: () => console.log("Contact clicked"),
	},
	{
		name: "Hari",
		title: "Coder",
		handle: "hari",
		status: "Online",
		contactText: "Contact Me",
		avatarUrl: "/path/to/avatar.jpg",
		showUserInfo: true,
		enableTilt: false,
		enableMobileTilt: false,
		onContactClick: () => console.log("Contact clicked"),
	},
	{
		name: "Mike",
		title: "Coder",
		handle: "mike",
		status: "Online",
		contactText: "Contact Me",
		avatarUrl: "/path/to/avatar.jpg",
		showUserInfo: true,
		enableTilt: false,
		enableMobileTilt: false,
		onContactClick: () => console.log("Contact clicked"),
	},
];

export const ProfileCardsDisplay = () => {
	return (
		<Box sx={sectionSx}>
			<Typography variant="h3" component="h2" sx={headingSx}>
				Contributors
			</Typography>
			<div class="display-grid">
				<Grid container justifyContent="center">
					<For each={teamMembers}>
						{(member) => (
							<Grid item xs={12} sm={6} md={3}>
								<ProfileCard {...member} className="team-profile-card" />
							</Grid>
						)}
					</For>
				</Grid>
			</div>
		</Box>
	);
};
