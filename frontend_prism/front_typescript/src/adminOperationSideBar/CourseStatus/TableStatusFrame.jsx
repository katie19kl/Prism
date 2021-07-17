import { Checkbox, FormControl, FormControlLabel, Select, TableCell, TableHead, TableRow, Typography } from "@material-ui/core"
import React from "react"
import TableStatus from "./TableStatus"
import { Paper, Table, TableContainer, withStyles } from "@material-ui/core"
import { Major } from "../../HelperJS/Major";
import { getUserInfoByJWT } from "../../HelperJS/extract_info";
import { getModulesByMajor } from "../../adminOperationSideBar/CourseFiles/files_request_handler"
import Role from "../../Roles/Role";


//	boxShadow: "5px 2px 5px grey" for row
const useStyles = (theme) => ({

    wrapper: {
        overflowY: "hidden",
        display: "flex",
    },

    container: {
        overflowX: "scroll",
        height: "89vh",
        //height:"100%",
        borderStyle: "solid"
        },
    padding: {
        marginLeft: theme.spacing(30),
        marginBottom: theme.spacing(3),
    }
});


class TableStatusFrame extends React.Component {


    constructor(props) {
        super(props);

        this.majorSelector = this.majorSelector.bind(this);
        this.moduleSelector = this.moduleSelector.bind(this);
        this.handleMySoldiers = this.handleMySoldiers.bind(this);
        this.handleEdittingMode = this.handleEdittingMode.bind(this);

        this.selectedMajor = undefined;
        this.selectedModule = undefined;
        this.myRole = undefined;
        
        this.state = {
            majors: [],
            modules: undefined,
            displayTable: false,
            checkBoxClicked: false,
            displayEditMode: false
        };
    }

    handleEdittingMode(event) {
        
        this.setState({displayEditMode:event.target.checked});
    }

    handleMySoldiers(event){
       
        this.setState({checkBoxClicked:event.target.checked});
    }

    majorSelector(event) {
        this.selectedMajor = event.target.value
        if (this.selectedMajor !== "None") {

            getModulesByMajor(this.selectedMajor).then((response) => {
                if (response !== undefined) {
                    let modules_ = response.data;
                    this.setState({ modules: modules_ });
                }
            });

        }
        // remove selection from module
        this.setState({modules: undefined ,displayTable: false,checkBoxClicked:false});
    }

    moduleSelector(event) {
        this.selectedModule = event.target.value;

        if (this.selectedModule !== "None") {
            this.setState({ displayTable: true });
        }
        else {
            this.setState({ displayTable: false });
        }
    }

    componentDidMount() {

        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {

                // Retrieve the user info.
                user = user.data;
                if (user !== undefined) {
                    let majors_ = user["major"];
                    this.myRole = user["role"];

                    this.setState({
                        majors: majors_
                    });
                }
            }
        });
    }


    render() {
        let modules = this.state.modules;
        let classes = this.props.classes;

        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                <TableContainer className={classes.container} component={Paper}

                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: '95%'
                    }}>

                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>

                                    <Typography>
                                        Select Major
                                    </Typography>

                                    <FormControl style={{ minWidth: 200 }}>
                                        <Select
                                            native
                                            value={undefined}
                                            onChange={this.majorSelector}
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

                                </TableCell>

                                {(this.myRole === Role.Commander || this.myRole === Role.Admin) ?
                                <TableCell>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.checkBoxClicked}
                                                onChange={this.handleMySoldiers}
                                                name="checkedB"
                                                color="primary"
                                                disabled={this.selectedMajor === undefined || this.selectedMajor === "None"}
                                            
                                            />
                                        }
                                        label="My Soldiers"
                                    />
                                </TableCell>
                                : ''}

                                <TableCell>

                                    <Typography>
                                        Select module
                                    </Typography>

                                    <FormControl style={{ minWidth: 200 }}>
                                        <Select
                                        native
                                        disabled={this.selectedMajor === undefined || this.selectedMajor === "None"}
                                        value={undefined}
                                        onChange={this.moduleSelector}>
                                                
                                            <option aria-label="None" value="None" />
                                            {modules !== undefined && modules.map((module_, index) => (

                                                <option key={index} value={module_}>{module_}</option>

                                            ))}

                                        </Select>
                                    </FormControl>

                                </TableCell>
                                
                                {(this.myRole === Role.Commander || this.myRole === Role.Admin) ?
                                <TableCell>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={this.state.displayEditMode}
                                                onChange={this.handleEdittingMode}
                                                name="checkedB"
                                                color="primary"
                                                disabled={
                                                    (this.selectedMajor === undefined || this.selectedMajor === "None")
                                                    || (this.selectedModule === undefined || this.selectedModule === "None")
                                                }
                                            
                                            />
                                        }
                                        label="Edit Mode"
                                    />
                                </TableCell>
                                : ''}

                            </TableRow>
                        </TableHead>
                    </Table>

                    {this.state.displayTable &&
                        <TableStatus
                        selectedMajor={this.selectedMajor}
                        selectedModule={this.selectedModule}
                        mySoldiers={this.state.checkBoxClicked}
                        editMode={this.state.displayEditMode}
                        role={this.myRole}>
                        </TableStatus>
                    }

                </TableContainer>

            </div>

        );
    }
}

export default withStyles(useStyles, { withTheme: true })(TableStatusFrame)
