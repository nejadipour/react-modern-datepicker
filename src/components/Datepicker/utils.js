import {utils} from "@hassanmojab/react-modern-calendar-datepicker";

export const notSelectedCheck = (value) => {
    return value === null || (value.to === null || value.from === null) || Array.isArray(value) && value.length === 0
}

const isValidDayObject = (day) => {
    if (!day) {
        return false
    }
    let keys = Object.keys(day)
    return keys.includes("year") && keys.includes("month") && keys.includes("day");
}

const getDayObject = (day, delimiter) => {
    if (typeof day === "string") {
        return stringToDayValue(day, delimiter)
    }
    if (isValidDayObject(day)) {
        return day
    }
    return null
}

export const dayValueToString = (day, delimiter) => {
    return day ? `${day.year}${delimiter}${day.month}${delimiter}${day.day}` : ""
}

export const stringToDayValue = (string, delimiter) => {
    if (typeof string !== "string") {
        return null
    }
    let split = string.split(delimiter)
    if (split.length !== 3) {
        return null
    }
    return {
        year: parseInt(split[0]),
        month: parseInt(split[1]),
        day: parseInt(split[2])
    }
}

export const getInitialValue = (selectionMode, defaultValue, delimiter) => {
    let value;

    switch (selectionMode) {
        case "single":
            value = null;
            if (defaultValue) {
                value = getDayObject(defaultValue, delimiter)
            }
            break;
        case "range":
            value = {from: null, to: null}
            if (defaultValue && Object.keys(defaultValue).includes("from") && Object.keys(defaultValue).includes("to")) {
                value.from = getDayObject(defaultValue.from, delimiter)
                value.to = getDayObject(defaultValue.to, delimiter)
                if (!value.from || !value.to) {
                    value = {from: null, to: null}
                }
            }
            break;
        case "multiple":
            value = []
            if (defaultValue && Array.isArray(defaultValue)) {
                defaultValue.forEach((day) => {
                    value.push(getDayObject(day, delimiter))
                })
            }
            break;
        default:
            value = null
    }

    return value;
}

export const selectedValueToString = (value, delimiter) => {
    if (Array.isArray(value)) {
        return value.map((day) => dayValueToString(day, delimiter))
    }
    if (Object.keys(value).includes("from") && Object.keys(value).includes("to")) {
        return {
            from: dayValueToString(value.from, delimiter),
            to: dayValueToString(value.to, delimiter)
        }
    }
    return dayValueToString(value, delimiter)
}

export const getPlaceholder = (value, locale, placeholder, delimiter) => {
    if (notSelectedCheck(value)) {
        return placeholder ? placeholder : locale === "en" ? "select" : "انتخاب"
    }
    if (Array.isArray(value)) {
        return `${value.length} ${locale === "en" ? "selected" : "تاریخ انتخاب شده"}`
    } else {
        let stringValue = selectedValueToString(value, delimiter)
        if (stringValue.from && stringValue.to) {
            return `${stringValue.from} ${locale === "en" ? "to" : "تا"} ${stringValue.to}`
        }
        return stringValue
    }
}

export const getTodayBasedOnSelectionMode = (locale, selectionMode) => {
    let today = utils(locale).getToday()
    switch (selectionMode) {
        case "single":
            return today
        case "range":
            return {from: today, to: null}
        case "multiple":
            return [today]
        default:
            return today
    }
}

export const getEmptyValueBasedOnSelectionMode = (selectionMode) => {
    switch (selectionMode) {
        case "single":
            return null
        case "range":
            return {from: null, to: null}
        case "multiple":
            return []
        default:
            return null
    }
}
