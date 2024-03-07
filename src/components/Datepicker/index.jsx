import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import React from 'react';
import {Calendar} from "@hassanmojab/react-modern-calendar-datepicker";
import {Button, ConfigProvider, theme} from "antd";
import "./index.css";

export default function Datepicker(
    {
        alwaysOpen = false,
        closedView = "text",
        closedViewClassName = "",
        closedViewProps = {},
        colorPrimary = "#0eca2d",
        darkMode = false,
        delimiter = " - ",
        disabled = false,
        locale = "en",
        maximumDate = null,
        maximumToday = false,
        maximumTomorrow = false,
        minimumDate = null,
        minimumToday = false,
        minimumTomorrow = false,
        onChange = null,
        placeholder = "select",
        returnType = "string",
        selectionMode = "single",
        trigger = "click",
        value = null,
        ...props
    }) {
    const {defaultAlgorithm, darkAlgorithm} = theme;

    return (
        <ConfigProvider theme={{algorithm: darkMode ? darkAlgorithm : defaultAlgorithm}}>
            {
                alwaysOpen ? (
                    <div className={darkMode ? "calendar-dark" : ""}>
                        <Calendar shouldHighlightWeekends calendarClassName={props.calendarClassName}/>
                    </div>
                ) : (
                    <Button/>
                )
            }
        </ConfigProvider>
    )
}
