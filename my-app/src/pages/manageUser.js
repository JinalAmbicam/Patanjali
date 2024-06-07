import { useState, useEffect } from "react";
import {
  Heading,
  useMediaQuery,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Select,
  Menu,
  MenuItem,
  MenuButton,
} from "@chakra-ui/react";
import React from "react";
import withAuth from "@/components/withAuth";
import DesktopHeader from "../components/DesktopHeader";
import MobileHeader from "@/components/MobileHeader";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { Box } from "@chakra-ui/react";
import { getAllUsers } from "./api/getallUsers";
import { getAllRoles } from "./api/getAllRoles";
import { updateUserRoleByMail } from "./api/updateUserRoleByMail ";
import { deleteUser } from "./api/deleteUser";
import Pagination from "@/components/Pagination";
import { getSearchedUser } from "./api/getSearchedUser";
import { deleteSharedCamera } from "./api/deleteSharedCamera";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { getSharecameraname } from "./api/getSharecameraname";

const manageUser = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDesktop] = useMediaQuery("(min-width: 1025px)");
  const [totalPages, setTotalPages] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const enterpriseId = localStorage.getItem("enterpriseId");
  const [page, setPage] = useState(1);
  const [roles, setRoles] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const userDetailsString = localStorage.getItem("userDetails");
  const userDetails = JSON.parse(userDetailsString);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [shareCameraList, setShareCameraList] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [selectedUser, setSelectedUser] = useState(null); // State to track the selected user for shared cameras
  const [showSharedCamerasModal, setShowSharedCamerasModal] = useState(false); // State to control the shared cameras modal

  const toast = useToast();

  const showToast = (msg, status1) => {
    toast({
      description: msg,
      position: "bottom-left",
      status: status1,
      duration: 3000,
      isClosable: true,
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    fetchRole();
    fetchData();
  }, [searchInput, selectedRole, page]);

  const fetchData = async () => {
    try {
      let res;
      if (selectedRole) {
        res = await getAllUsers(
          page,
          itemsPerPage,
          selectedRole,
          +enterpriseId
        );
      } else {
        res = await getAllUsers(page, itemsPerPage, "", +enterpriseId);
      }

      const userData = res.data;

      const updatedUsers = await Promise.all(
        userData.map(async (user) => {
          try {
            const result = await getSharecameraname(user.email);
            const sharedCameras = result.cameras.map((camera) => ({
              cameraname: camera.cameraname,
              cameraid: camera.cameraid,
            }));

            return { ...user, sharedCameras };
          } catch (error) {
            console.error(
              "Error fetching shared camera data for user:",
              user.email,
              error
            );
            return user;
          }
        })
      );

      setTotalPages(res.totalPages);
      setLoading(false);
      setOriginalUsers(userData);
      setUsers(updatedUsers);
    } catch (error) {
      console.error("Error fetching user list:", error);
      setLoading(false);
    }
  };

  const fetchRole = async () => {
    try {
      const result = await getAllRoles();
      setRoles(result.roles);
    } catch (error) {
      console.error("Error fetching Roles:", error);
    }
  };

  const setNextPage = () => {
    const nextPage = page + 1;
    setPage(nextPage);
  };

  const setPreviousPage = () => {
    const previousPage = Math.max(page - 1, 1);
    setPage(previousPage);
  };

  const handleRoleChange = async (event, index) => {
    const updatedUsers = [...users];
    updatedUsers[index].role = event.target.value;
    setUsers(updatedUsers);

    const selectedRole = roles.find((role) => role.role === event.target.value);
    try {
      await updateUserRoleByMail(updatedUsers[index].email, selectedRole._id);
      const userDetailsString = localStorage.getItem("userDetails");
      const userDetails = JSON.parse(userDetailsString);
      userDetails.role = selectedRole.role;
      fetchData();
      setEditingIndex(null);
      setTimeout(() => {
        showToast("Role Updated Successfully", "success");
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        showToast(error, "error");
      }, 1000);
    }
  };

  const handleDelete = async (index) => {
    const allUsers = [...users];
    const userIdToDelete = allUsers[index]._id;
    try {
      const response = await deleteUser(userIdToDelete);
      if (response.success) {
        allUsers.splice(index, 1);
        setUsers(allUsers);
        setTimeout(() => {
          showToast("User deleted Successfully", "success");
        }, 1000);
        await fetchData();
      } else {
        setTimeout(() => {
          showToast(response.message, "error");
        }, 1000);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const toggleEditRoleDropdown = (index) => {
    setEditingIndex(index === editingIndex ? null : index);
  };

  const handleRoleSelect = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
    setSearchInput("");
    setPage(1);
  };

  const handleEnterKeyPress = (e) => {
    if (e.key === "Enter") {
      setUsers(searchedUsers);
    }
  };

  const handleButton = async () => {
    try {
      const resp = await getSearchedUser(searchInput, +enterpriseId);
      setSearchedUsers(resp.data);
      setUsers(resp.data);
      setTotalPages(Math.ceil(resp.data.length / itemsPerPage));
    } catch (error) {
      console.error("Error searching user:", error);
    }
  };

  const handleSearch = async (e) => {
    setSearchInput(e.target.value);
  };

  const handleSharedDeleteCamera = (email, cameraId) => {
    setCameraToDelete({ email, cameraId });
    setShowDeleteConfirmation(true);
  };

  const handleDeleteSharedCamera = async (email, cameraId) => {
    try {
      const response = await deleteSharedCamera(email, cameraId);
      if (response.success) {
        showToast("Shared camera deleted successfully", "success");
        // Remove the deleted camera from the selected user's shared cameras list
        const updatedSharedCameras = selectedUser.sharedCameras.filter(
          (camera) => camera.cameraid !== cameraId
        );
        setSelectedUser((prevUser) => ({
          ...prevUser,
          sharedCameras: updatedSharedCameras,
        }));
        // If needed, you can also update the shared cameras list in the main users array
        await fetchData();
      } else {
        showToast("Failed to delete shared camera", "error");
      }
    } catch (error) {
      console.error("Error deleting shared camera:", error);
      showToast("Failed to delete shared camera", "error");
    }
  };

  return (
    <Box>
      {isDesktop && <DesktopHeader />}
      {isMobile && <MobileHeader />}
      <Box
        marginLeft={"15vw"}
        marginTop={"5vh"}
        marginRight={"12vw"}
        overflow="auto"
        display={"flex"}
        flexDirection="column"
      >
        <Box display="flex" marginBottom="2rem" justifyContent="space-between">
          <input
            flex={2}
            type="text"
            placeholder=" Search user"
            onChange={handleSearch}
            value={searchInput}
            style={{
              border: "2px solid gray",
              borderRadius: "5px",
              width: "30vw",
              height: "5vh",
              marginRight: "1%",
              paddingLeft: "1%",
            }}
          />
          <Button
            colorScheme="blue"
            size="md"
            onClick={handleButton}
            borderRadius="5px"
            width={"6vw"}
          >
            Search
          </Button>
          
          <Select
            flex={1}
            marginLeft="1rem"
            onChange={handleRoleSelect}
            value={selectedRole}
            style={{ marginLeft: "30vw", width: "10vw" }}
          >
            <option value="">All Roles</option>
            {roles &&
              roles.length > 0 &&
              roles
                .filter((roleObj) => roleObj.role !== "master")
                .map((roleObj) => (
                  <option key={roleObj._id} value={roleObj.role}>
                    {roleObj.role}
                  </option>
                ))}
          </Select>
        </Box>
        <Box flex="1" overflow="auto">
          <Modal
            isOpen={showDeleteConfirmation}
            onClose={() => setShowDeleteConfirmation(false)}
            isCentered
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Confirmation</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                Are you sure you want to delete this shared camera?
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  onClick={() => {
                    handleDeleteSharedCamera(
                      cameraToDelete.email,
                      cameraToDelete.cameraId
                    );
                    setShowDeleteConfirmation(false);
                  }}
                >
                  Yes
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteConfirmation(false)}
                >
                  No
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Table colorScheme="gray" bg="inherit">
            <Thead bg="blue.100" color="white" boxShadow="md">
              <Tr>
                <Th>Id</Th>
                <Th>Email</Th>
                <Th>Shared CameraList</Th>
                <Th>Role</Th>
                <Th colSpan={2}>Action</Th>
              </Tr>
            </Thead>

            <Tbody>
              {users.map((user, index) => (
                <Tr key={index + 1}>
                  <Td>{index + 1}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Button
                      onClick={() => {
                        setSelectedUser(user); // Set the selected user for shared cameras
                        setShowSharedCamerasModal(true); // Open the modal
                      }}
                    >
                      Show SharedCameras
                    </Button>
                  </Td>

                  <Td>
                    {editingIndex === index ? (
                      <Select
                        value={user.role}
                        onChange={(event) => handleRoleChange(event, index)}
                      >
                        {roles && roles.length > 0 ? (
                          roles
                            .filter(
                              (roleObj) =>
                                roleObj.role !== "cc" &&
                                roleObj.role !== "master"
                            )
                            .map((roleObj) => (
                              <option key={roleObj._id} value={roleObj.role}>
                                {roleObj.role}
                              </option>
                            ))
                        ) : (
                          <option value="">Loading roles...</option>
                        )}
                      </Select>
                    ) : (
                      user.role
                    )}
                  </Td>

                  <Td>
                    <Button
                      onClick={() => {
                        if (user.role !== "cc" && user.role !== "master") {
                          toggleEditRoleDropdown(index);
                        }
                      }}
                      disabled={user.role === "cc" || user.role === "master"}
                    >
                      <MdEdit
                        fontSize={"18px"}
                        color={
                          user.role === "cc" || user.role === "master"
                            ? "#999"
                            : "#1560bd"
                        }
                      />
                    </Button>
                    <Button
                      marginLeft={"3%"}
                      onClick={() => {
                        if (user.role !== "cc" && user.role !== "master") {
                          setDeletingIndex(index);
                          setShowModal(true);
                        }
                      }}
                      disabled={user.role === "cc" || user.role === "master"}
                    >
                      <MdDelete
                        fontSize={"18px"}
                        color={
                          user.role === "cc" || user.role === "master"
                            ? "#999"
                            : "#E62020"
                        }
                      />
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>

            <Tfoot>
              <Tr></Tr>
            </Tfoot>
          </Table>
          {totalPages > 1 && (
            <Box
              textAlign="center"
              position="fixed"
              width="100%"
              bottom="8vh"
            >
              <Pagination
                page={page}
                totalPages={totalPages}
                setNextPage={setNextPage}
                setPreviousPage={setPreviousPage}
                setPage={setPage}
              />
            </Box>
          )}
        </Box>
        {/* Modal to display shared cameras */}
        <Modal
          isOpen={showSharedCamerasModal}
          onClose={() => setShowSharedCamerasModal(false)}
        >
          <ModalOverlay />
          <ModalContent>
            {/* <ModalHeader fontSize={"16px"}>Shared Cameras of {selectedUser ? selectedUser.email : ""}</ModalHeader> */}
            <ModalHeader fontSize={"18px"}>Shared Cameras</ModalHeader>
            <ModalCloseButton />
            <ModalBody maxH="380px" overflowY="auto">
              <Table colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>Camera Name</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {selectedUser &&
                  selectedUser.sharedCameras &&
                  selectedUser.sharedCameras.length > 0 ? (
                    selectedUser.sharedCameras.map((camera, cameraIndex) => (
                      <Tr key={cameraIndex}>
                        <Td>{camera.cameraname}</Td>
                        <Td>
                          <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() =>
                              handleSharedDeleteCamera(
                                selectedUser.email,
                                camera.cameraid
                              )
                            }
                          >
                            Delete
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan="2">No cameras shared yet</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => setShowSharedCamerasModal(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Confirmation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>Are you sure you want to delete this user?</ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => {
                  handleDelete(deletingIndex);
                  setShowModal(false);
                }}
              >
                Yes
              </Button>

              <Button variant="ghost" onClick={() => setShowModal(false)}>
                No
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default withAuth(manageUser);
