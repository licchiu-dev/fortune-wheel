import { useState } from 'react';
import { FortuneWheel } from './components/FortuneWheel';
import { CelebrationModal } from './components/CelebrationModal';
import { useFortuneWheel } from './hooks';

function App() {
	// Configurazione iniziale
	const [isConfigured, setIsConfigured] = useState(false);
	const [totalSlices, setTotalSlices] = useState(100);
	const [totalExtractions, setTotalExtractions] = useState(10);

	// Numeri disponibili e estratti
	const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
	const [extractedNumbers, setExtractedNumbers] = useState<number[]>([]);
	const [pendingRemoval, setPendingRemoval] = useState<number | null>(null);

	// Modale celebrazione
	const [showCelebration, setShowCelebration] = useState(false);
	const [celebrationNumber, setCelebrationNumber] = useState<number>(0);

	const { isSpinning, rotation, spin } = useFortuneWheel({
		availableNumbers,
		onNumberSelected: (num) => {
			// Segna il numero per la rimozione alla prossima estrazione
			setPendingRemoval(num);
			setExtractedNumbers((prev) => [...prev, num]);
			// Mostra la modale di celebrazione
			setCelebrationNumber(num);
			setShowCelebration(true);
		},
	});

	const handleStartExtraction = () => {
		if (
			totalSlices < 1 ||
			totalExtractions < 1 ||
			totalExtractions > totalSlices
		) {
			alert('Configurazione non valida');
			return;
		}

		// Inizializza la lista di numeri disponibili
		const numbers = Array.from({ length: totalSlices }, (_, i) => i + 1);
		setAvailableNumbers(numbers);
		setExtractedNumbers([]);
		setPendingRemoval(null);
		setIsConfigured(true);
	};

	const handleReset = () => {
		setIsConfigured(false);
		setAvailableNumbers([]);
		setExtractedNumbers([]);
		setPendingRemoval(null);
	};

	const handleSpin = () => {
		// Rimuovi il numero pendente prima di fare una nuova estrazione
		if (pendingRemoval !== null) {
			setAvailableNumbers((prev) =>
				prev.filter((n) => n !== pendingRemoval)
			);
			setPendingRemoval(null);
			// Attendi il prossimo ciclo di rendering per assicurarsi che lo stato sia aggiornato
			setTimeout(() => {
				spin();
			}, 0);
		} else {
			spin();
		}
	};

	const currentExtraction = extractedNumbers.length + 1;
	const canExtract =
		availableNumbers.length > 0 &&
		extractedNumbers.length < totalExtractions;

	return (
		<div
			className='h-screen flex overflow-hidden bg-[#121212]'
			style={{
				background:
					'radial-gradient(at 0% 0%, rgba(255, 237, 0, 0.5) 0px, rgba(0, 91, 129, 0.3) 50%), radial-gradient(at 98% 1%, rgba(226, 0, 26, 0.9) 0px, rgba(0, 0, 0, 0.1) 50%), transparent',
			}}
		>
			{/* Modale di celebrazione */}
			<CelebrationModal
				isOpen={showCelebration}
				number={celebrationNumber}
				onClose={() => setShowCelebration(false)}
			/>

			{/* Sidebar Sinistra */}
			<div className='w-[20%] h-full shadow-2xl overflow-y-auto'>
				<div className='p-6'>
					<div className={isConfigured ? 'text-center mx-auto' : ''}>
						{isConfigured && (
							<img
								className='mx-auto max-w-[200px] w-full'
								src='/cantelmo-giallorosse.png'
								alt=''
							/>
						)}
						<p className='text-lg font-bold text-white/80 mb-2'>
							Configurazione
						</p>
					</div>

					{!isConfigured ? (
						/* Form di configurazione iniziale */
						<div className='space-y-6 mt-5'>
							<div>
								<label className='block text-sm font-semibold text-white mb-2'>
									Numero di spicchi
								</label>
								<input
									type='number'
									min='1'
									max='1000'
									value={totalSlices}
									onChange={(e) =>
										setTotalSlices(
											parseInt(e.target.value) || 0
										)
									}
									className='w-full px-4 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent'
									placeholder='Es: 100'
								/>
							</div>

							<div>
								<label className='block text-sm font-semibold text-white mb-2'>
									Numero di estrazioni
								</label>
								<input
									type='number'
									min='1'
									max={totalSlices}
									value={totalExtractions}
									onChange={(e) =>
										setTotalExtractions(
											parseInt(e.target.value) || 0
										)
									}
									className='w-full px-4 py-2 border border-primary rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent'
									placeholder='Es: 10'
								/>
								<p className='text-xs text-white/60 mt-1'>
									Max: {totalSlices}
								</p>
							</div>

							<button
								onClick={handleStartExtraction}
								className='w-full px-4 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-secondary/90 transition-colors shadow-lg hover:shadow-xl'
							>
								Inizia Estrazione
							</button>
						</div>
					) : (
						/* Informazioni durante l'estrazione */
						<div className='space-y-6'>
							<div className='bg-white border border-primary rounded-lg p-4 shadow-sm'>
								<p className='text-xs text-blue mb-1'>
									Estrazione corrente
								</p>
								<p className='text-3xl font-bold text-secondary'>
									{currentExtraction} / {totalExtractions}
								</p>
							</div>

							<div className='bg-white border border-primary rounded-lg p-4 shadow-sm'>
								<p className='text-xs text-blue mb-1'>
									Numeri rimanenti
								</p>
								<p className='text-3xl font-bold text-secondary'>
									{availableNumbers.length}
								</p>

								{/* Numeri estratti */}
								{extractedNumbers.length > 0 && (
									<div className='mt-4 pt-4 border-t border-gray-200'>
										<p className='text-xs text-blue mb-2'>
											Numeri estratti
										</p>
										<div className='flex flex-wrap gap-2'>
											{extractedNumbers.map(
												(num, index) => {
													// L'ultimo numero è in rosso, gli altri in giallo
													const isLastNumber =
														index ===
															extractedNumbers.length -
																1 &&
														!isSpinning;
													return (
														<span
															key={num}
															className={
																isLastNumber
																	? 'px-3 py-1.5 bg-red-600 text-white text-sm font-bold rounded shadow-md'
																	: 'bg-yellow-400 text-red-600 px-3 py-1.5 text-sm font-bold rounded shadow-md'
															}
														>
															{num}
														</span>
													);
												}
											)}
										</div>
									</div>
								)}
							</div>

							<div className='bg-white border border-primary rounded-lg p-4 shadow-sm'>
								<p className='text-xs text-blue mb-1'>
									Vincitori estratti
								</p>
								<p className='text-3xl font-bold text-secondary'>
									{extractedNumbers.length}
								</p>
							</div>

							<button
								onClick={handleReset}
								disabled={isSpinning}
								className='w-full px-4 py-2 bg-white border-2 border-secondary text-secondary font-semibold rounded-lg hover:bg-secondary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
							>
								Nuova Estrazione
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Parte Destra - Ruota */}
			<div className='flex-1 h-full relative flex items-center justify-center'>
				{isConfigured && availableNumbers.length > 0 ? (
					<>
						<FortuneWheel
							availableNumbers={availableNumbers}
							rotation={rotation}
						/>

						{/* Pulsante Estrazione in basso a destra */}
						<div className='absolute bottom-8 right-8'>
							<button
								onClick={handleSpin}
								disabled={isSpinning || !canExtract}
								className={`
                  px-8 py-4 text-lg font-bold rounded-lg shadow-lg transition-all
                  ${
						isSpinning || !canExtract
							? 'bg-gray-300 cursor-not-allowed text-gray-500'
							: 'bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary active:scale-95 text-white shadow-secondary/50'
					}
                `}
							>
								{isSpinning
									? 'In corso...'
									: extractedNumbers.length >=
									  totalExtractions
									? 'Completato'
									: 'Estrazione'}
							</button>
						</div>
					</>
				) : (
					<div className='text-center text-gray-400 w-full'>
						<div className='flex w-full justify-center'>
							<div className='h-[300px] w-[300px] shrink-0 flex items-center justify-center'>
								<img
									src='/cantelmo-giallorosse.png'
									alt=''
									width={350}
								/>
							</div>
							<div className='h-[300px] w-[300px] shrink-0 flex items-center justify-center'>
								<img src='/lecce-logo.svg' alt='' width={180} />
							</div>
						</div>
						<p className='text-xl'>
							Configura l'estrazione per iniziare
						</p>
					</div>
				)}
			</div>
		</div>
	);
}

export default App;
