import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Nav from "./components/Layout/Nav";
import Footer from "./components/Layout/Footer";
import RequireAuth from "./components/Layout/RequireAuth";
import RequireAdmin from "./components/Layout/RequireAdmin";
import ErrorBoundary from "./components/Layout/ErrorBoundary";

const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));
const Tasks = lazy(() => import("./pages/Tasks"));
const TaskDetails = lazy(() => import("./pages/TaskDetails"));
const Teams = lazy(() => import("./pages/Teams"));
const Profile = lazy(() => import("./pages/Profile"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));

const RouteFallback = () => (
  <p className="mx-auto w-full max-w-3xl px-4 py-10 text-center text-[15px] text-[var(--text)] sm:px-6">
    Loading...
  </p>
);

function App() {
  return (
    <>
      <Nav />
      <main className="flex min-h-0 w-full flex-1 flex-col">
        <ErrorBoundary>
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <Admin />
                  </RequireAdmin>
                }
              />
              <Route
                path="/teams"
                element={
                  <RequireAuth>
                    <Teams />
                  </RequireAuth>
                }
              />
              <Route path="/tasks" element={<Navigate to="/teams" replace />} />
              <Route
                path="/tasks/team/:teamId"
                element={
                  <RequireAuth>
                    <Tasks />
                  </RequireAuth>
                }
              />
              <Route
                path="/tasks/user/:userId"
                element={
                  <RequireAuth>
                    <Tasks />
                  </RequireAuth>
                }
              />
              <Route
                path="/tasks/:id"
                element={
                  <RequireAuth>
                    <TaskDetails />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <RequireAuth>
                    <Profile />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          className:
            "!bg-[var(--bg)] !text-[var(--text-h)] !border !border-[var(--border)] !shadow-[var(--shadow)] !text-[14px]",
          duration: 3500,
        }}
      />
    </>
  );
}

export default App;
