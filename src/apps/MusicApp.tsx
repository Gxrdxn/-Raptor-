import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, Volume2, Sparkles, Disc, Sliders } from 'lucide-react';
import { useOS } from '../context/OSContext';

type VisualizerStyle = 'Bars' | 'Waveform' | 'Frequency Dots';
type ColorPalette = 'Neon Cyber' | 'Deep Ocean' | 'Warning Red';

export const MusicApp: React.FC = () => {
  const { settings } = useOS();
  const [isPlaying, setIsPlaying] = useState(false);
  const [visualizerStyle, setVisualizerStyle] = useState<VisualizerStyle>('Bars');
  const [colorPalette, setColorPalette] = useState<ColorPalette>('Neon Cyber');

  const colorPaletteRef = useRef<ColorPalette>(colorPalette);
  useEffect(() => {
    colorPaletteRef.current = colorPalette;
  }, [colorPalette]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio();
      setIsPlaying(true);
    }
  };

  const startAudio = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.value = (settings.volume / 100) * 0.15; // gentle ambient level
      gainNodeRef.current = masterGain;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;

      masterGain.connect(analyser);
      analyser.connect(ctx.destination);

      // Ambient chord frequencies (Cyberpunk Lofi Synth chord: C minor 9)
      const freqs = [130.81, 196.00, 233.08, 293.66, 392.00]; // C3, G3, Bb3, D4, G4
      const oscs: OscillatorNode[] = [];

      freqs.forEach(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        // Add subtle vibrato / lofi drift
        const lfo = ctx.createOscillator();
        lfo.frequency.value = 0.2;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = 1.5;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        osc.connect(masterGain);
        osc.start();
        oscs.push(osc);
      });

      oscillatorsRef.current = oscs;
      startVisualizer();
    } catch (e) {
      console.error(e);
    }
  };

  const stopAudio = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    oscillatorsRef.current.forEach(osc => {
      try { osc.stop(); } catch {}
    });
    oscillatorsRef.current = [];
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch {}
      audioCtxRef.current = null;
    }
  };

  const startVisualizer = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current ? analyserRef.current.frequencyBinCount : 32;
    const freqData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);

      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(freqData);
        analyserRef.current.getByteTimeDomainData(timeData);
      } else {
        freqData.fill(0);
        timeData.fill(128);
      }

       ctx.clearRect(0, 0, canvas.width, canvas.height);

      const palette = colorPaletteRef.current;
      let gradStart = '#06b6d4';
      let gradEnd = '#8b5cf6';
      let waveColor = '#22d3ee';
      let dotColor1 = '#22d3ee';
      let dotColor2 = '#a78bfa';

      if (palette === 'Deep Ocean') {
        gradStart = '#3b82f6';
        gradEnd = '#06b6d4';
        waveColor = '#60a5fa';
        dotColor1 = '#60a5fa';
        dotColor2 = '#38bdf8';
      } else if (palette === 'Warning Red') {
        gradStart = '#ef4444';
        gradEnd = '#f59e0b';
        waveColor = '#f87171';
        dotColor1 = '#f87171';
        dotColor2 = '#fbbf24';
      }

      if (visualizerStyle === 'Bars') {
        const barWidth = (canvas.width / bufferLength) * 1.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (freqData[i] / 255) * canvas.height * 0.9 + 4;

          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, gradStart);
          gradient.addColorStop(1, gradEnd);

          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 2, barHeight);

          x += barWidth + 1;
        }
      } else if (visualizerStyle === 'Waveform') {
        ctx.lineWidth = 2;
        ctx.strokeStyle = waveColor;
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      } else if (visualizerStyle === 'Frequency Dots') {
        const spacing = canvas.width / (bufferLength / 1.5);
        let x = spacing / 2;

        for (let i = 0; i < bufferLength; i += 1) {
          const radius = (freqData[i] / 255) * 16 + 2;
          const y = canvas.height / 2 + Math.sin(i + Date.now() * 0.005) * 12;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? dotColor1 : dotColor2;
          ctx.fill();

          x += spacing;
        }
      }
    };

    draw();
  };

  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0a0a0f] text-gray-200 p-6 items-center justify-center text-center">
      <div className={`relative w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-600/30 to-violet-600/30 border border-white/15 flex items-center justify-center mb-3 shadow-2xl ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
        <Disc className={`w-12 h-12 ${isPlaying ? 'text-cyan-400' : 'text-gray-500'}`} />
      </div>

      <h2 className="text-base font-bold text-gray-100 mb-0.5">Cyber Lofi Ambient Synth</h2>
      <p className="text-xs text-gray-400 mb-3">Procedural Web Audio synthesizer generating relaxing obsidian frequencies.</p>

      {/* Style & Palette selectors */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs text-gray-400">Style:</span>
          <select
            value={visualizerStyle}
            onChange={(e) => setVisualizerStyle(e.target.value as VisualizerStyle)}
            className="bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-xs text-cyan-300 font-medium focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="Bars">Bars</option>
            <option value="Waveform">Waveform</option>
            <option value="Frequency Dots">Frequency Dots</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs text-gray-400">Palette:</span>
          <select
            value={colorPalette}
            onChange={(e) => setColorPalette(e.target.value as ColorPalette)}
            className="bg-black/60 border border-white/15 rounded-lg px-2 py-1 text-xs text-violet-300 font-medium focus:outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="Neon Cyber">Neon Cyber</option>
            <option value="Deep Ocean">Deep Ocean</option>
            <option value="Warning Red">Warning Red</option>
          </select>
        </div>
      </div>

      {/* Canvas Frequency Visualizer */}
      <div className="w-full max-w-xs h-20 bg-black/50 border border-white/10 rounded-xl overflow-hidden mb-5 p-2 flex items-center justify-center shadow-inner">
        <canvas
          ref={canvasRef}
          width={260}
          height={64}
          className="w-full h-full object-contain rounded"
        />
      </div>

      <button
        onClick={togglePlay}
        className={`px-6 py-3 rounded-2xl flex items-center gap-2.5 text-xs font-bold transition-all shadow-xl ${
          isPlaying
            ? 'bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30'
            : 'bg-cyan-500 text-black hover:bg-cyan-400'
        }`}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
        <span>{isPlaying ? 'Stop Ambient Synth' : 'Start Ambient Synth'}</span>
      </button>
    </div>
  );
};


