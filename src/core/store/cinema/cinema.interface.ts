import { Genre } from "../genres/genre.interface";
import { User } from "../user/user.interface";
import { Actor } from "./actors.interface";
import { Director } from "./directors.interface";

export interface Cinema {
  id: number;
  title: string;
  releaseYear: number;
  genres: Array<Genre>;
  description: string;
  actors: Array<Actor>;
  directors: Array<Director>;
  user: User;
  cover: string;
}
