import '@hassanmojab/react-modern-calendar-datepicker/lib/DatePicker.css';
import "./index.css";
import {useState, useEffect} from 'react';
import {Calendar} from "@hassanmojab/react-modern-calendar-datepicker";
import {Button, ConfigProvider, Flex, Popover, theme, Typography} from "antd";
import {
    getPlaceholder,
    getInitialValue,
    selectedValueToString,
    getTodayBasedOnSelectionMode, getEmptyValueBasedOnSelectionMode, getMinMaxDate, getCalendarClassName
} from "./utils.js";
import {DefaultValueButton, EraseButton, SubmitButton, TodayButton} from "./options.jsx";
import DatepickerInput from "./Input.jsx";
import PropTypes from 'prop-types';


export default function Datepicker(
    {
        alwaysOpen = false,
        arrow = true,
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
        onRenderReady,
        placeholder = locale === "en" ? "select" : "انتخاب",
        placement = "bottom",
        popover = true,
        renderInput = null,
        returnType = "object",
        selectionMode = "single",
        showIcon = true,
        tooltipProps,
        trigger = "click",
        value: passedValue = null,
        ...props
    }) {
    const {defaultAlgorithm, darkAlgorithm} = theme;
    const [value, setValue] = useState(getInitialValue(selectionMode, passedValue || defaultValue, delimiter));
    const [open, setOpen] = useState(false);
    const [key, setKey] = useState(0);
    const [calendarReplaced, setCalendarReplaced] = useState(false);

    const onChange = (calendarValue) => {
        setValue(calendarValue);
        let returnValue = calendarValue
        if (calendarValue && returnType === "string") {
            returnValue = selectedValueToString(returnValue, delimiter)
        }
        if (props.onChange) props.onChange(returnValue)
    }

    useEffect(() => {
        const newValue = getInitialValue(selectionMode, passedValue, delimiter);
        if (newValue !== value)
            setValue(newValue);
    }, [passedValue]);

    const getCalendar = () => (
        <div key={key} className={getCalendarClassName(darkMode, disabled)}>
            <Calendar
                colorPrimary={colorPrimary}
                colorPrimaryLight={colorPrimaryLight}
                locale={locale}
                value={value}
                {...props}
                {...getMinMaxDate(locale, minimumDate, maximumDate, delimiter, maximumToday, maximumTomorrow, minimumToday, minimumTomorrow)}
                onChange={onChange}
                renderFooter={() => (
                    <>
                        <Flex justify={"space-between"} gap={10} className={"options-wrapper"} wrap={"wrap"}>
                            <Flex gap={0} wrap={"wrap"}>
                                <TodayButton
                                    title={locale === "en" ? "Today" : "امروز"}
                                    tooltipProps={tooltipProps}
                                    onClick={() => {
                                        onChange(getTodayBasedOnSelectionMode(locale, selectionMode))
                                        setKey(key + 1)
                                    }}
                                    disabled={disabled}
                                />

                                {defaultValue &&
                                    <DefaultValueButton
                                        title={locale === "en" ? "Default" : "تاریخ پیشفرض"}
                                        tooltipProps={tooltipProps}
                                        onClick={() => {
                                            onChange(getInitialValue(selectionMode, defaultValue, delimiter))
                                            setKey(key + 1)
                                        }}
                                        disabled={disabled}
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
                                    disabled={disabled}
                                />

                                <SubmitButton
                                    title={locale === "en" ? "Submit" : "تایید"}
                                    onClick={() => {
                                        setOpen(false)
                                        setCalendarReplaced(false)
                                        if (onRenderReady) onRenderReady()
                                    }}
                                    disabled={disabled}
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
            arrow={arrow}
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
                disabled={disabled}
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
                        renderInput={renderInput}
                        showIcon={showIcon}
                        className={closedViewClassName}
                        placeholder={placeholderText}
                        delimiter={delimiter}
                        selectionMode={selectionMode}
                        locale={locale}
                        onChange={onChange}
                        setOpen={setOpen}
                        getPopover={getPopover}
                        disabled={disabled}
                        popover={popover}
                        value={value}
                        {...closedViewProps}
                    />,
                    insidePopover: false
                }
            case "button":
                return {
                    element: <Button
                        className={closedViewClassName}
                        {...closedViewProps}
                        disabled={disabled}
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

    const getClosedViewWithNoPopover = () => {
        let onClick = () => {
            setCalendarReplaced(true);
            if (onRenderReady) onRenderReady();
        }
        let placeholderText = getPlaceholder(value, locale, placeholder, delimiter)
        let textClosedView =
            <Typography.Link
                className={closedViewClassName}
                {...closedViewProps}
                disabled={disabled}
                onClick={onClick}
            >
                {placeholderText}
            </Typography.Link>

        switch (closedView) {
            case "text":
                return textClosedView
            case "input":
                return <DatepickerInput
                    renderInput={renderInput}
                    showIcon={showIcon}
                    className={closedViewClassName}
                    placeholder={placeholderText}
                    delimiter={delimiter}
                    selectionMode={selectionMode}
                    locale={locale}
                    onChange={onChange}
                    setOpen={setOpen}
                    getPopover={getPopover}
                    disabled={disabled}
                    popover={popover}
                    getCalendar={getCalendar}
                    calendarReplaced={calendarReplaced}
                    setCalendarReplaced={setCalendarReplaced}
                    onClick={onClick}
                    {...closedViewProps}
                />
            case "button":
                return <Button
                    className={closedViewClassName}
                    {...closedViewProps}
                    disabled={disabled}
                    onClick={onClick}
                >
                    {placeholderText}
                </Button>
            default:
                return textClosedView
        }
    }

    const getElementToRender = () => {
        let elementToRender;

        if (alwaysOpen) {
            elementToRender = getCalendar();
        } else if (!popover) {
            if (calendarReplaced) {
                elementToRender = getCalendar();
            } else {
                elementToRender = getClosedViewWithNoPopover();
            }
        } else {
            const closedViewElement = getClosedViewElement();
            if (closedViewElement.insidePopover) {
                elementToRender = getPopover(closedViewElement.element);
            } else {
                elementToRender = closedViewElement.element;
            }
        }

        return elementToRender;
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
            <div className={getCalendarClassName(darkMode, disabled)}>
                {getElementToRender()}
            </div>
        </ConfigProvider>
    )
}

Datepicker.propTypes = {
    alwaysOpen: PropTypes.bool,
    arrow: PropTypes.bool,
    closedView: PropTypes.oneOf(["text", "input", "button"]),
    closedViewClassName: PropTypes.string,
    closedViewProps: PropTypes.object,
    colorPrimary: PropTypes.string,
    colorPrimaryLight: PropTypes.string,
    darkMode: PropTypes.bool,
    delimiter: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
    disabled: PropTypes.bool,
    locale: PropTypes.oneOf(["en", "fa"]),
    maximumDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    maximumToday: PropTypes.bool,
    maximumTomorrow: PropTypes.bool,
    minimumDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    minimumToday: PropTypes.bool,
    minimumTomorrow: PropTypes.bool,
    onRenderReady: PropTypes.func,
    placeholder: PropTypes.string,
    placement: PropTypes.oneOf(['top', 'bottom', 'left', 'right', 'topLeft', 'topRight', 'bottomLeft', 'bottomRight', 'leftTop', 'leftBottom', 'rightTop', 'rightBottom']),
    popover: PropTypes.bool,
    renderInput: PropTypes.oneOf([null, PropTypes.func]),
    returnType: PropTypes.oneOf(["string", "object"]),
    selectionMode: PropTypes.oneOf(["single", "range", "multiple"]),
    showIcon: PropTypes.bool,
    tooltipProps: PropTypes.object,
    trigger: PropTypes.oneOf(["click", "hover"]),
    onChange: PropTypes.func,
    renderFooter: PropTypes.func
}
