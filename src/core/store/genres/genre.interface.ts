export interface Genre {
  id: string;
  name: string;
  key: GenreKey;
}

export enum GenreKey {
  Action = "Action",
  Adventure = "Adventure",
  Animation = "Animation",
  Comedy = "Comedy",
  Crime = "Crime",
  Documentary = "Documentary",
  Drama = "Drama",
  Family = "Family",
  Fantasy = "Fantasy",
  History = "History",
  Horror = "Horror",
  Music = "Music",
  Mystery = "Mystery",
  Romance = "Romance",
  ScienceFiction = "Science Fiction",
  TVMovie = "TV Movie",
  Thriller = "Thriller",
  War = "War",
  Western = "Western",
}