import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import React, {useState} from 'react';
import {Calendar} from "@hassanmojab/react-modern-calendar-datepicker";
import {Button, ConfigProvider, Input, Popover, theme, Typography} from "antd";
import "./index.css";
import {getPlaceholder, getInitialValue, notSelectedCheck, selectedValueToString} from "./utils.js";


export default function Datepicker(
    {
        alwaysOpen = false,
        closedView = "text",
        closedViewClassName = "",
        closedViewProps = {},
        colorPrimary = "#1677ff",
        colorPrimaryLight = "#1677FF4C",
        darkMode = false,
        delimiter = "-",
        defaultValue = null,
        disabled = false,
        locale = "en",
        maximumDate = null,
        maximumToday = false,
        maximumTomorrow = false,
        minimumDate = null,
        minimumToday = false,
        minimumTomorrow = false,
        placeholder = locale === "en" ? "select" : "انتخاب",
        placement = "bottom",
        returnType = "object",
        selectionMode = "single",
        trigger = "click",
        ...props
    }) {
    const {defaultAlgorithm, darkAlgorithm} = theme;
    const [value, setValue] = useState(getInitialValue(selectionMode, defaultValue, delimiter));

    const onChange = (calendarValue) => {
        setValue(calendarValue);
        let returnValue = calendarValue
        if (returnType === "string") {
            returnValue = selectedValueToString(returnValue, delimiter)
        }
        props.onChange(returnValue)
    }

    const getClosedViewElement = () => {
        let placeholderText = getPlaceholder(value, locale, placeholder, delimiter)
        let textClosedView = notSelectedCheck(value) ?
            <Typography.Link className={closedViewClassName}>{placeholderText}</Typography.Link> :
            <Typography.Text className={closedViewClassName}>{placeholderText}</Typography.Text>

        switch (closedView) {
            case "text":
                return textClosedView
            case "input":
                return <Input className={closedView} placeholder={placeholderText}></Input>
            case "button":
                return <Button className={closedView}>{placeholderText}</Button>
            default:
                return textClosedView
        }
    }

    const getCalendar = () => (
        <div className={darkMode ? "calendar-dark" : ""}>
            <Calendar
                colorPrimary={colorPrimary}
                colorPrimaryLight={colorPrimaryLight}
                locale={locale}
                value={value}
                {...props}
                onChange={onChange}
            />
        </div>
    )

    return (
        <ConfigProvider
            theme={{algorithm: darkMode ? darkAlgorithm : defaultAlgorithm}}>
            {
                alwaysOpen ? (
                    <>
                        {getCalendar()}
                    </>
                ) : (
                    <Popover
                        trigger={trigger}
                        placement={placement}
                        content={getCalendar()}
                        overlayInnerStyle={{padding: 0}}
                    >
                        {getClosedViewElement()}
                    </Popover>
                )
            }
        </ConfigProvider>
    )
}
