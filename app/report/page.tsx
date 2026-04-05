"use client";

import dynamic from "next/dynamic";
import {
  Camera,
  CarFront,
  ChevronDown,
  Clock,
  ImageUp,
  ListFilter,
  MapPin,
  MessageSquare,
  Send,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  CameraPhotoDialog,
  CameraVideoDialog,
  stopTracks,
} from "@/components/camera-capture";
import { AuthGate } from "@/components/auth-gate";
import { AppShell } from "@/components/app-shell";
import { SuccessDialog } from "@/components/success-dialog";
import { OFFENCE_TYPES } from "@/lib/offences";
import { addReport, reportId } from "@/lib/report-storage";
import type { Report } from "@/lib/types";

const ReportMap = dynamic(() => import("@/components/map/report-map"), {
  ssr: false,
  loading: () => (
    <div className="min-h-[220px] animate-pulse rounded-xl bg-slate-200" />
  ),
});

const DEFAULT = { lat: 23.8103, lng: 90.4125 };

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("read failed"));
    r.readAsDataURL(file);
  });
}

export default function ReportPage() {
  const router = useRouter();
  const [pos, setPos] = useState(DEFAULT);
  const [geoNote, setGeoNote] = useState<string | null>(() =>
    typeof navigator !== "undefined" && !navigator.geolocation
      ? "Geolocation not available. Showing default area."
      : null,
  );
  const [reportedAt] = useState(() => new Date().toISOString());
  const [offenceType, setOffenceType] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [comment, setComment] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [videoDataUrl, setVideoDataUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);

  const [photoOpen, setPhotoOpen] = useState(false);
  const [photoStream, setPhotoStream] = useState<MediaStream | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setPos({ lat: p.coords.latitude, lng: p.coords.longitude });
      },
      () => {
        setGeoNote("Could not get your location. Showing default area.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
    );
  }, []);

  const closePhotoCamera = useCallback(() => {
    stopTracks(photoStream);
    setPhotoStream(null);
    setPhotoOpen(false);
  }, [photoStream]);

  const closeVideoCamera = useCallback(() => {
    stopTracks(videoStream);
    setVideoStream(null);
    setVideoOpen(false);
  }, [videoStream]);

  const openPhotoCamera = useCallback(async () => {
    setFormError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      setPhotoStream(stream);
      setPhotoOpen(true);
    } catch {
      setFormError(
        "Could not open the camera. Allow permission, use HTTPS (or localhost), or use Upload photo.",
      );
    }
  }, []);

  const openVideoCamera = useCallback(async () => {
    setFormError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: true,
      });
      setVideoStream(stream);
      setVideoOpen(true);
    } catch {
      setFormError(
        "Could not open the camera/mic. Allow permission, use HTTPS (or localhost), or use Upload video.",
      );
    }
  }, []);

  const onPickImageFromFiles = useCallback(() => imgRef.current?.click(), []);
  const onPickVideoFromFiles = useCallback(() => vidRef.current?.click(), []);

  async function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await readFileAsDataUrl(f);
      setImageDataUrl(url);
      setFormError(null);
    } catch {
      setFormError("Could not read image.");
    }
  }

  async function onVideoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await readFileAsDataUrl(f);
      setVideoDataUrl(url);
      setFormError(null);
    } catch {
      setFormError("Could not read video.");
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!offenceType) {
      setFormError("Select an offence type.");
      return;
    }
    const v = vehicleNumber.trim().toUpperCase();
    if (v.length < 3) {
      setFormError("Enter a valid vehicle number.");
      return;
    }
    if (!imageDataUrl && !videoDataUrl) {
      setFormError("Add a photo or a video recording.");
      return;
    }

    const report: Report = {
      id: reportId(),
      status: "pending",
      offenceType,
      vehicleNumber: v,
      reportedAt,
      comment: comment.trim(),
      lat: pos.lat,
      lng: pos.lng,
      hasImage: !!imageDataUrl,
      hasVideo: !!videoDataUrl,
      imageDataUrl,
      videoDataUrl,
      createdAt: new Date().toISOString(),
    };
    try {
      addReport(report);
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Could not save the report. Storage may be full.",
      );
      return;
    }
    setSuccess(true);
  }

  const timeLabel = new Date(reportedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <AuthGate>
      <AppShell title="Report offence" backHref="/home">
        <form onSubmit={onSubmit} className="flex flex-col gap-5 pb-8">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Location
            </p>
            <ReportMap lat={pos.lat} lng={pos.lng} className="w-full" />
            {geoNote ? (
              <p className="mt-2 text-xs text-amber-700">{geoNote}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            <input
              ref={vidRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={onVideoChange}
            />
            <input
              ref={imgRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageChange}
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openVideoCamera}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-600/30 bg-white py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-600/50 hover:bg-emerald-50/80 active:scale-[0.99]"
              >
                <Video className="h-5 w-5 shrink-0 text-emerald-600" />
                Record
              </button>
              <button
                type="button"
                onClick={openPhotoCamera}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-600/30 bg-white py-3 text-sm font-semibold text-emerald-900 shadow-sm transition hover:border-emerald-600/50 hover:bg-emerald-50/80 active:scale-[0.99]"
              >
                <Camera className="h-5 w-5 shrink-0 text-emerald-600" />
                Capture
              </button>
            </div>
            <p className="text-center text-xs text-slate-500">
              Uses the device camera when you allow access (not the gallery picker).
            </p>
            <div className="flex justify-center gap-4 text-xs">
              <button
                type="button"
                onClick={onPickImageFromFiles}
                className="flex items-center gap-1 font-medium text-emerald-700 underline-offset-2 hover:underline"
              >
                <ImageUp className="h-3.5 w-3.5" />
                Upload photo
              </button>
              <button
                type="button"
                onClick={onPickVideoFromFiles}
                className="flex items-center gap-1 font-medium text-emerald-700 underline-offset-2 hover:underline"
              >
                <Video className="h-3.5 w-3.5" />
                Upload video
              </button>
            </div>
          </div>

          <CameraPhotoDialog
            open={photoOpen}
            stream={photoStream}
            onClose={closePhotoCamera}
            onCaptured={(dataUrl) => {
              setImageDataUrl(dataUrl);
              setFormError(null);
            }}
          />
          <CameraVideoDialog
            open={videoOpen}
            stream={videoStream}
            onClose={closeVideoCamera}
            onRecorded={(dataUrl) => {
              setVideoDataUrl(dataUrl);
              setFormError(null);
            }}
          />
          {(imageDataUrl || videoDataUrl) && (
            <div className="flex flex-wrap gap-2 text-xs text-slate-600">
              {imageDataUrl ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-900">
                  <Camera className="h-3.5 w-3.5" />
                  Photo attached
                </span>
              ) : null}
              {videoDataUrl ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-900">
                  <Video className="h-3.5 w-3.5" />
                  Video attached
                </span>
              ) : null}
            </div>
          )}

          <div>
            <label htmlFor="offence" className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <ListFilter className="h-4 w-4 text-emerald-600" />
              Type of offence
            </label>
            <div className="relative mt-1">
              <select
                id="offence"
                required
                value={offenceType}
                onChange={(e) => setOffenceType(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-10 outline-none ring-emerald-500/30 focus:ring-2"
              >
                <option value="">Select…</option>
                {OFFENCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label htmlFor="vehicle" className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <CarFront className="h-4 w-4 text-emerald-600" />
              Vehicle number
            </label>
            <div className="relative mt-1">
              <CarFront className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600/45" />
              <input
                id="vehicle"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="e.g. DHAKA-MA-12-3456"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 uppercase outline-none ring-emerald-500/30 focus:ring-2"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Clock className="h-4 w-4 text-emerald-600" />
              Report time
            </label>
            <p className="mt-1 flex items-center gap-2 rounded-xl border border-dashed border-emerald-600/25 bg-white px-4 py-3 text-slate-800">
              <Clock className="h-4 w-4 shrink-0 text-emerald-600/70" />
              {timeLabel}
            </p>
            <p className="mt-1 text-xs text-slate-500">Captured when you opened this form.</p>
          </div>

          <div>
            <label htmlFor="comment" className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
              Details <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              id="comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe what you saw…"
              className="mt-1 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none ring-emerald-500/30 focus:ring-2"
            />
          </div>

          {formError ? <p className="text-sm text-red-600">{formError}</p> : null}

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/25 hover:bg-emerald-700"
          >
            <Send className="h-5 w-5" strokeWidth={2.25} />
            Submit report
          </button>
        </form>

        <SuccessDialog
          open={success}
          title="Report submitted"
          message="Your report has been recorded. You can track it under Reported offence."
          onClose={() => {
            setSuccess(false);
            router.push("/reports");
          }}
        />
      </AppShell>
    </AuthGate>
  );
}
