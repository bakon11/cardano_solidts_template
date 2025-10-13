import { onMount, onCleanup, createMemo, JSX, Accessor, createEffect } from "solid-js";
import "./ProfileCard.css";

interface ProfileCardProps {
	avatarUrl: string;
	iconUrl?: string;
	grainUrl?: string;
	behindGradient?: string;
	innerGradient?: string;
	showBehindGradient?: boolean;
	className?: string;
	enableTilt?: boolean;
	enableMobileTilt?: boolean;
	mobileTiltSensitivity?: number;
	miniAvatarUrl?: string;
	name?: string;
	title?: string;
	handle?: string;
	status?: string;
	contactText?: string;
	showUserInfo?: boolean;
	onContactClick?: () => void;
}

const DEFAULT_BEHIND_GRADIENT =
	"radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,100%,90%,var(--card-opacity)) 4%,hsla(266,50%,80%,calc(var(--card-opacity)*0.75)) 10%,hsla(266,25%,70%,calc(var(--card-opacity)*0.5)) 50%,hsla(266,0%,60%,0) 100%),radial-gradient(35% 52% at 55% 20%,#00ffaac4 0%,#073aff00 100%),radial-gradient(100% 100% at 50% 50%,#00c1ffff 1%,#073aff00 76%),conic-gradient(from 124deg at 50% 50%,#c137ffff 0%,#07c6ffff 40%,#07c6ffff 60%,#c137ffff 100%)";

const DEFAULT_INNER_GRADIENT = "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)";

const ANIMATION_CONFIG = {
	SMOOTH_DURATION: 600,
	INITIAL_DURATION: 1500,
	INITIAL_X_OFFSET: 70,
	INITIAL_Y_OFFSET: 60,
	DEVICE_BETA_OFFSET: 20,
} as const;

const clamp = (value: number, min = 0, max = 100): number => Math.min(Math.max(value, min), max);
const round = (value: number, precision = 3): number => parseFloat(value.toFixed(precision));
const adjust = (value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number => round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));
const easeInOutCubic = (x: number): number => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

