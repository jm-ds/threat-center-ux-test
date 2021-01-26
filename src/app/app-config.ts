export class NextConfig {
  public static config = {
    layout: 'horizontal', // vertical, horizontal
    subLayout: 'horizontal-2', // horizontal-2
    collapseMenu: false,
    layoutType: 'dark', // menu-dark, menu-light, dark
    headerBackColor: 'header-default', // header-default, header-blue, header-red, header-purple, header-info, header-dark
    navBrandColor: 'brand-default', // brand-default, brand-blue, brand-red, brand-purple, brand-info, brand-dark
    rtlLayout: false,
    navFixedLayout: true,
    headerFixedLayout: true,
    boxLayout: false,
    successToasterTime: 5, // Visibilities of Suceess toaster after scan completed
    errorToasterTime: 5, // Visibilities of Suceess toaster after scan completed
    closePopup: 25, // Visibilities of scan bottom right panel after all scan completed,
    delaySeconds: 1500 //pause(delay) between scan requests while scaning project
    defaultItemPerPage:25
  };
}
