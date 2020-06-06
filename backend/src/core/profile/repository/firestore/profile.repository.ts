import { Firestore, FieldValue, Timestamp, CollectionReference } from '@google-cloud/firestore';
import * as boom from '@hapi/boom';

import * as domain from '../../../domain';

export class ProfileRepository implements domain.ProfileRepository {
  private db: Firestore;
  private coll: CollectionReference;

  constructor(db: Firestore) {
    this.db = db;
    this.coll = db.collection(process.env.GC_PROFILE_COLLECTION as string);
  }

  async get(id: string): Promise<domain.Profile> {
    const doc = await this.coll.doc(id).get();
    if (!doc.exists) throw boom.notFound('Profile not found');
    const data = doc.data();
    if (!data) throw boom.notFound('Profile not found');

    return {
      id: doc.id,
      name: data.name,
      created: (data.created as Timestamp).toDate(),
      updated: (data.updated as Timestamp).toDate(),
    };
  }

  async create(profile: domain.Profile): Promise<string> {
    const ref = await this.coll.add(profile);
    return ref.id;
  }

  async update(profile: domain.Profile): Promise<void> {
    const data = { ...profile };
    data.updated = FieldValue.serverTimestamp() as any;
    delete data.id;
    delete data.created;

    await this.coll.doc(profile.id).update(data);
  }

  async delete(id: string): Promise<void> {
    await this.coll.doc(id).delete();
  }
}
