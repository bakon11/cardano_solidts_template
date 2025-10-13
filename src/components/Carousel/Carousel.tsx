import { createSignal, createEffect, onMount, onCleanup, createMemo, JSX } from "solid-js";
import { Motion, useMotionValue, PanInfo } from "solid-motion";
import { Circle, Code, Description, Layers, ViewModule } from "@suid/icons-material";
import "./Carousel.css";

export interface CarouselItem {
	title: string;
	description: string;
	id: number;
	icon: JSX.Element;
}

export interface CarouselProps {
	items?: CarouselItem[];
	baseWidth?: number;
	autoplay?: boolean;
	autoplayDelay?: number;
	pauseOnHover?: boolean;
	loop?: boolean;
	round?: boolean;
}

const DEFAULT_ITEMS: CarouselItem[] = [
	{
		title: "Page Transitions",
		description: "Smooth page transitions for your projects.",
		id: 1,
		icon: <Description sx={{ fontSize: 48, color: "#007bff" }} />,
	},
	{
		title: "Text Animations",
		description: "Cool text animations for your projects.",
		id: 2,
		icon: <Circle sx={{ fontSize: 48, color: "#007bff" }} />,
	},
	{
		title: "Components",
		description: "Reusable components for your projects.",
		id: 3,
		icon: <Layers sx={{ fontSize: 48, color: "#007bff" }} />,
	},
	{
		title: "Backgrounds",
		description: "Beautiful backgrounds and patterns for your projects.",
		id: 4,
		icon: <ViewModule sx={{ fontSize: 48, color: "#007bff" }} />,
	},
	{
		title: "Common UI",
		description: "Common UI components are coming soon!",
		id: 5,
		icon: <Code sx={{ fontSize: 48, color: "#007bff" }} />,
	},
];

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 };

export default function Carousel(props: CarouselProps): JSX.Element {
	const { items = DEFAULT_ITEMS, baseWidth = 400, autoplay = false, autoplayDelay = 3000, pauseOnHover = false, loop = false, round = false } = props;

	const containerPadding = 16;
	const itemWidth = baseWidth - containerPadding * 2;
	const trackItemOffset = itemWidth + GAP;

	const carouselItems = loop ? [...items, items[0]] : items;
	const [currentIndex, setCurrentIndex] = createSignal<number>(0);
	const x = useMotionValue(0);
	const [isHovered, setIsHovered] = createSignal<boolean>(false);
	const [isResetting, setIsResetting] = createSignal<boolean>(false);

	createEffect(() => {
		if (autoplay && (!pauseOnHover || !isHovered())) {
			const timer = setInterval(() => {
				setCurrentIndex((prev) => {
					if (prev === items.length - 1 && loop) {
						return prev + 1;
					}
					if (prev === carouselItems.length - 1) {
						return loop ? 0 : prev;
					}
					return prev + 1;
				});
			}, autoplayDelay);
			onCleanup(() => clearInterval(timer));
		}
	});

	const effectiveTransition = () => (isResetting() ? { duration: 0 } : SPRING_OPTIONS);

	const handleAnimationComplete = () => {
		if (loop && currentIndex() === carouselItems.length - 1) {
			setIsResetting(true);
			x.set(0);
			setCurrentIndex(0);
			setTimeout(() => setIsResetting(false), 50);
		}
	};

	const handleDragEnd = (_: any, info: PanInfo): void => {
		const offset = info.offset.x;
		const velocity = info.velocity.x;
		if (offset < -DRAG_BUFFER || velocity < -VELOCITY_THRESHOLD) {
			if (loop && currentIndex() === items.length - 1) {
				setCurrentIndex(currentIndex() + 1);
			} else {
				setCurrentIndex((prev) => Math.min(prev + 1, carouselItems.length - 1));
			}
		} else if (offset > DRAG_BUFFER || velocity > VELOCITY_THRESHOLD) {
			if (loop && currentIndex() === 0) {
				setCurrentIndex(items.length - 1);
			} else {
				setCurrentIndex((prev) => Math.max(prev - 1, 0));
			}
		}
	};

	const dragProps = loop
		? {}
		: {
				dragConstraints: {
					left: -trackItemOffset * (carouselItems.length - 1),
					right: 0,
				},
			};

	return (
		<div
			class={`carousel-container ${round ? "round" : ""}`}
			style={{
				width: `${baseWidth}px`,
				...(round && {
					height: `${baseWidth}px`,
					"border-radius": "50%",
				}),
			}}
			onMouseEnter={() => pauseOnHover && setIsHovered(true)}
			onMouseLeave={() => pauseOnHover && setIsHovered(false)}
		>
			<Motion
				class="carousel-track"
				drag="x"
				{...dragProps}
				style={
					{
						width: `${itemWidth}px`,
						gap: `${GAP}px`,
						perspective: 1000,
						"perspective-origin": `${currentIndex() * trackItemOffset + itemWidth / 2}px 50%`,
						x: x,
					} as any
				}
				onDragEnd={handleDragEnd}
				animate={{ x: -(currentIndex() * trackItemOffset) }}
				transition={effectiveTransition() as any}
				onAnimationComplete={handleAnimationComplete}
			>
				{carouselItems.map((item, index) => {
					const range = [-(index + 1) * trackItemOffset, -index * trackItemOffset, -(index - 1) * trackItemOffset];
					// {console.log(item.icon)}
					const outputRange = [90, 0, -90];
					return (
						<Motion
							class={`carousel-item ${round ? "round" : ""}`}
							style={
								{
									width: `${itemWidth}px`,
									height: round ? `${itemWidth}px` : "100%",
									rotateY: () => {
										const currentX = x.get();
										if (currentX >= range[0] && currentX <= range[2]) {
											if (currentX <= range[1]) {
												const t = (currentX - range[0]) / (range[1] - range[0]);
												return 90 - t * 90;
											} else {
												const t = (currentX - range[1]) / (range[2] - range[1]);
												return -t * 90;
											}
										} else {
											return currentX < range[0] ? 90 : -90;
										}
									},
									...(round && { "border-radius": "50%" }),
								} as any
							}
							transition={effectiveTransition() as any}
						>
							<div class={`carousel-item-header ${round ? "round" : ""}`}>
								<span class="carousel-icon-container">{item.icon || <div>Icon {index}</div>}</span>
							</div>
							<div class="carousel-item-content">
								<div class="carousel-item-title">{item.title}</div>
								<p class="carousel-item-description">{item.description}</p>
							</div>
						</Motion>
					);
				})}
			</Motion>
			<div class={`carousel-indicators-container ${round ? "round" : ""}`}>
				<div class="carousel-indicators">
					{items.map((_, index) => (
						<Motion
							class={`carousel-indicator ${currentIndex() % items.length === index ? "active" : "inactive"}`}
							animate={{
								scale: currentIndex() % items.length === index ? 1.2 : 1.2,
							}}
							onClick={() => setCurrentIndex(index)}
							transition={{ duration: 0.15 }}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
