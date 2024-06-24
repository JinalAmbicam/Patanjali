import React, { useState, useEffect } from "react";
import DesktopHeader from "../components/DesktopHeader";
import MobileHeader from "@/components/MobileHeader";
import { getAllLocations } from "./api/getAllLocations";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import { createLocation } from "./api/createLocation";
import { updateLocation } from "./api/updateLocation";
import { deleteLocation } from "./api/deleteLocation";
import { createZone } from "./api/createZone";
import { createSubZone } from "./api/createSubZone";
import { updateZone } from "./api/updateZone";
import { updateSubZone } from "./api/updateSubZone";
import { deleteZone } from "./api/deleteZone";
import { deleteSubZone } from "./api/deleteSubZone";

export default function ManageLocation() {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isLargerThan480] = useMediaQuery("(min-width: 480px)");
  const [isLargerThan1024] = useMediaQuery("(min-width: 1024px)");
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [zones, setZones] = useState([]);
  const [subZones, setSubZones] = useState([]);
  const {
    isOpen: isOpenAdd,
    onOpen: onOpenAdd,
    onClose: onCloseAdd,
  } = useDisclosure();
  const {
    isOpen: isOpenEdit,
    onOpen: onOpenEdit,
    onClose: onCloseEdit,
  } = useDisclosure();
  const {
    isOpen: isOpenDelete,
    onOpen: onOpenDelete,
    onClose: onCloseDelete,
  } = useDisclosure();
  const {
    isOpen: isOpenAddZone,
    onOpen: onOpenAddZone,
    onClose: onCloseAddZone,
  } = useDisclosure();
  const {
    isOpen: isOpenEditZone,
    onOpen: onOpenEditZone,
    onClose: onCloseEditZone,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteZone,
    onOpen: onOpenDeleteZone,
    onClose: onCloseDeleteZone,
  } = useDisclosure();
  const {
    isOpen: isOpenAddSubZone,
    onOpen: onOpenAddSubZone,
    onClose: onCloseAddSubZone,
  } = useDisclosure();
  const {
    isOpen: isOpenEditSubZone,
    onOpen: onOpenEditSubZone,
    onClose: onCloseEditSubZone,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteSubZone,
    onOpen: onOpenDeleteSubZone,
    onClose: onCloseDeleteSubZone,
  } = useDisclosure();

  const [locationName, setLocationName] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [subZoneName, setSubZoneName] = useState("");
  const [selectedLocationId, setSelectedLocationId] = useState("");
  const [oldLocation, setOldLocation] = useState("");
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [oldZone, setOldZone] = useState("");
  const [selectedSubZoneId, setSelectedSubZoneId] = useState("");
  const [oldSubZone, setOldSubZone] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setIsMobile(!isLargerThan480);
    setIsTablet(isLargerThan480 && !isLargerThan1024);
    setIsDesktop(isLargerThan1024);
  }, [isLargerThan480, isLargerThan1024]);

  useEffect(() => {
    fetchLocations();
    fetchZones();
    fetchSubZones();
  }, []);

  const toast = useToast();
  const showToast = (msg, status) => {
    toast({
      description: msg,
      position: "bottom-left",
      status: status,
      duration: 3000,
      isClosable: true,
    });
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const locationsData = await getAllLocations();
      setLocations(locationsData.locations);
      console.log("Locations Data", locationsData);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const fetchZones = async () => {
    try {
      setLoading(true);
      const ZoneData = await getAllLocations();
      setZones(ZoneData.zones);
      console.log("Zones Data", ZoneData.zones);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };
  const fetchSubZones = async () => {
    try {
      setLoading(true);
      const subZoneData = await getAllLocations();
      setSubZones(subZoneData.subZones);
      console.log("SubZoneData: ", subZoneData.subZones);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAddLocation = async () => {
    try {
      console.log("Location name before sending:", locationName);
      const result = await createLocation(locationName);
      console.log("Result:", result);
      setLocationName(""); // Reset the location name input
      fetchLocations(); // Refresh the locations list after adding
      onCloseAdd();
      showToast(`${locationName} Added Successfully`, "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleAddZone = async () => {
    try {
      console.log("Zone name before sending:", zoneName);
      const result = await createZone(zoneName);
      console.log("Result:", result);
      setZoneName(""); // Reset the location name input
      fetchZones(); // Refresh the locations list after adding
      onCloseAddZone();
      showToast(`${zoneName} Added Successfully`, "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleAddSubZone = async () => {
    try {
      console.log("subZone name before sending:", subZoneName);
      const result = await createSubZone(subZoneName);
      console.log("Result:", result);
      setSubZoneName("");
      fetchSubZones();
      showToast(`${subZoneName} Added Successfully`, "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleUpdateLocation = async () => {
    try {
      console.log("Location name before sending:", locationName);
      const result = await updateLocation(selectedLocationId, locationName); // Assuming updateLocation function accepts location ID and name
      console.log("Result:", result);
      setLocationName("");
      fetchLocations();
      onCloseEdit();
      showToast(`${locationName} Edited Successfully`, "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleUpdateZone = async () => {
    try {
      console.log("Zone name before sending:", zoneName);
      const result = await updateZone(selectedZoneId, zoneName); // Assuming updateLocation function accepts location ID and name
      console.log("Result:", result);
      setZoneName("");
      fetchZones();
      onCloseEditZone();
      showToast(`${zoneName} Edited Successfully`, "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleUpdateSubZone = async () => {
    try {
      console.log("subzone name before sending:", subZoneName);
      const result = await updateSubZone(selectedSubZoneId, subZoneName); // Assuming updateLocation function accepts location ID and name
      console.log("Result:", result);
      setSubZoneName("");
      fetchSubZones();
      onCloseEditSubZone();
      showToast(`${subZoneName} Edited Successfully`, "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleDeleteLocation = async () => {
    try {
      console.log("Deleting location with ID:", selectedLocationId);
      const result = await deleteLocation(selectedLocationId);
      console.log("Delete Result:", result);
      fetchLocations();
      onCloseDelete();
      showToast(`${locationName} Deleted Successfully`, "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleDeleteZone = async () => {
    try {
      console.log("Deleting Zone with ID:", selectedZoneId);
      const result = await deleteZone(selectedZoneId);
      console.log("Delete Result:", result);
      fetchZones(); // Refresh the locations list after deleting
      onCloseDeleteZone();
      showToast(`${zoneName} Deleted Successfully`, "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };
  const handleDeleteSubZone = async () => {
    try {
      console.log("Deleting SubZone with ID:", selectedSubZoneId);
      const result = await deleteSubZone(selectedSubZoneId);
      console.log("Delete Result:", result);
      fetchSubZones();
      onCloseDeleteSubZone();
      showToast(`${subZoneName} Deleted Successfully`, "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    const regex = /^[a-zA-Z ]*$/;
    if (regex.test(inputValue)) {
      setLocationName(inputValue);
    } else {
      showToast(
        "Only alphabetic characters and spaces are allowed.",
        "warning"
      );
    }
  };

  const handleInputChangeZone = (event) => {
    const inputValue = event.target.value;
    const regex = /^[a-zA-Z ]*$/;
    if (regex.test(inputValue)) {
      setZoneName(inputValue);
    } else {
      showToast(
        "Only alphabetic characters and spaces are allowed.",
        "warning"
      );
    }
  };

  const handleInputChangeSubZone = (event) => {
    const inputValue = event.target.value;
    const regex = /^[a-zA-Z ]*$/;
    if (regex.test(inputValue)) {
      setSubZoneName(inputValue);
    } else {
      showToast(
        "Only alphabetic characters and spaces are allowed.",
        "warning"
      );
    }
  };

  const handleEditClick = (locationId, currentLocationName) => {
    setSelectedLocationId(locationId);
    setOldLocation(currentLocationName);
    setLocationName(currentLocationName);
    onOpenEdit();
  };

  const handleEditClickZone = (zoneId, currentZoneName) => {
    console.log("currentZoneName", currentZoneName);
    setSelectedZoneId(zoneId);
    setOldZone(currentZoneName);
    setZoneName(currentZoneName);
    onOpenEditZone();
  };

  const handleEditClickSubZone = (subZoneId, currentSubZoneName) => {
    console.log("currentSubZoneName", currentSubZoneName);
    setSelectedSubZoneId(subZoneId);
    setOldSubZone(currentSubZoneName);
    setSubZoneName(currentSubZoneName);
    onOpenEditSubZone();
  };

  const handleDeleteClick = (locationId) => {
    setSelectedLocationId(locationId);
    onOpenDelete();
  };

  const handleDeleteClickZone = (zoneId) => {
    setSelectedZoneId(zoneId);
    onOpenDeleteZone();
  };

  const handleDeleteClickSubZone = (subZoneId) => {
    setSelectedZoneId(subZoneId);
    onOpenDeleteSubZone();
  };

  return (
    <>
      <Box>
        <Box>
          {isDesktop && <DesktopHeader />}
          {isMobile && <MobileHeader />}
        </Box>
        <Box marginTop="3%" marginLeft="13%" marginRight="10%">
          <Box>
            <Tabs
              variant="enclosed"
              onChange={(index) => {
                setActiveTab(index);
              }}
            >
              <TabList>
                <Tab _selected={{ color: "white", bg: "blue.500" }}>
                  Location
                </Tab>
                <Tab _selected={{ color: "white", bg: "blue.500" }}>Zones</Tab>
                <Tab _selected={{ color: "white", bg: "blue.500" }}>
                  SubZones
                </Tab>
                {activeTab == 0 && (
                  <Button
                    marginLeft="62%"
                    bgColor="blue.500"
                    color="white"
                    onClick={onOpenAdd}
                  >
                    Add Location
                  </Button>
                )}
                {activeTab == 1 && (
                  <Button
                    marginLeft="64%"
                    bgColor="blue.500"
                    color="white"
                    onClick={onOpenAddZone}
                  >
                    Add Zone
                  </Button>
                )}
                {activeTab == 2 && (
                  <Button
                    marginLeft="62%"
                    bgColor="blue.500"
                    color="white"
                    onClick={onOpenAddSubZone}
                  >
                    Add SubZone
                  </Button>
                )}
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Box maxHeight="65vh" overflowY="scroll">
                    <Table colorScheme="gray" bg="inherit">
                      <Thead bg="blue.100" color="white" boxShadow="md">
                        <Tr>
                          <Th>ID</Th>
                          <Th>Location</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {locations &&
                          locations.length > 0 &&
                          locations.map((location, index) => (
                            <Tr key={index}>
                              <Td>{index + 1}</Td>
                              <Td>{location.location}</Td>
                              <Td>
                                <Box display="flex">
                                  <Button
                                    bg={"blue.400"}
                                    marginRight="1vw"
                                    size="sm"
                                    color="white"
                                    onClick={() =>
                                      handleEditClick(
                                        location._id,
                                        location.location
                                      )
                                    }
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    bg="red.400"
                                    size="sm"
                                    color="white"
                                    onClick={() =>
                                      handleDeleteClick(location._id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </Box>
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box maxHeight="65vh" overflowY="scroll">
                    <Table colorScheme="gray" bg="inherit">
                      <Thead bg="blue.100" color="white" boxShadow="md">
                        <Tr>
                          <Th>ID</Th>
                          <Th>Zone</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {zones &&
                          zones.length > 0 &&
                          zones.map((zone, index) => (
                            <Tr key={index}>
                              <Td>{index + 1}</Td>
                              <Td>{zone.zone}</Td>
                              <Td>
                                <Box display="flex">
                                  <Button
                                    bg={"blue.400"}
                                    marginRight="1vw"
                                    size="sm"
                                    color="white"
                                    onClick={() =>
                                      handleEditClickZone(zone._id, zone.zone)
                                    }
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    bg="red.400"
                                    size="sm"
                                    color="white"
                                    onClick={() =>
                                      handleDeleteClickZone(zone._id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </Box>
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>
                <TabPanel>
                  <Box maxHeight="65vh" overflowY="scroll">
                    <Table colorScheme="gray" bg="inherit">
                      <Thead bg="blue.100" color="white" boxShadow="md">
                        <Tr>
                          <Th>ID</Th>
                          <Th>SubZone</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {subZones &&
                          subZones.length > 0 &&
                          subZones.map((subZone, index) => (
                            <Tr key={index}>
                              <Td>{index + 1}</Td>
                              <Td>{subZone.subZone}</Td>
                              <Td>
                                <Box display="flex">
                                  <Button
                                    bg={"blue.400"}
                                    marginRight="1vw"
                                    size="sm"
                                    color="white"
                                    onClick={() =>
                                      handleEditClickSubZone(
                                        subZone._id,
                                        subZone.subZone
                                      )
                                    }
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    bg="red.400"
                                    size="sm"
                                    color="white"
                                    onClick={() =>
                                      handleDeleteClickSubZone(subZone._id)
                                    }
                                  >
                                    Delete
                                  </Button>
                                </Box>
                              </Td>
                            </Tr>
                          ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
        <Modal isOpen={isOpenAdd} onClose={onCloseAdd}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Location</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Enter location name"
                value={locationName}
                onChange={handleInputChange}
                type="text"
                marginBottom="1%"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                bgColor="blue.500"
                color="white"
                onClick={handleAddLocation}
                marginRight="1%"
              >
                Add
              </Button>
              <Button variant="ghost" onClick={onCloseAdd}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Location</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Current location"
                value={oldLocation}
                isReadOnly
                marginBottom="1%"
              />
              <Input
                placeholder="Enter new location name"
                value={locationName}
                onChange={handleInputChange}
                type="text"
                marginBottom="1%"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                bgColor="blue.500"
                color="white"
                onClick={handleUpdateLocation}
                marginRight="1%"
              >
                Update
              </Button>
              <Button variant="ghost" onClick={onCloseEdit}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpenDelete} onClose={onCloseDelete}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Delete Location</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>Are you sure you want to delete this location?</p>
            </ModalBody>
            <ModalFooter>
              <Button
                bgColor="blue.500"
                color="white"
                onClick={handleDeleteLocation}
                marginRight="1%"
              >
                Delete
              </Button>
              <Button variant="ghost" onClick={onCloseDelete}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpenAddZone} onClose={onCloseAddZone}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add Zone</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Enter Zone name"
                value={zoneName}
                onChange={handleInputChangeZone}
                type="text"
                marginBottom="1%"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                bgColor="blue.500"
                color="white"
                onClick={handleAddZone}
                marginRight="1%"
              >
                Add
              </Button>
              <Button variant="ghost" onClick={onCloseAddZone}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpenEditZone} onClose={onCloseEditZone}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update Zone</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Current Zone"
                value={oldZone}
                isReadOnly
                marginBottom="1%"
              />
              <Input
                placeholder="Enter new Zone name"
                value={zoneName}
                type="text"
                onChange={handleInputChangeZone}
                marginBottom="1%"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                bgColor="blue.500"
                color="white"
                onClick={handleUpdateZone}
                marginRight="1%"
              >
                Update
              </Button>
              <Button variant="ghost" onClick={onCloseEditZone}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpenDeleteZone} onClose={onCloseDeleteZone}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Delete Zone</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>Are you sure you want to delete this Zone?</p>
            </ModalBody>
            <ModalFooter>
              <Button
                bgColor="blue.500"
                color="white"
                onClick={handleDeleteZone}
                marginRight="1%"
              >
                Delete
              </Button>
              <Button color="white" onClick={onCloseDeleteZone}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isOpenAddSubZone} onClose={onCloseAddSubZone}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add SubZone</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Enter SubZone name"
                value={subZoneName}
                onChange={handleInputChangeSubZone}
                marginBottom="1%"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                bgColor="blue.500"
                color="white"
                onClick={handleAddSubZone}
                marginRight="1%"
              >
                Add
              </Button>
              <Button color="white" onClick={onCloseAddSubZone}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpenEditSubZone} onClose={onCloseEditSubZone}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update SubZone</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Current SubZone"
                value={oldSubZone}
                isReadOnly
                marginBottom="1%"
              />
              <Input
                placeholder="Enter new SubZone name"
                value={subZoneName}
                onChange={handleInputChangeSubZone}
                marginBottom="1%"
              />
            </ModalBody>
            <ModalFooter>
              <Button
                bgColor="blue.500"
                color="white"
                onClick={handleUpdateSubZone}
                marginRight="1%"
              >
                Update
              </Button>
              <Button color="white" onClick={onCloseEditSubZone}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={isOpenDeleteSubZone} onClose={onCloseDeleteSubZone}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirm Delete SubZone</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>Are you sure you want to delete this SubZone?</p>
            </ModalBody>
            <ModalFooter>
              <Button
                bgColor="blue.500"
                color="white"
                onClick={handleDeleteSubZone}
                marginRight="1%"
              >
                Delete
              </Button>
              <Button color="white" onClick={onCloseDeleteSubZone}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
}
