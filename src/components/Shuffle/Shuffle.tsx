import { Component, createSignal, createEffect, onMount, onCleanup, Accessor } from "solid-js";
import { Dynamic } from "solid-js/web";
import { Renderer, Program, Mesh, Triangle, Vec2, Vec3 } from "ogl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import "./Shuffle.css";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText);

export interface ShuffleProps {
	text: string;
	className?: string;
	style?: Record<string, string | number>;
	shuffleDirection?: "left" | "right";
	duration?: number;
	maxDelay?: number;
	ease?: string | ((t: number) => number);
	threshold?: number;
	rootMargin?: string;
	tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
	textAlign?: "left" | "center" | "right" | "justify";
	onShuffleComplete?: () => void;
	shuffleTimes?: number;
	animationMode?: "random" | "evenodd";
	loop?: boolean;
	loopDelay?: number;
	stagger?: number;
	scrambleCharset?: string;
	colorFrom?: string;
	colorTo?: string;
	triggerOnce?: boolean;
	respectReducedMotion?: boolean;
	triggerOnHover?: boolean;
}

const Shuffle: Component<ShuffleProps> = (props) => {
	let ref!: HTMLElement;
	const [fontsLoaded, setFontsLoaded] = createSignal(false);
	const [ready, setReady] = createSignal(false);

	let splitRef: GSAPSplitText | null = null;
	let wrappersRef: HTMLElement[] = [];
	let tlRef: gsap.core.Timeline | null = null;
	let playingRef = false;
	let hoverHandlerRef: ((e: Event) => void) | null = null;

	createEffect(() => {
		if ("fonts" in document) {
			if (document.fonts.status === "loaded") setFontsLoaded(true);
			else document.fonts.ready.then(() => setFontsLoaded(true));
		} else setFontsLoaded(true);
	});

	const build = () => {
		if (!ref || !props.text || !fontsLoaded()) return;

		const teardown = () => {
			tlRef?.kill();
			tlRef = null;
			wrappersRef.forEach((wrap) => {
				const inner = wrap.firstElementChild as HTMLDivElement | null;
				const orig = inner?.querySelector('[data-orig="1"]') as HTMLDivElement | null;
				if (orig && wrap.parentNode) wrap.parentNode.replaceChild(orig, wrap);
			});
			wrappersRef = [];
			splitRef?.revert();
			splitRef = null;
			playingRef = false;
		};

		teardown();

		splitRef = new GSAPSplitText(ref, {
			type: "chars",
			charsClass: "shuffle-char",
			wordsClass: "shuffle-word",
			linesClass: "shuffle-line",
			smartWrap: true,
			reduceWhiteSpace: false,
		});

		const chars = (splitRef.chars || []) as HTMLDivElement[];
		wrappersRef = [];

		const rolls = Math.max(1, Math.floor(props.shuffleTimes ?? 1));
		const rand = (set: string) => set.charAt(Math.floor(Math.random() * set.length)) || "";

		chars.forEach((ch) => {
			const parent = ch.parentElement;
			if (!parent) return;

			const w = ch.getBoundingClientRect().width;
			if (!w) return;

			const wrap = document.createElement("span");
			Object.assign(wrap.style, {
				display: "inline-block",
				overflow: "hidden",
				width: w + "px",
				verticalAlign: "baseline",
			});

			const inner = document.createElement("span");
			Object.assign(inner.style, {
				display: "inline-block",
				whiteSpace: "nowrap",
				willChange: "transform",
			});

			parent.insertBefore(wrap, ch);
			wrap.appendChild(inner);

			const firstOrig = ch.cloneNode(true) as HTMLDivElement;
			Object.assign(firstOrig.style, {
				display: "inline-block",
				width: w + "px",
				textAlign: "center",
			});

			ch.setAttribute("data-orig", "1");
			Object.assign(ch.style, {
				display: "inline-block",
				width: w + "px",
				textAlign: "center",
			});

			inner.appendChild(firstOrig);
			for (let k = 0; k < rolls; k++) {
				const c = ch.cloneNode(true) as HTMLDivElement;
				if (props.scrambleCharset) c.textContent = rand(props.scrambleCharset);
				Object.assign(c.style, {
					display: "inline-block",
					width: w + "px",
					textAlign: "center",
				});
				inner.appendChild(c);
			}
			inner.appendChild(ch);

			const steps = rolls + 1;
			let startX = 0;
			let finalX = -steps * w;
			if (props.shuffleDirection === "right") {
				const firstCopy = inner.firstElementChild as HTMLDivElement | null;
				const real = inner.lastElementChild as HTMLDivElement | null;
				if (real) inner.insertBefore(real, inner.firstChild);
				if (firstCopy) inner.appendChild(firstCopy);
				startX = -steps * w;
				finalX = 0;
			}

			gsap.set(inner, { x: startX, force3D: true });
			if (props.colorFrom) (inner.style as any).color = props.colorFrom;

			inner.setAttribute("data-final-x", String(finalX));
			inner.setAttribute("data-start-x", String(startX));

			wrappersRef.push(wrap);
		});
	};

	const inners = () => wrappersRef.map((w) => w.firstElementChild as HTMLDivElement);

	const randomizeScrambles = () => {
		const charset = props.scrambleCharset;
		if (!charset) return;
		wrappersRef.forEach((w) => {
			const strip = w.firstElementChild as HTMLDivElement;
			if (!strip) return;
			const kids = Array.from(strip.children) as HTMLDivElement[];
			for (let i = 1; i < kids.length - 1; i++) {
				kids[i].textContent = charset.charAt(Math.floor(Math.random() * charset.length));
			}
		});
	};

	const cleanupToStill = () => {
		wrappersRef.forEach((w) => {
			const strip = w.firstElementChild as HTMLDivElement;
			if (!strip) return;
			const real = strip.querySelector('[data-orig="1"]') as HTMLDivElement | null;
			if (!real) return;
			strip.replaceChildren(real);
			strip.style.transform = "none";
			strip.style.willChange = "auto";
		});
	};

	const play = () => {
		const strips = inners();
		if (!strips.length) return;

		playingRef = true;

		const tl = gsap.timeline({
			smoothChildTiming: true,
			repeat: props.loop ? -1 : 0,
			repeatDelay: props.loop ? (props.loopDelay ?? 0) : 0,
			onRepeat: () => {
				if (props.scrambleCharset) randomizeScrambles();
				gsap.set(strips, {
					x: (i, t: HTMLDivElement) => parseFloat(t.getAttribute("data-start-x") || "0"),
				});
				props.onShuffleComplete?.();
			},
			onComplete: () => {
				playingRef = false;
				if (!props.loop) {
					cleanupToStill();
					if (props.colorTo) gsap.set(strips, { color: props.colorTo });
					props.onShuffleComplete?.();
					armHover();
				}
			},
		});

		const addTween = (targets: HTMLDivElement[], at: number) => {
			tl.to(
				targets,
				{
					x: (i, t: HTMLDivElement) => parseFloat(t.getAttribute("data-final-x") || "0"),
					duration: props.duration ?? 0.35,
					ease: props.ease ?? "power3.out",
					force3D: true,
					stagger: props.animationMode === "evenodd" ? (props.stagger ?? 0.03) : 0,
				},
				at,
			);
			if (props.colorFrom && props.colorTo) {
				tl.to(
					targets,
					{
						color: props.colorTo,
						duration: props.duration ?? 0.35,
						ease: props.ease ?? "power3.out",
					},
					at,
				);
			}
		};

		if (props.animationMode === "evenodd") {
			const odd = strips.filter((_, i) => i % 2 === 1);
			const even = strips.filter((_, i) => i % 2 === 0);
			const oddTotal = (props.duration ?? 0.35) + Math.max(0, odd.length - 1) * (props.stagger ?? 0.03);
			const evenStart = odd.length ? oddTotal * 0.7 : 0;
			if (odd.length) addTween(odd, 0);
			if (even.length) addTween(even, evenStart);
		} else {
			strips.forEach((strip) => {
				const d = Math.random() * (props.maxDelay ?? 0);
				tl.to(
					strip,
					{
						x: parseFloat(strip.getAttribute("data-final-x") || "0"),
						duration: props.duration ?? 0.35,
						ease: props.ease ?? "power3.out",
						force3D: true,
					},
					d,
				);
				if (props.colorFrom && props.colorTo)
					tl.fromTo(
						strip,
						{ color: props.colorFrom },
						{
							color: props.colorTo,
							duration: props.duration ?? 0.35,
							ease: props.ease ?? "power3.out",
						},
						d,
					);
			});
		}

		tlRef = tl;
	};

	const armHover = () => {
		if (!props.triggerOnHover || !ref) return;
		const removeHover = () => {
			if (hoverHandlerRef && ref) {
				ref.removeEventListener("mouseenter", hoverHandlerRef);
				hoverHandlerRef = null;
			}
		};
		removeHover();
		const handler = () => {
			if (playingRef) return;
			build();
			if (props.scrambleCharset) randomizeScrambles();
			play();
		};
		hoverHandlerRef = handler;
		ref.addEventListener("mouseenter", handler);
	};

	const create = () => {
		build();
		if (props.scrambleCharset) randomizeScrambles();
		play();
		armHover();
		setReady(true);
	};

	onMount(() => {
		if (props.respectReducedMotion && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			props.onShuffleComplete?.();
			return;
		}

		const el = ref;
		const startPct = (1 - (props.threshold ?? 0.1)) * 100;
		const mm = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(props.rootMargin || "-100px");
		const mv = mm ? parseFloat(mm[1]) : 0;
		const mu = mm ? mm[2] || "px" : "px";
		const sign = mv === 0 ? "" : mv < 0 ? `-=${Math.abs(mv)}${mu}` : `+=${mv}${mu}`;
		const start = `top ${startPct}%${sign}`;

		const st = ScrollTrigger.create({
			trigger: el,
			start,
			once: props.triggerOnce ?? true,
			onEnter: create,
		});

		onCleanup(() => {
			st.kill();
			armHover();
			if (tlRef) {
				tlRef.kill();
				tlRef = null;
			}
			if (wrappersRef.length) {
				wrappersRef.forEach((wrap) => {
					const inner = wrap.firstElementChild as HTMLDivElement | null;
					const orig = inner?.querySelector('[data-orig="1"]') as HTMLDivElement | null;
					if (orig && wrap.parentNode) wrap.parentNode.replaceChild(orig, wrap);
				});
				wrappersRef = [];
			}
			try {
				splitRef?.revert();
			} catch {}
			splitRef = null;
			playingRef = false;
		});
	});

	const commonStyle: Record<string, string | number> = {
		textAlign: props.textAlign ?? "center",
		...props.style,
	};
	const classes = `shuffle-parent ${ready() ? "is-ready" : ""} ${props.className ?? ""}`;
	const Tag = (props.tag ?? "p") as "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

	return (
		<Dynamic component={Tag} ref={(el: HTMLElement) => (ref = el as HTMLElement)} class={classes} style={commonStyle}>
			{props.text}
		</Dynamic>
	);
};

export default Shuffle;
