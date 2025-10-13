import { JSX, For, onCleanup, onMount, createSignal } from "solid-js";
import { gsap } from "gsap";
import { Grid } from "@suid/material";
import "./MagicBento.css";

export interface BentoCardProps {
	color?: string;
	title?: string;
	description?: string;
	label?: string;
	textAutoHide?: boolean;
	disableAnimations?: boolean;
}

export interface BentoProps {
	textAutoHide?: boolean;
	enableStars?: boolean;
	enableSpotlight?: boolean;
	enableBorderGlow?: boolean;
	disableAnimations?: boolean;
	spotlightRadius?: number;
	particleCount?: number;
	enableTilt?: boolean;
	glowColor?: string;
	clickEffect?: boolean;
	enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "132, 0, 255";
const MOBILE_BREAKPOINT = 768;

const cardData: BentoCardProps[] = [
	{
		color: "#060010",
		title: "Smart Contracts",
		description: "on-chian guarantees for you and your users.",
		label: "Development",
	},
	{
		color: "#060010",
		title: "Audits",
		description: "Verify your code against expereinced developers.",
		label: "Development",
	},
	{
		color: "#060010",
		title: "Off chain solutions",
		description: "Where the magic happens; everything starts with a transactions.",
		label: "Consulting",
	},
	{
		color: "#060010",
		title: "Community",
		description: "The heart if decentralized protocols; having a strong one is a priority",
		label: "Efficiency",
	},
	{
		color: "#060010",
		title: "dApps",
		description: "Leading by example.",
		label: "Decentralization",
	},
	{
		color: "#060010",
		title: "Documentation",
		description: "Let your target user know how to use what you build!",
		label: "Consulting",
	},
];

// Helpers
const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
	const el = document.createElement("div");
	el.className = "particle";
	el.style.cssText = `
		position:absolute;width:4px;height:4px;border-radius:50%;
		background:rgba(${color},1);
		box-shadow:0 0 6px rgba(${color},0.6);
		pointer-events:none;z-index:100;
		left:${x}px;top:${y}px;
	`;
	return el;
};

