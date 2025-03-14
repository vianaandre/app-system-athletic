import { ITeam } from "./Teams";

export interface ISport {
  id?: string;
  name?: string;
  maximum_teams?: number;
  is_active?: Boolean;
  type?: string;
  _count?: {
    Teams: number;
  };
}

export interface ITypeSport {
  ESport?: string;
  Sport?: string;
  SportMasculine?: string;
  SportFeminine?: string;
}
