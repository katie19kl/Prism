import { withStyles, CircularProgress } from '@material-ui/core';
import React from "react"


const useStyles = (theme) => ({
    root: {
        display: 'flex',
        '& > * + *': {
          marginLeft: theme.spacing(2),
        },
    }
});


class WaiterLoading extends React.Component {

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>

    


              <CircularProgress disableShrink size={100} />
            </div>
          );
    }
}

export default withStyles(useStyles, { withTheme: true })(WaiterLoading);