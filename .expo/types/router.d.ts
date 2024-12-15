/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string | object = string> {
      hrefInputParams: { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/protected`; params?: Router.UnknownInputParams; } | { pathname: `/protected/itinerary`; params?: Router.UnknownInputParams; } | { pathname: `/protected/members`; params?: Router.UnknownInputParams; } | { pathname: `/protected/profile`; params?: Router.UnknownInputParams; } | { pathname: `/protected/support`; params?: Router.UnknownInputParams; };
      hrefOutputParams: { pathname: Router.RelativePathString, params?: Router.UnknownOutputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownOutputParams } | { pathname: `/`; params?: Router.UnknownOutputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownOutputParams; } | { pathname: `/protected`; params?: Router.UnknownOutputParams; } | { pathname: `/protected/itinerary`; params?: Router.UnknownOutputParams; } | { pathname: `/protected/members`; params?: Router.UnknownOutputParams; } | { pathname: `/protected/profile`; params?: Router.UnknownOutputParams; } | { pathname: `/protected/support`; params?: Router.UnknownOutputParams; };
      href: Router.RelativePathString | Router.ExternalPathString | `/${`?${string}` | `#${string}` | ''}` | `/_sitemap${`?${string}` | `#${string}` | ''}` | `/protected${`?${string}` | `#${string}` | ''}` | `/protected/itinerary${`?${string}` | `#${string}` | ''}` | `/protected/members${`?${string}` | `#${string}` | ''}` | `/protected/profile${`?${string}` | `#${string}` | ''}` | `/protected/support${`?${string}` | `#${string}` | ''}` | { pathname: Router.RelativePathString, params?: Router.UnknownInputParams } | { pathname: Router.ExternalPathString, params?: Router.UnknownInputParams } | { pathname: `/`; params?: Router.UnknownInputParams; } | { pathname: `/_sitemap`; params?: Router.UnknownInputParams; } | { pathname: `/protected`; params?: Router.UnknownInputParams; } | { pathname: `/protected/itinerary`; params?: Router.UnknownInputParams; } | { pathname: `/protected/members`; params?: Router.UnknownInputParams; } | { pathname: `/protected/profile`; params?: Router.UnknownInputParams; } | { pathname: `/protected/support`; params?: Router.UnknownInputParams; };
    }
  }
}
