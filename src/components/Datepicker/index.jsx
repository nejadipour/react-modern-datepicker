import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import "./index.css";
import React, {useState} from 'react';
import {Calendar} from "@hassanmojab/react-modern-calendar-datepicker";
import {Button, ConfigProvider, Flex, Input, Popover, theme, Tooltip, Typography} from "antd";
import {
    getPlaceholder,
    getInitialValue,
    notSelectedCheck,
    selectedValueToString,
    getTodayBasedOnSelectionMode, getEmptyValueBasedOnSelectionMode
} from "./utils.js";


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

    const getClosedViewElement = () => {
        let placeholderText = getPlaceholder(value, locale, placeholder, delimiter)
        let textClosedView = <Typography.Link className={closedViewClassName}>{placeholderText}</Typography.Link>

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
        <div key={key} className={darkMode ? "calendar-dark" : ""}>
            <Calendar
                colorPrimary={colorPrimary}
                colorPrimaryLight={colorPrimaryLight}
                locale={locale}
                value={value}
                {...props}
                onChange={onChange}
                renderFooter={() => (
                    <Flex justify={"space-between"} gap={10} className={"options-wrapper"} wrap={"wrap"}>
                        <Flex gap={0} wrap={"wrap"}>
                            <Tooltip
                                overlayStyle={{fontSize: 12}} arrow={false} placement={"bottom"}
                                title={locale === "en" ? "Today" : "امروز"}
                            >
                                <Button
                                    shape={"circle"} className={"options-button"} type={"text"}
                                    onClick={() => {
                                        onChange(getTodayBasedOnSelectionMode(locale, selectionMode))
                                        setKey(key + 1)
                                    }}
                                >
                                    <span className={"icon-button today-button"}/>
                                </Button>
                            </Tooltip>

                            {defaultValue &&
                                <Tooltip
                                    overlayStyle={{fontSize: 12}} arrow={false} placement={"bottom"}
                                    title={locale === "en" ? "Default" : "تاریخ پیشفرض"}
                                >
                                    <Button
                                        shape={"circle"} className={"options-button"} type={"text"}
                                        onClick={() => onChange(getInitialValue(selectionMode, defaultValue, delimiter))}
                                    >
                                        <span className={"icon-button default-day-button"}/>
                                    </Button>
                                </Tooltip>
                            }
                        </Flex>

                        <Flex gap={10} wrap={"wrap"}>
                            <Button
                                className={"options-button"}
                                onClick={() => onChange(getEmptyValueBasedOnSelectionMode(selectionMode))}
                            >
                                {locale === "en" ? "Erase" : "پاک کردن"}
                            </Button>

                            <Button
                                type={"primary"} className={"options-button"}
                                onClick={() => setOpen(false)}
                            >
                                {locale === "en" ? "Submit" : "تایید"}
                            </Button>
                        </Flex>
                    </Flex>
                )}
            />
        </div>
    )

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
            {
                alwaysOpen ? (
                    <>
                        {getCalendar()}
                    </>
                ) : (
                    <Popover
                        open={open}
                        trigger={trigger}
                        placement={placement}
                        content={getCalendar()}
                        overlayInnerStyle={{padding: 0}}
                        onOpenChange={(visible) => setOpen(visible)}
                        destroyTooltipOnHide
                    >
                        {getClosedViewElement()}
                    </Popover>
                )
            }
        </ConfigProvider>
    )
}
