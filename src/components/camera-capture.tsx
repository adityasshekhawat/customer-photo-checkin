import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Camera, RotateCcw, Check, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CameraCaptureProps {
  onCapture: (imageBlob: Blob) => void;
  disabled?: boolean;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, disabled }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');
  const [uploadMode, setUploadMode] = useState<'camera' | 'upload'>('camera');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsStreaming(true);
      }
    } catch (err) {
      const errorMessage = 'Camera access denied. Please allow camera permissions and refresh.';
      setError(errorMessage);
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageUrl);
        stopCamera();
        onCapture(blob);
      }
    }, 'image/jpeg', 0.8);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    // Create preview and blob
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setCapturedImage(imageUrl);
      stopCamera();
      
      // Convert to blob for upload
      onCapture(file);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const retake = () => {
    setCapturedImage(null);
    if (uploadMode === 'camera') {
      startCamera();
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (error) {
    return (
      <Card className="p-6 text-center bg-destructive/10 border-destructive/20">
        <Camera className="mx-auto mb-4 h-12 w-12 text-destructive" />
        <p className="text-destructive font-medium mb-4">{error}</p>
        <Button onClick={startCamera} variant="outline">
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-gradient-primary shadow-medium">
      <div className="relative aspect-[4/3] bg-card">
        {capturedImage ? (
          <img 
            src={capturedImage} 
            alt="Captured photo" 
            className="w-full h-full object-cover"
          />
        ) : uploadMode === 'camera' ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center">
              <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select an image from gallery</p>
            </div>
          </div>
        )}
        
        {!capturedImage && isStreaming && uploadMode === 'camera' && (
          <div className="absolute inset-0 border-4 border-primary/20 rounded-lg">
            <div className="absolute top-4 left-4 right-4 bg-primary/90 text-primary-foreground px-3 py-2 rounded-md text-sm font-medium text-center">
              Position the subject in the center
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-card space-y-3">
        {capturedImage ? (
          <div className="flex gap-3">
            <Button 
              onClick={retake} 
              variant="outline" 
              className="flex-1"
              disabled={disabled}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake
            </Button>
            <Button 
              variant="success" 
              className="flex-1"
              disabled={disabled}
            >
              <Check className="mr-2 h-4 w-4" />
              Use Photo
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Mode Selection */}
            <div className="flex gap-2">
              <Button 
                onClick={() => {setUploadMode('camera'); startCamera();}}
                variant={uploadMode === 'camera' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
              >
                <Camera className="mr-2 h-4 w-4" />
                Camera
              </Button>
              <Button 
                onClick={() => {setUploadMode('upload'); stopCamera();}}
                variant={uploadMode === 'upload' ? 'default' : 'outline'}
                size="sm"
                className="flex-1"
              >
                <Upload className="mr-2 h-4 w-4" />
                Gallery
              </Button>
            </div>

            {/* Action Button */}
            {uploadMode === 'camera' ? (
              <Button 
                onClick={capturePhoto}
                disabled={!isStreaming || disabled}
                variant="capture"
                size="lg"
                className="w-full"
              >
                <Camera className="mr-2 h-5 w-5" />
                Take Photo
              </Button>
            ) : (
              <Button 
                onClick={triggerFileUpload}
                disabled={disabled}
                variant="capture"
                size="lg"
                className="w-full"
              >
                <ImageIcon className="mr-2 h-5 w-5" />
                Select from Gallery
              </Button>
            )}
          </div>
        )}
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Hidden file input for gallery upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </Card>
  );
};