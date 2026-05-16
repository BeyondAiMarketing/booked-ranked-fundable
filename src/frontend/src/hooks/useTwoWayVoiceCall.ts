// useTwoWayVoiceCall — two-way in-browser voice call hook
// Uses Web Speech API (SpeechSynthesis + SpeechRecognition) entirely browser-native.
// No external APIs. No credentials needed. Degrades gracefully on iOS Safari.
//
// Architecture:
//  - State machine: idle → requesting-mic → ringing → active → agent-speaking / user-speaking → ended
//  - handleAgentTurn and startListening are stored as refs to break circular useCallback dependencies
//  - speakLines waits for voices to load before speaking (Chrome async voice loading fix)
//  - Niche key normalization: "plumbing" → "plumber", etc.

import { useCallback, useEffect, useRef, useState } from "react";
import { speakLines, waitForVoices } from "./useVoiceAgent";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CallState =
  | "idle"
  | "requesting-mic"
  | "ringing"
  | "active"
  | "agent-speaking"
  | "user-speaking"
  | "ended";

export interface TranscriptLine {
  id: number;
  speaker: "agent" | "caller";
  text: string;
  interim?: boolean;
}

export interface UseTwoWayVoiceCallOptions {
  businessName: string;
  niche: string;
  /**
   * Optional override for agent speech.
   * When provided, this function is called instead of the built-in Web Speech
   * synthesis for each agent turn. The caller is responsible for audio playback.
   * `onDone` MUST be called when the speech is complete to advance the call.
   */
  speakOverride?: (text: string, onDone: () => void) => void;
}

export interface UseTwoWayVoiceCallResult {
  callState: CallState;
  transcript: TranscriptLine[];
  interimText: string;
  currentSpeaker: "agent" | "caller" | null;
  startCall: () => void;
  startListenOnly: () => void;
  endCall: () => void;
  speechRecognitionSupported: boolean;
  callTimer: number; // seconds elapsed
}

// ─── Niche key normalization ──────────────────────────────────────────────────
// The demo passes niche slugs like "plumbing", "carpet-cleaning", etc.
// Map them to the script keys used in NICHE_SCRIPTS.

function normalizeNicheKey(niche: string): string {
  const map: Record<string, string> = {
    plumbing: "plumber",
    plumber: "plumber",
    hvac: "hvac",
    roofing: "roofing",
    "med-spa": "med-spa",
    medspa: "med-spa",
    "carpet-cleaning": "carpet-cleaning",
    carpetcleaning: "carpet-cleaning",
    restoration: "restoration",
    "real-estate": "real-estate",
    realestate: "real-estate",
    mortgage: "mortgage",
    chiropractor: "chiropractor",
    chiro: "chiropractor",
    dental: "dental",
  };
  return map[niche.toLowerCase()] ?? "plumber";
}

// ─── Niche conversation scripts ──────────────────────────────────────────────

interface TurnScript {
  agentName: string;
  agentGreeting: (businessName: string) => string;
  agentFollowUp: (businessName: string) => string;
  agentTimePrompt: (callerName: string) => string;
  agentConfirmation: (businessName: string) => string;
  agentWrapUp: (businessName: string) => string;
  // Simulated caller lines for listen-only mode
  callerLines: string[];
}

