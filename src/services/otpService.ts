export interface OtpRequestResponse {
  success: boolean;
  message?: string;
  error?: string;
  devCode?: string;
}

export interface OtpVerifyResponse {
  success: boolean;
  token?: string;
  email?: string;
  error?: string;
}

export class OtpService {
  /**
   * Requests a one-time verification code be sent to the given email address.
   */
  public static async requestCode(email: string): Promise<OtpRequestResponse> {
    try {
      const response = await fetch('/api/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json.success) {
        return { success: false, error: json.error || `Server responded with HTTP ${response.status}` };
      }

      return json;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error while requesting verification code.' };
    }
  }

  /**
   * Verifies a one-time code and, on success, returns a short-lived session token.
   */
  public static async verifyCode(email: string, code: string): Promise<OtpVerifyResponse> {
    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok || !json.success) {
        return { success: false, error: json.error || `Server responded with HTTP ${response.status}` };
      }

      return json;
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error while verifying code.' };
    }
  }
}
