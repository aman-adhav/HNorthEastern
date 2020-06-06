import * as domain from '../../domain';

export class ProfileService implements domain.ProfileService {
  constructor(private repo: domain.ProfileRepository) {}

  get(id: string) {
    return this.repo.get(id);
  }

  create(profile: domain.Profile) {
    return this.repo.create(profile);
  }

  update(profile: domain.Profile) {
    return this.repo.update(profile);
  }

  delete(id: string) {
    return this.repo.delete(id);
  }
}
