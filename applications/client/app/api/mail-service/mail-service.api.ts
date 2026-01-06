import { requestClient } from "../request-client";

export class MailService {
  static async sendCode(email: string) {
    const response = await requestClient.post("/mail/send-code", { email });
    return response.data;
  }
}
