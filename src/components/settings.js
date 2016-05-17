import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toggleActiveLine, toggleGutter, updateFontSize, updateTheme } from '../actions/index';
import { Checkbox, FormControl, FormGroup, ControlLabel, DropdownButton, MenuItem, Panel, Col, Row, Tabs, Tab, Nav, NavItem } from 'react-bootstrap';

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
    /**
     * handle uer changing settings, will set off action creators to update editor
     */
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
    /**
     * TODO: not yet fully implemented, due to loading pad themes on pad component
     */
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
            outer: {
                color: "black",
                margin: '10px'
            }
        }

        return (
            <Tab.Container style={style.outer} id="left-tabs-example" defaultActiveKey="first">
                <Panel>
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

            </Tab.Container>
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
    return bindActionCreators({
        toggleActiveLine: toggleActiveLine,
        toggleGutter: toggleGutter,
        updateFontSize: updateFontSize,
        updateTheme: updateTheme
    }, dispatch)
}
// produces a container (is aware of state)
export default connect(mapStateToProps, mapDispatchToProps)(Settings);
