import sportorthImg from "../../../assets/images/spine-orthotic.jpg";
import cranialImg from "../../../assets/images/image39.jpg";
import paeorth from "../../../assets/images/cranial-orthotic.jpg";
import spineorth from "../../../assets/images/image16.jpg";
import pecorth from "../../../assets/images/image17.jpg";
import adultorth from "../../../assets/images/image19.jpg";
import footorth from "../../../assets/images/image18.jpg";

export const orthoticsData = [
  {
    title: "Cranial Orthotics",
    image: sportorthImg,
    subItems: [],
  },
  {
    title: "Sports Orthotics",
    image: cranialImg,
    subItems: [
      {
        label: "Custom Knee Brace",
        path: "/orthotics/sports/custom-knee-brace",
      },
      {
        label: "Raptor Mask",
        path: "/orthotics/sports/raptor-mask",
      },
    ],
  },
  {
    title: "Paediatric Orthotic",
    image: paeorth,
    subItems: [
      {
        label: "Ankle Foot Orthosis",
        path: "/orthotics/paediatric/ankle-foot-orthosis",
      },
      {
        label: "Knee Ankle-Foot Orthosis",
        path: "/orthotics/paediatric/knee-ankle-foot-orthosis",
      },
      {
        label: "Hip Knee-Ankle-Foot Orthosis",
        path: "/orthotics/paediatric/hip-knee-ankle-foot-orthosis",
      },
      {
        label: "Upper Limb Orthosis",
        path: "/orthotics/paediatric/upper-limb-orthosis",
      },
    ],
  },
  {
    title: "Spine Orthotics",
    image: spineorth,
    subItems: [
      {
        label: "Scoliosis Orthosis",
        path: "/orthotics/spine/scoliosis-orthosis",
      },
      {
        label: "Kyphosis Orthosis",
        path: "/orthotics/spine/kyphosis-orthosis",
      },
      {
        label: "Neck Orthosis",
        path: "/orthotics/spine/neck-orthosis",
      },
      {
        label: "Back pain and Posture control orthosis",
        path: "/orthotics/spine/back-pain-posture-control",
      },
    ],
  },
  {
    title: "Pectus Orthotics",
    image: pecorth,
    subItems: [
      {
        label: "Pectus Carinatum",
        path: "/orthotics/pectus/pectus-carinatum",
      },
      {
        label: "Pectus Excavatum",
        path: "/orthotics/pectus/pectus-excavatum",
      },
    ],
  },
  {
    title: "Adult Orthotic",
    image: adultorth,
    subItems: [
      {
        label: "C-brace",
        path: "/orthotics/adult/c-brace",
      },
      {
        label: "Agilik",
        path: "/orthotics/adult/agilik",
      },
      {
        label: "Functional Electrical Stimulation",
        path: "/orthotics/adult/functional-electrical-stimulation",
      },
      {
        label: "Paralysis braces (OTC)",
        path: "/orthotics/adult/paralysis-braces",
      },
    ],
  },
  {
    title: "Foot Orthotic",
    image: footorth,
    subItems: [
      {
        label: "Custom Foot Orthotics",
        path: "/orthotics/foot/custom-foot-orthotics",
      },
      {
        label: "Diabetic Foot Orthotics",
        path: "/orthotics/foot/diabetic-foot-orthotics",
      },
      {
        label: "Sports Foot Orthotics",
        path: "/orthotics/foot/sports-foot-orthotics",
      },
      {
        label: "Post-Surgical Foot Orthotics",
        path: "/orthotics/foot/post-surgical-foot-orthotics",
      },
    ],
  },
];
