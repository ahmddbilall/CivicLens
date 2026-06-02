"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";
import { useReportStore } from "@/store/useReportStore";

const MAX_IMAGE_SIZE = 1280;
const JPEG_QUALITY = 0.72;

function normalizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Could not read image file"));
    reader.onload = (event) => {
      const rawDataUrl = String(event.target?.result || "");
      const img = new Image();

      img.onerror = () => {
        if (rawDataUrl.startsWith("data:image/")) {
          resolve(rawDataUrl);
          return;
        }

        reject(new Error("Unsupported image file"));
      };

      img.onload = () => {
        const scale = Math.min(
          1,
          MAX_IMAGE_SIZE / Math.max(img.width, img.height),
        );
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(rawDataUrl);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
      };

      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

export default function ReportScreen() {
  const router = useRouter();
  const { setDraft } = useReportStore();
  const [error, setError] = useState("");
  const [isReadingImage, setIsReadingImage] = useState(false);

  const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setIsReadingImage(true);

    try {
      const dataUrl = await normalizeImage(file);
      setDraft({ photoUrl: dataUrl });
      router.push("/report/preview");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not prepare this image for reporting",
      );
    } finally {
      setIsReadingImage(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] md:min-h-screen px-4 pb-8 max-w-xl mx-auto w-full justify-center">
      <div className="mt-6 flex flex-col gap-4">
        {/* Upload from Gallery */}
        <label className="h-64 bg-[var(--color-bg-surface)] rounded-2xl border border-[var(--color-border)] hover:border-dashed hover:border-[var(--color-accent)] transition-all flex flex-col items-center justify-center cursor-pointer active:scale-[0.98]">
          <div className="w-16 h-16 bg-[var(--color-accent-muted)] rounded-full flex items-center justify-center mb-4 shadow-[var(--color-accent)] shadow-sm">
            <ImageIcon className="w-8 h-8 text-[var(--color-accent)]" />
          </div>
          <h2 className="font-display font-semibold text-[20px]">
            {isReadingImage ? "Preparing Photo..." : "Upload Photo"}
          </h2>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-1">Choose an image of the fault</p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCapture}
            disabled={isReadingImage}
          />
        </label>
        {error && (
          <p className="text-[13px] text-[var(--color-danger)] text-center">
            {error}
          </p>
        )}
      </div>

      {/* Tip Strip */}
      <div className="mt-4 bg-[var(--color-accent-muted)] border border-[var(--color-accent)] border-opacity-30 rounded-xl px-4 py-3 flex gap-3">
        <span className="text-[14px]">💡</span>
        <p className="text-[12px] text-[var(--color-accent)]">
          Clear, close-up photos help AI classify the fault more accurately.
        </p>
      </div>
    </div>
  );
}