const calculateSpotlightValues = (radius: number) => ({
	proximity: radius * 0.5,
	fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
	const rect = card.getBoundingClientRect();
	const relativeX = ((mouseX - rect.left) / rect.width) * 100;
	const relativeY = ((mouseY - rect.top) / rect.height) * 100;
	card.style.setProperty("--glow-x", `${relativeX}%`);
	card.style.setProperty("--glow-y", `${relativeY}%`);
	card.style.setProperty("--glow-intensity", glow.toString());
	card.style.setProperty("--glow-radius", `${radius}px`);
};

// ParticleCard (Solid)
interface ParticleCardProps {
	children: JSX.Element;
	className?: string;
	disableAnimations?: boolean;
	style?: JSX.CSSProperties;
	particleCount?: number;
	glowColor?: string;
	enableTilt?: boolean;
	clickEffect?: boolean;
	enableMagnetism?: boolean;
}
const ParticleCard = (props: ParticleCardProps) => {
	let cardRef: HTMLDivElement | undefined;
	const particlesRef: HTMLDivElement[] = [];
	let timeouts: number[] = [];
	let isHovered = false;
	let particlesInitialized = false;
	let memoParticles: HTMLDivElement[] = [];
	let magnetismTween: gsap.core.Tween | null = null;

	const initializeParticles = () => {
		if (particlesInitialized || !cardRef) return;
		const { width, height } = cardRef.getBoundingClientRect();
		memoParticles = Array.from({ length: props.particleCount ?? DEFAULT_PARTICLE_COUNT }, () =>
			createParticleElement(Math.random() * width, Math.random() * height, props.glowColor || DEFAULT_GLOW_COLOR),
		);
		particlesInitialized = true;
	};

	const clearParticles = () => {
		timeouts.forEach(clearTimeout);
		timeouts = [];
		magnetismTween?.kill();
		particlesRef.forEach((p) => {
			gsap.to(p, {
				scale: 0,
				opacity: 0,
				duration: 0.3,
				ease: "back.in(1.7)",
				onComplete: () => {
					p.parentNode?.removeChild(p);
				},
			});
		});
		particlesRef.length = 0;
	};

	const animateParticles = () => {
		if (!cardRef || !isHovered) return;
		if (!particlesInitialized) initializeParticles();
		memoParticles.forEach((particle, idx) => {
			const id = window.setTimeout(() => {
				if (!isHovered || !cardRef) return;
				const clone = particle.cloneNode(true) as HTMLDivElement;
				cardRef.appendChild(clone);
				particlesRef.push(clone);
				gsap.fromTo(
					clone,
					{ scale: 0, opacity: 0 },
					{
						scale: 1,
						opacity: 1,
						duration: 0.3,
						ease: "back.out(1.7)",
					},
				);
				gsap.to(clone, {
					x: (Math.random() - 0.5) * 100,
					y: (Math.random() - 0.5) * 100,
					rotation: Math.random() * 360,
					duration: 2 + Math.random() * 2,
					ease: "none",
					repeat: -1,
					yoyo: true,
				});
				gsap.to(clone, {
					opacity: 0.3,
					duration: 1.5,
					ease: "power2.inOut",
					repeat: -1,
					yoyo: true,
				});
			}, idx * 100);
			timeouts.push(id);
		});
	};

	onMount(() => {
		if (props.disableAnimations || !cardRef) return;
		const enter = () => {
			isHovered = true;
			animateParticles();
			if (props.enableTilt) {
				gsap.to(cardRef!, {
					rotateX: 5,
					rotateY: 5,
					duration: 0.3,
					ease: "power2.out",
					transformPerspective: 1000,
				});
			}
		};
		const leave = () => {
			isHovered = false;
			clearParticles();
			if (props.enableTilt) {
				gsap.to(cardRef!, {
					rotateX: 0,
					rotateY: 0,
					duration: 0.3,
					ease: "power2.out",
				});
			}
			if (props.enableMagnetism) {
				gsap.to(cardRef!, {
					x: 0,
					y: 0,
					duration: 0.3,
					ease: "power2.out",
				});
			}
		};
		const move = (e: MouseEvent) => {
			if (!props.enableTilt && !props.enableMagnetism) return;
			const rect = cardRef!.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const cx = rect.width / 2;
			const cy = rect.height / 2;
			if (props.enableTilt) {
				gsap.to(cardRef!, {
					rotateX: ((y - cy) / cy) * -10,
					rotateY: ((x - cx) / cx) * 10,
					duration: 0.1,
					ease: "power2.out",
					transformPerspective: 1000,
				});
			}
			if (props.enableMagnetism) {
				magnetismTween = gsap.to(cardRef!, {
					x: (x - cx) * 0.05,
					y: (y - cy) * 0.05,
					duration: 0.3,
					ease: "power2.out",
				});
			}
		};
		const click = (e: MouseEvent) => {
			if (!props.clickEffect) return;
			const rect = cardRef!.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			const maxDistance = Math.max(Math.hypot(x, y), Math.hypot(x - rect.width, y), Math.hypot(x, y - rect.height), Math.hypot(x - rect.width, y - rect.height));
			const ripple = document.createElement("div");
			ripple.style.cssText = `
				position:absolute;
				width:${maxDistance * 2}px;
				height:${maxDistance * 2}px;
				border-radius:50%;
				background:radial-gradient(circle,rgba(${props.glowColor || DEFAULT_GLOW_COLOR},0.4) 0%,rgba(${props.glowColor || DEFAULT_GLOW_COLOR},0.2) 30%,transparent 70%);
				left:${x - maxDistance}px;
				top:${y - maxDistance}px;
				pointer-events:none;
				z-index:1000;
			`;
			cardRef!.appendChild(ripple);
			gsap.fromTo(
				ripple,
				{ scale: 0, opacity: 1 },
				{
					scale: 1,
					opacity: 0,
					duration: 0.8,
					ease: "power2.out",
					onComplete: () => ripple.remove(),
				},
			);
		};
		cardRef.addEventListener("mouseenter", enter);
		cardRef.addEventListener("mouseleave", leave);
		cardRef.addEventListener("mousemove", move);
		cardRef.addEventListener("click", click);

		onCleanup(() => {
			isHovered = false;
			cardRef?.removeEventListener("mouseenter", enter);
			cardRef?.removeEventListener("mouseleave", leave);
			cardRef?.removeEventListener("mousemove", move);
			cardRef?.removeEventListener("click", click);
			clearParticles();
		});
	});

	return (
		<div ref={cardRef} class={`${props.className || ""} particle-container`} style={{ position: "relative", overflow: "hidden", ...props.style }}>
			{props.children}
		</div>
	);
};

// GlobalSpotlight
const GlobalSpotlight = (props: { gridEl: () => HTMLDivElement | undefined; disableAnimations?: boolean; enabled?: boolean; spotlightRadius?: number; glowColor?: string }) => {
	let spotlightEl: HTMLDivElement | null = null;
	const enabled = props.enabled !== false;
	onMount(() => {
		if (props.disableAnimations || !enabled) return;
		spotlightEl = document.createElement("div");
		spotlightEl.className = "global-spotlight";
		spotlightEl.style.cssText = `
			position:fixed;width:800px;height:800px;border-radius:50%;pointer-events:none;
			background:radial-gradient(circle,
				rgba(${props.glowColor || DEFAULT_GLOW_COLOR},0.15) 0%,
				rgba(${props.glowColor || DEFAULT_GLOW_COLOR},0.08) 15%,
				rgba(${props.glowColor || DEFAULT_GLOW_COLOR},0.04) 25%,
				rgba(${props.glowColor || DEFAULT_GLOW_COLOR},0.02) 40%,
				rgba(${props.glowColor || DEFAULT_GLOW_COLOR},0.01) 65%,
				transparent 70%);
			z-index:200;opacity:0;transform:translate(-50%,-50%);mix-blend-mode:screen;
		`;
		document.body.appendChild(spotlightEl);

		const handleMove = (e: MouseEvent) => {
			const grid = props.gridEl();
			if (!spotlightEl || !grid) return;
			const section = grid.closest(".mb-bento-section");
			const rect = section?.getBoundingClientRect();
			const inside = rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
			const cards = grid.querySelectorAll(".mb-card");

			if (!inside) {
				gsap.to(spotlightEl, {
					opacity: 0,
					duration: 0.3,
					ease: "power2.out",
				});
				cards.forEach((c) => (c as HTMLElement).style.setProperty("--glow-intensity", "0"));
				return;
			}

			const radius = props.spotlightRadius || DEFAULT_SPOTLIGHT_RADIUS;
			const { proximity, fadeDistance } = calculateSpotlightValues(radius);
			let minDist = Infinity;
			cards.forEach((c) => {
				const ce = c as HTMLElement;
				const r = ce.getBoundingClientRect();
				const cx = r.left + r.width / 2;
				const cy = r.top + r.height / 2;
				const dist = Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(r.width, r.height) / 2;
				const eff = Math.max(0, dist);
				minDist = Math.min(minDist, eff);
				let glowIntensity = 0;
				if (eff <= proximity) glowIntensity = 1;
				else if (eff <= fadeDistance) glowIntensity = (fadeDistance - eff) / (fadeDistance - proximity);
				updateCardGlowProperties(ce, e.clientX, e.clientY, glowIntensity, radius);
			});

			gsap.to(spotlightEl, {
				left: e.clientX,
				top: e.clientY,
				duration: 0.1,
				ease: "power2.out",
			});
			const targetOpacity = minDist <= proximity ? 0.8 : minDist <= fadeDistance ? ((fadeDistance - minDist) / (fadeDistance - proximity)) * 0.8 : 0;
			gsap.to(spotlightEl, {
				opacity: targetOpacity,
				duration: targetOpacity > 0 ? 0.2 : 0.5,
				ease: "power2.out",
			});
		};

		const leave = () => {
			const grid = props.gridEl();
			if (!spotlightEl || !grid) return;
			grid.querySelectorAll(".mb-card").forEach((c) => (c as HTMLElement).style.setProperty("--glow-intensity", "0"));
			gsap.to(spotlightEl, {
				opacity: 0,
				duration: 0.3,
				ease: "power2.out",
			});
		};

		document.addEventListener("mousemove", handleMove);
		document.addEventListener("mouseleave", leave);
		onCleanup(() => {
			document.removeEventListener("mousemove", handleMove);
			document.removeEventListener("mouseleave", leave);
			spotlightEl?.remove();
		});
	});
	return null;
};

// Mobile detect
const useIsMobile = () => {
	const [isMobile, setIsMobile] = createSignal(false);
	onMount(() => {
		const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
		check();
		window.addEventListener("resize", check);
		onCleanup(() => window.removeEventListener("resize", check));
	});
	return isMobile;
};

const MagicBento = (props: BentoProps): JSX.Element => {
	const {
		textAutoHide = true,
		enableStars = true,
		enableSpotlight = true,
		enableBorderGlow = true,
		disableAnimations = false,
		spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
		particleCount = DEFAULT_PARTICLE_COUNT,
		enableTilt = false,
		glowColor = DEFAULT_GLOW_COLOR,
		clickEffect = true,
		enableMagnetism = true,
	} = props;

	let gridRef: HTMLDivElement | undefined;
	const isMobile = useIsMobile();
	const animationsDisabled = () => disableAnimations || isMobile();

	return (
		<>
			{enableSpotlight && (
				<GlobalSpotlight
					gridEl={() => gridRef}
					disableAnimations={animationsDisabled()}
					enabled={enableSpotlight}
					spotlightRadius={spotlightRadius}
					glowColor={glowColor}
				/>
			)}
			<div ref={gridRef} class="mb-card-grid mb-bento-section">
				<For each={cardData}>
					{(card) => {
						const baseClass =
							"mb-card " +
							(textAutoHide ? "mb-card--text-autohide " : "") +
							(enableBorderGlow ? "mb-card--border-glow " : "");
						const style = {
							"background-color": card.color,
							"--glow-color": glowColor
						} as JSX.CSSProperties;

						return enableStars ? (
							<ParticleCard
								className={baseClass}
								style={style}
								disableAnimations={animationsDisabled()}
								particleCount={particleCount}
								glowColor={glowColor}
								enableTilt={enableTilt}
								clickEffect={clickEffect}
								enableMagnetism={enableMagnetism}
							>
								<div class="mb-card__header">
									<div class="mb-card__label">{card.label}</div>
								</div>
								<div class="mb-card__content mb-card__content--tight">
									<h2 class="mb-card__title">{card.title}</h2>
									<p class="mb-card__description">{card.description}</p>
								</div>
							</ParticleCard>
						) : (
							<div class={baseClass} style={style}>
								<div class="mb-card__header">
									<div class="mb-card__label">{card.label}</div>
								</div>
								<div class="mb-card__content mb-card__content--tight">
									<h2 class="mb-card__title">{card.title}</h2>
									<p class="mb-card__description">{card.description}</p>
								</div>
							</div>
						);
					}}
				</For>
			</div>
		</>
	);
};

export default MagicBento;
