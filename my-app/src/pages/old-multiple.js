







import { useEffect, useState } from 'react';
import withAuth from '@/components/withAuth';
import DesktopHeader from '@component/DesktopHeader';
import MobileHeader from '@component/MobileHeader';
import { getCustomerCameraList } from './api/getcamera';
import LiveFeed from '@/components/LiveFeed';
import {
  Box,Badge,
  Text, SimpleGrid,
  GridItem,
  useColorModeValue,
  HStack,Spinner,Flex,
  Link
} from '@chakra-ui/react';
import OfflineMessage from '@/components/OfflineMessage'
import ReactPaginate from 'react-paginate';
import PullToRefresh from 'react-simple-pull-to-refresh';

const CameraFeedsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [cameraList, setCameraList] = useState([]);

    const fetchData = async () => {
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));

      const customerId = userDetails.customerid;
      const resultPerPage = 2000;
      const page= 1;
      try {
        const result = await getCustomerCameraList(customerId, page,resultPerPage); 
        setCameraList(result.cameras);
        console.log(result.cameras);
      } catch (error) {
        console.error('Error fetching camera list:', error);
      }
      finally {
        setIsLoading(false); // Set loading state to false when data fetching is complete
      }
    };


    useEffect(() => {
      fetchData(); // Call fetchData from useEffect
    }, [])
  
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleThumbnailGenerated = (thumbnailUrl, cameraId) => {
    const updatedCameraList = cameraList.map((camera) =>
      camera.cameraid === cameraId ? { ...camera, thumbnailUrl } : camera
    );
  
    setCameraList(updatedCameraList);
  };
  function simplifyString(inputString) {
    // Remove non-alphanumeric characters and convert to lowercase
    return inputString.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  }

  const onlineCameraList = cameraList.filter((camera) => camera.islive);

  const sortedCameraList = [...onlineCameraList].sort((a, b) => {
    if (a.islive && !b.islive) return -1;
    if (!a.islive && b.islive) return 1;
    return 0;
  });

  const gridColumnTemplate = {
    base: "1fr",       // 1 column on mobile
    sm: "repeat(2, 1fr)", // 2 columns on tablet (sm)
    md: "repeat(3, 1fr)", // 3 columns on laptops (md) and larger screens
    lg:"repeat(3,1fr)",
  };

  const [page, setPage] = useState(0); // Current page
  const itemsPerPage = 6;

  const pageCount = Math.ceil(sortedCameraList.length / itemsPerPage);

  const handlePageClick = (data) => {
    const selectedPage = data.selected;
    setPage(selectedPage);
  };

  const offset = page * itemsPerPage;
  const currentPageData = sortedCameraList.slice(offset, offset + itemsPerPage);
// console.log(currentPageData)

  const handleRefresh = () => {
    return new Promise((resolve, reject) => {
      fetchData();
      setTimeout(() => {
        // Simulate a successful refresh
        resolve("Refresh completed successfully");
      }, 200); // Simulating a 2-second refresh task
    });
  };
  
  // Function to get the modified live URL based on camera conditions
