export interface OtpRequestResponse {
  success: boolean;
  message?: string;
  error?: string;
  devCode?: string;
  ticket?: string;
}

export interface OtpVerifyResponse {
  success: boolean;
  token?: string;
  email?: string;
  error?: string;
  ticket?: string;
}

export class OtpService {
  /**
   * Requests a one-time verification code be sent to the given email address.
   * `previousTicket` (if any) lets the server enforce the resend cooldown
   * without needing server-side session state.
   */
  public static async requestCode(email: string, previousTicket?: string): Promise<OtpRequestResponse> {
    try {
      const response = await fetch('/api/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, ticket: previousTicket }),
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
   * `ticket` carries the signed OTP state issued by the /request call.
   */
  public static async verifyCode(email: string, code: string, ticket: string): Promise<OtpVerifyResponse> {
    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, ticket }),
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
