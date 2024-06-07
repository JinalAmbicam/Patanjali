// import React from "react";
// import GoogleMapReact from "google-map-react";
// import MobileHeader from "@/components/MobileHeader";
// import DesktopHeader from "@/components/DesktopHeader";
// import { useMediaQuery } from "@chakra-ui/react";

// const AnyReactComponent = ({ text }) => <div>{text}</div>;

// export default function googlemap() {
//     const [isDesktop] = useMediaQuery("(min-width: 1025px)");
//   const defaultProps = {
//     center: {
//       lat: 10.99835602,
//       lng: 77.01502627,
//     },
//     zoom: 11,
//   };

//   return (
//     // Important! Always set the container height explicitly
//     <div>
//   <div className="headers">
//     {isDesktop ? <DesktopHeader /> : <MobileHeader />}
//   </div>
//       <div style={{ height: "70vh", width: "85%" ,marginLeft:"10%",marginTop:"3%"}}>
//         <GoogleMapReact
//           bootstrapURLKeys={{ key: "" }}
//           defaultCenter={defaultProps.center}
//           defaultZoom={defaultProps.zoom}
//         >
//           <AnyReactComponent lat={59.955413} lng={30.337844} text="My Marker" />
//         </GoogleMapReact>
//       </div>
//     </div>
//   );
// }

import React from "react";
import MobileHeader from "@/components/MobileHeader";
import DesktopHeader from "@/components/DesktopHeader";
import { useMediaQuery } from "@chakra-ui/react";

export default function GoogleMap() {
  const [isDesktop] = useMediaQuery("(min-width: 1025px)");

  const locations = [
    {
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.844492339554!2d77.06243217348673!3d28.574432033024127!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1b054ce17d4d%3A0x5a22f6f64c7161c7!2s231%2C%20Dwarka%20Sector%209%20Rd%2C%20Dwarka%20Sector%209%2C%20Dwarka%2C%20New%20Delhi%2C%20Delhi%2C%20110075!5e0!3m2!1sen!2sin!4v1717755845375!5m2!1sen!2sin",
    },
    {
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3461.145412244906!2d78.12421477462273!3d29.831224228643244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3909456877a9e699%3A0xf6de25dd00080db6!2sPatanjali%20Food%20and%20Herbal%20Park!5e0!3m2!1sen!2sin!4v1717756006957!5m2!1sen!2sin",
    },
    {
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3494.7233064733655!2d78.76108907458159!3d28.84709667430643!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390afbe411717dad%3A0x1d447e44f4e9329c!2sPatanjali%20Mega%20Store!5e0!3m2!1sen!2sin!4v1717756169566!5m2!1sen!2sin",
    },
    {
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3775.805294300754!2d73.21706217424587!3d18.85132325898933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e3e29b8bb467%3A0x7a212eb798b919de!2sPatanjali%20Foods%20Pvt%20Ltd!5e0!3m2!1sen!2sin!4v1717756295281!5m2!1sen!2sin",
    },
  ];

  return (
    <div>
      <div className="headers">
        {isDesktop ? <DesktopHeader /> : <MobileHeader />}
      </div>
      <div
        style={{
          height: "70vh",
          width: "85%",
          marginLeft: "10%",
          marginTop: "3%",
        }}
      >
        {locations.map((location, index) => (
          <div key={index} style={{ marginBottom: "20px" }}>
            <iframe
              src={location.src}
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
}
