export interface ITeam {
  id?: string;
  name?: string;
  maximum_athletes?: number;
  is_active?: Boolean;
  sport_id: string;
  _count: {
    Athletes: number;
  }
}