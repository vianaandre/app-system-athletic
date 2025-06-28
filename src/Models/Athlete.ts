export interface IAthlete {
  id: string;
  name: string;
  number: string;
  course: string;
  period: number;
  athlete_image?: string;
  proof_registration?: string;
  registration: string;
  cpf: string;
  sport_id: string;
  is_active: boolean;
  team_id?: string;
}
