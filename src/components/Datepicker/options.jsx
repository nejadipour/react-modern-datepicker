import {Button, Tooltip} from "antd";

export const TodayButton = ({title, tooltipProps, ...props}) => (
    <Tooltip
        overlayStyle={{fontSize: 12}}
        arrow={false}
        placement={"bottom"}
        {...tooltipProps}
        title={title}
    >
        <Button
            shape={"circle"} className={"options-button"} type={"text"}
            {...props}
        >
            <span className={"icon-button today-button"}/>
        </Button>
    </Tooltip>
)

export const DefaultValueButton = ({title, tooltipProps, ...props}) => (
    <Tooltip
        overlayStyle={{fontSize: 12}}
        arrow={false}
        placement={"bottom"}
        {...tooltipProps}
        title={title}
    >
        <Button
            shape={"circle"} className={"options-button"} type={"text"}
            {...props}
        >
            <span className={"icon-button default-day-button"}/>
        </Button>
    </Tooltip>
)

export const EraseButton = ({title, ...props}) => (
    <Button
        className={"options-button"}
        {...props}
    >
        {title}
    </Button>
)

export const SubmitButton = ({title, ...props}) => (
    <Button
        type={"primary"}
        className={"options-button"}
        {...props}
    >
        {title}
    </Button>
)