function getModifiedLiveUrl(camera) {
  let modifiedCameraUrl;
  let lastfilename;
  let cameraurl;

  if (camera.cameraurl.startsWith('media5')) {
    cameraurl = camera.cameraurl.replace('/live', '');
    modifiedCameraUrl = camera.cameraurl.replace(':1938', ':443');
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear().toString().slice(-2);
    const formattedDate = `${day}_${month}_${year}`;
    lastfilename = `${formattedDate}/${camera.streamname}.m3u8`;;
  } else if (camera.cameraurl.startsWith('media11')) {
      cameraurl = camera.cameraurl.replace('/live', '');
      modifiedCameraUrl = camera.cameraurl.replace(':1938', ':443');
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear().toString().slice(-2);
      const formattedDate = `${day}_${month}_${year}`;
      lastfilename = `${formattedDate}/${camera.streamname}.m3u8`;
  } 
  else if (camera.cameraurl.startsWith('media12')) {
    modifiedCameraUrl = camera.cameraurl.replace('media12.ambicam.com:1938', 'media6.ambicam.com:443');

    lastfilename = `index.m3u8`;
}  
  else {
      modifiedCameraUrl = camera.cameraurl.replace(':1938', ':443');
      // Change lastfilename to 'index.m3u8'
      lastfilename = `index.m3u8`;
  }
// console.log(`${modifiedCameraUrl}${camera.streamname}/${lastfilename}`)
  return `https://${modifiedCameraUrl}${camera.streamname}/${lastfilename}`;
}

  // const lastfilename = camera.cameraurl.startsWith('media5') ? `${camera.streamname}.m3u8` : 'index.m3u8';
  return (
 
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      
       {/* Mobile Header */}
       {isMobile && (<>
        <MobileHeader headerText="Multiple View" />
        </>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <DesktopHeader/>  )}

        
      <Box paddingTop={isMobile ? '5rem' : '0.8rem'}
      paddingX={3}  marginLeft={isMobile ? '0rem' : '5rem'} 
      overflowY="auto" // Enable vertical scrolling
      maxHeight="calc(100vh - 50px)" // Adjust the maximum height to prevent the whole page from scrolling
      >
         <PullToRefresh onRefresh={handleRefresh} >
       
      
        {isLoading ? (
          <Flex align="center" justify="center" height="100vh">
            <Spinner size="xl" thickness="4px" color="blue.500" emptyColor="gray.200" />
          </Flex>
        ) : (  

          <SimpleGrid templateColumns={gridColumnTemplate} gap={isMobile ? 4 : 6} paddingBottom={4}>
          {!isMobile ? currentPageData.map((camera) => (
            <GridItem key={camera.cameraid}>
              <div
              
                bg="white"
                borderRadius="md"
                p={1}
                mb={2}
                boxShadow="md"
                transition="box-shadow 0.3s"
                _hover={{ boxShadow: 'lg' }}
                width={isMobile ? '100%' : '280px'} // Adjust the width for mobile and desktop
                maxW={isMobile ? '100%' : '300px'} // Limit the maximum width of the card
                
              >
                <Box position="relative">
                {/* <Image src="https://via.placeholder.com/240x160" alt="Camera" borderRadius="md" mb={4} /> */}
                {camera.islive ? (  
                <LiveFeed 
                live={`${getModifiedLiveUrl(camera)}`}
                // live={`https://${camera.cameraurl.replace(':1938/', ':443/')}${camera.streamname}/${camera.cameraurl.startsWith('media5') ? `${camera.streamname}.m3u8` : 'index.m3u8'}`}
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onPause={handlePause}
                handleThumbnailGenerated={handleThumbnailGenerated}
                showTimeline={false}  width="280px"  height="160px"
                isOn={camera.islive}
                />
                ):(
                  <OfflineMessage style={{ height: '160px', visibility: 'hidden' }} /> 
                  )}
     {camera.islive ? (
                    <Badge
                      position="absolute" // Position the badge absolutely within the container
                      top={2} // Top position from the edge of the container
                      right={2} // Right position from the edge of the container
                      fontSize="sm"
                      colorScheme="green" // You can adjust the color scheme of the badge
                    >
                      On
                    </Badge>
                  ):(
                    <Badge
                    position="absolute" // Position the badge absolutely within the container
                    top={2} // Top position from the edge of the container
                    right={2} // Right position from the edge of the container
                    fontSize="sm"
                    colorScheme="red" // Set color to red when camera is off
                  >
                    Off
                  </Badge>
                  )
                  }
              
                </Box>
                {isMobile ? (<HStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" fontSize="small" width="240px" p={1}>
                  {camera.cameraname}
                </Text>
              </HStack>)
                
                :(
                <HStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="bold" fontSize="l" width="240px" p={1}>
                  {camera.cameraname}
                </Text>
              </HStack>
 )
}
              </div>
            </GridItem>
            )) : 
            sortedCameraList.map((camera) => (
              <GridItem key={camera.cameraid}>
                <div
                
                  bg="white"
                  borderRadius="md"
                  p={1}
                  mb={2}
                  boxShadow="md"
                  transition="box-shadow 0.3s"
                  _hover={{ boxShadow: 'lg' }}
                  width={isMobile ? '100%' : '280px'} // Adjust the width for mobile and desktop
                  maxW={isMobile ? '100%' : '300px'} // Limit the maximum width of the card
                  
                >
                  <Box position="relative">
                  {/* <Image src="https://via.placeholder.com/240x160" alt="Camera" borderRadius="md" mb={4} /> */}
                  {camera.islive ? (  
                  <LiveFeed 
                  live={`${getModifiedLiveUrl(camera)}`}
                  // live={`https://${camera.cameraurl.replace(':1938/', ':443/')}${camera.streamname}/${camera.cameraurl.startsWith('media5') ? `${camera.streamname}.m3u8` : 'index.m3u8'}`}
                  isPlaying={isPlaying}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  handleThumbnailGenerated={handleThumbnailGenerated}
                  showTimeline={false}  width="280px"  height="160px"
                  isOn={camera.islive}
                  />
                  ):(
                    <OfflineMessage style={{ height: '160px', visibility: 'hidden' }} /> 
                    )}
       {camera.islive ? (
                      <Badge
                        position="absolute" // Position the badge absolutely within the container
                        top={2} // Top position from the edge of the container
                        right={2} // Right position from the edge of the container
                        fontSize="sm"
                        colorScheme="green" // You can adjust the color scheme of the badge
                      >
                        On
                      </Badge>
                    ):(
                      <Badge
                      position="absolute" // Position the badge absolutely within the container
                      top={2} // Top position from the edge of the container
                      right={2} // Right position from the edge of the container
                      fontSize="sm"
                      colorScheme="red" // Set color to red when camera is off
                    >
                      Off
                    </Badge>
                    )
                    }
                
                  </Box>
                  {isMobile ? (<HStack justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold" fontSize="small" width="240px" p={1}>
                    {camera.cameraname}
                  </Text>
                </HStack>)
                  
                  :(
                  <HStack justifyContent="space-between" alignItems="center">
                  <Text fontWeight="bold" fontSize="l" width="240px" p={1}>
                    {camera.cameraname}
                  </Text>
                </HStack>
   )
  }
                </div>
              </GridItem>

            ))
          
          }
        
          </SimpleGrid>
          )}
          </PullToRefresh>
    </Box>
    {!isMobile && (
        <div className="pagination-container"> {/* Add a CSS class for styling */}
          <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </div>
      )}
    </Box>
    
  );
};

export default withAuth(CameraFeedsPage);
