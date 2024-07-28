import {Input, Button, Space} from "antd";
import {getInputPlaceHolder, selectedValueToString} from "./utils.js";
import {digitsFaToEn} from "@persian-tools/persian-tools";
import {useEffect, useState} from "react";

export default function DatepickerInput(
    {
        placeholder,
        delimiter,
        selectionMode,
        locale,
        setOpen,
        onChange,
        getPopover,
        getCalendar,
        popover,
        calendarReplaced,
        setCalendarReplaced,
        onClick,
        value,
        renderInput,
        showIcon,
        ...props
    }) {
    const [inputValue, setInputValue] = useState(null);

    const changeHandler = (e) => {
        if (selectionMode !== "single") {
            setOpen(true);
        } else {
            setInputValue(e.target.value);
            let splitValue = e.target.value.split(delimiter);

            if (splitValue.length === 3) {
                let year = splitValue[0];
                let month = splitValue[1];
                let day = splitValue[2];

                if (year.length === 4 && (1 <= month.length <= 2) && (1 <= day.length <= 2)) {
                    year = digitsFaToEn(year);
                    month = digitsFaToEn(month);
                    day = digitsFaToEn(day);

                    year = parseInt(year);
                    month = parseInt(month);
                    day = parseInt(day);

                    if (year && month && day && month <= 12 && day <= 31) {
                        let date = {year, month, day};
                        onChange(date);
                    }
                }
            } else {
                if (e.target.value === "") {
                    onChange(null);
                }
            }
        }
    }

    useEffect(() => {
        let strValue = value;
        if (typeof value === "object") {
            strValue = selectedValueToString(value, delimiter);
        }
        if (strValue !== inputValue) {
            setInputValue(strValue);
        }
    }, [value])

    const getButtonWithNoPopover = () => (
        <Button onClick={onClick}>
            <span className={"icon-button calendar-icon"}/>
        </Button>
    )

    return (
        <>
            {calendarReplaced ? getCalendar() :
                <Space.Compact>
                    {showIcon ?
                        <>
                            {!popover ? getButtonWithNoPopover() :
                                getPopover(
                                    <Button>
                                        <span className={"icon-button calendar-icon"}/>
                                    </Button>
                                )
                            }
                            <Input
                                placeholder={getInputPlaceHolder(placeholder, locale, selectionMode, delimiter)}
                                value={inputValue}
                                onChange={changeHandler}
                            />
                        </> :
                        getPopover(
                            <Input
                                placeholder={getInputPlaceHolder(placeholder, locale, selectionMode, delimiter)}
                                value={inputValue}
                                onChange={changeHandler}
                            />
                        )
                    }
                </Space.Compact>
            }
        </>
    )
}
