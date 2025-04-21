import { BrowserRouter } from "react-router-dom";

import CustomRouter from "./Router/CustomRouter";
import { Toaster } from "react-hot-toast";
function App() {
  return (
    <BrowserRouter>
      <CustomRouter />
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
