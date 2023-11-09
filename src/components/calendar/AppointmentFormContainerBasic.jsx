import React from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  Switch,
  Menu,
  MenuItem,
} from "@mui/material";
import LocationOn from "@mui/icons-material/LocationOn";
import Notes from "@mui/icons-material/Notes";
import CalendarToday from "@mui/icons-material/CalendarToday";
import Create from "@mui/icons-material/Create";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Skypeicon } from "./svgicon";
import moment from "moment";
import LanguageIcon from "@mui/icons-material/Language";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import RepeatIcon from "@mui/icons-material/Repeat";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Close from "@mui/icons-material/Close";
import { Editor } from "@tinymce/tinymce-react";
import "react-quill/dist/quill.snow.css";
import "moment-timezone";
import CircleIcon from "@mui/icons-material/Circle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import Avatar from "@mui/material/Avatar";
import { fetchContactsData } from "../../actions/contacts";
import { connect } from "react-redux";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import TagFacesIcon from "@mui/icons-material/TagFaces";

const PREFIX = "Demo";
const classes = {
  content: `${PREFIX}-content`,
  header: `${PREFIX}-header`,
  closeButton: `${PREFIX}-closeButton`,
  buttonGroup: `${PREFIX}-buttonGroup`,
  button: `${PREFIX}-button`,
  picker: `${PREFIX}-picker`,
  wrapper: `${PREFIX}-wrapper`,
  icon: `${PREFIX}-icon`,
  textField: `${PREFIX}-textField`,
  addButton: `${PREFIX}-addButton`,
  circleFilled: `${PREFIX}-circleFilled`,
  dropdown: `${PREFIX}-dropdown`,
  flexRow: `${PREFIX}-flexRow`,
  customSelect: `${PREFIX}-customSelect`,
  attachmentDropdown: `${PREFIX}-attachmentDropdown`,
  attachmentDropdownlist: `${PREFIX}-attachmentDropdownlist`,
};

let pickerSize = false;
const StyledDiv = styled("div")(({ theme }) => ({
  [`& .${classes.icon}`]: {
    marginRight: theme.spacing(2),
  },
  [`& .${classes.header}`]: {
    overflow: "hidden",
    paddingTop: theme.spacing(0.5),
  },
  [`& .${classes.textField}`]: {
    width: "100%",
  },
  [`& .${classes.content}`]: {
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  [`& .${classes.picker}`]: {
    width: pickerSize ? "400px" : "200px",
  },
  [`& .${classes.wrapper}`]: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  [`& .${classes.buttonGroup}`]: {
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 2),
  },
  [`& .${classes.button}`]: {
    marginRight: "30px",
  },
  [`& .${classes.flexRow}`]: {
    display: "flex",
    marginTop: theme.spacing(2),
    gap: "14px",
  },
  [`& .${classes.circleFilled}`]: {
    background: "#1976D2",
    height: "15px",
    width: "15px",
    borderRadius: "100px",
  },
  [`& .${classes.dropdown}`]: {
    position: "absolute",
  },
  [`& .${classes.customSelect}`]: {
    border: "none",
    backgroundColor: "transparent",
    padding: "10px 5px",
    fontSize: "17px",
    cursor: "pointer",
    outline: "none",
    fontWeight: "500",
    color:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
  },
  [`& .${classes.attachmentDropdown}`]: {
    position: "absolute",
    background: "white",
    listStyle: "none",
    border: "2px solid rgba(0, 0, 0, 0.04)",
    borderRadius: "3px",
    marginTop: "-240px",
    padding: "10px",
    zIndex: 1000,
  },
  [`& .${classes.attachmentDropdownlist}`]: {
    marginTop: "10px",
    display: "flex",
    gap: "10px",
    cursor: "pointer",
    "&:hover": {
      background: "rgba(0, 0, 0, 0.04)",
    },
    padding: "10px 10px",
  },
}));

