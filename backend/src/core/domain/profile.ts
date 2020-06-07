import { QRCode } from './qrcode';
import { Social } from './social';

export interface Profile {
  id: string;
  name: string;
  email: string;
  description: string;
  phone: string;
  qr: QRCode;
  created?: Date;
  updated?: Date;

  socials: Social[];
}

export interface ProfileService {
  get(id: string): Promise<Profile>;

  /**
   * @returns Promise that resolves to the id of the new profile
   */
  create(profile: Profile): Promise<Profile>;

  update(profile: Profile): Promise<void>;

  remove(id: string): Promise<void>;
}

export interface ProfileRepository {
  get(id: string): Promise<Profile>;

  /**
   * @returns Promise that resolves to the id of the new profile
   */
  create(profile: Profile): Promise<Profile>;

  update(profile: Profile): Promise<void>;

  remove(id: string): Promise<void>;
}
