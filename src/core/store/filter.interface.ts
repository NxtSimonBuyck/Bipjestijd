import { Genre } from "./genres/genre.interface";

export interface Filter {
  genres: Genre[];
  currentPage: number;
  perPage: number;
  collection: 'movies' | 'series';
}