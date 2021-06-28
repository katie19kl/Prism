import 'react-calendar/dist/Calendar.css';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    root: {
        background: 'linear-gradient(45deg, #d1b3ff 30%, #6600ff 90%)',
        border: 0,
        borderRadius: 3,
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'black',
        fontFamily: 'monospace',
        height: 48,
        padding: '0 10px',
        marginLeft: '300px',
        marginTop: '20px'
    },
});


export default function Results() {

    // set states of calendar date
    const [calDate, setCalDate] = useState(new Date());
    const classes = useStyles();

    function onChange (calDate) {
        // change results based on calendar date click
        setCalDate(calDate);
    }

    return (
        <div className="result-calendar">
            <Calendar onChange={onChange} value={calDate} className={classes.root}/>
        </div>
    );

}