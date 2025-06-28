export interface IChampionship {
    id: string;
    description: string;
    teams: string;
    start_date: Date;
    end_date: Date;
    location: string;
    results: string;
    is_active: boolean;
}