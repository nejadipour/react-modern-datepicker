import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import "./index.css";
import React, {useState} from 'react';
import {Calendar} from "@hassanmojab/react-modern-calendar-datepicker";
import {Button, ConfigProvider, Flex, Popover, theme, Typography} from "antd";
import {
    getPlaceholder,
    getInitialValue,
    selectedValueToString,
    getTodayBasedOnSelectionMode, getEmptyValueBasedOnSelectionMode, getMinMaxDate
} from "./utils.js";
import {DefaultValueButton, EraseButton, SubmitButton, TodayButton} from "./options.jsx";
import DatepickerInput from "./Input.jsx";


export default function Datepicker(
    {
        alwaysOpen = false,
        closedView = "text",
        closedViewClassName = "",
        closedViewProps,
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
    const [open, setOpen] = useState(false);
    const [key, setKey] = useState(0);

    const onChange = (calendarValue) => {
        setValue(calendarValue);
        let returnValue = calendarValue
        if (calendarValue && returnType === "string") {
            returnValue = selectedValueToString(returnValue, delimiter)
        }
        props.onChange(returnValue)
    }

    const getCalendar = () => (
        <div key={key} className={darkMode ? "calendar-dark" : ""}>
            <Calendar
                colorPrimary={colorPrimary}
                colorPrimaryLight={colorPrimaryLight}
                locale={locale}
                value={value}
                {...props}
                {...getMinMaxDate(minimumDate, maximumDate, delimiter, maximumToday, maximumTomorrow, minimumToday, minimumTomorrow)}
                onChange={onChange}
                renderFooter={() => (
                    <>
                        <Flex justify={"space-between"} gap={10} className={"options-wrapper"} wrap={"wrap"}>
                            <Flex gap={0} wrap={"wrap"}>
                                <TodayButton
                                    title={locale === "en" ? "Today" : "امروز"}
                                    onClick={() => {
                                        onChange(getTodayBasedOnSelectionMode(locale, selectionMode))
                                        setKey(key + 1)
                                    }}
                                />

                                {defaultValue &&
                                    <DefaultValueButton
                                        title={locale === "en" ? "Default" : "تاریخ پیشفرض"}
                                        onClick={() => {
                                            onChange(getInitialValue(selectionMode, defaultValue, delimiter))
                                            setKey(key + 1)
                                        }}
                                    />
                                }
                            </Flex>

                            <Flex gap={10} wrap={"wrap"}>
                                <EraseButton
                                    title={locale === "en" ? "Erase" : "پاک کردن"}
                                    onClick={() => {
                                        onChange(getEmptyValueBasedOnSelectionMode(selectionMode))
                                        setKey(key + 1)
                                    }}
                                />

                                <SubmitButton
                                    title={locale === "en" ? "Submit" : "تایید"}
                                    onClick={() => setOpen(false)}
                                />
                            </Flex>
                        </Flex>

                        {props.renderFooter && props.renderFooter()}
                    </>
                )}
            />
        </div>
    )

    const getPopover = (children) => (
        <Popover
            open={open}
            trigger={trigger}
            placement={placement}
            content={getCalendar()}
            overlayInnerStyle={{padding: 0}}
            onOpenChange={(visible) => setOpen(visible)}
            destroyTooltipOnHide
        >
            {children}
        </Popover>
    )

    const getClosedViewElement = () => {
        let placeholderText = getPlaceholder(value, locale, placeholder, delimiter)
        let textClosedView =
            <Typography.Link
                className={closedViewClassName}
                {...closedViewProps}
            >
                {placeholderText}
            </Typography.Link>

        switch (closedView) {
            case "text":
                return {
                    element: textClosedView,
                    insidePopover: true
                }
            case "input":
                return {
                    element: <DatepickerInput
                        className={closedViewClassName}
                        placeholder={placeholderText}
                        delimiter={delimiter}
                        selectionMode={selectionMode}
                        locale={locale}
                        onChange={onChange}
                        setOpen={setOpen}
                        getPopover={getPopover}
                        {...closedViewProps}
                    />,
                    insidePopover: false
                }
            case "button":
                return {
                    element: <Button
                        className={closedViewClassName}
                        {...closedViewProps}
                    >
                        {placeholderText}
                    </Button>,
                    insidePopover: true
                }
            default:
                return {
                    element: textClosedView,
                    insidePopover: true
                }
        }
    }

    return (
        <ConfigProvider
            direction={locale === "fa" ? "rtl" : "ltr"}
            theme={{
                algorithm: darkMode ? darkAlgorithm : defaultAlgorithm,
                token: {
                    colorPrimary: colorPrimary,
                }
            }}
        >
            <div className={darkMode ? "calendar-dark" : ""}>
                {
                    alwaysOpen ? (
                        <>
                            {getCalendar()}
                        </>
                    ) : (
                        getClosedViewElement().insidePopover ? (
                            getPopover(getClosedViewElement().element)
                        ) : (
                            getClosedViewElement().element
                        )
                    )
                }
            </div>
        </ConfigProvider>
    )
}
