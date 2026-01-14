
import CategoryItems from './../components/CategoryItems';

const categories = [
	{ href: "/gofrets", name: "gofret", imageUrl: "/cikolataresim1.jpg" },
	{ href: "/kupcikolata", name: "Küp Çikolata", imageUrl: "/cikolataresim2.png" },
	{ href: "/kutucikolata", name: "Kutu Çikolata", imageUrl: "/cikolataresim3.jpg" },
	{ href: "/topcikolata", name: "Top Çikolata", imageUrl: "/cikolataresim4.png" },
	{ href: "/karecikolata", name: "Kare Çikolata", imageUrl: "/cikolataresim6.png" },
	{ href: "/kare2cikolata", name: "Kare2 Çikolata", imageUrl: "/cikolataresim9.jpg" },
	{ href: "/uzuncikolata", name: "Uzun Çikolata", imageUrl: "/cikolataresim11.jpg" },
];

const HomePage = () => {

    return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Explore Our Categories
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Discover the latest trends in eco-friendly fashion
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItems category={category} key={category.name}  />
					))}
				</div>

				
			</div>
		</div>
	);
}

export default HomePage;