// Convert Float32Array (browser audio) to Int16Array (PCM for Gemini)
export function floatTo16BitPCM(float32Array: Float32Array): ArrayBuffer {
  const buffer = new ArrayBuffer(float32Array.length * 2);
  const view = new DataView(buffer);
  let offset = 0;
  for (let i = 0; i < float32Array.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
  return buffer;
}

// Base64 encode for Gemini Live API
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Downsample audio buffer to 16kHz
export function downsampleTo16k(buffer: Float32Array, inputSampleRate: number): Float32Array {
  if (inputSampleRate === 16000) {
    return buffer;
  }
  
  const ratio = inputSampleRate / 16000;
  const newLength = Math.ceil(buffer.length / ratio);
  const result = new Float32Array(newLength);
  
  for (let i = 0; i < newLength; i++) {
    const offset = Math.floor(i * ratio);
    if (offset < buffer.length) {
      result[i] = buffer[offset];
    }
  }
  
  return result;
}