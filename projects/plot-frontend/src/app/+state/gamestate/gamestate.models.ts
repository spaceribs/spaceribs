/**
 * Interface for the 'GameState' response
 */
export interface GameState {
  system: {
    time: string;
  };
  round: {
    end_time: string;
  };
  user: {
    units: number;
    username: string;
    avatar: string;
    nationId: number;
  } | null;
}
