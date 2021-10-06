import { ethers } from "ethers";
import { useUser } from "../context/UserContext";

const getNetwork = async (
  provider
) => {
  const network = await provider.getNetwork()
  return network.name
};

export default getNetwork;