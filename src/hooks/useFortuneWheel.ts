import { useState, useCallback, useRef, useEffect } from 'react';
import { getRandomNumber } from '../utils';
import tickSound from '../assets/spin-tick.mp3';

interface UseFortuneWheelProps {
	availableNumbers: number[];
	onNumberSelected: (num: number) => void;
}

export const useFortuneWheel = ({
	availableNumbers,
	onNumberSelected,
}: UseFortuneWheelProps) => {
	const [isSpinning, setIsSpinning] = useState(false);
	const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
	const [rotation, setRotation] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const tickIntervalsRef = useRef<number[]>([]);

	// Carica l'audio al mount
	useEffect(() => {
		audioRef.current = new Audio(tickSound);
		audioRef.current.volume = 0.5;
	}, []);

	const spin = useCallback(() => {
		if (isSpinning || availableNumbers.length === 0) return;

		setIsSpinning(true);

		// Pulisci eventuali tick precedenti
		tickIntervalsRef.current.forEach(clearTimeout);
		tickIntervalsRef.current = [];

		// Seleziona un numero random dall'array disponibile
		const randomIndex = getRandomNumber(0, availableNumbers.length - 1);
		const randomNumber = availableNumbers[randomIndex];

		// Verifica che il numero sia effettivamente presente nell'array disponibile
		// Questo previene l'edge case in cui un numero già estratto viene riselezionato
		if (!availableNumbers.includes(randomNumber)) {
			console.error('Numero selezionato non disponibile:', randomNumber);
			setIsSpinning(false);
			return;
		}

		setSelectedNumber(randomNumber);

		// Calcola l'angolo per lo spicchio selezionato (centro dello spicchio)
		const degreesPerSegment = 360 / availableNumbers.length;
		// Il centro dello spicchio all'indice i è a (i + 0.5) * degreesPerSegment
		const targetAngle = (randomIndex + 0.5) * degreesPerSegment;

		// Posizione target finale (dove voglio che la ruota finisca)
		const targetPosition = (360 - targetAngle) % 360;

		// Posizione corrente normalizzata
		const currentPosition = rotation % 360;

		// Calcola quanto aggiungere per arrivare alla posizione target
		let angleToAdd = (targetPosition - currentPosition + 360) % 360;
		// Se è 0, aggiungi un giro completo per evitare che non giri
		if (angleToAdd === 0) angleToAdd = 360;

		// Aggiungi rotazioni complete (5 giri) più l'angolo necessario
		const finalRotation = rotation + 360 * 5 + angleToAdd;

		setRotation(finalRotation);

		// Riproduci i tick progressivamente più lenti
		const playTick = () => {
			if (audioRef.current) {
				audioRef.current.currentTime = 0;
				audioRef.current.play().catch(() => {});
			}
		};

		// Tick progressivamente più lenti durante i 4 secondi
		let currentTime = 0;
		let tickInterval = 50; // Inizia veloce
		const maxInterval = 400; // Finisce lento
		const duration = 4000;

		while (currentTime < duration) {
			const timeout = setTimeout(playTick, currentTime);
			tickIntervalsRef.current.push(timeout);
			currentTime += tickInterval;
			// Rallenta progressivamente il tick
			tickInterval = Math.min(tickInterval + 10, maxInterval);
		}

		// Termina lo spinning dopo l'animazione e notifica il numero selezionato
		setTimeout(() => {
			setIsSpinning(false);
			onNumberSelected(randomNumber);
		}, 4000); // 4 secondi di animazione
	}, [isSpinning, availableNumbers, rotation, onNumberSelected]);

	return {
		isSpinning,
		selectedNumber,
		rotation,
		spin,
	};
};
