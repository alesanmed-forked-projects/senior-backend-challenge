export interface HttpRestaurant {
  id: number;
  name: string;
  neighborhood: string;
  photograph: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  average_rating: number;
  image_url: string;
  cuisine_type: string;
}
