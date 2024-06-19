import React, { useEffect, useState, useRef, useCallback } from "react";
import { getCustomerCameraList } from "./api/getcamera";
import { getShareCameraList } from "./api/getsharecamera";
import { ShareCamera, deleteShareCamera } from "./api/sharethiscamera";
import { useRouter } from "next/router";
import LiveFeed from "@/components/LiveFeed-Hls";
import withAuth from "@/components/withAuth";
import { useMediaQuery } from "@chakra-ui/react";
import { BiCamera } from "react-icons/bi";
import { IoIosPlayCircle } from "react-icons/io";
import { FaUsers } from "react-icons/fa";
import { FaPlay } from "react-icons/fa";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { ChevronLeftIcon } from "@chakra-ui/icons";

import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  Spacer,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Grid,
  GridItem,
  Image,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody,
  AlertDialogCloseButton,
  HStack,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  Icon,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Spinner,
} from "@chakra-ui/react";
import {
  FiMenu,
  FiSettings,
  FiBell,
  FiX,
  FiTrash2,
  FiMoreVertical,
  FiEdit,
  FiRefreshCcw,
  FiShare,
  FiShare2,
} from "react-icons/fi";
import { RiPlayList2Line } from "react-icons/ri";
import { FaSimCard } from "react-icons/fa6";
import { MdOutlineQrCodeScanner, MdOutlineAddAPhoto } from "react-icons/md";
import { BiX } from "react-icons/bi";
import { FiInfo, FiDownload } from "react-icons/fi";
import { BsCameraVideo } from "react-icons/bs";
import DashboardTable from "@/components/DashboardTable";
import CameraSettings from "@/components/CameraSettings";
import { SettingsIcon } from "@chakra-ui/icons";
import "react-calendar/dist/Calendar.css";
import { addCamera } from "./api/addcamera";
import { deleteCamera } from "./api/deletecamera";
import { DateTime } from "luxon";
import OfflineMessage from "@/components/OfflineMessage";
import { FaVideoSlash, FaSortAmountDownAlt } from "react-icons/fa";
import { Browser } from "@capacitor/browser";
import QRCodeScanner from "@/components/QRCodeScanner";
import { set } from "date-fns";
import Pagination from "@/components/Pagination";
import PullToRefresh from "react-simple-pull-to-refresh";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const timeZoneId = "Asia/Kolkata";

