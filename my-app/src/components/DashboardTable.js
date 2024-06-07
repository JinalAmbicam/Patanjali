import React from "react";
import {
  Box,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Button,
} from "@chakra-ui/react";
import { BsCameraVideo } from "react-icons/bs";
import { MdVideocam } from "react-icons/md";
import { GoDeviceCameraVideo } from "react-icons/go";

const DashboardTable = ({ cameraList, handleOpenModal }) => {
  return (
    <Box
      maxH="calc(100vh - 200px)"
      overflowY="auto"
      css={{
        "&::-webkit-scrollbar": {
          width: "0.2em",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
        },
        overflowX: "hidden", // Hide horizontal scrollbar
        scrollbarWidth: "thin", // For Firefox
        scrollbarColor: "#888 transparent", // For Firefox
        ":active": {
          overflowY: "scroll", // Show scrollbar while touched
        },
      }}
    >
      <TableContainer mt={5}>
        <Table variant="simple">
          {/* <TableCaption>Imperial to metric conversion factors</TableCaption> */}
          <Thead>
            <Tr>
              {/* <Th>To convert</Th>
            <Th>into</Th>
            <Th isNumeric>multiply by</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {cameraList.map((camera) => (
              <Tr style={{ display: "flex" }}>
                <Button
                  size="sm"
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
                  {/* <Td>
                    <span
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <MdVideocam
                        style={{
                          color: camera.islive ? "#00A36C" : "#FF3232",
                          fontSize: "18px",
                          marginRight: "5px",
                        }}
                      />
                      <span> {camera.cameraname}</span>
                    </span>
                  </Td> */}
                  <Td>
                    <span
                      style={{ display: "inline-flex", alignItems: "center" }}
                    >
                      <GoDeviceCameraVideo 
                        style={{
                          color: camera.islive ? "#00A36C" : "#FF3232",
                          fontSize: "16px",
                          marginRight: "15px",
                        }}
                      />
                      <span>  {camera.cameraname}</span>
                    </span>
                  </Td>

                  {/* <Td>
                    <BsCameraVideo />
                  </Td>
                  <Td p={0}>{camera.islive ? "🟢" : "🔴"}</Td>
                  <Td>{camera.deviceid} </Td>
                  <Td>{camera.cameraname}</Td> */}
                </Button>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DashboardTable;
