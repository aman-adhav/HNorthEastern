import * as stream from 'stream';

import * as qrcode from 'qrcode';
import * as Jimp from 'jimp';
import * as boom from '@hapi/boom';

import * as domain from '../../domain';

export class QRCodeService implements domain.QRCodeService {
  private overlay?: Jimp;
  private overlayLocation = 350;

  constructor(private repo: domain.QRCodeRepository) {}

  init(): Promise<void> {
    return Jimp.read(process.env.QRCODE_OVERLAY as string).then((image) => {
      this.overlay = image;
    });
  }

  async create(id: string, content: string): Promise<domain.QRCode> {
    if (await this.repo.exists(id)) throw boom.conflict();
    if (!this.overlay) await this.init();

    let qr = Buffer.from([]);
    const ws = new stream.Writable();

    ws._write = (chunk, encoding, cb) => {
      qr = Buffer.concat([qr, chunk]);
      cb();
    };

    return new Promise((resolve, reject) => {
      ws.on('finish', () => {
        this.createCustomQRCode(qr, this.overlay as Jimp)
          .then((data) => {
            return this.repo.create(id, data);
          })
          .then((customQRCode) => resolve(customQRCode));
      });

      ws.on('error', (error) => reject(error));

      qrcode.toFileStream(ws, content, { width: 1000, margin: 0, errorCorrectionLevel: 'H' });
    });
  }

  private async createCustomQRCode(qrcode: Buffer, overlay: Jimp): Promise<Buffer> {
    const image = await Jimp.read(qrcode);
    return image
      .composite(overlay, this.overlayLocation, this.overlayLocation)
      .getBufferAsync(Jimp.MIME_PNG);
  }

  remove(id: string): Promise<void> {
    return this.repo.remove(id);
  }
}
