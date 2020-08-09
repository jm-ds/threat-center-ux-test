import {ThemeSharedModule } from './theme-shared.module';

describe('SharedModule', () => {
  let themeSharedModule: ThemeSharedModule;

  beforeEach(() => {
    themeSharedModule = new ThemeSharedModule();
  });

  it('should create an instance', () => {
    expect(themeSharedModule).toBeTruthy();
  });
});
