export interface Profile {
  id: string;
  name: string;
  created: Date;
  updated: Date;
}

export interface ProfileService {
  get(id: string): Promise<Profile>;
  create(profile: Profile): Promise<string>;
  update(profile: Profile): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface ProfileRepository {
  get(id: string): Promise<Profile>;
  create(profile: Profile): Promise<string>;
  update(profile: Profile): Promise<void>;
  delete(id: string): Promise<void>;
}
