/**
 * @license
 * GRAM-DISHA — Real-Time Web Audio Waveform Visualizer
 * Team ERGON — Smart India Hackathon 2026
 * 
 * Renders real audio frequency and amplitude data captured from the browser's
 * microphone via Web Audio API. Strictly avoids synthetic or fake waveforms.
 */

import React, { useRef, useEffect } from 'react';
import { AudioVisualizerData } from '../../types/whisper';

interface VisualizerProps {
  data: AudioVisualizerData | null;
  isRecording: boolean;
  color?: string;
  width?: number;
  height?: number;
}

export const AudioWaveformVisualizer: React.FC<VisualizerProps> = ({
  data,
  isRecording,
  color = '#174C3A',
  width = 300,
  height = 54
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);

    if (!isRecording || !data) {
      // Idle baseline: Subtle dotted horizon
      ctx.beginPath();
      ctx.strokeStyle = '#D9D3C7';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 4]);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);
      return;
    }

    const { frequencies, rms } = data;
    const barCount = 32;
    const barWidth = (width / barCount) * 0.65;
    const barGap = (width / barCount) * 0.35;
    const centerY = height / 2;

    for (let i = 0; i < barCount; i++) {
      // Sample frequency bin across speech spectrum (concentrated in lower-mid frequencies)
      const freqIndex = Math.min(frequencies.length - 1, Math.floor(i * (frequencies.length / (barCount * 1.5))));
      const freqValue = frequencies[freqIndex] / 255;
      
      // Combine frequency amplitude with overall audio energy RMS
      const amplitude = Math.max(3, (freqValue * 0.7 + rms * 0.3) * (height * 0.85));
      const x = i * (barWidth + barGap) + barGap / 2;
      const y = centerY - amplitude / 2;

      // Color intensity based on signal strength
      const alpha = Math.min(1, 0.4 + freqValue * 0.6);
      ctx.fillStyle = color === '#174C3A' ? `rgba(23, 76, 58, ${alpha})` : `rgba(180, 91, 74, ${alpha})`;

      // Draw rounded vertical bar centered vertically
      const radius = barWidth / 2;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, amplitude, [radius]);
      ctx.fill();
    }
  }, [data, isRecording, color, width, height]);

  return (
    <div className="flex flex-col items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{ width: `${width}px`, height: `${height}px` }}
        className="rounded-lg"
      />
    </div>
  );
};
