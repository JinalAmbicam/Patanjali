import { useState, useEffect } from "react";
import { useMediaQuery } from "@chakra-ui/react";
import {
  Card,
  CardHeader,
  CardBody,
  Stack,
  Heading,
  Button,
  CardFooter,
  Image,
  Text,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut, doughnut, Line } from "react-chartjs-2";
import MobileHeader from "@/components/MobileHeader";
import DesktopHeader from "@/components/DesktopHeader";
import withAuth from "@/components/withAuth";
// import { getLocationCameras } from "./api/getLocationCameras ";
import { DateTime } from "luxon";

const locations = [
  { name: "Raipur" },
  { name: "Dwarka" },
  { name: "Moradabad" },
  { name: "Indore" },
  { name: "Howrah" },
  { name: "Hyderabad" },
];
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [isDesktop] = useMediaQuery("(min-width: 1025px)");
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isCameraFeedOpen, setIsCameraFeedOpen] = useState(false);
  const [modifiedCameraUrl, setModifiedCameraUrl] = useState("");
  const [lastfilename, setLastfilename] = useState("");
  const [cameraurl, setCameraurl] = useState("");
  const [planname, setPlanname] = useState(false);
  const [plantext, setPlantext] = useState("");
  const [islive, setisLive] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [streamid, setStreamid] = useState("");
  const [cameraId, setCameraid] = useState("");
  const [cameraname, setCameraname] = useState("");
  const [deviceId, setDeviceId] = useState("");



  const timeZoneId = "Asia/Kolkata";


  // const handleOpenModal = (
  //   streamname,
  //   createdDate,
  //   plandays,
  //   cameraId,
  //   cameraname,
  //   planname,
  //   islive,
  //   cameraurl,
  //   deviceId
  // ) => {
  //   function simplifyString(inputString) {
  //     // Remove non-alphanumeric characters and convert to lowercase
  //     return inputString.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  //   }

  //   const newpname = simplifyString(planname);

  //   // const modifiedCameraUrl = cameraurl.replace(':1938', ':443');

  //   let modifiedCameraUrl = cameraurl;
  //   let lastfilename = "index.m3u8";

  //   // Check if the first segment is 'media5'
  //   if (cameraurl.startsWith("media5")) {
  //     modifiedCameraUrl = cameraurl.replace(":1938", ":443");
  //     const currentDate = new Date();
  //     const day = currentDate.getDate().toString().padStart(2, "0");
  //     const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is zero-indexed
  //     const year = currentDate.getFullYear().toString().slice(-2);
  //     const formattedDate = `${day}_${month}_${year}`;
  //     lastfilename = `${formattedDate}/${streamname}.m3u8`;
  //   } else if (cameraurl.startsWith("media11.ambicam.com")) {
  //     modifiedCameraUrl = cameraurl.replace(":1938", ":443");
  //     const currentDate = new Date();
  //     const day = currentDate.getDate().toString().padStart(2, "0");
  //     const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is zero-indexed
  //     const year = currentDate.getFullYear().toString().slice(-2);
  //     const formattedDate = `${day}_${month}_${year}`;
  //     lastfilename = `${formattedDate}/${streamname}.m3u8`;
  //   } else if (cameraurl.startsWith("media1.ambicam.com")) {
  //     modifiedCameraUrl = cameraurl.replace(":1938", ":443");
  //     const currentDate = new Date();
  //     const day = currentDate.getDate().toString().padStart(2, "0");
  //     const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is zero-indexed
  //     const year = currentDate.getFullYear().toString().slice(-2);
  //     const formattedDate = `${day}_${month}_${year}`;
  //     lastfilename = `${formattedDate}/${streamname}_live.m3u8`;
  //   } else if (cameraurl.startsWith("media12.ambicam.com")) {
  //     modifiedCameraUrl = cameraurl.replace(
  //       "media12.ambicam.com:1938",
  //       "media1.ambicam.com:443"
  //     );
  //     const currentDate = new Date();
  //     const day = currentDate.getDate().toString().padStart(2, "0");
  //     const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is zero-indexed
  //     const year = currentDate.getFullYear().toString().slice(-2);
  //     const formattedDate = `${day}_${month}_${year}`;
  //     lastfilename = `${formattedDate}/${streamname}_live.m3u8`;
  //   } else if (cameraurl.startsWith("media6.ambicam.com")) {
  //     modifiedCameraUrl = cameraurl.replace(
  //       "media6.ambicam.com:1938",
  //       "media1.ambicam.com:443"
  //     );
  //     const currentDate = new Date();
  //     const day = currentDate.getDate().toString().padStart(2, "0");
  //     const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is zero-indexed
  //     const year = currentDate.getFullYear().toString().slice(-2);
  //     const formattedDate = `${day}_${month}_${year}`;
  //     lastfilename = `${formattedDate}/${streamname}_live.m3u8`;
  //   } else {
  //     modifiedCameraUrl = cameraurl.replace(":1938", ":443");
  //     lastfilename = `index.m3u8`;
  //   }
  //   setModifiedCameraUrl(modifiedCameraUrl);
  //   setLastfilename(lastfilename);

  //   setCameraurl(cameraurl);
  //   setPlanname(newpname);
  //   setPlantext(planname);
  //   setisLive(islive);
  //   setVideoUrl(`https://${modifiedCameraUrl}${streamname}/${lastfilename}`);
  //   console.log("Video URL:",videoUrl);
  //   setIsModalOpen(true);
  //   setStreamid(streamname);
  //   setCameraid(cameraId);
  //   setCameraname(cameraname);
  //   setDeviceId(deviceId);
  //   // console.log(cameraId)
  // };

  // const handleOpenModal_location = async (locationName) => {
  //   console.log("Open model clickedddd");
  //   setSelectedLocation(locationName);
  //   console.log("Location", locationName);
  //   await fetchCameras(locationName);
  //   console.log("Fetchedd ");

  //   setIsModalOpen(true);
  // };
  useEffect(() => {
    if (selectedLocation) {
      fetchCameras(selectedLocation);
    }
  }, [selectedLocation]);

  const fetchCameras = async (locationName) => {
    try {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      const customerId = userDetails.customerid;
      const data = await getLocationCameras(customerId, locationName);
      if (data.success) {
        setCameras(data.cameras); // Update state with the fetched cameras
      } else {
        console.error("Error fetching cameras:", data);
      }
    } catch (error) {
      console.error("Error fetching cameras:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleCameraClick = (camera) => {
    setSelectedCamera(camera);
    setIsCameraFeedOpen(true);
  };

  const handleCloseCameraFeedModal = () => {
    setIsCameraFeedOpen(false);
    setSelectedCamera(null);
  };

  return (
    <div className="dashboard-container">
      <div className="headers">
        {isDesktop ? <DesktopHeader /> : <MobileHeader />}
      </div>
      <div
        className="main-container"
        style={{
          marginLeft: "7%",
          marginTop: "2%",
          // border: "3px solid gray",
          width: "1350px",
        }}
      >
        <Heading marginLeft="40%" marginTop="1%" fontSize="3xl" color="gray">
          Camera Dashboard{" "}
        </Heading>
        <div
          className="graph"
          style={{
            display: "flex",
            flexDirection: "row",
            // alignItems: "center",
            // marginLeft:"10px"
          }}
        >
          <div
            className="doughnutchart"
            style={{
              height: "300px",
              width: "350px",
              marginTop: "2%",
              marginLeft: "30px",
              boxShadow: "2px 2px 2px 2px gray",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            <Doughnut
              data={{
                labels: ["Online", "Offline"],
                datasets: [
                  {
                    data: [200, 300],
                    backgroundColor: [
                      "rgba(0,128,0,0.5)",
                      "rgba(255, 0, 0,0.5)",
                    ],
                    borderWidth: 1,
                    borderRadius: 5,
                  },
                ],
              }}
            />
          </div>
          <div
            className="linechart"
            style={{
              height: "300px",
              width: "600px",
              marginTop: "2%",
              marginLeft: "30px",
              boxShadow: "2px 2px 2px 2px gray",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            <Line
              data={{
                labels: ["A", "B", "C", "D", "E", "F", "G"],
                datasets: [
                  {
                    label: "Online",
                    data: [200, 300, 400, 500, 600, 620, 800],
                    backgroundColor: "rgba(0,128,0,0.5)", // color for "Online"
                    borderColor: "rgba(0,128,0,1)", // border color for "Online"
                    borderWidth: 1,
                    borderRadius: 5,
                  },
                  {
                    label: "Offline",
                    data: [100, 175, 240, 300, 305, 450, 500],
                    backgroundColor: "rgba(255, 0, 0,0.5)", // color for "Offline"
                    borderColor: "rgba(255, 0, 0,1)", // border color for "Offline"
                    borderRadius: 5,
                  },
                  {
                    label: "Total",
                    data: [250, 375, 470, 590, 660, 780, 900],
                    backgroundColor: "rgba(0, 0, 255,0.5)", // color for "Total"
                    borderColor: "rgba(0, 0, 255,1)", // border color for "Total"
                    borderRadius: 5,
                  },
                ],
              }}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
              }}
            />
          </div>
        </div>

        <div
          className="cards"
          style={{
            marginLeft: "2%",
            marginTop: "5%",
            height: "400px",
            width: "1300px",
            overflow: "auto",
            maxHeight: "300px",
          }}
        >
          <SimpleGrid
            spacing={4}
            templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
          >
            <Card
              style={{
                marginLeft: "1%",
                marginTop: "2%",
                height: "145px",
                // border: "2px solid gray",
                boxShadow: "2px 2px 2px 2px gray",
                width: "200px",
              }}
            >
              <CardHeader>
                <Heading size="md" color="black">
                  {" "}
                  Raipur
                </Heading>
                <Button
                  marginTop={"7%"}
                  marginBottom={"7%"}
                  onClick={() => handleOpenModal_location("Raipur")}
                >
                  Show Camera
                </Button>
                <br></br>
                <text> 🟢On 0 🔴Off 8</text>
              </CardHeader>
            </Card>
            <Card
              style={{
                marginLeft: "1%",
                marginTop: "2%",
                height: "145px",
                // border: "2px solid gray",
                boxShadow: "2px 2px 2px 2px gray",
                width: "200px",
              }}
            >
              <CardHeader>
                <Heading size="md" color="black">
                  {" "}
                  Dwarka
                </Heading>
                <Button
                  marginTop={"7%"}
                  marginBottom={"7%"}
                  onClick={() => handleOpenModal_location("Dwarka")}
                >
                  Show Camera
                </Button>
                <br></br>
                <text> 🟢On 2 🔴Off 0</text>
              </CardHeader>
            </Card>
            <Card
              style={{
                marginLeft: "1%",
                marginTop: "2%",
                height: "145px",
                // border: "2px solid gray",
                boxShadow: "2px 2px 2px 2px gray",
                width: "200px",
              }}
            >
              <CardHeader>
                <Heading size="md" color="black">
                  {" "}
                  Moradabad
                </Heading>
                <Button
                  marginTop={"7%"}
                  marginBottom={"7%"}
                  onClick={() => handleOpenModal_location("Moradabad")}
                >
                  Show Camera
                </Button>
                <br></br>
                <text> 🟢On 0 🔴Off 4</text>
              </CardHeader>
            </Card>
            <Card
              style={{
                marginLeft: "1%",
                marginTop: "2%",
                height: "145px",
                // border: "2px solid gray",
                boxShadow: "2px 2px 2px 2px gray",
                width: "200px",
              }}
            >
              <CardHeader>
                <Heading size="md" color="black">
                  {" "}
                  Indore
                </Heading>
                <Button
                  marginTop={"7%"}
                  marginBottom={"7%"}
                  onClick={() => handleOpenModal_location("Indore")}
                >
                  Show Camera
                </Button>
                <br></br>
                <text> 🟢On 0 🔴Off 1</text>
              </CardHeader>
            </Card>
            <Card
              style={{
                marginLeft: "1%",
                marginTop: "2%",
                height: "145px",
                // border: "2px solid gray",
                boxShadow: "2px 2px 2px 2px gray",
                width: "200px",
              }}
            >
              <CardHeader>
                <Heading size="md" color="black">
                  {" "}
                  Howrah
                </Heading>
                <Button
                  marginTop={"7%"}
                  marginBottom={"7%"}
                  onClick={() => handleOpenModal_location("Howrah")}
                >
                  Show Camera
                </Button>
                <br></br>
                <text> 🟢On 0 🔴Off 6</text>
              </CardHeader>
            </Card>
            <Card
              style={{
                marginLeft: "1%",
                marginTop: "2%",
                height: "145px",
                // border: "2px solid gray",
                boxShadow: "2px 2px 2px 2px gray",
                width: "200px",
              }}
            >
              <CardHeader>
                <Heading size="md" color="black">
                  {" "}
                  Hyderabad
                </Heading>
                <Button
                  marginTop={"7%"}
                  marginBottom={"7%"}
                  onClick={() => handleOpenModal_location("Hyderabad")}
                >
                  Show Camera
                </Button>
                <br></br>
                <text> 🟢On 0 🔴Off 0</text>
              </CardHeader>
            </Card>
          </SimpleGrid>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            style={{
              color: "#333",
              fontWeight: "bold",
              padding: "10px 20px",
            }}
          >
            Cameras
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            {cameras.map((camera, index) => (
              <div
                key={index}
                onClick={() => handleCameraClick(camera)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <Button
                  colorScheme="blue"
                  ml={10}
                  onClick={() =>
                    handleOpenModal(
                      camera.streamname,
                      camera.createdDate,
                      camera.plandays,
                      camera.cameraid,
                      camera.cameraname,
                      camera.planname,
                      camera.islive,
                      camera.cameraurl,
                      camera.deviceid
                    )
                  }
                >
                  <Text>{camera.cameraname}</Text>
                </Button>
              </div>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* {selectedCamera && (
        <Modal
          isOpen={isCameraFeedOpen}
          onClose={handleCloseCameraFeedModal}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Camera Feed</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {cameras.map((camera, index) => (
                <Text>CameraFeed for {selectedCamera.cameraname}</Text>
              ))}
            </ModalBody>
          </ModalContent>
        </Modal>
      )} */}
    </div>
  );
};

export default withAuth(Dashboard2);
