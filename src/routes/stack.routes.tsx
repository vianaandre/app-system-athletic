import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { Home } from "../screens/Home";
import { Login } from "../screens/Login";
import { NewPaswd } from "../screens/NewPasswd";
import { RegisterUser } from "../screens/RegisterUser";
import { ListUsers } from "../screens/ListUsers";
import { SportsMenu } from "../screens/SportsMenu";
import { RegisterSports } from "../screens/RegisterSports";
import { ListSports } from "../screens/ListSports";
import { RegisterAthlete } from "../screens/RegisterAthlete";
import { ListAthletes } from "../screens/ListAthletes";
import { ListChampionships } from "../screens/ListChampionships";
import { RegisterChampionships } from "../screens/RegisterChampionships";

import { SportsEquipments } from "../screens/SportsEquipments";
import { RegisterSportEquipment } from "../screens/RegisterSportEquipment";
import { Friendlys } from "../screens/Friendlys";
import { RegisterFriendly } from "../screens/RegisterFriendly";
import { ListTeams } from "../screens/ListTeams";
import { RegisterTeams } from "../screens/RegisterTeams";

const { Navigator, Screen } = createNativeStackNavigator();

export function StackRoutes() {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="Home" component={Home} />
            <Screen name="Login" component={Login} />
            <Screen name="NewPassword" component={NewPaswd} />
            <Screen name="RegisterUser" component={RegisterUser} />
            <Screen name="ListUsers" component={ListUsers} />
            <Screen name="SportsMenu" component={SportsMenu} />
            <Screen name="RegisterSports" component={RegisterSports} />
            <Screen name="ListSports" component={ListSports} />
            <Screen name="RegisterTeams" component={RegisterTeams} />
            <Screen name="ListTeams" component={ListTeams} />
            <Screen name="ListAthletes" component={ListAthletes} />
            <Screen name="RegisterAthlete" component={RegisterAthlete} />
            <Screen name="ListChampionships" component={ListChampionships} />
            <Screen name="RegisterChampionships" component={RegisterChampionships} />

            <Screen name="ListSportsEquipments" component={SportsEquipments} />
            <Screen name="RegisterSportEquipment" component={RegisterSportEquipment} />
            <Screen name="ListFrindlys" component={Friendlys} />
            <Screen name="RegisterFriendly" component={RegisterFriendly} />
        </Navigator>
    )
}