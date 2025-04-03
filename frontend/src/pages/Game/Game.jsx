import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Game.module.css";

// Define prize details with emojis
const prizes = [
  { name: "Infuseur à thé", value: 5, emoji: "💧" }, // Droplet as infuseur
  { name: "Thé Détox/Infusion", value: 10, emoji: "🌿" }, // Herb for detox
  { name: "Thé Signature", value: 15, emoji: "⭐" }, // Star for signature
  { name: "Coffret 39€", value: 39, emoji: "🎁" }, // Gift box
  { name: "Coffret 69€", value: 69, emoji: "💎" }, // Gem for high value
];

// Simple Confetti component
const Confetti = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
        {[...Array(80)].map((_, i) => (
            <div key={i} className={styles.confettiParticle} style={{
                left: `${Math.random() * 100}%`,
                backgroundColor: `hsl(${Math.random() * 360}, 90%, 65%)`,
                animationDuration: `${Math.random() * 3 + 2}s`,
                animationDelay: `${Math.random() * 1.5}s`,
            }}></div>
        ))}
    </div>
);

// Loading Spinner Component (Simple CSS Spinner)
const LoadingSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white ml-2"></div>
);

const Game = () => {
    const [ticketNumber, setTicketNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [prizeResult, setPrizeResult] = useState(null);
    const [showCelebration, setShowCelebration] = useState(false);
    
    // Reset celebration when ticket number changes
    useEffect(() => {
      setShowCelebration(false);
      setPrizeResult(null);
    }, [ticketNumber]);

    const handlePlayGame = async (e) => {
        e.preventDefault();
        if (isLoading) return; // Prevent multiple submissions

        setError(null);
        setPrizeResult(null);
        setShowCelebration(false);

        if (!ticketNumber.trim()) {
            setError("Veuillez entrer un numéro de ticket.");
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Vous devez être connecté pour jouer.");
                setIsLoading(false);
                return;
            }

            const response = await axios.post(
                "http://localhost:4000/api/game/play",
                { ticketNumber },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                const match = response.data.message.match(/won (.*) worth (\d+) euros/);
                if (match && match.length >= 3) {
                    const prizeName = match[1];
                    const prizeValue = parseInt(match[2], 10);
                    setPrizeResult({ prizeWon: prizeName, prizeValue: prizeValue });
                    setShowCelebration(true); // Trigger celebration
                } else {
                    // Handle unexpected success message format if necessary
                    setPrizeResult({ prizeWon: 'un lot spécial', prizeValue: 'inconnue' }); // Fallback
                    setShowCelebration(true);
                }
            } else {
                setError(response.data.message || "Une erreur est survenue.");
            }
        } catch (err) {
            console.error("Game API error:", err);
            if (err.response?.status === 401) {
                setError("Session expirée ou invalide. Veuillez vous reconnecter.");
                localStorage.removeItem("token");
            } else {
                setError(err.response?.data?.message || "Erreur lors de la validation du ticket.");
            }
        } finally {
            // Add a small delay before hiding loading to make it feel smoother
            setTimeout(() => setIsLoading(false), 500);
        }
    };

    return (
        // Use a relative container for confetti positioning
        <main className="min-h-screen bg-gray-100 py-12 px-4 flex flex-col items-center relative">
             {showCelebration && <Confetti />}

            <div className="text-center mb-8 md:mb-12 w-full max-w-md">
                <h1 className="text-4xl md:text-5xl font-bold text-teal-700 mb-3">
                    🎟️ Tentez Votre Chance ! 🎟️
                </h1>
                <p className="text-lg text-gray-600">
                    Entrez votre code unique reçu en boutique.
                </p>
            </div>

            {/* Form Section - Centered */}
            <div className="w-full max-w-sm bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <form onSubmit={handlePlayGame} className="flex flex-col items-center space-y-5">
                    <label htmlFor="ticketNumber" className="sr-only">Numéro de Ticket</label>
                    <input
                        id="ticketNumber"
                        name="ticketNumber"
                        type="text"
                        value={ticketNumber}
                        onChange={(e) => setTicketNumber(e.target.value.toUpperCase())}
                        required
                        disabled={isLoading}
                        className="w-full px-4 py-3 border border-gray-400 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-center text-lg tracking-widest font-mono disabled:bg-gray-200 disabled:cursor-not-allowed"
                        placeholder="VOTRE-CODE-UNIQUE"
                    />
                    <button 
                        type="submit"
                        disabled={isLoading} 
                        className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white transition duration-150 ease-in-out ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'}`}
                    >
                        {isLoading ? (
                            <>
                                Vérification en cours...
                                <LoadingSpinner />
                            </>
                        ) : (
                            'Valider mon ticket'
                        )}
                    </button>
                    {error && (
                        <p className="text-red-600 text-sm font-medium text-center pt-2">⚠️ {error}</p>
                    )}
                </form>
            </div>

            {/* Result Section - Appears below the form */}
            {prizeResult && !isLoading && (
                <div className="mt-8 p-6 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 rounded-lg shadow-xl text-center border-4 border-yellow-500 w-full max-w-sm animate-pulse">
                    <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-red-600 to-yellow-600 mb-2">
                        🎉 Félicitations ! 🎉
                    </p>
                    <p className="text-lg text-gray-900 mb-1">Vous avez gagné :</p>
                    <p className="text-2xl font-semibold text-gray-800 mb-2">
                        {prizeResult.prizeWon}!
                    </p>
                    <p className="text-md text-gray-700">(Valeur : {prizeResult.prizeValue}€)</p>
                    <p className="text-sm text-gray-600 mt-3">Un email de confirmation vous a été envoyé.</p>
                </div>
            )}

            {/* Prize Legend (Optional but helpful) */}
            <div className="mt-10 p-4 bg-white rounded-lg shadow-md border border-gray-200 max-w-md w-full opacity-80">
                <h3 className="text-md font-semibold text-gray-700 mb-3 text-center">Lots Possibles</h3>
                <ul className="space-y-1 text-xs text-gray-600 text-center">
                    {prizes.map((prize) => (
                        <li key={prize.name + prize.value} className="inline-block mx-2">
                           <span className="text-lg">{prize.emoji}</span> 
                           <span>= {prize.name} ({prize.value}€)</span>
                        </li>
                    ))}
                </ul>
            </div>

        </main>
    );
};

export default Game;
