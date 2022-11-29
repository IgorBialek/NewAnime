import newEpisode from './newEpisode';

export default interface observedAnime {
  name: string;
  image: string;
  lastSeenEpisode: number;
  url: string;
  episodes: newEpisode[];
}
