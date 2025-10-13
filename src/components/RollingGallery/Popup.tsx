import { JSX } from "solid-js";
import { Show } from "solid-js";

interface PopupProps {
	isOpen: boolean;
	content: string;
	onClose: () => void;
}

export function Popup({ isOpen, content, onClose }: PopupProps): JSX.Element {
	return (
		<Show when={isOpen}>
			<div class="popup-overlay" onClick={onClose}>
				<div class="popup-content" onClick={(e) => e.stopPropagation()}>
					<p>{content}</p>
					<button onClick={onClose}>Close</button>
				</div>
			</div>
		</Show>
	);
}
