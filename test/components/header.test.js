import { renderComponent , expect } from '../test-helper';
import Header from '../../src/components/header';

describe('Header' , () => {
  let component;

  beforeEach(() => {
    component = renderComponent(Header);
  });

  it('component renders', () => {
    expect(component).to.exist;
  });
  
  it('has the correct logo', () => {
    expect(component).to.contain('Code Pad');
  });
});