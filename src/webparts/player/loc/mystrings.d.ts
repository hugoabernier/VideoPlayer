declare interface IPlayerWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  VideoUrlFieldLabel: string;
}

declare module 'PlayerWebPartStrings' {
  const strings: IPlayerWebPartStrings;
  export = strings;
}
