import { createSignal, onCleanup, JSX, onMount, Show, createMemo } from "solid-js";
import ProfileCard from "../ProfileCards/ProfileCard";
import "./RollingGallery.css";

const teamMembers = [
	{
		name: "Michele",
		title: "Coder",
		handle: "michele",
		status: "Online",
		contactText: "Contact Me",
		avatarUrl: "https://pbs.twimg.com/profile_images/1943686258552647680/RnQgo5j7_400x400.jpg",
		showUserInfo: true,
		enableTilt: false,
		enableMobileTilt: false,
		onContactClick: () => {
			console.log("Contact clicked for Michele");
			alert("Contact clicked for Michele");
		},
	},
	{
		name: "Hari",
		title: "Coder",
		handle: "hari",
		status: "Online",
		contactText: "Contact Me",
		avatarUrl: "https://pbs.twimg.com/profile_images/1962792855811837952/S8rku6hu_400x400.jpg",
		showUserInfo: true,
		enableTilt: false,
		enableMobileTilt: false,
		onContactClick: () => {
			console.log("Contact clicked for Hari");
			alert("Contact clicked for Hari");
		},
	},
	{
		name: "Mike",
		title: "Coder",
		handle: "mike",
		status: "Online",
		contactText: "Contact Me",
		avatarUrl: "https://pbs.twimg.com/profile_images/1722046374261280768/bKzmCFxh_400x400.jpg",
		showUserInfo: true,
		enableTilt: false,
		enableMobileTilt: false,
		onContactClick: () => {
			console.log("Contact clicked for Mike");
			alert("Contact clicked for Mike");
		},
	},
];

interface RollingGalleryProps {
	autoplay?: boolean;
	pauseOnHover?: boolean;
	images?: string[];
	autoSpeedDegPerSec?: number;
}

const RollingGallery = (props: RollingGalleryProps): JSX.Element => {
	const { autoplay = true, pauseOnHover = true, autoSpeedDegPerSec = 30 } = props;

	const [isScreenSizeSm, setIsScreenSizeSm] = createSignal<boolean>(window.innerWidth <= 240);
	const cylinderWidth = () => (isScreenSizeSm() ? 1200 : 1400); // reduced from 1800 to 1600

	const faceCount = teamMembers.length; // use teamMembers length
	const safeFaceCount = Math.max(1, faceCount);
	const faceWidth = () => (cylinderWidth() / safeFaceCount) * 1.5;
	const dragFactor: number = 0.05;
	const radius = () => cylinderWidth() / (2 * Math.PI);

	const [rotation, setRotation] = createSignal(0);

	const transform = createMemo(() => `rotateY(${rotation()}deg)`);

	// Hover signal for pause
	const [hovered, setHovered] = createSignal(false);

	// Mouse drag implementation
	let dragging = false;
	let lastX = 0;
	const handleMouseDown = (e: MouseEvent) => {
		dragging = true;
		lastX = e.clientX;
	};
	const handleMouseMove = (e: MouseEvent) => {
		if (!dragging) return;
		const dx = e.clientX - lastX;
		lastX = e.clientX;
		setRotation((r) => r + dx * dragFactor);
	};
	const handleMouseUp = () => {
		dragging = false;
	};

	// Smooth autoplay via rAF
	let rafId: number | null = null;
	let lastTs = 0;

	const loop = (ts: number) => {
		if (!lastTs) lastTs = ts;
		const dt = (ts - lastTs) / 1000;
		lastTs = ts;
		if (autoplay && !hovered() && faceCount > 0) {
			setRotation((r) => r - autoSpeedDegPerSec * dt);
		}
		rafId = requestAnimationFrame(loop);
	};

	onMount(() => {
		if (autoplay) rafId = requestAnimationFrame(loop);
		const handleResize = () => setIsScreenSizeSm(window.innerWidth <= 640);
		window.addEventListener("resize", handleResize);
		onCleanup(() => {
			if (rafId) cancelAnimationFrame(rafId);
			window.removeEventListener("resize", handleResize);
		});
	});

	return (
		<div class="gallery-container" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
			<div class="gallery-gradient gallery-gradient-left" />
			<div class="gallery-gradient gallery-gradient-right" />
			<div class="gallery-content" style={{ width: `${cylinderWidth()}px`, perspective: "1000px" }}>
				<Show when={faceCount > 0} fallback={<div class="gallery-empty">No team members</div>}>
					<div
						class="gallery-track"
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseUp}
						style={{
							transform: transform(),
							"transform-style": "preserve-3d",
							"will-change": "transform",
							cursor: "grab",
						}}
					>
						{teamMembers.map((member: any, i: number) => (
							<div
								class="gallery-item"
								style={{
									width: "100px",
									height: "200px",
									transform: `rotateY(${(360 / safeFaceCount) * i}deg) translateZ(${radius()}px)`,
								}}
							>
								<ProfileCard {...member} />
							</div>
						))}
					</div>
				</Show>
			</div>
		</div>
	);
};

export default RollingGallery;
