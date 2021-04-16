import { Grid, MenuItem, Select, TextField, withStyles, FormControl, FormHelperText, InputLabel } from "@material-ui/core";
import React from "react";
import CommanderMenu from "../../GeneralComponent/admin/CommanderMenu";
import MenuAppBar from "../../GeneralComponent/main/MenuAppBar";
import { getUserInfoByJWT } from "../../HelperJS/extract_info";
import { Major } from "../../HelperJS/Major";


const useStyles = (theme) => ({
    root: {
        flexGrow: 1,
    },
    padding: {
        flexGrow: 1,
        marginLeft: theme.spacing(2),
    },
    padding2: {
        flexGrow: 1,
        marginLeft: theme.spacing(36),
        marginTop: theme.spacing(7),
    },
    button: {
        marginLeft: theme.spacing(50),
        marginTop: theme.spacing(2),
    },
    myFont: {
        fontFamily: "Comic Sans MS, Comic Sans, cursive", 
    }
});

class CourseFilesMainView extends React.Component {

    constructor(props) {
        super(props);
        this.handleMajorChange = this.handleMajorChange.bind(this);
        this.majors = undefined;

        this.state = {
            updated: false,
            chosenMajor: undefined,
        };
    }

    handleMajorChange(event) {
        this.setState({
            major: event.target.value
        });
    }

    componentDidMount() {
        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {
                
                // Retrieve the user info.
                user = user.data;
                this.majors = user["major"];
                this.setState({
                    updated: true
                });
            }
        });
    }

    render() {
        const { classes } = this.props;

        // When we retrieved the current user's majors.
        if (this.state.updated) {
            return (
                <Grid container>
                    <MenuAppBar
                    menu={
                        <CommanderMenu />
                    }
                    content={
                        <Grid container spacing={2} justify="flex-start" className={classes.padding}>
                            <h1 className={classes.myFont}> hi there </h1>
                            <Grid item xs={12}>

                            <FormControl className={classes.formControl} style={{minWidth: 200}}>
                                <InputLabel htmlFor="age-native-simple">Choose Major</InputLabel>
                                <Select
                                native
                                value={undefined}
                                onChange={this.handleMajorChange}
                                >
                                <option aria-label="None" value="None" />
                                {(this.majors.includes(Major.Software)) ? 
                                    <option value={Major.Software}>Software</option> : ''
                                }
                                {(this.majors.includes(Major.Reserach)) ? 
                                    <option value={Major.Reserach}>Research</option> : ''
                                }
                                {(this.majors.includes(Major.Firmware)) ? 
                                    <option value={Major.Firmware}>Firmware</option> : ''
                                }
                                {(this.majors.includes(Major.Validation)) ? 
                                    <option value={Major.Validation}>Validation</option> : ''
                                }
                                {(this.majors.includes(Major.Network)) ? 
                                    <option value={Major.Network}>Network</option> : ''
                                }
                                </Select>
                            </FormControl>
                            
                            </Grid>
                        </Grid>
                    }>
                    </MenuAppBar>
                </Grid>
            );
        } else {
            return (
                <MenuAppBar
                    menu={
                        <CommanderMenu />
                    }>   
                </MenuAppBar>
            );
        }
    }
}

export default withStyles(useStyles, { withTheme: true })(CourseFilesMainView); 