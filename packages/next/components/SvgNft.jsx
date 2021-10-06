import { Skeleton, Box } from "@chakra-ui/react";

const SvgNft = ({ ItemSet }) => {
  const Svg = () => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMin meet"
        width="400"
        height="400"
      >
        <style>
          {`.base { fill: url(#linear-gradient); font-family: Impact; font-size: 25px; fontWeight: bold;}`}
        </style>
        <defs>
          <linearGradient
            id="linear-gradient"
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1="0"
            x2="800"
            y2="0"
          >
            <stop offset="0" stopColor="#38b2ac" />
            <stop offset="0.3333333333333333" stopColor="#5dc28f" />
            <stop offset="0.6666666666666666" stopColor="#9fcb66" />
            <stop offset="1" stopColor="#ecc94b" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="black" />
        <text x="20" y="40" className="base">
          {ItemSet.weapons[0]} Of Power
        </text>
        <text x="20" y="90" className="base">
          Divine {ItemSet.armor[0]}
        </text>
        <text x="20" y="140" className="base">
          {ItemSet.accessories[0]} Of Vitality
        </text>
      </svg>
    );
  };
  if (ItemSet.weapons.length === 0) {
    return (
      <Box h="400px" w="400px">
        <Skeleton height="30px" width="75%" margin={6} />
        <Skeleton height="30px" width="75%" margin={6} />
        <Skeleton height="30px" width="75%" margin={6} />
        <Skeleton height="30px" width="75%" margin={6} />
        <Skeleton height="30px" width="75%" margin={6} />
        <Skeleton height="30px" width="75%" margin={6} />
        <Skeleton height="30px" width="75%" margin={6} />
      </Box>
    );
  }
  return <Svg />;
};

export default SvgNft;
