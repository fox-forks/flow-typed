// @flow
import * as React from 'react';
import {
  createBrowserRouter,
  createHashRouter,
  createMemoryRouter,
  createRoutesFromChildren,
  RouterProvider,
  BrowserRouter,
  HashRouter,
  Link,
  MemoryRouter,
  NavLink,
  matchPath,
  matchRoutes,
  renderMatches,
  redirect,
  withRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  ScrollRestoration,
  useHistory,
  useLocation,
  useNavigate,
  useOutlet,
  useOutletContext,
  useParams,
  useRouteMatch,
  useMatches,
  useRouteError,
  useLoaderData,
  useSearchParams,
  UNSAFE_NavigationContext,
  UNSAFE_LocationContext,
  UNSAFE_RouteContext,
} from 'react-router-dom';
import type {
  AgnosticRouteMatch,
  RouteObject,
  Location,
  ContextRouter,
  Match,
  StaticRouterContext,
  RouterHistory,
  Params,
  RemixRouter,
  RouterNavigateOptions,
  Navigator,
  NavigationContextObject,
  LocationContextObject,
  RouteContextObject,
} from 'react-router-dom';
import { it, test, describe } from 'flow-typed-test';

describe('react-router-dom', () => {
  // ----------------------------------/
  // `@remix-run/router`               /
  // ----------------------------------/

  describe('matchPath', () => {
    it('works', () => {
      const match: null | Match = matchPath('/the/pathname', {
        path: '/the/:dynamicId',
        exact: true,
        strict: false,
      });
      const match2: null | Match = matchPath('/the/pathname', {
        path: ['/the/:dynamicId', '/the/otherRoute'],
        exact: true,
        strict: false,
      });
      const match3: null | Match = matchPath(
        '/the/pathname',
        '/the/:dynamicId'
      );
      const match4: null | Match = matchPath('/the/pathname', [
        '/the/:dynamicId',
        '/the/otherRoute',
      ]);
      const match5: null | Match = matchPath('/the/pathname');
    });

    it('raises an error if passed invalid argument', () => {
      // $FlowExpectedError[incompatible-call] - pathname argument is required
      matchPath();

      // $FlowExpectedError[incompatible-type] - matchPath returns Match or null
      const matchError: string = matchPath('/the/pathname', {
        path: 'the/:dynamicId',
      });
    });
  });

  describe('matchRoutes', () => {
    it('works', () => {
      matchRoutes([], '/');

      matchRoutes<RouteObject>([], '/');

      const contentWithEmptyMatches: Array<
        AgnosticRouteMatch<string, RouteObject>
      > | null = matchRoutes([], '/');

      const contentWithMatches: Array<
        AgnosticRouteMatch<string, RouteObject>
      > | null = matchRoutes(
        [
          {
            id: 'bar',
            path: 'bar',
            index: false,
            children: [],
          },
        ],
        '/'
      );
    });

    it('raises an error with invalid arguments', () => {
      // $FlowExpectedError[incompatible-call]
      matchRoutes(5, '/');
    });

    it('can be used with `createRoutesFromChildren`', () => {
      const element = (
        <Route path="/">
          <Route index />
        </Route>
      );
      // FlowExpectedError[incompatible-call]
      const routeMatches: Array<
        AgnosticRouteMatch<string, RouteObject>
      > | null = matchRoutes<RouteObject>(
        createRoutesFromChildren(element),
        '/'
      );
    });
  });

  // ----------------------------------/
  // `react-router`                    /
  // ----------------------------------/

  describe('renderMatches', () => {
    it('works', () => {
      renderMatches([]);

      renderMatches<RouteObject>([]);

      const contentWithEmptyMatches: null | React$Element<any> = renderMatches(
        []
      );

      const contentWithMatches: null | React$Element<any> = renderMatches([
        {
          params: {},
          pathname: '/',
          pathnameBase: '',
          route: {
            index: false,
            children: [
              {
                index: true,
              },
            ],
          },
        },
      ]);
    });

    it('raises', () => {
      // $FlowExpectedError[incompatible-call]
      renderMatches(5);

      // $FlowExpectedError[incompatible-type]
      const contentWithEmptyMatches: number = renderMatches([]);
    });
  });

  describe('redirect', () => {
    it('works', () => {
      (redirect('test'): Response);
      redirect('test', 1);
      declare var options: ResponseOptions;
      redirect('test', options);
    });

    it('fails', () => {
      // $FlowExpectedError[incompatible-call]
      redirect();
      // $FlowExpectedError[incompatible-call]
      redirect('test', 'fail');
      // $FlowExpectedError[extra-arg]
      redirect('test', 1, 'fail');
      // $FlowExpectedError[incompatible-cast]
      (redirect('test'): string);
    });
  });

  describe('Navigate', () => {
    it('works', () => {
      <Navigate to="/login" />;

      <Navigate to="/new-path" replace />;

      <Navigate
        to={{
          pathname: '/courses',
          search: '?sort=name',
          hash: '#the-hash',
          state: { fromDashboard: true },
        }}
        state={{}}
      />;
    });

    it('raises error if passed incorrect props', () => {
      // $FlowExpectedError[prop-missing] - to prop is required
      <Navigate />;

      // $FlowExpectedError[incompatible-type] - to prop must be a string or LocationShape
      <Navigate to={[]} />;

      // $FlowExpectedError[prop-missing] - unexpected prop xxx
      <Navigate to="/x" xxx="1" />;
    });
  });

  describe('Outlet', () => {
    it('can be used alone', () => {
      <Outlet />;
    });

    it('can be passed anything', () => {
      const [count, setCount] = React.useState(0);
      <Outlet context={[count, setCount]} />;
    });
  });

  describe('Route', () => {
    it('works', () => {
      const Component = () => <div>Hi!</div>;
      <Route path="/login" />;

      <Route path="/login" element={<Component />} />;

      <Route index caseSensitive />;

      <Route>
        <div>Hi!</div>
      </Route>;

      <Route
        caseSensitive
        path="/login"
        id="login"
        loader={({ request, params }) => {
          const myRequest: Request = request;
          const myParams: Params<string> = params;
        }}
        action={() => {}}
        hasErrorBoundary
        shouldRevalidate={() => false}
        handle={{ breadcrumb: 'login' }}
        index={false}
        element={<Component />}
        errorElement={<Component />}
      />;
    });

    it('raises error if passed incorrect props', () => {
      // $FlowExpectedError[incompatible-type] - prop must be a string
      <Route path={123} />;

      // $FlowExpectedError[incompatible-type] - unexpected prop xxx
      <Route xxx="1" />;

      // $FlowExpectedError[incompatible-type]
      <Route action={(invalid: number) => true} />;

      // $FlowExpectedError[incompatible-type]
      <Route caseSensitive="123" />;

      <Route
        loader={({ request, params, ...loaderArgs }) => {
          // $FlowExpectedError[incompatible-type]
          const myRequest: string = request;

          // $FlowExpectedError[incompatible-type]
          const myParams: string = params;

          // $FlowExpectedError[prop-missing]
          const missing: any = loaderArgs.missing;

          return false;
        }}
      />;

      // $FlowExpectedError[incompatible-type]
      <Route hasErrorBoundary="invalid" />;

      // $FlowExpectedError[incompatible-type]
      <Route
        shouldRevalidate={({ currentUrl }: {| currentUrl: number |}) => true}
      />;

      // $FlowExpectedError[incompatible-type]
      <Route index="invalid" />;
    });
  });

  describe('Routes', () => {
    it('works', () => {
      const Component = () => <div>Hi!</div>;
      <Routes>
        <Route path="/login" element={<Component />} />
      </Routes>;
    });
  });

  it('useHistory', () => {
    const history: RouterHistory = useHistory();
  });

  it('useLocation', () => {
    const location: Location = useLocation();
  });

  it('useOutlet', () => {
    useOutlet();

    const Component = () => <div>Hi!</div>;

    useOutlet<typeof Component>();

    // $FlowExpectedError[extra-arg]
    useOutlet('');
  });

  it('useOutletContext', () => {
    const [count, setCount] = useOutletContext();
    const increment = () => setCount((c) => c + 1);
    <button onClick={increment}>{count}</button>;

    // $FlowExpectedError[extra-arg]
    useOutletContext('');

    const t1: number = useOutletContext<number>();

    type Tuple = [string, (foo: string) => void];

    const [foo, setFoo] = useOutletContext<Tuple>();
    (foo: string);
    (setFoo: (foo: string) => void);

    // $FlowExpectedError[incompatible-type]
    const t2: string = useOutletContext<Tuple>();
  });

  it('useParams', () => {
    const params: { [key: string]: ?string, ... } = useParams();
  });

  it('useParams with generic', () => {
    type ParamsType = {|
      +slug: string,
    |};

    const params: ParamsType = useParams<ParamsType>();
  });

  it('useRouteMatch', () => {
    const match: Match = useRouteMatch();
    const matchPath: Match = useRouteMatch('/path');
    const matchArray: Match = useRouteMatch(['/path', '/the/otherRoute']);

    const matchObject: Match = useRouteMatch({
      path: '/path',
      strict: true,
      sensitive: true,
      exact: true,
    });

    // $FlowExpectedError[incompatible-call]
    const matchObject2: Match = useRouteMatch({
      sensitive: 'foo',
    });
  });

  it('useMatches', () => {
    type Matches = Array<{|
      id: string,
      pathname: string,
      params: Params<string>,
      data: mixed,
      handle: {|
        custom: string,
      |},
    |}>;
    const matches: Matches = useMatches();

    type MatchesWithHandle = Array<{|
      id: string,
      pathname: string,
      params: Params<string>,
      data: mixed,
      handle: {|
        custom: string,
      |},
    |}>;
    const matchesWithHandle: MatchesWithHandle = useMatches<
      mixed,
      {|
        custom: string,
      |}
    >();

    type InvalidMatchesMissingPathname = Array<{|
      id: string,
      params: Params<string>,
      data: mixed,
      handle: mixed,
    |}>;
    const matchesMissingPathname: InvalidMatchesMissingPathname =
      // $FlowExpectedError[prop-missing]
      useMatches();

    type InvalidMatchesIcompatibleParams = Array<{|
      id: string,
      pathname: string,
      params: Params<number>,
      data: mixed,
      handle: mixed,
    |}>;

    const matchesIncompatibleParams: InvalidMatchesIcompatibleParams =
      // $FlowExpectedError[incompatible-type-arg]
      useMatches();
  });

  describe('useNavigate', () => {
    it('works', () => {
      const navigate = useNavigate();

      navigate('../success');
      navigate('../success', { replace: true });
      navigate(-1);
    });

    it('raises errors if used incorrectly', () => {
      // $FlowExpectedError[extra-arg] takes no args
      const navigate = useNavigate('test');

      // $FlowExpectedError[incompatible-call]
      navigate(true);
    });
  });

  describe('useRouteError', () => {
    // It is described as any in the type def, but unknown the actual library
    (useRouteError(): string);

    // $FlowExpectedError[extra-arg] it takes no args
    useRouteError('test');
  });

  describe('useLoaderData', () => {
    // It is described as any in the type def, but unknown the actual library
    (useLoaderData(): string);

    // $FlowExpectedError[extra-arg] it takes no args
    useLoaderData('test');
  });

  describe('useSearchParams', () => {
    const [searchParams, setSearchParams] = useSearchParams();

    describe('setSearchParams', () => {
      it('accepts a new object', () => {
        setSearchParams({
          a: 'b',
        });

        // $FlowExpectedError[incompatible-call]
        setSearchParams({
          a: 1,
        });
      });

      it('accepts a function', () => {
        setSearchParams((pSearchParams) => {
          return {
            a: 'b',
          };
        });
      });

      it('cannot be passed anything', () => {
        // $FlowExpectedError[incompatible-call]
        setSearchParams(123);
      });
    });
  });

  describe('MemoryRouter', () => {
    it('works', () => {
      () => (
        <>
          <MemoryRouter />
          <MemoryRouter
            basename="foo"
            initialEntries={['/bar']}
            initialIndex={1}
          >
            <div>Hello</div>
          </MemoryRouter>
        </>
      );
    });

    it('catches usage errors', () => {
      () => (
        <>
          {/* $FlowExpectedError[incompatible-type] */}
          <MemoryRouter initialEntries="bar" />
          {/* $FlowExpectedError[prop-missing] */}
          <MemoryRouter foo="bar" />
        </>
      );
    });
  });

  describe('createMemoryRouter', () => {
    it('works', () => {
      const router: RemixRouter = createMemoryRouter([]);
      createMemoryRouter([{ path: '/', element: <div>Hello world</div> }], {
        basename: '/foo',
        future: {
          v7_normalizeFormMethod: false,
        },
        hydrationData: {
          loaderData: { a: 1 },
          actionData: { a: 1 },
          errors: null,
        },
        initialEntries: ['/'],
        initialIndex: 0,
      });
    });

    it('catch usage errors', () => {
      // $FlowExpectedError[incompatible-call]
      // $FlowExpectedError[prop-missing]
      createMemoryRouter('/', {
        invalid: {},
      });
    });
  });

  // ----------------------------------/
  // `react-router-dom`                /
  // ----------------------------------/

  describe('RouterProvider use case', () => {
    const router = createBrowserRouter([
      {
        path: '/',
        element: <div>Hello world!</div>,
      },
    ]);

    it('works', () => {
      () => <RouterProvider router={router} />;

      () => (
        <RouterProvider
          router={createMemoryRouter([
            {
              path: '/',
              element: <div>Hello world!</div>,
            },
          ])}
        />
      );
    });

    test('future', () => {
      () => (
        <RouterProvider
          router={router}
          // $FlowExpectedError[prop-missing]
          future={{}}
        />
      );

      () => (
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true,
          }}
        />
      );

      () => (
        <RouterProvider
          router={router}
          future={{
            // $FlowExpectedError[incompatible-type]
            v7_startTransition: '123',
          }}
        />
      );

      () => (
        // $FlowExpectedError[prop-missing]
        <RouterProvider
          router={router}
          // $FlowExpectedError[prop-missing]
          future={{
            foo: 'bar',
          }}
        />
      );
    });

    it('catches createBrowserRouter error usages', () => {
      // $FlowExpectedError[incompatible-call]
      createBrowserRouter();
      // $FlowExpectedError[incompatible-cast]
      (createBrowserRouter([]): string);
      // $FlowExpectedError[incompatible-call]
      createBrowserRouter('test');

      createBrowserRouter([], {});
      createBrowserRouter([], {
        basename: 'test',
        future: {
          v7_normalizeFormMethod: true,
        },
        hydrationData: {
          loaderData: { a: 1 },
          actionData: { a: 1 },
          errors: null,
        },
        window: {},
      });

      createBrowserRouter([], {
        // $FlowExpectedError[incompatible-call]
        basename: 1,
      });
      // $FlowExpectedError[prop-missing]
      createBrowserRouter([], {
        // $FlowExpectedError[prop-missing]
        future: {
          a: 1,
        },
      });
      createBrowserRouter([], {
        hydrationData: {
          // $FlowExpectedError[incompatible-call]
          loaderData: null,
        },
      });
    });

    it('catches createHashRouter error usages', () => {
      // $FlowExpectedError[incompatible-call]
      createHashRouter();
      // $FlowExpectedError[incompatible-cast]
      (createHashRouter([]): string);
      // $FlowExpectedError[incompatible-call]
      createHashRouter('test');

      createHashRouter([], {});
      createHashRouter([], {
        basename: 'test',
        future: {
          v7_normalizeFormMethod: true,
        },
        hydrationData: {
          loaderData: { a: 1 },
          actionData: { a: 1 },
          errors: null,
        },
        window: {},
      });

      createHashRouter([], {
        // $FlowExpectedError[incompatible-call]
        basename: 1,
      });
      // $FlowExpectedError[prop-missing]
      createHashRouter([], {
        // $FlowExpectedError[prop-missing]
        future: {
          a: 1,
        },
      });
      createHashRouter([], {
        hydrationData: {
          // $FlowExpectedError[incompatible-call]
          loaderData: null,
        },
      });
    });
  });

  describe('BrowserRouter', () => {
    it('works', () => {
      <BrowserRouter>
        <div />
      </BrowserRouter>;

      <BrowserRouter
        basename="/base"
        forceRefresh
        getUserConfirmation={(message, callback) => {}}
        keyLength={3}
      >
        <div />
      </BrowserRouter>;
    });

    it('raises error if passed incorrect props', () => {
      // $FlowExpectedError[incompatible-type] - basename must be a string
      <BrowserRouter basename={{}} />;
    });
  });

  describe('HashRouter', () => {
    it('works', () => {
      <HashRouter>
        <div />
      </HashRouter>;

      <HashRouter
        basename="/base"
        getUserConfirmation={(message, callback) => {}}
        hashType="noslash"
      >
        <div />
      </HashRouter>;
    });

    it('raises error if passed incorrect props', () => {
      // $FlowExpectedError[incompatible-type] - hashType must be a string
      <HashRouter hashType="magic" />;
    });
  });

  describe('<Link />', () => {
    it('works', () => {
      <Link to="/about">About</Link>;

      <Link replace to="/about">
        About
      </Link>;

      <Link
        to={{
          pathname: '/courses',
          search: '?sort=name',
          hash: '#the-hash',
          state: { fromDashboard: true },
        }}
      >
        About
      </Link>;

      () => {
        const location = useLocation();
        return <Link to={location}>Location</Link>;
      };
    });

    it('allows attributes of <a> element', () => {
      <Link
        to="/about"
        download
        hreflang="de"
        ping="https://www.example.com"
        referrerpolicy="no-referrer"
        target="_self"
        type="foo"
        onClick={() => {}}
      >
        About
      </Link>;
    });

    it('raises error if passed incorrect props', () => {
      // $FlowExpectedError[prop-missing] - to prop is required
      <Link />;

      // $FlowExpectedError[incompatible-type] - to prop must be a string or LocationShape
      <Link to={[]} />;
    });
  });

  describe('<NavLink />', () => {
    it('works', () => {
      <NavLink to="/about">About</NavLink>;

      <NavLink
        to="/about"
        className="link"
        style={{ color: 'blue' }}
        strict
        end
      >
        About
      </NavLink>;

      <NavLink
        to={{
          pathname: '/courses',
          search: '?sort=name',
          hash: '#the-hash',
          state: { fromDashboard: true },
        }}
      >
        About
      </NavLink>;
    });

    it('allows attributes of <a> element', () => {
      <NavLink
        to="/about"
        download
        hreflang="de"
        ping="https://www.example.com"
        referrerpolicy="no-referrer"
        target="_self"
        type="foo"
        onClick={() => {}}
      >
        About
      </NavLink>;
    });

    it('raises error if passed incorrect props', () => {
      // $FlowExpectedError[prop-missing] - to prop is required
      <NavLink />;

      // $FlowExpectedError[incompatible-type] - to prop must be a string or LocationShape
      <NavLink to={[]} />;

      // activeClassName, activeStyle, end, isActive have been dropped unfortunately props cannot be strict so no errors can be expected
      <NavLink
        to="/about"
        activeClassName="active"
        activeStyle={{ color: 'red' }}
        isActive={(match: any, location: any) => true}
        end
      >
        About
      </NavLink>;
    });

    it('supports enhanced className & style props', () => {
      <NavLink
        to="/about"
        className={({ isActive, isPending }) =>
          isPending ? 'pending' : isActive ? 'active' : undefined
        }
        style={({ isActive, isPending }) =>
          isPending
            ? { color: 'red' }
            : isActive
            ? { color: 'blue' }
            : undefined
        }
      >
        About
      </NavLink>;

      // $FlowExpectedError[incompatible-type]
      <NavLink to="/about" className={{ invalid: '' }} />;
      // $FlowExpectedError[incompatible-type]
      <NavLink to="/about" style={3} />;
    });

    it('supports render prop as children', () => {
      <NavLink to="/about">
        {({ isActive, isPending }) => (
          <span className={isActive ? 'active' : ''}>Tasks</span>
        )}
      </NavLink>;
    });
  });

  // ----------------------------------/
  // WIP (or unofficial)               /
  // ----------------------------------/

  describe('withRouter', () => {
    type Props = {
      history: RouterHistory,
      location: Location,
      match: Match,
      staticContext: StaticRouterContext,
      s: string,
      ...
    };
    describe('Stateless Functional Components', () => {
      it('passes if the component is passed required props', () => {
        const Comp = ({
          history,
          location,
          match,
          staticContext,
          s,
        }: Props) => <div />;
        const WrappedComp = withRouter(Comp);
        <WrappedComp s="" />;

        const ChainedHOC = withRouter(WrappedComp);
        <ChainedHOC s="" />;
      });

      it('errors if the component is not passed correct props', () => {
        const Comp = ({
          history,
          location,
          match,
          staticContext,
          s,
        }: Props) => <div />;
        const WrappedComp = withRouter(Comp);
        // $FlowExpectedError[prop-missing] - missing prop "s"
        <WrappedComp />;
        // $FlowExpectedError[incompatible-type] - wrong type
        <WrappedComp s={1} />;

        const ChainedHOC = withRouter(WrappedComp);
        // $FlowExpectedError[prop-missing] - missing prop "s"
        <ChainedHOC />;
        // $FlowExpectedError[incompatible-type] - wrong type
        <ChainedHOC s={1} />;
      });

      it('errors if trying to access a prop that withRouter does not supply', () => {
        const Comp = ({
          histry,
          s,
        }: {
          histry: RouterHistory,
          s: string,
          ...
        }) => <div />;
        const WrappedComp = withRouter(Comp);
      });

      it('errors if using block() incorrectly', () => {
        const Comp = ({ history }: { history: RouterHistory, ... }) => {
          // $FlowExpectedError[incompatible-call] - wrong param
          history.block(false);

          // These are valid
          history.block('Are you sure you want to leave this page?');
          history.block((location, action) => {
            return 'Are you sure you want to leave this page?';
          });

          return <div />;
        };
        const WrappedComp = withRouter(Comp);
      });
    });

    describe('Class Components', () => {
      it('passes if the component is passed required props', () => {
        class Comp extends React.Component<Props> {
          render(): React$Element<'div'> {
            return <div />;
          }
        }
        const WrappedComp = withRouter(Comp);
        <WrappedComp s="" />;

        const ChainedHOC = withRouter(WrappedComp);
        <ChainedHOC s="" />;
      });

      it('errors if the component is not passed the correct props', () => {
        class Comp extends React.Component<Props> {
          render(): React$Element<'div'> {
            return <div />;
          }
        }
        const WrappedComp = withRouter(Comp);
        // $FlowExpectedError[prop-missing] - missing prop "s"
        <WrappedComp />;
        // $FlowExpectedError[incompatible-type] - wrong type
        <WrappedComp s={1} />;

        const ChainedHOC = withRouter(WrappedComp);
        // $FlowExpectedError[prop-missing] - missing prop "s"
        <ChainedHOC />;
        // $FlowExpectedError[incompatible-type] - wrong type
        <ChainedHOC s={1} />;
      });

      it('passes if a required prop is handled by defaultProps', () => {
        type OwnProps = {|
          s: string,
        |};

        class Comp extends React.Component<Props> {
          static defaultProps: OwnProps = {
            s: 'defaultS',
          };
          render(): React$Element<'div'> {
            return <div />;
          }
        }
        const WrappedComp = withRouter(Comp);
        <WrappedComp />;
        <WrappedComp s="" />;

        const ChainedHOC = withRouter(WrappedComp);
        <ChainedHOC />;
        <ChainedHOC s="" />;
      });

      it('errors if a required prop that has a defaultProp is passed the wrong type', () => {
        type OwnProps = {|
          s: string,
        |};

        class Comp extends React.Component<Props> {
          static defaultProps: OwnProps = {
            s: 'defaultS',
          };
          render(): React$Element<'div'> {
            return <div />;
          }
        }
        const WrappedComp = withRouter(Comp);
        // $FlowExpectedError[incompatible-type] - wrong type
        <WrappedComp s={123} />;

        const ChainedHOC = withRouter(WrappedComp);
        // $FlowExpectedError[incompatible-type] - wrong type
        <ChainedHOC s={123} />;
      });
    });
  });

  describe('UNSAFE_ contexts', () => {
    test('UNSAFE_NavigationContext', () => {
      const Comp = ({ context }: {| context: NavigationContextObject |}) => {
        return (
          <UNSAFE_NavigationContext.Provider value={context}>
            <div></div>
          </UNSAFE_NavigationContext.Provider>
        );
      };

      declare var nav: Navigator;

      const A = (<Comp
        context={{
          basename: 'test',
          navigator: nav,
          static: false,
        }}
      />);
      const B = (<Comp
        // $FlowExpectedError[prop-missing]
        context={{}}
      />);
      const C = (<Comp
        context={{
          // $FlowExpectedError[incompatible-type]
          basename: 123,
          navigator: nav,
          static: false,
        }}
      />);
      const D = (<Comp
        context={{
          basename: 'test',
          // $FlowExpectedError[incompatible-type]
          navigator: 'test',
          static: false,
        }}
      />);
      const E = (<Comp
        context={{
          basename: 'test',
          navigator: nav,
          // $FlowExpectedError[incompatible-type]
          static: 123,
        }}
      />);
    });

    test('UNSAFE_LocationContext', () => {
      const Comp = ({ context }: {| context: LocationContextObject |}) => {
        return (
          <UNSAFE_LocationContext.Provider value={context}>
            <div></div>
          </UNSAFE_LocationContext.Provider>
        );
      };

      declare var location: Location;

      const A = (<Comp
        context={{
          location: location,
          navigationType: 'PUSH',
        }}
      />);
      const B = (<Comp
        // $FlowExpectedError[prop-missing]
        context={{}}
      />);
      const C = (<Comp
        context={{
          // $FlowExpectedError[incompatible-type]
          location: 'test',
          navigationType: 'PUSH',
        }}
      />);
      const D = (<Comp
        context={{
          location: location,
          // $FlowExpectedError[incompatible-type]
          navigationType: 'PASS',
        }}
      />);
    });

    test('UNSAFE_RouteContext', () => {
      const Comp = ({ context }: {| context: RouteContextObject |}) => {
        return (
          <UNSAFE_RouteContext.Provider value={context}>
            <div></div>
          </UNSAFE_RouteContext.Provider>
        );
      };

      const A = (<Comp
        context={{
          outlet: <div></div>,
          matches: [],
          isDataRoute: true,
        }}
      />);
      const B = (<Comp
        // $FlowExpectedError[prop-missing]
        context={{}}
      />);
      const C = (<Comp
        context={{
          // $FlowExpectedError[incompatible-type]
          outlet: HTMLElement,
          matches: [],
          isDataRoute: true,
        }}
      />);
      const D = (<Comp
        context={{
          outlet: <div></div>,
          // $FlowExpectedError[incompatible-type]
          matches: 'test',
          isDataRoute: true,
        }}
      />);
      const E = (<Comp
        context={{
          outlet: <div></div>,
          matches: ['test'],
          // $FlowExpectedError[incompatible-type]
          isDataRoute: 'test',
        }}
      />);
    });
  });

  describe('RemixRouter', () => {
    it('works', () => {
      const router: RemixRouter = {
        navigate: (to, opts) => {
          if (opts) {
            (opts: RouterNavigateOptions);
          }
          return Promise.resolve();
        },
      };
    });

    it('errors if incorrectly instanciated', () => {
      // $FlowExpectedError[prop-missing]
      const router: RemixRouter = {
        foo: '',
      };
    });
  });

  describe('ScrollRestoration', () => {
    test('default', () => {
      const Comp = () => (
        <ScrollRestoration />
      );
    });

    test('getKey', () => {
      const Comp = () => (
        <ScrollRestoration
          getKey={(location, matches) => {
            // default behavior
            return location.key;
          }}
        />
      );

      const FailProp = () => (
        <ScrollRestoration
          // $FlowExpectedError[incompatible-type]
          getKey="test"
        />
      );

      const FailReturn = () => (
        <ScrollRestoration
          getKey={(location, matches) => {
            // $FlowExpectedError[incompatible-type]
            return 1;
          }}
        />
      );

      const Pathname = () => (
        <ScrollRestoration
          getKey={(location, matches) => {
            return location.pathname;
          }}
        />
      );

      const Complex = () => (
        <ScrollRestoration
          getKey={(location, matches) => {
            const paths = ["/home", "/notifications"];
            return paths.includes(location.pathname)
              ? // home and notifications restore by pathname
                location.pathname
              : // everything else by location like the browser
                location.key;
          }}
        />
      )
    });

    test('storageKey', () => {
      const Comp = () => (
        <ScrollRestoration
          storageKey="test"
        />
      );

      const Fail = () => (
        <ScrollRestoration
          // $FlowExpectedError[incompatible-type]
          storageKey={1}
        />
      );
    });
  });
});
