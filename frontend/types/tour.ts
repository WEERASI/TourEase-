
export type TourDifficulty = 'Easy' | 'Moderate' | 'Challenging';
export type TourType = 'Cultural' | 'Wildlife' | 'Beach' | 'Adventure' | 'Hill Country' | 'Tea Plantation';

export interface TourPackage {
  id: string | number;
  _id?: string;
  title: string;
  duration: string;
  durationDays: number;
  rating: number;
  price: number;
  imageUrl: string;
  badge?: 'Popular' | 'Featured' | 'New';
  type: TourType;
  difficulty: TourDifficulty;
  inclusions: string[];
}

export interface TourFilters {
  priceRange: [number, number];
  durations: string[];
  types: TourType[];
  ratings: number[];
  difficulties: TourDifficulty[];
  features: string[];
}