const NICHE_SCRIPTS: Record<string, TurnScript> = {
  plumber: {
    agentName: "Sarah",
    agentGreeting: (n) =>
      `Thank you for calling ${n}! This is Sarah with our plumbing team — how can I help you today?`,
    agentFollowUp: (_n) =>
      `I'd be happy to help with that. Can I get your name and the address where you need service?`,
    agentTimePrompt: (cn) =>
      `Perfect, ${cn}! What time works best for you — morning, afternoon, or evening?`,
    agentConfirmation: (_n) =>
      `Wonderful! I've got you all scheduled. You'll receive a confirmation text shortly. Is there anything else I can help you with?`,
    agentWrapUp: (n) =>
      `Perfect! We look forward to helping you. Thanks for calling ${n} — have a great day!`,
    callerLines: [
      "Hi, I have a burst pipe and water is everywhere",
      "My name is Mike, and I'm at 4821 Oak Street",
      "Mornings work great for me",
      "No, that's everything, thank you",
    ],
  },
  hvac: {
    agentName: "Jessica",
    agentGreeting: (n) =>
      `Thank you for calling ${n}! This is Jessica with our HVAC specialists — how can I help you today?`,
    agentFollowUp: (_n) =>
      `Absolutely, we can take care of that! What's your name and address so we can send a tech right out?`,
    agentTimePrompt: (cn) =>
      `Got it, ${cn}! What time works best — morning, afternoon, or evening?`,
    agentConfirmation: (_n) =>
      `Wonderful! I've got you all scheduled. You'll receive a confirmation text shortly. Is there anything else I can help you with?`,
    agentWrapUp: (n) =>
      `Perfect! We'll see you then. Thanks for calling ${n} — have a great day!`,
    callerLines: [
      "My AC stopped working and it's 95 degrees inside",
      "I'm Sarah Johnson at 312 Elm Avenue",
      "Afternoon would be perfect",
      "No, that's it, thank you so much",
    ],
  },
  roofing: {
    agentName: "Ashley",
    agentGreeting: (n) =>
      `Thank you for calling ${n}! This is Ashley with our roofing team — how can I help you today?`,
    agentFollowUp: (_n) =>
      `We can get someone out to take a look right away. What's your name and the property address?`,
    agentTimePrompt: (cn) =>
      `Perfect, ${cn}! Would morning, afternoon, or evening work better for the inspection?`,
    agentConfirmation: (_n) =>
      `Wonderful! I've got you all scheduled. You'll receive a confirmation text shortly. Is there anything else I can help you with?`,
    agentWrapUp: (n) =>
      `Perfect! We'll see you then. Thanks for calling ${n} — have a great day!`,
    callerLines: [
      "We had hail last night and I think I have roof damage",
      "Tom Williams, 7823 Maple Drive",
      "Morning works better for me",
      "That's all, thank you",
    ],
  },
  "med-spa": {
    agentName: "Sophia",
    agentGreeting: (n) =>
      `Thank you for calling ${n}! This is Sophia with our medical spa team — how can I help you today?`,
    agentFollowUp: (_n) =>
      `Wonderful! We'd love to help you with that. Can I get your name and best contact number?`,
    agentTimePrompt: (cn) =>
      `Perfect, ${cn}! What time works best for you — morning, afternoon, or evening?`,
    agentConfirmation: (_n) =>
      `Wonderful! I've got you all scheduled. You'll receive a confirmation text shortly. Is there anything else I can help you with?`,
    agentWrapUp: (n) =>
      `Perfect! We look forward to seeing you. Thanks for calling ${n} — have a beautiful day!`,
    callerLines: [
      "I'm interested in booking a Botox consultation",
      "I'm Jennifer Chen, my number is 555-0192",
      "Afternoons are best for me",
      "No, that's everything, thank you",
    ],
  },
  "carpet-cleaning": {
    agentName: "Amanda",
    agentGreeting: (n) =>
      `Thank you for calling ${n}! This is Amanda with our carpet cleaning team — how can I help you today?`,
    agentFollowUp: (_n) =>
      `Perfect! We have availability this week. What's your name and the address we'd be coming to?`,
    agentTimePrompt: (cn) =>
      `Got it, ${cn}! Would morning, afternoon, or evening work better for the cleaning?`,
    agentConfirmation: (_n) =>
      `Wonderful! I've got you all scheduled. You'll receive a confirmation text shortly. Is there anything else I can help you with?`,
    agentWrapUp: (n) =>
      `Perfect! We'll see you then. Thanks for calling ${n} — have a great day!`,
    callerLines: [
      "I need 4 rooms cleaned before a big family gathering",
      "Amanda Rodriguez, 925 Cedar Lane",
      "Morning would work great",
      "No, that covers it, thank you",
    ],
  },
  restoration: {
    agentName: "Lauren",
    agentGreeting: (n) =>
      `Thank you for calling ${n}! This is Lauren with our restoration specialists — we're available 24/7. How can I help you?`,
    agentFollowUp: (_n) =>
      `We can get someone out immediately. What's your name and the address of the property?`,
    agentTimePrompt: (cn) =>
      `${cn}, we can dispatch a crew right away. What time works best — or do you need us there as soon as possible?`,
    agentConfirmation: (_n) =>
      `Got it. A crew is being dispatched now and you'll receive a text with the arrival time. Anything else I can help with?`,
    agentWrapUp: (n) =>
      `Help is on the way. Thank you for calling ${n} — we'll take care of everything.`,
    callerLines: [
      "Our basement flooded and there's water everywhere",
      "David Kim, 1403 River Road",
      "Please, as soon as possible",
      "No, just please hurry, thank you",
    ],
  },
  "real-estate": {
    agentName: "Emily",
    agentGreeting: (n) =>
      `Thank you for calling ${n}! This is Emily with our real estate team — how can I help you today?`,
    agentFollowUp: (_n) =>
      `Great, I can connect you with one of our agents right away. What's your name and the best number to reach you?`,
    agentTimePrompt: (cn) =>
      `Perfect, ${cn}! When would you be available for a quick call — morning, afternoon, or evening?`,
    agentConfirmation: (_n) =>
      "Wonderful! An agent will reach out to you shortly. Is there anything else I can help you with?",
    agentWrapUp: (n) =>
      `Perfect! Looking forward to helping you. Thanks for calling ${n} — have a great day!`,
    callerLines: [
      "I'm thinking about selling my home and want to know what it's worth",
      "Lisa Thompson, best number is 555-0847",
      "Mornings are easiest for me",
      "No, that's great, thank you",
    ],
  },
  mortgage: {
    agentName: "Rachel",
    agentGreeting: (n) =>
      `Thank you for calling ${n}! This is Rachel with our mortgage team — how can I help you today?`,
    agentFollowUp: (_n) =>
      `Excellent! We can get you pre-qualified quickly. What's your name and the best number to reach you?`,
    agentTimePrompt: (cn) =>
      `Perfect, ${cn}! A loan officer will reach out shortly. Would morning, afternoon, or evening work best?`,
    agentConfirmation: (_n) =>
      `Wonderful! I've got you all set. You'll receive a confirmation text shortly. Is there anything else I can help you with?`,
    agentWrapUp: (n) =>
      `Perfect! We'll be in touch soon. Thanks for calling ${n} — have a great day!`,
    callerLines: [
      "I want to look into buying my first home and getting pre-approved",
      "James Martinez, my number is 555-0361",
      "Afternoons work best for me",
      "No, that's everything, thank you",
    ],
  },
  chiropractor: {
    agentName: "Dr. Kim's office",
    agentGreeting: (n) =>
      `Thank you for calling ${n}! This is the front desk — how can I help you today?`,
    agentFollowUp: (_n) =>
      `We'd love to help you with that. What's your name and are you a new or existing patient?`,
    agentTimePrompt: (cn) =>
      `Perfect, ${cn}! Would morning, afternoon, or evening work best for your appointment?`,
    agentConfirmation: (_n) =>
      `Wonderful! I've got you all scheduled. You'll receive a confirmation text shortly. Is there anything else I can help you with?`,
    agentWrapUp: (n) =>
      `Perfect! We'll see you then. Thanks for calling ${n} — have a great day!`,
    callerLines: [
      "I've been having really bad lower back pain for the past week",
      "Maria Santos, and I'm a new patient",
      "Mornings work great for me",
      "No, that's all, thank you",
    ],
  },
  dental: {
    agentName: "Dr. Smith's office",
    agentGreeting: (n) =>
      `Thank you for calling ${n}! This is the front desk — how can I help you today?`,
    agentFollowUp: (_n) =>
      `We can definitely help with that. What's your name and are you an existing patient with us?`,
    agentTimePrompt: (cn) =>
      `Got it, ${cn}! Would morning, afternoon, or evening be more convenient for you?`,
    agentConfirmation: (_n) =>
      `Wonderful! I've got you all scheduled. You'll receive a confirmation text shortly. Is there anything else I can help you with?`,
    agentWrapUp: (n) =>
      `Perfect! We'll see you then. Thanks for calling ${n} — have a great smile today!`,
    callerLines: [
      "I need to schedule an appointment — I have a toothache on the left side",
      "Robert Davis, I'm a new patient",
      "Afternoon would work better",
      "No, that's everything, thank you",
    ],
  },
};

