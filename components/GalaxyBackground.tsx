"use client";
import React, { useEffect, useState } from "react";

const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.floor(Math.random() * 80 + 40), // Tamaños entre 40px y 120px
    top: `${Math.random() * 100}%`, // Posición aleatoria en el viewport
    left: `${Math.random() * 100}%`, 
    color: ["bg-blue-600", "bg-purple-600", "bg-indigo-500", "bg-pink-500", "bg-cyan-500"][Math.floor(Math.random() * 5)], // Colores variados
    opacity: Math.random() * 0.3 + 0.1, // Opacidad tenue (10% a 40%)
  }));
};

export default function GalaxyBackground({ particleCount = 10 }) {
  const [particles, setParticles] = useState<{ id: number; size: number; top: string; left: string; color: string; opacity: number }[]>([]);

  useEffect(() => {
    setParticles(generateParticles(particleCount)); // Genera partículas solo en el cliente
  }, [particleCount]);

  return (
    <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${particle.color}`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            top: particle.top,
            left: particle.left,
            opacity: particle.opacity,
            filter: `blur(2rem)`,
            transition: "all 10s ease-in-out",
          }}
        />
      ))}
    </div>
  );
}
