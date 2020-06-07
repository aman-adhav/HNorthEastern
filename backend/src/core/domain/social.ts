export interface Social {
  type: 'github' | 'facebook' | 'snapchat' | 'instagram' | 'devpost' | 'other';
  image: { url: string; uri: string };
  url: string;
}

export interface SocialRepository {
  get(type: Social['type']): Promise<Social['image']>;
}
