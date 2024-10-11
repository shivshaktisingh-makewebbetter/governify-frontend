import { CloseOutlined } from "@ant-design/icons";
import { Button, Drawer, Input, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import ImageField from "./ImageField";
import {
  AdobeAcrobat,
  AiIcon,
  ApkIcon,
  CssIcon,
  Csvicon,
  DmgIcon,
  Docicon,
  Docxicon,
  HtmlIcon,
  Jpegicon,
  Jpgicon,
  Mp3icon,
  Mp4icon,
  Pngicon,
  PptIcon,
  PptxIcon,
  PsdIcon,
  RarIcon,
  Svgicon,
  Txticon,
  XlsIcon,
  Xlsxicon,
  ZipIcon,
} from "../../../../assets/image";
import { Loader } from "../../../common/Loader";
import { fetcher } from "../../../../utils/helper";
import { toast } from "react-toastify";

export const getIcon = (name) => {
  let tempArray = name.split(".");
  let svgType = tempArray[tempArray.length - 1];

  let icons = {
    csv: <Csvicon />,
    doc: <Docicon />,
    docx: <Docxicon />,
    png: <Pngicon />,
    jpg: <Jpgicon />,
    jpeg: <Jpegicon />,
    mp4: <Mp4icon />,
    svg: <Svgicon />,
    xlsx: <Xlsxicon />,
    pdf: <AdobeAcrobat />,
    mp3: <Mp3icon />,
    txt: <Txticon />,
    ppt: <PptIcon />,
    psd: <PsdIcon />,
    dmg: <DmgIcon />,
    ai: <AiIcon />,
    html: <HtmlIcon />,
    css: <CssIcon />,
    xls: <XlsIcon />,
    zip: <ZipIcon />,
    apk: <ApkIcon />,
    pptx: <PptxIcon />,
    rar: <RarIcon />,
  };

  return icons[svgType] !== undefined ? icons[svgType] : <AdobeAcrobat />;
};

const AddAndEditPortalDrawer = ({
  open,
  setOpenAddPortalDrawer,
  type,
  fetchPortal,
  data,
}) => {
  const [image, setImage] = useState("");
  const [portalName, setPortalName] = useState("");
  const [errorSchema, setErrorSchema] = useState({
    image: false,
    name: false,
  });
  const [loading, setLoading] = useState(false);

  const isLargeScreen = useMediaQuery({ query: "(min-width: 1200px)" });
  const isMediumScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const isSmallScreen = useMediaQuery({ query: "(max-width: 767px)" });

  let DrawerWidth = "520px";
  if (isLargeScreen) {
    DrawerWidth = "520px";
  } else if (isMediumScreen) {
    DrawerWidth = "520px";
  } else if (isSmallScreen) {
    DrawerWidth = "320px";
  }

  const validateForm = () => {
    let valid = true;
    let errorObj = {
      name: false,
      image: false,
    };
    if (image === "") {
      errorObj.image = true;
      valid = false;
    } else {
      errorObj.image = false;
      valid = true;
    }

    if (portalName === "") {
      errorObj.name = true;
      valid = false;
    } else {
      errorObj.name = false;
      if (valid) {
        valid = true;
      }
    }

    setErrorSchema({ name: errorObj.name, image: errorObj.image });

    return valid;
  };

  const handleSubmit = async () => {
    let valid = validateForm();
    if (!valid) {
      return;
    }
    let payload = {};
    if (type === "add") {
      payload = JSON.stringify({
        title: portalName,
        image_name: image?.name,
        image: image?.image,
        image_size: image?.size,
      });
    } else {
      payload = JSON.stringify({
        title: portalName,
        ...(image?.change && {
          image_name: image?.name,
          image: image?.image,
          image_size: image?.size,
        }),
      });
    }
    let url =
      type === "add"
        ? "governify/admin/addPortalDetails"
        : `governify/admin/updatePortalDetails/${data?.id}`;
    let method = type === "add" ? "POST" : "PUT";
    setLoading(true);
    try {
      const res = await fetcher(url, method, payload);
      if (res.status) {
        toast.success(res.message);
        setTimeout(() => {
          setImage("");
          fetchPortal();
          setOpenAddPortalDrawer(false);
        }, 2500);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (data !== undefined) {
      setImage({
        name: data.name,
        image: data.image,
        size: data.size,
        change: false,
      });
      setPortalName(data?.name);
    }
  }, [data]);

  return (
    <div>
      {loading && <Loader />}
      <Drawer
        zIndex={99}
        width={DrawerWidth}
        title={
          <div className="fs-24 pt-1">
            {type === "add" ? "Add" : "Edit"} Portal
          </div>
        }
        open={open}
        closable={false}
        onClose={() => setOpenAddPortalDrawer(false)}
        extra={
          <Space>
            <Button onClick={() => setOpenAddPortalDrawer(false)} type="text">
              <CloseOutlined />
            </Button>
          </Space>
        }
        footer={
          <div className="d-flex justify-content-between pt-2">
            <button
              style={{
                background: "#f2f3f7",
                color: "#202223",
                maxWidth: "224px",
                borderRadius: "8px",
                gap: "5px",
                padding: "10px 20px",
                border: "1px solid #8C9196",
              }}
              onClick={() => setOpenAddPortalDrawer(false)}
            >
              Cancel
            </button>
            <button
              style={{
                background: "#00BF63",
                color: "#fff",
                maxWidth: "224px",
                borderRadius: "8px",
                gap: "5px",
                padding: "10px 20px",
                border: "none",
              }}
              onClick={() => handleSubmit()}
            >
              Add Portal
            </button>
          </div>
        }
      >
        <div className="d-flex flex-column" style={{ gap: "20px" }}>
          <div className="d-flex mt-2 flex-column" style={{ gap: "5px" }}>
            <div className="fs-16" style={{ color: "#202223" }}>
              Portal Image
            </div>
            <ImageField
              image={image}
              setImage={setImage}
              error={errorSchema.image}
            />
          </div>
          <div className="d-flex mt-2 flex-column" style={{ gap: "5px" }}>
            <div className="fs-16" style={{ color: "#202223" }}>
              Portal Name
            </div>
            <Input
              value={portalName}
              onChange={(e) => setPortalName(e.target.value)}
              placeholder="Enter portal name"
              status={errorSchema.name ? "error" : ""}
              style={{ background: errorSchema.name ? "#FFF4F4" : "" }}
            />
            {errorSchema.name && (
              <span
                style={{ color: "#FD5749", marginTop: "5px" }}
                className="fs-s"
              >
                This field is required.
              </span>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default AddAndEditPortalDrawer;
