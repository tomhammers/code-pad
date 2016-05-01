import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateFontSize, updateTheme } from '../actions/index';
import { Input, FormControl, FormGroup, ControlLabel, DropdownButton, MenuItem, Grid, Col, Row } from 'react-bootstrap';

class Settings extends Component {
    
    activeLine() {
        console.log("dfghiju");
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
                <option defaultValue={14} key={i} value={size}>{size}</option>
            );
        });
    }

    populateThemeOptions() {
        return this.props.availableEditorOptions.theme.map((theme, i) => {
            return (
                <option key={i} value={theme.name}>{theme.name}</option>
            );
        });
    }


    render() {
        let style = {
            outer: {
                color: "black"
            }
        }

        return (
            <Grid style={style.color}>
                <Row>
                    <Col lg={6}>
                        <form style={style.color}>
                            <select onChange={this.updateFontSize.bind(this) }>
                                {this.populateFontSizeOptions() }
                            </select>
                            <select onChange={this.updateTheme.bind(this) }>
                                {this.populateThemeOptions() }
                            </select>
                            <input
                                type="checkbox"
                                onChange={this.activeLine}
                                />
                        </form>
                    </Col>
                </Row>
            </Grid>


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
    return bindActionCreators({ updateFontSize: updateFontSize, updateTheme: updateTheme }, dispatch)
}
// produces a container (is aware of state)
export default connect(mapStateToProps, mapDispatchToProps)(Settings);