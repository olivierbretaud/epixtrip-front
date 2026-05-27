export type Travel = {
  authorId: number;
  createdAt: string;
  description: string;
  id: number;
  isPublic: false;
  title: string;
  updatedAt: string;
  cover: TravelMedia | null;
};

export type TravelMedia = {
  id: number;
  url: string;
  mimeType: string;
  size: number;
  takenAt: string;
  lat: number;
  lng: number;
  place: string;
  description: string;
  city: string;
  region: string;
  state: string;
  countryCode: string;
  travelId: number;
  createdAt: string;
};

export type TravelFormValues = {
  title: string;
  description: string;
};
