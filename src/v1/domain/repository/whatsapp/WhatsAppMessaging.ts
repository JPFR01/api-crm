export interface WhatsAppMessage {
  from: string;
  id: string;
  timestamp: string;
  type: string;
  text?: {
    body: string;
  };
  image?: {
    mime_type: string;
    sha256: string;
    id: string;
  };
  audio?: {
    mime_type: string;
    sha256: string;
    id: string;
    voice: boolean;
  };
  video?: {
    mime_type: string;
    sha256: string;
    id: string;
  };
  document?: {
    mime_type: string;
    sha256: string;
    id: string;
    filename: string;
  };
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
    address?: string;
  };
  contacts?: Array<any>;
  button?: {
    text: string;
    payload: string;
  };
  interactive?: {
    type: string;
    button_reply?: {
      id: string;
      title: string;
    };
    list_reply?: {
      id: string;
      title: string;
      description?: string;
    };
  };
}

export interface WhatsAppMessaging {
  sendText(to: string, message: string): Promise<void>;
  sendTemplate(
    to: string,
    templateName: string,
    params: string[]
  ): Promise<void>;
}
