export type Travel = {
  authorId: number;
  createdAt: string;
  description: string;
  id: number;
  isPublic: false;
  title: string;
  updatedAt: string;
};

export type TravelFormValues = {
  title: string;
  description: string;
};
