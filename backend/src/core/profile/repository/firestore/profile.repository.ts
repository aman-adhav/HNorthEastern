import {
  Firestore,
  FieldValue,
  Timestamp,
  CollectionReference,
  GrpcStatus,
} from '@google-cloud/firestore';
import * as boom from '@hapi/boom';

import * as domain from '../../../domain';

export class ProfileRepository implements domain.ProfileRepository {
  private db: Firestore;
  private coll: CollectionReference;
  private socialRepository: domain.SocialRepository;

  constructor(db: Firestore, socialRepository: domain.SocialRepository) {
    this.db = db;
    this.coll = db.collection(process.env.GC_PROFILE_COLLECTION as string);
    this.socialRepository = socialRepository;
  }

  private async getSocials(socials: domain.Profile['socials']): Promise<void> {
    if (!socials.length) return;

    const promises = [];
    for (let i = 0; i < socials.length; i++) {
      promises.push(this.socialRepository.get(socials[i].type));
    }
    const results = await Promise.all(promises);
    for (let i = 0; i < results.length; i++) {
      socials[i].image = results[i];
    }
  }

  async get(id: string): Promise<domain.Profile> {
    const doc = await this.coll.doc(id).get();
    if (!doc.exists) throw boom.notFound();
    const data = doc.data();
    if (!data) throw boom.notFound();

    const profile: domain.Profile = {
      id: doc.id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      description: data.description,
      qr: data.qr,
      created: (data.created as Timestamp).toDate(),
      socials: [],
    };

    if (data.updated) profile.updated = (data.updated as Timestamp).toDate();
    if (data.socials.length) {
      const socials: domain.Profile['socials'] = data.socials;
      await this.getSocials(socials);
      profile.socials = socials;
    }

    return profile;
  }

  async create(profile: domain.Profile): Promise<domain.Profile> {
    const data = { ...profile, created: FieldValue.serverTimestamp() };

    delete data.id;
    await this.coll.doc(profile.id).set(data);

    await this.getSocials(profile.socials);

    return {
      id: profile.id,
      name: profile.name,
      description: profile.description,
      phone: profile.phone,
      email: profile.email,
      qr: profile.qr,
      socials: profile.socials,
    };
  }

  async update(profile: domain.Profile): Promise<void> {
    const data = { ...profile };
    data.updated = FieldValue.serverTimestamp() as any;
    delete data.id;
    delete data.created;

    try {
      await this.coll.doc(profile.id).update(data);
    } catch (err) {
      if (err.code === GrpcStatus.NOT_FOUND) throw boom.notFound();
      throw err;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.coll.doc(id).delete();
    } catch (err) {
      if (err.code === GrpcStatus.NOT_FOUND) throw boom.notFound();
      throw err;
    }
  }
}
