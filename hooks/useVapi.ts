/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef, useEffect, useCallback } from "react";
import Vapi from "@vapi-ai/web";
import {
  AnalysisData,
  ConnectionStatus,
  EmotionType,
  AnalysisMode,
} from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const VAPI_PUBLIC_KEY = process.env.VAPI_PUBLIC_KEY || "";

const updateDashboardTool = {
  type: "function",
  messages: [
    {
      type: "request-start",
      content: "",
    },
    {
      type: "request-complete",
      content: "",
    },
    {
      type: "request-failed",
      content: "",
    },
  ],
  function: {
    name: "update_dashboard",
    description:
      "Updates the operator dashboard with current emotional analysis of the caller.",
    parameters: {
      type: "object",
      properties: {
        emotion: {
          type: "string",
          enum: Object.values(EmotionType),
          description: "The detected emotion category.",
        },
        confidence: {
          type: "number",
          description: "Confidence score between 0.0 and 1.0.",
        },
        suggestions: {
          type: "array",
          items: { type: "string" },
          description: "3 short, tactical bullet points for the operator.",
        },
        suggested_opening_line: {
          type: "string",
          description:
            "A specific sentence the operator should say immediately.",
        },
        summary: {
          type: "string",
          description: "A very brief one-sentence summary of the tone.",
        },
      },
      required: [
        "emotion",
        "confidence",
        "suggestions",
        "suggested_opening_line",
        "summary",
      ],
    },
  },
  async: true,
};

export const useVapi = () => {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData | null>(
    null
  );
  const [history, setHistory] = useState<AnalysisData[]>([]);
  const [mode, setModeState] = useState<AnalysisMode>("continuous");
  const [transcript, setTranscript] = useState<string>("");

  const vapiRef = useRef<Vapi | null>(null);
  const modeRef = useRef<AnalysisMode>("continuous");
  const shouldProcessEventsRef = useRef<boolean>(false);

  const setMode = useCallback((m: AnalysisMode) => {
    setModeState(m);
    modeRef.current = m;
  }, []);

  // Defined before usage in useEffect
  const disconnect = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
    }
    setStatus("disconnected");
    shouldProcessEventsRef.current = false;
  }, []);

  // Defined before usage in useEffect
  const handleToolCall = useCallback(
    (toolCall: any) => {
      try {
        const args =
          typeof toolCall.function.arguments === "string"
            ? JSON.parse(toolCall.function.arguments)
            : toolCall.function.arguments;

        const newData: AnalysisData = {
          emotion: args.emotion,
          confidence: args.confidence,
          suggestions: args.suggestions,
          suggestedOpeningLine: args.suggested_opening_line,
          summary: args.summary,
          timestamp: Date.now(),
        };

        setCurrentAnalysis(newData);
        setHistory((prev) => [...prev.slice(-19), newData]);

        if (modeRef.current === "single_shot") {
          console.log("Single shot analysis complete. Disconnecting.");
          shouldProcessEventsRef.current = false;
          disconnect();
        }
      } catch (e) {
        console.error("Error processing tool call", e);
      }
    },
    [disconnect]
  );

  useEffect(() => {
    if (!VAPI_PUBLIC_KEY) {
      console.error("VAPI Public Key missing");
      return;
    }

    const vapi = new Vapi(VAPI_PUBLIC_KEY);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      console.log("Vapi Call Connected");
      setStatus("connected");
      shouldProcessEventsRef.current = true;
    });

    vapi.on("call-end", () => {
      console.log("Vapi Call Ended");
      setStatus("disconnected");
      shouldProcessEventsRef.current = false;
    });

    vapi.on("error", (err: any) => {
      console.error("Vapi Error", err);
      setStatus("error");
      disconnect();
    });

    vapi.on("message", (message: any) => {
      if (!shouldProcessEventsRef.current) return;

      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((prev) => prev + " " + message.transcript);
      }

      if (message.type === "tool-calls") {
        message.toolCalls.forEach((toolCall: any) => {
          if (toolCall.function.name === "update_dashboard") {
            handleToolCall(toolCall);
          }
        });
      }
    });

    return () => {
      vapi.stop();
      vapiRef.current = null;
    };
  }, [disconnect, handleToolCall]);

  const connect = useCallback((assistantId?: string | any) => {
    if (!vapiRef.current) return;
    if (!VAPI_PUBLIC_KEY) {
      alert("Please set VAPI_PUBLIC_KEY in your environment or code.");
      return;
    }

    setHistory([]);
    setCurrentAnalysis(null);
    setTranscript("");
    setStatus("connecting");

    if (typeof assistantId === "string" && assistantId.trim().length > 0) {
      vapiRef.current.start(assistantId);
    } else {
      const assistantOptions = {
        name: "CallSensei",
        firstMessage: "",
        transcriber: {
          provider: "deepgram",
          model: "nova-2",
          language: "en-US",
        },
        model: {
          provider: "openai",
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: SYSTEM_INSTRUCTION,
            },
          ],
          tools: [updateDashboardTool],
        },
        voice: {
          provider: "11labs",
          voiceId: "burt",
        },
      };

      vapiRef.current.start(assistantOptions as any);
    }
  }, []);

  return {
    connect,
    disconnect,
    status,
    currentAnalysis,
    history,
    mode,
    setMode,
    transcript,
  };
};
