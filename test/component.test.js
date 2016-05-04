import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

// Component to Test
import Header from '../src/containers/header';
const props = {
  connectionStatus: false
};

describe('Header Component', () => {

  it('should render correctly', () => {
    var header = TestUtils.renderIntoDocument(<Header {...props} />);
    expect(header).toExist();
  });

}); 