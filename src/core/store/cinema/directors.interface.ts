export interface Director {
  id: number;
  name: string;
  key: DirectorKey;
}

export enum DirectorKey {
  QuentinTarantino = 'quintin-tarantino',
  ChristopherNolan = 'christopher-nolan',
  MartinScorsese = 'martin-scorsese',
  StevenSpielberg = 'steven-spielberg',
  DavidFincher = 'david-fincher',
  RidleyScott = 'ridley-scott',
  JamesCameron = 'james-cameron',
  MichaelBay = 'michael-bay',
  PeterJackson = 'peter-jackson',
  SpikeLee = 'spike-lee',
  JackieChan = 'jackie-chan',
  ClintEastwood = 'clint-eastwood',
}