import Datepicker from "../components/Datepicker/index.jsx";


export default function App(datepickerProps) {
    return (
        <div style={{backgroundColor: "orange"}}>
            <Datepicker
                {...datepickerProps}
                selectionMode={"range"}
                closedView={"button"}
                darkMode
                shouldHighlightWeekends
                defaultValue={{from:"2022-01-01", to: "2022-01-05"}}
                returnType={"string"}
                onChange={(value) => console.log(value)}
            />
        </div>
    )
}
