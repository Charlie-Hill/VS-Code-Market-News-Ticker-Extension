interface INewsHeadline {
    Date: string;
    Country: string;
    AggregateSource: NewsSources;
    Source?: string;
    Headline: string;
    StoryLink: string;
}

interface INewsCategory {
  GroupName: string;
  Headlines: Array<INewsHeadline>;
}


export enum NewsSources {
  NewsNow = 'newsnow.co.uk',
  ADVFN = 'ADVFN'
}

export { INewsHeadline, INewsCategory }
