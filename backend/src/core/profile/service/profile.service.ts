import * as boom from '@hapi/boom';

import * as domain from '../../domain';

export class ProfileService implements domain.ProfileService {
  constructor(
    private repo: domain.ProfileRepository,
    private qrcodeService: domain.QRCodeService
  ) {}

  get(id: string): Promise<domain.Profile> {
    return this.repo.get(id);
  }

  async create(profile: domain.Profile): Promise<domain.Profile> {
    const qrcode = await this.qrcodeService.create(
      profile.id,
      `https://example.com/?val=${profile.id}`
    );
    // const qrcode = await this.qrcodeService.create(profile.id, `https://example.com/${profile.id}`);
    profile.qr = qrcode;
    if (!profile.socials) profile.socials = [];
    return this.repo.create(profile);
  }

  update(profile: domain.Profile): Promise<void> {
    return this.repo.update(profile);
  }

  async remove(id: string): Promise<void> {
    await this.qrcodeService.remove(id);

    return this.repo.remove(id);
  }
}
