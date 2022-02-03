import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import AuthGuard from "@comp/AuthGuard";
import ACLGuard from "@comp/ACLGuard";
import BlogLayout from "./components/blog/BlogLayout";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import DocsLayout from "./components/docs/DocsLayout";
import GuestGuard from "./components/GuestGuard";
import LoadingScreen from "./components/LoadingScreen";

// new
import BaseLayout from "@comp/board/BaseLayout";

let dashboard = {},
  docs = {},
  blog = {};

const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

// Browse pages
if (process.env.NODE_ENV === "development") {
  // Blog pages

  const BlogPostCreate = Loadable(
    lazy(() => import("./pages/blog/BlogPostCreate"))
  );
  const BlogPostDetails = Loadable(
    lazy(() => import("./pages/blog/BlogPostDetails"))
  );
  const BlogPostList = Loadable(
    lazy(() => import("./pages/blog/BlogPostList"))
  );

  // Dashboard pages

  const Account = Loadable(lazy(() => import("./pages/dashboard/Account")));
  const Analytics = Loadable(lazy(() => import("./pages/dashboard/Analytics")));
  const Calendar = Loadable(lazy(() => import("./pages/dashboard/Calendar")));
  const Chat = Loadable(lazy(() => import("./pages/dashboard/Chat")));
  const CustomerDetails = Loadable(
    lazy(() => import("./pages/dashboard/CustomerDetails"))
  );
  const CustomerEdit = Loadable(
    lazy(() => import("./pages/dashboard/CustomerEdit"))
  );
  const CustomerList = Loadable(
    lazy(() => import("./pages/dashboard/CustomerList"))
  );
  const Finance = Loadable(lazy(() => import("./pages/dashboard/Finance")));
  const InvoiceDetails = Loadable(
    lazy(() => import("./pages/dashboard/InvoiceDetails"))
  );
  const InvoiceList = Loadable(
    lazy(() => import("./pages/dashboard/InvoiceList"))
  );
  const Kanban = Loadable(lazy(() => import("./pages/dashboard/Kanban")));
  const Mail = Loadable(lazy(() => import("./pages/dashboard/Mail")));
  const OrderDetails = Loadable(
    lazy(() => import("./pages/dashboard/OrderDetails"))
  );
  const OrderList = Loadable(lazy(() => import("./pages/dashboard/OrderList")));
  const Overview = Loadable(lazy(() => import("./pages/dashboard/Overview")));
  const ProductCreate = Loadable(
    lazy(() => import("./pages/dashboard/ProductCreate"))
  );
  const ProductList = Loadable(
    lazy(() => import("./pages/dashboard/ProductList"))
  );

  // Docs pages

  const Docs = Loadable(lazy(() => import("./pages/Docs")));

  // Projects pages

  const ProjectBrowse = Loadable(
    lazy(() => import("./pages/dashboard/ProjectBrowse"))
  );
  const ProjectCreate = Loadable(
    lazy(() => import("./pages/dashboard/ProjectCreate"))
  );
  const ProjectDetails = Loadable(
    lazy(() => import("./pages/dashboard/ProjectDetails"))
  );

  // Social pages

  const SocialFeed = Loadable(
    lazy(() => import("./pages/dashboard/SocialFeed"))
  );
  const SocialProfile = Loadable(
    lazy(() => import("./pages/dashboard/SocialProfile"))
  );

  dashboard = {
    path: "dashboard",
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "/",
        element: <Overview />,
      },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "analytics",
        element: <Analytics />,
      },
      {
        path: "calendar",
        element: <Calendar />,
      },
      {
        path: "chat",
        children: [
          {
            path: "/",
            element: <Chat />,
          },
          {
            path: "new",
            element: <Chat />,
          },
          {
            path: ":threadKey",
            element: <Chat />,
          },
        ],
      },
      {
        path: "customers",
        children: [
          {
            path: "/",
            element: <CustomerList />,
          },
          {
            path: ":customerId",
            element: <CustomerDetails />,
          },
          {
            path: ":customerId/edit",
            element: <CustomerEdit />,
          },
        ],
      },
      {
        path: "invoices",
        children: [
          {
            path: "/",
            element: <InvoiceList />,
          },
          {
            path: ":invoiceId",
            element: <InvoiceDetails />,
          },
        ],
      },
      {
        path: "kanban",
        element: <Kanban />,
      },
      {
        path: "mail",
        children: [
          {
            path: "/",
            element: <Navigate to="/dashboard/mail/all" replace />,
          },
          {
            path: "label/:customLabel",
            element: <Mail />,
          },
          {
            path: "label/:customLabel/:emailId",
            element: <Mail />,
          },
          {
            path: ":systemLabel",
            element: <Mail />,
          },
          {
            path: ":systemLabel/:emailId",
            element: <Mail />,
          },
        ],
      },
      {
        path: "orders",
        children: [
          {
            path: "/",
            element: <OrderList />,
          },
          {
            path: ":orderId",
            element: <OrderDetails />,
          },
        ],
      },
      {
        path: "finance",
        element: <Finance />,
      },
      {
        path: "products",
        children: [
          {
            path: "/",
            element: <ProductList />,
          },
          {
            path: "new",
            element: <ProductCreate />,
          },
        ],
      },
      {
        path: "projects",
        children: [
          {
            path: "browse",
            element: <ProjectBrowse />,
          },
          {
            path: "new",
            element: <ProjectCreate />,
          },
          {
            path: ":projectId",
            element: <ProjectDetails />,
          },
        ],
      },
      {
        path: "social",
        children: [
          {
            path: "feed",
            element: <SocialFeed />,
          },
          {
            path: "profile",
            element: <SocialProfile />,
          },
        ],
      },
    ],
  };

  blog = {
    path: "blog",
    element: <BlogLayout />,
    children: [
      {
        path: "/",
        element: <BlogPostList />,
      },
      {
        path: "new",
        element: <BlogPostCreate />,
      },
      {
        path: ":postId",
        element: <BlogPostDetails />,
      },
    ],
  };

  docs = {
    path: "docs",
    element: <DocsLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/docs/overview/welcome" replace />,
      },
      {
        path: "*",
        element: <Docs />,
      },
    ],
  };
}

