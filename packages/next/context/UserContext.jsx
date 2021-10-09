import { createContext, useState, useEffect, useContext } from "react";
import { ethers, providers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import useEagerConnect from "../hooks/useEagerConnect";
import { injected } from "../utils/connectors";

const UserContext = createContext({
  user: null,
  login: () => null,
});

export default UserContext;

export const UserContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEagerConnect(); // Adds users on first load
  const { activate, active, library, account } = useWeb3React();

  /** Login with metamask */
  const activateMetamask = async () => activate(injected);

  /**
   * Given the Provider, return address and provider
   */
  const getAddressAndProvider = async (provider) => {
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    return { address, provider };
  };

  /**
   * On unlock set user
   */
  useEffect(() => {
    const fetchUser = async () => {
      if (active) {
        const res = await getAddressAndProvider(library);
        setUser(res);
      } else {
        setUser(null);
      }
    };
    fetchUser();
  }, [active, library, account]);

  /**
   * Login with Metamask
   */
  const login = async () => {
    try {
      activateMetamask();
    } catch (err) {
      alert(`Exception in loggign in ${alert}`);
    }
    return null;
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useLogin = () => {
  const { login } = useContext(UserContext);

  return login;
};

export const useUser = () => {
  const { user } = useContext(UserContext);

  return user;
};
