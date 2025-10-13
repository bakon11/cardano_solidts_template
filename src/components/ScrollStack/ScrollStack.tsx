import { children, createSignal, onMount, createEffect, onCleanup } from "solid-js";
import Lenis from "lenis";
import "./ScrollStack.css";

export interface ScrollStackItemProps {
	itemClassName?: string;
	children: any; // SolidJS flexible children
}

export const ScrollStackItem = (props: ScrollStackItemProps) => {
	const resolvedChildren = children(() => props.children);
	return <div class={`scroll-stack-card ${props.itemClassName || ""}`.trim()}>{resolvedChildren()}</div>;
};

interface ScrollStackProps {
	className?: string;
	children: any;
	itemDistance?: number;
	itemScale?: number;
	itemStackDistance?: number;
	stackPosition?: string;
	scaleEndPosition?: string;
	baseScale?: number;
	scaleDuration?: number;
	rotationAmount?: number;
	blurAmount?: number;
	useWindowScroll?: boolean;
	onStackComplete?: () => void;
}

export const ScrollStack = (props: ScrollStackProps) => {
	// Destructure with defaults
	const {
		children: childrenProp,
		className = "",
		itemDistance = 100,
		itemScale = 0.1, // Increased for visibility
		itemStackDistance = 30,
		stackPosition = "20%",
		scaleEndPosition = "10%",
		baseScale = 0.85,
		scaleDuration = 0.5,
		rotationAmount = 5, // Increased for visibility
		blurAmount = 5, // Increased for visibility
		useWindowScroll = false,
		onStackComplete,
	} = props;

	let scrollerRef: HTMLDivElement | undefined;
	let stackCompletedRef = false;
	let animationFrameRef: number | undefined;
	let isUpdatingRef = false;
	let lenisRef: Lenis | null = null;
	let cardsRef: HTMLElement[] = [];
	let lastTransformsRef = new Map<number, any>();

	const calculateProgress = (scrollTop: number, start: number, end: number) => {
		if (scrollTop < start) return 0;
		if (scrollTop > end) return 1;
		return (scrollTop - start) / (end - start);
	};

	const parsePercentage = (value: string | number, containerHeight: number) => {
		if (typeof value === "string" && value.includes("%")) {
			return (parseFloat(value) / 100) * containerHeight;
		}
		return parseFloat(value as string);
	};

	const getScrollData = () => {
		if (useWindowScroll) {
			return {
				scrollTop: window.scrollY,
				containerHeight: window.innerHeight,
				scrollContainer: document.documentElement,
			};
		} else {
			const scroller = scrollerRef;
			return {
				scrollTop: scroller!.scrollTop,
				containerHeight: scroller!.clientHeight,
				scrollContainer: scroller!,
			};
		}
	};

	const getElementOffset = (element: HTMLElement) => {
		if (useWindowScroll) {
			const rect = element.getBoundingClientRect();
			return rect.top + window.scrollY;
		} else {
			return element.offsetTop;
		}
	};

	function updateCardTransforms() {
		// Fallback if your original function is empty or too aggressive
		if (!cardsRef.length) return;
		const viewportH = window.innerHeight;
		cardsRef.forEach((card, i) => {
			const rect = card.getBoundingClientRect();
			const top = rect.top;
			// progress 0 (entering) -> 1 (passed)
			const prog = Math.min(Math.max(1 - top / viewportH, 0), 1);
			// Scale and lift stack
			const scale = 1 - i * 0.04 + prog * 0.04;
			const translateY = i * 40 - prog * 40;
			// Slight depth
			card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})`;
			card.style.opacity = String(1 - i * 0.05 + prog * 0.05);
			card.dataset.prog = prog.toFixed(3);
		});
	}
	function loop() {
		isUpdatingRef = true;
		updateCardTransforms();
		animationFrameRef = requestAnimationFrame(loop);
	}

	const handleScroll = () => {
		updateCardTransforms();
	};

	const setupLenis = () => {
		if (useWindowScroll) {
			const lenis = new Lenis({
				duration: 1.2,
				easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				smoothWheel: true,
				touchMultiplier: 2,
				infinite: false,
				wheelMultiplier: 1,
				lerp: 0.1,
				syncTouch: true,
				syncTouchLerp: 0.075,
			});

			lenis.on("scroll", handleScroll);

			const raf = (time: number) => {
				lenis.raf(time);
				animationFrameRef = requestAnimationFrame(raf);
			};
			animationFrameRef = requestAnimationFrame(raf);

			lenisRef = lenis;
			return lenis;
		} else {
			const scroller = scrollerRef;
			if (!scroller) {
				console.error("Scroller ref not found");
				return;
			}

			const lenis = new Lenis({
				wrapper: scroller,
				content: scroller.querySelector(".scroll-stack-inner") as HTMLElement,
				duration: 1.2,
				easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				smoothWheel: true,
				touchMultiplier: 2,
				infinite: false,
				gestureOrientation: "vertical",
				wheelMultiplier: 1,
				lerp: 0.1,
				syncTouch: true,
				syncTouchLerp: 0.075,
			});

			lenis.on("scroll", handleScroll);

			const raf = (time: number) => {
				lenis.raf(time);
				animationFrameRef = requestAnimationFrame(raf);
			};
			animationFrameRef = requestAnimationFrame(raf);

			lenisRef = lenis;
			return lenis;
		}
	};

	onMount(() => {
		console.log("[ScrollStack] mounted");
		const scroller = scrollerRef;
		if (!scroller) {
			console.error("Scroller ref not initialized");
			return;
		}

		const cards = Array.from(useWindowScroll ? document.querySelectorAll(".scroll-stack-card") : scroller.querySelectorAll(".scroll-stack-card")) as HTMLElement[];

		cardsRef = cards;
		const transformsCache = lastTransformsRef;

		cards.forEach((card, i) => {
			if (i < cards.length - 1) card.style.marginBottom = `${itemDistance}px`;
			card.style.willChange = "transform, opacity";
			card.style.transformOrigin = "top center";
			card.style.backfaceVisibility = "hidden";
			card.style.transform = "translateZ(0)";
			card.dataset.index = String(i);
		});

		setupLenis();
		updateCardTransforms();
		loop(); // start RAF loop

		console.log("Initial cards:", cardsRef.length);

		onCleanup(() => {
			if (animationFrameRef) cancelAnimationFrame(animationFrameRef);
			if (lenisRef) lenisRef.destroy?.();
			stackCompletedRef = false;
			cardsRef = [];
			transformsCache.clear();
			isUpdatingRef = false;
		});
	});

	const resolvedChildren = children(() => childrenProp);
	console.log("[ScrollStack] about to return JSX");
	return (
		<div class={`scroll-stack-scroller ${className}`.trim()} ref={(el) => (scrollerRef = el as HTMLDivElement)}>
			<div class="scroll-stack-inner">
				{resolvedChildren()}
				<div class="scroll-stack-end" />
			</div>
		</div>
	);
};

export default ScrollStack;