// Authentication pages

const Login = Loadable(lazy(() => import("@pages/authentication/Login")));
const PasswordRecovery = Loadable(
  lazy(() => import("@pages/authentication/PasswordRecovery"))
);
const PasswordReset = Loadable(
  lazy(() => import("@pages/authentication/PasswordReset"))
);
const Register = Loadable(lazy(() => import("@pages/authentication/Register")));
const VerifyCode = Loadable(
  lazy(() => import("@pages/authentication/VerifyCode"))
);

// Error pages

const AuthorizationRequired = Loadable(
  lazy(() => import("@pages/AuthorizationRequired"))
);
const NotFound = Loadable(lazy(() => import("@pages/NotFound")));
const ServerError = Loadable(lazy(() => import("@pages/ServerError")));

// New pages
const HomeNew = Loadable(lazy(() => import("@pages/home/Home")));

// users
const UsersPage = Loadable(lazy(() => import("@pages/users")));
const UsersPageInactive = Loadable(lazy(() => import("@pages/users/inactive")));
const UserItemIdPage = Loadable(lazy(() => import("@pages/users/:id")));
const UserItemIdUpdatePage = Loadable(
  lazy(() => import("@pages/users/:update"))
);

const UserRoleUpdatePage = Loadable(
  lazy(() => import("@pages/users/roles/:update"))
);

const UserCreatePage = Loadable(lazy(() => import("@pages/users/:create")));

// banks
const BanksPage = Loadable(lazy(() => import("@pages/banks")));
const BanksPageIdPage = Loadable(lazy(() => import("@pages/banks/:id")));
const BanksCreatePage = Loadable(lazy(() => import("@pages/banks/:create")));
const BanksPageIdUpdatePage = Loadable(
  lazy(() => import("@pages/banks/:update"))
);

// transactions
const TransactionIndexPage = Loadable(
  lazy(() => import("@pages/transactions"))
);

const TransactionItemIdPage = Loadable(
  lazy(() => import("@pages/transactions/:id"))
);

