import React from "react";
import {Button, Tooltip} from "antd";

export const TodayButton = ({title, onClick}) => (
    <Tooltip
        overlayStyle={{fontSize: 12}} arrow={false} placement={"bottom"}
        title={title}
    >
        <Button
            shape={"circle"} className={"options-button"} type={"text"}
            onClick={onClick}
        >
            <span className={"icon-button today-button"}/>
        </Button>
    </Tooltip>
)

export const DefaultValueButton = ({title, onClick}) => (
    <Tooltip
        overlayStyle={{fontSize: 12}} arrow={false} placement={"bottom"}
        title={title}
    >
        <Button
            shape={"circle"} className={"options-button"} type={"text"}
            onClick={onClick}
        >
            <span className={"icon-button default-day-button"}/>
        </Button>
    </Tooltip>
)

export const EraseButton = ({title, onClick}) => (
    <Button
        className={"options-button"}
        onClick={onClick}
    >
        {title}
    </Button>
)

export const SubmitButton = ({title, onClick}) => (
    <Button
        type={"primary"}
        className={"options-button"}
        onClick={onClick}
    >
        {title}
    </Button>
)
