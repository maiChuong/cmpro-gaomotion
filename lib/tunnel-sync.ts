import {
  FaceLandmarkerResult,
  PoseLandmarkerResult,
} from '@mediapipe/tasks-vision';

export type TunnelStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

/**
 * A service to manage WebSocket communication for live syncing with Blender.
 */
export class TunnelSyncService {
  private socket: WebSocket | null = null;
  private url: string;
  private onStatusChange: (status: TunnelStatus) => void;
  private isManualDisconnect = false;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private readonly reconnectInterval = 3000; // 3 seconds
  private reconnectTimeoutId: ReturnType<typeof setTimeout> | null = null;

  /**
   * @param {string} url - The WebSocket server URL (e.g., 'ws://localhost:8765').
   * @param {(status: TunnelStatus) => void} onStatusChange - Callback to report status changes.
   */
  constructor(url: string, onStatusChange: (status: TunnelStatus) => void) {
    if (!url || !url.startsWith('ws')) {
      throw new Error('Invalid WebSocket URL provided.');
    }
    this.url = url;
    this.onStatusChange = onStatusChange;
  }

  /**
      * Initiates the WebSocket connection.
   */
  connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      console.warn('WebSocket is already connected or connecting.');
      return;
    }

    this.isManualDisconnect = false;

    try {
      this.socket = new WebSocket(this.url);
      this.onStatusChange('connecting');

      this.socket.onopen = () => {
        console.log('Tunnel connected successfully.');
        this.reconnectAttempts = 0; // Reset on successful connection
        this.onStatusChange('connected');
      };

      this.socket.onclose = (event) => {
        console.log('Tunnel disconnected.');
        this.socket = null;
        if (!this.isManualDisconnect) {
          this.handleReconnect();
        } else {
          this.onStatusChange('disconnected');
        }
      };

      this.socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        this.onStatusChange('error');
        // The `onclose` event will be fired subsequently, which will trigger reconnection logic.
      };

      this.socket.onmessage = (event) => {
        // Handle incoming messages from Blender if needed
        console.log('Message from server:', event.data);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.onStatusChange('error');
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Connection lost. Attempting to reconnect in ${this.reconnectInterval / 1000}s... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.reconnectTimeoutId = setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      console.error(`Failed to reconnect after ${this.maxReconnectAttempts} attempts.`);
      this.onStatusChange('error');
    }
  }

  /**
   * Closes the WebSocket connection.
   */
  disconnect(): void {
    this.isManualDisconnect = true;
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }
    if (this.socket) {
      this.socket.close();
    }
  }
}