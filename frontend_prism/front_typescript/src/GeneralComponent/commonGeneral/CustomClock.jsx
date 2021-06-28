import { useEffect, useState } from 'react';
import Clock from 'react-clock';
import 'react-clock/dist/Clock.css';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    title: {
        fontFamily: "monospace",
    },
    padding: {
        marginLeft: '250px',
    }
});


export default function CustomClock() {
    const [value, setValue] = useState(new Date());
    const classes = useStyles();
    
    useEffect(() => {
        const interval = setInterval(
        () => setValue(new Date()),
        1000
        );
    
        return () => {
        clearInterval(interval);
        }
    }, []);
    
    return (
        <div className={classes.padding}>

            <h4 className={classes.title}>Current time:</h4>
            <Clock value={value} />
      
        </div>
    );
}
    