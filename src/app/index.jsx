import Datepicker from "../components/Datepicker/index.jsx";


export default function App(datepickerProps) {
    return (
        <div style={{backgroundColor: "orange"}}>
            <Datepicker
                {...datepickerProps}
                selectionMode={"single"}
                colorPrimary={"purple"}
                // alwaysOpen
                // closedView={"input"}
                // darkMode
                // locale={"fa"}
                shouldHighlightWeekends
                defaultValue={"2022-01-01"}
                returnType={"string"}
                onChange={(value) => console.log(value)}
            />
        </div>
    )
}
