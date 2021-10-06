import { useCallback, useEffect, useState } from "react";
import { User } from "../context/UserContext";
import getNetwork from "../utils/getNetwork";

const useNetwork = (user) => {
  const [network, setNetwork] = useState("Not connected");

  const fetchNetwork = useCallback(async () => {
    if (!user) {
      setNetwork("Not connected");
      return;
    }
    try {
      const network = await getNetwork(user.provider);
      setNetwork(network);
    } catch (err) {
      console.log(err);
      setNetwork("Not connected");
    }
  }, [user]);

  useEffect(() => {
    fetchNetwork();
  }, [fetchNetwork]);

  return [network, fetchNetwork];
};

export default useNetwork;
