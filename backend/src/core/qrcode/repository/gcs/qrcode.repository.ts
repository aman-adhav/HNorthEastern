import { Storage, Bucket } from '@google-cloud/storage';
import * as boom from '@hapi/boom';

import * as domain from '../../../domain';

export class QRCodeRepository implements domain.QRCodeRepository {
  private storage: Storage;
  private bucket: Bucket;

  constructor(storage: Storage) {
    this.storage = storage;
    this.bucket = storage.bucket(process.env.GC_QRCODE_BUCKET as string);
  }

  async create(id: string, data: Buffer): Promise<domain.QRCode> {
    const file = this.bucket.file(`qrcodes/${id}`);
    const exists = await file.exists();
    if (!exists[0]) await file.save(data, { contentType: 'image/png' });

    return {
      url: `https://storage.googleapis.com/${this.bucket.name}/${file.name}`,
      uri: `gs://${this.bucket.name}/${file.name}`,
    };
  }

  async remove(id: string): Promise<void> {
    const file = this.bucket.file(`qrcodes/${id}`);
    try {
      await file.delete();
    } catch (err) {
      if (err.code === 404) throw boom.notFound();
      throw err;
    }
  }

  async exists(id: string): Promise<boolean> {
    const file = this.bucket.file(`qrcodes/${id}`);
    const exists = await file.exists();
    return exists[0];
  }
}
