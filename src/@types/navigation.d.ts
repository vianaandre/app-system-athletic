import { IAthlete } from "../Models/Athlete";
import { IFriendlys } from "../Models/Friendlys";
import { ISport } from "../Models/Sports";
import { ISportsEquipments } from "../Models/SportsEquipments";
import { ITeam } from "../Models/Teams";
import { IUser } from "../Models/Users";

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Home: undefined;
      Login: undefined;
      NewPassword: undefined;
      RegisterUser: {
        user?: IUser;
        isEditing?: boolean;
        isAdmUser?: boolean;
        firstRegister?: boolean;
      };
      ListUsers: {
        isAdmUser?: boolean;
        updateList?: boolean;
      };
      SportsMenu: {
        //user?: IUser;
        sports?: ISport;
        isEditing?: boolean;
        isAdmUser?: boolean;
      };
      RegisterSports: {
        sports?: ISport;
        isEditing: boolean;
      };
      ListSports: {
        sports?: ISport;
        sportListByType?: ISport[];
      };
      ListTeams: {
        sport: ISport;
        athletic?: ITeam;
        isEditing?: boolean
      };
      ListAthletes: {
        team?: ITeam;
        athletic?: IAthletic;
        isEditing?: boolean
      };
      RegisterTeams: {
        sport?: ISport;
        team?: ITeam;
        isEditing?: boolean;
      };
      RegisterAthlete: {
        team?: ITeam;
        athlete?: IAthlete;
        isEditing?: boolean;
      };
      ListChampionships: undefined;
      RegisterChampionships: {
        championship?: IChampionship;
        isEditing?: boolean;
      };
      ListSportsEquipments: {};
      RegisterSportEquipment: {
        sportEquipment?: ISportsEquipments;
        isEditing: boolean;
      };
      ListFrindlys: {};
      RegisterFriendly: {
        friendly?: IFriendlys;
        isEditing: boolean;
      };
    }
  }
}
