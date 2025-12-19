import { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { AnalysisData, ConnectionStatus, EmotionType, AnalysisMode } from '../types';
import { SYSTEM_INSTRUCTION, SAMPLE_RATE } from '../constants';
import { floatTo16BitPCM, arrayBufferToBase64, downsampleTo16k } from '../utils/audioUtils';

const API_KEY = process.env.API_KEY || '';

const updateDashboardTool: FunctionDeclaration = {
  name: 'update_dashboard',
  description: 'Updates the operator dashboard with current emotional analysis of the caller.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      emotion: {
        type: Type.STRING,
        enum: Object.values(EmotionType),
        description: 'The detected emotion category.',
      },
      confidence: {
        type: Type.NUMBER,
        description: 'Confidence score between 0.0 and 1.0.',
      },
      suggestions: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: '3 short, tactical bullet points for the operator.',
      },
      summary: {
        type: Type.STRING,
        description: 'A very brief one-sentence summary of the tone.',
      },
    },
    required: ['emotion', 'confidence', 'suggestions', 'summary'],
  },
};

export const useGeminiLive = () => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData | null>(null);
  const [history, setHistory] = useState<AnalysisData[]>([]);
  const [mode, setModeState] = useState<AnalysisMode>('continuous');
  
  // Refs for audio and session
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sessionPromiseRef = useRef<Promise<any> | null>(null);
  const aiClientRef = useRef<GoogleGenAI | null>(null);

  // Ref to track mode inside callbacks without closure issues
  const modeRef = useRef<AnalysisMode>('continuous');

  const setMode = useCallback((m: AnalysisMode) => {
    setModeState(m);
    modeRef.current = m;
  }, []);

  const disconnect = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setStatus('disconnected');
    // Note: We do NOT clear currentAnalysis here so the user can see the last result after single-shot
  }, []);

  const connect = useCallback(async () => {
    if (!API_KEY) {
      console.error("API Key missing");
      setStatus('error');
      return;
    }

    // Clear history on new connection, but we can keep the last analysis on screen until a new one comes in if we want.
    // Let's clear everything for a fresh start.
    setHistory([]);
    setCurrentAnalysis(null);

    try {
      setStatus('connecting');
      
      // 1. Initialize Audio Input
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          autoGainControl: false,
          echoCancellation: false,
          noiseSuppression: false,
        },
      });
      streamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      // Processor for PCM extraction
      const processor = audioContext.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(audioContext.destination);

      // 2. Initialize Gemini Client
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      aiClientRef.current = ai;

      // 3. Connect to Live Session
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          },
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          tools: [{ functionDeclarations: [updateDashboardTool] }],
        },
        callbacks: {
          onopen: () => {
            console.log("Gemini Live Connected");
            setStatus('connected');
          },
          onmessage: (message: LiveServerMessage) => {
            // Check for Tool Calls
            if (message.toolCall) {
              message.toolCall.functionCalls.forEach((fc) => {
                if (fc.name === 'update_dashboard') {
                  const args = fc.args as any;
                  const newData: AnalysisData = {
                    emotion: args.emotion,
                    confidence: args.confidence,
                    suggestions: args.suggestions,
                    summary: args.summary,
                    timestamp: Date.now(),
                  };
                  
                  setCurrentAnalysis(newData);
                  setHistory(prev => [...prev.slice(-19), newData]); 

                  sessionPromise.then(session => {
                    session.sendToolResponse({
                      functionResponses: [{
                        id: fc.id,
                        name: fc.name,
                        response: { result: "Dashboard updated" }
                      }]
                    });
                  });

                  // If in Single Shot mode, disconnect after receiving the first analysis
                  if (modeRef.current === 'single_shot') {
                    console.log("Single shot analysis complete. Disconnecting.");
                    disconnect();
                  }
                }
              });
            }
          },
          onclose: () => {
            console.log("Gemini Live Closed");
            setStatus('disconnected');
          },
          onerror: (err) => {
            console.error("Gemini Live Error", err);
            setStatus('error');
            disconnect();
          }
        }
      });
      
      sessionPromiseRef.current = sessionPromise;

      // 4. Start Audio Streaming
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const downsampledData = downsampleTo16k(inputData, audioContext.sampleRate);
        const pcmBuffer = floatTo16BitPCM(downsampledData);
        const base64Data = arrayBufferToBase64(pcmBuffer);

        sessionPromise.then((session) => {
            session.sendRealtimeInput({
                media: {
                    mimeType: `audio/pcm;rate=${SAMPLE_RATE}`,
                    data: base64Data
                }
            });
        }).catch(err => {
            console.error("Session send error", err);
        });
      };

    } catch (err) {
      console.error("Failed to connect", err);
      setStatus('error');
      disconnect();
    }
  }, [disconnect]); // disconnect is stable from useCallback

  return { 
    connect, 
    disconnect, 
    status, 
    currentAnalysis, 
    history,
    mode,
    setMode
  };
};
