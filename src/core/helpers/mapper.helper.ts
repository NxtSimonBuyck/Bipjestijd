import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  QueryDocumentSnapshot,
  collection,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Cinema } from "../store/cinema/cinema.interface";
import { Genre } from "../store/genres/genre.interface";
import { Actor } from "../store/cinema/actors.interface";
import { Director } from "../store/cinema/directors.interface";
import { User, UserCinemaCollection } from "../store/user/user.interface";
import { get } from "firebase/database";

export async function CinemaMapper(
  doc: QueryDocumentSnapshot | DocumentSnapshot
): Promise<Cinema | undefined> {
  if (!doc.exists()) return;
  const item = doc.data();
  const genres = await Promise.all<Genre>(
    item.genres.map(async (doc: DocumentReference<Genre, DocumentData>) => {
      const genre = await getDoc(doc);
      return { id: doc.id, ...genre.data() };
    })
  );
  const actors = await Promise.all<Actor>(
    item.actors.map(async (doc: DocumentReference<Actor, DocumentData>) => {
      const actor = await getDoc(doc);
      return { ...actor.data(), id: doc.id };
    })
  );
  const directors = await Promise.all<Director>(
    item.directors.map(
      async (doc: DocumentReference<Director, DocumentData>) => {
        const director = await getDoc(doc);
        return { ...director.data(), id: doc.id };
      }
    )
  );
  return {
    ...item,
    id: doc.id,
    genres,
    actors,
    directors,
  } as Cinema;
}

interface UserFromFirebase {
  name: string;
  email: string;
  photoURL: string;
  likedCollection: DocumentReference;
  seenCollection: DocumentReference;
  savedCollection: DocumentReference;
}

export async function getUserCollection(userId: string, collectionName: 'saved' | 'seen' | 'liked', collectionId: string): Promise<UserCinemaCollection> {
  const savedCollection = await getDoc(
    doc(collection(db, `users/${userId}/${collectionName}`), collectionId)
  );
  const savedMovies = await Promise.all<Cinema>(
    savedCollection.data()?.movies.map(async (movie: DocumentReference) => {
      const movieData = await getDoc(movie);
      return await CinemaMapper(movieData);
    })
  );
  const savedSeries = await Promise.all<Cinema>(
    savedCollection.data()?.series.map(async (serie: DocumentReference) => {
      const serieData = await getDoc(serie);
      return await CinemaMapper(serieData);
    })
  );

  return {
    movies: savedMovies.filter((movie) => !!movie),
    series: savedSeries.filter((serie) => !!serie),
  };
} 

export async function userMapper(userDoc: DocumentSnapshot): Promise<User> {
  const data = userDoc.data() as UserFromFirebase;

  const saved = await getUserCollection(userDoc.id, 'saved', data.savedCollection.id);
  const seen = await getUserCollection(userDoc.id, 'seen', data.seenCollection.id);
  const liked = await getUserCollection(userDoc.id, 'liked', data.likedCollection.id);

  return {
    id: userDoc.id,
    name: data.name,
    email: data.email,
    photoURL: data.photoURL,
    likedCollectionId: data.likedCollection.id,
    seenCollectionId: data.seenCollection.id,
    savedCollectionId: data.savedCollection.id,
    liked,
    seen,
    saved,
  };
}
