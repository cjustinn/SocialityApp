import { createContext, useContext } from "react";
import { auth } from "./Firebase";
import { API_URL } from '@env';

export const UserContext = createContext({
    user: undefined,
    setUser: (_user) => {}
});

export const GetCurrentUser = () => {
    const { setUser } = useContext(UserContext);

    if (auth.currentUser) {
        const APIEndpoint = `${API_URL}api/users/${auth.currentUser.uid}`;
        fetch(APIEndpoint).then(data => data.json()).then(_user => {

            setUser(_user);

        }).catch(err => console.log(err));
    }
}