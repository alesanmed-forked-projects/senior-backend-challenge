export interface CreateRestaurantCommand {
  name: string;
  neighborhood: string;
  photograph: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  image_url: string;
  cuisine_type: string;
}
