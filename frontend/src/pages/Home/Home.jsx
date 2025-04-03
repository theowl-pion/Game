import { Link } from 'react-router-dom';
import React from 'react';

const Home = () => {
  const prizes = [
    { src: '/images/lo8.jpg', text: 'Lot 1 : 1 Infuseur à thé' },
    { src: '/images/lo1.jpg', text: 'Lot 2 : 1 Boîte de 100g de thé détox ou infusion' },
    { src: '/images/lo3.jpg', text: 'Lot 3 : 1 Boîte de 100g de thé signature' },
    { src: '/images/lo4.jpg', text: 'Lot 4 : 1 Coffret découverte de valeur de 39€' },
    { src: '/images/lo7.jpg', text: 'Lot 5 : 1 Coffret découverte de valeur de 69€' }
  ];

  return (
    <main className='bg-gray-50 min-h-screen py-12'>
      <div className='container mx-auto px-4'>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-500 to-green-600 text-white p-10 rounded-lg shadow-xl mb-16 text-center">
          <h1 className='text-5xl font-bold mb-4 drop-shadow-md'>Jeu Concours Thé Tip Top ! 🍵</h1>
          <h2 className='text-2xl mb-8 font-light'>
            100 % gagnant - Participez et remportez des cadeaux exclusifs !
          </h2>
          <Link to='/game'> 
            <button className='bg-yellow-400 hover:bg-yellow-500 text-green-900 font-semibold py-3 px-10 rounded-full transition duration-300 ease-in-out shadow-lg transform hover:scale-105 text-xl'>
              Jouer Maintenant
            </button>
          </Link>
        </div>

        {/* Welcome Image and Intro Text */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16 bg-white p-8 rounded-lg shadow-md">
          <div className="md:w-1/2">
            <img 
              src='/images/welcome.png' 
              alt='Thé Tip Top Accueil' 
              className='rounded-lg shadow-md w-full max-w-md mx-auto' 
            />
          </div>
          <div className="md:w-1/2 text-gray-700 space-y-5">
             <h3 className="text-3xl font-semibold text-gray-800 mb-4">Bienvenue sur notre plateforme !</h3>
             <p className="leading-relaxed">
              The Tip Top est ravi de vous inviter à participer à son jeu-concours exclusif, conçu spécialement pour vous remercier de votre fidélité et pour répondre à tous vos besoins en matière de thé haut de gamme. Découvrez une expérience unique à travers nos différentes gammes de thé, soigneusement sélectionnées pour satisfaire les amateurs les plus exigeants.
            </p>
            <p className="leading-relaxed">
              Reconnu parmi les leaders du marché, Thé Tip Top s&apos;engage à vous offrir des produits d&apos;une qualité exceptionnelle, combinant tradition et innovation. Ce jeu-concours est une occasion idéale pour explorer notre univers et tenter votre chance de remporter des cadeaux exclusifs. Alors, prêt à savourer la perfection dans chaque tasse de thé et à vivre une expérience inoubliable ? Participez dès maintenant !
            </p>
          </div>
        </div>

        {/* Prize Section */}
        <div className="bg-white p-10 rounded-lg shadow-md">
          <h3 className='text-3xl font-semibold text-center text-gray-800 mb-10'>Découvrez nos lots à gagner :</h3>
          {/* Centering the grid content */}
          <div className='flex justify-center'>
            {/* Adjusted grid columns for centered 2/3 layout */}
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl'> 
              {prizes.map((item, index) => (
                // Made cards slightly larger and adjusted styling
                <div 
                  className='bg-white rounded-xl shadow-lg border border-gray-200 p-6 text-center transition duration-300 ease-in-out hover:shadow-2xl hover:border-teal-500 flex flex-col items-center justify-between min-h-[300px]' 
                  key={index}
                >
                  <img 
                    src={item.src} 
                    alt={item.text} 
                    className='h-48 w-auto object-contain mb-5 rounded' 
                  />
                  <p className='text-gray-700 font-semibold text-lg mt-auto'>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div> 
    </main>
  );
};

export default Home;
