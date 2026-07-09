import upperlimbOrthSmall from "../../../assets/images/homeupperlimborthsmall.png";
import upperlimbOrthBig from "../../../assets/images/homeupperlimborthbig.png";

import lowerlimbOrthSmall from "../../../assets/images/homelowerlimborthsmall.png";
import lowerlimbOrthBig from "../../../assets/images/homelowerlimborthbig.png";

import upperlimbprosSmall from "../../../assets/images/homeupperlimbprossmall.png";
import upperlimbprosBig from "../../../assets/images/homeupperlimbprosbig.png";

import lowerlimbprosSmall from "../../../assets/images/homelowerlimbprossmall.png";
import lowerlimbprosBig from "../../../assets/images/homelowerlimbprosbig.png";

import seatingSmall from "../../../assets/images/homeseatingsmall.png";
import seatingBig from "../../../assets/images/homeseatingbig.png";

import spinalorthSmall from "../../../assets/images/homespinalorthsmall.png";
import spinalorthBig from "../../../assets/images/homespinalorthbig.png";
// add all 6 like this

export const comfortItems = [
  {
    id: "upperOrth",
    label: "Upper Limb Orthotics",
    small: upperlimbOrthSmall,
    big: upperlimbOrthBig,
    position: "leftTop"
  },
  {
    id: "seating",
    label: "Seating & Positioning Systems",
    small: seatingSmall,
    big: seatingBig,
    position: "topCenter"
  },
  {
    id: "spinal",
    label: "Spinal Orthoses",
    small: spinalorthSmall,
    big: spinalorthBig,
    position: "topRight"
  },
  {
    id: "lowerOrth",
    label: "Lower Limb Orthotics",
    small: lowerlimbOrthSmall,
    big: lowerlimbOrthBig,
    position: "right"
  },
  {
    id: "lowerPro",
    label: "Lower Limb Prosthetics",
    small: lowerlimbprosSmall,
    big: lowerlimbprosBig,
    position: "bottomRight"
  },
  {
    id: "upperPro",
    label: "Upper Limb Prosthetics",
    small: upperlimbprosSmall,
    big: upperlimbprosBig,
    position: "bottomLeft"
  }
];
