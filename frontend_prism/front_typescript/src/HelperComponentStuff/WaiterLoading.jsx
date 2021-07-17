import { withStyles, CircularProgress, Grid } from '@material-ui/core';
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
                
                <Grid container justify='center' alignItems='center' style={{ minHeight: '70vh' }}>
                    <CircularProgress disableShrink size={70} />
                </Grid>
            </div>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(WaiterLoading);