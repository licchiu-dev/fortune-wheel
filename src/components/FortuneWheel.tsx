import { Wheel } from './Wheel';

interface FortuneWheelProps {
	availableNumbers: number[];
	rotation: number;
}

export const FortuneWheel = ({
	availableNumbers,
	rotation,
}: FortuneWheelProps) => {
	return (
		<div className='relative w-full h-full flex items-center justify-center'>
			{/* Indicatore freccia */}
			<div className='absolute top-[3.5%] left-1/2 -translate-x-1/2 z-10'>
				<div className='w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-t-[40px] border-t-blue drop-shadow-lg' />
			</div>

			{/* Ruota */}
			<Wheel availableNumbers={availableNumbers} rotation={rotation} />
		</div>
	);
};