// ─── Keyword matching for speech recognition ─────────────────────────────────

function matchTurn(transcript: string, currentTurn: number): number | null {
  const lower = transcript.toLowerCase().trim();

  if (currentTurn === 1) {
    // Turn 1: user responded to greeting — always advance
    if (lower.length > 1) return 2;
  }
  if (currentTurn === 2) {
    // Turn 2: user gave name/address info — always advance
    if (lower.length > 1) return 3;
  }
  if (currentTurn === 3) {
    // Turn 3: user gave time preference — always advance
    if (lower.length > 1) return 4;
  }
  if (currentTurn === 4) {
    // Turn 4: wrap up
    if (lower.length > 0) return 5;
  }

  return null;
}

// ─── Check SpeechRecognition support ─────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecognition = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSpeechRecognition(): (new () => AnyRecognition) | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const SR =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;
  return SR ?? null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTwoWayVoiceCall({
  businessName,
  niche,
  speakOverride,
}: UseTwoWayVoiceCallOptions): UseTwoWayVoiceCallResult {
  const [callState, setCallState] = useState<CallState>("idle");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [interimText, setInterimText] = useState("");
  const [currentSpeaker, setCurrentSpeaker] = useState<
    "agent" | "caller" | null
  >(null);
  const [callTimer, setCallTimer] = useState(0);

  const micStreamRef = useRef<MediaStream | null>(null);
  const recognitionRef = useRef<AnyRecognition | null>(null);
  const cancelSpeakRef = useRef<(() => void) | null>(null);
  const lineIdRef = useRef(0);
  const turnRef = useRef(0); // current conversation turn (1-5)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callerNameRef = useRef<string>(""); // captured name from turn 2
  const listenOnlyRef = useRef(false); // mirrors listenOnlyMode for refs

  // Store callbacks in refs to break circular dependencies
  // handleAgentTurn → startListening → handleAgentTurn would cause stale closures
  const handleAgentTurnRef = useRef<(turn: number) => void>(() => {});
  const startListeningRef = useRef<() => void>(() => {});

  const scriptKey = normalizeNicheKey(niche);
  const script = NICHE_SCRIPTS[scriptKey] ?? NICHE_SCRIPTS.plumber;

  const speechRecognitionSupported = !!getSpeechRecognition();

  // ── Helpers ──────────────────────────────────────────────────────────────

  const addLine = useCallback((speaker: "agent" | "caller", text: string) => {
    const id = ++lineIdRef.current;
    setTranscript((prev) => [...prev, { id, speaker, text }]);
    return id;
  }, []);

  const startTimer = useCallback(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setCallTimer(0);
    timerIntervalRef.current = setInterval(() => {
      setCallTimer((t) => t + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const stopRecognition = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    try {
      recognitionRef.current?.stop();
    } catch (_) {
      // ignore
    }
    recognitionRef.current = null;
    setInterimText("");
  }, []);

  const stopMic = useCallback(() => {
    if (micStreamRef.current) {
      for (const track of micStreamRef.current.getTracks()) {
        track.stop();
      }
      micStreamRef.current = null;
    }
  }, []);

  // ── End call ──────────────────────────────────────────────────────────────

  const endCall = useCallback(() => {
    cancelSpeakRef.current?.();
    cancelSpeakRef.current = null;
    stopRecognition();
    stopMic();
    stopTimer();
    setCurrentSpeaker(null);
    setInterimText("");
    setCallState("ended");
  }, [stopRecognition, stopMic, stopTimer]);

  // ── Speak agent turn ──────────────────────────────────────────────────────
  // Uses waitForVoices to ensure Chrome has voices loaded before speaking.

  const speakAgentTurn = useCallback(
    (text: string, onDone?: () => void) => {
      setCallState("agent-speaking");
      setCurrentSpeaker("agent");
      cancelSpeakRef.current?.();

      if (speakOverride) {
        // Caller-supplied TTS (e.g. ElevenLabs) — skip Web Speech entirely
        speakOverride(text, () => {
          setCurrentSpeaker(null);
          onDone?.();
        });
        return;
      }

      // Default Web Speech path — wait for voices, then speak
      waitForVoices().then(() => {
        // Small delay to allow audio context to settle (avoids silent first utterance)
        setTimeout(() => {
          cancelSpeakRef.current = speakLines({
            lines: [text],
            pauseBetweenMs: 200,
            onAllDone: () => {
              setCurrentSpeaker(null);
              onDone?.();
            },
          });
        }, 300);
      });
    },
    [speakOverride],
  );

  // ── Start listening turn ──────────────────────────────────────────────────
  // Stored in ref to avoid stale closure in handleAgentTurn

  const startListeningImpl = useCallback(() => {
    const SR = getSpeechRecognition();
    if (!SR || listenOnlyRef.current) return;

    setCallState("user-speaking");
    setCurrentSpeaker("caller");
    setInterimText("");

    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    // Silence timeout — if no speech for 5s, prompt and retry once
    silenceTimerRef.current = setTimeout(() => {
      stopRecognition();
      const retryText =
        "I'm sorry, I didn't catch that. Could you say that again?";
      addLine("agent", retryText);
      speakAgentTurn(retryText, () => {
        // After retry prompt, listen once more then advance regardless
        const SR2 = getSpeechRecognition();
        if (!SR2 || listenOnlyRef.current) {
          turnRef.current = Math.min(turnRef.current + 1, 5);
          handleAgentTurnRef.current(turnRef.current);
          return;
        }

        setCallState("user-speaking");
        setCurrentSpeaker("caller");
        const r2 = new SR2();
        r2.continuous = false;
        r2.interimResults = true;
        r2.lang = "en-US";
        recognitionRef.current = r2;

        // Second silence timeout — advance turn regardless
        silenceTimerRef.current = setTimeout(() => {
          stopRecognition();
          setCurrentSpeaker(null);
          turnRef.current = Math.min(turnRef.current + 1, 5);
          handleAgentTurnRef.current(turnRef.current);
        }, 5000);

        r2.onresult = (event: AnyRecognition) => {
          if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
          }
          let interim = "";
          let final = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const r = event.results[i];
            if (r.isFinal) final += r[0].transcript;
            else interim += r[0].transcript;
          }
          if (interim) setInterimText(interim);
          if (final) {
            setInterimText("");
            addLine("caller", final);
            stopRecognition();
            const nextTurn = matchTurn(final, turnRef.current);
            if (nextTurn !== null) {
              turnRef.current = nextTurn;
            } else {
              turnRef.current = Math.min(turnRef.current + 1, 5);
            }
            handleAgentTurnRef.current(turnRef.current);
          }
        };
        r2.onerror = () => {
          stopRecognition();
          setCurrentSpeaker(null);
          turnRef.current = Math.min(turnRef.current + 1, 5);
          handleAgentTurnRef.current(turnRef.current);
        };
        r2.onend = () => {};
        try {
          r2.start();
        } catch (_) {
          stopRecognition();
        }
      });
    }, 5000);

    recognition.onresult = (event: AnyRecognition) => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const r = event.results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      if (interim) setInterimText(interim);
      if (final) {
        setInterimText("");
        addLine("caller", final);

        // Try to extract caller name on turn 2
        if (turnRef.current === 2) {
          const words = final.trim().split(/\s+/);
          const nameWords = words.filter(
            (w) =>
              w.length > 2 &&
              /^[A-Z]/i.test(w) &&
              ![
                "my",
                "i'm",
                "im",
                "name",
                "is",
                "and",
                "the",
                "at",
                "hi",
                "hello",
                "it's",
                "its",
                "a",
              ].includes(w.toLowerCase()),
          );
          if (nameWords.length > 0) {
            callerNameRef.current = nameWords.slice(0, 2).join(" ");
          }
        }

        stopRecognition();
        const nextTurn = matchTurn(final, turnRef.current);
        if (nextTurn !== null) {
          turnRef.current = nextTurn;
        } else {
          turnRef.current = Math.min(turnRef.current + 1, 5);
        }
        handleAgentTurnRef.current(turnRef.current);
      }
    };

    recognition.onerror = (event: AnyRecognition) => {
      stopRecognition();
      setCurrentSpeaker(null);
      // "not-allowed" = mic denied mid-call — switch to listen-only
      if (event.error === "not-allowed") {
        listenOnlyRef.current = true;
        return;
      }
      // "no-speech" or other — advance turn
      setCallState("active");
    };

    recognition.onend = () => {
      // Recognition ended without final result — clean up
    };

    try {
      recognition.start();
    } catch (_) {
      stopRecognition();
    }
  }, [stopRecognition, speakAgentTurn, addLine]);

  // Keep startListeningRef in sync
  useEffect(() => {
    startListeningRef.current = startListeningImpl;
  }, [startListeningImpl]);

  // ── Agent turn handler ────────────────────────────────────────────────────

  const handleAgentTurnImpl = useCallback(
    (turn: number) => {
      let agentText = "";
      const callerName = callerNameRef.current || "";

      switch (turn) {
        case 1:
          agentText = script.agentGreeting(businessName);
          break;
        case 2:
          agentText = script.agentFollowUp(businessName);
          break;
        case 3:
          agentText = script.agentTimePrompt(callerName || "great");
          break;
        case 4:
          agentText = script.agentConfirmation(businessName);
          break;
        case 5:
          agentText = script.agentWrapUp(businessName);
          break;
        default:
          endCall();
          return;
      }

      addLine("agent", agentText);
      speakAgentTurn(agentText, () => {
        if (turn >= 5) {
          // End call after wrap-up with a short pause
          setTimeout(() => {
            setCallState("ended");
            stopTimer();
            setCurrentSpeaker(null);
          }, 1200);
        } else {
          setCallState("active");
          // Small delay before listening to let audio context settle
          setTimeout(() => {
            startListeningRef.current();
          }, 400);
        }
      });
    },
    [script, businessName, addLine, speakAgentTurn, endCall, stopTimer],
  );

  // Keep handleAgentTurnRef in sync
  useEffect(() => {
    handleAgentTurnRef.current = handleAgentTurnImpl;
  }, [handleAgentTurnImpl]);

  // ── Listen-only mode: play scripted conversation automatically ────────────

  const runListenOnlyMode = useCallback(() => {
    listenOnlyRef.current = true;
    setCallState("active");
    startTimer();
    turnRef.current = 1;

    const pairs: Array<{ agent: string; caller: string }> = [
      {
        agent: script.agentGreeting(businessName),
        caller: script.callerLines[0],
      },
      {
        agent: script.agentFollowUp(businessName),
        caller: script.callerLines[1],
      },
      {
        agent: script.agentTimePrompt(""),
        caller: script.callerLines[2],
      },
      {
        agent: script.agentConfirmation(businessName),
        caller: script.callerLines[3],
      },
      {
        agent: script.agentWrapUp(businessName),
        caller: "",
      },
    ];

    let idx = 0;
    let isCancelled = false;
    cancelSpeakRef.current?.();

    function playNext() {
      if (isCancelled) return;
      if (idx >= pairs.length) {
        setCallState("ended");
        stopTimer();
        setCurrentSpeaker(null);
        return;
      }
      const pair = pairs[idx];
      idx++;
      addLine("agent", pair.agent);
      setCurrentSpeaker("agent");
      setCallState("agent-speaking");

      if (speakOverride) {
        // ElevenLabs or caller-supplied TTS
        speakOverride(pair.agent, () => {
          if (isCancelled) return;
          setCurrentSpeaker(null);
          if (!pair.caller) {
            setTimeout(() => {
              if (isCancelled) return;
              setCallState("ended");
              stopTimer();
            }, 1200);
            return;
          }
          setTimeout(() => {
            if (isCancelled) return;
            addLine("caller", pair.caller);
            setCurrentSpeaker("caller");
            setCallState("user-speaking");
            setTimeout(() => {
              if (isCancelled) return;
              setCurrentSpeaker(null);
              setCallState("active");
              playNext();
            }, 2000);
          }, 500);
        });
        // Allow external cancel
        const prevCancel = cancelSpeakRef.current;
        cancelSpeakRef.current = () => {
          isCancelled = true;
          prevCancel?.();
        };
      } else {
        cancelSpeakRef.current = speakLines({
          lines: [pair.agent],
          onAllDone: () => {
            if (isCancelled) return;
            setCurrentSpeaker(null);
            if (!pair.caller) {
              setTimeout(() => {
                if (isCancelled) return;
                setCallState("ended");
                stopTimer();
              }, 1200);
              return;
            }
            // Show caller text after a pause to simulate them speaking
            setTimeout(() => {
              if (isCancelled) return;
              addLine("caller", pair.caller);
              setCurrentSpeaker("caller");
              setCallState("user-speaking");
              // After showing caller line, play next agent turn
              setTimeout(() => {
                if (isCancelled) return;
                setCurrentSpeaker(null);
                setCallState("active");
                playNext();
              }, 2000);
            }, 500);
          },
        });

        // Override cancel to propagate isCancelled
        const prevCancel = cancelSpeakRef.current;
        cancelSpeakRef.current = () => {
          isCancelled = true;
          prevCancel?.();
        };
      }
    }

    // Wait for voices before starting listen-only playback (skipped when speakOverride is provided)
    if (speakOverride) {
      if (!isCancelled) setTimeout(playNext, 300);
    } else {
      waitForVoices().then(() => {
        if (!isCancelled) setTimeout(playNext, 300);
      });
    }
  }, [script, businessName, addLine, startTimer, stopTimer, speakOverride]);

  // ── Start call (with mic) ─────────────────────────────────────────────────

  const startCall = useCallback(() => {
    setCallState("requesting-mic");
    setTranscript([]);
    setCallTimer(0);
    turnRef.current = 1;
    callerNameRef.current = "";
    listenOnlyRef.current = false;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        micStreamRef.current = stream;
        setCallState("ringing");
        // Ringing for 2s then start call
        setTimeout(() => {
          setCallState("active");
          startTimer();
          // Start with agent greeting (turn 1) — delay 300ms to let audio context start
          setTimeout(() => {
            handleAgentTurnRef.current(1);
          }, 300);
        }, 2000);
      })
      .catch(() => {
        // Permission denied or not available — fall back to listen-only
        listenOnlyRef.current = true;
        setCallState("ringing");
        setTimeout(() => {
          runListenOnlyMode();
        }, 2000);
      });
  }, [startTimer, runListenOnlyMode]);

  // ── Start listen-only explicitly ─────────────────────────────────────────

  const startListenOnly = useCallback(() => {
    setCallState("ringing");
    setTranscript([]);
    setCallTimer(0);
    turnRef.current = 1;
    callerNameRef.current = "";
    listenOnlyRef.current = true;
    setTimeout(() => {
      runListenOnlyMode();
    }, 2000);
  }, [runListenOnlyMode]);

  // ── Cleanup on unmount ────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      cancelSpeakRef.current?.();
      stopRecognition();
      stopMic();
      stopTimer();
    };
  }, [stopRecognition, stopMic, stopTimer]);

  return {
    callState,
    transcript,
    interimText,
    currentSpeaker,
    startCall,
    startListenOnly,
    endCall,
    speechRecognitionSupported,
    callTimer,
  };
}
