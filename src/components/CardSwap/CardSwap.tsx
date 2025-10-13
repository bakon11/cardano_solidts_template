import { JSX, children as resolveChildren, onMount, createEffect, onCleanup } from "solid-js";
import gsap from "gsap";
import "./CardSwap.css";

export interface CardSwapProps {
	width?: number | string;
	height?: number | string;
	cardDistance?: number;
	verticalDistance?: number;
	delay?: number;
	pauseOnHover?: boolean;
	onCardClick?: (idx: number) => void;
	skewAmount?: number;
	easing?: "linear" | "elastic";
	children: JSX.Element;
}

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
	customClass?: string;
}

export const Card = (props: CardProps) => {
	const cls = ["card", props.customClass, props.class].filter(Boolean).join(" ");
	// Spread remaining props but exclude customClass
	const { customClass, ...rest } = props as any;
	return (
		<div class={cls} {...rest}>
			{props.children}
		</div>
	);
};

interface Slot {
	x: number;
	y: number;
	z: number;
	zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
	x: i * distX,
	y: -i * distY,
	z: -i * distX * 1.5,
	zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
	gsap.set(el, {
		x: slot.x,
		y: slot.y,
		z: slot.z,
		xPercent: -50,
		yPercent: -50,
		skewY: skew,
		transformOrigin: "center center",
		zIndex: slot.zIndex,
		force3D: true,
	});

const toSize = (v: number | string | undefined, fallback: number) => (v === undefined ? `${fallback}px` : typeof v === "number" ? `${v}px` : v);

const CardSwap = (props: CardSwapProps) => {
	let containerRef!: HTMLDivElement;

	const resolved = resolveChildren(() => props.children);

	let cards: HTMLElement[] = [];
	let order: number[] = [];
	let intervalId: number | undefined;
	let tl: gsap.core.Timeline | null = null;
	let pauseBound = false;
	let pauseHandler: (() => void) | null = null;
	let resumeHandler: (() => void) | null = null;

	const clearCycle = () => {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = undefined;
		}
	};

	const killTimeline = () => {
		tl?.kill();
		tl = null;
	};

	const detachHover = () => {
		if (pauseBound && containerRef) {
			containerRef.removeEventListener("mouseenter", pauseHandler!);
			containerRef.removeEventListener("mouseleave", resumeHandler!);
			pauseBound = false;
		}
	};

	const cleanup = () => {
		clearCycle();
		killTimeline();
		detachHover();
	};

	const init = () => {
		cleanup();
		if (!containerRef) return;

		const { width = 900, height = 400, cardDistance = 60, verticalDistance = 70, delay = 1000, pauseOnHover = false, onCardClick, skewAmount = 6, easing = "elastic" } = props;

		const config =
			easing === "elastic"
				? {
						ease: "elastic.out(0.6,0.9)",
						durDrop: 2,
						durMove: 2,
						durReturn: 2,
						promoteOverlap: 0.9,
						returnDelay: 0.05,
					}
				: {
						ease: "power1.inOut",
						durDrop: 0.8,
						durMove: 0.8,
						durReturn: 0.8,
						promoteOverlap: 0.45,
						returnDelay: 0.2,
					};

		cards = Array.from(containerRef.querySelectorAll<HTMLElement>(".card"));
		const total = cards.length;
		order = Array.from({ length: total }, (_, i) => i);

		const w = toSize(width, 900);
		const h = toSize(height, 600);

		cards.forEach((el, i) => {
			el.style.width = w;
			el.style.height = h;
			el.style.position = "absolute";
			el.style.top = "50%";
			el.style.left = "50%";
			el.style.transformStyle = "preserve-3d";
			placeNow(el, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
			el.onclick = () => onCardClick?.(i);
		});

		const swap = () => {
			if (order.length < 2) return;
			const [front, ...rest] = order;
			const elFront = cards[front];
			tl = gsap.timeline();

			tl.to(elFront, {
				y: "+=500",
				duration: config.durDrop,
				ease: config.ease,
			});

			tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);

			rest.forEach((idx, i) => {
				const el = cards[idx];
				const slot = makeSlot(i, cardDistance, verticalDistance, total);
				tl!.set(el, { zIndex: slot.zIndex }, "promote");
				tl!.to(
					el,
					{
						x: slot.x,
						y: slot.y,
						z: slot.z,
						duration: config.durMove,
						ease: config.ease,
					},
					`promote+=${i * 0.15}`,
				);
			});

			const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
			tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
			tl.call(
				() => {
					gsap.set(elFront, { zIndex: backSlot.zIndex });
				},
				undefined,
				"return",
			);
			tl.to(
				elFront,
				{
					x: backSlot.x,
					y: backSlot.y,
					z: backSlot.z,
					duration: config.durReturn,
					ease: config.ease,
				},
				"return",
			);
			tl.call(() => {
				order = [...rest, front];
			});
		};

		swap();
		intervalId = window.setInterval(swap, delay);

		if (pauseOnHover) {
			pauseHandler = () => {
				tl?.pause();
				clearCycle();
			};
			resumeHandler = () => {
				tl?.play();
				clearCycle();
				intervalId = window.setInterval(swap, delay);
			};
			containerRef.addEventListener("mouseenter", pauseHandler);
			containerRef.addEventListener("mouseleave", resumeHandler);
			pauseBound = true;
		}
	};

	onMount(init);

	createEffect(() => {
		// Track dependencies to re-init
		props.width;
		props.height;
		props.cardDistance;
		props.verticalDistance;
		props.delay;
		props.pauseOnHover;
		props.skewAmount;
		props.easing;
		// Defer to ensure DOM updated
		queueMicrotask(() => init());
	});

	onCleanup(cleanup);

	return (
		<div
			ref={containerRef}
			class="card-swap-container"
			style={{
				width: toSize(props.width, 900),
				height: toSize(props.height, 600),
				position: "relative",
				perspective: "1200px",
				overflow: "hidden",
			}}
		>
			{resolved()}
		</div>
	);
};

export default CardSwap;