const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 38,
  height: 20,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: 2,
    "&.Mui-checked": {
      transform: "translateX(20px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" && "#177ddc",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 15,
    height: 15,
    borderRadius: 6,
    transition: theme.transitions.create(["width"], {
      duration: 200,
    }),
  },
  "& .MuiSwitch-track": {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === "dark"
        ? "rgba(255,255,255,.35)"
        : "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

class AppointmentFormContainerBasic extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      appointmentChanges: {
        title: "",
        content: "",
        startDate: moment().toISOString(),
        endDate: moment().add(30, 'minutes').toISOString(),
        timeZone: moment.tz.guess(), // 
        location:"",
        attendees:[],
        isOnlineMeeting: false,
        isAllDay:false
      },
      anchorEl: null,
      selectedOption: "",
      attachment: null,
      timezones: moment.tz.names(),
      showCustomItem: true,
      selectedStartDate: null,
      gabContacts: [],
      contactData: [],
      showDropdown: false,
      skypeMeeting: true,
    };

    this.getAppointmentData = () => {
      const { appointmentData } = this.props;
      return appointmentData;
    };
    this.getAppointmentChanges = () => {
      const { appointmentChanges } = this.state;
      return appointmentChanges;
    };

    this.changeAppointment = this.changeAppointment.bind(this);
    this.commitAppointment = this.commitAppointment.bind(this);

    this.inputRef = React.createRef();
  }

  changeAppointment({ field, changes }) {
    const nextChanges = { ...this.getAppointmentChanges(), [field]: changes };
    this.setState({ appointmentChanges: nextChanges });
  }

  handleValue(field, value) {
    console.log("value", value);
    this.changeAppointment({
      field: [field],
      changes: value,
    });
  }

  commitAppointment(type) {
    const { commitChanges } = this.props;
    const appointment = {
      ...this.getAppointmentData(),
      ...this.getAppointmentChanges(),
    };
    if (type === "deleted") {
      commitChanges({ [type]: appointment.id });
    } else if (type === "changed") {
      commitChanges({ [type]: { [appointment.id]: appointment } });
    } else {
      commitChanges({ [type]: appointment });
    }
    this.setState({appointmentChanges: {
      title: "",
      content: "",
      startDate: moment().toISOString(),
      endDate: moment().add(30, 'minutes').toISOString(),
      timeZone: moment.tz.guess(), // 
      location:"",
      attendees:[],
      isOnlineMeeting: false,
      isAllDay:false
    }});
  }

  componentDidMount() {
    const { fetchUserCalenders, app, contacts } = this.props;
    fetchUserCalenders(app);
    this.setState({ gabContacts: contacts });
    this.setState({ contactData: contacts });
    document.addEventListener("click", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  // Handle clicks outside the input field
  handleClickOutside = (event) => {
    if (
      this.inputRef.current &&
      !this.inputRef.current.contains(event.target)
    ) {
      // Clicked outside the element, so hide it
      this.setState({ showDropdown: false });
    }
  };

  render() {
    const {
      visible,
      visibleChange,
      appointmentData,
      cancelAppointment,
      onHide,
    } = this.props;
    const {
      appointmentChanges,
      anchorEl,
      selectedOption,
      timezones,
      selectedStartDate,
      contactData,
      showDropdown,
    } = this.state;

    const displayAppointmentData = {
      ...appointmentData,
      ...appointmentChanges,
    };

    const { attendees, isOnlineMeeting, isAllDay } = appointmentChanges
    const isNewAppointment = appointmentData.id === undefined;

    const applyChanges = () =>
      this.commitAppointment(isNewAppointment ? "added" : "changed");

    const handleInputChange = (field, newValue) => {
      // Check if the field is "Invite attendees"
      if (field === "Invite attendees") {
        // Filter GAB contacts based on user input
        this.setState((prevState) => ({
          contactData: prevState.gabContacts.filter((contact) =>
            contact.displayName.toLowerCase().includes(newValue.toLowerCase())
          ),
        }));
      } else {
        // Handle other fields
        this.handleValue(field, newValue);
      }
    };

    const textEditorProps = (field) => ({
      // Set the variant of the text editor to "outlined"
      variant: "outlined",

      // Define an event handler for the "onChange" event
      onChange: (event) => {
        const newValue = event.target.value;
        // Call the handleInputChange function with the field and the new value
        handleInputChange(field, newValue);
      },

      // Set the initial value of the text editor to the value of the corresponding field
      value: displayAppointmentData[field] || appointmentChanges.field,
      // Set a placeholder text that is the field name capitalized (e.g., "Title" for "title")
      placeholder: field[0].toUpperCase() + field.slice(1),

      // Determine the CSS class based on the field type
      // If the field is "timeZone," use the "customSelect" class; otherwise, use "textField"
      className:
        field === "timeZone" ? classes.customSelect : classes.textField,
    });

    const handleClick = (event) => {
      // Set the anchor element to the event's current target, used for displaying a pop-up menu
      this.setState({ anchorEl: event.currentTarget });
    };

    const handleOptionClick = (option) => () => {
      // Set the selected option and close the pop-up menu
      this.setState({ selectedOption: option, anchorEl: null });
    };

    const pickerEditorProps = (field) => {
      return {
        // Define an event handler for when the date picker's date changes
        onChange: (date) => {
          // Call the changeAppointment function with the field and the new date
          handleInputChange(field, date.toISOString())
          // Set the selected start date in the component's state
          this.setState({ selectedStartDate: date });
        },

        // Define an error handling function, in this case, it does nothing
        onError: () => null,
        value: moment(displayAppointmentData[field]) || moment(appointmentChanges.field),
        // Apply a CSS class to the date picker
        className: classes.picker,
      };
    };

    // Define properties for the start date picker by invoking pickerEditorProps with "startDate" as the field
    const startDatePickerProps = pickerEditorProps("startDate");

    // Define properties for the end date picker by invoking pickerEditorProps with "endDate" as the field
    const endDatePickerProps = pickerEditorProps("endDate");

    // Function to cancel changes, resetting the appointmentChanges object and handling visibility changes
    const cancelChanges = () => {
      this.setState({
        appointmentChanges: {},
      });
      // Call the visibleChange and cancelAppointment functions
      visibleChange();
      cancelAppointment();
    };

    // Function to handle a switch event, toggling the isAllDay state, pickerSize, and changing start and end date appointments
    const handleSwitch = () => {
      const newisAllDay = !isAllDay;
      this.handleValue("isAllDay", newisAllDay);
      pickerSize = !    displayAppointmentData["isAllDay"] || !isAllDay;
    };

    const AllDay = displayAppointmentData["isAllDay"] || isAllDay;

    // Function to handle changes in the editor content and update the "notes" field in the appointment data
    const handleEditorChange = (content, editor) => {
      this.handleValue("notes", content);
    };

    function getRandomColor() {
      // Generate a random color in hexadecimal format
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    const toolbar =
      `undo redo | formatselect | bold italic underline strikethrough link unlink image
     | alignleft aligncenter alignright | 'bullist numlist' | outdent indent |
       table | removeformat | code ` +
      "fontselect fontsizeselect | forecolor backcolor | " +
      "link unlink image | table | removeformat | " +
      "subscript superscript | code | searchreplace | ";

    // Function to handle the selection of contacts
    const handleContactSelect = (contact) => {
      // Map through the email addresses of the selected contact and add them to attendees
      const updatedAttendees = contact.emailAddresses.map((data) => {
        return { emailAddress: data };
      });
    
      // Combine the existing attendees and the newly selected attendees
      const combinedAttendees = [...attendees, ...updatedAttendees];
    
      // Call the handleValue function to update the attendees property
      this.handleValue("attendees", combinedAttendees);
    
      // Close the contact dropdown by setting showDropdown to false
      this.setState({ showDropdown: false });
    };

    // Function to handle the deletion of a chip (contact)
    const handleDelete = (chipToDelete) => () => {
      this.setState((prevState) => ({
        // Remove the chip with the specified ID from the chipData array
        chipData: prevState.chipData.filter(
          (chip) => chip.id !== chipToDelete.id
        ),
      }));
    };

    // Initialize the default chip data based on the "attendees" field in displayAppointmentData
    const defaultchipData = displayAppointmentData["attendees"] || attendees;

    // Function to toggle the online meeting status
    const toggleIsOnlineMeeting  = () => {
      const newIsOnlineMeeting = !isOnlineMeeting;
      this.handleValue("isOnlineMeeting", newIsOnlineMeeting);
    };

    return (
      <Dialog open={visible} onClose={onHide} maxWidth="md" fullWidth={true}>
        <StyledDiv>
          <DialogTitle style={{ height: "70px" }} className={classes.wrapper}>
            <div className={classes.flexRow}>
              {!isNewAppointment && (
                <Button
                  variant="outlined"
                  color="primary"
                  className={classes.button}
                  onClick={() => {
                    visibleChange();
                    this.commitAppointment("deleted");
                  }}
                >
                  Delete
                </Button>
              )}
              <Button
                variant="contained"
                className={classes.button}
                style={{ marginLeft: "15px" }}
                onClick={() => {
                  visibleChange();
                  applyChanges();
                }}
              >
                {isNewAppointment ? "Create" : "Save"}
              </Button>
              {displayAppointmentData["onlineMeetingUrl"] && (
                <a
                  href={displayAppointmentData["onlineMeetingUrl"] || "#"}
                  target="_blank"
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{ marginLeft: "15px" }}
                  >
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "30px",
                      }}
                    >
                      <p
                        data-icon-name="IcFluentOfficeSkypeColor"
                        aria-hidden="true"
                      >
                        <Skypeicon />
                      </p>
                      <p>Join Skype meeting</p>
                    </span>
                  </Button>
                </a>
              )}
              <div>
                <Button
                  aria-controls="outlook-dropdown"
                  aria-haspopup="true"
                  onClick={handleClick}
                  endIcon={<KeyboardArrowDownIcon />}
                  startIcon={<CircleIcon color="primary" />}
                  color="primary"
                >
                  {selectedOption ? selectedOption : "Calender"}
                </Button>
                <Menu
                  id="outlook-dropdown"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                >
                  <MenuItem onClick={handleOptionClick("Calender")}>
                    <span className={classes.smallcircle} />
                    Calender
                  </MenuItem>
                </Menu>
              </div>
            </div>
            <IconButton
              className={classes.closeButton}
              onClick={cancelChanges}
              size="large"
            >
              <Close color="action" />
            </IconButton>
          </DialogTitle>
          <DialogContent style={{ paddingBottom: "20px" }}>
            <div className={classes.content}>
              <div className={classes.flexRow}>
                <Create className={classes.icon} color="action" />
                <TextField {...textEditorProps("title")} variant="standard" />
              </div>
              <div className={classes.flexRow}>
                <PersonAddAltIcon className={classes.icon} color="action" />
                <div style={{ width: "100%" }}>
                  <ChipsArray
                    chipData={defaultchipData}
                    handleDelete={handleDelete}
                  />
                  <TextField
                    variant="standard"
                    onClick={() => this.setState({ showDropdown: true })}
                    placeholder="Invite attendees"
                    className={classes.textField}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">Optional</InputAdornment>
                      ),
                    }}
                    ref={this.inputRef}
                  />
                </div>
                {showDropdown && (
                  <List
                    sx={{
                      width: "100%",
                      maxWidth: 300,
                      bgcolor: "background.paper",
                      height: "250px", // Set your desired height
                      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Add box shadow
                      overflowY: "scroll", // Enable vertical scroll
                      position: "absolute", // Set position to absolute
                      zIndex: 10, // Add the z-index property
                      top: 169,
                      left: 90,
                    }}
                  >
                    <ListItem>
                      <ListItemText primary="Suggested contacts" />
                    </ListItem>
                    {contactData.map((contact) => (
                      <ListItemButton
                        key={contact.id}
                        onClick={() => handleContactSelect(contact)}
                      >
                        <ListItemAvatar>
                          <Avatar
                            className={classes.avatar}
                            style={{
                              backgroundColor: getRandomColor(),
                            }}
                          >
                            {contact.displayName.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={contact.displayName}
                          secondary={contact.emailAddresses
                            ?.map((obj) => obj.address)
                            .join(", ")}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </div>
              <div className={classes.flexRow}>
                <CalendarToday className={classes.icon} color="action" />
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <div>
                    <div className={classes.flexRow}>
                      <DatePicker {...startDatePickerProps} />
                      {!AllDay && (
                        <TimePicker
                          {...startDatePickerProps}
                          ampm={false}/>
                      )}
                      <span
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          gap: "15px",
                          fontWeight: "500",
                        }}
                      >
                        <AntSwitch
                          inputProps={{ "aria-label": "ant design" }}
                          onClick={handleSwitch}
                        />
                        <span>All day</span>
                      </span>
                      {!AllDay && (
                        <div className={classes.wrapper}>
                          <label htmlFor="Timezone">
                            <LanguageIcon color="primary" />
                          </label>
                          <select
                            name="Timezone"
                            id="Timezone"
                            style={{ width: "160px", color: "grey" }}
                            {...textEditorProps("timeZone")}
                          >
                            <option value={moment.tz.guess()}>
                              {moment.tz.guess()}
                            </option>
                            {timezones &&
                              timezones.map((timezone, index) => (
                                <option
                                  key={index}
                                  value={timezone}
                                  style={{ color: "black" }}
                                >
                                  {timezone}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}
                    </div>
                    <div className={classes.flexRow}>
                      <DatePicker
                        {...endDatePickerProps}
                        minDate={selectedStartDate}
                      />
                      {!AllDay && (
                        <TimePicker
                          {...endDatePickerProps}
                          ampm={false}
                        />
                      )}
                      <div className={classes.wrapper}>
                        <label htmlFor="Repeat">
                          <RepeatIcon color="primary" />
                        </label>
                        <select
                          name="Repeat"
                          id="Repeat"
                          className={classes.customSelect}
                        >
                          {[
                            "Don't repeat",
                            "Daily",
                            "Weekly",
                            "Monthly",
                            "Yearly",
                            "Custom",
                          ].map((x, index) => (
                            <option
                              value={x}
                              key={index}
                              style={{ color: "black" }}
                            >
                              {x}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </LocalizationProvider>
              </div>
              <div className={classes.flexRow}>
                <LocationOn className={classes.icon} color="action" />
                <TextField
                  {...textEditorProps("location")}
                  variant="standard"
                  InputProps={{
                    endAdornment: (
                      <Tooltip
                        title="This will be turn on automatically once you add an attende"
                        arrow
                        placement="top"
                      >
                        <InputAdornment
                          position="end"
                          style={{ display: "flex", gap: "10px" }}
                        >
                          <AntSwitch
                            inputProps={{ "aria-label": "ant design" }}
                            onClick={toggleIsOnlineMeeting}
                          />
                          <i
                            data-icon-name="IcFluentOfficeSkypeColor"
                            aria-hidden="true"
                          >
                            <Skypeicon />
                          </i>
                          <p className="ms-Label wj3t5 root-473">
                            Skype meeting
                          </p>
                        </InputAdornment>
                      </Tooltip>
                    ),
                  }}
                />
              </div>
              <div className={classes.flexRow}>
                <Notes className={classes.icon} color="action" />
                <div>
                  <Editor
                    tinymceScriptSrc={
                      process.env.PUBLIC_URL + "/tinymce/tinymce.min.js"
                    }
                    value={displayAppointmentData["notes"] || appointmentChanges.notes}
                    init={{
                      menubar: false,
                      readonly: true,
                      toolbar,
                      plugins: ["wordcount"],
                      width: 760,
                      height: 350, // Doesn't work on its own. The .tox-tinymce class has been overwritten as well
                    }}
                    onEditorChange={handleEditorChange}
                  />
                </div>
              </div>
            </div>
          </DialogContent>
        </StyledDiv>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    contacts: state.contacts.contacts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserCalenders: async (props) =>
      await dispatch(fetchContactsData(props)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppointmentFormContainerBasic);

const ChipListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

export function ChipsArray({ chipData, handleDelete }) {
  return (
    <Paper
      sx={{
        display: "flex",
        flexWrap: "wrap",
        listStyle: "none",
        p: 0,
        m: 0,
        border: "none",
      }}
      component="ul"
    >
      {chipData?.map((data, index) => {
        let icon;

        if (data.label === "React") {
          icon = <TagFacesIcon />;
        }

        return (
          <ChipListItem key={index}>
            <Chip
              icon={icon}
              label={data.emailAddress.address}
              onDelete={
                data.emailAddress.address === "React"
                  ? undefined
                  : handleDelete(index)
              }
            />
          </ChipListItem>
        );
      })}
    </Paper>
  );
}
