export type ReportStatus = "pending" | "under_review" | "approved" | "rejected";

export type User = {
  userId: string;
  phone: string;
  name: string;
  email: string;
  creditPoints: number;
};

export type Report = {
  id: string;
  status: ReportStatus;
  offenceType: string;
  vehicleNumber: string;
  reportedAt: string;
  comment: string;
  lat: number;
  lng: number;
  /** Whether a photo was attached at submit time (survives stripping heavy data from storage). */
  hasImage: boolean;
  /** Whether a video was attached at submit time. */
  hasVideo: boolean;
  imageDataUrl: string | null;
  videoDataUrl: string | null;
  createdAt: string;
};
