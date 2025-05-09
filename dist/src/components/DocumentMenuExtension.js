import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MapPinArea } from "@phosphor-icons/react";
import { getTranslations } from "../i18n";
import "./DocumentMenuExtension.css";
export const DocumentMenuExtension = (props) => {
    const { t } = getTranslations(window.location.href, "all");
    const handleClick = () => { };
    return (_jsxs("div", { className: "dme-menu-item", onClick: handleClick, children: [_jsx(MapPinArea, { size: 16, color: "#6f747c" }), t["Perform NER on Document"]] }));
};
