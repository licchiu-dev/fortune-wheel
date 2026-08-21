import { useEffect, useRef, useState } from 'react';

interface WheelProps {
	availableNumbers: number[];
	rotation: number;
}

export const Wheel = ({ availableNumbers, rotation }: WheelProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [canvasSize, setCanvasSize] = useState(600);
	const logoRef = useRef<HTMLImageElement | null>(null);
	const [logoLoaded, setLogoLoaded] = useState(false);

	// Carica lo scudetto del Lecce
	useEffect(() => {
		const img = new Image();
		img.src = '/lecce-logo.svg';
		img.onload = () => {
			logoRef.current = img;
			setLogoLoaded(true);
		};
	}, []);

	// Calcola le dimensioni del canvas in base al container
	useEffect(() => {
		const updateSize = () => {
			if (containerRef.current) {
				const { width, height } =
					containerRef.current.getBoundingClientRect();
				const size = Math.min(width, height) * 0.9; // 90% dello spazio disponibile
				setCanvasSize(size);
			}
		};

		updateSize();
		window.addEventListener('resize', updateSize);
		return () => window.removeEventListener('resize', updateSize);
	}, []);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const centerX = canvas.width / 2;
		const centerY = canvas.height / 2;
		const radius = Math.min(centerX, centerY) - 10;

		// Pulisci il canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const numSlices = availableNumbers.length;
		if (numSlices === 0) return;

		const angleStep = (2 * Math.PI) / numSlices;

		// Disegna gli spicchi
		for (let i = 0; i < numSlices; i++) {
			const startAngle = i * angleStep - Math.PI / 2;
			const endAngle = startAngle + angleStep;

			// Disegna lo spicchio (alternato giallo/rosso Lecce)
			ctx.beginPath();
			ctx.moveTo(centerX, centerY);
			ctx.arc(centerX, centerY, radius, startAngle, endAngle);
			ctx.closePath();
			ctx.fillStyle = i % 2 === 0 ? '#ffed00' : '#e2001a';
			ctx.fill();
			ctx.strokeStyle = '#005b81';
			ctx.lineWidth = 2;
			ctx.stroke();

			// Disegna il numero (usa il valore dall'array, non l'indice)
			ctx.save();
			ctx.translate(centerX, centerY);
			ctx.rotate(startAngle + angleStep / 2);
			ctx.textAlign = 'right';
			ctx.fillStyle = i % 2 === 0 ? '#1a1a1a' : '#ffffff';

			// Dimensione font dinamica in base al numero di spicchi
			const fontSize = numSlices <= 20 ? 18 : numSlices <= 50 ? 14 : 10;
			ctx.font = `bold ${fontSize}px Arial`;
			ctx.fillText(`${availableNumbers[i]}`, radius - 15, 5);
			ctx.restore();
		}

		// Disegna il cerchio esterno
		ctx.beginPath();
		ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
		ctx.strokeStyle = '#dadb94';
		ctx.lineWidth = 4;
		ctx.stroke();

		// Disegna il cerchio centrale
		const logoRadius = 50;
		ctx.beginPath();
		ctx.arc(centerX, centerY, logoRadius, 0, 2 * Math.PI);
		ctx.fillStyle = '#ffffff';
		ctx.fill();
		ctx.strokeStyle = '#005b81';
		ctx.lineWidth = 4;
		ctx.stroke();
	}, [availableNumbers, canvasSize, logoLoaded]);

	return (
		<div
			ref={containerRef}
			className='w-full h-full flex items-center justify-center relative'
		>
			<canvas
				ref={canvasRef}
				width={canvasSize}
				height={canvasSize}
				style={{ transform: `rotate(${rotation}deg)` }}
				className='transition-transform duration-[4000ms] ease-out'
			/>
			{/* Logo fisso al centro */}
			<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none'>
				<img
					src='/lecce-logo.svg'
					alt='US Lecce'
					className='w-[230px] h-[230px]'
				/>
			</div>
		</div>
	);
};
