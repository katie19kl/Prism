import React from "react";
import { withStyles } from '@material-ui/core/styles';


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    padding: {
        flexGrow: 1,
        marginLeft: theme.spacing(40),
        marginTop: theme.spacing(15),
    },
});

class UpdateUsers extends React.Component {
    
    render() {
        return (
            <h1>in update</h1>
        );
    }
}

export default withStyles(useStyles, { withTheme: true })(UpdateUsers);