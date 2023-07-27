export interface Genre {
  id: string;
  name: string;
  key: GenreKey;
}

export enum GenreKey {
  Action = "action",
  Adventure = "adventure",
  Animation = "animation",
  Comedy = "comedy",
  Crime = "crime",
  Documentary = "documentary",
  Drama = "drama",
  Family = "family",
  Fantasy = "fantasy",
  History = "history",
  Horror = "horror",
  Music = "music",
  Mystery = "mystery",
  Romance = "romance",
  ScienceFiction = "science-fiction",
  TVMovie = "tv-movie",
  Thriller = "thriller",
  War = "war",
  Western = "western",
}