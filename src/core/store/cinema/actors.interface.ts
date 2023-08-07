export interface Actor {
  id: string;
  name: string;
  key: ActorKey;
}

export enum ActorKey {
  LeonardoDiCaprio = 'leonardo-dicaprio',
  BradPitt = 'brad-pitt',
  TomHanks = 'tom-hanks',
  RobertDeNiro = 'robert-de-niro',
  AlPacino = 'al-pacino',
  JohnnyDepp = 'johnny-depp',
  AnnaKendricks = 'anna-kendricks',
  JenniferLawrence = 'jennifer-lawrence',
  ScarlettJohansson = 'scarlett-johansson',
}