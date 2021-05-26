
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, TableCell, TableHead, TableRow, Typography } from "@material-ui/core"
import React from "react"
import TableStatus from "./TableStatus"
import { Paper, Table, TableContainer, withStyles } from "@material-ui/core"
import { Major } from "../../HelperJS/Major";
import { getUserInfoByJWT } from "../../HelperJS/extract_info";
import { getModulesByMajor } from "../../adminOperationSideBar/CourseFiles/files_request_handler"


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
        marginBottom: theme.spacing(3)

    }


});

class TableStatusFrame extends React.Component {


    constructor(props) {
        super(props);

        this.majorSelector = this.majorSelector.bind(this)
        this.moduleSelector = this.moduleSelector.bind(this)
        this.handleMySoldiers = this.handleMySoldiers.bind(this)

        this.selectedMajor = undefined
        this.selectedModule = undefined
        
        //this.checkBoxClicked = false


        this.state = {
            majors: [],
            modules: [],
            displayTable: false,
            checkBoxClicked: false
            
        }
    }

    handleMySoldiers(event){
        //console.log(event.target.checked)
        //this.checkBoxClicked = event.target.checked
        this.setState({checkBoxClicked:event.target.checked})
    }

    majorSelector(event) {
        this.selectedMajor = event.target.value

        if (this.selectedMajor != "None") {

            //console.log(this.selectedMajor)

            getModulesByMajor(this.selectedMajor).then((response) => {
                if (response !== undefined) {
              //      console.log(response.data)
                    let modules_ = response.data
                    this.setState({ modules: modules_ })
                }
            })

        }
        // remove selection from module
        this.setState({modules: [],displayTable: false,checkBoxClicked:false} )
    }

    moduleSelector(event) {
        this.selectedModule = event.target.value

        if (this.selectedModule != "None") {
            //console.log(this.selectedModule + " -- selected module")
            this.setState({ displayTable: true })
        }

        else {
            this.setState({ displayTable: false })
        }
    }


    componentDidMount() {

        getUserInfoByJWT().then((user) => {

            if (user !== undefined) {

                // Retrieve the user info.
                user = user.data;
                if (user !== undefined) {
                    let majors_ = user["major"];


                    this.setState({
                        majors: majors_
                    });
                }
            }
        });
    }


    render() {
        //console.log("OUT")
        let modules = this.state.modules
        let classes = this.props.classes

        //console.log(this.state.displayTable)
        //console.log(this.selectedMajor)
        //console.log(this.selectedModule)


        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                <TableContainer className={classes.container} component={Paper}

                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: '95%'
                    }}
                >


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

                                <TableCell>


                                    <Typography>
                                        Select module
                                                    </Typography>


                                    <FormControl style={{ minWidth: 200 }}>
                                        <Select
                                            native
                                            disabled={this.selectedMajor === undefined || this.selectedMajor === "None"}
                                            value={undefined}
                                            onChange={this.moduleSelector}
                                        >
                                            <option aria-label="None" value="None" />
                                            {modules.map((module_, index) => (

                                                <option key={index} value={module_}>{module_}</option>

                                            ))}





                                        </Select>
                                    </FormControl>



                                </TableCell>


                            </TableRow>
                        </TableHead>
                    </Table>


                    {this.state.displayTable &&
                        <TableStatus
                            selectedMajor={this.selectedMajor}
                            selectedModule={this.selectedModule}
                            mySoldiers={this.state.checkBoxClicked}
                        >

                        </TableStatus>
                    }


                </TableContainer>



            </div>


        )


    }

}

export default withStyles(useStyles, { withTheme: true })(TableStatusFrame)
/*
<TableCell>
                    <Typography>
                            Select major
                    </Typography>

                    <Select
                        labelId="demo-simple-select-disabled-label"
                        id="demo-simple-select-disabled"
                        >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"MAJOR-1"}>MAJOR-1</MenuItem>
                        <MenuItem value={"MAJOR-2"}>MAJOR-2</MenuItem>
                        <MenuItem value={"MAJOR-3"}>MAJOR-3</MenuItem>
                    </Select>
                </TableCell>


                <TableCell>
                        <Typography>
                            Select module
                        </Typography>

                        <Select
                            labelId="demo-simple-select-disabled-label"
                            id="demo-simple-select-disabled"
                            >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={"Module-1"}>Module-1</MenuItem>
                            <MenuItem value={"Module-2"}>Module-2</MenuItem>
                            <MenuItem value={"Module-3"}>Module-3</MenuItem>
                        </Select>



                </TableCell>

*/