import * as domain from '../../domain';

import * as yeast from 'yeast';

export class ProfileService implements domain.ProfileService {
  constructor(
    private repo: domain.ProfileRepository,
    private qrcodeService: domain.QRCodeService
  ) {}

  get(id: string): Promise<domain.Profile> {
    return this.repo.get(id);
  }

  async create(profile: domain.Profile): Promise<domain.Profile> {
    profile.id = yeast();
    const qrcode = await this.qrcodeService.create(profile.id, `https://example.com/${profile.id}`);
    profile.qr = qrcode;
    profile.socials = [];
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