const TransactionLogsPage = Loadable(
  lazy(() => import("@pages/transactions/:id_logs"))
);

// gateways
const GatewayIndexPage = Loadable(lazy(() => import("@pages/gateway")));
const GatewayCreatePage = Loadable(
  lazy(() => import("@pages/gateway/:create"))
);
const GatewayIdPage = Loadable(lazy(() => import("@pages/gateway/:id")));
const GatewayIdPagePage = Loadable(
  lazy(() => import("@pages/gateway/:update"))
);

// bin
const BinIndexPage = Loadable(lazy(() => import("@pages/bin/index")));

// transaction flow
const TransactionFlowList = Loadable(lazy(() => import("@pages/flow")));
const TransactionFlowCreate = Loadable(
  lazy(() => import("@pages/flow/:create"))
);
const TransactionFlowUpdate = Loadable(lazy(() => import("@pages/flow/:id")));

// cascading

// const CascadingRulesList = Loadable(
//   lazy(() => import("@pages/cascading/rules"))
// );

const CascadingModelList = Loadable(
  lazy(() => import("@pages/cascading/models"))
);
const CascadingModelId = Loadable(
  lazy(() => import("@pages/cascading/models/:id"))
);

const CascadingCreate = Loadable(
  lazy(() => import("@pages/cascading/models/:create"))
);

// merchant
const MerchantList = Loadable(lazy(() => import("@pages/merchant/index")));
const MerchantModelId = Loadable(lazy(() => import("@pages/merchant/:id")));
const MerchantModelIdUpdate = Loadable(
  lazy(() => import("@pages/merchant/:update"))
);

const MerchantModelCreate = Loadable(
  lazy(() => import("@pages/merchant/:create"))
);

const MerchantTokenUpdate = Loadable(
  lazy(() => import("@pages/merchant/_token/:update"))
);

const MerchantDepositUpdate = Loadable(
  lazy(() => import("@pages/merchant/_deposit/:update"))
);

// terminals

const TerminalsList = Loadable(lazy(() => import("@pages/terminals")));
const TerminalsModelId = Loadable(lazy(() => import("@pages/terminals/:id")));
const TerminalsCreate = Loadable(
  lazy(() => import("@pages/terminals/:create"))
);

const TerminalsItemUpdate = Loadable(
  lazy(() => import("@pages/terminals/:update"))
);

const TerminalsUpdateToken = Loadable(
  lazy(() => import("@pages/terminals/_token/:update"))
);

// roles

const RolesList = Loadable(lazy(() => import("@pages/roles/index")));
const CreateRole = Loadable(lazy(() => import("@pages/roles/:create")));
const UpdateRole = Loadable(lazy(() => import("@pages/roles/:update")));

// Codes
const CodesList = Loadable(lazy(() => import("./pages/codes/index")));
const CodesItemId = Loadable(lazy(() => import("./pages/codes/:id")));
const CodesItemUpdate = Loadable(lazy(() => import("./pages/codes/:update")));
const CodesItemСreate = Loadable(lazy(() => import("./pages/codes/:create")));

// city24
const City24TransactionsIndex = Loadable(
  lazy(() => import("./pages/city24/transactions/index"))
);
const City24TransactionsId = Loadable(
  lazy(() => import("./pages/city24/transactions/:id"))
);

// Reconciliation
const ReconciliationList = Loadable(
  lazy(() => import("./pages/reconciliation/index"))
);

// export list
const ExportIndexPage = Loadable(lazy(() => import("@pages/export/index")));

