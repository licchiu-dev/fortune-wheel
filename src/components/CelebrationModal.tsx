// @ts-nocheck
import { useEffect, useState } from 'react';

interface CelebrationModalProps {
	isOpen: boolean;
	number: number;
	onClose: () => void;
}

interface Confetti {
	id: number;
	x: number;
	y: number;
	rotation: number;
	color: string;
	size: number;
	speedX: number;
	speedY: number;
	rotationSpeed: number;
	duration: number;
	direction: 'top' | 'left' | 'right' | 'bottom';
}

// Genera i coriandoli una sola volta al caricamento del modulo
const generateConfetti = (): Confetti[] => {
	const colors = [
		'#FFD700',
		'#FF6B6B',
		'#4ECDC4',
		'#45B7D1',
		'#FFA07A',
		'#98D8C8',
		'#E200FF',
		'#00FFE0',
		'#FF1493',
		'#00FF7F',
		'#FF4500',
		'#9370DB',
	];

	const directions: Array<'top' | 'left' | 'right' | 'bottom'> = [
		'top',
		'left',
		'right',
		'bottom',
	];

	const newConfetti: Confetti[] = [];
	for (let i = 0; i < 400; i++) {
		const direction =
			directions[Math.floor(Math.random() * directions.length)];
		let x, y, speedX, speedY;

		// Posizione e velocità in base alla direzione
		switch (direction) {
			case 'top':
				x = Math.random() * 100;
				y = -10;
				speedX = (Math.random() - 0.5) * 3;
				speedY = Math.random() * 3 + 2;
				break;
			case 'bottom':
				x = Math.random() * 100;
				y = 110;
				speedX = (Math.random() - 0.5) * 3;
				speedY = -(Math.random() * 3 + 2);
				break;
			case 'left':
				x = -10;
				y = Math.random() * 100;
				speedX = Math.random() * 3 + 2;
				speedY = (Math.random() - 0.5) * 3;
				break;
			case 'right':
				x = 110;
				y = Math.random() * 100;
				speedX = -(Math.random() * 3 + 2);
				speedY = (Math.random() - 0.5) * 3;
				break;
		}

		newConfetti.push({
			id: i,
			x,
			y,
			rotation: Math.random() * 360,
			color: colors[Math.floor(Math.random() * colors.length)],
			size: Math.random() * 12 + 6,
			speedX,
			speedY,
			rotationSpeed: (Math.random() - 0.5) * 15,
			duration: 2.5 + Math.random() * 2,
			direction,
		});
	}
	return newConfetti;
};

export const CelebrationModal = ({
	isOpen,
	number,
	onClose,
}: CelebrationModalProps) => {
	const [confetti, setConfetti] = useState<Confetti[]>([]);
	const [show, setShow] = useState(false);

	useEffect(() => {
		if (isOpen) {
			// Genera nuovi coriandoli ogni volta che si apre
			setConfetti(generateConfetti());
			// Piccolo ritardo per assicurare l'animazione
			requestAnimationFrame(() => {
				setShow(true);
			});
		} else {
			setShow(false);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center'>
			{/* Overlay */}
			<div
				className='absolute inset-0 bg-black/70 backdrop-blur-sm'
				onClick={onClose}
			/>

			{/* Coriandoli */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				{show &&
					confetti.map((conf) => (
						<div
							key={conf.id}
							className='absolute'
							style={
								{
									left: `${conf.x}%`,
									top: `${conf.y}%`,
									width: `${conf.size}px`,
									height: `${conf.size}px`,
									backgroundColor: conf.color,
									transform: `rotate(${conf.rotation}deg)`,
									animation: `confetti-fall ${conf.duration}s ease-out forwards`,
									'--speed-x': `${conf.speedX * 50}vw`,
									'--speed-y': `${conf.speedY * 50}vh`,
									'--rotation-speed': `${
										conf.rotationSpeed * 360
									}deg`,
								} as React.CSSProperties
							}
						/>
					))}
			</div>

			{/* Modal */}
			<div
				className='relative  rounded-3xl shadow-2xl p-12 max-w-2xl w-full mx-4 animate-modal-bounce border-4 border-[var(--color-brown)]'
				style={{
					background:
						'radial-gradient(at 0% 0%, rgba(255, 237, 0, 0.9) 0px, rgba(226, 0, 26, 0.9) 90%), radial-gradient(at 98% 1%, rgba(226, 0, 26, 0.9) 0px, rgba(226, 0, 26, 0.9), transparent',
				}}
			>
				{/* Pulsante chiudi */}
				<button
					onClick={onClose}
					className='absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-bold transition-colors'
					aria-label='Chiudi'
				>
					×
				</button>

				{/* Contenuto */}
				<div className='text-center'>
					<div className='mb-6'>
						<div className='text-yellow-300 text-6xl mb-4 animate-pulse'>
							🎉 🎊 🎉
						</div>
						<h2 className='text-white text-4xl font-bold mb-2 drop-shadow-lg'>
							Numero Estratto!
						</h2>
					</div>

					{/* Numero in grande */}
					<div className='bg-white/20 backdrop-blur-md rounded-2xl p-8 mb-6 border-4 border-white/30 shadow-2xl'>
						<div className='text-white text-9xl font-black drop-shadow-2xl animate-number-pop'>
							{number}
						</div>
					</div>

					{/* Bottone */}
					<button
						onClick={onClose}
						className='bg-white text-[var(--color-red)] px-8 py-4 rounded-full text-xl font-bold hover:bg-[var(--color-red)] hover:text-white transition-all transform hover:scale-105 shadow-lg'
					>
						Continua
					</button>
				</div>
			</div>
		</div>
	);
};
