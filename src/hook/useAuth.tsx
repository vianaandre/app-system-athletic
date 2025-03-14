import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { IUser } from "../Models/Users";
import { requestApi } from "../utils/requestApi";
import { getToken } from "../utils/getToken";

interface IAuthContext {
    user?: IUser;
    setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>
    refreshUserData: () => Promise<void>;
}

const AuthContext = createContext({} as IAuthContext)

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const [user, setUser] = useState<IUser>()

    const refreshUserData = async () => {
        const token = await getToken();

        try {
            const response = await requestApi('/users', 'GET', null, {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            });

            if (response && response.data) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Erro ao atualizar os dados do usuário:', error);
        }
    };

    const context = useMemo(() => {
        return {
            user: user,
            setUser,
            refreshUserData,
        } as IAuthContext
    }, [user])

    return (
        <AuthContext.Provider
            value={context}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    return context
}