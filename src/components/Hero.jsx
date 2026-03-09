import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-white">
            {/* Background blobs */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-indigo-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto">
                <span className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6 border border-blue-100">
                    Propulsé par l'IA et les Talents Humains
                </span>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-gray-900">
                    Trouvez des{' '}
                    <span className="text-blue-600">freelances</span>{' '}
                    ou des projets
                </h1>

                <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed">
                    Travaillez avec des experts ou postez votre projet en quelques clics.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/search"
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-200 w-full sm:w-auto justify-center"
                    >
                        Je cherche un freelance <ArrowRight size={20} />
                    </Link>
                    <Link
                        to="/work"
                        className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 font-bold px-8 py-4 rounded-2xl text-lg border border-gray-200 hover:border-blue-300 transition-all w-full sm:w-auto justify-center"
                    >
                        Je veux travailler
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;
