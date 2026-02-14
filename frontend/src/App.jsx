/** Libraries */
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/** Components */
import SecureEnvironment from "./components/secure-environment/secure-environment";

/** Main Export */
const App = () => {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
        <SecureEnvironment />
      </div>
    </>
  );
};

export default App;