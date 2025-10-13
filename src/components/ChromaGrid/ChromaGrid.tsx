import { createSignal, onMount, JSX } from "solid-js";
import { gsap } from "gsap";
import "./ChromaGrid.css";

export interface ChromaItem {
	image: string;
	title: string;
	subtitle: string;
	handle?: string;
	location?: string;
	borderColor?: string;
	gradient?: string;
	url?: string;
}

export interface ChromaGridProps {
	items?: ChromaItem[];
	className?: string;
	radius?: number;
	columns?: number;
	rows?: number;
	damping?: number;
	fadeOut?: number;
	ease?: string;
}

export const ChromaGrid = (props: ChromaGridProps): JSX.Element => {
	const { items = [], className = "", radius = 300, columns = 3, rows = 2, damping = 0.45, fadeOut = 0.6, ease = "power3.out" } = props;

	let rootRef: HTMLDivElement | undefined;
	let fadeRef: HTMLDivElement | undefined;
	let setX: ((v: number) => void) | undefined;
	let setY: ((v: number) => void) | undefined;
	const [pos, setPos] = createSignal({ x: 0, y: 0 });

	const demo: ChromaItem[] = [];
	const data = items?.length ? items : demo;

	onMount(() => {
		const el = rootRef;
		if (!el) return;
		setX = gsap.quickSetter(el, "--x", "px") as (v: number) => void;
		setY = gsap.quickSetter(el, "--y", "px") as (v: number) => void;
		const { width, height } = el.getBoundingClientRect();
		setPos({ x: width / 2, y: height / 2 });
		setX(pos().x);
		setY(pos().y);
	});

	const moveTo = (x: number, y: number) => {
		const currentPos = pos();
		gsap.to(currentPos, {
			x,
			y,
			duration: damping,
			ease,
			onUpdate: () => {
				setX?.(currentPos.x);
				setY?.(currentPos.y);
				setPos({ x: currentPos.x, y: currentPos.y });
			},
			overwrite: true,
		});
	};

	const handleMove = (e: PointerEvent) => {
		const r = rootRef!.getBoundingClientRect();
		moveTo(e.clientX - r.left, e.clientY - r.top);
		if (fadeRef) {
			gsap.to(fadeRef, { opacity: 0, duration: 0.25, overwrite: true });
		}
	};

	const handleLeave = () => {
		if (fadeRef) {
			gsap.to(fadeRef, {
				opacity: 1,
				duration: fadeOut,
				overwrite: true,
			});
		}
	};

	const handleCardClick = (url?: string) => {
		if (url) {
			window.open(url, "_blank", "noopener,noreferrer");
		}
	};

	const handleCardMove = (e: MouseEvent) => {
		const card = e.currentTarget as HTMLElement;
		const rect = card.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		card.style.setProperty("--mouse-x", `${x}px`);
		card.style.setProperty("--mouse-y", `${y}px`);
	};

	return (
		<div
			ref={rootRef}
			class={`chroma-grid ${className}`}
			style={{
				"--r": `${radius}px`,
				"--cols": columns,
				"--rows": rows,
				"text-align": "center",
			}}
			onPointerMove={handleMove}
			onPointerLeave={handleLeave}
		>
			<div class="chroma-cards">
				{data.map((c) => (
					<article
						class="chroma-card"
						onMouseMove={handleCardMove}
						onClick={() => handleCardClick(c.url)}
						style={{
							"--card-border": c.borderColor || "transparent",
							"--card-gradient": c.gradient,
						}}
					>
						<div class="chroma-img-wrapper">
							<img src={c.image} alt={c.title} loading="lazy" />
						</div>
						<footer class="chroma-info">
							<h3 class="name">{c.title}</h3>
							{c.handle && <span class="handle">{c.handle}</span>}
							<p class="role">{c.subtitle}</p>
							{c.location && <span class="location">{c.location}</span>}
						</footer>
					</article>
				))}
			</div>
			<div class="chroma-overlay" />
			<div ref={fadeRef} class="chroma-fade" />
		</div>
	);
};

export default ChromaGrid;
