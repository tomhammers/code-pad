import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleActiveLine, toggleGutter, updateFontSize, updateTheme } from '../actions/index';
import { Checkbox, FormControl, FormGroup, ControlLabel, DropdownButton, MenuItem, Panel, Col, Row } from 'react-bootstrap';

class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeLineChecked: true,
            gutterChecked: true
        }
        this.activeLine = this.activeLine.bind(this);
        this.gutter = this.gutter.bind(this);
    }

    activeLine() {
        let checked = this.state.activeLineChecked === true ? false : true;
        this.setState({
            activeLineChecked: checked
        });
        this.props.toggleActiveLine(checked);
    }

    gutter() {
        let checked = this.state.gutterChecked === true ? false : true;
        this.setState({
            gutterChecked: checked
        });
        this.props.toggleGutter(checked);
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
        return this.props.availableEditorOptions.fontSize.map((size, i) => {
            return (
                <option  key={i} value={size}>{size}</option>
            );
        });
    }


    render() {
        let style = {
            editorSettings: {
                marginLeft: "5px",
                marginTop: "5px",
                fontSize: "12px"
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
                            <FormControl defaultValue={14} onChange={this.updateFontSize.bind(this) } componentClass="select">
                                {this.populateFontSizeOptions() }
                            </FormControl>

                        </FormGroup>
                        <Checkbox checked={this.state.activeLineChecked} onChange={this.activeLine}>
                            Highlight Active Line
                        </Checkbox>
                        <Checkbox checked={this.state.gutterChecked} onChange={this.gutter}>
                            Show Gutter
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
        toggleGutter: toggleGutter,
        updateFontSize: updateFontSize,
        updateTheme: updateTheme
    }, dispatch)
}
// produces a container (is aware of state)
export default connect(mapStateToProps, mapDispatchToProps)(Settings);