export enum TypeUserEnum {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface IUser {
  id: string;
  athletic: string;
  number: string;
  password: string;
  confirmed_password: string;
  logo?: string;
  type: TypeUserEnum;
  is_active: boolean;
  counts: {
    count_esports: number
		count_sports: number
		count_sports_masculine: number
		count_sports_feminine: number
		count_sportEquipment: number
		count_championship: number
		count_friendly: number
  }
}
