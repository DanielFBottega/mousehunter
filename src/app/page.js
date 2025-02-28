"use client";
import React, { useState, useEffect, useRef } from "react";

export default function App() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [monstroPos, setMonstroPos] = useState({ x: 100, y: 100 });
  const [velocidade, setVelocidade] = useState(2);
  const [tempo, setTempo] = useState(0);
  const [tempoAnterior, setTempoAnterior] = useState(0);
  const [jogando, setJogando] = useState(false);
  const [imgUrl, setImgUrl] = useState(
    "https://gente.globo.com/wp-content/uploads/2019/05/meme-old1.png"
  );

  const rafRef = useRef(null);

  // Atualizar tempo e aumentar a velocidade do monstro a cada intervalo
  useEffect(() => {
    if (!jogando) return;

    const atualizarTempo = setInterval(() => setTempo((t) => t + 1), 1000);
    const aumentarVelocidade = setInterval(() => setVelocidade((v) => v + 1), 5000);

    return () => {
      clearInterval(atualizarTempo);
      clearInterval(aumentarVelocidade);
    };
  }, [jogando]);

  // Atualiza a posição do monstro
  useEffect(() => {
    if (!jogando) return;

    const moverMonstro = () => {
      const deltaX = mousePos.x - monstroPos.x;
      const deltaY = mousePos.y - monstroPos.y;
      const distancia = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      if (distancia < 10) {
        resetarJogo();
        return;
      }

      const fator = velocidade / distancia; // Movimento proporcional
      const novoX = monstroPos.x + deltaX * fator;
      const novoY = monstroPos.y + deltaY * fator;

      setMonstroPos({ x: novoX, y: novoY });

      rafRef.current = requestAnimationFrame(moverMonstro);
    };

    rafRef.current = requestAnimationFrame(moverMonstro);

    return () => cancelAnimationFrame(rafRef.current);
  }, [mousePos, monstroPos, velocidade, jogando]);

  const resetarJogo = () => {
    setJogando(false);
    setTempoAnterior(tempo);
    setTempo(0);
    setVelocidade(2);
    setMonstroPos({ x: 100, y: 100 });
  };

  return (
    <div
      className="w-screen h-screen bg-gray-900 flex flex-col items-center justify-center text-white relative overflow-hidden"
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      <h1 className="text-2xl mb-2">Fuja do Monstro!</h1>
      {!jogando && (
        <div className="text-center">
          <h2 className="text-lg mb-4">
            {tempoAnterior > 0 && `Você sobreviveu por ${tempoAnterior} segundos!`}
          </h2>
          <button
            className="bg-green-500 px-4 py-2 rounded text-lg hover:bg-green-700"
            onClick={() => setJogando(true)}
          >
            Começar
          </button>
        </div>
      )}
      {jogando && <p className="absolute top-4 left-4 text-lg">Tempo: {tempo}s</p>}

      {jogando && (
        <img
          src={imgUrl}
          alt="Monstro"
          className="w-16 h-16 absolute transition-all duration-100 ease-linear"
          style={{ top: monstroPos.y, left: monstroPos.x }}
        />
      )}
    </div>
  );
}