const CameraList = () => {
  const router = useRouter();
  const [cameraList, setCameraList] = useState([]);
  const [shareCameraList, setShareCameraList] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [islive, setisLive] = useState("");
  const [streamid, setStreamid] = useState("");
  const [cameraId, setCameraid] = useState("");
  const [cameraname, setCameraname] = useState("");
  const [planname, setPlanname] = useState(false);
  const [cameraurl, setCameraurl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [startDateTime, setStartDateTime] = useState(""); // Format: YYYY-MM-DDTHH:MM
  const [endDateTime, setEndDateTime] = useState(""); // Format: YYYY-MM-DDTHH:MM
  const [isDownloading, setIsDownloading] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [cameraToDelete, setCameraToDelete] = useState(null);
  const [videoLoadError, setVideoLoadError] = useState(false);
  const [plantext, setPlantext] = useState("");
  const [deviceId, setDeviceId] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState();
  const [totalitem, setTotalitem] = useState(0);
  const [isload, setIsload] = useState(false);
  const [receiveremail, setIsReceiverEmail] = useState("");
  const [isAddCameraModalOpen, setIsAddCameraModalOpen] = useState(false);
  const [isShareCameraModalOpen, setIsShareCameraModalOpen] = useState(false);
  const [newCameraName, setNewCameraName] = useState("");
  const [newCameraId, setNewCameraId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isTabOpen, setTabOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("myCameras");
  const [tabListOpen, setTabListOpen] = useState(false);
  const [isCC, setIsCC] = useState(false);
  const [isLocal, setIsLocal] = useState(false);
  const [isRegion, setIsRegion] = useState(false);
  const [isZonal, setIsZonal] = useState(false);
  const [ispanIn, setIspanIn] = useState(false);
  const [isNoRole, setIsNoRole] = useState(false);
  const [isSuper, setIsSuper] = useState(false);
  const userDetailsString = localStorage.getItem("userDetails");
  const userDetails = JSON.parse(userDetailsString);
  const Loggeduserrole = userDetails.role;
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

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

  const Next = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const Previous = () => {
    if (page > 1) {
      setIsLoading(true);
      setPage(page - 1);
    }
  };

  const fetchData = async (page) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const customerId = userDetails.customerid;
    console.log(userDetails);
    let resultPerPage = 9;
    if (window.innerWidth > 1645) {
      resultPerPage = 12; // Set to 12 if the screen width is greater than 1645px
    }
    if (page > 1) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    try {
      const result = await getCustomerCameraList(
        Loggeduserrole === "panIn" || Loggeduserrole === "super"
          ? "d7d3c5ed-716f-4c44-9188-427ec6ffc6ac"
          : customerId,
        page,
        resultPerPage
      );
      if (page > 1) {
        setCameraList((prevCameraList) => [
          ...prevCameraList,
          ...result.cameras,
        ]);
      } else {
        setCameraList(result.cameras);
      }
      setTotalitem(result.totalItems);
      setTotalPages(result.totalPages);
      console.log("cameralist", result.cameras);
      setIsLoading(false);
      setIsload(false); ////for scroll down event
    } catch (error) {
      console.error("Error fetching camera list:", error);
      setIsLoading(false);
    }
  };

  const fetchShareData = async (page) => {
    console.log("Fetching share data");

    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const email = userDetails.email;
    let resultPerPage = 9;
    if (window.innerWidth > 1645) {
      resultPerPage = 12; // Set to 12 if the screen width is greater than 1645px
    }
    if (page > 1) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    try {
      const result = await getShareCameraList(resultPerPage, page, email);
      if (page > 1) {
        setShareCameraList((prevCameraList) => [
          ...prevCameraList,
          ...result.cameras,
        ]);
      } else {
        setShareCameraList(result.cameras);
      }
      setTotalitem(result.totalItems);
      setTotalPages(result.totalPages);
      setIsLoading(false);
      setIsload(false); ////for scroll down event
      console.log("Resulttt", result);
    } catch (error) {
      console.error("Error fetching Shared camera list:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("LoggedUser:  ", Loggeduserrole);
    if (Loggeduserrole == "panIn") {
      setIspanIn(true);
    } else if (Loggeduserrole == "zonal") {
      setIsZonal(true);
    } else if (Loggeduserrole == "regional") {
      setIsRegion(true);
    } else if (Loggeduserrole == "local") {
      setIsLocal(true);
    } else if (Loggeduserrole == "cc") {
      setIsCC(true);
    } else if (Loggeduserrole == "super") {
      setIsSuper(true);
    } else if (Loggeduserrole == "No Role") {
      setIsNoRole(true);
    }

    fetchData(page);
    fetchShareData(page);
  }, [page, isLocal, isRegion, isZonal, , isNoRole, isSuper]);

  // Your scrolling function
  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;

    if (scrollTop + clientHeight >= scrollHeight - 1) {
      setIsload(true);

      if (cameraList.length < totalitem) {
        Next();
      } else {
        setIsload(false);
      }
    }
  };

  const handleRefresh = () => {
    return new Promise((resolve, reject) => {
      window.location.reload();
      setTimeout(() => {
        // Simulate a successful refresh
        resolve("Refresh completed successfully");
      }, 200); // Simulating a 2-second refresh task
    });
  };
  const [sharecameraname, setShareCameraName] = useState("");
  const [sharecameraid, setShareCameraId] = useState("");

  const handleShareCameraModel = (cameraname, cameraid) => {
    setIsShareCameraModalOpen(true);
    setShareCameraName(cameraname);
    setShareCameraId(cameraid);
  };

  const ShareThisCamera = async () => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const useremail = userDetails.email;

    const customerid = userDetails.customerid;

    try {
      const result = await ShareCamera(
        useremail,
        sharecameraname,
        sharecameraid,
        customerid,
        receiveremail
      );
      setSuccessMessage(result.message);
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (error) {
      setErrorMessage(error.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      console.error("Error Sharing Camera :", error);
      setIsLoading(false);
    }
  };

  const RemoveSharedCamera = async (cameraid) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const email = userDetails.email;

    try {
      const result = await deleteShareCamera(cameraid, email);
      alert(result.message);
    } catch (error) {
      alert(error.message);
      console.error("Error Remove Sharing Camera :", error);
      setIsLoading(false);
    }
  };

  const handleVideoLoadError = (error) => {
    setVideoLoadError(true);
    setVideoLoadError(error);
  };

  const showTimeline = !videoLoadError;
  const showDownload = !videoLoadError;

  const handleDeleteCamera = (cameraId, deviceId) => {
    setCameraToDelete(cameraId, deviceId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteCamera = async () => {
    try {
      // Replace these values with actual data
      const cameraList = await deleteCamera(cameraToDelete);

      // Handle the cameraList response data
      console.log("Camera Delete:", cameraList);

      if (cameraList === "Camera Deleted Successfully") {
        setSuccessMessage("Camera is Deleted Successfully");
        setSuccessMessage("");
        setIsDeleteDialogOpen(false);
      } else {
        setErrorMessage("An error occurred while Deleting the camera");
      }
      fetchData();
    } catch (error) {
      console.error("Error deleting camera:", error);
    }
  };

  const handleCameraSettingsClick = (plantext, deviceId) => {
    setPlantext(plantext);
    setDeviceId(deviceId);
    onOpen();
  };
  const [modifiedCameraUrl, setModifiedCameraUrl] = useState("");
  const [lastfilename, setLastfilename] = useState("");

  const handleOpenModal = (
    streamname,
    createdDate,
    plandays,
    cameraId,
    cameraname,
    planname,
    islive,
    cameraurl,
    deviceId
  ) => {
    function simplifyString(inputString) {
      // Remove non-alphanumeric characters and convert to lowercase
      return inputString.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    }

    const newpname = simplifyString(planname);

    // const modifiedCameraUrl = cameraurl.replace(':1938', ':443');

    let modifiedCameraUrl = cameraurl;
    let lastfilename = "index.m3u8";

    // Check if the first segment is 'media5'
    if (cameraurl.startsWith("media5")) {
      modifiedCameraUrl = cameraurl.replace(":1938", ":443");
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is zero-indexed
      const year = currentDate.getFullYear().toString().slice(-2);
      const formattedDate = `${day}_${month}_${year}`;
      lastfilename = `${formattedDate}/${streamname}.m3u8`;
    } else if (cameraurl.startsWith("media11.ambicam.com")) {
      modifiedCameraUrl = cameraurl.replace(":1938", ":443");
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is zero-indexed
      const year = currentDate.getFullYear().toString().slice(-2);
      const formattedDate = `${day}_${month}_${year}`;
      lastfilename = `${formattedDate}/${streamname}.m3u8`;
    } else if (cameraurl.startsWith("media1.ambicam.com")) {
      modifiedCameraUrl = cameraurl.replace(":1938", ":443");
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is zero-indexed
      const year = currentDate.getFullYear().toString().slice(-2);
      const formattedDate = `${day}_${month}_${year}`;
      lastfilename = `${formattedDate}/${streamname}_live.m3u8`;
    } else if (cameraurl.startsWith("media12.ambicam.com")) {
      modifiedCameraUrl = cameraurl.replace(
        "media12.ambicam.com:1938",
        "media1.ambicam.com:443"
      );
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is zero-indexed
      const year = currentDate.getFullYear().toString().slice(-2);
      const formattedDate = `${day}_${month}_${year}`;
      lastfilename = `${formattedDate}/${streamname}_live.m3u8`;
    } else if (cameraurl.startsWith("media6.ambicam.com")) {
      modifiedCameraUrl = cameraurl.replace(
        "media6.ambicam.com:1938",
        "media1.ambicam.com:443"
      );
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Note: Month is zero-indexed
      const year = currentDate.getFullYear().toString().slice(-2);
      const formattedDate = `${day}_${month}_${year}`;
      lastfilename = `${formattedDate}/${streamname}_live.m3u8`;
    } else {
      modifiedCameraUrl = cameraurl.replace(":1938", ":443");
      // Change lastfilename to 'cameraid.m3u8'
      lastfilename = `index.m3u8`;
    }
    setModifiedCameraUrl(modifiedCameraUrl);
    setLastfilename(lastfilename);

    setCameraurl(cameraurl);
    setPlanname(newpname);
    setPlantext(planname);
    setisLive(islive);
    setVideoUrl(`https://${modifiedCameraUrl}${streamname}/${lastfilename}`);
    console.log(
      "videoUrl:  ",
      `https://${modifiedCameraUrl}${streamname}/${lastfilename}`
    );
    // alert(videoUrl)
    fetchRecordingDates(createdDate, plandays);
    setIsModalOpen(true);
    setStreamid(streamname);
    setCameraid(cameraId);
    setCameraname(cameraname);
    setDeviceId(deviceId);
    // console.log(cameraId)
  };

  const jumptoLive = () => {
    // Assuming you have the live URL for your video.
    const liveUrl = `https://${modifiedCameraUrl}${streamid}/${lastfilename}`;

    // Set the videoUrl to the live URL to start playing the live video.
    setVideoUrl(liveUrl);

    // Set selectedDate to true if needed.
    setSelectedDate(false);
  };

  const liveFeedRef = useRef();

  const handleCloseModal = () => {
    setSelectedDate(null);
    setIsModalOpen(false);
    setStartDateTime("");
    setEndDateTime("");
    setVideoLoadError(false);
    // Call the destroyVideoPlayer function in the LiveFeed component
    if (liveFeedRef.current) {
      liveFeedRef.current.destroyVideoPlayer();
    }
  };

  const [selectedDate, setSelectedDate] = useState(null);

  const handleSelectDate = (date) => {
    setVideoLoadError(false);
    let modifiedCameraUrl = cameraurl;
    if (cameraurl.startsWith("media1.ambicam.com")) {
      modifiedCameraUrl = cameraurl.replace(
        "media1.ambicam.com:1938",
        "media1.ambicam.com:443"
      );
    } else if (cameraurl.startsWith("media12.ambicam.com")) {
      modifiedCameraUrl = cameraurl.replace(
        "media12.ambicam.com:1938",
        "media1.ambicam.com:443"
      );
    } else if (cameraurl.startsWith("media6.ambicam.com")) {
      modifiedCameraUrl = cameraurl.replace(
        "media6.ambicam.com:1938",
        "media1.ambicam.com:443"
      );
    } else {
      modifiedCameraUrl = cameraurl.replace(":1938", ":443");
    }
    // const modifiedCameraUrl = cameraurl.replace('media12.ambicam.com:1938', 'media6.ambicam.com:443');
    // const modifiedCameraUrl = cameraurl.replace(':1938', ':443');
    setSelectedDate(date);
    // Construct the video URL based on modifiedCameraUrl and date
    let archiveurl;
    if (cameraurl.startsWith("media1.ambicam.com")) {
      // For media1.ambicam.com
      const formattedDate = date
        .split("-")
        .map((part, index) => (index === 2 ? part.slice(-2) : part))
        .join("_");
      archiveurl = `https://${modifiedCameraUrl}${streamid}/${formattedDate}/${streamid}.m3u8`;
    } else {
      const formattedDate = date
        .split("-")
        .map((part, index) => (index === 2 ? part.slice(-2) : part))
        .join("_");
      archiveurl = `https://${modifiedCameraUrl}${streamid}/${formattedDate}/${streamid}.m3u8`;
    }

    setVideoUrl(archiveurl);
    setStartDateTime("");
    setEndDateTime("");
  };

  const [recordingDates, setRecordingDates] = useState([]);

  // Function to fetch recording dates from the backend
  const fetchRecordingDates = async (createdDate, plandays) => {
    const recdate = getRecordingDates(createdDate, plandays, timeZoneId);

    function extractTimestamp(dateStr) {
      return parseInt(dateStr.match(/\d+/)[0]);
    }

    function getRecordingDates(createdDate, plandays, timeZoneId) {
      const recdate = [];
      const newCreatedDate = DateTime.fromMillis(
        extractTimestamp(createdDate),
        { zone: timeZoneId }
      );
      const todayDate = DateTime.now().setZone(timeZoneId);

      for (let i = 0; i < plandays; i++) {
        const currentDate = todayDate.minus({ days: plandays - i - 1 });
        if (newCreatedDate.toISODate() <= currentDate.toISODate()) {
          const formattedDate = currentDate.toFormat("dd-MM-yyyy");
          recdate.push(formattedDate);
        }
      }

      const formattedToday = todayDate.toFormat("dd-MM-yyyy");
      recdate.reverse();
      setRecordingDates(recdate);
      return recdate;
    }
  };
  const [sortByLive, setSortByLive] = useState(false);

  const sortedCameraList = [...cameraList].sort((a, b) => {
    if (sortByLive) {
      if (a.islive && !b.islive) return -1;
      if (!a.islive && b.islive) return 1;
    } else {
      //This Will Load Without Filter
    }
    return 0;
  });

  const handleThumbnailGenerated = (thumbnailUrl, cameraId) => {
    const updatedCameraList = cameraList.map((camera) =>
      camera.cameraid === cameraId ? { ...camera, thumbnailUrl } : camera
    );

    setCameraList(updatedCameraList);
  };

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleAddCamera = async () => {
    try {
      // Replace these values with actual data
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      const email = userDetails.email;
      const customerId = userDetails.customerid;
      const cameraname = newCameraName;
      const deviceid = newCameraId;
      const cameraList = await addCamera(
        deviceid,
        cameraname,
        customerId,
        email
      );

      // Handle the cameraList response data
      console.log("Newly Added Camera:", cameraList);
      if (cameraList.success) {
        setSuccessMessage("Camera added successfully");
        setIsAddCameraModalOpen(false);
        setSuccessMessage("");
        setTimeout(() => {
          showToast("Camera Added Successfully", "success");
        }, 1000);
      } else {
        //setErrorMessage('An error occurred while Adding the camera');
        setTimeout(() => {
          showToast("An error occurred while Adding the camera", "error");
        }, 1000);
      }
      fetchData();
    } catch (error) {
      if (error.response) {
        if (error.response.status == 400) {
          setErrorMessage("This Camera is already added in another account");
        } else {
          setErrorMessage("An error occurred:Camera Not Found");
        }
      }
    }
  };

  const handleScanSuccess = (data) => {
    setNewCameraId(data); // Update newCameraId state
    setIsScanning(false); // Set isScanning to false
  };

  const [deviceWidth, setDeviceWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setDeviceWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [isDesktop] = useMediaQuery("(min-width: 1600px)");

  // Define the modal size based on the screen size
  const modalSize = isDesktop
    ? ["full", "full", "full", "5xl"]
    : ["full", "full", "full", "3xl"];

  // console.log(selectedDate)
  const [imageHeight, setImageHeight] = useState("");
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;

      if (windowWidth <= 480 && windowWidth >= 420) {
        setImageHeight("");
      } else if (windowWidth < 420 && windowWidth >= 350) {
        setImageHeight("");
      } else if (windowWidth < 350) {
        setImageHeight("180px");
      } else {
        setImageHeight(""); // Reset to default height when none of the conditions match
      }
    };

    // Call handleResize initially and add a listener for window resize events
    handleResize();
    window.addEventListener("resize", handleResize);

    // Clean up the listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function parseDate(dateString) {
    const parts = dateString.split("-");
    const year = parseInt(parts[2]);
    const month = parseInt(parts[1]) - 1;
    const day = parseInt(parts[0]);
    return new Date(year, month, day);
  }

  function parseTime(timeString) {
    const parts = timeString.split(":");
    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);
    return (hours * 60 + minutes) * 60;
  }

  // const handleDownload = async () => {
  //   setIsDownloading(true);
  //   const downloadCameraUrl = cameraurl.replace(':1938', ':3000');
  //   console.log(downloadCameraUrl)
  //   const now = new Date();
  //   const selectedDateObject = selectedDate ? parseDate(selectedDate) : now;
  //   const startTimestamp = Math.floor(selectedDateObject.getTime() / 1000) + parseTime(startDateTime);
  //   const endTimestamp = Math.floor(selectedDateObject.getTime() / 1000) + parseTime(endDateTime);

  //   try {

  //     // const isMob = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  //     if (Capacitor.isNative) {
  //       // If on a mobile device, open a new browser tab
  //       await Browser.open({
  //         url: `https://octopus-app-gl75w.ondigitalocean.app/feed/converted?cameraurl=${downloadCameraUrl}&streamid=${streamid}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`,
  //         windowName: '_blank',
  //       });
  //       // window.open(
  //       //   `http://t1.arcischain.io:4000/feed/converted?cameraurl=${downloadCameraUrl}&streamid=${streamid}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`,
  //       //   '_blank'
  //       // );
  //     } else {
  //     const response = await fetch('core/feed/download', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         cameraurl: downloadCameraUrl,
  //         streamid,
  //         startTimestamp,
  //         endTimestamp,
  //       }),
  //     });

  //     if (response.ok) {
  //       // Download successful
  //       const blob = await response.blob();
  //       const downloadLink = URL.createObjectURL(blob);
  //       const link = document.createElement('a');
  //       link.href = downloadLink;
  //       link.setAttribute('download', `${cameraname}[${selectedDate}(${startDateTime.replace(/_/g,':')}to${endDateTime.replace(/_/g,':')})].mp4`);
  //       document.body.appendChild(link);
  //       link.click();
  //       link.parentNode.removeChild(link);
  //       URL.revokeObjectURL(downloadLink);
  //     } else {
  //       console.error('Download Error:', response.statusText);
  //       setErrorMessage('Invalid Request. Please try again later.');
  //     }
  //   }
  //   } catch (error) {
  //     console.error('Download Error:', error);
  //     setErrorMessage('Invalid Request. Please try again later.');
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

  const handleDownload = async () => {
    setIsDownloading(true);
    const plan = cameraurl.split("/")[1];

    const now = new Date();
    const selectedDateObject = selectedDate ? parseDate(selectedDate) : now;
    const startTimestamp =
      Math.floor(selectedDateObject.getTime() / 1000) +
      parseTime(startDateTime);
    const endTimestamp =
      Math.floor(selectedDateObject.getTime() / 1000) + parseTime(endDateTime);

    const day = String(selectedDateObject.getDate()).padStart(2, "0"); // Get the day and pad with leading zero if necessary
    const month = String(selectedDateObject.getMonth() + 1).padStart(2, "0"); // Get the month (zero-based) and pad with leading zero if necessary
    const year = String(selectedDateObject.getFullYear()).slice(-2); // Get the last two digits of the year

    const formattedDate = `${day}_${month}_${year}`;
    console.log(plan, streamid, formattedDate, startTimestamp, endTimestamp);

    try {
      if (Capacitor.isNative) {
        // If on a mobile device, open a new browser tab
        await Browser.open({
          url: `https://media12.ambicam.com:4040/startConversionAndDownloadForMobile?Plan=${plan}&Stream=${streamid}&date=${formattedDate}&START_TIME=${startTimestamp}&END_TIME=${endTimestamp}`,
          windowName: "_blank",
        });
        // window.open(
        //   `http://t1.arcischain.io:4000/feed/converted?cameraurl=${downloadCameraUrl}&streamid=${streamid}&startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}`,
        //   '_blank'
        // );
      } else {
        const response = await axios.post(
          "https://media12.ambicam.com:4040/startConversionAndDownload",
          {
            Plan: plan,
            Stream: streamid,
            date: formattedDate,
            START_TIME: startTimestamp,
            END_TIME: endTimestamp,
          },
          {
            responseType: "blob", // Set responseType to 'blob' to receive binary data
          }
        );
        const blob = new Blob([response.data], { type: "video/mp4" });

        // Create a temporary URL for the blob object
        const url = window.URL.createObjectURL(blob);

        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.download = "downloaded_file.mp4"; // Set the desired filename
        document.body.appendChild(link);

        // Trigger the download by clicking the link
        link.click();

        // Remove the link from the DOM
        document.body.removeChild(link);
      }
      // console.log(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleportal = () => {
    // Replace the URL with the desired FAQ page URL
    const faqUrl = "https://home.ambicam.com/";
    window.open(faqUrl, "_blank");
  };

  const handleSharedTab = () => {
    setTabOpen(true);
    // Additional logic if needed
    fetchShareData(page);
  };

  return (
    <>
      <Flex
        flexDirection={{ base: "column", md: "row" }}
        flexWrap="wrap"
        align="stretch"
        height="100%"
      >
        <AlertDialog
          isOpen={isDeleteDialogOpen}
          leastDestructiveRef={undefined}
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Camera
              </AlertDialogHeader>

              {errorMessage && (
                <Box p={4} bg="red.100" color="red.700" textAlign="center">
                  {errorMessage}
                </Box>
              )}

              {successMessage && (
                <Box p={4} bg="green.100" color="green.700" textAlign="center">
                  {successMessage}
                </Box>
              )}
              <AlertDialogBody>
                Are you sure you want to delete this camera?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={confirmDeleteCamera} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
        {!isMobile && !(isLocal || isRegion || isZonal) && (
          <Box display="flex">
            {isVisible && (
              <Box
                flex={1}
                pt={"2px"}
                pb={"8px"}
                marginLeft={"5px"}
                minWidth={{ base: "100%", md: "initial" }}
                style={{
                  boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.2)",
                }}
              >
                <Heading
                  fontSize="22px"
                  pl={6}
                  pb={4}
                  pt={4}
                  color="gray"
                  style={{ boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.2)" }}
                >
                  Your Camera List
                </Heading>

                <DashboardTable
                  cameraList={cameraList}
                  handleOpenModal={handleOpenModal}
                />
              </Box>
            )}
            <Box
              onClick={toggleVisibility}
              marginTop={"1.5vh"}
              fontSize={"24px"}
              width="25px"
            >
              {isVisible ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </Box>
          </Box>
        )}
        <Box
          flex={6}
          p={deviceWidth < 290 ? 0 : "10px 8px 0px 12px"}
          style={{ boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)" }}
        >
          <Spacer />
          {isMobile && (
            <Tabs variant="soft-rounded" colorScheme="green">
              <TabList
                mb="1"
                style={{
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                  border: "1px solid green",
                  borderRadius: "20px",
                  width: "263px",
                  fontSize: "10px",
                  marginLeft: "40px",
                  flexDirection: "row",
                  marginBottom: "15px",
                }}
              >
                <Tab
                  style={{ textAlign: "left" }}
                  _selected={{
                    bg: selectedTab === "myCameras" ? "green.300" : "white",
                    color: selectedTab == "myCameras" ? "white" : "green.300",
                  }}
                  _focus={{ outline: "none" }}
                  onClick={() => {
                    setTabOpen(false);
                    setSelectedTab("myCameras");
                  }}
                >
                  {/* <Icon
                              as={BiCamera}
                              boxSize={5}
                              color="gray.500"
                              mr={2}
                              mt={1}
                            /> */}
                  MyCameras
                </Tab>
                <Tab
                  style={{ textAlign: "left" }}
                  _selected={{
                    bg: selectedTab === "sharedCameras" ? "green.300" : "white",
                    color: selectedTab == "sharedCameras" ? "white" : "green.300",
                  }}
                  _focus={{ outline: "none" }}
                  onClick={() => {
                    handleSharedTab();
                    setSelectedTab("sharedCameras");
                  }}
                >
                  {/* <Icon
                              as={FaUsers}
                              boxSize={5}
                              color="gray.500"
                              mr={2}
                              mt={1}
                            /> */}
                  SharedCameras
                </Tab>
              </TabList>
              <TabPanels>
                {/* My Cameras Panel */}
                <PullToRefresh onRefresh={handleRefresh}>
                  <TabPanel p={0}>
                    {isLoading ? (
                      <Flex align="center" justify="center" height="720">
                        <Spinner
                          size="xl"
                          thickness="4px"
                          color="blue.500"
                          emptyColor="gray.200"
                        />{" "}
                      </Flex>
                    ) : (
                      <Box
                        onScroll={handleScroll}
                        maxH={
                          isMobile
                            ? "calc(100vh - 170px)"
                            : "calc(100vh - 190px)"
                        }
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
                        {cameraList.length === 0 ? (
                          <Flex
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                          >
                            <Box
                              p={6}
                              borderWidth={1}
                              borderRadius="lg"
                              borderColor="gray.300"
                              boxShadow="md"
                              bg="white"
                            >
                              <Flex
                                direction="column"
                                alignItems="center"
                                color="gray.500"
                              >
                                <Icon
                                  as={FaVideoSlash}
                                  boxSize={20}
                                  color="red.300"
                                />
                                <Text fontSize="xl" mt={4} fontWeight="bold">
                                  Oops! No cameras found.
                                </Text>
                                <Text fontSize="md" mt={2} textAlign="center">
                                  Looks like you haven't added any cameras yet.
                                  Start by adding a camera to your list.
                                </Text>
                                {/* <Button
                                colorScheme="blue"
                                mt={4}
                                size="sm"
                                onClick={() => setIsAddCameraModalOpen(true)}
                              >
                                Add Camera
                              </Button> */}
                              </Flex>
                            </Box>
                          </Flex>
                        ) : (
                          <Grid
                            templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
                            gap={4}
                          >
                            {sortedCameraList.map((camera) => (
                              <GridItem
                                key={camera.cameraid}
                                width={window.innerWidth <= 280 ? "280px" : ""}
                              >
                                <Box
                                  bg="transparent"
                                  borderRadius="2xl"
                                  p={1}
                                  mb={2}
                                  boxShadow="xl"
                                  transition="transform 0.3s, box-shadow 0.3s"
                                  _hover={{
                                    transform: "scale(1.03)",
                                    boxShadow: "0px 0px 7px rgba(0, 0, 0, 0.3)",
                                  }}
                                >
                                  <Box position="relative" cursor="pointer">
                                    <Image
                                      src={
                                        localStorage.getItem(
                                          `thumbnail_${camera.cameraid}`
                                        ) ||
                                        camera.thumbnailUrl ||
                                        "https://via.placeholder.com/600x342/000000/?text="
                                      } // Use stored thumbnail URL or camera.thumbnailUrl
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
                                      alt="Camera"
                                      size={modalSize}
                                      height={imageHeight}
                                    />

                                    {/* <Text
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
                                    position="absolute"
                                    top="50%" // Center vertically
                                    left="50%" // Center horizontally
                                    fontSize={25}
                                    transform="translate(-50%, -50%)" // Move the text to center based on its size
                                  >
                                    ▶
                                  </Text> */}
                                    <IoIosPlayCircle
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
                                      style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        fontSize: "34px",
                                        color: "white",
                                      }}
                                    />
                                    {/* <FaPlay 
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
                                    style={{
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      fontSize: "20px",
                                      color:"white"
                                    }}
                                  /> */}
                                    {/* //MainContent */}
                                    {camera.islive ? (
                                      <Badge
                                        position="absolute" // Position the badge absolutely within the container
                                        top={2} // Top position from the edge of the container
                                        right={2} // Right position from the edge of the container
                                        fontSize="sm"
                                        color="green" // You can adjust the color scheme of the badge
                                        background={"whiteAlpha.800"}
                                        borderRadius={"15%"}
                                      >
                                        On
                                      </Badge>
                                    ) : (
                                      <Badge
                                        position="absolute" // Position the badge absolutely within the container
                                        top={2} // Top position from the edge of the container
                                        right={2} // Right position from the edge of the container
                                        fontSize="sm"
                                        color="red"
                                        background={"whiteAlpha.800"}
                                        borderRadius={"15%"}
                                        // colorScheme="red" // Set color to red when camera is off
                                      >
                                        Off
                                      </Badge>
                                    )}
                                  </Box>

                                  <HStack
                                    justifyContent="space-between"
                                    alignItems="center"
                                  >
                                    <Text fontWeight="bold" fontSize="sm" p={1}>
                                      {camera.cameraname}{" "}
                                      <span
                                        style={{
                                          fontSize: "11px",
                                          fontWeight: "500",
                                        }}
                                      >
                                        ({camera.deviceid})
                                      </span>
                                    </Text>

                                    {/* Add the Menu component with option dots */}
                                    <Menu
                                      placement="top"
                                      style={{
                                        position: "absolute",
                                        zIndex: 999,
                                      }}
                                    >
                                      <MenuButton
                                        as={IconButton}
                                        icon={<FiMoreVertical />}
                                        variant="ghost"
                                      />
                                      <MenuList>
                                        <MenuItem
                                          onClick={() =>
                                            handleShareCameraModel(
                                              camera.cameraname,
                                              camera.cameraid
                                            )
                                          }
                                          icon={<FiShare />}
                                        >
                                          Share This Camera
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() =>
                                            handleDeleteCamera(camera.cameraid)
                                          }
                                          icon={<FiTrash2 />}
                                        >
                                          Remove Camera
                                        </MenuItem>
                                        {/* Add more menu items as needed */}
                                      </MenuList>
                                    </Menu>
                                  </HStack>
                                </Box>
                              </GridItem>
                            ))}
                          </Grid>
                        )}

                        {isload && (
                          <>
                            <Flex align="center" justify="center" height="100%">
                              <Spinner
                                size="md"
                                thickness="3px"
                                color="blue.500"
                                emptyColor="gray.200"
                              />
                            </Flex>
                          </>
                        )}
                        {cameraList.length === totalitem && (
                          <>
                            <Text
                              align="center"
                              justify="center"
                              size="sm"
                              mt={4}
                            >
                              You Have Reached At End Of Your Camera List
                            </Text>
                          </>
                        )}
                      </Box>
                    )}
                  </TabPanel>
                </PullToRefresh>

                {/* Shared Cameras Panel */}
                <TabPanel>
                  {isLoading ? (
                    <Flex align="center" justify="center" maxHeight={"1000px"}>
                      <Spinner
                        size="xl"
                        thickness="4px"
                        color="blue.500"
                        emptyColor="gray.200"
                      />{" "}
                    </Flex>
                  ) : (
                    <>
                      {shareCameraList.length === 0 ? (
                        <Flex
                          alignItems="center"
                          justifyContent="center"
                          height="100vh" // Make the container fill the full viewport height
                        >
                          <Box
                            p={6}
                            borderWidth={1}
                            borderRadius="lg"
                            borderColor="gray.300"
                            boxShadow="md"
                            bg="white"
                            textAlign="center" // Center the text
                          >
                            <Icon
                              as={FaVideoSlash}
                              boxSize={20}
                              color="red.300"
                            />
                            <Text fontSize="xl" mt={4} fontWeight="bold">
                              Oh no! No shared cameras found.
                            </Text>
                            <Text fontSize="md" mt={2}>
                              It looks like you haven't been granted access to
                              any shared cameras yet.
                            </Text>
                          </Box>
                        </Flex>
                      ) : (
                        <PullToRefresh onRefresh={handleRefresh}>
                          <Box
                            maxH="calc(100vh - 250px)"
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
                            <Grid
                              templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
                              gap={4}
                            >
                              {shareCameraList.map((camera) => (
                                <GridItem
                                  key={camera.cameraid}
                                  width={
                                    window.innerWidth <= 280 ? "280px" : ""
                                  }
                                >
                                  <Box
                                    bg="white"
                                    borderRadius="md"
                                    p={1}
                                    mb={2}
                                    boxShadow="md"
                                    transition="transform 0.3s, box-shadow 0.3s" // Add transition effects
                                    _hover={{
                                      transform: "scale(1.03)", // Scale up on hover
                                      boxShadow:
                                        "0px 0px 7px rgba(0, 0, 0, 0.3)", // Add a shadow on hover
                                    }}
                                  >
                                    <Box position="relative" cursor="pointer">
                                      <Image
                                        src={
                                          localStorage.getItem(
                                            `thumbnail_${camera.cameraid}`
                                          ) ||
                                          camera.thumbnailUrl ||
                                          "https://via.placeholder.com/600x342/000000/?text="
                                        } // Use stored thumbnail URL or camera.thumbnailUrl
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
                                        alt="Camera"
                                        size={modalSize}
                                        height={imageHeight}
                                      />

                                      <Text
                                        position="absolute"
                                        top="50%" // Center vertically
                                        left="50%" // Center horizontally
                                        fontSize={25}
                                        transform="translate(-50%, -50%)" // Move the text to center based on its size
                                      >
                                        ▶
                                      </Text>

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
                                      ) : (
                                        <Badge
                                          position="absolute" // Position the badge absolutely within the container
                                          top={2} // Top position from the edge of the container
                                          right={2} // Right position from the edge of the container
                                          fontSize="sm"
                                          colorScheme="red" // Set color to red when camera is off
                                        >
                                          Off
                                        </Badge>
                                      )}
                                    </Box>

                                    <HStack
                                      justifyContent="space-between"
                                      alignItems="center"
                                    >
                                      <Text
                                        fontWeight="bold"
                                        fontSize="sm"
                                        p={1}
                                      >
                                        {camera.cameraname}{" "}
                                        <span
                                          style={{
                                            fontSize: "11px",
                                            fontWeight: "500",
                                          }}
                                        >
                                          ({camera.deviceid})
                                        </span>
                                      </Text>

                                      {/* Add the Menu component with option dots */}
                                      <Menu placement="top">
                                        <MenuButton
                                          as={IconButton}
                                          icon={<FiMoreVertical />}
                                          variant="ghost"
                                        />
                                        <MenuList>
                                          {!isLocal && (
                                            <MenuItem
                                              onClick={() =>
                                                handleShareCameraModel(
                                                  camera.cameraname,
                                                  camera.cameraid
                                                )
                                              }
                                              icon={<FiShare />}
                                            >
                                              Share This Camera
                                            </MenuItem>
                                          )}
                                          <MenuItem
                                            onClick={() =>
                                              RemoveSharedCamera(
                                                camera.cameraid
                                              )
                                            }
                                            icon={<FiTrash2 />}
                                          >
                                            Remove Camera
                                          </MenuItem>
                                          {/* Add more menu items as needed */}
                                        </MenuList>
                                      </Menu>
                                    </HStack>
                                  </Box>
                                </GridItem>
                              ))}
                            </Grid>
                          </Box>
                        </PullToRefresh>
                      )}
                    </>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          )}
          <Tabs
            variant="enclosed"
            defaultIndex={isLocal || isRegion || isZonal || isNoRole ? 1 : 0}
          >
            <TabList mb="4">
              {/* {!(isLocal || isRegion || isZonal) && ( */}
              {!isMobile && (
                <>
                  <Tab
                    _selected={{ color: "white", bg: "green.300" }}
                    _focus={{ outline: "none" }}
                    onClick={handleSharedTab}
                    isDisabled={isLocal || isRegion || isZonal || isNoRole}
                  >
                    My Cameras
                  </Tab>
                  <Tab
                    _selected={{ color: "white", bg: "green.300" }}
                    _focus={{ outline: "none" }}
                    onClick={handleSharedTab}
                  >
                    Shared Cameras
                  </Tab>
                </>
              )}

              {/* <>
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />
                <Spacer />

                <Menu placement="top">
                  <MenuButton
                    as={IconButton}
                    icon={<FaSortAmountDownAlt />}
                    variant="ghost"
                    onClick={() => {
                      setSortByLive(true);
                      setTabOpen(false);
                    }}
                  />
                </Menu>
              </> */}
              {!isMobile && isCC && (
                <Button
                  // border={"3px solid grey"}
                  bgColor={"blue.300"}
                  color={"white"}
                  onClick={() => {
                    setIsAddCameraModalOpen(true);
                    setNewCameraId("");
                  }}
                  borderRadius="24px"
                  boxShadow="rgba(0, 0, 0, .2) 0 2px 3px -1px, rgba(0, 0, 0, .14) 0 3px 5px 0, rgba(0, 0, 0, .12) 0 1px 9px 0"
                  // color="#3c4043"
                  // marginBottom="1%"
                  marginRight="1%"
                  marginTop="1%"
                  marginLeft="60%"
                  cursor="pointer"
                  fontFamily="'Google Sans', Roboto, Arial, sans-serif"
                  fontSize="14px"
                  fontWeight="500"
                  height="40px"
                  padding="1px 16px"
                  transition="box-shadow 280ms cubic-bezier(.4, 0, .2, 1), opacity 15ms linear 30ms, transform 270ms cubic-bezier(0, 0, .2, 1) 0ms"
                  _hover={{ background: "blue.400", color: "white" }}
                  _active={{
                    boxShadow:
                      "0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%)",
                  }}
                  // _focus={{ border: "2px solid #4285f4" }}
                >
                  Add Camera
                </Button>
                // <Button
                // marginTop={"1%"}
                // marginRight={"1%"}
                // border={"3px solid grey"}
                // color={"blue.400"}
                // borderRadius={"10%"}
                // onClick={() => {
                //   setIsAddCameraModalOpen(true);
                //   setNewCameraId("");
                // }}
                //   size="sm"
                // >

                //   Add Camera
                // </Button>
              )}

              {/* {isMobile && (
                <>
                  <Spacer />
                  <Menu placement="top">
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      onClick={() => {
                        setTabListOpen(!tabListOpen);
                        setTabOpen(false);
                      }}
                    />
                    {tabListOpen && (
                      <MenuList>
                        <TabList flexDirection="column">
                          <Tab
                            style={{ textAlign: "left" }}
                            _selected={{
                              bg:
                                selectedTab === "myCameras"
                                  ? "gray.300"
                                  : "white",
                            }}
                            _focus={{ outline: "none" }}
                            onClick={() => {
                              setTabOpen(false);
                              setSelectedTab("myCameras");
                            }}
                          >
                            <Icon
                              as={BiCamera}
                              boxSize={5}
                              color="gray.500"
                              mr={2}
                              mt={1}
                            />
                            My Cameras
                          </Tab>
                          <Tab
                            style={{ textAlign: "left" }}
                            _selected={{
                              bg:
                                selectedTab === "sharedCameras"
                                  ? "gray.300"
                                  : "white",
                            }}
                            _focus={{ outline: "none" }}
                            onClick={() => {
                              handleSharedTab();
                              setSelectedTab("sharedCameras");
                            }}
                          >
                            <Icon
                              as={FaUsers}
                              boxSize={5}
                              color="gray.500"
                              mr={2}
                              mt={1}
                            />
                            Shared Cameras
                          </Tab>
                        </TabList>
                      </MenuList>
                    )}
                  </Menu>
                </>
              )} */}
            </TabList>

            <TabPanels>
              {/* My Cameras Panel */}
              <PullToRefresh onRefresh={handleRefresh}>
                <TabPanel p={0}>
                  {isLoading ? (
                    <Flex align="center" justify="center" height="720">
                      <Spinner
                        size="xl"
                        thickness="4px"
                        color="blue.500"
                        emptyColor="gray.200"
                      />{" "}
                    </Flex>
                  ) : (
                    <Box
                      onScroll={handleScroll}
                      maxH={
                        isMobile ? "calc(100vh - 170px)" : "calc(100vh - 190px)"
                      }
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
                      {cameraList.length === 0 ? (
                        <Flex
                          alignItems="center"
                          justifyContent="center"
                          height="100%"
                        >
                          <Box
                            p={6}
                            borderWidth={1}
                            borderRadius="lg"
                            borderColor="gray.300"
                            boxShadow="md"
                            bg="white"
                          >
                            <Flex
                              direction="column"
                              alignItems="center"
                              color="gray.500"
                            >
                              <Icon
                                as={FaVideoSlash}
                                boxSize={20}
                                color="red.300"
                              />
                              <Text fontSize="xl" mt={4} fontWeight="bold">
                                Oops! No cameras found.
                              </Text>
                              <Text fontSize="md" mt={2} textAlign="center">
                                Looks like you haven't added any cameras yet.
                                Start by adding a camera to your list.
                              </Text>
                              {/* <Button
                                colorScheme="blue"
                                mt={4}
                                size="sm"
                                onClick={() => setIsAddCameraModalOpen(true)}
                              >
                                Add Camera
                              </Button> */}
                            </Flex>
                          </Box>
                        </Flex>
                      ) : (
                        <Grid
                          templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
                          gap={4}
                        >
                          {sortedCameraList.map((camera) => (
                            <GridItem
                              key={camera.cameraid}
                              width={window.innerWidth <= 280 ? "280px" : ""}
                            >
                              <Box
                                bg="transparent"
                                borderRadius="2xl"
                                p={1}
                                mb={2}
                                boxShadow="xl"
                                transition="transform 0.3s, box-shadow 0.3s"
                                _hover={{
                                  transform: "scale(1.03)",
                                  boxShadow: "0px 0px 7px rgba(0, 0, 0, 0.3)",
                                }}
                              >
                                <Box position="relative" cursor="pointer">
                                  <Image
                                    src={
                                      localStorage.getItem(
                                        `thumbnail_${camera.cameraid}`
                                      ) ||
                                      camera.thumbnailUrl ||
                                      "https://via.placeholder.com/600x342/000000/?text="
                                    } // Use stored thumbnail URL or camera.thumbnailUrl
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
                                    alt="Camera"
                                    size={modalSize}
                                    height={imageHeight}
                                  />

                                  {/* <Text
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
                                    position="absolute"
                                    top="50%" // Center vertically
                                    left="50%" // Center horizontally
                                    fontSize={25}
                                    transform="translate(-50%, -50%)" // Move the text to center based on its size
                                  >
                                    ▶
                                  </Text> */}
                                  <IoIosPlayCircle
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
                                    style={{
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      fontSize: "34px",
                                      color: "white",
                                    }}
                                  />
                                  {/* <FaPlay 
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
                                    style={{
                                      position: "absolute",
                                      top: "50%",
                                      left: "50%",
                                      transform: "translate(-50%, -50%)",
                                      fontSize: "20px",
                                      color:"white"
                                    }}
                                  /> */}
                                  {/* //MainContent */}
                                  {camera.islive ? (
                                    <Badge
                                      position="absolute" // Position the badge absolutely within the container
                                      top={2} // Top position from the edge of the container
                                      right={2} // Right position from the edge of the container
                                      fontSize="sm"
                                      color="green" // You can adjust the color scheme of the badge
                                      background={"whiteAlpha.800"}
                                      borderRadius={"15%"}
                                    >
                                      On
                                    </Badge>
                                  ) : (
                                    <Badge
                                      position="absolute" // Position the badge absolutely within the container
                                      top={2} // Top position from the edge of the container
                                      right={2} // Right position from the edge of the container
                                      fontSize="sm"
                                      color="red"
                                      background={"whiteAlpha.800"}
                                      borderRadius={"15%"}
                                      // colorScheme="red" // Set color to red when camera is off
                                    >
                                      Off
                                    </Badge>
                                  )}
                                </Box>

                                <HStack
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Text fontWeight="bold" fontSize="sm" p={1}>
                                    {camera.cameraname}{" "}
                                    <span
                                      style={{
                                        fontSize: "11px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      ({camera.deviceid})
                                    </span>
                                  </Text>

                                  {/* Add the Menu component with option dots */}
                                  <Menu
                                    placement="top"
                                    style={{
                                      position: "absolute",
                                      zIndex: 999,
                                    }}
                                  >
                                    <MenuButton
                                      as={IconButton}
                                      icon={<FiMoreVertical />}
                                      variant="ghost"
                                    />
                                    <MenuList>
                                      <MenuItem
                                        onClick={() =>
                                          handleShareCameraModel(
                                            camera.cameraname,
                                            camera.cameraid
                                          )
                                        }
                                        icon={<FiShare />}
                                      >
                                        Share This Camera
                                      </MenuItem>
                                      <MenuItem
                                        onClick={() =>
                                          handleDeleteCamera(camera.cameraid)
                                        }
                                        icon={<FiTrash2 />}
                                      >
                                        Remove Camera
                                      </MenuItem>
                                      {/* Add more menu items as needed */}
                                    </MenuList>
                                  </Menu>
                                </HStack>
                              </Box>
                            </GridItem>
                          ))}
                        </Grid>
                      )}

                      {isload && (
                        <>
                          <Flex align="center" justify="center" height="100%">
                            <Spinner
                              size="md"
                              thickness="3px"
                              color="blue.500"
                              emptyColor="gray.200"
                            />
                          </Flex>
                        </>
                      )}
                      {cameraList.length === totalitem && (
                        <>
                          <Text
                            align="center"
                            justify="center"
                            size="sm"
                            mt={4}
                          >
                            You Have Reached At End Of Your Camera List
                          </Text>
                        </>
                      )}
                    </Box>
                  )}
                </TabPanel>
              </PullToRefresh>

              {/* Shared Cameras Panel */}
              <PullToRefresh onRefresh={handleRefresh}>
              <TabPanel>
                  {isLoading ? (
                    <Flex align="center" justify="center" height="920">
                      <Spinner
                        size="xl"
                        thickness="4px"
                        color="blue.500"
                        emptyColor="gray.200"
                      />{" "}
                    </Flex>
                  ) : (
                    <>
                      {shareCameraList.length === 0 ? (
                        <Flex
                          alignItems="center"
                          justifyContent="center"
                          height="100vh" // Make the container fill the full viewport height
                        >
                          <Box
                            p={6}
                            borderWidth={1}
                            borderRadius="lg"
                            borderColor="gray.300"
                            boxShadow="md"
                            bg="white"
                            textAlign="center" // Center the text
                          >
                            <Icon
                              as={FaVideoSlash}
                              boxSize={20}
                              color="red.300"
                            />
                            <Text fontSize="xl" mt={4} fontWeight="bold">
                              Oh no! No shared cameras found.
                            </Text>
                            <Text fontSize="md" mt={2}>
                              It looks like you haven't been granted access to
                              any shared cameras yet.
                            </Text>
                          </Box>
                        </Flex>
                      ) : (
                        <PullToRefresh onRefresh={handleRefresh}>
                          <Box
                            maxH="calc(100vh - 250px)"
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
                            <Grid
                              templateColumns="repeat(auto-fill, minmax(280px, 1fr))"
                              gap={4}
                            >
                              {shareCameraList.map((camera) => (
                                <GridItem
                                  key={camera.cameraid}
                                  width={
                                    window.innerWidth <= 280 ? "280px" : ""
                                  }
                                >
                                  <Box
                                    bg="white"
                                    borderRadius="md"
                                    p={1}
                                    mb={2}
                                    boxShadow="md"
                                    transition="transform 0.3s, box-shadow 0.3s" // Add transition effects
                                    _hover={{
                                      transform: "scale(1.03)", // Scale up on hover
                                      boxShadow:
                                        "0px 0px 7px rgba(0, 0, 0, 0.3)", // Add a shadow on hover
                                    }}
                                  >
                                    <Box position="relative" cursor="pointer">
                                      <Image
                                        src={
                                          localStorage.getItem(
                                            `thumbnail_${camera.cameraid}`
                                          ) ||
                                          camera.thumbnailUrl ||
                                          "https://via.placeholder.com/600x342/000000/?text="
                                        } // Use stored thumbnail URL or camera.thumbnailUrl
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
                                        alt="Camera"
                                        size={modalSize}
                                        height={imageHeight}
                                      />

                                      <Text
                                        position="absolute"
                                        top="50%" // Center vertically
                                        left="50%" // Center horizontally
                                        fontSize={25}
                                        transform="translate(-50%, -50%)" // Move the text to center based on its size
                                      >
                                        ▶
                                      </Text>

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
                                      ) : (
                                        <Badge
                                          position="absolute" // Position the badge absolutely within the container
                                          top={2} // Top position from the edge of the container
                                          right={2} // Right position from the edge of the container
                                          fontSize="sm"
                                          colorScheme="red" // Set color to red when camera is off
                                        >
                                          Off
                                        </Badge>
                                      )}
                                    </Box>

                                    <HStack
                                      justifyContent="space-between"
                                      alignItems="center"
                                    >
                                      <Text
                                        fontWeight="bold"
                                        fontSize="sm"
                                        p={1}
                                      >
                                        {camera.cameraname}{" "}
                                        <span
                                          style={{
                                            fontSize: "11px",
                                            fontWeight: "500",
                                          }}
                                        >
                                          ({camera.deviceid})
                                        </span>
                                      </Text>

                                      {/* Add the Menu component with option dots */}
                                      <Menu placement="top">
                                        <MenuButton
                                          as={IconButton}
                                          icon={<FiMoreVertical />}
                                          variant="ghost"
                                        />
                                        <MenuList>
                                          {!isLocal && (
                                            <MenuItem
                                              onClick={() =>
                                                handleShareCameraModel(
                                                  camera.cameraname,
                                                  camera.cameraid
                                                )
                                              }
                                              icon={<FiShare />}
                                            >
                                              Share This Camera
                                            </MenuItem>
                                          )}
                                          <MenuItem
                                            onClick={() =>
                                              RemoveSharedCamera(
                                                camera.cameraid
                                              )
                                            }
                                            icon={<FiTrash2 />}
                                          >
                                            Remove Camera
                                          </MenuItem>
                                          {/* Add more menu items as needed */}
                                        </MenuList>
                                      </Menu>
                                    </HStack>
                                  </Box>
                                </GridItem>
                              ))}
                            </Grid>
                          </Box>
                        </PullToRefresh>
                      )}
                    </>
                  )}
                </TabPanel>
              </PullToRefresh>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>

      <Modal
        isOpen={isShareCameraModalOpen}
        onClose={() => {
          setIsShareCameraModalOpen(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share This Camera</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Display the error message */}
            {errorMessage && (
              <Box p={4} bg="red.100" color="red.700" textAlign="center">
                {errorMessage}
              </Box>
            )}

            {successMessage && (
              <Box p={4} bg="green.100" color="green.700" textAlign="center">
                {successMessage}
              </Box>
            )}
            <FormControl>
              <FormLabel>Receiver Email</FormLabel>
              <Input onChange={(e) => setIsReceiverEmail(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={ShareThisCamera}>
              Share
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsShareCameraModalOpen(false);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isAddCameraModalOpen}
        onClose={() => {
          setIsAddCameraModalOpen(false);
          setIsScanning(false);
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Camera</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Display the error message */}
            {errorMessage && (
              <Box p={4} bg="red.100" color="red.700" textAlign="center">
                {errorMessage}
              </Box>
            )}

            {successMessage && (
              <Box p={4} bg="green.100" color="green.700" textAlign="center">
                {successMessage}
              </Box>
            )}
            {/* {!isScanning &&  (
     <Button onClick={() => setIsScanning(true)}>Scan QR Code</Button>
   )} */}
            <FormControl>
              <FormLabel>Camera Name</FormLabel>
              <Input onChange={(e) => setNewCameraName(e.target.value)} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel hidden={isScanning}>Camera ID</FormLabel>
              <Input
                onChange={(e) => setNewCameraId(e.target.value)}
                value={newCameraId}
                hidden={isScanning}
              />
            </FormControl>
            {isScanning && (
              <div>
                <QRCodeScanner onScanSuccess={handleScanSuccess} />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddCamera}>
              Add
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setIsScanning(false);
                setIsAddCameraModalOpen(false);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        size={modalSize}
        motionPreferences={{ motionReducer: (props) => props }}
      >
        <ModalOverlay />
        <ModalContent bg="gray.200" mb={0} mt={10}>
          {/* <ModalHeader>Live Stream</ModalHeader> */}
          {/* <ModalCloseButton /> */}
          <ModalHeader
            padding={isMobile ? 2 : 1}
            mt={isMobile ? 5 : 0}
            alignItems="center"
            display="flex"
            justifyContent="space-between"
          >
            <Text
              // display="flex"
              // alignItems="center"
              justifyContent="flex-start"
              fontWeight="bold"
              fontSize="lg"
              fontFamily="serif"
              // width="240px"
            >
              {cameraname}&nbsp;
              {!isMobile && (
                <span style={{ fontSize: "smaller" }}>({deviceId})</span>
              )}
            </Text>

            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <FiInfo cursor={"pointer"} size={"20px"} />
              <BiX
                cursor={"pointer"}
                onClick={handleCloseModal}
                size={"30px"}
              />
            </Box>
          </ModalHeader>
          <ModalBody padding={0}>
            {videoLoadError ? (
              <OfflineMessage style={{ height: "65vh" }} />
            ) : (
              <LiveFeed
                // http://media1.ambicam.com:8080/dvr30/8b522279-587d-4079-8408-3aa42c1ea751/26-07-2023.m3u8
                live={`${videoUrl}`}
                autoPlay={true}
                ref={liveFeedRef}
                // CloseButton={true}
                selectedDate={`${videoUrl}`}
                handleThumbnailGenerated={handleThumbnailGenerated}
                cameraId={cameraId}
                // showTimeline={true}
                showTimeline={selectedDate ? showTimeline : !showTimeline} //if playing archive video
                isLive={islive}
                recordingDates={recordingDates}
                onVideoLoadError={handleVideoLoadError}
                // isPlaying={true}
                // onPlay={() => {}}
                // onPause={() => {}}
              />
            )}

            {showDownload && selectedDate && isMobile && (
              <Flex
                alignItems="center"
                flexDirection="column"
                marginTop="1.5rem"
                padding="1rem"
                backgroundColor="gray.100"
                borderRadius="md"
                boxShadow="md"
              >
                <Flex alignItems="center" marginBottom="0.5rem">
                  <Input
                    type="time"
                    placeholder="Start Time"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    size="sm"
                    width="120px"
                    borderColor="gray.300"
                    borderRadius="md"
                    marginRight="0.5rem"
                    _focus={{ borderColor: "blue.400" }}
                  />
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    to
                  </Text>
                  <Input
                    type="time"
                    placeholder="End Time"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.target.value)}
                    size="sm"
                    width="120px"
                    borderColor="gray.300"
                    borderRadius="md"
                    marginLeft="0.5rem"
                    _focus={{ borderColor: "blue.400" }}
                  />
                </Flex>

                <Button
                  leftIcon={<FiDownload />}
                  colorScheme="blue"
                  size="sm"
                  onClick={handleDownload}
                  isLoading={isDownloading}
                  _hover={{ bg: "blue.400" }}
                >
                  {isDownloading ? "Downloading..." : "Download Clip"}
                </Button>
              </Flex>
            )}
          </ModalBody>

          <ModalFooter
            bg="none"
            padding={isMobile ? 2 : 1}
            mb={isMobile ? 4 : 0}
            display="flex"
            justifyContent="space-between"
          >
            {!(
              isLocal ||
              isRegion ||
              isZonal ||
              ispanIn ||
              isNoRole ||
              isSuper
            ) && !isTabOpen ? (
              <IconButton
                icon={<FiSettings />} // Use the settings icon from Chakra UI's icon library
                colorScheme="blue"
                onClick={() => handleCameraSettingsClick(plantext, deviceId)}
                aria-label="Camera Settings"
              />
            ) : null}

            {showDownload && selectedDate && !isMobile && (
              <Box>
                <Flex alignItems="center" marginBottom="0.5rem">
                  <Input
                    type="time"
                    placeholder="Start Time"
                    value={startDateTime}
                    onChange={(e) => setStartDateTime(e.target.value)}
                    size="sm"
                    width="120px"
                    borderColor="gray.300"
                    borderRadius="md"
                    marginRight="0.5rem"
                    _focus={{ borderColor: "blue.400" }}
                  />
                  <Text fontSize="sm" fontWeight="bold" color="gray.600">
                    to
                  </Text>
                  <Input
                    type="time"
                    placeholder="End Time"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.target.value)}
                    size="sm"
                    width="120px"
                    borderColor="gray.300"
                    borderRadius="md"
                    marginLeft="0.5rem"
                    marginRight="0.5rem"
                    _focus={{ borderColor: "blue.400" }}
                  />
                  <IconButton
                    icon={<FiDownload />}
                    colorScheme="blue"
                    size="sm"
                    onClick={handleDownload}
                    aria-label="Download Clip"
                    isLoading={isDownloading} // Add this prop
                  >
                    {" "}
                    {isDownloading ? null : "Download"}
                  </IconButton>
                </Flex>
              </Box>
            )}

            <Flex alignItems="center" gap={2}>
              {selectedDate && (
                <Button
                  colorScheme="blue"
                  aria-label="Live"
                  position="relative"
                  onClick={() => jumptoLive()}
                >
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                  >
                    Live
                  </Box>
                </Button>
              )}
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<FaSimCard />}
                  colorScheme="blue"
                />
                <MenuList maxH="200px" overflowY="auto">
                  {recordingDates.map((date) => (
                    <MenuItem key={date} onClick={() => handleSelectDate(date)}>
                      <BsCameraVideo />
                      <span style={{ padding: "5px" }}>{date}</span>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Menu>
                <MenuButton
                  as={IconButton}
                  icon={<RiPlayList2Line />}
                  colorScheme="blue"
                />
                <MenuList maxH="200px" overflowY="auto">
                  {recordingDates.map((date) => (
                    <MenuItem key={date} onClick={() => handleSelectDate(date)}>
                      <BsCameraVideo />
                      <span style={{ padding: "5px" }}>{date}</span>
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Camera settings modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Camera Settings</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Put your camera settings UI here */}
            <CameraSettings
              onClose={onClose}
              plantext={plantext}
              deviceid={deviceId}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default withAuth(CameraList);
