import * as domain from '../../../domain';
import { Firestore, CollectionReference } from '@google-cloud/firestore';

export class SocialRepository implements domain.SocialRepository {
  private db: Firestore;
  private coll: CollectionReference;
  private cache: { [key: string]: domain.Social['image'] };

  constructor(db: Firestore) {
    this.db = db;
    this.coll = db.collection(process.env.GC_SOCIAL_COLLECTION as string);
    this.cache = {};
  }

  async get(type: domain.Social['type']): Promise<domain.Social['image']> {
    if (this.cache[type]) return this.cache[type];

    const query = await this.coll.where('type', '==', type).limit(1).get();

    /* This shouldn't ever happen
     * if (query.empty) return undefined;
     */

    const doc = query.docs[0].data() as domain.Social;

    this.cache[type] = doc.image;

    return this.cache[type];
  }
}
