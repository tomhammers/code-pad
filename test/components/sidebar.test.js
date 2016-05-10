import { renderComponent , expect } from '../test-helper';
import SideBar from '../../src/components/sidebar';

describe('SideBar' , () => {
  let component;

  beforeEach(() => {
    component = renderComponent(SideBar);
  });

  it('component renders', () => {
    expect(component).to.exist;
  });

});