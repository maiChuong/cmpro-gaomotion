import { MotionData } from '@/hooks/useMotionCapture';
import { CaptureType } from '@/components/MotionSelector';
import { createMotionDataPacket } from '@/lib/json-export';

/**
 * Manages the WebSocket connection to a Blender tunnel for real-time data streaming.
 */
export class MotionTunnel {
  private ws: WebSocket | null = null;

  // Callbacks to update the UI based on connection status.
  public onOpen: () => void = () => {};
  public onClose: () => void = () => {};
  public onError: (message: string) => void = () => {};

  /**
   * Establishes a connection to the WebSocket server at the given URL.
   * @param url The wss:// or ws:// URL of the tunnel.
   */
  public connect(url: string): void {
    if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
      console.warn('A connection is already open. Disconnect first.');
      return;
    }

    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('Tunnel connection established.');
        this.onOpen();
      };

      this.ws.onclose = () => {
        console.log('Tunnel connection closed.');
        this.onClose();
        this.ws = null;
      };

      this.ws.onerror = (event) => {
        console.error('Tunnel WebSocket error:', event);
        this.onError('Connection failed. Check the URL and Blender addon.');
        this.ws = null;
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid URL.';
      this.onError(message);
    }
  }

  /**
   * Closes the active WebSocket connection.
   */
  public disconnect(): void {
    this.ws?.close();
  }

  /**
   * Sends motion data through the open WebSocket connection.
   */
  public sendData(motionData: MotionData, captureType: CaptureType): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const payload = createMotionDataPacket(motionData, captureType);
      this.ws.send(JSON.stringify(payload));
    }
  }
}