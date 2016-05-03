import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleActiveLine, updateFontSize, updateTheme } from '../actions/index';
import { Checkbox, FormControl, FormGroup, ControlLabel, DropdownButton, MenuItem, Panel, Col, Row } from 'react-bootstrap';

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeLineChecked: true
        }
        this.activeLine = this.activeLine.bind(this);
    }

    activeLine() {
        let checked = this.state.activeLineChecked === true ? false : true;
        this.setState({
            activeLineChecked: checked
        });
        this.props.toggleActiveLine(checked);     
    }

    updateFontSize(event) {
        this.props.updateFontSize(event.target.value);
    }

    updateTheme(event) {
        this.props.availableEditorOptions.theme.map((option) => {
            if (event.target.value === option.name) {
                //this.props.updateTheme(option.link);
            }
        });
    }

    populateFontSizeOptions() {
        let selected = "";
        return this.props.availableEditorOptions.fontSize.map((size, i) => {
            if (size === 14) { selected = "selected" } else { selected = "" }
            return (
                <option selected={selected} key={i} value={size}>{size}</option>
            );
        });
    }


    render() {
        let style = {
            editorSettings : {
              marginLeft: "5px",
              marginTop: "5px"
            },
            labels: {
            },
            outer: {
                color: "black"
            }
        }

        return (
            <Row>
                <Col style={style.editorSettings} lg={4}>
                    <Panel header="Editor Settings">

                        <FormGroup inline controlId="formControlsSelect">
                            Font Size
                            <FormControl onChange={this.updateFontSize.bind(this) } componentClass="select">
                                {this.populateFontSizeOptions() }
                            </FormControl>

                        </FormGroup>
                        <Checkbox checked={this.state.activeLineChecked} onChange={this.activeLine}>
                            Highlight Active Line
                        </Checkbox>
                    </Panel>
                </Col>
            </Row>
        );
    }
}

// applications state to props, look in reducer/index; files will be found there
function mapStateToProps(state) {
    return {
        availableEditorOptions: state.availableEditorOptions
    };
}
/**
 * Anything returned from this function will end up as props
 * dispatch takes all actions and makes sure they are passed to all the reducers
 */
function mapDispatchToProps(dispatch) {
    // when selectBook is called, result should be passed to reducers
    return bindActionCreators({ 
        toggleActiveLine: toggleActiveLine,
        updateFontSize: updateFontSize, 
        updateTheme: updateTheme 
    }, dispatch)
}
// produces a container (is aware of state)
export default connect(mapStateToProps, mapDispatchToProps)(Settings);