import ScrollStack, { ScrollStackItem } from "./ScrollStack";
import { Box, Typography, Button, useTheme } from "@suid/material";

export const ScrollStackServices = () => {
	return (
		<Box
			sx={{
				background: "#00000",
				padding: "40px 20px",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				width: "90%",
				margin: "0 auto",
				// borderRadius: '46px',
				minHeight: "800px",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<ScrollStack>
				<ScrollStackItem>
					<h2>Card 1</h2>
					<p>This is the first card in the stack</p>
				</ScrollStackItem>
				<ScrollStackItem>
					<h2>Card 2</h2>
					<p>This is the second card in the stack</p>
				</ScrollStackItem>
				<ScrollStackItem>
					<h2>Card 3</h2>
					<p>This is the third card in the stack</p>
				</ScrollStackItem>
			</ScrollStack>
		</Box>
	);
};
