export interface QRCode {
  /** Public url of the qr code */
  url: string;
  /** gs uri of the qr code in the format of gs://<bucket>/<path> */
  uri: string;
}

export interface QRCodeService {
  /**
   * QR Code service
   * @param id - ID of the qr code
   * @param content - The string content to be embedded in the qr code
   * @returns Promise that resolves to the uploaded qr code
   */
  create(id: string, content: string): Promise<QRCode>;

  remove(id: string): Promise<void>;
}

export interface QRCodeRepository {
  /**
   * QR Code repository
   * @param id - ID of the qr code
   * @param data - Buffer of qr code in png format
   */
  create(id: string, data: Buffer): Promise<QRCode>;

  remove(id: string): Promise<void>;

  exists(id: string): Promise<boolean>;
}
