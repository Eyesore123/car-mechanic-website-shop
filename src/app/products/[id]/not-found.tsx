// pages/404.tsx
import Link from 'next/link';

const notFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] lg:min-h-[1100px] bg-gray-100">
      <h1 className="text-4xl font-bold text-red-500 mb-4 mt-10">404 - Sivua ei löytynyt.</h1>
      <p className="text-lg mb-6">Uppistakeikkaa! Hakemaasi tuotetta ei löytynyt. Oletko varmasti oikealla sivulla?</p>
      <Link href="/products" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all">
        Takaisin kauppaan
      </Link>
    </div>
  );
};

export default notFound;

