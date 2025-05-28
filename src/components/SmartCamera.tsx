import { useRef, useState } from "react";
import { Camera, Download, AlertCircle, Group } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useData } from "@/context/data/DataContext";
import { useAuth } from "@/context/auth/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
// import { Badge } from "@/components/ui/badge";

// interface SmartCameraProps {}

export default function SmartCamera() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  // const [lastCaptureTime, setLastCaptureTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [capturedImageUrl, setCapturedImageUrl] = useState<string | null>(null);

  const {
    selectedClassId,
    selectedGroupId,
    selectedAcademicYear,
    isCapturing,
    setIsCapturing,
  } = useData();
  const { user } = useAuth();
  const teacherId = user?.teacher_id;
  const captureImage = async (): Promise<void> => {
    if (isCapturing) return;

    setIsCapturing(true);
    setError(null);

    try {
      const img = imgRef.current;
      const canvas = canvasRef.current;

      if (!img || !canvas) {
        throw new Error("Camera elements not ready");
      }

      // Wait for image to be loaded
      if (!img.complete) {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error("Image load timeout")),
            5000
          );
          img.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error("Failed to load camera stream"));
          };
        });
      }

      // Set canvas dimensions to match image
      canvas.width = img.naturalWidth || img.width || 640;
      canvas.height = img.naturalHeight || img.height || 480;

      const ctx = canvas.getContext("2d");

      // Draw the current frame to canvas
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Set image preview
      const imageUrl = canvas.toDataURL("image/jpeg");
      setCapturedImageUrl(imageUrl);

      // Convert canvas to blob and download
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          const url: string = URL.createObjectURL(blob);
          const a: HTMLAnchorElement = document.createElement("a");
          const timestamp: string = new Date()
            .toISOString()
            .replace(/[:.]/g, "-");
          a.href = url;
          a.download = `camera-capture-${timestamp}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          // setLastCaptureTime(new Date());
        } else {
          throw new Error("Failed to create image blob");
        }
      }, "image/png");
    } catch (err: unknown) {
      console.error("Capture error:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleImageError = (): void => {
    setError(
      "Failed to load camera stream. Check if the Raspberry Pi camera is running."
    );
  };

  const handleImageLoad = (): void => {
    setError(null);
  };

  const markAttendance = async (): Promise<void> => {
    if (isCapturing) return;

    // Validate required fields
    if (
      !selectedClassId ||
      !selectedGroupId ||
      !selectedAcademicYear ||
      !teacherId
    ) {
      setError("Please select Class, Group, and Academic Year");
      return;
    }

    setIsCapturing(true);
    setError(null);

    try {
      const img = imgRef.current;
      const canvas = canvasRef.current;

      if (!img || !canvas) {
        throw new Error("Camera elements not ready");
      }

      // Wait for image to be loaded
      if (!img.complete) {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error("Image load timeout")),
            5000
          );
          img.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error("Failed to load camera stream"));
          };
        });
      }

      // Set canvas dimensions to match image
      canvas.width = img.naturalWidth || img.width || 640;
      canvas.height = img.naturalHeight || img.height || 480;

      const ctx = canvas.getContext("2d");

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Set image preview
      const imageUrl = canvas.toDataURL("image/jpeg");
      setCapturedImageUrl(imageUrl);

      // Convert canvas to blob for upload
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
      });

      if (!blob) {
        throw new Error("Failed to create image blob");
      }

      // Create FormData for the request
      const formData = new FormData();
      formData.append("photo", blob, "attendance.jpg");
      formData.append("teacher_id", teacherId);
      formData.append("subject_id", selectedClassId);
      formData.append("group_id", selectedGroupId);
      formData.append("academic_year_id", selectedAcademicYear);

      // Make the API request
      const response = await api.post("/attendance/taketwo/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Failed to mark attendance");
      // }

      // const result = await response.json();

      const result = response.data;

      // console.log(result);
      // if (!result.success) {
      //   throw new Error(result || "Failed to mark attendance");
      // }
      console.log("Attendance marked successfully:", result);

      // Show success message or update UI
      setError(null);
      // You might want to add a success state here
      toast.success(
        `Attendance marked successfully! Present: ${result.present_count}, Absent: ${result.absent_count}`
      ); // console.log(result);
      // if (!result.success) {
      //   throw new Error(result || "Failed to mark attendance");
      // }
    } catch (err: unknown) {
      console.error("Attendance error:", err);
      const errorMessage =
        err instanceof AxiosError
          ? err.response?.data.detail
          : "Unknown error occurred";
      setError(errorMessage);
      // console.log(err);
      // if (err instanceof AxiosError && err.response?.status !== 400) {
      toast.error(errorMessage);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-6 h-6" />
              <div>
                <CardTitle className="text-2xl">Smart Camera Stream</CardTitle>
                <CardDescription>
                  Live feed from Raspberry Pi camera with capture functionality
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="relative bg-muted rounded-lg overflow-hidden border">
            {capturedImageUrl ? (
              <img
                src={capturedImageUrl}
                alt="Captured Frame"
                className="w-full h-auto max-h-96 object-contain"
              />
            ) : (
              <img
                ref={imgRef}
                src="http://192.168.71.32:5000/video_feed"
                alt="Camera Stream"
                className="w-full h-auto max-h-96 object-contain"
                onError={handleImageError}
                onLoad={handleImageLoad}
                crossOrigin="anonymous"
              />
            )}

            {/* Capture overlay when capturing */}
            {isCapturing && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm">
                <div className="bg-popover border rounded-lg px-4 py-2 shadow-md">
                  <span className="text-sm font-medium">Capturing...</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-center">
            <Button
              onClick={markAttendance}
              disabled={isCapturing}
              size="lg"
              className="flex items-center gap-2"
            >
              <Group className="w-4 h-4" />
              Mark Attendance
            </Button>
            {capturedImageUrl && (
              <Button
                onClick={() => setCapturedImageUrl(null)}
                variant="outline"
              >
                Resume Stream
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
