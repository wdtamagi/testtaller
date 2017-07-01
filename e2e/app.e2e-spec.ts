import { TesttallerPage } from './app.po';

describe('testtaller App', () => {
  let page: TesttallerPage;

  beforeEach(() => {
    page = new TesttallerPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
