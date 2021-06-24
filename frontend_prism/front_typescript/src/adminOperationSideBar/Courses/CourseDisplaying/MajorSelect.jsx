import { FormControl, InputLabel, Select, withStyles, Grid } from "@material-ui/core";
import React from "react"
import { Major } from "../../../HelperJS/Major";


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
});



class MajorSelect extends React.Component {

    constructor(props) {
        super(props);
        this.handler = this.props.handleMajorChange;

        // majors  - props we receive from the parent component.
        //           it is a list of the current commander's majors.
        this.state = {
            majors: this.props.majors
        }
    }

    componentDidUpdate() {
        if (this.props.majors !== this.state.majors) {

            this.setState({
                majors: this.props.majors
            });
        }

    }

	render() {

        // classes - for styling
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid item xs={12}>
                    <br/>
                    <br/>

                    <FormControl style={{ minWidth: 200 }}>
                        <InputLabel htmlFor="age-native-simple">Choose Major</InputLabel>
                        <Select
                        native
                        value={undefined}
                        onChange={this.handler}
                        >
                        <option aria-label="None" value="None" />
                        {(this.state.majors.includes(Major.Software)) ? 
                            <option value={Major.Software}>Software</option> : ''
                        }
                        {(this.state.majors.includes(Major.Reserach)) ? 
                            <option value={Major.Reserach}>Research</option> : ''
                        }
                        {(this.state.majors.includes(Major.Firmware)) ? 
                            <option value={Major.Firmware}>Firmware</option> : ''
                        }
                        {(this.state.majors.includes(Major.Validation)) ? 
                            <option value={Major.Validation}>Validation</option> : ''
                        }
                        </Select>
                    </FormControl>
                </Grid>     
            </div>
        );
    }
}
	
export default withStyles(useStyles, { withTheme: true })(MajorSelect);