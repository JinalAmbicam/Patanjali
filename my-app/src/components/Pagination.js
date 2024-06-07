// // Pagination.js
// import React from 'react';

// const Pagination = ({ page, totalPages, Previous, Next }) => (
//     <ul className="pagination">
//     <li>
//       <button
//       className={`pagination-button${page === 1 ? ' disabled' : ''}`}
//         // className="pagination-button"
//         onClick={Previous}
//         disabled={page === 1} // Disable the "Prev" button when on the first page
//         >
//         <a>
//         Prev
//       </a>
//       </button>
//     </li>
//         <li className="pagination-text">
//           {page} of {totalPages}
//         </li>
//     <li>
//       <button
//         className={`pagination-button${page === totalPages ? ' disabled' : ''}`}
//         onClick={Next}
//         disabled={page === totalPages} // Disable the "Next" button when on the last page
//         >
//         <a>
//         Next
//         </a>
//       </button>
//     </li>
// </ul>
// );

// export default Pagination;

import React from "react";
import { Box, Button, Flex, useBreakpointValue } from "@chakra-ui/react";

const Pagination = ({
  page,
  totalPages,
  setNextPage,
  setPreviousPage,
  setPage,
}) => {
  // Determine the screen size using useBreakpointValue
  const isLaptop = useBreakpointValue({ base: false, md: true });

  // Define the button size based on the device type
  const buttonSize = isLaptop ? "md" : "xs";

  return (
    <Flex
      justifyContent="center"
      position="fixed"
      // bottom="3vh" 
      // top="90vh"
      left="50%"
      transform="translateX(-50%)"
    >
      <Button
        onClick={setPreviousPage}
        disabled={page === 1}
        marginRight={2}
        borderColor={page === 1 ? "blue.200" : "#3c90df"}
        borderWidth={2}
        color={page === 1 ? "blue.200" : "#3c90df"}
        _hover={page === 1 ? { bg: "gray.200" } : { bg: "gray.300" }}
        size={buttonSize} // Set the button size
      >
        Prev
      </Button>

      {/* Render buttons with reduced size if the device is not a laptop */}
      {page === 1 && (
        <>
          <Button
            borderColor={"#3c90df"}
            borderWidth={2}
            color={"white"}
            bg={"#3c90df"}
            marginRight={2}
            size={buttonSize} // Set the button size
          >
            {page}
          </Button>
          {page > 1 && page < totalPages - 1 && (
            <Box as="span" marginTop={1} marginRight={2}>
              ...
            </Box>
          )}

          <Button
            onClick={() => setPage(totalPages)}
            borderColor={"#3c90df"}
            borderWidth={2}
            color={"#3c90df"}
            marginRight={2}
            size={buttonSize} // Set the button size
          >
            {totalPages}
          </Button>
        </>
      )}

      {/* Render buttons with reduced size if the device is not a laptop */}
      {page > 1 && page < totalPages && (
        <>
          {page > 5 && (
            <Button
              onClick={() =>
                setPage(Math.max(page - 5, Math.ceil(page / 5 - 1) * 5))
              }
              borderColor={page === 1 ? "#3c90df" : "#3c90df"}
              borderWidth={2}
              color={page === 1 ? "#3c90df" : "#3c90df"}
              marginRight={2}
              size={buttonSize} // Set the button size
            >
              {Math.max(page - 5, Math.ceil(page / 5 - 1) * 5)}
            </Button>
          )}
          <Button
            borderColor={"#3c90df"}
            borderWidth={2}
            bg={"#3c90df"}
            color={"white"}
            marginRight={2}
            size={buttonSize} // Set the button size
          >
            {page}
          </Button>
          <Box as="span" marginTop={1} marginRight={2}>
            ...
          </Box>
          {page < totalPages - 1 && (
            <Button
              onClick={() => setPage(totalPages)}
              borderColor={"#3c90df"}
              borderWidth={2}
              color={"#3c90df"}
              marginRight={2}
              size={buttonSize} // Set the button size
            >
              {totalPages}
            </Button>
          )}
        </>
      )}

      {/* Render buttons with reduced size if the device is not a laptop */}
      {page === totalPages && (
        <>
          <Button
            onClick={() => setPage(page - 1)}
            borderColor={"#3c90df"}
            borderWidth={2}
            color={"#3c90df"}
            marginRight={2}
            size={buttonSize} // Set the button size
          >
            {page - 1}
          </Button>
          <Button
            borderColor={"#3c90df"}
            borderWidth={2}
            color={"white"}
            bg={"#3c90df"}
            marginRight={2}
            size={buttonSize} // Set the button size
          >
            {page}
          </Button>
        </>
      )}

      <Button
        onClick={page !== totalPages ? setNextPage : null}
        disabled={page === totalPages}
        borderColor={page === totalPages ? "blue.200" : "#3c90df"}
        borderWidth={2}
        color={page === totalPages ? "blue.200" : "#3c90df"}
        _hover={page === totalPages ? { bg: "gray.200" } : { bg: "gray.300" }}
        size={buttonSize} // Set the button size
      >
        Next
      </Button>
    </Flex>
  );
};

export default Pagination;
