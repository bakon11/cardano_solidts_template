import { Component, createSignal, createEffect, onMount, onCleanup, For } from "solid-js";
import "./CircularText.css";

interface CircularTextProps {
	text: string;
	spinDuration?: number;
	onHover?: "slowDown" | "speedUp" | "pause" | "goBonkers";
	className?: string;
}

const CircularText: Component<CircularTextProps> = (props) => {
	const [rotate, setRotate] = createSignal(0);
	const [scale, setScale] = createSignal(1);
	const [speed, setSpeed] = createSignal(360 / (props.spinDuration ?? 20)); // deg/s

	createEffect(() => {
		setSpeed(360 / (props.spinDuration ?? 20));
	});

	let rafId: number;
	let lastTime = 0;

	const animate = (time: number) => {
		if (lastTime === 0) lastTime = time;
		const delta = time - lastTime;
		lastTime = time;
		setRotate((prev) => prev + speed() * (delta / 1000));
		rafId = requestAnimationFrame(animate);
	};

	onMount(() => {
		lastTime = performance.now();
		rafId = requestAnimationFrame(animate);
	});

	onCleanup(() => {
		if (rafId) cancelAnimationFrame(rafId);
	});

	const handleHoverStart = () => {
		if (!props.onHover) return;
		let newSpeed = speed();
		let newScale = 1;
		switch (props.onHover) {
			case "slowDown":
				newSpeed *= 0.5;
				break;
			case "speedUp":
				newSpeed *= 5; // spinDuration / 4 -> speed * 4, but original /4 is *4? Wait, duration /4 means faster by 4x
				break;
			case "pause":
				newSpeed = 0;
				break;
			case "goBonkers":
				newSpeed *= 20; // spinDuration /20 -> speed *20
				newScale = 0.8;
				break;
			default:
				newSpeed = speed();
		}
		setSpeed(newSpeed);
		setScale(newScale);
	};

	const handleHoverEnd = () => {
		setSpeed(360 / (props.spinDuration ?? 20));
		setScale(1);
	};

	const letters = Array.from(props.text);

	return (
		<div
			class={`circular-text ${props.className ?? ""}`}
			style={{
				transform: `rotate(${rotate()}deg) scale(${scale()})`,
				"will-change": "transform",
				"z-index": "9999",
			}}
			onMouseEnter={handleHoverStart}
			onMouseLeave={handleHoverEnd}
		>
			<For each={letters}>
				{(letter, i) => {
					const rotationDeg = (360 / letters.length) * i();
					const factor = Math.PI / letters.length;
					const x = factor * i();
					const y = factor * i();
					const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;
					return (
						<span
							style={{
								transform,
								"-webkit-transform": transform,
							}}
						>
							{letter}
						</span>
					);
				}}
			</For>
		</div>
	);
};

export default CircularText;
