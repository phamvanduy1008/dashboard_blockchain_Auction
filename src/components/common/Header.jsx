const Header = ({ title, buttonDisplay, titleButton, onButtonClick }) => {
	return (
		<header className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg border-b border-gray-700'>
			<div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center'>
				<h1 className='text-2xl font-semibold text-gray-100'>{title}</h1>

				{buttonDisplay && (
					<button
						onClick={onButtonClick}
						className='bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded'
					>
						{titleButton}
					</button>
				)}
			</div>
		</header>
	);
};

export default Header;
