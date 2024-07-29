import {utils} from "@hassanmojab/react-modern-calendar-datepicker";
import moment from "moment-jalaali";

export const getCalendarClassName = (darkMode, disabled) => {
    let className = ""
    if (darkMode) {
        className = `${className} calendar-dark`
    }
    if (disabled) {
        className = `${className} calendar-disabled`
    }
    return className;
}

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
    return day ? `${day.year}${delimiter}${day.month < 10 ? `0${day.month}` : day.month}${delimiter}${day.day < 10 ? `0${day.day}` : day.day}` : ""
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
    if (value && Object.keys(value)?.includes("from") && Object.keys(value).includes("to")) {
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

export const getInputPlaceHolder = (placeholder, locale, selectionMode, delimiter) => {
    let enDateFormat = `YYYY${delimiter}MM${delimiter}DD`
    let faDateFormat = `سال${delimiter}ماه${delimiter}روز`

    if (placeholder) {
        return placeholder;
    }

    switch (selectionMode) {
        case "single":
            return locale === "en" ? `select or type in ${enDateFormat} format` : `تاریخ را به فرمت ${faDateFormat} وارد کنید یا از تقویم انتخاب کنید`
        case "range":
            return locale === "en" ? "select from the calendar" : "از تقویم بازه زمانی را انتخاب کنید"
        case "multiple":
            return locale === "en" ? " from the calendar" : "از تقویم چندین تاریخ را انتخاب کنید"
        default:
            return locale === "en" ? `select or type in ${enDateFormat} format` : `تاریخ را به فرمت ${faDateFormat} وارد کنید یا از تقویم انتخاب کنید`
    }
}

const parseDate = (date, delimiter) => {
    let parsedDate;
    if (typeof date === "string") {
        let dateSplit = date.split(delimiter)
        parsedDate = {
            year: parseInt(dateSplit[0]),
            month: parseInt(dateSplit[1]),
            day: parseInt(dateSplit[2]),
        }
    } else {
        parsedDate = date;
    }
    return parsedDate;
}

export const getMinMaxDate = (locale, minimumDate, maximumDate, delimiter, maximumToday, maximumTomorrow, minimumToday, minimumTomorrow) => {
    let calculatedMinimumDate = null
    let calculatedMaximumDate = null

    if (minimumDate) {
        calculatedMinimumDate = parseDate(minimumDate, delimiter)
    }
    if (maximumDate) {
        calculatedMaximumDate = parseDate(maximumDate, delimiter)
    }

    if (minimumToday) {
        calculatedMinimumDate = utils(locale).getToday();
    }
    if (maximumToday) {
        calculatedMaximumDate = utils(locale).getToday();
    }
    if (minimumTomorrow || maximumTomorrow) {
        let tomorrowObject = moment().add(1, 'day');
        let tomorrowDate = {
            year: locale === "en" ? tomorrowObject.year() : tomorrowObject.jYear(),
            month: locale === "en" ? tomorrowObject.month() + 1 : tomorrowObject.jMonth() + 1,
            day: locale === "en" ? tomorrowObject.date() : tomorrowObject.jDate(),
        }
        if (minimumTomorrow) {
            calculatedMinimumDate = tomorrowDate;
        }
        if (maximumTomorrow) {
            calculatedMaximumDate = tomorrowDate;
        }
    }

    return {
        minimumDate: calculatedMinimumDate,
        maximumDate: calculatedMaximumDate
    }
}
