import {
  ethers
} from "ethers";
import {
  useUser
} from "../context/UserContext";

const getNetwork = async (
  provider
) => {
  const network = await provider.getNetwork()
  return network.chainId.toString() === "137" ? "Polygon" : "Wrong Network"
};

export default getNetwork;