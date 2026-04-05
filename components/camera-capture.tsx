"use client";

import { Camera, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function stopTracks(stream: MediaStream | null) {
  stream?.getTracks().forEach((t) => t.stop());
}

function pickVideoMimeType(): string | undefined {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
  ];
  if (typeof MediaRecorder === "undefined") return undefined;
  for (const c of candidates) {
    if (MediaRecorder.isTypeSupported(c)) return c;
  }
  return undefined;
}

type PhotoDialogProps = {
  open: boolean;
  stream: MediaStream | null;
  onClose: () => void;
  onCaptured: (dataUrl: string) => void;
};

/** Live preview from a stream obtained via getUserMedia (call getUserMedia in the user’s click handler for iOS). */
export function CameraPhotoDialog({ open, stream, onClose, onCaptured }: PhotoDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!open || !stream || !v) return;
    v.srcObject = stream;
    v.play().catch(() => {});
    return () => {
      v.srcObject = null;
    };
  }, [open, stream]);

  function capture() {
    const video = videoRef.current;
    if (!video || video.videoWidth < 2) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
    onCaptured(dataUrl);
    onClose();
  }

  if (!open || !stream) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-police-950/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
      {/* Fixed height + flex so preview never pushes Capture/Cancel off-screen (aspect-[3/4] + max-h clipped the footer on web). */}
      <div className="flex h-[min(90dvh,100vh)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:h-[min(85vh,720px)] sm:rounded-2xl md:ring-1 md:ring-white/20">
        <div className="flex shrink-0 items-center justify-between border-b border-police-800 bg-police-900 px-4 py-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Camera className="h-5 w-5 text-emerald-400" />
            Take photo
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/80 hover:bg-white/10"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="relative min-h-[min(50vh,320px)] flex-1 bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="flex shrink-0 gap-3 border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={capture}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-emerald-700"
          >
            <Camera className="h-4 w-4" />
            Capture
          </button>
        </div>
      </div>
    </div>
  );
}

type VideoDialogProps = {
  open: boolean;
  stream: MediaStream | null;
  onClose: () => void;
  onRecorded: (dataUrl: string) => void;
};

export function CameraVideoDialog({ open, stream, onClose, onRecorded }: VideoDialogProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!open || !stream || !v) return;
    v.srcObject = stream;
    v.play().catch(() => {});
    return () => {
      v.srcObject = null;
    };
  }, [open, stream]);

  useEffect(() => {
    if (!open) {
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }
      recorderRef.current = null;
      chunksRef.current = [];
      setRecording(false);
      setError(null);
    }
  }, [open]);

  function startRecord() {
    if (!stream) return;
    const mime = pickVideoMimeType();
    if (!mime) {
      setError("Recording not supported in this browser. Use “Upload video” instead.");
      return;
    }
    setError(null);
    chunksRef.current = [];
    try {
      const rec = new MediaRecorder(stream, { mimeType: mime });
      recorderRef.current = rec;
      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const base = mime.split(";")[0] || "video/webm";
        const blob = new Blob(chunksRef.current, { type: base });
        const reader = new FileReader();
        reader.onloadend = () => {
          const r = reader.result;
          if (typeof r === "string") {
            onRecorded(r);
            onClose();
          }
        };
        reader.readAsDataURL(blob);
      };
      rec.start(200);
      setRecording(true);
    } catch {
      setError("Could not start recording.");
    }
  }

  function stopRecord() {
    const rec = recorderRef.current;
    if (rec && rec.state === "recording") {
      rec.stop();
    }
    setRecording(false);
  }

  if (!open || !stream) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-police-950/60 p-0 backdrop-blur-[2px] sm:items-center sm:p-4">
      <div className="flex h-[min(90dvh,100vh)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:h-[min(85vh,720px)] sm:rounded-2xl md:ring-1 md:ring-white/20">
        <div className="flex shrink-0 items-center justify-between border-b border-police-800 bg-police-900 px-4 py-3">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <Video className="h-5 w-5 text-emerald-400" />
            Record video
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-white/80 hover:bg-white/10"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="relative min-h-[min(40vh,280px)] flex-1 bg-black">
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
          />
          {recording ? (
            <div className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
              REC
            </div>
          ) : null}
        </div>
        {error ? (
          <p className="shrink-0 px-4 py-2 text-sm text-red-600">{error}</p>
        ) : null}
        <div className="flex shrink-0 flex-wrap gap-3 border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.08)]">
          <button
            type="button"
            onClick={onClose}
            className="min-w-[100px] flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-700"
          >
            Cancel
          </button>
          {!recording ? (
            <button
              type="button"
              onClick={startRecord}
              className="min-w-[100px] flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white"
            >
              Start recording
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecord}
              className="min-w-[100px] flex-1 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white"
            >
              Stop & save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { stopTracks };
