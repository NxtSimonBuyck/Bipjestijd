import { DocumentReference } from "firebase/firestore";
import { Cinema } from "../cinema/cinema.interface";

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL: string;
  partnerId: string;
  partner?: User;
  likedCollectionId: string;
  seenCollectionId: string;
  savedCollectionId: string;
  saved: UserCinemaCollection;
  seen: UserCinemaCollection;
  liked: UserCinemaCollection;
}

export interface UserCinemaCollection {
  movies: Cinema[];
  series: Cinema[];
}