import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Select,
  Table,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";
import withAuth from "@/components/withAuth";
import DesktopHeader from "../components/DesktopHeader";
import MobileHeader from "@/components/MobileHeader";
import Pagination from "@/components/Pagination";
import { getCameraInfo } from "./api/getCameraInfo";
import { getAllLocations } from "./api/getAllLocations";
import { updateCameraLocation } from "./api/updateCameraLocation";
import { updateCameraZone } from "./api/updateCameraZone";
import { updateCameraSubZone } from "./api/updateCameraSubZone";
import { searchCamerasByLocation } from "./api/searchCamerasByLocation";
import { searchCamerasByName } from "./api/searchCamerasByName";

const ManageCamera = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [cameras, setCameras] = useState([]); // Ensure cameras is always an array
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [searchedCameras, setSearchedCameras] = useState([]);
  const [locations, setLocations] = useState([]);
  const [zones, setZones] = useState([]);
  const [subZones, setSubZones] = useState([]);
  const [editingIndices, setEditingIndices] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedLocation, setSelectedLocation] = useState("");

  const toast = useToast();

  const itemsPerPage = 6;

  const [isLargerThan480] = useMediaQuery("(min-width: 480px)");
  const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setIsMobile(!isLargerThan480);
    setIsTablet(isLargerThan480 && !isLargerThan1024);
    setIsDesktop(isLargerThan1024);
  }, [isLargerThan480, isLargerThan1024]);

  useEffect(() => {
    fetchData();
    fetchLocations();
  }, [page, selectedLocation]);

  const fetchData = async () => {
    setLoading(true);
    try {
      let res;
      if (selectedLocation) {
        res = await searchCamerasByLocation(selectedLocation);
        console.log("Response: If", res);
        setCameras(res.cameralists);
        setTotalPages(res.totalPages);
        setLoading(false);
      } else {
        const userDetailsString = localStorage.getItem("userDetails");
        if (!userDetailsString) {
          throw new Error("User details not found in local storage");
        }
        const userDetails = JSON.parse(userDetailsString);
        const customerId = userDetails.customerid;
        res = await getCameraInfo(customerId, page, itemsPerPage);

        console.log("Response Else:", res);
        setCameras(res.cameras);
        setTotalPages(res.totalPages);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching camera info:", error);
      setLoading(false);
      toast({
        description: "Failed to fetch camera info",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const locationsData = await getAllLocations();
      setLocations(locationsData.locations);
      setZones(locationsData.zones);
      setSubZones(locationsData.subZones);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLoading(false);
    }
  };

  const handleEnterKeyPress = async (e) => {
    if (e.key === "Enter") {
      await handleButton();
    }
  };

  const handleButton = async () => {
    try {
      const resp = await searchCamerasByName(searchInput);
      if (resp && resp.cameras) {
        setSearchedCameras(resp.cameras);
        setCameras(resp.cameras);
        setTotalPages(Math.ceil(resp.totalItems / itemsPerPage));
      } else {
        console.error("Unexpected API Response Structure: ", resp);
        setSearchedCameras([]);
        setCameras([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error searching user:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const toggleEditRoleDropdown = (index) => {
    setEditingIndices((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    );
  };

  const handleLocationChange = async (event, index) => {
    const updatedCameras = [...cameras];
    const selectedLocation = locations.find(
      (location) => location.location === event.target.value
    );

    updatedCameras[index].location = event.target.value;
    setCameras(updatedCameras);

    try {
      if (selectedLocation) {
        await updateCameraLocation(
          updatedCameras[index].cameraid,
          selectedLocation._id
        );
        fetchData();
        showToast("Location Updated Successfully", "success");
        setEditingIndices((prevIndices) =>
          prevIndices.filter((i) => i !== index)
        );
      } else {
        console.error("Selected location not found");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleZoneChange = async (event, index) => {
    const updatedCameras = [...cameras];
    const selectedZone = zones.find((zone) => zone.zone === event.target.value);

    updatedCameras[index].zone = event.target.value;
    setCameras(updatedCameras);

    try {
      if (selectedZone) {
        await updateCameraZone(
          updatedCameras[index].cameraid,
          selectedZone._id
        );
        fetchData();
        showToast("Zone Updated Successfully", "success");
        setEditingIndices((prevIndices) =>
          prevIndices.filter((i) => i !== index)
        );
      } else {
        console.error("Selected zone not found");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleSubZoneChange = async (event, index) => {
    const updatedCameras = [...cameras];
    const selectedSubZone = subZones.find(
      (subZone) => subZone.subZone === event.target.value
    );

    updatedCameras[index].subZone = event.target.value;
    setCameras(updatedCameras);

    try {
      if (selectedSubZone) {
        await updateCameraSubZone(
          updatedCameras[index].cameraid,
          selectedSubZone._id
        );
        fetchData();
        showToast("SubZone Updated Successfully", "success");
        setEditingIndices((prevIndices) =>
          prevIndices.filter((i) => i !== index)
        );
      } else {
        console.error("Selected subzone not found");
      }
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleLocationSelect = (event) => {
    const location = event.target.value;
    setSelectedLocation(location);
    setSearchInput("");
    setPage(1);
  };

  const setNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  const setPreviousPage = () => {
    const previousPage = Math.max(page - 1, 1);
    setPage(previousPage);
  };

  const showToast = (msg, status) => {
    toast({
      description: msg,
      position: "bottom-left",
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box>
      {isDesktop && <DesktopHeader />}
      {isMobile && <MobileHeader />}
      <Box
        margin={{ base: "2vh 2vw", md: "5vh 5vw", lg: "5vh 12vw" }}
        overflowY="auto"
        display="flex"
        flexDirection="column"
        fontSize={isMobile ? "12px" : "16px"}
      >
        <Box
          display="flex"
          alignItems="center"
          marginBottom="3vh"
          marginLeft={isMobile ? "4vw" : "1vw"}
          marginTop={isMobile ? "10vh" : "0"}
        >
          <input
            flex={2}
            type="text"
            placeholder="Search Camera"
            onChange={handleSearch}
            value={searchInput}
            onKeyPress={handleEnterKeyPress}
            style={{
              border: "2px solid gray",
              borderRadius: "5px",
              width: isMobile ? "40vw" : isTablet ? "40vw" : "30vw",
              height: "5vh",
              marginRight: "1%",
              paddingLeft: "1%",
            }}
          />
          {!isMobile && (
            <Button
              colorScheme="blue"
              size="md"
              onClick={handleButton}
              borderRadius="5px"
              width={isMobile ? "25vw" : "10vw"}
              marginLeft="2vw"
            >
              Search
            </Button>
          )}
          <Select
            flex={1}
            marginLeft={isMobile ? "25vw" : "40vw"}
            onChange={handleLocationSelect}
            value={selectedLocation}
            style={{
              width: isMobile ? "25vw" : "10vw",
              fontSize: isMobile ? "12px" : "16px",
            }}
          >
            <option value="">Locations</option>
            {locations &&
              locations.length > 0 &&
              locations.map((locationObj) => (
                <option key={locationObj._id} value={locationObj.location}>
                  {locationObj.location}
                </option>
              ))}
          </Select>
        </Box>
        <Box flex="1" overflowY="auto">
          <Table colorScheme="gray" bg="inherit">
            <Thead bg="blue.100" color="white" boxShadow="md">
              <Tr>
                <Th>ID</Th>
                <Th>Camera ID</Th>
                <Th>Location</Th>
                <Th>Zone</Th>
                <Th>Sub Zone</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {loading ? (
                <Tr>
                  <Td colSpan={4}>Loading...</Td>
                </Tr>
              ) : cameras && cameras.length > 0 ? (
                cameras.map((camera, index) => (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{camera.cameraid}</Td>
                    <Td>
                      {editingIndices.includes(index) ? (
                        <Select
                          value={camera.location}
                          onChange={(event) =>
                            handleLocationChange(event, index)
                          }
                        >
                          {locations.map((locationObj) => (
                            <option
                              key={locationObj._id}
                              value={locationObj.location}
                            >
                              {locationObj.location}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        camera.location
                      )}
                    </Td>
                    <Td>
                      {editingIndices.includes(index) ? (
                        <Select
                          value={camera.zone}
                          onChange={(event) => handleZoneChange(event, index)}
                        >
                          {zones.map((zoneObj) => (
                            <option key={zoneObj._id} value={zoneObj.zone}>
                              {zoneObj.zone}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        camera.zone
                      )}
                    </Td>
                    <Td>
                      {editingIndices.includes(index) ? (
                        <Select
                          value={camera.subZone}
                          onChange={(event) =>
                            handleSubZoneChange(event, index)
                          }
                        >
                          {subZones.map((subZoneObj) => (
                            <option
                              key={subZoneObj._id}
                              value={subZoneObj.subZone}
                            >
                              {subZoneObj.subZone}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        camera.subZone
                      )}
                    </Td>
                    <Td>
                      <Box display="flex">
                        <Button
                          onClick={() => toggleEditRoleDropdown(index)}
                          bg={
                            editingIndices.includes(index)
                              ? "green.400"
                              : "blue.400"
                          }
                          marginRight="1vw"
                          size="sm"
                          color="white"
                        >
                          {editingIndices.includes(index) ? "Save" : "Edit"}
                        </Button>
                        <Button bg="red.400" size="sm" color="white">
                          Delete
                        </Button>
                      </Box>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr>
                  <Td colSpan={4}>No cameras found</Td>
                </Tr>
              )}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th colSpan={5}>
                  <Td colSpan={4}>
                    {totalPages>1 &&(
                      <Pagination
                      page={page}
                      totalPages={totalPages}
                      setNextPage={setNextPage}
                      setPreviousPage={setPreviousPage}
                      setPage={setPage}
                    />
                    )}
                  </Td>
                </Th>
              </Tr>
            </Tfoot>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default withAuth(ManageCamera);

// import { useState, useEffect } from "react";
// import {
//   Heading,
//   useMediaQuery,
//   Table,
//   Thead,
//   Tr,
//   Th,
//   Tbody,
//   Td,
//   Tfoot,
//   Select,
//   Menu,
//   MenuItem,
//   MenuButton,
//   Box,
//   Button,
//   useToast,
// } from "@chakra-ui/react";
// import { MdEdit, MdDelete } from "react-icons/md";
// import React from "react";
// import withAuth from "@/components/withAuth";
// import DesktopHeader from "../components/DesktopHeader";
// import MobileHeader from "@/components/MobileHeader";
// import Pagination from "@/components/Pagination";
// import { getCameraInfo } from "./api/getCameraInfo";
// import { getAllLocations } from "./api/getAllLocations";
// import { updateCameraLocation } from "./api/updateCameraLocation";
// import { updateCameraZone } from "./api/updateCameraZone";
// import { updateCameraSubZone } from "./api/updateCameraSubZone";
// import { searchCamerasByLocation } from "./api/searchCamerasByLocation";
// import { searchCamerasByName } from "./api/searchCamerasByName";
// import { set } from "date-fns";

// const manageCamera = () => {
//   const [isMobile, setIsMobile] = useState(false);
//   const [isDesktop] = useMediaQuery("(min-width: 1025px)");
//   const [totalPages, setTotalPages] = useState(0);
//   const [cameras, setCameras] = useState([]); // Ensure cameras is always an array
//   const [loading, setLoading] = useState(true);
//   const [searchInput, setSearchInput] = useState("");
//   const [searchedCameras, setSearchedCameras] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [zones, setZones] = useState([]);
//   const [subZones, setSubZones] = useState([]);
//   const [editingIndices, setEditingIndices] = useState([]);
//   const [page, setPage] = useState(1);
//   const [selectedLocation, setSelectedLocation] = useState("");

//   const toast = useToast();
//   const showToast = (msg, status1) => {
//     toast({
//       description: msg,
//       position: "bottom-left",
//       status: status1,
//       duration: 3000,
//       isClosable: true,
//     });
//   };
//   const itemsPerPage = 4;

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 480);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   useEffect(() => {
//     fetchData();
//     fetchLocations();
//     // console.log("selectedLocation", selectedLocation);
//   }, [page, selectedLocation]);

// const fetchData = async () => {
//   setLoading(true);
//   try {
//     let res;
//     if (selectedLocation) {
//       res = await searchCamerasByLocation(selectedLocation);
//       console.log("Response: If", res);
//       setCameras(res.cameralists)
//       setTotalPages(res.totalPages);
//       setLoading(false);
//     } else {
//       const userDetailsString = localStorage.getItem("userDetails");
//       if (!userDetailsString) {
//         throw new Error("User details not found in local storage");
//       }
//       const userDetails = JSON.parse(userDetailsString);
//       const customerId = userDetails.customerid;
//       res = await getCameraInfo(customerId, page, itemsPerPage);

//       console.log("Response Else:", res);
//       setCameras(res.cameras);
//       setTotalPages(res.totalPages);
//       setLoading(false);
//     }

//   } catch (error) {
//     console.error("Error fetching camera info:", error);
//     setLoading(false);
//     toast({
//       description: "Failed to fetch camera info",
//       status: "error",
//       duration: 3000,
//       isClosable: true,
//     });
//   }
// };

//   const fetchLocations = async () => {
//     try {
//       setLoading(true);
//       const locationsData = await getAllLocations();
//       setLocations(locationsData.locations);
//       setZones(locationsData.zones);
//       setSubZones(locationsData.subZones);
//       setLoading(false);
//       // console.log("Locations Data", locationsData);
//       // console.log("zone Data", locationsData.zones);
//       // console.log("subzones Data", locationsData.subZones);
//     } catch (error) {
//       console.error("Error fetching locations:", error);
//       setLoading(false);
//     }
//   };
//   const handleEnterKeyPress = (e) => {
//     if (e.key === "Enter") {
//       setCameras(searchedCameras);
//     }
//   };
//   // const handleButton = async () => {
//   //   try {
//   //     const resp = await searchCamerasByName(searchInput);
//   //     setSearchedCameras(resp.data);
//   //     setCameras(resp.data);
//   //     console.log("Searched Cameras: ",resp.data);
//   //     setTotalPages(Math.ceil(resp.data.length / itemsPerPage));
//   //   } catch (error) {
//   //     console.error("Error searching user:", error);
//   //   }
//   // };

//   const handleButton = async () => {
//     try {
//       const resp = await searchCamerasByName(searchInput);
//       console.log("API Response: ", resp);

//       if (resp && resp.cameras) {
//         console.log("Searched Cameras: ", resp.cameras);
//         setSearchedCameras(resp.cameras);
//         setCameras(resp.cameras);
//         setTotalPages(Math.ceil(resp.totalItems / itemsPerPage));
//       } else {
//         console.error("Unexpected API Response Structure: ", resp);
//         setSearchedCameras([]);
//         setCameras([]);
//         setTotalPages(0);
//       }
//     } catch (error) {
//       console.error("Error searching user:", error);
//     }
//   };

//   const handleSearch = async (e) => {
//     setSearchInput(e.target.value);
//   };

//   const toggleEditRoleDropdown = (index) => {
//     setEditingIndices((prevIndices) =>
//       prevIndices.includes(index)
//         ? prevIndices.filter((i) => i !== index)
//         : [...prevIndices, index]
//     );
//   };

//   const handleLocationChange = async (event, index) => {
//     const updatedCameras = [...cameras];
//     const selectedLocation = locations.find(
//       (location) => location.location === event.target.value
//     );

//     updatedCameras[index].location = event.target.value;
//     setCameras(updatedCameras);
//     try {
//       if (selectedLocation) {
//         await updateCameraLocation(
//           updatedCameras[index].cameraid,
//           selectedLocation._id
//         );
//         fetchData();
//         showToast("Location Updated Successfully", "success");
//         // Remove index from editingIndices after successful update
//         setEditingIndices((prevIndices) =>
//           prevIndices.filter((i) => i !== index)
//         );
//       } else {
//         console.error("Selected location not found");
//       }
//     } catch (error) {
//       showToast(error.message, "error");
//     }
//   };

//   const handleZoneChange = async (event, index) => {
//     const updatedCameras = [...cameras];
//     const selectedZone = zones.find((zone) => zone.zone === event.target.value);

//     updatedCameras[index].zone = event.target.value;
//     setCameras(updatedCameras);

//     try {
//       if (selectedZone) {
//         await updateCameraZone(
//           updatedCameras[index].cameraid,
//           selectedZone._id
//         );
//         fetchData();
//         showToast("Zone Updated Successfully", "success");
//         // Remove index from editingIndices after successful update
//         setEditingIndices((prevIndices) =>
//           prevIndices.filter((i) => i !== index)
//         );
//       } else {
//         console.error("Selected zone not found");
//       }
//     } catch (error) {
//       showToast(error.message, "error");
//     }
//   };

//   const handleSubZoneChange = async (event, index) => {
//     const updatedCameras = [...cameras];
//     const selectedSubZone = subZones.find(
//       (subZone) => subZone.subZone === event.target.value
//     );

//     updatedCameras[index].subZone = event.target.value;
//     setCameras(updatedCameras);

//     try {
//       if (selectedSubZone) {
//         await updateCameraSubZone(
//           updatedCameras[index].cameraid,
//           selectedSubZone._id
//         );
//         fetchData();
//         showToast("SubZone Updated Successfully", "success");
//         // Remove index from editingIndices after successful update
//         setEditingIndices((prevIndices) =>
//           prevIndices.filter((i) => i !== index)
//         );
//       } else {
//         console.error("Selected subzone not found");
//       }
//     } catch (error) {
//       showToast(error.message, "error");
//     }
//   };

//   const handleLocationSelect = (event) => {
//     const Location = event.target.value;
//     setSelectedLocation(Location);
//     setSearchInput("");
//     setPage(1);
//   };

//   const setNextPage = () => {
//     const nextPage = page + 1;
//     setPage(nextPage);
//   };

//   const setPreviousPage = () => {
//     const previousPage = Math.max(page - 1, 1);
//     setPage(previousPage);
//   };

//   return (
//     <Box>
//       {isDesktop && <DesktopHeader />}
//       {isMobile && <MobileHeader />}
//       <Box
//         marginLeft={"15vw"}
//         marginTop={"5vh"}
//         marginRight={"12vw"}
//         overflowY="auto"
//         display={"flex"}
//         flexDirection="column"
//       >
//         <Box display="flex" alignItems="center" marginBottom="1%">
//         <input
//             flex={2}
//             type="text"
//             placeholder=" Search Camera"
//             onChange={handleSearch}
//             value={searchInput}
//             style={{
//               border: "2px solid gray",
//               borderRadius: "5px",
//               width: "30vw",
//               height: "5vh",
//               marginRight: "1%",
//               paddingLeft: "1%",
//             }}
//           />
//           <Button
//             colorScheme="blue"
//             size="md"
//             onClick={handleButton}
//             borderRadius="5px"
//             width={"6vw"}
//           >
//             Search
//           </Button>
//           <Select
//             flex={1}
//             marginLeft="1rem"
//             onChange={handleLocationSelect}
//             value={selectedLocation}
//             style={{ marginLeft: "30vw", width: "10vw" }}
//           >
//             <option value="">All Location</option>
//             {locations &&
//               locations.length > 0 &&
//               locations.map((locationObj) => (
//                 <option key={locationObj._id} value={locationObj.location}>
//                   {locationObj.location}
//                 </option>
//               ))}
//           </Select>
//         </Box>

//         <Box flex="1" overflowY="auto">
//           <Table colorScheme="gray" bg="inherit">
//             <Thead bg="blue.100" color="white" boxShadow="md">
//               <Tr>
//                 <Th>Id</Th>
//                 <Th>Name</Th>
//                 <Th>Location</Th>
//                 <Th>Zone</Th>
//                 <Th>SubZone</Th>
//                 <Th colSpan={2}>Action</Th>
//               </Tr>
//             </Thead>
//             <Tbody>
//               {loading ? (
//                 <Tr>
//                   <Td colSpan={4}>Loading...</Td>
//                 </Tr>
//               ) : cameras && cameras.length > 0 ? (
//                 cameras.map((camera, index) => (
//                   <Tr key={index}>
//                     {" "}
//                     <Td>{index + 1}</Td>
//                     <Td>{camera.name}</Td>
//                     <Td>
//                       {editingIndices.includes(index) ? (
//                         <Select
//                           flex={1}
//                           marginLeft="1rem"
//                           style={{ width: "10vw" }}
//                           value={camera.location}
//                           onChange={(event) =>
//                             handleLocationChange(event, index)
//                           }
//                         >
//                           <option value="">Select</option>
//                           {locations.map((locationObj) => (
//                             <option
//                               key={locationObj._id}
//                               value={locationObj.location}
//                             >
//                               {locationObj.location}
//                             </option>
//                           ))}
//                         </Select>
//                       ) : (
//                         camera.location
//                       )}
//                     </Td>
//                     <Td>
//                       {editingIndices.includes(index) ? (
//                         <Select
//                           flex={1}
//                           marginLeft="1rem"
//                           style={{ width: "10vw" }}
//                           value={camera.zone}
//                           onChange={(event) => handleZoneChange(event, index)}
//                         >
//                           <option value="">Select</option>
//                           {zones.map((zoneObj) => (
//                             <option key={zoneObj.zone} value={zoneObj.zone}>
//                               {zoneObj.zone}
//                             </option>
//                           ))}
//                         </Select>
//                       ) : (
//                         camera.zone
//                       )}
//                     </Td>
//                     <Td>
//                       {editingIndices.includes(index) ? (
//                         <Select
//                           flex={1}
//                           marginLeft="1rem"
//                           style={{ width: "10vw" }}
//                           value={camera.subZone}
//                           onChange={(event) =>
//                             handleSubZoneChange(event, index)
//                           }
//                         >
//                           <option value="">Select</option>
//                           {subZones.map((subZoneObj) => (
//                             <option
//                               key={subZoneObj.subZone}
//                               value={subZoneObj.subZone}
//                             >
//                               {subZoneObj.subZone}
//                             </option>
//                           ))}
//                         </Select>
//                       ) : (
//                         camera.subZone
//                       )}
//                     </Td>
//                     <Td colSpan={2}>
//                       <Td>
//                         <div style={{ display: "flex", alignItems: "center" }}>
//                           <Button
//                             onClick={(event) => {
//                               handleLocationChange(event, index);
//                               handleZoneChange(event, index);
//                               handleSubZoneChange(event, index);
//                               toggleEditRoleDropdown(index);
//                             }}
//                           >
//                             <MdEdit fontSize={"18px"} color="#1560bd" />
//                           </Button>

//                           <Button marginLeft={"3%"}>
//                             <MdDelete fontSize={"18px"} color="red" />
//                           </Button>
//                         </div>
//                       </Td>
//                     </Td>
//                   </Tr>
//                 ))
//               ) : (
//                 <Tr>
//                   <Td colSpan={4}>No cameras found</Td>
//                 </Tr>
//               )}
//             </Tbody>
//             <Tfoot>
//               <Tr>
// <Td colSpan={4}>
//   <Pagination
//     page={page}
//     totalPages={totalPages}
//     setNextPage={setNextPage}
//     setPreviousPage={setPreviousPage}
//     setPage={setPage}
//   />
// </Td>
//               </Tr>
//             </Tfoot>
//           </Table>
//         </Box>
//       </Box>
//     </Box>
//   );
// };
// export default withAuth(manageCamera);
