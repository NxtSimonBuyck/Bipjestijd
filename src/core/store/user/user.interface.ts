import { Cinema } from "../cinema/cinema.interface";

export interface User {
  id: number;
  name: string;
  email: string;
  partner?: User;
  savedMovies: Array<Cinema>;
  savedSeries: Array<Cinema>;
}