const routes = [
  process.env.NODE_ENV === "development" ? docs : {},
  process.env.NODE_ENV === "development" ? dashboard : {},
  process.env.NODE_ENV === "development" ? blog : {},

  {
    path: "authentication",
    children: [
      {
        path: "login",
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },
      {
        path: "password/reset/:token",
        element: (
          <GuestGuard>
            <PasswordReset />
          </GuestGuard>
        ),
      },
      {
        path: "password/reset",
        element: (
          <GuestGuard>
            <PasswordRecovery />
          </GuestGuard>
        ),
      },
      {
        path: "register/:token",
        element: (
          <GuestGuard>
            <Register />
          </GuestGuard>
        ),
      },
      {
        path: "verify-code",
        element: (
          <GuestGuard>
            <VerifyCode />
          </GuestGuard>
        ),
      },
    ],
  },

  {
    path: "*",
    element: (
      <AuthGuard>
        <BaseLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: "/",
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },

      {
        path: "board",
        element: <HomeNew />,
      },

      {
        path: "users",
        children: [
          {
            path: "/",
            element: (
              <ACLGuard can={"read"}>
                <UsersPage />
              </ACLGuard>
            ),
          },
          {
            path: "/inactive",
            element: (
              <ACLGuard can={"read"}>
                <UsersPageInactive />
              </ACLGuard>
            ),
          },
          {
            path: "create",
            element: (
              <ACLGuard can={"create"}>
                <UserCreatePage />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id",
            element: (
              <ACLGuard can={"details"}>
                <UserItemIdPage />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id/update",
            element: (
              <ACLGuard can={"update"}>
                <UserItemIdUpdatePage />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id/role",
            element: (
              <ACLGuard can={"update"}>
                <UserRoleUpdatePage />
              </ACLGuard>
            ),
          },
        ],
      },

      {
        path: "roles",
        children: [
          {
            element: (
              <ACLGuard can={"read"}>
                <RolesList />
              </ACLGuard>
            ),
          },
          {
            path: "create",
            element: (
              <ACLGuard can={"create"}>
                <CreateRole />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id",
            element: (
              <ACLGuard can={"details"}>
                <UpdateRole />
              </ACLGuard>
            ),
          },
        ],
      },

      {
        path: "codes",
        children: [
          {
            path: "/",
            element: (
              <ACLGuard can={"read"}>
                <CodesList />
              </ACLGuard>
            ),
          },
          {
            path: "create",
            element: (
              <ACLGuard can={"create"}>
                <CodesItemСreate />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id",
            element: (
              <ACLGuard can={"details"}>
                <CodesItemId />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id/update",
            element: (
              <ACLGuard can={"update"}>
                <CodesItemUpdate />
              </ACLGuard>
            ),
          },
        ],
      },

      {
        path: "city24",
        children: [
          {
            path: "transactions",
            children: [
              {
                path: "",
                element: <City24TransactionsIndex />,
              },
              {
                path: "id/:id",
                element: <City24TransactionsId />,
              },
            ],
          },
          {
            path: "merchants",
            children: [
              {
                path: "",
                element: <City24TransactionsIndex />,
              },
            ],
          },
          {
            path: "terminals",
            children: [
              {
                path: "",
                element: <City24TransactionsIndex />,
              },
            ],
          },
          {
            path: "keys",
            children: [
              {
                path: "",
                element: <City24TransactionsIndex />,
              },
            ],
          },
        ],
      },

      {
        path: "banks",
        children: [
          {
            path: "/",
            element: (
              <ACLGuard can={"read"}>
                <BanksPage />
              </ACLGuard>
            ),
          },
          {
            path: "create",
            element: (
              <ACLGuard can={"create"}>
                <BanksCreatePage />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id",
            element: (
              <ACLGuard can={"details"}>
                <BanksPageIdPage />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id/update",
            element: (
              <ACLGuard can={"update"}>
                <BanksPageIdUpdatePage />
              </ACLGuard>
            ),
          },
        ],
      },

      {
        path: "flows",
        children: [
          {
            path: "/",
            element: (
              <ACLGuard can={"read"}>
                <TransactionFlowList />
              </ACLGuard>
            ),
          },
          {
            path: "/create",
            element: (
              <ACLGuard can={"create"}>
                <TransactionFlowCreate />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id",
            element: (
              <ACLGuard can={"read"}>
                <TransactionFlowUpdate />
              </ACLGuard>
            ),
          },
        ],
      },

      {
        path: "gateways",
        children: [
          {
            path: "/",
            element: (
              <ACLGuard can={"read"}>
                <GatewayIndexPage />
              </ACLGuard>
            ),
          },
          {
            path: "create",
            element: (
              <ACLGuard can={"create"}>
                <GatewayCreatePage />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id",
            element: (
              <ACLGuard can={"details"}>
                <GatewayIdPage />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id/update",
            element: (
              <ACLGuard can={"update"}>
                <GatewayIdPagePage />
              </ACLGuard>
            ),
          },
          // {
          //   path: "token/:id",
          //   element: <BanksDepositUpdatePage />,
          // },
        ],
      },

      {
        path: "terminals",
        children: [
          {
            path: "/",
            element: (
              <ACLGuard can={"read"}>
                <TerminalsList />
              </ACLGuard>
            ),
          },
          {
            path: "create",
            element: (
              <ACLGuard can={"create"}>
                <TerminalsCreate />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id",
            element: (
              <ACLGuard can={"details"}>
                <TerminalsModelId />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id/update",
            element: (
              <ACLGuard can={"update"}>
                <TerminalsItemUpdate />
              </ACLGuard>
            ),
          },
          {
            path: "token/:id",
            element: (
              <ACLGuard can={"getTerminalKey"}>
                <TerminalsUpdateToken />
              </ACLGuard>
            ),
          },
        ],
      },

      {
        path: "cascading",
        children: [
          {
            path: "/",
            element: (
              <ACLGuard can={"read"}>
                <CascadingModelList />
              </ACLGuard>
            ),
          },
          {
            path: "create",
            element: (
              <ACLGuard can={"create"}>
                <CascadingCreate />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id",
            element: (
              <ACLGuard can={"details"}>
                <CascadingModelId />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id/update",
            element: (
              <ACLGuard can={"update"}>
                <GatewayIdPagePage />
              </ACLGuard>
            ),
          },
        ],
      },

      {
        path: "merchants",
        children: [
          {
            path: "/",
            element: (
              <ACLGuard can={"read"}>
                <MerchantList />
              </ACLGuard>
            ),
          },
          {
            path: "create",
            element: (
              <ACLGuard can={"create"}>
                <MerchantModelCreate />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id",
            element: (
              <ACLGuard can={"details"}>
                <MerchantModelId />
              </ACLGuard>
            ),
          },
          {
            path: "id/:id/update",
            element: (
              <ACLGuard can={"update"}>
                <MerchantModelIdUpdate />
              </ACLGuard>
            ),
          },

          {
            path: "token/:id",
            element: (
              <ACLGuard can={"getMerchantKey"}>
                <MerchantTokenUpdate />
              </ACLGuard>
            ),
          },
          {
            path: "deposit/:id",
            element: (
              <ACLGuard can={"depositLimitEdit"}>
                <MerchantDepositUpdate />
              </ACLGuard>
            ),
          },
        ],
      },

      {
        path: "bin",
        children: [
          {
            path: "/",
            element: (
              <ACLGuard can={"read"}>
                <BinIndexPage />
              </ACLGuard>
            ),
          },
        ],
      },

      {
        path: "transactions",
        children: [
          {
            path: "/",
            element: (
              <ACLGuard can={"read"}>
                <TransactionIndexPage />
              </ACLGuard>
            ),
          },
          {
            path: ":id",
            element: (
              <ACLGuard can={"details"}>
                <TransactionItemIdPage />
              </ACLGuard>
            ),
          },
          {
            path: ":id/logs",
            element: (
              <ACLGuard can={"getTransactionLogs"}>
                <TransactionLogsPage />
              </ACLGuard>
            ),
          },
        ],
      },

      {
        path: "export",
        children: [
          {
            path: "/",
            element: (
              <ACLGuard can={"read"}>
                <ExportIndexPage />
              </ACLGuard>
            ),
          },
        ],
      },

      {
        path: "reconciliation",
        children: [
          {
            path: "/",
            element: (
              <ACLGuard can={"read"}>
                <ReconciliationList />
              </ACLGuard>
            ),
          },
        ],
      },

      {
        path: "401",
        element: <AuthorizationRequired />,
      },
      {
        path: "404",
        element: <NotFound />,
      },
      {
        path: "500",
        element: <ServerError />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