interface AnimationHandlers {
	updateCardTransform: (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => void;
	createSmoothAnimation: (duration: number, startX: number, startY: number, card: HTMLElement, wrap: HTMLElement) => void;
	cancelAnimation: () => void;
}

const ProfileCard = (props: ProfileCardProps) => {
	// Defaults
	const {
		avatarUrl = "",
		iconUrl = "",
		grainUrl = "",
		behindGradient,
		innerGradient,
		showBehindGradient = true,
		className = "",
		enableTilt = true,
		enableMobileTilt = false,
		mobileTiltSensitivity = 5,
		miniAvatarUrl = "",
		name = "",
		title = "",
		handle = "",
		status = "",
		contactText = "",
		showUserInfo = true,
		onContactClick,
	} = props;

	let wrapRef!: HTMLDivElement;
	let cardRef!: HTMLDivElement;

	// Animation handlers (recreated if enableTilt changes)
	let rafId: number | null = null;

	const animationHandlers: Accessor<AnimationHandlers | null> = createMemo(() => {
		if (!enableTilt) return null;

		const updateCardTransform = (offsetX: number, offsetY: number, card: HTMLElement, wrap: HTMLElement) => {
			const width = card.clientWidth;
			const height = card.clientHeight;
			const percentX = clamp((100 / width) * offsetX);
			const percentY = clamp((100 / height) * offsetY);
			const centerX = percentX - 50;
			const centerY = percentY - 50;

			const properties: Record<string, string> = {
				"--pointer-x": `${percentX}%`,
				"--pointer-y": `${percentY}%`,
				"--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
				"--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
				"--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
				"--pointer-from-top": `${percentY / 100}`,
				"--pointer-from-left": `${percentX / 100}`,
				"--rotate-x": `${round(-(centerX / 5))}deg`,
				"--rotate-y": `${round(centerY / 4)}deg`,
			};
			for (const [k, v] of Object.entries(properties)) {
				wrap.style.setProperty(k, v);
			}
		};

		const createSmoothAnimation = (duration: number, startX: number, startY: number, card: HTMLElement, wrap: HTMLElement) => {
			const startTime = performance.now();
			const targetX = wrap.clientWidth / 2;
			const targetY = wrap.clientHeight / 2;
			const animationLoop = (currentTime: number) => {
				const elapsed = currentTime - startTime;
				const progress = clamp(elapsed / duration);
				const eased = easeInOutCubic(progress);
				const currentX = adjust(eased, 0, 1, startX, targetX);
				const currentY = adjust(eased, 0, 1, startY, targetY);
				updateCardTransform(currentX, currentY, card, wrap);
				if (progress < 1) {
					rafId = requestAnimationFrame(animationLoop);
				}
			};
			rafId = requestAnimationFrame(animationLoop);
		};

		const cancelAnimation = () => {
			if (rafId) {
				cancelAnimationFrame(rafId);
				rafId = null;
			}
		};

		return {
			updateCardTransform,
			createSmoothAnimation,
			cancelAnimation,
		};
	});

	// Event handlers
	const handlePointerMove = (event: PointerEvent) => {
		const card = cardRef;
		const wrap = wrapRef;
		const ah = animationHandlers();
		if (!card || !wrap || !ah) return;
		const rect = card.getBoundingClientRect();
		ah.updateCardTransform(event.clientX - rect.left, event.clientY - rect.top, card, wrap);
	};

	const handlePointerEnter = () => {
		const card = cardRef;
		const wrap = wrapRef;
		const ah = animationHandlers();
		if (!card || !wrap || !ah) return;
		ah.cancelAnimation();
		wrap.classList.add("active");
		card.classList.add("active");
	};

	const handlePointerLeave = (event: PointerEvent) => {
		const card = cardRef;
		const wrap = wrapRef;
		const ah = animationHandlers();
		if (!card || !wrap || !ah) return;
		ah.createSmoothAnimation(ANIMATION_CONFIG.SMOOTH_DURATION, event.offsetX, event.offsetY, card, wrap);
		wrap.classList.remove("active");
		card.classList.remove("active");
	};

	const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
		const card = cardRef;
		const wrap = wrapRef;
		const ah = animationHandlers();
		if (!card || !wrap || !ah) return;
		const { beta, gamma } = event;
		if (beta == null || gamma == null) return;
		ah.updateCardTransform(card.clientHeight / 2 + gamma * mobileTiltSensitivity, card.clientWidth / 2 + (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity, card, wrap);
	};

	const requestOrientationPermission = () => {
		if (!enableMobileTilt || location.protocol !== "https:") return;
		const anyMotion = (window as any).DeviceMotionEvent;
		const handler = (e: DeviceOrientationEvent) => handleDeviceOrientation(e);
		if (anyMotion && typeof anyMotion.requestPermission === "function") {
			anyMotion
				.requestPermission()
				.then((state: string) => {
					if (state === "granted") {
						window.addEventListener("deviceorientation", handler);
					}
				})
				.catch(console.error);
		} else {
			window.addEventListener("deviceorientation", handler);
		}
	};

	// Style
	const cardStyle = createMemo<JSX.CSSProperties>(
		() =>
			({
				"--icon": iconUrl ? `url(${iconUrl})` : "none",
				"--grain": grainUrl ? `url(${grainUrl})` : "none",
				"--behind-gradient": showBehindGradient ? behindGradient || DEFAULT_BEHIND_GRADIENT : "none",
				"--inner-gradient": innerGradient || DEFAULT_INNER_GRADIENT,
			}) as JSX.CSSProperties,
	);

	// Setup events & initial animation
	onMount(() => {
		const ah = animationHandlers();
		if (!enableTilt || !ah) return;
		const card = cardRef;
		const wrap = wrapRef;
		if (!card || !wrap) return;

		const pointerEnter = (e: Event) => handlePointerEnter();
		const pointerMove = (e: Event) => handlePointerMove(e as PointerEvent);
		const pointerLeave = (e: Event) => handlePointerLeave(e as PointerEvent);
		const click = () => requestOrientationPermission();

		card.addEventListener("pointerenter", pointerEnter);
		card.addEventListener("pointermove", pointerMove);
		card.addEventListener("pointerleave", pointerLeave);
		card.addEventListener("click", click);

		const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
		const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
		ah.updateCardTransform(initialX, initialY, card, wrap);
		ah.createSmoothAnimation(ANIMATION_CONFIG.INITIAL_DURATION, initialX, initialY, card, wrap);

		onCleanup(() => {
			card.removeEventListener("pointerenter", pointerEnter);
			card.removeEventListener("pointermove", pointerMove);
			card.removeEventListener("pointerleave", pointerLeave);
			card.removeEventListener("click", click);
			window.removeEventListener("deviceorientation", handleDeviceOrientation);
			ah.cancelAnimation();
		});
	});

	// If enableTilt toggles off, clear animations
	createEffect(() => {
		if (!enableTilt) {
			const ah = animationHandlers();
			ah?.cancelAnimation();
			if (wrapRef) {
				wrapRef.classList.remove("active");
			}
			if (cardRef) {
				cardRef.classList.remove("active");
			}
		}
	});

	const handleContactClick = () => onContactClick?.();

	return (
		<div ref={wrapRef} class={`pc-card-wrapper ${className}`.trim()} style={cardStyle()}>
			<section ref={cardRef} class="pc-card">
				<div class="pc-inside">
					<div class="pc-shine" />
					<div class="pc-glare" />
					<div class="pc-content pc-avatar-content">
						<img
							class="avatar"
							src={avatarUrl}
							alt={`${name || "User"} avatar`}
							loading="lazy"
							onError={(e) => {
								const target = e.currentTarget as HTMLImageElement;
								target.style.display = "none";
							}}
						/>
						{showUserInfo && (
							<div class="pc-user-info">
								<div class="pc-user-details">
									<div class="pc-mini-avatar">
										<img
											src={miniAvatarUrl || avatarUrl}
											alt={`${name || "User"} mini avatar`}
											loading="lazy"
											onError={(e) => {
												const target = e.currentTarget as HTMLImageElement;
												target.style.opacity = "0.5";
												target.src = avatarUrl;
											}}
										/>
									</div>
									<div class="pc-user-text">
										<div class="pc-handle">@{handle}</div>
										<div class="pc-status">{status}</div>
									</div>
								</div>
								<button class="pc-contact-btn" onClick={() => handleContactClick} type="button" aria-label={`Contact ${name || "user"}`}>
									{contactText}
								</button>
							</div>
						)}
					</div>
					<div class="pc-content">
						<div class="pc-details">
							<h3>{name}</h3>
							<p>{title}</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ProfileCard;
